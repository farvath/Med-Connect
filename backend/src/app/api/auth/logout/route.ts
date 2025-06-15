import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Remove the tokens by setting them to empty and expiring them immediately
  const response = new NextResponse(JSON.stringify({ message: "Logged out successfully" }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
  response.cookies.set("accessToken", "", { httpOnly: true, maxAge: 0 });
  response.cookies.set("refreshToken", "", { httpOnly: true, maxAge: 0 });
  return response;
}
