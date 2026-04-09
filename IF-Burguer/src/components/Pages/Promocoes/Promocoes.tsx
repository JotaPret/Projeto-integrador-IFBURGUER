import Image from 'next/image'
import Link from 'next/link'
import { Tag, Flame, Clock } from 'lucide-react'
import Footer from '@/components/Footer/Footer'

type Promocao = {
    id: number
    nome: string
    descricao: string
    precoOriginal: number | null
    precoAtual: number | null
    badge: string
    badgeColor: string
    validade: string
    imagem: string
}

const promocoes: Promocao[] = [
    {
        id: 1,
        nome: 'Combo Família',
        descricao: '4 burgers + 4 batatas + 4 bebidas. Perfeito para reunir a galera!',
        precoOriginal: 159.90,
        precoAtual: 119.90,
        badge: '25% OFF',
        badgeColor: 'bg-[#E31837]',
        validade: '28/02/2025',
        imagem: 'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=400&h=300&fit=crop',
    },
    {
        id: 2,
        nome: 'Happy Hour',
        descricao: 'Das 18h às 20h. Batata em dobro em qualquer pedido!',
        precoOriginal: null,
        precoAtual: null,
        badge: '2x1',
        badgeColor: 'bg-[#F5A623]',
        validade: 'Todos os dias',
        imagem: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
    },
    {
        id: 3,
        nome: 'Delivery Grátis',
        descricao: 'Frete grátis para pedidos acima de R$ 50. Aproveite!',
        precoOriginal: null,
        precoAtual: null,
        badge: 'FRETE GRÁTIS',
        badgeColor: 'bg-green-600',
        validade: 'Sem prazo',
        imagem: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    },
    {
        id: 4,
        nome: 'Combo Namorados',
        descricao: '2 burgers especiais + batata grande + 2 milkshakes',
        precoOriginal: 99.90,
        precoAtual: 79.90,
        badge: '20% OFF',
        badgeColor: 'bg-[#E31837]',
        validade: '14/02/2025',
        imagem: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop',
    },
    {
        id: 5,
        nome: 'Terça do Cheese',
        descricao: 'Todas as terças, queijo extra grátis em qualquer burger!',
        precoOriginal: null,
        precoAtual: null,
        badge: 'QUEIJO GRÁTIS',
        badgeColor: 'bg-[#F5A623]',
        validade: 'Todas as terças',
        imagem: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop',
    },
    {
        id: 6,
        nome: 'Primeiro Pedido',
        descricao: '15% de desconto no seu primeiro pedido pelo app!',
        precoOriginal: null,
        precoAtual: null,
        badge: '15% OFF',
        badgeColor: 'bg-[#E31837]',
        validade: 'Novos clientes',
        imagem: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca368f?w=400&h=300&fit=crop',
    },
]

export default function Promocoes() {
    return (
        <div className='min-h-screen bg-[var(--prim)]'>
            <div className='px-[8%] lg:px-[16%] py-10'>

                {/* Header */}
                <div className='flex items-center gap-3 mb-8'>
                    <div className='w-10 h-10 bg-[#F5A623] rounded-xl flex items-center justify-center'>
                        <Tag className='w-5 h-5 text-white' />
                    </div>
                    <div>
                        <h1 className='text-white font-black text-4xl md:text-5xl'>Promoções</h1>
                        <p className='text-gray-500 text-sm mt-0.5'>As melhores ofertas para você</p>
                    </div>
                </div>

                {/* Banner Destaque */}
                <div className='w-full rounded-3xl overflow-hidden bg-gradient-to-r from-[#E31837] to-[#F5A623] p-8 md:p-12 flex items-center justify-between mb-10'>
                    <div className='flex-1'>
                        <span className='inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4'>
                            <Flame className='w-3.5 h-3.5' /> OFERTA ESPECIAL
                        </span>
                        <h2 className='text-white font-black text-3xl md:text-4xl mb-3'>
                            Ganhe um Milkshake Grátis!
                        </h2>
                        <p className='text-white/80 text-sm mb-6 max-w-sm'>
                            Nas compras acima de R$ 80, você ganha um milkshake do sabor que preferir!
                        </p>
                        <Link
                            href='/Cardapio'
                            className='bg-white text-[#E31837] font-bold px-6 py-2.5 rounded-full text-sm no-underline hover:opacity-90 transition-opacity inline-block'
                        >
                            Aproveitar Agora
                        </Link>
                    </div>
                    <div className='hidden md:block w-44 h-44 rounded-full overflow-hidden border-4 border-white/20 flex-shrink-0'>
                        <Image
                            src='https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=300&h=300&fit=crop'
                            alt='Milkshake'
                            width={176}
                            height={176}
                            className='object-cover w-full h-full'
                        />
                    </div>
                </div>

                {/* Grid de Promoções */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-12'>
                    {promocoes.map((promo) => (
                        <div key={promo.id} className='bg-[#1a0a0a] rounded-2xl overflow-hidden border border-white/5 flex flex-col'>
                            <div className='relative h-48'>
                                <Image
                                    src={promo.imagem}
                                    alt={promo.nome}
                                    fill
                                    className='object-cover'
                                />
                                <span className={`absolute top-3 right-3 ${promo.badgeColor} text-white text-xs font-black px-3 py-1 rounded-full`}>
                                    {promo.badge}
                                </span>
                            </div>

                            <div className='p-4 flex flex-col flex-1'>
                                <h3 className='text-white font-bold text-base'>{promo.nome}</h3>
                                <p className='text-gray-500 text-xs mt-1 mb-3'>{promo.descricao}</p>

                                {promo.precoAtual && (
                                    <div className='flex items-center gap-2 mb-3'>
                                        <span className='text-gray-500 text-xs line-through'>
                                            R$ {promo.precoOriginal!.toFixed(2).replace('.', ',')}
                                        </span>
                                        <span className='text-[#E31837] font-black text-lg'>
                                            R$ {promo.precoAtual.toFixed(2).replace('.', ',')}
                                        </span>
                                    </div>
                                )}

                                <div className='flex items-center gap-1.5 text-gray-600 text-xs mb-4'>
                                    <Clock className='w-3.5 h-3.5' />
                                    {promo.validade}
                                </div>

                                <Link
                                    href='/Cardapio'
                                    className='mt-auto w-full bg-white/5 hover:bg-white/10 text-white text-sm font-semibold text-center py-2.5 rounded-xl no-underline transition-colors'
                                >
                                    Ver Oferta
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Final */}
                <div className='text-center'>
                    <p className='text-gray-500 text-sm mb-4'>Não encontrou o que procurava?</p>
                    <Link
                        href='/Cardapio'
                        className='bg-[#E31837] hover:opacity-90 text-white font-bold px-8 py-3 rounded-full no-underline transition-opacity inline-block'
                    >
                        Ver Cardápio Completo
                    </Link>
                </div>

            </div>
            <Footer />
        </div>
    )
}