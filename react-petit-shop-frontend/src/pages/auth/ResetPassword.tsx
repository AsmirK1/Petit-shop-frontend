import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPassword: React.FC = () => {
  const query = useQuery();
  const tokenFromQuery = query.get('token') || '';
  const [token, setToken] = useState(tokenFromQuery);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setMessage('No token provided. Use the link from your email.');
    }
  }, [token]);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!token) return setMessage('Token is required');
    if (password.length < 6) return setMessage('Password must be at least 6 characters');
    if (password !== confirm) return setMessage('Passwords do not match');
    setLoading(true);
    setMessage(null);
    try {
      const API_BASE = import.meta.env.DEV ? "http://localhost:5062" : (import.meta.env.VITE_API_URL || "");
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password })
      });
      const text = await res.text();
      if (!res.ok) {
        let msg = text;
        try { const j = JSON.parse(text); msg = j.error ?? j.message ?? JSON.stringify(j); } catch { /* ignore */ }
        throw new Error(msg || 'Failed to reset password');
      }
      setMessage('Password has been reset — you can now log in');
      setTimeout(() => navigate('/auth/seller'), 1500);
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h2 className="text-2xl font-semibold mb-4">Reset password</h2>
      {message && <div className="alert alert-info mb-4">{message}</div>}
      <form onSubmit={submit} className="space-y-4">
        <input className="input input-bordered w-full" placeholder="Token (from email)" value={token} onChange={e => setToken(e.target.value)} />
        <input className="input input-bordered w-full" placeholder="New password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <input className="input input-bordered w-full" placeholder="Confirm password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />
        <div className="flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Set new password'}</button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/auth/seller')}>Back to login</button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
