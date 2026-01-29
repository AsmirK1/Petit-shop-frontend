
import { Outlet } from 'react-router-dom'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { CartProvider } from '../context/CartContext'
import BuyerChat from '../components/BuyerChat'

export const MainStyle = () => {
    return (
        <CartProvider>
            <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-100 flex flex-col">
                <Nav />
                <BuyerChat />
                <main className="flex-1 container mx-auto px-4 py-8">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </CartProvider>
    )
}