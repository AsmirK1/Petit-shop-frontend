import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const SellerProfile: React.FC = () => {
  const navigate = useNavigate();
  const stored = typeof window !== 'undefined' ? localStorage.getItem('seller_user') : null;
  const parsed = stored ? JSON.parse(stored) : {};

  const [email, setEmail] = useState(parsed.email ?? '');
  const [pictureUrl, setPictureUrl] = useState(parsed.pictureUrl ?? '');
  const [paypalMerchantId, setPaypalMerchantId] = useState('');
  const [loading, setLoading] = useState(false);
  const [paypalLoading, setPaypalLoading] = useState(false);
  

  useEffect(() => {
    if (!stored) navigate('/auth/seller');
    
    // Fetch PayPal Merchant ID
    const fetchPayPalMerchantId = async () => {
      try {
        const API_BASE = import.meta.env.DEV ? 'http://localhost:5062' : '';
        const token = localStorage.getItem('seller_token');
        const res = await fetch(`${API_BASE}/api/auth/seller/paypal-merchant`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (res.ok) {
          const data = await res.json();
          setPaypalMerchantId(data.payPalMerchantId || '');
        }
      } catch (err) {
        console.error('Failed to fetch PayPal Merchant ID:', err);
      }
    };
    
    if (stored) fetchPayPalMerchantId();
  }, [stored, navigate]);

  const onFile = (f?: File) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPictureUrl(String(reader.result));
    reader.readAsDataURL(f);
  };

  const save = async () => {
    setLoading(true);
    try {
      const API_BASE = import.meta.env.DEV ? 'http://localhost:5062' : '';
      const token = localStorage.getItem('seller_token');
      const body = { email, pictureUrl };
      const res = await fetch(`${API_BASE}/api/auth/seller/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Save failed');
      }
      const data = await res.json();
      const updated = { ...parsed, ...data };
      localStorage.setItem('seller_user', JSON.stringify(updated));
      // notify other components (Nav) in the same window to update avatar/name
      try {
        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: { role: 'seller', user: updated } }));
      } catch {
        // Ignore
      }
      alert('Profile saved');
    } catch (err) {
      console.error(err);
      alert('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const savePayPalMerchantId = async () => {
    if (!paypalMerchantId.trim()) {
      alert('Please enter your PayPal Merchant ID');
      return;
    }

    setPaypalLoading(true);
    try {
      const API_BASE = import.meta.env.DEV ? 'http://localhost:5062' : '';
      const token = localStorage.getItem('seller_token');
      const res = await fetch(`${API_BASE}/api/auth/seller/paypal-merchant`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ payPalMerchantId: paypalMerchantId }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Save failed');
      }
      const data = await res.json();
      alert(data.message || 'PayPal Merchant ID saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save PayPal Merchant ID');
    } finally {
      setPaypalLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h2 className="text-2xl font-semibold mb-4">Seller Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <div className="flex flex-col items-center">
          <div className="avatar">
            <div className="w-40 h-40 rounded-full overflow-hidden">
              {pictureUrl ? (
                <img src={pictureUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-40 h-40 bg-base-200 rounded-full" />
              )}
            </div>
          </div>
        </div>

        <div className="col-span-2 space-y-3">
          <input className="input input-bordered w-full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="btn btn-sm btn-ghost">
            Choose image
            <input className="hidden" type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
          </label>
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={save} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
            <button className="btn btn-ghost" onClick={() => navigate('/MSeller')}>Close</button>
          </div>
        </div>
      </div>

      {/* PayPal Merchant ID Section */}
      <div className="divider my-6"></div>
      <div className="card bg-base-200 p-6">
        <h3 className="text-xl font-semibold mb-4">💳 PayPal Settings</h3>
        <p className="text-sm text-base-content/70 mb-4">
          To receive payments via PayPal, enter your PayPal Merchant ID. You can find this in your PayPal account settings.
        </p>
        <div className="space-y-3">
          <input 
            className="input input-bordered w-full" 
            placeholder="PayPal Merchant ID (e.g., 2GPHJXEMS9HFL)" 
            value={paypalMerchantId} 
            onChange={(e) => setPaypalMerchantId(e.target.value)} 
          />
          <div className="flex gap-2">
            <button 
              className="btn btn-success" 
              onClick={savePayPalMerchantId} 
              disabled={paypalLoading || !paypalMerchantId.trim()}
            >
              {paypalLoading ? 'Saving...' : 'Save PayPal Merchant ID'}
            </button>
            <a 
              href="https://developer.paypal.com/dashboard/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-ghost btn-sm"
            >
              📖 How to find Merchant ID
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
