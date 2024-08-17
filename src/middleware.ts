import { NextRequest, NextResponse } from "next/server";
import { Translations } from "@/types/translations";
import defaultTranslations from "./lib/utils/defaultTranslations";

const DEFAULT_LOCALE = "es";
const SUPPORTED_LOCALES = ["es", "en"];
const COOKIE_NAME = "NEXT_LOCALE";

async function loadTranslations(locale: string): Promise<Translations> {
  try {
    const translations = await import(`@/locales/${locale}/common.json`);
    return { ...defaultTranslations, ...translations.default };
  } catch (error) {
    console.error(`Failed to load translations for ${locale}:`, error);
    return defaultTranslations;
  }
}

function getLocaleFromPath(pathname: string): string | null {
  const firstSegment = pathname.split("/")[1];
  return SUPPORTED_LOCALES.includes(firstSegment) ? firstSegment : null;
}

export async function middleware(req: NextRequest) {
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
    response.cookies.set(COOKIE_NAME, pathLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "strict",
    });

    // Pre-load translations
    const translations = await loadTranslations(pathLocale);

    // Pass translations to the request object
    const url = req.nextUrl.clone();
    url.searchParams.set("translations", JSON.stringify(translations));

    return NextResponse.rewrite(url);
  }

  // Handle paths without locale prefix
  const newPathname = `/${currentLocale}${pathname}`;
  return NextResponse.redirect(new URL(newPathname, req.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
