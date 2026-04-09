'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Tag } from 'lucide-react'

const promocoes = [
    {
        titulo: 'Combo Família',
        descricao: '4 Burgers + 4 Batatas + 4 bebidas',
        precoOriginal: 'R$ 159,90',
        precoAtual: 'R$ 119,90',
        badge: '25% OFF',
        badgeColor: 'bg-[#E31837]',
        imagem: 'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=600&h=400&fit=crop',
    },
    {
        titulo: 'Happy Hour',
        descricao: 'Das 16h às 20h - Batata em dobro',
        precoOriginal: null,
        precoAtual: null,
        badge: '2x1',
        badgeColor: 'bg-[#F5A623]',
        imagem: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=400&fit=crop',
    },
    {
        titulo: 'Delivery Grátis',
        descricao: 'Pedidos acima de R$ 50',
        precoOriginal: null,
        precoAtual: null,
        badge: 'FRETE GRÁTIS',
        badgeColor: 'bg-green-600',
        imagem: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop',
    },
]

export default function PromocoesDodia() {
    return (
        <section className='w-full bg-[var(--prim)] px-[8%] lg:px-[16%] py-12'>
            {/* Header */}
            <div className='flex items-center gap-2 mb-6'>
                <div className='w-7 h-7 bg-[#F5A623] rounded-lg flex items-center justify-center'>
                    <Tag className='w-4 h-4 text-white' />
                </div>
                <h2 className='text-white font-black text-xl'>Promoções do Dia</h2>
            </div>

            {/* Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {promocoes.map((promo) => (
                    <div key={promo.titulo} className='bg-[#1a0a0a] rounded-2xl overflow-hidden flex flex-col'>
                        {/* Image */}
                        <div className='relative h-44'>
                            <Image
                                src={promo.imagem}
                                alt={promo.titulo}
                                fill
                                className='object-cover'
                            />
                            <span className={`absolute top-3 right-3 ${promo.badgeColor} text-white text-xs font-black px-3 py-1 rounded-full`}>
                                {promo.badge}
                            </span>
                        </div>

                        {/* Content */}
                        <div className='p-4 flex flex-col flex-1'>
                            <h3 className='text-white font-bold text-base'>{promo.titulo}</h3>
                            <p className='text-gray-500 text-xs mt-1 mb-3'>{promo.descricao}</p>

                            {promo.precoAtual && (
                                <div className='flex items-center gap-2 mb-3'>
                                    <span className='text-gray-500 text-xs line-through'>{promo.precoOriginal}</span>
                                    <span className='text-[#E31837] font-black text-lg'>{promo.precoAtual}</span>
                                </div>
                            )}

                            <Link
                                href='/promocoes'
                                className='mt-auto w-full bg-white/5 hover:bg-white/10 text-white text-sm font-semibold text-center py-2.5 rounded-xl no-underline transition-colors'
                            >
                                Ver Promoção
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}