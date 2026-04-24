import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/cadastro']
const INTERNAL_PREFIXES = ['/api', '/_next']
const AUTH_TOKEN_COOKIE = 'ifburger_token'

function isPublicFile(pathname: string) {
    return pathname.includes('.')
}

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl
    const isInternalRoute = INTERNAL_PREFIXES.some(prefix => pathname.startsWith(prefix))

    if (isInternalRoute || isPublicFile(pathname)) {
        return NextResponse.next()
    }

    const isPublicRoute = PUBLIC_ROUTES.some(
        route => pathname === route || pathname.startsWith(`${route}/`)
    )
    const isAuthenticated = Boolean(request.cookies.get(AUTH_TOKEN_COOKIE)?.value)

    if (!isAuthenticated && !isPublicRoute) {
        const loginUrl = request.nextUrl.clone()
        loginUrl.pathname = '/login'
        loginUrl.searchParams.set('redirect', `${pathname}${search}`)
        return NextResponse.redirect(loginUrl)
    }

    const isAuthPage = pathname === '/login' || pathname === '/cadastro'

    if (isAuthenticated && isAuthPage) {
        const homeUrl = request.nextUrl.clone()
        homeUrl.pathname = '/'
        homeUrl.search = ''
        return NextResponse.redirect(homeUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/:path*',
}
