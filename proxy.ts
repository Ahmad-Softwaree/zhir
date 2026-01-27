// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const isProtectedRoute = (pathname: string) => {
  return pathname.match(/^\/[^\/]+\/chat/);
};

export default async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/auth")) {
    return await auth0.middleware(request);
  }

  if (isProtectedRoute(pathname)) {
    const session = await auth0.getSession(request);
    if (!session) {
      const { origin } = new URL(request.url);
      return NextResponse.redirect(`${origin}/auth/login?state=${pathname}`);
    }
  }
  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:woff|woff2|ttf|otf|eot|svg|png|jpg|jpeg|gif|webp)).*)",
  ],
};
