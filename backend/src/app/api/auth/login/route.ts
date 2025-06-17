import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../services/db";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    if (!email || !password) {
      return new NextResponse(JSON.stringify({ message: "Missing fields" }), { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new NextResponse(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    const accessToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "3h" });
    const refreshToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "7d" });
    const response = new NextResponse(
      JSON.stringify({ 
        name: user.name,
      profilePic: user.profilePic, 
      specialty: user.specialty
      }), 
      { status: 200 }
    );
    response.cookies.set("accessToken", accessToken, { httpOnly: false, maxAge: 3 * 60 * 60 });
    response.cookies.set("refreshToken", refreshToken, { httpOnly: false, maxAge: 7 * 24 * 60 * 60 });

    return response;
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: error?.message || "Login failed", error: error?.toString?.() || error }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}