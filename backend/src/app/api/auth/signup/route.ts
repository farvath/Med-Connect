import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../services/db";
import User from "../../../../models/User";
// @ts-ignore
import bcrypt from "bcryptjs";

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
    return new NextResponse(JSON.stringify({ message: "Signup successful" }), { status: 201 });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ message: error.message || "Signup failed" }), { status: 500 });
  }
};

