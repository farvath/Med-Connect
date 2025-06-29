import { Request, Response } from 'express';
import User, { IUser } from '../models/User'; // Import IUser interface
import { imagekitService } from '../services/imagekitService'; // Ensure this path is correct
import { Document } from 'mongoose'; // Import Document for type extension

// Extend Request type to include userId (from your auth middleware) and file (from multer)
interface AuthenticatedRequest extends Request {
  userId?: string;
  file?: Express.Multer.File; // Multer's file object
}

// Controller to get user details
export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId; // Assuming userId is set by an authentication middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not provided. Please log in.",
      });
    }

    // Fetch user by ID, excluding the password field for security
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user, // Return the full user object (without password)
    });
  } catch (err: any) {
    console.error("getUser error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Controller to update user details
export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = (req as any).userId;
    const updates = req.body;
    const profilePicFile = req.file;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not provided. Please log in.",
      });
    }

    const user: (IUser & Document) | null = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // --- Handle profile picture update if a new file is provided ---
    if (profilePicFile) {
      try {
        const oldFileId = user.profilePic?.fileId; // Get the fileId of the existing profile pic
        const uploadResult = await imagekitService.updateProfilePic(
          oldFileId,
          profilePicFile.buffer,
          profilePicFile.originalname,
          "/user-profiles" // Specify a folder in ImageKit
        );

        // Update user's profilePic field with new ImageKit details
        user.profilePic = {
          url: uploadResult.url,
          fileId: uploadResult.fileId,
        };
        console.log("Profile picture updated successfully.");
      } catch (uploadError: any) {
        console.error("Profile picture update failed:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to update profile picture.",
          error: uploadError.message,
        });
      }
    }

    // --- Apply other field updates ---
    // Safely update allowed fields only
    if (updates.name !== undefined) user.name = updates.name;
  
    if (updates.specialty !== undefined) user.specialty = updates.specialty;
    if (updates.institution !== undefined) user.institution = updates.institution;
    if (updates.location !== undefined) user.location = updates.location;
    if (updates.headline !== undefined) user.headline = updates.headline;
    if (updates.bio !== undefined) user.bio = updates.bio;

    // Handle array updates (education, experience)
    // The frontend will send the complete updated arrays.
    // Ensure to parse JSON strings sent from FormData
    if (updates.education !== undefined && typeof updates.education === 'string') {
      try {
        user.education = JSON.parse(updates.education);
      } catch (parseErr) {
        console.error("Error parsing education array:", parseErr);
        return res.status(400).json({ success: false, message: "Invalid education data format." });
      }
    }
    if (updates.experience !== undefined && typeof updates.experience === 'string') {
      try {
        user.experience = JSON.parse(updates.experience);
      } catch (parseErr) {
        console.error("Error parsing experience array:", parseErr);
        return res.status(400).json({ success: false, message: "Invalid experience data format." });
      }
    }


    // Save the updated user document
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: user, // Return the updated user object (without password)
    });
  } catch (err: any) {
    console.error("updateUser error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

