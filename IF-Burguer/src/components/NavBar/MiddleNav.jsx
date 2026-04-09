'use client'
import Link from 'next/link'
import { Flame } from 'lucide-react'
import { useCart } from '@/components/Cart/CartContext'
import AuthActions from '@/components/Auth/AuthActions'

export default function MiddleNav() {
    const { totalItems, toggleCart, closeCart } = useCart()

    return (
        <div className='w-full bg-[var(--prim)] border-b border-gray-800'>
            <div className='flex items-center justify-between py-3 px-[8%] lg:px-[16%]'>

                {/* Logo */}
                <Link href='/' className='flex items-center gap-2 no-underline text-inherit hover:no-underline'>
                    <div className='w-9 h-9 bg-[#E31837] rounded-xl flex items-center justify-center'>
                        <Flame className='w-5 h-5 text-white' />
                    </div>
                    <span className='text-2xl font-black tracking-wider uppercase'>
                        <span className='text-white'>IF</span>
                        <span className='text-[var(--second)]'>BURGER</span>
                    </span>
                </Link>

                {/* Nav Links */}
                <nav className='hidden lg:flex items-center gap-8'>
                    <Link href='/Cardapio' className='text-white text-sm font-medium hover:text-[var(--second)] transition-colors no-underline'>
                        Cardápio
                    </Link>
                    <Link href='/Promocoes' className='text-white text-sm font-medium hover:text-[var(--second)] transition-colors no-underline'>
                        Promoções
                    </Link>
                    <Link href='/Localizacoes' className='text-white text-sm font-medium hover:text-[var(--second)] transition-colors no-underline'>
                        Localizações
                    </Link>
                    <Link href='/Fidelidade' className='flex items-center gap-1 text-[var(--second)] text-sm font-bold hover:opacity-80 transition-opacity no-underline'>
                        <i className='bi bi-star-fill text-[var(--second)]'></i>
                        Fidelidade
                    </Link>
                </nav>

                {/* Right Side */}
                <div className='flex items-center gap-4'>
                    {/* Theme Toggle */}
                    <button className='text-white text-xl hover:text-[var(--second)] transition-colors cursor-pointer bg-transparent border-none'>
                        <i className='bi bi-brightness-high'></i>
                    </button>

                    {/* Cart */}
                    <button
                        onClick={toggleCart}
                        className='relative text-white text-xl hover:text-[var(--second)] transition-colors cursor-pointer bg-transparent border-none'
                    >
                        <i className='bi bi-bag'></i>
                        {totalItems > 0 && (
                            <span className='absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#E31837] text-white text-[10px] leading-4 font-bold text-center'>
                                {totalItems > 99 ? '99+' : totalItems}
                            </span>
                        )}
                    </button>

                    {/* CTA Button */}
                    <Link
                        href='/Carrinho'
                        onClick={closeCart}
                        className='bg-[#E31837] hover:opacity-90 text-white font-bold rounded-full px-5 h-9 text-sm flex items-center no-underline transition-opacity whitespace-nowrap'
                    >
                        Fazer Pedido
                    </Link>

                    <AuthActions />
                </div>

            </div>
        </div>
    )
}