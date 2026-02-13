import { NextRequest, NextResponse } from "next/server";

type SiteSettingsResponse = {
  item?: {
    maintenance?: {
      enabled?: boolean;
    };
  };
};

export async function middleware(request: NextRequest) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/maintenance") {
    return NextResponse.next();
  }

  try {
    const response = await fetch(new URL("/api/site-settings", request.url), {
      method: "GET",
      cache: "no-store",
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.next();
    }

    const data = (await response.json()) as SiteSettingsResponse;
    const maintenanceEnabled = data?.item?.maintenance?.enabled === true;

    if (maintenanceEnabled) {
      return NextResponse.rewrite(new URL("/maintenance", request.url));
    }
  } catch {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!admin|api|maintenance|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\..*).*)",
  ],
};
