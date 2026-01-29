import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SellerRegister: React.FC = () => {
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || password.length < 6 || businessName.trim().length === 0) {
      alert("Enter a business name, valid email and a password (min 6 chars)");
      return;
    }
    try {
      setLoading(true);
      const API_BASE = import.meta.env.DEV ? "http://localhost:5062" : "";
      const res = await fetch(`${API_BASE}/api/auth/seller/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: businessName, email, password }),
      });
      const text = await res.text();
      if (!res.ok) {
        let msg = "Register failed";
        try { const j = JSON.parse(text); msg = j.error ?? j.detail ?? j.title ?? JSON.stringify(j); } catch {}
        throw new Error(msg);
      }
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
      // Clear any buyer session and cached buyer data when switching to seller flow
      try {
        localStorage.removeItem("buyer_token");
        localStorage.removeItem("buyer_user");
        localStorage.removeItem("buyer_favorites");
        localStorage.removeItem("buyer_favorite_businesses");
        localStorage.removeItem("buyer_orders");
      } catch {}
      navigate("/auth/seller/login");
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
      <h2 className="text-2xl font-semibold mb-4">Seller Register</h2>
      <form onSubmit={submit} className="space-y-4">
        <input className="input input-bordered w-full" placeholder="Business name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
        <input className="input input-bordered w-full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="input input-bordered w-full" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="flex justify-between items-center">
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Saving..." : "Register"}</button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate("/auth/seller/login")}>Have an account?</button>
        </div>
      </form>
    </div>
  );
};

export default SellerRegister;
