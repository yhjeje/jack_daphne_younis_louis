"use server";
 
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkAuth } from "./utils/sessions";
 
export default async function middleware(request: NextRequest) {
  const isAuthorized = await checkAuth();
 
  if (
    (request.nextUrl.pathname.startsWith("/mon-compte") ||
      request.nextUrl.pathname.endsWith("/add")) &&
    isAuthorized.status >= 300
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}