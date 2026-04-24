'use client'

import { type ChangeEvent, type FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Camera, LogOut, Trash2, UserRound } from 'lucide-react'

const AUTH_COOKIE = 'ifburger_auth'
const USER_COOKIE = 'ifburger_user'
const PROFILE_COOKIE = 'ifburger_profile_photo'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const MAX_COOKIE_IMAGE_CHARS = 3000

const BACKEND_BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3334/api/v1'

type UserInfo = {
    id: number
    nome: string
    email: string | null
}

type PedidoItem = {
    quantidade: number
    preco: string | number
    produto?: {
        id: number
        titulo: string
    } | null
}

type Pedido = {
    id: number
    data: string
    itensPedido: PedidoItem[]
}

function readCookie(name: string) {
    if (typeof document === 'undefined') {
        return ''
    }

    const value = document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith(`${name}=`))

    return value ? value.split('=')[1] : ''
}

function setCookie(name: string, value: string) {
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax`
}

function clearCookie(name: string) {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`
}

function getSavedProfileImage() {
    const saved = readCookie(PROFILE_COOKIE)
    if (!saved) {
        return ''
    }

    try {
        return decodeURIComponent(saved)
    } catch {
        return ''
    }
}

function getGoogleProfileImageUrl(email: string | null | undefined) {
    const normalizedEmail = (email || '').trim().toLowerCase()
    return `https://www.google.com/s2/photos/profile/${encodeURIComponent(normalizedEmail)}?sz=160`
}

function fileToCompressedDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
        const objectUrl = URL.createObjectURL(file)
        const image = new Image()

        image.onload = () => {
            const size = 96
            const canvas = document.createElement('canvas')
            canvas.width = size
            canvas.height = size

            const ctx = canvas.getContext('2d')
            if (!ctx) {
                URL.revokeObjectURL(objectUrl)
                reject(new Error('Falha ao preparar a imagem.'))
                return
            }

            const sourceSize = Math.min(image.width, image.height)
            const sx = (image.width - sourceSize) / 2
            const sy = (image.height - sourceSize) / 2

            ctx.drawImage(image, sx, sy, sourceSize, sourceSize, 0, 0, size, size)

            canvas.toBlob(
                blob => {
                    URL.revokeObjectURL(objectUrl)
                    if (!blob) {
                        reject(new Error('Nao foi possivel converter a imagem.'))
                        return
                    }

                    const reader = new FileReader()
                    reader.onload = () => resolve(String(reader.result || ''))
                    reader.onerror = () => reject(new Error('Nao foi possivel ler a imagem.'))
                    reader.readAsDataURL(blob)
                },
                'image/jpeg',
                0.72,
            )
        }

        image.onerror = () => {
            URL.revokeObjectURL(objectUrl)
            reject(new Error('Arquivo de imagem invalido.'))
        }

        image.src = objectUrl
    })
}

function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })
}

