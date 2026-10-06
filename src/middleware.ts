import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  COVER_LETTER_COOKIE,
  coverLetterSessionValue,
  getCoverLetterAccessKey,
  hasCoverLetterSession,
  isValidCoverLetterAccessKey,
} from "./app/cover-letter/access";

const ADMIN_PREFIX = "/admin/cover-letter";

function unauthorized() {
  return new NextResponse(null, { status: 404 });
}

async function attachSessionCookie(response: NextResponse) {
  const token = await coverLetterSessionValue();
  if (!token) return response;

  response.cookies.set(COVER_LETTER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin/cover-letter",
    maxAge: 60 * 60 * 24 * 90,
  });
  return response;
}

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith(ADMIN_PREFIX)) {
    return NextResponse.next();
  }

  if (!getCoverLetterAccessKey()) {
    return unauthorized();
  }

  const session = request.cookies.get(COVER_LETTER_COOKIE)?.value;
  if (await hasCoverLetterSession(session)) {
    return NextResponse.next();
  }

  const key = request.nextUrl.searchParams.get("key");
  if (key && isValidCoverLetterAccessKey(key)) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("key");
    const redirect = NextResponse.redirect(url);
    return attachSessionCookie(redirect);
  }

  return unauthorized();
}

export const config = {
  matcher: ["/admin/cover-letter", "/admin/cover-letter/:path*"],
};
