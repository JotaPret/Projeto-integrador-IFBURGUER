'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Flame } from 'lucide-react'
import { useCart } from '@/components/Cart/CartContext'
import { parsePriceLabel, toCartId } from '@/components/Cart/cart-utils'

const produtos = [
    {
        id: 1,
        nome: 'Petit Gateau',
        descricao: 'Bolo de chocolate quente com sorvete de creme e calda',
        preco: 'R$ 22,90',
        imagem: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=400&fit=crop',
    },
    {
        id: 2,
        nome: 'Milkshake Ovomaltine',
        descricao: 'Milkshake de Ovomaltine com pedaços crocantes',
        preco: 'R$ 19,90',
        imagem: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop',
    },
    {
        id: 3,
        nome: 'Blue Cheese Burger',
        descricao: 'Blend 180g, queijo gorgonzola, rúcula, cebola roxa e molho...',
        preco: 'R$ 39,90',
        imagem: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
    },
    {
        id: 4,
        nome: 'Batata Cheddar Bacon',
        descricao: 'Batata frita crocante com cheddar cremoso e bacon',
        preco: 'R$ 24,90',
        imagem: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop',
    },
]

export default function MaisPedidos() {
    const { addItem } = useCart()

    const handleAddItem = produto => {
        addItem({
            id: toCartId(produto.nome),
            name: produto.nome,
            description: produto.descricao,
            image: produto.imagem,
            price: parsePriceLabel(produto.preco),
        })
    }

    return (
        <section className='w-full bg-[var(--prim)] px-[8%] lg:px-[16%] py-12'>
            {/* Header */}
            <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-2'>
                    <div className='w-7 h-7 bg-[#E31837] rounded-lg flex items-center justify-center'>
                        <Flame className='w-4 h-4 text-white' />
                    </div>
                    <h2 className='text-white font-black text-xl'>Mais Pedidos</h2>
                </div>
                <Link href='/Cardapio' className='text-[#F5A623] text-sm font-semibold no-underline hover:opacity-80 transition-opacity flex items-center gap-1'>
                    Ver Cardápio →
                </Link>
            </div>

            {/* Cards */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {produtos.map((produto) => (
                    <div key={produto.id} className='bg-[#1a0a0a] rounded-2xl overflow-hidden flex flex-col'>
                        {/* Image */}
                        <div className='relative h-40'>
                            <Image
                                src={produto.imagem}
                                alt={produto.nome}
                                fill
                                className='object-cover'
                            />
                            <span className='absolute top-2 left-2 bg-[#F5A623] text-[#0f0505] text-[10px] font-black px-2 py-0.5 rounded-full'>
                                TOP
                            </span>
                        </div>

                        {/* Content */}
                        <div className='p-3 flex flex-col flex-1'>
                            <h3 className='text-white font-bold text-sm'>{produto.nome}</h3>
                            <p className='text-gray-500 text-xs mt-1 mb-3 line-clamp-2'>{produto.descricao}</p>

                            <div className='flex items-center justify-between mt-auto'>
                                <span className='text-white font-black text-sm'>{produto.preco}</span>
                                <button
                                    onClick={() => handleAddItem(produto)}
                                    className='bg-[#E31837] hover:opacity-90 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-opacity cursor-pointer border-none'
                                >
                                    + Add
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}