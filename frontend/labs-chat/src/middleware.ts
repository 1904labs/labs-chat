import { type NextRequest, NextResponse } from "next/server";
import { authenticatedUser } from "./helpers/amplify-server-utils";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const user = await authenticatedUser({ request, response });
  const isOnAuthArea = request.nextUrl.pathname.startsWith("/auth");

  // if the user is authenticated or don't need
  // to be authenticated, return the response
  if (isOnAuthArea || user) return response;

  // if the user is not authenticated and is not on the auth area
  // redirect to the login page
  return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
}

export const config = {
  /*
   * Match all request paths except for the ones starting with
   */
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png|.*\\.svg|.*\\.jpeg$).*)",
  ],
};
