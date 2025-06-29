import axios from "axios";
import FormData from "form-data";
// import fs from "fs"; // Not typically needed for buffer uploads in web apps directly
// import path from "path"; // Not typically needed for buffer uploads in web apps directly

// Environment variables (ensure these are set in your .env)
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY!;
const IMAGEKIT_URL = "https://upload.imagekit.io/api/v1/files/upload";
const IMAGEKIT_DELETE_URL = "https://api.imagekit.io/v1/files/"; // Base URL for deletion

// Encode private key for Basic Authentication
const authHeader = "Basic " + Buffer.from(IMAGEKIT_PRIVATE_KEY + ":").toString("base64");

export const imagekitService = {
  /**
   * Uploads a file to ImageKit from a Buffer.
   *
   * @param fileBuffer - The file content as a Node.js Buffer (e.g., `req.file.buffer` from Multer).
   * @param fileName - The desired file name in ImageKit (e.g., `req.file.originalname`).
   * @param folder - Optional folder path in ImageKit (e.g., "/users/avatars"). Defaults to "/profile-pics".
   * @returns A promise that resolves with the ImageKit upload response data (contains `url`, `fileId`, etc.).
   * @throws Error if the ImageKit upload fails.
   */
  async upload(fileBuffer: Buffer, fileName: string, folder: string = "/profile-pics") {
    const form = new FormData();
    // Append the buffer directly. The third argument is crucial for FormData
    // to correctly interpret the buffer as a file with a given filename and MIME type.
    form.append("file", fileBuffer, { filename: fileName });
    form.append("fileName", fileName);
    form.append("folder", folder);
    form.append("useUniqueFileName", "true"); // Optional: ImageKit will generate a unique filename

    try {
      const response = await axios.post(IMAGEKIT_URL, form, {
        headers: {
          ...form.getHeaders(), // Important for FormData to set 'Content-Type: multipart/form-data'
          Authorization: authHeader,
        },
      });
      return response.data; // ImageKit's API returns data like { url, fileId, name, etc. }
    } catch (err: any) {
      // Log the detailed error from ImageKit's response or the general error message
      console.error("ImageKit upload error:", err.response?.data || err.message);
      throw new Error("ImageKit upload failed");
    }
  },

  /**
   * Deletes a file from ImageKit using its fileId.
   *
   * @param fileId - The fileId of the image to delete from ImageKit.
   * @returns A promise that resolves if the deletion is successful.
   * @throws Error if the ImageKit deletion fails (e.g., network error),
   * but gracefully handles 404 (file not found) errors.
   */
  async deleteFile(fileId: string) {
    try {
      const response = await axios.delete(`${IMAGEKIT_DELETE_URL}${fileId}`, {
        headers: {
          Authorization: authHeader,
        },
      });
      return response.data; // ImageKit usually returns an empty object or success message
    } catch (err: any) {
      console.error("ImageKit delete error:", err.response?.data || err.message);
      // If the file is not found (404), we can log a warning but not throw an error,
      // as the goal is simply to ensure the old file is gone.
      if (err.response && err.response.status === 404) {
        console.warn(`ImageKit: File with ID ${fileId} not found, skipping deletion.`);
        return; // Do not throw error if file simply doesn't exist
      }
      throw new Error("ImageKit deletion failed");
    }
  },

  /**
   * Updates an existing profile picture by optionally deleting the old one and uploading a new one.
   *
   * @param oldFileId - The fileId of the old image to be deleted. Can be undefined if no old picture exists.
   * @param fileBuffer - The buffer of the new image to be uploaded.
   * @param fileName - The desired file name for the new image.
   * @param folder - Optional folder path in ImageKit for the new image. Defaults to "/profile-picss".
   * @returns A promise that resolves with the new ImageKit upload response data.
   * @throws Error if the new upload fails.
   */
  async updateProfilePic(oldFileId: string | undefined, fileBuffer: Buffer, fileName: string, folder: string = "/profile-pics") {
    // Attempt to delete the old picture if an oldFileId is provided
    if (oldFileId) {
      try {
        await this.deleteFile(oldFileId);
        console.log(`Old profile picture (fileId: ${oldFileId}) deleted successfully.`);
      } catch (error) {
        console.error(`Failed to delete old profile picture (fileId: ${oldFileId}). Proceeding with new upload.`);
        // We choose to proceed with the new upload even if old deletion fails for robustness.
      }
    }

    // Upload the new picture
    return this.upload(fileBuffer, fileName, folder);
  },
};
