'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Flame } from 'lucide-react'
import { useCart } from '@/components/Cart/CartContext'
import { formatPriceBRL } from '@/components/Cart/cart-utils'

function getBackendBaseUrl() {
    if (typeof window === 'undefined') {
        return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3334/api/v1'
    }

    const envUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    if (envUrl) {
        return envUrl
    }

    const host = window.location.hostname
    return `http://${host}:3334/api/v1`
}

function isPromoAtiva(produto) {
    if (!produto || !produto.desconto || Number(produto.desconto) <= 0) {
        return false
    }

    if (!produto.fimDesconto) {
        return true
    }

    const endsAt = new Date(produto.fimDesconto).getTime()
    return Number.isFinite(endsAt) ? endsAt > Date.now() : true
}

function getPrecoAtual(produto) {
    const preco = Number(produto?.preco) || 0
    if (!isPromoAtiva(produto)) {
        return preco
    }

    const desconto = Number(produto.desconto) || 0
    const factor = 1 - desconto / 100
    return Math.max(0, preco * factor)
}

function getSafeImageSrc(value) {
    const src = String(value || '').trim()

    if (!src) {
        return '/suporte.png'
    }

    if (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')) {
        return src
    }

    return '/suporte.png'
}

export default function MaisPedidos() {
    const { addItem } = useCart()

    const [produtos, setProdutos] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState('')

    useEffect(() => {
        let isCancelled = false

        async function load() {
            setIsLoading(true)
            setLoadError('')

            try {
                const backendBaseUrl = getBackendBaseUrl()
                const response = await fetch(`${backendBaseUrl}/produtos/top`, {
                    method: 'GET',
                    cache: 'no-store',
                })

                if (!response.ok) {
                    throw new Error('Falha ao carregar top')
                }

                const payload = await response.json()
                const normalized = Array.isArray(payload)
                    ? payload.map(item => ({
                        id: Number(item.id),
                        titulo: String(item.titulo || ''),
                        descricao: String(item.descricao || ''),
                        foto: String(item.foto || ''),
                        preco: Number(item.preco) || 0,
                        desconto: Number(item.desconto) || 0,
                        fimDesconto: item.fimDesconto || null,
                    }))
                    : []

                if (!isCancelled) {
                    setProdutos(normalized.slice(0, 4))
                }
            } catch {
                if (!isCancelled) {
                    setLoadError('Nao foi possivel carregar os mais pedidos.')
                    setProdutos([])
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false)
                }
            }
        }

        load()
        return () => {
            isCancelled = true
        }
    }, [])

    const handleAddItem = produto => {
        const precoAtual = getPrecoAtual(produto)
        addItem({
            id: `produto-${produto.id}`,
            produtoId: produto.id,
            name: produto.titulo,
            description: produto.descricao,
            image: produto.foto,
            price: precoAtual,
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

            {loadError && <p className='text-gray-500 text-xs mb-4'>{loadError}</p>}

            {/* Cards */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {!isLoading && produtos.map((produto) => (
                    <div key={produto.id} className='bg-[#1a0a0a] rounded-2xl overflow-hidden flex flex-col'>
                        {/* Image */}
                        <div className='relative h-40'>
                            <Image
                                src={getSafeImageSrc(produto.foto)}
                                alt={produto.titulo}
                                fill
                                className='object-cover'
                            />
                            <span className='absolute top-2 left-2 bg-[#F5A623] text-[#0f0505] text-[10px] font-black px-2 py-0.5 rounded-full'>
                                TOP
                            </span>
                        </div>

                        {/* Content */}
                        <div className='p-3 flex flex-col flex-1'>
                            <h3 className='text-white font-bold text-sm'>{produto.titulo}</h3>
                            <p className='text-gray-500 text-xs mt-1 mb-3 line-clamp-2'>{produto.descricao}</p>

                            <div className='flex items-center justify-between mt-auto'>
                                <span className='text-white font-black text-sm'>{formatPriceBRL(getPrecoAtual(produto))}</span>
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