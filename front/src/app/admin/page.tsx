'use client'

import type { FormEvent } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

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

type Role = 'USER' | 'ADMIN'

type MePayload = {
    user?: {
        id?: number
        nome?: string
        email?: string | null
        role?: Role
    }
}

type Produto = {
    id: number
    titulo: string
    categoria: string
    descricao: string
    foto: string
    top: number
    avaliacao: number | string
    freteGratis: number
    preco: number | string
    desconto: number
    fimDesconto: string | null
}

type ProdutoFormState = {
    titulo: string
    categoria: string
    descricao: string
    foto: string
    preco: string
    desconto: string
    fimDesconto: string
    top: boolean
    freteGratis: boolean
    avaliacao: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === 'object'
}

function asNumber(value: unknown): number {
    if (typeof value === 'number') return value
    if (typeof value === 'string') return Number(value)
    if (isRecord(value) && typeof (value as { toString?: unknown }).toString === 'function') {
        return Number(String(value))
    }
    return Number.NaN
}

function toFormNumberString(value: unknown) {
    const numeric = asNumber(value)
    if (!Number.isFinite(numeric)) return ''
    return String(numeric)
}

function formatCurrency(value: unknown) {
    const numeric = asNumber(value)
    if (!Number.isFinite(numeric)) return '—'
    return `R$ ${numeric.toFixed(2).replace('.', ',')}`
}