export default function UsuarioPage() {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const [user, setUser] = useState<UserInfo | null>(null)
    const [orders, setOrders] = useState<Pedido[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const [nameInput, setNameInput] = useState('')
    const [isSavingName, setIsSavingName] = useState(false)

    const [profileImage, setProfileImage] = useState(getSavedProfileImage)
    const [avatarFailed, setAvatarFailed] = useState(false)
    const [avatarError, setAvatarError] = useState('')

    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        let ignore = false

        const loadData = async () => {
            setIsLoading(true)
            setError('')

            try {
                const meResponse = await fetch(`${BACKEND_BASE_URL}/auth/me`, {
                    credentials: 'include',
                })

                if (!meResponse.ok) {
                    router.replace('/login?redirect=%2Fusuario')
                    return
                }

                const mePayload = await meResponse.json()
                const meUser = mePayload?.user as UserInfo | undefined

                if (!meUser?.id) {
                    router.replace('/login?redirect=%2Fusuario')
                    return
                }

                const ordersResponse = await fetch(`${BACKEND_BASE_URL}/pedidos/usuario/${meUser.id}`, {
                    credentials: 'include',
                })

                if (ignore) {
                    return
                }

                setUser(meUser)
                setNameInput(meUser.nome || '')

                if (ordersResponse.ok) {
                    const ordersPayload = await ordersResponse.json()
                    const parsedOrders = Array.isArray(ordersPayload) ? ordersPayload : []
                    setOrders(parsedOrders)
                } else {
                    setOrders([])
                }
            } catch {
                if (!ignore) {
                    setError('Nao foi possivel carregar os dados da conta.')
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false)
                }
            }
        }

        loadData().catch(() => {})

        return () => {
            ignore = true
        }
    }, [router])

    const avatarSrc = useMemo(() => {
        return profileImage || getGoogleProfileImageUrl(user?.email)
    }, [profileImage, user?.email])

    const handleSaveName = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!user) {
            return
        }

        const normalizedName = nameInput.trim().replace(/\s+/g, ' ')
        if (!normalizedName) {
            setError('Digite um nome valido para atualizar.')
            return
        }

        setIsSavingName(true)
        setError('')

        try {
            const response = await fetch(`${BACKEND_BASE_URL}/usuarios/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ nome: normalizedName }),
            })

            if (!response.ok) {
                setError('Nao foi possivel atualizar o nome de usuario.')
                return
            }

            const payload = await response.json()
            const updatedName = payload?.nome || normalizedName
            setUser(current => (current ? { ...current, nome: updatedName } : current))
            setNameInput(updatedName)
        } catch {
            setError('Falha de rede ao atualizar nome de usuario.')
        } finally {
            setIsSavingName(false)
        }
    }

    const handleOpenPhotoPicker = () => {
        setAvatarError('')
        fileInputRef.current?.click()
    }

    const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        event.target.value = ''

        if (!file) {
            return
        }

        setAvatarError('')

        try {
            const dataUrl = await fileToCompressedDataUrl(file)
            const encoded = encodeURIComponent(dataUrl)

            if (encoded.length > MAX_COOKIE_IMAGE_CHARS) {
                setAvatarError('Imagem muito grande para salvar no cookie. Escolha outra foto.')
                return
            }

            setCookie(PROFILE_COOKIE, dataUrl)
            setProfileImage(dataUrl)
            setAvatarFailed(false)
            window.dispatchEvent(new Event('ifburger-profile-updated'))
        } catch {
            setAvatarError('Nao foi possivel atualizar a foto de perfil.')
        }
    }

    const handleRemoveCustomPhoto = () => {
        clearCookie(PROFILE_COOKIE)
        setProfileImage('')
        setAvatarFailed(false)
        setAvatarError('')
        window.dispatchEvent(new Event('ifburger-profile-updated'))
    }

    const handleLogout = async () => {
        setIsLoggingOut(true)

        try {
            await fetch(`${BACKEND_BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            })
        } catch {
            // segue com limpeza local
        }

        clearCookie(AUTH_COOKIE)
        clearCookie(USER_COOKIE)
        clearCookie(PROFILE_COOKIE)
        window.dispatchEvent(new Event('ifburger-profile-updated'))
        router.push('/login')
        router.refresh()
    }

    const handleDeleteProfile = async () => {
        if (!user || isDeleting) {
            return
        }

        const confirmed = window.confirm('Tem certeza que deseja excluir seu perfil? Esta acao remove sua conta e historico de pedidos.')
        if (!confirmed) {
            return
        }

        setIsDeleting(true)
        setError('')

        try {
            const deleteResponse = await fetch(`${BACKEND_BASE_URL}/usuarios/${user.id}`, {
                method: 'DELETE',
                credentials: 'include',
            })

            if (!deleteResponse.ok) {
                setError('Nao foi possivel excluir seu perfil neste momento.')
                return
            }

            await fetch(`${BACKEND_BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            }).catch(() => {})

            clearCookie(AUTH_COOKIE)
            clearCookie(USER_COOKIE)
            clearCookie(PROFILE_COOKIE)
            window.dispatchEvent(new Event('ifburger-profile-updated'))
            router.push('/login')
            router.refresh()
        } catch {
            setError('Falha de rede ao excluir perfil.')
        } finally {
            setIsDeleting(false)
        }
    }

    const sortedOrders = useMemo(() => {
        return [...orders].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    }, [orders])

    return (
        <main className='min-h-screen bg-[var(--prim)] text-white px-[8%] lg:px-[16%] py-8'>
            <div className='flex items-center justify-between gap-4 mb-6'>
                <h1 className='text-3xl font-black'>Meu Perfil</h1>
                <Link href='/' className='text-sm text-white/80 no-underline hover:text-white transition-colors'>
                    Voltar para inicio
                </Link>
            </div>

            {isLoading ? (
                <div className='rounded-2xl border border-white/10 bg-white/5 p-6'>
                    Carregando dados da conta...
                </div>
            ) : (
                <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
                    <section className='xl:col-span-1 rounded-2xl border border-white/10 bg-white/5 p-6'>
                        <h2 className='text-xl font-bold mb-5'>Conta</h2>

                        <div className='flex items-center gap-4'>
                            <button
                                type='button'
                                onClick={handleOpenPhotoPicker}
                                className='relative w-24 h-24 rounded-full border border-white/25 bg-white/10 overflow-hidden cursor-pointer hover:bg-white/15 transition-colors'
                                title='Alterar foto de perfil'
                            >
                                {avatarFailed ? (
                                    <span className='w-full h-full flex items-center justify-center'>
                                        <UserRound className='w-10 h-10 text-white/80' />
                                    </span>
                                ) : (
                                    <img
                                        src={avatarSrc}
                                        alt='Foto de perfil'
                                        className='w-full h-full object-cover'
                                        onError={() => setAvatarFailed(true)}
                                        referrerPolicy='no-referrer'
                                    />
                                )}
                                <span className='absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#E31837] border border-[#120707] flex items-center justify-center'>
                                    <Camera className='w-3.5 h-3.5 text-white' />
                                </span>
                            </button>

                            <div className='text-sm text-white/80'>
                                <p className='font-semibold text-white'>{user?.nome || 'Usuario'}</p>
                                <p>{user?.email || 'Sem e-mail'}</p>
                                <p className='text-xs mt-1'>Clique na foto para trocar.</p>
                            </div>
                        </div>

                        <input
                            ref={fileInputRef}
                            type='file'
                            accept='image/*'
                            className='hidden'
                            onChange={handlePhotoChange}
                        />

                        <div className='mt-4 flex gap-2'>
                            <button
                                type='button'
                                onClick={handleOpenPhotoPicker}
                                className='h-10 px-4 rounded-xl bg-[#E31837] text-white text-sm font-bold border-none cursor-pointer hover:opacity-90 transition-opacity'
                            >
                                Alterar foto
                            </button>
                            <button
                                type='button'
                                onClick={handleRemoveCustomPhoto}
                                className='h-10 px-4 rounded-xl bg-white/5 border border-white/20 text-white text-sm font-bold cursor-pointer hover:bg-white/10 transition-colors'
                            >
                                Remover foto
                            </button>
                        </div>

                        {avatarError && (
                            <p className='mt-3 text-sm text-red-300'>
                                {avatarError}
                            </p>
                        )}

                        <form onSubmit={handleSaveName} className='mt-6 space-y-3'>
                            <label className='block'>
                                <span className='text-xs text-white/70'>Nome de usuario</span>
                                <input
                                    value={nameInput}
                                    onChange={event => setNameInput(event.target.value)}
                                    className='mt-1 w-full h-11 rounded-xl border border-white/20 bg-white/5 px-3 text-white text-sm outline-none'
                                    placeholder='Digite seu nome'
                                />
                            </label>
                            <button
                                type='submit'
                                disabled={isSavingName}
                                className='h-10 px-4 rounded-xl bg-[var(--second)] text-[var(--prim)] text-sm font-black border-none cursor-pointer hover:opacity-90 transition-opacity'
                            >
                                {isSavingName ? 'Salvando...' : 'Salvar nome'}
                            </button>
                        </form>

                        <div className='mt-8 space-y-3 border-t border-white/10 pt-5'>
                            <button
                                type='button'
                                onClick={handleLogout}
                                disabled={isLoggingOut || isDeleting}
                                className='w-full h-11 rounded-xl border border-white/25 bg-white/5 text-white text-sm font-bold cursor-pointer hover:bg-white/10 transition-colors flex items-center justify-center gap-2'
                            >
                                <LogOut className='w-4 h-4' />
                                {isLoggingOut ? 'Saindo...' : 'Sair da conta'}
                            </button>

                            <button
                                type='button'
                                onClick={handleDeleteProfile}
                                disabled={isDeleting || isLoggingOut}
                                className='w-full h-11 rounded-xl border border-red-400/50 bg-red-500/10 text-red-200 text-sm font-bold cursor-pointer hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2'
                            >
                                <Trash2 className='w-4 h-4' />
                                {isDeleting ? 'Excluindo perfil...' : 'Excluir perfil e historico'}
                            </button>
                        </div>

                        {error && (
                            <p className='mt-4 text-sm text-red-300'>
                                {error}
                            </p>
                        )}
                    </section>

                    <section className='xl:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6'>
                        <h2 className='text-xl font-bold mb-5'>Historico de pedidos</h2>

                        {sortedOrders.length === 0 ? (
                            <p className='text-white/70 text-sm'>
                                Nenhum pedido encontrado para este perfil.
                            </p>
                        ) : (
                            <div className='space-y-4'>
                                {sortedOrders.map(order => {
                                    const total = order.itensPedido.reduce((acc, item) => {
                                        return acc + Number(item.preco || 0) * Number(item.quantidade || 0)
                                    }, 0)

                                    return (
                                        <article key={order.id} className='rounded-xl border border-white/10 bg-black/20 p-4'>
                                            <div className='flex items-center justify-between gap-3 mb-3'>
                                                <p className='font-semibold'>Pedido #{order.id}</p>
                                                <p className='text-sm text-white/70'>
                                                    {new Date(order.data).toLocaleString('pt-BR')}
                                                </p>
                                            </div>

                                            <ul className='space-y-2 mb-3'>
                                                {order.itensPedido.map((item, index) => (
                                                    <li key={`${order.id}-${index}`} className='text-sm text-white/85 flex items-center justify-between gap-3'>
                                                        <span>
                                                            {item.produto?.titulo || 'Produto'} x{item.quantidade}
                                                        </span>
                                                        <span>
                                                            {formatCurrency(Number(item.preco || 0) * Number(item.quantidade || 0))}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className='pt-3 border-t border-white/10 flex items-center justify-between'>
                                                <span className='text-sm text-white/70'>Total</span>
                                                <strong>{formatCurrency(total)}</strong>
                                            </div>
                                        </article>
                                    )
                                })}
                            </div>
                        )}
                    </section>
                </div>
            )}
        </main>
    )
}
