'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '@/components/Cart/CartContext'
import { formatPriceBRL } from '@/components/Cart/cart-utils'

export default function CartDrawer() {
    const {
        items,
        isOpen,
        subtotal,
        totalItems,
        closeCart,
        clearCart,
        removeItem,
        increaseItem,
        decreaseItem,
    } = useCart()

    return (
        <div className={`fixed inset-0 z-[80] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <button
                onClick={closeCart}
                aria-label='Fechar carrinho'
                className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            />

            <aside
                className={`absolute right-0 top-0 h-full w-full max-w-md bg-[#120707] border-l border-white/10 shadow-2xl transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className='h-full flex flex-col'>
                    <div className='px-5 py-4 border-b border-white/10 flex items-center justify-between'>
                        <div>
                            <h2 className='text-white font-black text-xl'>Seu carrinho</h2>
                            <p className='text-gray-500 text-xs'>{totalItems} item(ns)</p>
                        </div>

                        <button
                            onClick={closeCart}
                            className='h-9 w-9 rounded-full border border-white/20 bg-transparent text-white hover:bg-white/10 transition-colors cursor-pointer'
                        >
                            <X className='w-4 h-4 mx-auto' />
                        </button>
                    </div>

                    {items.length === 0 ? (
                        <div className='flex-1 px-5 py-10 flex flex-col items-center justify-center text-center'>
                            <div className='w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-4'>
                                <ShoppingBag className='w-7 h-7 text-white/80' />
                            </div>
                            <p className='text-white font-bold'>Carrinho vazio</p>
                            <p className='text-gray-500 text-sm mt-1'>Adicione produtos para montar seu pedido.</p>

                            <Link
                                href='/Cardapio'
                                onClick={closeCart}
                                className='mt-6 bg-[#E31837] hover:opacity-90 text-white font-bold rounded-full px-6 h-11 text-sm flex items-center no-underline transition-opacity'
                            >
                                Ir para cardapio
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className='flex-1 overflow-y-auto px-5 py-4 space-y-3'>
                                {items.map(item => (
                                    <div key={item.id} className='bg-[#1a0a0a] border border-white/5 rounded-2xl p-3'>
                                        <div className='flex gap-3'>
                                            <div className='relative w-16 h-16 rounded-xl overflow-hidden shrink-0'>
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className='object-cover'
                                                />
                                            </div>

                                            <div className='flex-1 min-w-0'>
                                                <p className='text-white text-sm font-bold truncate'>{item.name}</p>
                                                <p className='text-gray-500 text-xs line-clamp-1'>{item.description}</p>
                                                <p className='text-[#E31837] font-black text-sm mt-1'>{formatPriceBRL(item.price)}</p>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className='text-red-400 hover:text-red-300 bg-transparent border-none cursor-pointer'
                                            >
                                                <Trash2 className='w-4 h-4' />
                                            </button>
                                        </div>

                                        <div className='mt-3 flex items-center justify-between'>
                                            <div className='flex items-center gap-2'>
                                                <button
                                                    onClick={() => decreaseItem(item.id)}
                                                    className='h-7 w-7 rounded-full bg-white/10 text-white border-none cursor-pointer hover:bg-white/20 transition-colors'
                                                >
                                                    <Minus className='w-3.5 h-3.5 mx-auto' />
                                                </button>
                                                <span className='text-white text-sm font-bold min-w-5 text-center'>{item.quantity}</span>
                                                <button
                                                    onClick={() => increaseItem(item.id)}
                                                    className='h-7 w-7 rounded-full bg-[#E31837] text-white border-none cursor-pointer hover:opacity-90 transition-opacity'
                                                >
                                                    <Plus className='w-3.5 h-3.5 mx-auto' />
                                                </button>
                                            </div>

                                            <p className='text-white text-sm font-black'>
                                                {formatPriceBRL(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='px-5 py-4 border-t border-white/10'>
                                <div className='flex items-center justify-between mb-1'>
                                    <span className='text-gray-400 text-sm'>Subtotal</span>
                                    <span className='text-white font-black'>{formatPriceBRL(subtotal)}</span>
                                </div>

                                <div className='flex items-center gap-2 mt-4'>
                                    <button
                                        onClick={clearCart}
                                        className='h-11 px-4 rounded-xl border border-white/20 bg-transparent text-white text-sm font-bold cursor-pointer hover:bg-white/10 transition-colors'
                                    >
                                        Limpar
                                    </button>

                                    <Link
                                        href='/Carrinho'
                                        onClick={closeCart}
                                        className='flex-1 h-11 rounded-xl border-none bg-[#E31837] text-white text-sm font-black flex items-center justify-center no-underline hover:opacity-90 transition-opacity'
                                    >
                                        Ir para carrinho
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </aside>
        </div>
    )
}
