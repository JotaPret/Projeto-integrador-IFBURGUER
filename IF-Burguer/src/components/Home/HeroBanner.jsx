'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Flame } from 'lucide-react'

export default function HeroBanner() {
    return (
        <section className='w-full bg-[var(--prim)] px-[8%] lg:px-[16%] py-12 lg:py-16'>
            <div className='flex items-center justify-between gap-8'>

                {/* Left Content */}
                <div className='flex-1 max-w-lg'>
                    {/* Badge */}
                    <div className='inline-flex items-center gap-2 border border-[#E31837] text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6'>
                        <Flame className='w-3.5 h-3.5 text-[#E31837]' />
                        GRELHADO NA BRASA
                    </div>

                    {/* Headline */}
                    <h1 className='text-5xl lg:text-6xl font-black uppercase leading-tight mb-4'>
                        <span className='text-white'>SABOR QUE</span><br />
                        <span className='text-[#E31837]'>CONQUISTA</span>
                    </h1>

                    {/* Description */}
                    <p className='text-gray-400 text-sm leading-relaxed mb-8 max-w-sm'>
                        Hambúrgueres artesanais feitos com ingredientes premium. Cada mordida é uma explosão de sabor.
                    </p>

                    {/* Buttons */}
                    <div className='flex items-center gap-4'>
                        <Link
                            href='/Cardapio'
                            className='bg-[#E31837] hover:opacity-90 text-white font-bold px-6 py-3 rounded-full text-sm flex items-center gap-2 no-underline transition-opacity'
                        >
                            Ver Cardápio →
                        </Link>
                        <Link
                            href='/localizacoes'
                            className='bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-full text-sm no-underline transition-colors'
                        >
                            Localização
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className='flex items-center gap-8 mt-10 pt-6 border-t border-white/10'>
                        <div>
                            <p className='text-white font-black text-2xl'>50+</p>
                            <p className='text-gray-500 text-xs'>Produtos</p>
                        </div>
                        <div>
                            <p className='text-white font-black text-2xl'>30min</p>
                            <p className='text-gray-500 text-xs'>Entrega Média</p>
                        </div>
                        <div>
                            <p className='text-white font-black text-2xl'>4.9</p>
                            <p className='text-gray-500 text-xs'>Avaliação</p>
                        </div>
                    </div>
                </div>

                {/* Right Image */}
                <div className='hidden lg:block relative flex-shrink-0'>
                    {/* Mais Vendido Badge */}
                    <div className='absolute top-4 right-4 z-10 inline-flex items-center gap-2 bg-[var(--third)] text-white text-xs font-black px-4 py-2 rounded-full'>
                        <Flame className='w-3.5 h-3.5' />
                        MAIS VENDIDO
                    </div>

                    {/* Burger Image */}
                    <div className='w-[420px] h-[340px] rounded-2xl overflow-hidden relative'>
    <Image
        src='https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=800&fit=crop'
        alt='Hambúrguer'
        fill
        className='object-cover'
    />
    </div>

                    {/* Price Tag */}
                    <div className='absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-3 rounded-xl'>
                        <p className='text-gray-400 text-xs'>A partir de</p>
                        <p className='text-white font-black text-xl'>R$ 24,90</p>
                    </div>
                </div>

            </div>
        </section>
    )
}