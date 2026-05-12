'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { inferProdutoIdFromName } from './cart-utils'

const CART_STORAGE_KEY = 'ifburger_cart_items'

const CartContext = createContext(null)

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

function sanitizeItems(rawItems) {
    if (!Array.isArray(rawItems)) {
        return []
    }

    return rawItems
        .filter(item => item && item.id && item.name)
        .map(item => ({
            id: item.id,
            produtoId:
                Number.isInteger(item.produtoId)
                    ? item.produtoId
                    : Number.isInteger(Number(item.produtoId))
                        ? Number(item.produtoId)
                        : inferProdutoIdFromName(item.name),
            name: item.name,
            description: item.description || '',
            image: item.image || '',
            price: Number(item.price) || 0,
            quantity: Math.max(1, Number(item.quantity) || 1),
            rating: Number.isFinite(Number(item.rating))
                ? Number(item.rating)
                : Number.isFinite(Number(item.avaliacao))
                    ? Number(item.avaliacao)
                    : 0,
        }))
}

export function CartProvider({ children }) {
    const [items, setItems] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [isHydrated, setIsHydrated] = useState(false)
    const [isServerInitialized, setIsServerInitialized] = useState(false)

    useEffect(() => {
        try {
            const savedItems = localStorage.getItem(CART_STORAGE_KEY)
            if (!savedItems) {
                setIsHydrated(true)
                return
            }

            const parsedItems = JSON.parse(savedItems)
            setItems(sanitizeItems(parsedItems))
        } catch {
            setItems([])
        } finally {
            setIsHydrated(true)
        }
    }, [])

    useEffect(() => {
        if (!isHydrated) {
            return
        }

        let cancelled = false

        const loadFromServer = async () => {
            try {
                const backendBaseUrl = getBackendBaseUrl()
                const response = await fetch(`${backendBaseUrl}/carrinho`, {
                    method: 'GET',
                    credentials: 'include',
                })

                if (!response.ok) {
                    return
                }

                const payload = await response.json()
                const serverItemsRaw = Array.isArray(payload?.itens) ? payload.itens : []

                const serverItems = sanitizeItems(
                    serverItemsRaw.map(item => ({
                        id: `produto-${item?.produtoId}`,
                        produtoId: item?.produtoId,
                        name: item?.produto?.titulo || '',
                        description: item?.produto?.descricao || '',
                        image: item?.produto?.foto || '',
                        price: Number(item?.preco) || 0,
                        quantity: Math.max(1, Number(item?.quantidade) || 1),
                        rating: Number(item?.produto?.avaliacao) || 0,
                    }))
                )

                if (!cancelled && serverItems.length > 0) {
                    setItems(serverItems)
                }
            } catch {
                // ignore
            } finally {
                if (!cancelled) {
                    setIsServerInitialized(true)
                }
            }
        }

        loadFromServer()

        return () => {
            cancelled = true
        }
    }, [isHydrated])

    useEffect(() => {
        if (!isHydrated) {
            return
        }

        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }, [items, isHydrated])

    useEffect(() => {
        if (!isHydrated || !isServerInitialized) {
            return
        }

        const backendBaseUrl = getBackendBaseUrl()
        const itens = items
            .map(item => ({
                produtoId:
                    Number.isInteger(Number(item.produtoId))
                        ? Number(item.produtoId)
                        : inferProdutoIdFromName(item.name),
                quantidade: Math.max(1, Number(item.quantity) || 1),
                preco: Number(item.price) || 0,
            }))
            .filter(item => Number.isInteger(item.produtoId) && item.produtoId > 0)

        fetch(`${backendBaseUrl}/carrinho`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itens }),
        }).catch(() => {})
    }, [items, isHydrated, isServerInitialized])

    const addItem = item => {
        setItems(prevItems => {
            const index = prevItems.findIndex(prevItem => prevItem.id === item.id)

            const produtoId =
                Number.isInteger(Number(item.produtoId))
                    ? Number(item.produtoId)
                    : inferProdutoIdFromName(item.name)

            if (index === -1) {
                return [
                    ...prevItems,
                    {
                        id: item.id,
                        produtoId,
                        name: item.name,
                        description: item.description || '',
                        image: item.image || '',
                        price: Number(item.price) || 0,
                        quantity: 1,
                        rating: Number(item.rating) || 0,
                    },
                ]
            }

            return prevItems.map(prevItem =>
                prevItem.id === item.id
                    ? { ...prevItem, quantity: prevItem.quantity + 1 }
                    : prevItem
            )
        })
    }

    const setItemRating = (itemId, rating) => {
        const next = Number(rating)
        if (!Number.isFinite(next)) {
            return
        }

        setItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, rating: Math.max(0, Math.min(5, next)) } : item
            )
        )
    }

    const removeItem = itemId => {
        setItems(prevItems => prevItems.filter(item => item.id !== itemId))
    }

    const increaseItem = itemId => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
            )
        )
    }

    const decreaseItem = itemId => {
        setItems(prevItems =>
            prevItems
                .map(item =>
                    item.id === itemId
                        ? { ...item, quantity: Math.max(0, item.quantity - 1) }
                        : item
                )
                .filter(item => item.quantity > 0)
        )
    }

    const clearCart = () => {
        setItems([])
    }

    const openCart = () => {
        setIsOpen(true)
    }

    const closeCart = () => {
        setIsOpen(false)
    }

    const toggleCart = () => {
        setIsOpen(prev => !prev)
    }

    const totalItems = useMemo(
        () => items.reduce((total, item) => total + item.quantity, 0),
        [items]
    )

    const subtotal = useMemo(
        () => items.reduce((total, item) => total + item.price * item.quantity, 0),
        [items]
    )

    const value = useMemo(
        () => ({
            items,
            isOpen,
            totalItems,
            subtotal,
            addItem,
            removeItem,
            increaseItem,
            decreaseItem,
            clearCart,
            setItemRating,
            openCart,
            closeCart,
            toggleCart,
        }),
        [items, isOpen, totalItems, subtotal]
    )

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
    const context = useContext(CartContext)

    if (!context) {
        throw new Error('useCart precisa ser usado dentro de CartProvider.')
    }

    return context
}
