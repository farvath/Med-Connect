import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../services/db";
import User from "../../../../models/User";
// @ts-ignore
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password, specialty, institution, location, accountType } = await req.json();
    if (!name || !email || !password || !specialty || !institution || !location || !accountType) {
      return new NextResponse(JSON.stringify({ message: "Missing fields" }), { status: 400 });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return new NextResponse(JSON.stringify({ message: "Email already registered" }), { status: 409 });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, specialty, institution, location, accountType });
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

