import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const jwtSecret = process.env.JWT_SECRET as string;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

export function generateTokens(userId: string) {
  const accessToken = jwt.sign({ id: userId }, jwtSecret, { expiresIn: "3h" });
  const refreshToken = jwt.sign({ id: userId }, jwtSecret, { expiresIn: "7d" });
  return { accessToken, refreshToken };
}

export function verifyToken(token: string): { id: string } {
  try {
    return jwt.verify(token, jwtSecret) as { id: string };
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

export function extractUserIdFromToken(token: string): string {
  const decoded = verifyToken(token);
  if (typeof decoded === "object" && decoded.id) {
    return decoded.id;
  }
  throw new Error("Invalid token payload");
}

export function getUserIdFromRequest(req: NextRequest): string {
  const token = req.cookies.get("accessToken")?.value;
  if (!token) {
    throw new Error("Unauthorized: No access token found");
  }
  return extractUserIdFromToken(token);
}
