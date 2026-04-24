'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { inferProdutoIdFromName } from './cart-utils'

const CART_STORAGE_KEY = 'ifburger_cart_items'

const CartContext = createContext(null)

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
        }))
}

export function CartProvider({ children }) {
    const [items, setItems] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [isHydrated, setIsHydrated] = useState(false)

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

        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }, [items, isHydrated])

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
