import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '../services/userService';
import { connectDB } from '../services/db';
import User from '../models/User';
import { imagekitService } from '../services/imagekitService';


const jwtSecret = process.env.JWT_SECRET as string;

// Extend Request type for file upload (from multer)
interface AuthRequest extends Request {
  file?: Express.Multer.File;
}

export const signup = async (req: AuthRequest, res: Response) => {
  let uploadedProfilePicData: { url: string; fileId: string } | null = null; 

  try {
    // Assuming connectDB() is called elsewhere or not needed here for every request
    // await connectDB(); 

    const {
     name,
      email,
      password,
      specialty,
      institution,
      location,
      accountType
    } = req.body;

    const profilePicFile = req.file; // Access the uploaded file via req.file

    // Basic validation
    if (!name || !email || !password || !specialty || !institution || !location || !accountType) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check if user with this email already exists
    // You might have a dedicated service/function for this, e.g., getUserByEmail
    const existingUser = await User.findOne({ email }); // Using Mongoose directly
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User with this email already exists' });
    }

    // --- Handle profile picture upload ---
    if (profilePicFile && profilePicFile.buffer) {
      try {
        const uploadResult = await imagekitService.upload(
          profilePicFile.buffer, 
          profilePicFile.originalname, 
          "/profile-pics" // Specify folder in ImageKit
        );
        // Store both URL and fileId from ImageKit response
        uploadedProfilePicData = {
          url: uploadResult.url,
          fileId: uploadResult.fileId,
        };
        console.log("Profile picture uploaded to ImageKit. URL:", uploadedProfilePicData.url);
      } catch (uploadError: any) {
        console.error("Failed to upload profile picture to ImageKit:", uploadError.message);
        uploadedProfilePicData = null; // Ensure it's null if upload failed
      }
    }
 
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user record in the database with new fields
    const user = await User.create({
     name    ,
      email,
      password: hashedPassword,
      specialty,
      institution,
      location,
      accountType,
      profilePic: uploadedProfilePicData, // Store the object {url, fileId} or null
      // New fields like headline, bio, education, experience will be empty arrays/null initially
      // as they are not part of the signup form, but are optional in schema
      headline: '', // Initialize as empty string or undefined if preferred
      bio: '',
      education: [],
      experience: [],
    });

    // Ensure JWT_SECRET is available for token generation
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables. Please set it.');
    }

    // Generate access and refresh tokens
    const accessToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '3h' });
    const refreshToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });

    // Set HTTP-only cookies for tokens
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3 * 60 * 60 * 1000, // 3 hours
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send a success response back to the client
    res.status(201).json({
      success: true, // Added success flag for consistency
      message: "Signup successful",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.name,
        profilePic: user.profilePic // Include the full profilePic object
      }
    });

  } catch (error: any) {
    console.error("Signup failed:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Signup failed",
      error: error?.toString?.() || error,
    });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    await connectDB();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing email or password",
        data: null,
      });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        data: null,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        data: null,
      });
    }

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const accessToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "3h" });
    const refreshToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "7d" });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3 * 60 * 60 * 1000, // 3 hours
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        name: user.name,
        icon: user.profilePic,
        specialty: user.specialty,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Login failed",
      data: null,
    });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("accessToken", { 
    httpOnly: true, 
    sameSite: "none",
    secure: process.env.NODE_ENV === 'production'
  });
  res.clearCookie("refreshToken", { 
    httpOnly: true, 
    sameSite: "none",
    secure: process.env.NODE_ENV === 'production'
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
    data: null,
  });
};