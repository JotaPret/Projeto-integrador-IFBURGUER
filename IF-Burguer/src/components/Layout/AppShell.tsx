'use client'

import CartDrawer from '@/components/Cart/CartDrawer'
import { CartProvider } from '@/components/Cart/CartContext'
import NavBar from '@/components/NavBar/NavBar'
import { usePathname } from 'next/navigation'

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAuthPage = pathname === '/login' || pathname === '/cadastro'

    return (
        <CartProvider>
            {isAuthPage ? null : <NavBar />}
            {children}
            {isAuthPage ? null : <CartDrawer />}
        </CartProvider>
    )
}
