'use client'

import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Flame, Lock, Mail } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

function readCookie(name: string) {
    if (typeof document === 'undefined') {
        return ''
    }

    const value = document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith(`${name}=`))

    return value ? value.split('=')[1] : ''
}

function sanitizeRedirect(value: string | null) {
    if (!value || !value.startsWith('/')) {
        return '/'
    }

    return value
}

export default function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const migratedEmail = searchParams.get('email')?.trim().toLowerCase() ?? ''
    const migratedNameRaw = searchParams.get('name')?.trim() ?? ''
    const migratedFirstName = migratedNameRaw.split(/\s+/)[0] || 'Cliente'
    const hasNewRegistration = searchParams.get('registered') === '1'
    const [email, setEmail] = useState(migratedEmail)
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const redirectPath = sanitizeRedirect(searchParams.get('redirect'))
    const signupHref =
        redirectPath === '/'
            ? '/cadastro'
            : `/cadastro?redirect=${encodeURIComponent(redirectPath)}`

    useEffect(() => {
        if (readCookie('ifburger_auth') === '1') {
            router.replace(redirectPath)
        }
    }, [redirectPath, router])

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')

        const normalizedEmail = email.trim().toLowerCase()
        if (!normalizedEmail || !password.trim()) {
            setError('Preencha e-mail e senha para continuar.')
            return
        }

        setIsSubmitting(true)
        document.cookie = `ifburger_auth=1; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax`
        document.cookie = `ifburger_user=${encodeURIComponent(normalizedEmail)}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax`

        router.replace(redirectPath)
        router.refresh()
    }

    return (
        <section className='w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.45)]'>
            <div className='bg-gradient-to-br from-[#E31837] to-[#821325] p-10 lg:p-12 text-white flex flex-col justify-between'>
                <div>
                    <div className='inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide'>
                        <Flame className='w-4 h-4' />
                        IF Burger
                    </div>
                    <h1 className='mt-6 text-4xl font-black leading-tight'>
                        Bem-vindo de volta.
                    </h1>
                    <p className='mt-4 text-white/85 text-sm max-w-sm'>
                        Entre na sua conta para acessar o programa de fidelidade, ofertas exclusivas e seus pedidos.
                    </p>
                </div>

                <div className='mt-10 grid grid-cols-3 gap-3'>
                    <div className='bg-white/15 rounded-xl p-3'>
                        <p className='text-xl font-black'>24h</p>
                        <p className='text-xs text-white/80'>Pedidos online</p>
                    </div>
                    <div className='bg-white/15 rounded-xl p-3'>
                        <p className='text-xl font-black'>+200</p>
                        <p className='text-xs text-white/80'>Lojas no Brasil</p>
                    </div>
                    <div className='bg-white/15 rounded-xl p-3'>
                        <p className='text-xl font-black'>1:1</p>
                        <p className='text-xs text-white/80'>Pontos por real</p>
                    </div>
                </div>
            </div>

            <div className='bg-[#120707] p-10 lg:p-12'>
                <h2 className='text-white text-2xl font-black'>Fazer login</h2>
                <p className='text-gray-400 text-sm mt-2'>
                    Use seu e-mail para continuar.
                </p>

                {hasNewRegistration && (
                    <p className='text-sm text-green-300 bg-green-500/10 border border-green-500/30 rounded-xl px-3 py-2 mt-4'>
                        Cadastro visual concluido para {migratedFirstName}. Agora e so entrar na conta.
                    </p>
                )}

                <form onSubmit={handleSubmit} className='mt-8 space-y-4'>
                    <label className='block'>
                        <span className='text-xs text-gray-300 mb-2 block'>E-mail</span>
                        <div className='flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 h-12'>
                            <Mail className='w-4 h-4 text-gray-400 shrink-0' />
                            <input
                                type='email'
                                autoComplete='email'
                                value={email}
                                onChange={event => setEmail(event.target.value)}
                                placeholder='seunome@email.com'
                                className='w-full bg-transparent text-white text-sm outline-none placeholder:text-gray-500'
                            />
                        </div>
                    </label>

                    <label className='block'>
                        <span className='text-xs text-gray-300 mb-2 block'>Senha</span>
                        <div className='flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 h-12'>
                            <Lock className='w-4 h-4 text-gray-400 shrink-0' />
                            <input
                                type='password'
                                autoComplete='current-password'
                                value={password}
                                onChange={event => setPassword(event.target.value)}
                                placeholder='Digite sua senha'
                                className='w-full bg-transparent text-white text-sm outline-none placeholder:text-gray-500'
                            />
                        </div>
                    </label>

                    {error && (
                        <p className='text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2'>
                            {error}
                        </p>
                    )}

                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className='w-full h-12 rounded-xl border-none bg-[#E31837] text-white text-sm font-black cursor-pointer hover:opacity-90 transition-opacity'
                    >
                        {isSubmitting ? 'Entrando...' : 'Entrar na conta'}
                    </button>
                </form>

                <p className='text-sm text-gray-400 mt-5'>
                    Nao tem conta?{' '}
                    <Link href={signupHref} className='text-[var(--second)] font-bold no-underline hover:opacity-90'>
                        Criar cadastro
                    </Link>
                </p>

                <p className='text-xs text-gray-500 mt-6'>
                    Esta autenticacao usa sessao local para demonstracao.
                </p>
            </div>
        </section>
    )
}
