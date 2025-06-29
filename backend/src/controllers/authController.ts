import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '../services/userService';
import { connectDB } from '../services/db';
import User from '../models/User';
import { imagekitService } from '../services/imagekitService';


const jwtSecret = process.env.JWT_SECRET as string;

export const signup = async (req: Request, res: Response) => {
  let uploadedProfilePicUrl: string | null = null; // Initialize to null; will store ImageKit URL if upload succeeds

  try {
    // Establish database connection
    await connectDB();

    // Destructure user input from the request body.
    // Multer processes form data and attaches file info to `req.file`.
    const {
      name,
      email,
      password,
      specialty,
      institution,
      location,
      accountType
    } = req.body;

    // `req.file` will contain the uploaded file details if Multer is used,
    // and `req.file.buffer` will hold the file content if `memoryStorage` is configured.
    const profilePic = req.file; 

    // Validate if all required text fields are provided
    if (!name || !email || !password || !specialty || !institution || !location || !accountType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if a user with the provided email already exists to prevent duplicates
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // --- Profile Picture Upload to ImageKit ---
    // Check if a profile picture was provided and if it contains a buffer (meaning it's in memory)
    if (profilePic && profilePic.buffer) {
      try {
        // Call the ImageKit service to upload the buffer
        const uploadResult = await imagekitService.upload(
          profilePic.buffer,         // The file content as a Buffer
          profilePic.originalname,   // The original filename for ImageKit
          "/profile-pics"            // Specify a folder in ImageKit for profile pictures
        );
        // Store the URL returned by ImageKit
        uploadedProfilePicUrl = uploadResult.url; 
        console.log("Profile picture uploaded to ImageKit. URL:", uploadedProfilePicUrl);
      } catch (uploadError: any) {
        // If ImageKit upload fails, log the error but proceed with `null` for the profilePic URL.
        // You can modify this behavior (e.g., return a 500 error) if a profile pic is mandatory.
        console.error("Failed to upload profile picture to ImageKit:", uploadError.message);
        uploadedProfilePicUrl = null; // Ensure it's null if upload failed
      }
    }
    // Note: No explicit file cleanup (like `fs.unlink`) is needed here
    // because Multer's `memoryStorage` does not write temporary files to disk.
    // --- End Profile Picture Upload ---

    // Hash the user's password securely before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user record in the database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      specialty,
      institution,
      location,
      accountType,
      profilePic: uploadedProfilePicUrl, // Store the ImageKit URL or null in the database
    });

    // Ensure JWT_SECRET is available for token generation
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables. Please set it.');
    }

    // Generate access and refresh tokens for the newly signed-up user
    const accessToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '3h' }); // Access token expires in 3 hours
    const refreshToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' }); // Refresh token expires in 7 days

    // Set HTTP-only cookies for tokens.
    // `httpOnly: true` prevents client-side JavaScript access.
    // `sameSite: 'strict'` helps mitigate CSRF attacks.
    // `secure: true` ensures cookies are only sent over HTTPS (recommended for production).
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production', // Set to true only in production over HTTPS
      maxAge: 3 * 60 * 60 * 1000, // 3 hours in milliseconds
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production', // Set to true only in production over HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // Send a success response back to the client
    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profilePic: user.profilePic // Include the profile pic URL in the response
      }
    });

  } catch (error: any) {
    // Log and send an error response if any part of the signup process fails
    console.error("Signup failed:", error);
    res.status(500).json({
      message: error?.message || "Signup failed",
      error: error?.toString?.() || error, // Provide more details for debugging
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

    res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 3 * 60 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

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
  res.clearCookie("accessToken", { httpOnly: true, sameSite: "strict" });
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
    data: null,
  });
};