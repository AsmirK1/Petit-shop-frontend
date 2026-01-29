import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPasswordRequest: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email.includes("@")) {
      setMessage("Enter a valid email");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const API_BASE = import.meta.env.DEV ? "http://localhost:5062" : (import.meta.env.VITE_API_URL || "");
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const text = await res.text();
      if (!res.ok) {
        let msg = text;
        try { const j = JSON.parse(text); msg = j.error ?? j.message ?? JSON.stringify(j); } catch { /* ignore */ }
        throw new Error(msg || "Failed to request password reset");
      }
      // Show helpful message
      let parsed: { emailSent?: boolean } | null = null;
      try { parsed = text ? JSON.parse(text) : null; } catch { /* ignore */ }
      
      if (parsed && parsed.emailSent) {
        setMessage("Password reset email sent! Please check your inbox and spam folder.");
      } else {
        setMessage("If an account with that email exists, a password reset email was sent.");
      }
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h2 className="text-2xl font-semibold mb-4">Forgot your password?</h2>
      {message && <div className="alert alert-info mb-4">{message}</div>}
      <form onSubmit={submit} className="space-y-4">
        <input className="input input-bordered w-full" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <div className="flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send reset email'}</button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/auth/seller')}>Back to login</button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordRequest;
