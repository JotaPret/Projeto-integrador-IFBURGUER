'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, UserRound } from 'lucide-react'

const AUTH_COOKIE = 'ifburger_auth'
const USER_COOKIE = 'ifburger_user'

const BACKEND_BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3334/api/v1'

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
    const [avatarFailed, setAvatarFailed] = useState(false)
    const [profilePhoto, setProfilePhoto] = useState('')
    const [meEmail, setMeEmail] = useState('')

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

    useEffect(() => {
        let ignore = false

        const loadMe = async () => {
            const hasSession = readCookie(AUTH_COOKIE) === '1'
            if (!hasSession) {
                if (!ignore) {
                    setProfilePhoto('')
                    setMeEmail('')
                    setAvatarFailed(false)
                }
                return
            }

            try {
                const response = await fetch(`${BACKEND_BASE_URL}/auth/me`, {
                    credentials: 'include',
                })

                if (!response.ok) {
                    if (!ignore) {
                        setProfilePhoto('')
                        setMeEmail('')
                    }
                    return
                }

                const payload = await response.json()
                const user = payload?.user
                if (!ignore) {
                    setProfilePhoto(user?.fotoPerfil || '')
                    setMeEmail(user?.email || '')
                }
            } catch {
                if (!ignore) {
                    setProfilePhoto('')
                    setMeEmail('')
                }
            }
        }

        loadMe()

        const handler = () => {
            loadMe().catch(() => {})
        }

        window.addEventListener('ifburger-profile-updated', handler)

        return () => {
            ignore = true
            window.removeEventListener('ifburger-profile-updated', handler)
        }
    }, [])

    const profileImage = useMemo(() => {
        if (avatarFailed) {
            return ''
        }

        if (profilePhoto) {
            return profilePhoto
        }

        const fallbackEmail = meEmail || email
        if (!fallbackEmail) {
            return ''
        }

        return `https://www.google.com/s2/photos/profile/${encodeURIComponent(fallbackEmail.trim().toLowerCase())}?sz=160`
    }, [avatarFailed, email, meEmail, profilePhoto])

    const handleLogout = () => {
        fetch(`${BACKEND_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        }).catch(() => {})

        document.cookie = `${AUTH_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`
        document.cookie = `${USER_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`
        setProfilePhoto('')
        setMeEmail('')
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
            <Link
                href='/usuario'
                className='flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 text-white no-underline shadow-sm transition-transform hover:scale-105'
                title={meEmail || email}
                aria-label={`Abrir perfil de ${meEmail || email}`}
            >
                {profileImage ? (
                    <Image
                        src={profileImage}
                        alt={`Foto de perfil de ${meEmail || email}`}
                        width={36}
                        height={36}
                        className='h-full w-full rounded-full object-cover'
                        onError={() => setAvatarFailed(true)}
                    />
                ) : (
                    <UserRound className='h-4 w-4' />
                )}
            </Link>
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
