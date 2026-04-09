'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, UserRound } from 'lucide-react'

const AUTH_COOKIE = 'ifburger_auth'
const USER_COOKIE = 'ifburger_user'

function readCookie(name) {
    if (typeof document === 'undefined') {
        return ''
    }

    const value = document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith(`${name}=`))

    return value ? value.split('=')[1] : ''
}

export default function AuthActions() {
    const router = useRouter()

    const email = (() => {
        const hasSession = readCookie(AUTH_COOKIE) === '1'
        if (!hasSession) {
            return ''
        }

        const savedEmail = readCookie(USER_COOKIE)
        if (!savedEmail) {
            return 'Cliente IF'
        }

        try {
            return decodeURIComponent(savedEmail)
        } catch {
            return 'Cliente IF'
        }
    })()

    const handleLogout = () => {
        document.cookie = `${AUTH_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`
        document.cookie = `${USER_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`
        router.push('/login')
        router.refresh()
    }

    if (!email) {
        return (
            <Link
                href='/login'
                className='bg-white text-[var(--prim)] font-bold rounded-full px-4 h-9 text-sm flex items-center no-underline hover:opacity-90 transition-opacity'
            >
                Entrar
            </Link>
        )
    }

    return (
        <div className='flex items-center gap-3'>
            <div className='hidden xl:flex items-center gap-1.5 text-white/80 text-xs max-w-40'>
                <UserRound className='w-4 h-4 shrink-0' />
                <span className='truncate'>{email}</span>
            </div>
            <button
                onClick={handleLogout}
                className='bg-transparent border border-white/30 text-white font-bold rounded-full px-4 h-9 text-sm flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors'
            >
                <LogOut className='w-4 h-4' />
                Sair!!
            </button>
        </div>
    )
}
