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
   * Upload a file to ImageKit
   * @param filePath - Absolute path to the file on disk
   * @param fileName - Desired file name in ImageKit
   * @param folder - Optional folder path (e.g. /users/avatars)
   */
  async upload(filePath: string, fileName: string, folder: string = "/") {
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));
    form.append("fileName", fileName);
    form.append("folder", folder);
    form.append("useUniqueFileName", "true"); // optional

    try {
      const response = await axios.post(IMAGEKIT_URL, form, {
        headers: {
          ...form.getHeaders(),
          Authorization: authHeader,
        },
      });

      return response.data; // returns { url, fileId, name, etc. }
    } catch (err: any) {
      console.error("ImageKit upload error:", err.response?.data || err.message);
      throw new Error("ImageKit upload failed");
    }
  },
};
