import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/cadastro']
const INTERNAL_PREFIXES = ['/api', '/_next']
const AUTH_TOKEN_COOKIE = 'ifburger_token'

function getBackendBaseUrlForRequest(request: NextRequest) {
    const fromEnv = process.env.NEXT_PUBLIC_BACKEND_URL
    if (fromEnv) {
        return fromEnv
    }

    const url = new URL(request.nextUrl.origin)
    url.port = '3334'
    url.pathname = '/api/v1'
    return url.toString().replace(/\/$/, '')
}

function isPublicFile(pathname: string) {
    return pathname.includes('.')
}

export async function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl
    const isInternalRoute = INTERNAL_PREFIXES.some(prefix => pathname.startsWith(prefix))

    if (isInternalRoute || isPublicFile(pathname)) {
        return NextResponse.next()
    }

    const isPublicRoute = PUBLIC_ROUTES.some(
        route => pathname === route || pathname.startsWith(`${route}/`)
    )
    const isAuthenticated = Boolean(request.cookies.get(AUTH_TOKEN_COOKIE)?.value)

    const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')

    if (!isAuthenticated && !isPublicRoute) {
        const loginUrl = request.nextUrl.clone()
        loginUrl.pathname = '/login'
        loginUrl.searchParams.set('redirect', `${pathname}${search}`)
        return NextResponse.redirect(loginUrl)
    }

    if (isAuthenticated && isAdminRoute) {
        const backendBaseUrl = getBackendBaseUrlForRequest(request)
        try {
            const cookieHeader = request.headers.get('cookie') ?? ''
            const response = await fetch(`${backendBaseUrl}/auth/me`, {
                headers: {
                    cookie: cookieHeader,
                },
                cache: 'no-store',
            })

            if (!response.ok) {
                const loginUrl = request.nextUrl.clone()
                loginUrl.pathname = '/login'
                loginUrl.searchParams.set('redirect', `${pathname}${search}`)
                return NextResponse.redirect(loginUrl)
            }

            const payload = await response.json()
            const role = payload?.user?.role
            if (role !== 'ADMIN') {
                const homeUrl = request.nextUrl.clone()
                homeUrl.pathname = '/'
                homeUrl.search = ''
                return NextResponse.redirect(homeUrl)
            }
        } catch {
            const homeUrl = request.nextUrl.clone()
            homeUrl.pathname = '/'
            homeUrl.search = ''
            return NextResponse.redirect(homeUrl)
        }
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
