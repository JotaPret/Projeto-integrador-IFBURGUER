'use client'
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Flame, UtensilsCrossed, Coffee, IceCream, Salad } from 'lucide-react'
import { useCart } from '@/components/Cart/CartContext'
import { formatPriceBRL } from '@/components/Cart/cart-utils'
import Footer from '@/components/Footer/Footer'

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

function toCategoriaId(value) {
    const normalized = String(value || '')
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()

    if (normalized.startsWith('burger')) {
        return 'burgers'
    }

    if (normalized.startsWith('combo')) {
        return 'combos'
    }

    if (normalized.startsWith('bebida')) {
        return 'bebidas'
    }

    if (normalized.startsWith('sobremesa')) {
        return 'sobremesas'
    }

    if (normalized.startsWith('acompanh')) {
        return 'acompanhamentos'
    }

    return normalized
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

const categorias = [
    { id: 'burgers', label: 'Burgers', icon: Flame },
    { id: 'combos', label: 'Combos', icon: UtensilsCrossed },
    { id: 'bebidas', label: 'Bebidas', icon: Coffee },
    { id: 'sobremesas', label: 'Sobremesas', icon: IceCream },
    { id: 'acompanhamentos', label: 'Acompanhamentos', icon: Salad },
]

export default function Cardapio() {
    const [categoriaAtiva, setCategoriaAtiva] = useState('burgers')
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
                const response = await fetch(`${backendBaseUrl}/produtos`, {
                    method: 'GET',
                    cache: 'no-store',
                })

                if (!response.ok) {
                    throw new Error('Falha ao carregar produtos')
                }

                const payload = await response.json()

                const normalized = Array.isArray(payload)
                    ? payload.map(item => ({
                        id: Number(item.id),
                        titulo: String(item.titulo || ''),
                        descricao: String(item.descricao || ''),
                        foto: String(item.foto || ''),
                        preco: Number(item.preco) || 0,
                        categoria: String(item.categoria || ''),
                        top: Boolean(Number(item.top)),
                        desconto: Number(item.desconto) || 0,
                        fimDesconto: item.fimDesconto || null,
                    }))
                    : []

                if (!isCancelled) {
                    setProdutos(normalized)
                }
            } catch {
                if (!isCancelled) {
                    setLoadError('Nao foi possivel carregar o cardapio.')
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

    const produtosPorCategoria = useMemo(() => {
        const initial = {
            burgers: [],
            combos: [],
            bebidas: [],
            sobremesas: [],
            acompanhamentos: [],
        }

        for (const produto of produtos) {
            const categoriaId = toCategoriaId(produto.categoria)
            if (Object.prototype.hasOwnProperty.call(initial, categoriaId)) {
                initial[categoriaId].push(produto)
            }
        }

        return initial
    }, [produtos])

    const itens = produtosPorCategoria[categoriaAtiva] || []
    const categoriaInfo = categorias.find(c => c.id === categoriaAtiva)

    const handleAddItem = item => {
        const precoAtual = getPrecoAtual(item)
        addItem({
            id: `produto-${item.id}`,
            produtoId: item.id,
            name: item.titulo,
            description: item.descricao,
            image: item.foto,
            price: precoAtual,
        })
    }

    return (
        <div className='min-h-screen bg-[var(--prim)]'>
            <div className='px-[8%] lg:px-[16%] py-10'>

                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-white font-black text-4xl md:text-5xl'>Cardápio</h1>
                    <p className='text-gray-500 mt-1'>Escolha seus favoritos</p>
                </div>

                {/* Categoria Tabs */}
                <div className='flex items-center gap-3 flex-wrap mb-12'>
                    {categorias.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setCategoriaAtiva(id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer border-none
                                ${categoriaAtiva === id
                                    ? 'bg-white text-[#0f0505]'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <Icon className='w-4 h-4' />
                            {label}
                        </button>
                    ))}
                </div>

                <div className='border-t border-white/10 mb-10' />

                {/* Seção de Produtos */}
                <div className='mb-6'>
                    <h2 className='text-white font-black text-3xl'>{categoriaInfo?.label}</h2>
                    <p className='text-gray-500 text-sm mt-1'>
                        {isLoading ? 'Carregando...' : `${itens.length} itens disponíveis`}
                    </p>
                    {loadError && <p className='text-gray-500 text-xs mt-2'>{loadError}</p>}
                </div>

                {/* Grid de Produtos */}
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {itens.map((item) => (
                        <div key={item.id} className='bg-[#1a0a0a] rounded-2xl overflow-hidden border border-white/5 flex flex-col'>
                            {/* Image */}
                            <div className='relative h-44'>
                                <Image
                                    src={getSafeImageSrc(item.foto)}
                                    alt={item.titulo}
                                    fill
                                    className='object-cover'
                                />
                                {item.top && (
                                    <span className='absolute top-2 left-2 bg-[#F5A623] text-[#0f0505] text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1'>
                                        <Flame className='w-3 h-3' /> TOP
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <div className='p-3 flex flex-col flex-1'>
                                <h3 className='text-white font-bold text-sm'>{item.titulo}</h3>
                                <p className='text-gray-500 text-xs mt-1 mb-3 line-clamp-2'>{item.descricao}</p>

                                <div className='flex items-center justify-between mt-auto'>
                                    {isPromoAtiva(item) ? (
                                        <div className='flex flex-col leading-tight'>
                                            <span className='text-gray-500 text-[11px] line-through'>
                                                {formatPriceBRL(Number(item.preco) || 0)}
                                            </span>
                                            <span className='text-[#E31837] font-black text-sm'>
                                                {formatPriceBRL(getPrecoAtual(item))}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className='text-[#E31837] font-black text-sm'>
                                            {formatPriceBRL(Number(item.preco) || 0)}
                                        </span>
                                    )}
                                    <button
                                        onClick={() => handleAddItem(item)}
                                        className='bg-[#E31837] hover:opacity-90 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-opacity cursor-pointer border-none'
                                    >
                                        + Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    )
}