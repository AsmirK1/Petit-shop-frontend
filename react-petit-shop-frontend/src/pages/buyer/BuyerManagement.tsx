import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const BuyerManagement: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favBusinesses, setFavBusinesses] = useState<any[]>([]);

  useEffect(() => {
    const o = typeof window !== 'undefined' ? localStorage.getItem('buyer_orders') : null;
    const f = typeof window !== 'undefined' ? localStorage.getItem('buyer_favorites') : null;
    const fb = typeof window !== 'undefined' ? localStorage.getItem('buyer_favorite_businesses') : null;
    setOrders(o ? JSON.parse(o) : []);
    setFavorites(f ? JSON.parse(f) : []);
    setFavBusinesses(fb ? JSON.parse(fb) : []);
  }, []);

  const removeFavorite = (id: string) => {
    const updated = favorites.filter((it) => it.id !== id);
    setFavorites(updated);
    localStorage.setItem('buyer_favorites', JSON.stringify(updated));
  };

  const removeFavBusiness = (id: string) => {
    const updated = favBusinesses.filter((b) => String(b.id) !== String(id));
    setFavBusinesses(updated);
    localStorage.setItem('buyer_favorite_businesses', JSON.stringify(updated));
  };

  const clearOrders = () => {
    if (!confirm('Clear purchase history?')) return;
    setOrders([]);
    localStorage.removeItem('buyer_orders');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h2 className="text-2xl font-semibold mb-4">Account & History</h2>

      <section className="card p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Purchase History</h3>
          <div className="text-sm text-base-content/70">{orders.length} orders</div>
        </div>
        {orders.length === 0 ? (
          <div className="italic">No purchases yet.</div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="p-3 border rounded">
                <div className="flex justify-between">
                  <div>Order #{o.id}</div>
                  <div className="font-bold">${Number(o.total ?? 0).toFixed(2)}</div>
                </div>
                <div className="text-sm text-base-content/70 mt-2">{o.createdAt ?? ''}</div>
                <div className="mt-2">
                  <details>
                    <summary className="text-sm">Items</summary>
                    <pre className="whitespace-pre-wrap text-sm mt-2">{o.itemsJson ?? JSON.stringify(o.items ?? [])}</pre>
                  </details>
                </div>
              </div>
            ))}
            <div className="mt-3">
              <button className="btn btn-ghost btn-sm" onClick={clearOrders}>Clear history</button>
            </div>
          </div>
        )}
      </section>

      <section className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Favorites</h3>
          <div className="text-sm text-base-content/70">{favorites.length} items</div>
        </div>
        {favorites.length === 0 ? (
          <div className="italic">No favorites yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favorites.map((it) => (
              <div key={it.id} className="p-3 border rounded flex gap-3 items-center">
                {it.image && <img src={it.image} alt={it.title} className="w-16 h-16 object-cover rounded" />}
                <div className="flex-1">
                  <div className="font-semibold">{it.title}</div>
                  <div className="text-sm text-base-content/70">${it.price}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="btn btn-xs" onClick={() => navigate(`/business/${it.businessId ?? ''}`)}>View</button>
                  <button className="btn btn-xs btn-ghost" onClick={() => removeFavorite(it.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card p-4 mt-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Favorite Businesses</h3>
          <div className="text-sm text-base-content/70">{favBusinesses.length} items</div>
        </div>
        {favBusinesses.length === 0 ? (
          <div className="italic">No favorite businesses yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favBusinesses.map((b) => (
              <div key={b.id} className="p-3 border rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold">{b.name}</div>
                  <div className="text-sm text-base-content/70">{b.category} • {b.city}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="btn btn-xs" onClick={() => navigate(`/business/${b.id}`)}>View</button>
                  <button className="btn btn-xs btn-ghost" onClick={() => removeFavBusiness(b.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default BuyerManagement;
