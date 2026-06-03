import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;

  const protectedRoutes = ['/dashboard', '/workouts', '/exercises', '/agenda'];
  const authRoutes = ['/login', '/register'];

  const isProtected = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Niet ingelogd & probeert beveiligde pagina te bezoeken
  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  // Ingelogd & bezoekt login/register → doorsturen naar dashboard
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/workouts/:path*',
    '/exercises/:path*',
    '/agenda/:path*',
    '/login',
    '/register',
  ],
};