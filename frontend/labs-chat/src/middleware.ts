import { type NextRequest, NextResponse } from "next/server";
import { authenticatedUser } from "./helpers/amplify-server-utils";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const user = await authenticatedUser({ request, response });
  const isOnAuthArea = request.nextUrl.pathname.startsWith("/auth");
  
  console.log(`response: ${JSON.stringify(response)}`);
  console.log(`user: ${JSON.stringify(user)}`)
  console.log(`isOnAuthArea: ${isOnAuthArea}`)
  if (!isOnAuthArea) {
    console.log(`User: ${user}`);
    if (!user)
      return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
    return response;
  } else if (user) {
    return response;
  }
}

export const config = {
  /*
   * Match all request paths except for the ones starting with
   */
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
