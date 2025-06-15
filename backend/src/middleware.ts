import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");
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

  // Handle OPTIONS request
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Add CORS headers to the response
  const response = NextResponse.next();
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.append(key, value);
  });

  return response;
}

// Configure which routes should be handled by this middleware
export const config = {
  matcher: '/api/:path*',
}
