'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { LockKeyhole, Mail, Phone, UserRound } from 'lucide-react'

function sanitizeRedirect(value: string | null) {
    if (!value || !value.startsWith('/')) {
        return '/'
    }

    return value
}

export default function RegisterForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const redirectPath = sanitizeRedirect(searchParams.get('redirect'))
    const loginHref =
        redirectPath === '/'
            ? '/login'
            : `/login?redirect=${encodeURIComponent(redirectPath)}`

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')

        const normalizedName = fullName.trim().replace(/\s+/g, ' ')
        const normalizedEmail = email.trim().toLowerCase()

        if (!normalizedName || !normalizedEmail || !password.trim() || !confirmPassword.trim()) {
            setError('Preencha todos os campos obrigatorios para continuar.')
            return
        }

        if (password.length < 6) {
            setError('A senha precisa ter ao menos 6 caracteres.')
            return
        }

        if (password !== confirmPassword) {
            setError('As senhas nao conferem.')
            return
        }

        setIsSubmitting(true)

        const params = new URLSearchParams()
        params.set('registered', '1')
        params.set('name', normalizedName)
        params.set('email', normalizedEmail)
        if (redirectPath !== '/') {
            params.set('redirect', redirectPath)
        }

        router.push(`/login?${params.toString()}`)
    }

    return (
        <section className='w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.45)]'>
            <div className='bg-[#120707] p-10 lg:p-12'>
                <h2 className='text-white text-2xl font-black'>Criar conta</h2>
                <p className='text-gray-400 text-sm mt-2'>
                    Cadastro rapido para entrar no IF Burger.
                </p>

                <form onSubmit={handleSubmit} className='mt-8 space-y-4'>
                    <label className='block'>
                        <span className='text-xs text-gray-300 mb-2 block'>Nome completo</span>
                        <div className='flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 h-12'>
                            <UserRound className='w-4 h-4 text-gray-400 shrink-0' />
                            <input
                                type='text'
                                value={fullName}
                                onChange={event => setFullName(event.target.value)}
                                placeholder='Seu nome'
                                className='w-full bg-transparent text-white text-sm outline-none placeholder:text-gray-500'
                            />
                        </div>
                    </label>

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
                        <span className='text-xs text-gray-300 mb-2 block'>Telefone (opcional)</span>
                        <div className='flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 h-12'>
                            <Phone className='w-4 h-4 text-gray-400 shrink-0' />
                            <input
                                type='tel'
                                value={phone}
                                onChange={event => setPhone(event.target.value)}
                                placeholder='(00) 00000-0000'
                                className='w-full bg-transparent text-white text-sm outline-none placeholder:text-gray-500'
                            />
                        </div>
                    </label>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <label className='block'>
                            <span className='text-xs text-gray-300 mb-2 block'>Senha</span>
                            <div className='flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 h-12'>
                                <LockKeyhole className='w-4 h-4 text-gray-400 shrink-0' />
                                <input
                                    type='password'
                                    autoComplete='new-password'
                                    value={password}
                                    onChange={event => setPassword(event.target.value)}
                                    placeholder='Minimo 6 caracteres'
                                    className='w-full bg-transparent text-white text-sm outline-none placeholder:text-gray-500'
                                />
                            </div>
                        </label>

                        <label className='block'>
                            <span className='text-xs text-gray-300 mb-2 block'>Confirmar senha</span>
                            <div className='flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 h-12'>
                                <LockKeyhole className='w-4 h-4 text-gray-400 shrink-0' />
                                <input
                                    type='password'
                                    autoComplete='new-password'
                                    value={confirmPassword}
                                    onChange={event => setConfirmPassword(event.target.value)}
                                    placeholder='Repita a senha'
                                    className='w-full bg-transparent text-white text-sm outline-none placeholder:text-gray-500'
                                />
                            </div>
                        </label>
                    </div>

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
                        {isSubmitting ? 'Criando conta...' : 'Criar conta'}
                    </button>
                </form>

                <p className='text-sm text-gray-400 mt-5'>
                    Ja tem conta?{' '}
                    <Link href={loginHref} className='text-[var(--second)] font-bold no-underline hover:opacity-90'>
                        Entrar agora
                    </Link>
                </p>
            </div>

            <div className='bg-gradient-to-br from-[#E31837] to-[#821325] p-10 lg:p-12 text-white flex flex-col justify-between'>
                <div>
                    <h1 className='text-4xl font-black leading-tight'>
                        Cadastro feito para abrir apetite.
                    </h1>
                    <p className='mt-4 text-white/85 text-sm max-w-sm'>
                        Por enquanto, este cadastro e visual: os dados migram para o login e o banco sera integrado na proxima etapa.
                    </p>
                </div>

                <div className='mt-10 space-y-3'>
                    
                </div>
            </div>
        </section>
    )
}
