'use client'
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Star, ShoppingBag, Gift, Trophy } from 'lucide-react'
import Footer from '@/components/Footer/Footer'
import { useCart } from '@/components/Cart/CartContext'
import { inferProdutoIdFromName } from '@/components/Cart/cart-utils'

function getBackendBaseUrl() {
    const fromEnv = process.env.NEXT_PUBLIC_BACKEND_URL
    if (fromEnv) return fromEnv

    if (typeof window !== 'undefined') {
        const url = new URL(window.location.origin)
        url.port = '3334'
        url.pathname = '/api/v1'
        return url.toString().replace(/\/$/, '')
    }

    return 'http://localhost:3334/api/v1'
}

type ProdutoResgate = {
    id: number
    nome: string
    pontos: number
    imagem: string
}

type CartItem = {
    id: string | number
    produtoId?: number | null
    name: string
    description?: string
    image?: string
    price: number
    quantity: number
}

type CartValue = {
    items: CartItem[]
    addItem: (item: Partial<CartItem> & { id: CartItem['id']; name: string; price: number }) => void
    removeItem: (itemId: CartItem['id']) => void
    openCart: () => void
}

const produtosResgate: ProdutoResgate[] = [
    { id: 1, nome: 'Combo Kids', pontos: 33, imagem: 'https://images.unsplash.com/photo-1550950158-d0d960dff596?w=400&h=300&fit=crop' },
    { id: 2, nome: 'Milkshake Chocolate', pontos: 13, imagem: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=300&fit=crop' },
    { id: 3, nome: 'Veggie Burger', pontos: 17, imagem: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' },
    { id: 4, nome: 'Petit Gateau', pontos: 23, imagem: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop' },
    { id: 5, nome: 'Texas BBQ Burger', pontos: 37, imagem: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop' },
    { id: 6, nome: 'Água Mineral 500ml', pontos: 5, imagem: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop' },
    { id: 7, nome: 'Milkshake Ovomaltine', pontos: 20, imagem: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&h=300&fit=crop' },
    { id: 8, nome: 'Churros com Nutella', pontos: 15, imagem: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=400&h=300&fit=crop' },
    { id: 9, nome: 'Milkshake Morango', pontos: 19, imagem: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop' },
    { id: 10, nome: 'Chicken Crispy', pontos: 29, imagem: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop' },
    { id: 11, nome: 'Nuggets 10un', pontos: 22, imagem: 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&h=300&fit=crop' },
    { id: 12, nome: 'Combo Triplo', pontos: 65, imagem: 'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=400&h=300&fit=crop' },
    { id: 13, nome: 'Onion Rings', pontos: 19, imagem: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop' },
    { id: 14, nome: 'Suco Natural Laranja', pontos: 13, imagem: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop' },
    { id: 15, nome: 'Batata Cheddar Bacon', pontos: 16, imagem: 'https://images.unsplash.com/photo-1624355651893-c88ac00b5a07?w=400&h=300&fit=crop' },
    { id: 16, nome: 'Bacon Lover', pontos: 39, imagem: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca368f?w=400&h=300&fit=crop' },
    { id: 17, nome: 'Brownie com Sorvete', pontos: 20, imagem: 'https://images.unsplash.com/photo-1606313564200-e75d5e341154?w=400&h=300&fit=crop' },
    { id: 18, nome: 'Double Cheese', pontos: 43, imagem: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop' },
    { id: 19, nome: 'Batata Frita', pontos: 17, imagem: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&h=300&fit=crop' },
    { id: 20, nome: 'Combo Individual', pontos: 46, imagem: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&h=300&fit=crop' },
    { id: 21, nome: 'Coca-Cola 500ml', pontos: 9, imagem: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop' },
    { id: 22, nome: 'Smash Burger Clássico', pontos: 33, imagem: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop' },
]

const historico = [
    { id: 1, nome: 'Texas BBQ Burger', pontos: -37, data: '15/04/2026' },
]

const pontosParaPrata = 200

type MeResponse = {
    user?: {
        id: number
        nome: string
        pontos?: number
    }
}

export default function Fidelidade() {
    const router = useRouter()
    const { items: cartItems, addItem, removeItem, openCart } = useCart() as unknown as CartValue

    const [nomeUsuario, setNomeUsuario] = useState('')
    const [pontos, setPontos] = useState(0)
    const [isRedeeming, setIsRedeeming] = useState(false)

    useEffect(() => {
        let ignore = false

        const loadMe = async () => {
            try {
                const backendBaseUrl = getBackendBaseUrl()
                const response = await fetch(`${backendBaseUrl}/auth/me`, {
                    method: 'GET',
                    credentials: 'include',
                })

                if (!response.ok) {
                    router.replace('/login?redirect=%2FFidelidade')
                    return
                }

                const payload = (await response.json()) as MeResponse
                const user = payload?.user
                if (!user?.id || ignore) {
                    return
                }

                setNomeUsuario(user.nome || '')
                setPontos(Number.isFinite(Number(user.pontos)) ? Number(user.pontos) : 0)
            } catch {
                if (!ignore) {
                    router.replace('/login?redirect=%2FFidelidade')
                }
            }
        }

        loadMe().catch(() => {})

        return () => {
            ignore = true
        }
    }, [router])

    const nivel = useMemo(() => {
        return pontos >= pontosParaPrata ? 'Prata' : 'Bronze'
    }, [pontos])

    const podeResgatar = (pts: number) => pontos >= pts

    const handleResgatar = async (item: ProdutoResgate) => {
        if (!podeResgatar(item.pontos)) {
            return
        }

        if (isRedeeming) {
            return
        }

        const produtoId = inferProdutoIdFromName(item.nome)
        if (!Number.isInteger(produtoId)) {
            return
        }

        setIsRedeeming(true)

        try {
            const backendBaseUrl = getBackendBaseUrl()
            const response = await fetch(`${backendBaseUrl}/auth/redeem`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pontos: item.pontos }),
            })

            if (!response.ok) {
                return
            }

            const payload = (await response.json()) as { user?: { pontos?: number } }
            const pontosAtualizados = Number(payload?.user?.pontos)
            if (Number.isFinite(pontosAtualizados)) {
                setPontos(pontosAtualizados)
            } else {
                setPontos(prev => Math.max(0, prev - item.pontos))
            }
        } finally {
            setIsRedeeming(false)
        }

        for (const existing of cartItems.filter(cartItem => cartItem?.produtoId === produtoId)) {
            removeItem(existing.id)
        }

        addItem({
            id: `produto-${produtoId}`,
            produtoId,
            name: item.nome,
            description: 'Resgate de fidelidade',
            image: item.imagem,
            price: 0,
        })

        openCart()
    }

    return (
        <div className='min-h-screen bg-[var(--prim)]'>
            <div className='px-[8%] lg:px-[16%] py-10'>

                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-white font-black text-4xl md:text-5xl'>Programa de Fidelidade</h1>
                    <p className='text-gray-500 text-sm mt-1'>Acumule pontos e resgate produtos grátis</p>
                </div>

                {/* Card de Pontos */}
                <div className='w-full bg-gradient-to-r from-[#E31837] to-[#c41530] rounded-2xl p-6 mb-6'>
                    <div className='flex items-start justify-between mb-4'>
                        <div>
                            <p className='text-white/70 text-sm'>Olá{nomeUsuario ? `, ${nomeUsuario}!` : '!'}</p>
                            <p className='text-white/70 text-xs mt-0.5'>Nível atual</p>
                            <div className='flex items-center gap-1.5 mt-1'>
                                <Trophy className='w-4 h-4 text-[#F5A623]' />
                                <span className='text-[#F5A623] font-black'>{nivel}</span>
                            </div>
                        </div>
                        <div className='text-right'>
                            <p className='text-white/70 text-xs'>Seus pontos</p>
                            <p className='text-white font-black text-5xl leading-none'>{pontos}</p>
                            <p className='text-white/70 text-xs'>pontos</p>
                        </div>
                    </div>

                    {/* Barra de Progresso */}
                    <div className='mt-4'>
                        <div className='flex justify-between text-xs text-white/70 mb-1'>
                            <span>Bronze</span>
                            <span>Prata (200 pts)</span>
                        </div>
                        <div className='w-full bg-white/20 rounded-full h-2'>
                            <div
                                className='bg-white rounded-full h-2 transition-all'
                                style={{ width: `${Math.min((pontos / pontosParaPrata) * 100, 100)}%` }}
                            />
                        </div>
                        <p className='text-white/70 text-xs mt-1'>{Math.max(0, pontosParaPrata - pontos)} pontos para Prata</p>
                    </div>
                </div>

                {/* Como Funciona */}
                <div className='bg-white/5 border border-white/10 rounded-2xl p-6 mb-10'>
                    <div className='flex items-center gap-2 mb-5'>
                        <Star className='w-5 h-5 text-[#F5A623]' />
                        <h2 className='text-white font-bold'>Como funciona</h2>
                    </div>
                    <div className='grid grid-cols-3 gap-4 text-center'>
                        <div>
                            <div className='w-10 h-10 bg-[#E31837]/20 rounded-full flex items-center justify-center mx-auto mb-2'>
                                <ShoppingBag className='w-5 h-5 text-[#E31837]' />
                            </div>
                            <p className='text-white font-bold text-sm'>Peça</p>
                            <p className='text-gray-500 text-xs mt-0.5'>Faça pedidos no site</p>
                        </div>
                        <div>
                            <div className='w-10 h-10 bg-[#F5A623]/20 rounded-full flex items-center justify-center mx-auto mb-2'>
                                <Star className='w-5 h-5 text-[#F5A623]' />
                            </div>
                            <p className='text-white font-bold text-sm'>Acumule</p>
                            <p className='text-gray-500 text-xs mt-0.5'>1 ponto por R$1 gasto</p>
                        </div>
                        <div>
                            <div className='w-10 h-10 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-2'>
                                <Gift className='w-5 h-5 text-green-500' />
                            </div>
                            <p className='text-white font-bold text-sm'>Resgate</p>
                            <p className='text-gray-500 text-xs mt-0.5'>Troque por produtos grátis</p>
                        </div>
                    </div>
                </div>

                {/* Resgatar Produtos */}
                <div className='mb-10'>
                    <div className='flex items-center gap-2 mb-6'>
                        <Gift className='w-5 h-5 text-[#F5A623]' />
                        <h2 className='text-white font-black text-2xl'>Resgatar Produtos</h2>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                        {produtosResgate.map((item) => {
                            const pode = podeResgatar(item.pontos)
                            return (
                                <div key={item.id} className='bg-[#1a0a0a] rounded-2xl overflow-hidden border border-white/5'>
                                    <div className='relative h-36'>
                                        <Image
                                            src={item.imagem}
                                            alt={item.nome}
                                            fill
                                            className='object-cover'
                                        />
                                    </div>
                                    <div className='p-3'>
                                        <h3 className='text-white font-bold text-sm mb-2'>{item.nome}</h3>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-1'>
                                                <Star className='w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]' />
                                                <span className='text-[#F5A623] font-bold text-xs'>{item.pontos} pts</span>
                                            </div>
                                            <button
                                                disabled={!pode || isRedeeming}
                                                onClick={() => pode && handleResgatar(item)}
                                                className={`text-xs font-bold px-3 py-1.5 rounded-full border-none cursor-pointer transition-opacity
                                                    ${pode
                                                        ? 'bg-[#E31837] hover:opacity-90 text-white'
                                                        : 'bg-white/5 text-gray-600 cursor-not-allowed'
                                                    }`}
                                            >
                                                {pode ? 'Resgatar' : 'Pontos insuf.'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>  

                {/* Histórico */}
                <div className='mb-10'>
                    <h2 className='text-white font-black text-2xl mb-4'>Histórico de Resgates</h2>
                    <div className='space-y-3'>
                        {historico.map((item) => (
                            <div key={item.id} className='flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center'>
                                        <Gift className='w-4 h-4 text-green-500' />
                                    </div>
                                    <div>
                                        <p className='text-white font-bold text-sm'>{item.nome}</p>
                                        <p className='text-gray-500 text-xs'>{item.data}</p>
                                    </div>
                                </div>
                                <span className='text-[#E31837] font-black text-sm'>{item.pontos} pts</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    )
}