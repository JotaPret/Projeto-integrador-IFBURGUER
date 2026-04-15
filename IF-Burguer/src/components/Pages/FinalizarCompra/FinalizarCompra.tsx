'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'
import Footer from '@/components/Footer/Footer'
import { useCart } from '@/components/Cart/CartContext'
import { formatPriceBRL } from '@/components/Cart/cart-utils'

const TAXA_ENTREGA = 7.9

const BACKEND_BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3334/api/v1'

type PaymentMethod = 'pix' | 'card' | 'cash'

type CartItem = {
    id: string | number
    name: string
    description?: string
    image?: string
    price: number
    quantity: number
}

type CartValue = {
    items: CartItem[]
    subtotal: number
    totalItems: number
    clearCart: () => void
}

type MeResponse = {
    user?: {
        id: number
        nome: string
        email: string | null
        telefone: string | null
        createdAt: string
    }
}

export default function FinalizarCompra() {
    const router = useRouter()
    const { items, subtotal, totalItems, clearCart } = useCart() as unknown as CartValue

    const [nome, setNome] = useState('')
    const [telefone, setTelefone] = useState('')
    const [endereco, setEndereco] = useState('')
    const [complemento, setComplemento] = useState('')
    const [observacoes, setObservacoes] = useState('')
    const [pagamento, setPagamento] = useState<PaymentMethod>('pix')

    const [showEntregaConcluida, setShowEntregaConcluida] = useState(false)

    useEffect(() => {
        let isActive = true

        const loadProfile = async () => {
            try {
                const response = await fetch(`${BACKEND_BASE_URL}/auth/me`, {
                    method: 'GET',
                    credentials: 'include',
                })

                if (!response.ok) {
                    return
                }

                const payload = (await response.json()) as MeResponse
                const profile = payload?.user
                if (!profile || !isActive) {
                    return
                }

                setNome(prev => (prev.trim() ? prev : (profile.nome ?? prev)))
                setTelefone(prev => (prev.trim() ? prev : (profile.telefone ?? prev)))
            } catch {
                // ignore
            }
        }

        loadProfile()

        return () => {
            isActive = false
        }
    }, [])

    useEffect(() => {
        if (!showEntregaConcluida) {
            return
        }

        const timeoutId = window.setTimeout(() => {
            router.push('/')
        }, 2500)

        return () => {
            window.clearTimeout(timeoutId)
        }
    }, [showEntregaConcluida, router])

    const entrega = items.length > 0 ? TAXA_ENTREGA : 0
    const total = subtotal + entrega

    const canConfirm =
        items.length > 0 &&
        nome.trim().length > 0 &&
        telefone.trim().length > 0 &&
        endereco.trim().length > 0

    const handleConfirm = () => {
        if (!canConfirm || showEntregaConcluida) {
            return
        }

        clearCart()
        setShowEntregaConcluida(true)
    }

    return (
        <div className='min-h-screen bg-[var(--prim)]'>
            <div className='px-[8%] lg:px-[16%] py-10'>
                <div className='flex items-center gap-3 mb-8'>
                    <div className='w-10 h-10 bg-[#E31837] rounded-xl flex items-center justify-center'>
                        <ShoppingBag className='w-5 h-5 text-white' />
                    </div>
                    <div>
                        <h1 className='text-white font-black text-4xl md:text-5xl'>Finalizar compra</h1>
                        <p className='text-gray-500 text-sm mt-0.5'>Confirme seus dados e finalize seu pedido</p>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className='bg-[#1a0a0a] border border-white/10 rounded-3xl p-10 text-center'>
                        <div className='w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4'>
                            <ShoppingBag className='w-8 h-8 text-white/80' />
                        </div>
                        <h2 className='text-white font-black text-2xl'>Seu carrinho está vazio</h2>
                        <p className='text-gray-500 text-sm mt-2'>Adicione itens no cardápio para poder finalizar.</p>

                        <Link
                            href='/Cardapio'
                            className='mt-6 inline-flex bg-[#E31837] hover:opacity-90 text-white font-bold rounded-full px-6 h-11 text-sm items-center no-underline transition-opacity'
                        >
                            Ver cardápio
                        </Link>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6'>
                        <div className='space-y-4'>
                            <section className='bg-[#1a0a0a] border border-white/10 rounded-2xl p-5'>
                                <h2 className='text-white font-black text-xl'>Entrega</h2>
                                <p className='text-gray-500 text-sm mt-1'>Informe onde você quer receber.</p>

                                <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-3'>
                                    <div>
                                        <label className='block text-gray-400 text-xs font-bold mb-2'>Nome completo</label>
                                        <input
                                            value={nome}
                                            onChange={event => setNome(event.target.value)}
                                            placeholder='Ex: Maria Silva'
                                            className='w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-2xl px-4 py-3.5 outline-none focus:border-[#E31837] transition-colors text-sm'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-gray-400 text-xs font-bold mb-2'>Telefone</label>
                                        <input
                                            value={telefone}
                                            onChange={event => setTelefone(event.target.value)}
                                            placeholder='(00) 00000-0000'
                                            className='w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-2xl px-4 py-3.5 outline-none focus:border-[#E31837] transition-colors text-sm'
                                        />
                                    </div>
                                </div>

                                <div className='mt-3 grid grid-cols-1 gap-3'>
                                    <div>
                                        <label className='block text-gray-400 text-xs font-bold mb-2'>Endereço</label>
                                        <input
                                            value={endereco}
                                            onChange={event => setEndereco(event.target.value)}
                                            placeholder='Rua, número, bairro'
                                            className='w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-2xl px-4 py-3.5 outline-none focus:border-[#E31837] transition-colors text-sm'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-gray-400 text-xs font-bold mb-2'>Complemento (opcional)</label>
                                        <input
                                            value={complemento}
                                            onChange={event => setComplemento(event.target.value)}
                                            placeholder='Apto, bloco, referência'
                                            className='w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-2xl px-4 py-3.5 outline-none focus:border-[#E31837] transition-colors text-sm'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-gray-400 text-xs font-bold mb-2'>Observações (opcional)</label>
                                        <textarea
                                            value={observacoes}
                                            onChange={event => setObservacoes(event.target.value)}
                                            placeholder='Ex: sem cebola, tocar interfone...'
                                            rows={4}
                                            className='w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-2xl px-4 py-3.5 outline-none focus:border-[#E31837] transition-colors text-sm resize-none'
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className='bg-[#1a0a0a] border border-white/10 rounded-2xl p-5'>
                                <h2 className='text-white font-black text-xl'>Pagamento</h2>
                                <p className='text-gray-500 text-sm mt-1'>Escolha uma forma de pagamento.</p>

                                <div className='mt-4 space-y-3'>
                                    <label className='flex items-center justify-between gap-4 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-2xl px-4 py-3 cursor-pointer'>
                                        <div className='min-w-0'>
                                            <p className='text-white font-bold text-sm'>Pix</p>
                                            <p className='text-gray-500 text-xs truncate'>Aprovação imediata</p>
                                        </div>
                                        <input
                                            type='radio'
                                            name='pagamento'
                                            checked={pagamento === 'pix'}
                                            onChange={() => setPagamento('pix')}
                                            className='h-4 w-4 accent-[#E31837]'
                                        />
                                    </label>

                                    <label className='flex items-center justify-between gap-4 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-2xl px-4 py-3 cursor-pointer'>
                                        <div className='min-w-0'>
                                            <p className='text-white font-bold text-sm'>Cartão</p>
                                            <p className='text-gray-500 text-xs truncate'>Crédito ou débito</p>
                                        </div>
                                        <input
                                            type='radio'
                                            name='pagamento'
                                            checked={pagamento === 'card'}
                                            onChange={() => setPagamento('card')}
                                            className='h-4 w-4 accent-[#E31837]'
                                        />
                                    </label>

                                    <label className='flex items-center justify-between gap-4 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-2xl px-4 py-3 cursor-pointer'>
                                        <div className='min-w-0'>
                                            <p className='text-white font-bold text-sm'>Dinheiro</p>
                                            <p className='text-gray-500 text-xs truncate'>Pagamento na entrega</p>
                                        </div>
                                        <input
                                            type='radio'
                                            name='pagamento'
                                            checked={pagamento === 'cash'}
                                            onChange={() => setPagamento('cash')}
                                            className='h-4 w-4 accent-[#E31837]'
                                        />
                                    </label>
                                </div>
                            </section>
                        </div>

                        <aside className='bg-[#1a0a0a] border border-white/10 rounded-2xl p-5 h-fit lg:sticky lg:top-6'>
                            <h2 className='text-white font-black text-xl mb-4'>Resumo do pedido</h2>

                            <div className='space-y-3 max-h-[240px] overflow-y-auto pr-1'>
                                {items.map(item => (
                                    <div key={item.id} className='flex items-start justify-between gap-3'>
                                        <div className='min-w-0'>
                                            <p className='text-white text-sm font-bold truncate'>{item.name}</p>
                                            <p className='text-gray-500 text-xs'>Qtd: {item.quantity}</p>
                                        </div>
                                        <p className='text-white text-sm font-black shrink-0'>
                                            {formatPriceBRL(item.price * item.quantity)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className='mt-4 space-y-3'>
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

                            <button
                                disabled={!canConfirm || showEntregaConcluida}
                                onClick={handleConfirm}
                                className={`w-full h-12 rounded-xl border-none text-white text-sm font-black transition-opacity mt-5 ${
                                    canConfirm && !showEntregaConcluida
                                        ? 'bg-[#E31837] hover:opacity-90 cursor-pointer'
                                        : 'bg-white/10 opacity-60 cursor-not-allowed'
                                }`}
                            >
                                Confirmar pedido
                            </button>

                            <Link
                                href='/Carrinho'
                                className='w-full h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold flex items-center justify-center no-underline transition-colors mt-3'
                            >
                                Voltar ao carrinho
                            </Link>
                        </aside>
                    </div>
                )}
            </div>

            {showEntregaConcluida ? (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6'>
                    <div
                        role='dialog'
                        aria-modal='true'
                        aria-label='Entrega concluída'
                        className='w-full max-w-sm rounded-3xl border border-white/10 bg-[#1a0a0a] p-6 text-center shadow-2xl'
                    >
                        <img
                            src='/moto-entrega.gif'
                            alt='Moto de entrega'
                            className='mx-auto h-40 w-40 object-contain'
                            onError={event => {
                                event.currentTarget.style.display = 'none'
                            }}
                        />

                        <h3 className='text-white font-black text-2xl mt-2'>A entrega foi concluída</h3>
                        <p className='text-gray-500 text-sm mt-1'>Obrigado por comprar com a IF Burguer.</p>

                        <button
                            onClick={() => router.push('/')}
                            className='mt-5 w-full h-11 rounded-xl border-none bg-[#E31837] hover:opacity-90 text-white text-sm font-black cursor-pointer transition-opacity'
                        >
                            Ok
                        </button>
                    </div>
                </div>
            ) : null}

            <Footer />
        </div>
    )
}
