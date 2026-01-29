import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import PayPalCheckout from "../../components/PayPalCheckout";
import ShippingForm from "../../components/ShippingForm";
import type { ShippingInfo } from "../../components/ShippingForm";

export const CartPage: React.FC = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clear } = useCart();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
    shippingType: "standard",
  });
  const [loading, setLoading] = useState(false);
  const [usePayPal, setUsePayPal] = useState(false);
  const [buyerUser, setBuyerUser] = useState<any>(null);

  useEffect(() => {
    // load cached buyer user
    const stored = typeof window !== 'undefined' ? localStorage.getItem('buyer_user') : null;
    if (stored) setBuyerUser(JSON.parse(stored));

    // fetch fresh profile if token present
    const fetchProfile = async () => {
      const API_BASE = import.meta.env.DEV ? 'http://localhost:5062' : '';
      const token = localStorage.getItem('buyer_token');
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE}/api/auth/buyer/profile`, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        setBuyerUser(data);
        localStorage.setItem('buyer_user', JSON.stringify(data));
      } catch (err) {
        console.error('Failed fetching buyer profile', err);
      }
    };
    fetchProfile();

    const listener = (e: any) => {
      if (e?.detail?.role === 'buyer') setBuyerUser(e.detail.user);
    };
    window.addEventListener('profileUpdated', listener as EventListener);
    return () => window.removeEventListener('profileUpdated', listener as EventListener);
  }, []);

  const checkout = async () => {
    try {
      if (!shippingInfo.address1 || shippingInfo.address1.trim() === "") {
        alert("Please provide a shipping address before checkout.");
        return;
      }
      setLoading(true);
      const API_BASE = import.meta.env.DEV ? "http://localhost:5062" : "";
      const payload = {
        userId: userId ? Number(userId) : (null as number | null),
        itemsJson: JSON.stringify(items),
        total: totalPrice,
        shippingFullName: shippingInfo.fullName,
        shippingAddress1: shippingInfo.address1,
        shippingAddress2: shippingInfo.address2,
        shippingCity: shippingInfo.city,
        shippingState: shippingInfo.state,
        shippingPostalCode: shippingInfo.postalCode,
        shippingCountry: shippingInfo.country,
        shippingPhone: shippingInfo.phone,
        shippingType: shippingInfo.shippingType
      };
      const headers: Record<string,string> = { "Content-Type": "application/json" };
      const token = localStorage.getItem("buyer_token");
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save order");
      const data = await res.json();
      alert("Order saved (id: " + data.id + ")");
      // append to local buyer_orders for client-side history
      try {
        const stored = localStorage.getItem('buyer_orders');
        const arr = stored ? JSON.parse(stored) : [];
        const entry = { id: data.id, itemsJson: payload.itemsJson, total: payload.total, createdAt: new Date().toISOString() };
        arr.unshift(entry);
        localStorage.setItem('buyer_orders', JSON.stringify(arr));
      } catch { 
        // Ignore localStorage errors
      }
      clear();
    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalSuccess = () => {
    alert("✅ Payment completed successfully! 🎉");
    clear();
    setUsePayPal(false);
  };

  const handlePayPalError = (error: string) => {
    alert("❌ Payment failed: " + error);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
      {buyerUser ? (
        <div className="mb-4 p-3 border rounded flex items-center gap-4">
          <div className="avatar">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-base-200">
              {buyerUser.pictureUrl ? <img src={buyerUser.pictureUrl} alt="avatar" /> : null}
            </div>
          </div>
          <div>
            <div className="font-semibold">{buyerUser.name ?? buyerUser.email}</div>
            <div className="text-sm text-base-content/70">{buyerUser.email}</div>
            {buyerUser.phone ? <div className="text-sm">{buyerUser.phone}</div> : null}
          </div>
        </div>
      ) : null}
      {items.length === 0 ? (
        <div className="italic">Your cart is empty.</div>
      ) : (
        <div className="space-y-4">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-4 p-4 border rounded">
              {it.image && <img src={it.image} alt={it.title} className="w-20 h-20 object-cover rounded" />}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{it.title}</h3>
                  <div className="font-bold">${(it.price * (it.quantity ?? 1)).toFixed(2)}</div>
                </div>
                <p className="text-sm text-base-content/70">{it.category}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button className="btn btn-xs" onClick={() => updateQuantity(it.id, Math.max(1, (it.quantity ?? 1) - 1))}>-</button>
                  <div className="px-3">{it.quantity ?? 1}</div>
                  <button className="btn btn-xs" onClick={() => updateQuantity(it.id, (it.quantity ?? 1) + 1)}>+</button>
                  <button className="btn btn-ghost btn-sm ml-4" onClick={() => removeItem(it.id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}

          <div className="p-4 border rounded flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
            <div>
              <div className="text-sm">Items: {totalItems}</div>
              <div className="text-lg font-bold">Total: ${totalPrice.toFixed(2)}</div>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <input placeholder="User ID (optional)" className="input input-bordered input-sm" value={userId ?? ""} onChange={(e) => setUserId(e.target.value)} />
              <div className="w-full">
                <ShippingForm value={shippingInfo} onChange={setShippingInfo} />
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => clear()}>Clear</button>
              
              {usePayPal ? (
                <div className="w-full mt-2">
                  <PayPalCheckout
                    items={items}
                    total={totalPrice}
                    onSuccess={handlePayPalSuccess}
                    onError={handlePayPalError}
                    shippingInfo={shippingInfo}
                  />
                  <button 
                    className="btn btn-sm mt-2" 
                    onClick={() => setUsePayPal(false)}
                  >
                    Use regular checkout
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    className="btn btn-warning btn-sm" 
                    disabled={loading} 
                    onClick={() => setUsePayPal(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.15a.806.806 0 01-.795.68H8.803c-.397 0-.68-.327-.61-.715l1.693-10.738a.956.956 0 01.943-.806h2.32c4.038 0 6.778-1.667 7.918-6.493z"/>
                      <path d="M6.768 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.15a.806.806 0 01-.795.68H-4.497c-.397 0-.68-.327-.61-.715L-3.414 10.2a.956.956 0 01.943-.806h2.32c4.038 0 6.778-1.667 7.918-6.493z" opacity=".7"/>
                    </svg>
                    💳 Checkout with PayPal
                  </button>
                  
                  <button className="btn btn-primary btn-sm" onClick={checkout} disabled={loading}>{loading ? "Saving..." : "Checkout"}</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
