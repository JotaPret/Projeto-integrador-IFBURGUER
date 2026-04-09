'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import Footer from '@/components/Footer/Footer'
import { useCart } from '@/components/Cart/CartContext'
import { formatPriceBRL } from '@/components/Cart/cart-utils'

const TAXA_ENTREGA = 7.9

export default function Carrinho() {
    const { items, subtotal, totalItems, removeItem, increaseItem, decreaseItem, clearCart } = useCart()

    const entrega = items.length > 0 ? TAXA_ENTREGA : 0
    const total = subtotal + entrega

    return (
        <div className='min-h-screen bg-[var(--prim)]'>
            <div className='px-[8%] lg:px-[16%] py-10'>
                <div className='mb-8'>
                    <h1 className='text-white font-black text-4xl md:text-5xl'>Carrinho</h1>
                    <p className='text-gray-500 mt-1'>Revise seus itens antes de finalizar</p>
                </div>

                {items.length === 0 ? (
                    <div className='bg-[#1a0a0a] border border-white/10 rounded-3xl p-10 text-center'>
                        <div className='w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4'>
                            <ShoppingBag className='w-8 h-8 text-white/80' />
                        </div>
                        <h2 className='text-white font-black text-2xl'>Seu carrinho esta vazio</h2>
                        <p className='text-gray-500 text-sm mt-2'>Escolha alguns produtos do cardapio para comecar.</p>

                        <Link
                            href='/Cardapio'
                            className='mt-6 inline-flex bg-[#E31837] hover:opacity-90 text-white font-bold rounded-full px-6 h-11 text-sm items-center no-underline transition-opacity'
                        >
                            Ver cardapio
                        </Link>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6'>
                        <div className='space-y-4'>
                            {items.map(item => (
                                <div key={item.id} className='bg-[#1a0a0a] border border-white/5 rounded-2xl p-4'>
                                    <div className='flex gap-4'>
                                        <div className='relative w-24 h-24 rounded-xl overflow-hidden shrink-0'>
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className='object-cover'
                                            />
                                        </div>

                                        <div className='flex-1 min-w-0'>
                                            <h3 className='text-white font-bold text-lg truncate'>{item.name}</h3>
                                            <p className='text-gray-500 text-sm mt-1 line-clamp-2'>{item.description}</p>
                                            <p className='text-[#E31837] font-black text-lg mt-2'>{formatPriceBRL(item.price)}</p>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className='h-10 w-10 rounded-full bg-white/5 text-red-400 hover:text-red-300 border-none cursor-pointer transition-colors'
                                        >
                                            <Trash2 className='w-4 h-4 mx-auto' />
                                        </button>
                                    </div>

                                    <div className='mt-4 flex items-center justify-between'>
                                        <div className='flex items-center gap-2'>
                                            <button
                                                onClick={() => decreaseItem(item.id)}
                                                className='h-9 w-9 rounded-full bg-white/10 text-white border-none cursor-pointer hover:bg-white/20 transition-colors'
                                            >
                                                <Minus className='w-4 h-4 mx-auto' />
                                            </button>
                                            <span className='text-white font-black text-lg min-w-6 text-center'>{item.quantity}</span>
                                            <button
                                                onClick={() => increaseItem(item.id)}
                                                className='h-9 w-9 rounded-full bg-[#E31837] text-white border-none cursor-pointer hover:opacity-90 transition-opacity'
                                            >
                                                <Plus className='w-4 h-4 mx-auto' />
                                            </button>
                                        </div>

                                        <p className='text-white font-black text-lg'>
                                            {formatPriceBRL(item.price * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <aside className='bg-[#1a0a0a] border border-white/10 rounded-2xl p-5 h-fit lg:sticky lg:top-6'>
                            <h2 className='text-white font-black text-xl mb-4'>Resumo do pedido</h2>

                            <div className='space-y-3'>
                                <div className='flex items-center justify-between text-sm'>
                                    <span className='text-gray-400'>Itens ({totalItems})</span>
                                    <span className='text-white'>{formatPriceBRL(subtotal)}</span>
                                </div>

                                <div className='flex items-center justify-between text-sm'>
                                    <span className='text-gray-400'>Entrega</span>
                                    <span className='text-white'>{formatPriceBRL(entrega)}</span>
                                </div>

                                <div className='border-t border-white/10 pt-3 flex items-center justify-between'>
                                    <span className='text-white font-bold'>Total</span>
                                    <span className='text-[#E31837] font-black text-xl'>{formatPriceBRL(total)}</span>
                                </div>
                            </div>

                            <button className='w-full h-12 rounded-xl border-none bg-[#E31837] text-white text-sm font-black cursor-pointer hover:opacity-90 transition-opacity mt-5'>
                                Finalizar pedido
                            </button>

                            <button
                                onClick={clearCart}
                                className='w-full h-11 rounded-xl border border-white/20 bg-transparent text-white text-sm font-bold cursor-pointer hover:bg-white/10 transition-colors mt-3'
                            >
                                Limpar carrinho
                            </button>

                            <Link
                                href='/Cardapio'
                                className='w-full h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold flex items-center justify-center no-underline transition-colors mt-3'
                            >
                                Adicionar mais itens
                            </Link>
                        </aside>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    )
}
