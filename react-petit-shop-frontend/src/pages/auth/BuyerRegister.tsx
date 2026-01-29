import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const BuyerRegister: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || password.length < 6) {
      alert("Provide a valid email and password (min 6 chars)");
      return;
    }
    try {
      setLoading(true);
      const API_BASE = import.meta.env.DEV ? "http://localhost:5062" : "";
      const res = await fetch(`${API_BASE}/api/auth/buyer/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const text = await res.text();
      if (!res.ok) {
        let msg = "Register failed";
        try { const j = JSON.parse(text); msg = j.error ?? j.detail ?? j.title ?? JSON.stringify(j); } catch {}
        throw new Error(msg);
      }
      // Try to parse success body; backend includes verifyUrl and token in dev when SMTP disabled
      try {
        const j = text ? JSON.parse(text) : null;
        if (j && (j.verifyUrl || j.token)) {
          const info = `Registered. Verification link: ${j.verifyUrl ?? ''}${j.token ? ` (token: ${j.token})` : ''}`;
          alert(info);
        } else {
          alert('Registered — you can now log in');
        }
      } catch {
        alert('Registered — you can now log in');
      }
      // Clear client-side cached data (favorites/orders) so the new account starts fresh
      try {
        localStorage.removeItem("buyer_favorites");
        localStorage.removeItem("buyer_favorite_businesses");
        localStorage.removeItem("buyer_orders");
      } catch {}
      navigate("/auth/buyer/login");
    } catch (err) {
      console.error(err);
      const msg = err && typeof err === 'object' && 'message' in err ? (err as Error).message : String(err);
      alert(msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h2 className="text-2xl font-semibold mb-4">Buyer Register</h2>
      <form onSubmit={submit} className="space-y-4">
        <input className="input input-bordered w-full" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input input-bordered w-full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="input input-bordered w-full" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="flex justify-between items-center">
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Saving..." : "Register"}</button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate("/auth/buyer/login")}>Have an account?</button>
        </div>
      </form>
    </div>
  );
};

export default BuyerRegister;
