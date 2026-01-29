import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const BuyerProfile: React.FC = () => {
  const navigate = useNavigate();
  const stored = typeof window !== 'undefined' ? localStorage.getItem('buyer_user') : null;
  const parsed = stored ? JSON.parse(stored) : {};

  const [name, setName] = useState(parsed.name ?? '');
  const [email, setEmail] = useState(parsed.email ?? '');
  const [phone, setPhone] = useState(parsed.phone ?? '');
  const [bio, setBio] = useState(parsed.bio ?? '');
  const [pictureUrl, setPictureUrl] = useState(parsed.pictureUrl ?? '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stored) {
      // if no buyer session, redirect to buyer auth
      navigate('/auth/buyer');
    }
  }, [stored]);

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
      const token = localStorage.getItem('buyer_token');
      const body = { name, phone, bio, pictureUrl };
      const res = await fetch(`${API_BASE}/api/auth/buyer/profile`, {
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
      // update localStorage and notify other components/tabs
      const updated = { ...parsed, ...data };
      localStorage.setItem('buyer_user', JSON.stringify(updated));
      try { window.dispatchEvent(new CustomEvent('profileUpdated', { detail: { role: 'buyer', user: updated } })); } catch {}
      alert('Profile saved');
    } catch (err) {
      console.error(err);
      alert('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h2 className="text-2xl font-semibold mb-4">Buyer Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <div className="col-span-1 flex flex-col items-center">
          <div className="avatar">
            <div className="w-40 h-40 rounded-full overflow-hidden">
              {pictureUrl ? (
                <img src={pictureUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-40 h-40 bg-base-200 rounded-full" />
              )}
            </div>
          </div>
          <label className="btn btn-sm btn-ghost mt-3">
            Choose image
            <input className="hidden" type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
          </label>
        </div>

        <div className="col-span-2">
          <div className="space-y-3">
            <input className="input input-bordered w-full" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="input input-bordered w-full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="input input-bordered w-full" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <textarea className="textarea textarea-bordered w-full" placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
            <label className="btn btn-sm btn-ghost">
              Choose image
              <input className="hidden" type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
            </label>
            <div className="flex gap-2">
              <button className="btn btn-primary" onClick={save} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
              <button className="btn btn-ghost" onClick={() => navigate('/')}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerProfile;