function toDateTimeLocalValue(value: string | null) {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    const pad = (n: number) => String(n).padStart(2, '0')
    const yyyy = date.getFullYear()
    const mm = pad(date.getMonth() + 1)
    const dd = pad(date.getDate())
    const hh = pad(date.getHours())
    const min = pad(date.getMinutes())
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`
}

function parseOptionalInt(raw: string) {
    if (!raw.trim()) return undefined
    const n = Number(raw)
    if (!Number.isFinite(n)) return undefined
    return Math.trunc(n)
}

function parseOptionalNumber(raw: string) {
    if (!raw.trim()) return undefined
    const n = Number(raw)
    if (!Number.isFinite(n)) return undefined
    return n
}

function getApiErrorMessage(payload: unknown) {
    if (!payload) return 'Falha ao processar a requisicao.'
    if (typeof payload === 'string') return payload
    if (isRecord(payload)) {
        const message = payload.message
        if (Array.isArray(message)) return message.join(' | ')
        if (typeof message === 'string') return message
    }
    return 'Falha ao processar a requisicao.'
}

const EMPTY_FORM: ProdutoFormState = {
    titulo: '',
    categoria: '',
    descricao: '',
    foto: '',
    preco: '',
    desconto: '',
    fimDesconto: '',
    top: false,
    freteGratis: false,
    avaliacao: '',
}

function validateProdutoForm(form: ProdutoFormState) {
    if (!form.titulo.trim() || !form.categoria.trim() || !form.descricao.trim() || !form.foto.trim()) {
        return 'Preencha titulo, categoria, descricao e foto.'
    }

    const preco = Number(form.preco)
    if (!Number.isFinite(preco) || preco <= 0) {
        return 'Informe um preco valido (maior que zero).'
    }

    const desconto = parseOptionalInt(form.desconto)
    if (desconto !== undefined && (desconto < 0 || desconto > 100)) {
        return 'Desconto deve estar entre 0 e 100.'
    }

    const avaliacao = parseOptionalNumber(form.avaliacao)
    if (avaliacao !== undefined && (avaliacao < 0 || avaliacao > 5)) {
        return 'Avaliacao deve estar entre 0 e 5.'
    }

    return ''
}

export default function AdminPage() {
    const router = useRouter()
    const [meLoading, setMeLoading] = useState(true)
    const [me, setMe] = useState<MePayload['user'] | null>(null)

    const [produtos, setProdutos] = useState<Produto[]>([])
    const [produtosLoading, setProdutosLoading] = useState(true)
    const [actionLoadingId, setActionLoadingId] = useState<number | 'create' | null>(null)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [deleteCandidate, setDeleteCandidate] = useState<Produto | null>(null)
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)
    const [deleteModalError, setDeleteModalError] = useState('')
    const [createForm, setCreateForm] = useState<ProdutoFormState>(EMPTY_FORM)
    const [editForm, setEditForm] = useState<ProdutoFormState>(EMPTY_FORM)
    const [error, setError] = useState('')
    const [notice, setNotice] = useState('')

    const isAdmin = useMemo(() => me?.role === 'ADMIN', [me?.role])

    const loadMe = useCallback(async () => {
        setError('')

        try {
            const backendBaseUrl = getBackendBaseUrl()
            const response = await fetch(`${backendBaseUrl}/auth/me`, {
                credentials: 'include',
                cache: 'no-store',
            })

            if (!response.ok) {
                router.replace('/login?redirect=/admin')
                return
            }

            const payload = (await response.json()) as MePayload
            const user = payload?.user
            if (!user || user.role !== 'ADMIN') {
                router.replace('/')
                return
            }

            setMe(user)
        } catch {
            router.replace('/')
        } finally {
            setMeLoading(false)
        }
    }, [router])

    const loadProdutos = useCallback(async () => {
        setProdutosLoading(true)
        setError('')

        try {
            const backendBaseUrl = getBackendBaseUrl()
            const response = await fetch(`${backendBaseUrl}/produtos`, {
                cache: 'no-store',
            })

            if (!response.ok) {
                let message = 'Nao foi possivel carregar os produtos.'
                try {
                    const payload = await response.json()
                    message = getApiErrorMessage(payload)
                } catch {
                    // ignore
                }
                setError(message)
                return
            }

            const payload = (await response.json()) as Produto[]
            setProdutos(Array.isArray(payload) ? payload : [])
        } catch {
            setError('Falha de rede ao carregar produtos. Verifique o backend.')
        } finally {
            setProdutosLoading(false)
        }
    }, [])

    useEffect(() => {
        loadMe()
    }, [loadMe])

    useEffect(() => {
        if (!isAdmin) return
        loadProdutos()
    }, [isAdmin, loadProdutos])

    const startEdit = (produto: Produto) => {
        setNotice('')
        setError('')
        setEditingId(produto.id)
        setEditForm({
            titulo: produto.titulo ?? '',
            categoria: produto.categoria ?? '',
            descricao: produto.descricao ?? '',
            foto: produto.foto ?? '',
            preco: toFormNumberString(produto.preco),
            desconto: String(produto.desconto ?? ''),
            fimDesconto: toDateTimeLocalValue(produto.fimDesconto),
            top: Number(produto.top) === 1,
            freteGratis: Number(produto.freteGratis) === 1,
            avaliacao: toFormNumberString(produto.avaliacao),
        })
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditForm(EMPTY_FORM)
    }

    const handleCreate = async (event: FormEvent) => {
        event.preventDefault()
        setError('')
        setNotice('')

        const validation = validateProdutoForm(createForm)
        if (validation) {
            setError(validation)
            return
        }

        setActionLoadingId('create')

        try {
            const body = {
                titulo: createForm.titulo.trim(),
                categoria: createForm.categoria.trim(),
                descricao: createForm.descricao.trim(),
                foto: createForm.foto.trim(),
                preco: Number(createForm.preco),
                top: createForm.top ? 1 : 0,
                freteGratis: createForm.freteGratis ? 1 : 0,
                desconto: parseOptionalInt(createForm.desconto),
                fimDesconto: createForm.fimDesconto ? new Date(createForm.fimDesconto).toISOString() : undefined,
                avaliacao: parseOptionalNumber(createForm.avaliacao),
            }

            const backendBaseUrl = getBackendBaseUrl()
            const response = await fetch(`${backendBaseUrl}/produtos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(body),
            })

            if (!response.ok) {
                let message = 'Nao foi possivel criar o produto.'
                try {
                    const payload = await response.json()
                    message = getApiErrorMessage(payload)
                } catch {
                    // ignore
                }
                setError(message)
                return
            }

            let createdId: number | null = null
            try {
                const payload = await response.json()
                const maybeId = asNumber((payload as { id?: unknown } | null)?.id)
                createdId = Number.isFinite(maybeId) ? maybeId : null
            } catch {
                // ignore
            }

            setCreateForm(EMPTY_FORM)
            await loadProdutos()
            setNotice(createdId ? `Produto criado com sucesso. (ID ${createdId})` : 'Produto criado com sucesso.')
        } catch {
            setError('Falha de rede ao criar produto.')
        } finally {
            setActionLoadingId(null)
        }
    }

    const handleUpdate = async (id: number) => {
        setError('')
        setNotice('')

        const validation = validateProdutoForm(editForm)
        if (validation) {
            setError(validation)
            return
        }

        setActionLoadingId(id)

        try {
            const body = {
                titulo: editForm.titulo.trim(),
                categoria: editForm.categoria.trim(),
                descricao: editForm.descricao.trim(),
                foto: editForm.foto.trim(),
                preco: Number(editForm.preco),
                top: editForm.top ? 1 : 0,
                freteGratis: editForm.freteGratis ? 1 : 0,
                desconto: parseOptionalInt(editForm.desconto) ?? 0,
                fimDesconto: editForm.fimDesconto ? new Date(editForm.fimDesconto).toISOString() : null,
                avaliacao: parseOptionalNumber(editForm.avaliacao) ?? 0,
            }

            const backendBaseUrl = getBackendBaseUrl()
            const response = await fetch(`${backendBaseUrl}/produtos/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(body),
            })

            if (!response.ok) {
                let message = 'Nao foi possivel atualizar o produto.'
                try {
                    const payload = await response.json()
                    message = getApiErrorMessage(payload)
                } catch {
                    // ignore
                }
                setError(message)
                return
            }

            setEditingId(null)
            await loadProdutos()
            setNotice('Produto atualizado com sucesso.')
        } catch {
            setError('Falha de rede ao atualizar produto.')
        } finally {
            setActionLoadingId(null)
        }
    }

    const requestDelete = (produto: Produto) => {
        if (disabled) return
        setError('')
        setNotice('')
        setShowDeleteSuccess(false)
        setDeleteModalError('')
        setDeleteCandidate(produto)
    }

    const cancelDelete = () => {
        if (deleteCandidate && actionLoadingId === deleteCandidate.id) return
        setDeleteCandidate(null)
    }

    const confirmDelete = async () => {
        if (!deleteCandidate) return

        const id = deleteCandidate.id
        setError('')
        setNotice('')
        setDeleteModalError('')
        setActionLoadingId(id)

        try {
            const backendBaseUrl = getBackendBaseUrl()
            const response = await fetch(`${backendBaseUrl}/produtos/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            })

            if (!response.ok) {
                let message = 'Nao foi possivel deletar o produto.'
                try {
                    const payload = await response.json()
                    message = getApiErrorMessage(payload)
                } catch {
                    // ignore
                }
                setDeleteModalError(message)
                return
            }

            if (editingId === id) {
                cancelEdit()
            }

            setDeleteCandidate(null)
            await loadProdutos()
            setShowDeleteSuccess(true)
        } catch {
            setDeleteModalError('Falha de rede ao deletar produto.')
        } finally {
            setActionLoadingId(null)
        }
    }

    const disabled = meLoading || !isAdmin

    if (meLoading) {
        return (
            <main className='min-h-[calc(100vh-120px)] bg-[#0f0505] px-5 py-10'>
                <section className='w-full max-w-5xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.45)]'>
                    <div className='bg-gradient-to-br from-[#E31837] to-[#821325] p-10 text-white'>
                        <h1 className='text-3xl font-black'>Area Administrativa</h1>
                        <p className='mt-2 text-white/85 text-sm'>Carregando sessao...</p>
                    </div>
                    <div className='bg-[#120707] p-10'>
                        <p className='text-gray-300 text-sm'>Validando permissao de ADMIN...</p>
                    </div>
                </section>
            </main>
        )
    }

    const isDeleteSubmitting = deleteCandidate ? actionLoadingId === deleteCandidate.id : false

    return (
        <>
            <main className='min-h-[calc(100vh-120px)] bg-[#0f0505] px-5 py-10'>
                <section className='w-full max-w-6xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.45)]'>
                    <div className='bg-gradient-to-br from-[#E31837] to-[#821325] p-10 text-white'>
                        <h1 className='text-3xl font-black'>Area Administrativa</h1>
                        <p className='mt-2 text-white/85 text-sm'>Gerencie produtos, descontos e ofertas.</p>
                    </div>

                    <div className='bg-[#120707] p-10 space-y-10'>
                    <header className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                        <div>
                            <h2 className='text-white text-2xl font-black'>Produtos</h2>
                            <p className='text-gray-400 text-sm mt-1'>Apenas ADMIN pode criar/editar/deletar.</p>
                        </div>
                        <button
                            type='button'
                            onClick={loadProdutos}
                            disabled={disabled || produtosLoading}
                            className='h-11 px-5 rounded-xl border border-white/15 bg-white/5 text-white text-sm font-bold hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {produtosLoading ? 'Atualizando...' : 'Atualizar lista'}
                        </button>
                    </header>

                    {error && (
                        <p className='text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2'>
                            {error}
                        </p>
                    )}
                    {notice && (
                        <p className='text-sm text-green-300 bg-green-500/10 border border-green-500/30 rounded-xl px-3 py-2'>
                            {notice}
                        </p>
                    )}

                    <section className='rounded-2xl border border-white/10 bg-white/5 p-6'>
                        <h3 className='text-white font-black text-lg'>Adicionar produto</h3>
                        <form onSubmit={handleCreate} className='mt-5 grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <label className='block'>
                                <span className='text-xs text-gray-300 mb-2 block'>Titulo</span>
                                <input
                                    value={createForm.titulo}
                                    onChange={event => setCreateForm(state => ({ ...state, titulo: event.target.value }))}
                                    className='w-full h-12 rounded-xl border border-white/15 bg-[#120707] px-3 text-white text-sm outline-none placeholder:text-gray-600'
                                    placeholder='Ex: Texas BBQ Burger'
                                    disabled={disabled || actionLoadingId === 'create'}
                                />
                            </label>

                            <label className='block'>
                                <span className='text-xs text-gray-300 mb-2 block'>Categoria</span>
                                <input
                                    value={createForm.categoria}
                                    onChange={event => setCreateForm(state => ({ ...state, categoria: event.target.value }))}
                                    className='w-full h-12 rounded-xl border border-white/15 bg-[#120707] px-3 text-white text-sm outline-none placeholder:text-gray-600'
                                    placeholder='Ex: burgers'
                                    disabled={disabled || actionLoadingId === 'create'}
                                />
                            </label>

                            <label className='block md:col-span-2'>
                                <span className='text-xs text-gray-300 mb-2 block'>Descricao</span>
                                <input
                                    value={createForm.descricao}
                                    onChange={event => setCreateForm(state => ({ ...state, descricao: event.target.value }))}
                                    className='w-full h-12 rounded-xl border border-white/15 bg-[#120707] px-3 text-white text-sm outline-none placeholder:text-gray-600'
                                    placeholder='Descricao do produto'
                                    disabled={disabled || actionLoadingId === 'create'}
                                />
                            </label>

                            <label className='block md:col-span-2'>
                                <span className='text-xs text-gray-300 mb-2 block'>Foto (URL)</span>
                                <input
                                    value={createForm.foto}
                                    onChange={event => setCreateForm(state => ({ ...state, foto: event.target.value }))}
                                    className='w-full h-12 rounded-xl border border-white/15 bg-[#120707] px-3 text-white text-sm outline-none placeholder:text-gray-600'
                                    placeholder='https://...'
                                    disabled={disabled || actionLoadingId === 'create'}
                                />
                            </label>

                            <label className='block'>
                                <span className='text-xs text-gray-300 mb-2 block'>Preco (R$)</span>
                                <input
                                    type='number'
                                    step='0.01'
                                    value={createForm.preco}
                                    onChange={event => setCreateForm(state => ({ ...state, preco: event.target.value }))}
                                    className='w-full h-12 rounded-xl border border-white/15 bg-[#120707] px-3 text-white text-sm outline-none placeholder:text-gray-600'
                                    placeholder='0.00'
                                    disabled={disabled || actionLoadingId === 'create'}
                                />
                            </label>

                            <label className='block'>
                                <span className='text-xs text-gray-300 mb-2 block'>Avaliacao (0 a 5)</span>
                                <input
                                    type='number'
                                    step='0.1'
                                    value={createForm.avaliacao}
                                    onChange={event => setCreateForm(state => ({ ...state, avaliacao: event.target.value }))}
                                    className='w-full h-12 rounded-xl border border-white/15 bg-[#120707] px-3 text-white text-sm outline-none placeholder:text-gray-600'
                                    placeholder='Opcional'
                                    disabled={disabled || actionLoadingId === 'create'}
                                />
                            </label>

                            <label className='block'>
                                <span className='text-xs text-gray-300 mb-2 block'>Desconto (%)</span>
                                <input
                                    type='number'
                                    step='1'
                                    value={createForm.desconto}
                                    onChange={event => setCreateForm(state => ({ ...state, desconto: event.target.value }))}
                                    className='w-full h-12 rounded-xl border border-white/15 bg-[#120707] px-3 text-white text-sm outline-none placeholder:text-gray-600'
                                    placeholder='0'
                                    disabled={disabled || actionLoadingId === 'create'}
                                />
                            </label>

                            <label className='block'>
                                <span className='text-xs text-gray-300 mb-2 block'>Fim do desconto</span>
                                <input
                                    type='datetime-local'
                                    value={createForm.fimDesconto}
                                    onChange={event => setCreateForm(state => ({ ...state, fimDesconto: event.target.value }))}
                                    className='w-full h-12 rounded-xl border border-white/15 bg-[#120707] px-3 text-white text-sm outline-none'
                                    disabled={disabled || actionLoadingId === 'create'}
                                />
                            </label>

                            <label className='flex items-center gap-2 text-sm text-gray-300'>
                                <input
                                    type='checkbox'
                                    checked={createForm.top}
                                    onChange={event => setCreateForm(state => ({ ...state, top: event.target.checked }))}
                                    disabled={disabled || actionLoadingId === 'create'}
                                />
                                Marcar como TOP
                            </label>

                            <label className='flex items-center gap-2 text-sm text-gray-300'>
                                <input
                                    type='checkbox'
                                    checked={createForm.freteGratis}
                                    onChange={event => setCreateForm(state => ({ ...state, freteGratis: event.target.checked }))}
                                    disabled={disabled || actionLoadingId === 'create'}
                                />
                                Frete gratis
                            </label>

                            <div className='md:col-span-2 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end mt-2'>
                                <button
                                    type='button'
                                    onClick={() => setCreateForm(EMPTY_FORM)}
                                    disabled={disabled || actionLoadingId === 'create'}
                                    className='h-12 px-6 rounded-xl border border-white/15 bg-white/5 text-white text-sm font-bold hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    Limpar
                                </button>
                                <button
                                    type='submit'
                                    disabled={disabled || actionLoadingId === 'create'}
                                    className='h-12 px-6 rounded-xl border-none bg-[#E31837] text-white text-sm font-black hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    {actionLoadingId === 'create' ? 'Criando...' : 'Criar produto'}
                                </button>
                            </div>
                        </form>
                    </section>

                    <section className='space-y-4'>
                        <h3 className='text-white font-black text-lg'>Lista de produtos</h3>

                        {produtosLoading ? (
                            <div className='rounded-2xl border border-white/10 bg-white/5 p-6'>
                                <p className='text-gray-300 text-sm'>Carregando produtos...</p>
                            </div>
                        ) : produtos.length === 0 ? (
                            <div className='rounded-2xl border border-white/10 bg-white/5 p-6'>
                                <p className='text-gray-300 text-sm'>Nenhum produto encontrado.</p>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 gap-4'>
                                {produtos.map(produto => {
                                    const isEditing = editingId === produto.id
                                    const isRowLoading = actionLoadingId === produto.id
                                    const descontoAtivo = Number(produto.desconto) > 0
                                    const preco = asNumber(produto.preco)
                                    const desconto = Number(produto.desconto) || 0
                                    const precoFinal =
                                        Number.isFinite(preco) && desconto > 0
                                            ? preco * (1 - desconto / 100)
                                            : null

                                    return (
                                        <article
                                            key={produto.id}
                                            className='rounded-2xl border border-white/10 bg-white/5 p-6'
                                        >
                                            <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                                                <div className='min-w-0'>
                                                    <div className='flex items-center gap-3 flex-wrap'>
                                                        <h4 className='text-white font-black text-base truncate'>
                                                            #{produto.id} — {produto.titulo}
                                                        </h4>
                                                        {Number(produto.top) === 1 && (
                                                            <span className='text-[10px] font-black px-2.5 py-1 rounded-full bg-[#F5A623] text-[#0f0505]'>
                                                                TOP
                                                            </span>
                                                        )}
                                                        {Number(produto.freteGratis) === 1 && (
                                                            <span className='text-[10px] font-black px-2.5 py-1 rounded-full bg-white/10 text-white'>
                                                                FRETE GRATIS
                                                            </span>
                                                        )}
                                                        {descontoAtivo && (
                                                            <span className='text-[10px] font-black px-2.5 py-1 rounded-full bg-[#E31837] text-white'>
                                                                {produto.desconto}% OFF
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className='text-gray-400 text-sm mt-1'>Categoria: {produto.categoria}</p>
                                                    <p className='text-gray-500 text-xs mt-1 line-clamp-2'>{produto.descricao}</p>
                                                    <div className='mt-3 flex flex-wrap items-center gap-3'>
                                                        <p className='text-white text-sm font-bold'>Preco: {formatCurrency(produto.preco)}</p>
                                                        {precoFinal !== null && (
                                                            <p className='text-gray-300 text-sm'>Final: {formatCurrency(precoFinal)}</p>
                                                        )}
                                                        {produto.fimDesconto ? (
                                                            <p className='text-gray-500 text-xs'>Fim: {new Date(produto.fimDesconto).toLocaleString()}</p>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className='flex gap-2 shrink-0'>
                                                    {isEditing ? (
                                                        <>
                                                            <button
                                                                type='button'
                                                                onClick={() => handleUpdate(produto.id)}
                                                                disabled={disabled || isRowLoading}
                                                                className='h-10 px-4 rounded-xl border-none bg-[#E31837] text-white text-xs font-black hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'
                                                            >
                                                                {isRowLoading ? 'Salvando...' : 'Salvar'}
                                                            </button>
                                                            <button
                                                                type='button'
                                                                onClick={cancelEdit}
                                                                disabled={disabled || isRowLoading}
                                                                className='h-10 px-4 rounded-xl border border-white/15 bg-white/5 text-white text-xs font-bold hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                                            >
                                                                Cancelar
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            type='button'
                                                            onClick={() => startEdit(produto)}
                                                            disabled={disabled || isRowLoading}
                                                            className='h-10 px-4 rounded-xl border border-white/15 bg-white/5 text-white text-xs font-bold hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                                        >
                                                            Editar
                                                        </button>
                                                    )}
                                                    <button
                                                        type='button'
                                                        onClick={() => requestDelete(produto)}
                                                        disabled={disabled || isRowLoading}
                                                        className='h-10 px-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-xs font-bold hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                                    >
                                                        {isRowLoading ? '...' : 'Deletar'}
                                                    </button>
                                                </div>
                                            </div>

                                            {isEditing && (
                                                <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
                                                    <label className='block'>
                                                        <span className='text-xs text-gray-300 mb-2 block'>Titulo</span>
                                                        <input
                                                            value={editForm.titulo}
                                                            onChange={event => setEditForm(state => ({ ...state, titulo: event.target.value }))}
                                                            className='w-full h-12 rounded-xl border border-white/15 bg-[#120707] px-3 text-white text-sm outline-none'
                                                            disabled={disabled || isRowLoading}
                                                        />
                                                    </label>

                                                    <label className='block'>
                                                        <span className='text-xs text-gray-300 mb-2 block'>Categoria</span>
                                                        <input
                                                            value={editForm.categoria}
                                                            onChange={event => setEditForm(state => ({ ...state, categoria: event.target.value }))}
                                                            className='w-full h-12 rounded-xl border border-white/15 bg-[#120707] px-3 text-white text-sm outline-none'
                                                            disabled={disabled || isRowLoading}
                                                        />
                                                    </label>

                                                    <label className='block md:col-span-2'>
                                                        <span className='text-xs text-gray-300 mb-2 block'>Descricao</span>
                                                        <input
                                                            value={editForm.descricao}
                                                            onChange={event => setEditForm(state => ({ ...state, descricao: event.target.value }))}
                                                            className='w-full h-12 rounded-xl border border-white/15 bg-[#120707] px-3 text-white text-sm outline-none'
                                                            disabled={disabled || isRowLoading}
                                                        />
                                                    </label>

                                                    <label className='block md:col-span-2'>
                                                        <span className='text-xs text-gray-300 mb-2 block'>Foto (URL)</span>
                                                        <input
                                                            value={editForm.foto}
                                                            onChange={event => setEditForm(state => ({ ...state, foto: event.target.value }))}
                                                            className='w-full h-12 rounded-xl border border-white/15 bg-[#120707] px-3 text-white text-sm outline-none'
                                                            disabled={disabled || isRowLoading}
                                                        />
                                                    </label>

                                                    <label className='block'>
                                                        <span className='text-xs text-gray-300 mb-2 block'>Preco (R$)</span>
                                                        <input
                                                            type='number'
                                                            step='0.01'
                                                            value={editForm.preco}
                                                            onChange={event => setEditForm(state => ({ ...state, preco: event.target.value }))}
                                                            className='w-full h-12 rounded-xl border border-white/15 bg-[#120707] px-3 text-white text-sm outline-none'
                                                            disabled={disabled || isRowLoading}
                                                        />
                                                    </label>

                                                    <label className='block'>
                                                        <span className='text-xs text-gray-300 mb-2 block'>Avaliacao (0 a 5)</span>
                                                        <input
                                                            type='number'
                                                            step='0.1'
                                                            value={editForm.avaliacao}
                                                            onChange={event => setEditForm(state => ({ ...state, avaliacao: event.target.value }))}
                                                            className='w-full h-12 rounded-xl border border-white/15 bg-[#120707] px-3 text-white text-sm outline-none'
                                                            disabled={disabled || isRowLoading}
                                                        />
                                                    </label>

                                                    <label className='block'>
                                                        <span className='text-xs text-gray-300 mb-2 block'>Desconto (%)</span>
                                                        <input
                                                            type='number'
                                                            step='1'
                                                            value={editForm.desconto}
                                                            onChange={event => setEditForm(state => ({ ...state, desconto: event.target.value }))}
                                                            className='w-full h-12 rounded-xl border border-white/15 bg-[#120707] px-3 text-white text-sm outline-none'
                                                            disabled={disabled || isRowLoading}
                                                        />
                                                    </label>

                                                    <label className='block'>
                                                        <span className='text-xs text-gray-300 mb-2 block'>Fim do desconto</span>
                                                        <input
                                                            type='datetime-local'
                                                            value={editForm.fimDesconto}
                                                            onChange={event => setEditForm(state => ({ ...state, fimDesconto: event.target.value }))}
                                                            className='w-full h-12 rounded-xl border border-white/15 bg-[#120707] px-3 text-white text-sm outline-none'
                                                            disabled={disabled || isRowLoading}
                                                        />
                                                    </label>

                                                    <label className='flex items-center gap-2 text-sm text-gray-300'>
                                                        <input
                                                            type='checkbox'
                                                            checked={editForm.top}
                                                            onChange={event => setEditForm(state => ({ ...state, top: event.target.checked }))}
                                                            disabled={disabled || isRowLoading}
                                                        />
                                                        TOP
                                                    </label>

                                                    <label className='flex items-center gap-2 text-sm text-gray-300'>
                                                        <input
                                                            type='checkbox'
                                                            checked={editForm.freteGratis}
                                                            onChange={event => setEditForm(state => ({ ...state, freteGratis: event.target.checked }))}
                                                            disabled={disabled || isRowLoading}
                                                        />
                                                        Frete gratis
                                                    </label>
                                                </div>
                                            )}
                                        </article>
                                    )
                                })}
                            </div>
                        )}
                    </section>
                    </div>
                </section>
            </main>

            {deleteCandidate ? (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6'>
                    <div
                        role='dialog'
                        aria-modal='true'
                        aria-label='Confirmar exclusao'
                        className='w-full max-w-sm rounded-3xl border border-white/10 bg-[#1a0a0a] p-6 text-center shadow-2xl'
                    >
                        <h3 className='text-white font-black text-2xl'>Deletar produto?</h3>
                        <p className='text-gray-500 text-sm mt-1'>Essa acao nao pode ser desfeita.</p>

                        <div className='mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left'>
                            <p className='text-white text-sm font-bold'>#{deleteCandidate.id} — {deleteCandidate.titulo}</p>
                            <p className='text-gray-500 text-xs mt-1'>Categoria: {deleteCandidate.categoria}</p>
                        </div>

                        {deleteModalError ? (
                            <p className='mt-4 text-sm text-red-300'>{deleteModalError}</p>
                        ) : null}

                        <div className='mt-5 grid grid-cols-2 gap-3'>
                            <button
                                type='button'
                                onClick={cancelDelete}
                                disabled={isDeleteSubmitting}
                                className='h-11 rounded-xl border border-white/15 bg-white/5 text-white text-sm font-bold hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                Cancelar
                            </button>
                            <button
                                type='button'
                                onClick={confirmDelete}
                                disabled={isDeleteSubmitting}
                                className='h-11 rounded-xl border-none bg-[#E31837] hover:opacity-90 text-white text-sm font-black cursor-pointer transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {isDeleteSubmitting ? 'Deletando...' : 'Confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {showDeleteSuccess ? (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6'>
                    <div
                        role='dialog'
                        aria-modal='true'
                        aria-label='Produto deletado'
                        className='w-full max-w-sm rounded-3xl border border-white/10 bg-[#1a0a0a] p-6 text-center shadow-2xl'
                    >
                        <img
                            src='/moto-entrega.gif'
                            alt='Concluido'
                            className='mx-auto h-40 w-40 object-contain'
                            onError={event => {
                                event.currentTarget.style.display = 'none'
                            }}
                        />

                        <h3 className='text-white font-black text-2xl mt-2'>Produto deletado</h3>
                        <p className='text-gray-500 text-sm mt-1'>O item foi removido do cardapio.</p>

                        <button
                            type='button'
                            onClick={() => setShowDeleteSuccess(false)}
                            className='mt-5 w-full h-11 rounded-xl border-none bg-[#E31837] hover:opacity-90 text-white text-sm font-black cursor-pointer transition-opacity'
                        >
                            Ok
                        </button>
                    </div>
                </div>
            ) : null}
        </>
    )
}

