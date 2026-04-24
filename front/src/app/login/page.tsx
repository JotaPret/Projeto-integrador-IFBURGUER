import { Suspense } from 'react'
import LoginForm from '@/components/Auth/LoginForm'

function LoginFallback() {
    return (
        <section className='w-full max-w-5xl min-h-[460px] rounded-3xl border border-white/10 bg-[#120707] flex items-center justify-center'>
            <p className='text-sm text-gray-300'>Carregando login...</p>
        </section>
    )
}

export default function LoginPage() {
    return (
        <main className='min-h-screen bg-[radial-gradient(circle_at_top,#2e1010_0%,#130707_45%,#080303_100%)] px-6 py-12 flex items-center justify-center'>
            <Suspense fallback={<LoginFallback />}>
                <LoginForm />
            </Suspense>
        </main>
    )
}
