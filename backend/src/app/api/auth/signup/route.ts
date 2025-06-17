import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../services/db";
import User from "../../../../models/User";
// @ts-ignore
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { imagekitService } from "../../../../services/imagekitService";
import formidable from "formidable";
import { promises as fsPromises } from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    // Parse multipart form data
    const form = formidable({ multiples: false, keepExtensions: true });

    // Convert NextRequest to a readable stream for formidable
    const contentType = req.headers.get("content-type") || "";
    const body = req.body as ReadableStream<Uint8Array>;
    const nodeStream = require("stream").Readable.fromWeb(body);

    // formidable expects a Node.js IncomingMessage, so we create a mock object
    const incoming: any = nodeStream;
    incoming.headers = Object.fromEntries(req.headers.entries());
    incoming.method = req.method;

    const [fields, files] = await new Promise<any[]>((resolve, reject) => {
      form.parse(incoming, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });
    // Normalize all fields to string (formidable returns arrays)
    function getField(field: any) {
      return Array.isArray(field) ? field[0] : field;
    }
    const name = getField(fields.name);
    const email = getField(fields.email);
    const password = getField(fields.password);
    const specialty = getField(fields.specialty);
    const institution = getField(fields.institution);
    const location = getField(fields.location);
    const accountType = getField(fields.accountType);

    if (!name || !email || !password || !specialty || !institution || !location || !accountType) {
      return new NextResponse(JSON.stringify({ message: "Missing fields" }), { status: 400 });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return new NextResponse(JSON.stringify({ message: "Email already registered" }), { status: 409 });
    }
    const hashed = await bcrypt.hash(password, 10);
    let profilePicUrl = "";
    if (files.profilePic) {
      const file = Array.isArray(files.profilePic) ? files.profilePic[0] : files.profilePic;
      if (file && file.filepath && file.originalFilename) {
        try {
          const uploadResult = await imagekitService.upload(file.filepath, file.originalFilename, "/users/avatars");
          profilePicUrl = uploadResult.url;
          await fsPromises.unlink(file.filepath);
        } catch (err) {
          console.error("Image upload failed:", err);
        }
      } else {
        console.error("profilePic file missing filepath or originalFilename", file);
      }
    }
    const user = new User({ name, email, password: hashed, specialty, institution, location, accountType, profilePic: profilePicUrl });
    await user.save();

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    const accessToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "3h" });
    const refreshToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "7d" });

    const response = new NextResponse(JSON.stringify({ message: "Signup successful" }), { status: 201 });
    response.cookies.set("accessToken", accessToken, { httpOnly: true, maxAge: 3 * 60 * 60 });
    response.cookies.set("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 });

    return response;
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: error?.message || "Signup failed", error: error?.toString?.() || error }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

