import { NextRequest, NextResponse } from "next/server";

export function withCorsHandler(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse
) {
  return async function wrappedHandler(req: NextRequest) {
    const origin = req.headers.get("origin");
    const isDevelopment = process.env.NODE_ENV === "development";
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3001")
      .split(",")
      .map((o) => o.trim());

    const corsHeaders: Record<string, string> = {
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Max-Age": "86400",
      "Access-Control-Allow-Credentials": "true",
    };

    if (origin) {
      if (isDevelopment || allowedOrigins.includes(origin)) {
        corsHeaders["Access-Control-Allow-Origin"] = origin;
      }
    } else if (isDevelopment) {
      corsHeaders["Access-Control-Allow-Origin"] = "http://localhost:3001";
    }

    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: corsHeaders });
    }

    const response = await handler(req);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  };
}
