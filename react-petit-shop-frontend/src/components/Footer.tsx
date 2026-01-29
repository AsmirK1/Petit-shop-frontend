export const Footer = () => {
    return (
        <footer className="footer footer-center bg-gradient-to-r from-primary to-secondary text-white p-6 mt-8 shadow-inner">
            <aside>
                <p className="font-semibold text-lg drop-shadow">Copyright © {new Date().getFullYear()} - All rights reserved by Petit Shop</p>
            </aside>
        </footer>
    )
}