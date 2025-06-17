import { NextResponse } from "next/server";

export async function POST() {
  const response = new NextResponse(
    JSON.stringify({ message: "Logged out succesfully" }),
    { status: 200 }
  );
  response.cookies.set("accessToken", "", { httpOnly: false, maxAge: 0 });
  response.cookies.set("refreshToken", "", { httpOnly: false, maxAge: 0 });
  return response;
}
