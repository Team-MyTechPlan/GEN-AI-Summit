import { NextRequest, NextResponse } from "next/server";

const DEFAULT_LOCALE = "es";
const SUPPORTED_LOCALES = ["es", "en"];
const COOKIE_NAME = "NEXT_LOCALE";

function setLocaleCookie(response: NextResponse, locale: string) {
  response.cookies.set(COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "strict",
  });
}

function getLocaleFromPath(pathname: string): string | null {
  const firstSegment = pathname.split("/")[1];
  return SUPPORTED_LOCALES.includes(firstSegment) ? firstSegment : null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const currentLocale = req.cookies.get(COOKIE_NAME)?.value || DEFAULT_LOCALE;

  // Exclude API routes, static files, and not-found page
  if (pathname.match(/^\/(?:api|_next|.*\..*)/) || pathname === "/not-found") {
    return NextResponse.next();
  }

  // Handle root path
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${currentLocale}`, req.url));
  }

  const pathLocale = getLocaleFromPath(pathname);

  // Handle paths with supported locale prefix
  if (pathLocale) {
    const response = NextResponse.next();
    setLocaleCookie(response, pathLocale);
    return response;
  }

  // Handle paths without locale prefix
  const newPathname = `/${currentLocale}${pathname}`;
  return NextResponse.redirect(new URL(newPathname, req.url));
}

export const config = {
  matcher: ["/", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
