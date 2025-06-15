import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../utils/tokenUtils";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  if (!token) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  try {
    verifyToken(token);
    return NextResponse.next();
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Invalid or expired token" }), { status: 401 });
  }
}

export const config = {
  matcher: "/api/:path*",
};
