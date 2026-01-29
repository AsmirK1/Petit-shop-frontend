import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useEffect, useState } from 'react'

export const Nav = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const getBuyer = () => {
    const v = typeof window !== 'undefined' ? localStorage.getItem('buyer_user') : null;
    return v ? JSON.parse(v) : null;
  };
  const getSeller = () => {
    const v = typeof window !== 'undefined' ? localStorage.getItem('seller_user') : null;
    return v ? JSON.parse(v) : null;
  };

  const [buyer, setBuyer] = useState(getBuyer());
  const [seller, setSeller] = useState(getSeller());
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return false;
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch { return false; }
  });

  useEffect(() => {
    try {
      if (typeof document !== 'undefined') {
        // Toggle tailwind/daisyUI dark class for frameworks that use it
        if (isDark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');

        // Also set daisyUI's data-theme attribute so component styles update
        try {
          document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        } catch { }
      }

      // persist the plain mode name
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch { }
  }, [isDark]);

  useEffect(() => {
    const onProfile = (e: Event) => {
      try {
        const ce = e as CustomEvent;
        if (!ce?.detail) return;
        const { role, user } = ce.detail;
        if (role === 'seller') setSeller(user);
        if (role === 'buyer') setBuyer(user);
      } catch { }
    };
    window.addEventListener('profileUpdated', onProfile as EventListener);

    // also listen to storage events to handle changes from other tabs/windows
    const onStorage = (ev: StorageEvent) => {
      try {
        if (ev.key === 'seller_user') setSeller(ev.newValue ? JSON.parse(ev.newValue) : null);
        if (ev.key === 'buyer_user') setBuyer(ev.newValue ? JSON.parse(ev.newValue) : null);
      } catch { }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('profileUpdated', onProfile as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const handleLogout = (role: 'buyer' | 'seller' | 'all') => {
    if (role === 'buyer' || role === 'all') {
      localStorage.removeItem('buyer_token');
      localStorage.removeItem('buyer_user');
      setBuyer(null);
    }
    if (role === 'seller' || role === 'all') {
      localStorage.removeItem('seller_token');
      localStorage.removeItem('seller_user');
      setSeller(null);
    }
    navigate('/');
    window.location.reload();
  };

  const avatarSrc = seller?.pictureUrl || buyer?.pictureUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

  return (
    <nav className="navbar bg-gradient-to-r from-primary to-secondary text-white shadow-lg px-4 py-2 sticky top-0 z-50">
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-2">
          <img src="/petit-logo.svg" alt="Petit Shop logo" className="h-8 w-8" />
          <span className="font-bold text-2xl tracking-tight drop-shadow">Petit Shop</span>
        </Link>
      </div>

      <div className="flex-none flex items-center gap-4">
        <Link to="/about" className="btn btn-ghost hover:bg-white/10 transition">About Us</Link>
        <Link to="/contactus" className="btn btn-ghost hover:bg-white/10 transition">Contact Us</Link>
        <Link to="/shop" className="btn btn-ghost hover:bg-white/10 transition">Shop</Link>
        <Link to="/businesses" className="btn btn-ghost hover:bg-white/10 transition">Directory</Link>

        <button
          className="btn btn-ghost hover:bg-white/10 transition"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => setIsDark(!isDark)}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? (
            // Sun icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.22l.94 1.88a1 1 0 00.75.54l2.07.3-1.5 1.46a1 1 0 00-.28.88l.35 2.03-1.86-.98a1 1 0 00-.92 0L7.7 11.8l.35-2.03a1 1 0 00-.28-.88L5.27 7.43l2.07-.3a1 1 0 00.75-.54L10 3.22z"/></svg>
          ) : (
            // Moon icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 116.707 2.707a7 7 0 0010.586 10.586z"/></svg>
          )}
        </button>

        {!buyer && <Link to="/auth/buyer" className="btn btn-ghost hover:bg-white/10 transition">Buyer</Link>}
        {!seller && <Link to="/auth/seller" className="btn btn-ghost hover:bg-white/10 transition">Seller</Link>}

        {seller && <Link to="/MSeller" className="btn btn-ghost hover:bg-white/10 transition">Manage</Link>}

        {!seller && (
          <Link to="/cart" className="btn btn-ghost btn-circle hover:bg-white/10 transition">
            <div className="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="badge badge-sm indicator-item bg-accent border-none text-white">{totalItems}</span>
            </div>
          </Link>
        )}


        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle hover:bg-white/10 transition">
            <div className="avatar w-10 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
              <img
                alt={buyer?.name || seller?.name ? `${buyer?.name || seller?.name} avatar` : 'User avatar'}
                src={avatarSrc}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box z-1 mt-3 w-52 p-2 shadow-lg">
            {seller && <li><a className="justify-between">{seller.name}</a></li>}
            {seller && <li><Link to="/profile/seller">Profile</Link></li>}
            {buyer && <li><a className="justify-between">{buyer.name}</a></li>}
            {buyer && <li><Link to="/profile/buyer">Profile</Link></li>}
            {buyer && <li><Link to="/profile/buyer/account">Account</Link></li>}
            <li><a onClick={() => handleLogout('all')}>Logout</a></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}