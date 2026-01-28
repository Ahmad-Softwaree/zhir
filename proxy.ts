// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const isProtectedRoute = (pathname: string) => {
  return pathname.match(/^\/[^\/]+\/chat(?:\/[a-f0-9]{24})?$/);
};

const isApiRoute = (pathname: string) => {
  return pathname.startsWith("/api/");
};

const isPublicFile = (pathname: string) => {
  return pathname.match(
    /\.(png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|otf|eot)$/i
  );
};

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isPublicFile(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/auth")) {
    return await auth0.middleware(request);
  }

  if (isApiRoute(pathname)) {
    const session = await auth0.getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (isProtectedRoute(pathname)) {
    const session = await auth0.getSession(request);
    if (!session) {
      const { origin } = new URL(request.url);
      return NextResponse.redirect(`${origin}/auth/login?state=${pathname}`);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
