import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

// Environment variables
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY!;
const IMAGEKIT_URL = "https://upload.imagekit.io/api/v1/files/upload";

// Encode private key to Basic Auth
const authHeader = "Basic " + Buffer.from(IMAGEKIT_PRIVATE_KEY + ":").toString("base64");

export const imagekitService = {
  /**
   * Upload a file to ImageKit from a Buffer.
   * This function takes the file content as a Buffer, its original name, and an optional folder.
   *
   * @param fileBuffer - The file content as a Node.js Buffer (e.g., `req.file.buffer` from Multer).
   * @param fileName - The desired file name in ImageKit (e.g., `req.file.originalname`).
   * @param folder - Optional folder path in ImageKit (e.g., "/users/avatars"). Defaults to "/".
   * @returns A promise that resolves with the ImageKit upload response data (contains `url`, `fileId`, etc.).
   * @throws Error if the ImageKit upload fails.
   */
  async upload(fileBuffer: Buffer, fileName: string, folder: string = "/") {
    const form = new FormData();
    // Append the buffer directly. The third argument is crucial for FormData
    // to correctly interpret the buffer as a file with a given filename and MIME type.
    // Multer's file object usually contains mimetype, but fileName is sufficient for FormData.
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
      // Re-throw a custom error to be handled by the calling function (e.g., `signup`)
      throw new Error("ImageKit upload failed");
    }
  },
};