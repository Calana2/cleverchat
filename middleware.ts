import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const loggedInfo = req.cookies.get('CLEVER_CHAT_TOKEN')?.value

  if(!loggedInfo) {
   return Response.redirect(new URL('/dashboard',req.url)) 
  }
} 

export const config = {
     matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|register|api|dashboard|login|/:path*).*)'],
}




