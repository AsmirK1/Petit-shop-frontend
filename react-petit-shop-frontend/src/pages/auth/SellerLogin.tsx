import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SellerLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || password.length < 1) {
      alert("Enter valid credentials");
      return;
    }
    try {
      setLoading(true);
      const API_BASE = import.meta.env.DEV ? "http://localhost:5062" : "";
      const res = await fetch(`${API_BASE}/api/auth/seller/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const text = await res.text();
      if (!res.ok) {
        let msg = "Login failed";
        try { const j = JSON.parse(text); msg = j.error ?? j.detail ?? j.title ?? JSON.stringify(j); } catch { /* ignore */ }
        throw new Error(msg);
      }
      const data = text ? JSON.parse(text) : null;
      // clear buyer session when seller signs in
      localStorage.removeItem("buyer_token");
      localStorage.removeItem("buyer_user");
      if (data.token) localStorage.setItem("seller_token", data.token);
      if (data.user) localStorage.setItem("seller_user", JSON.stringify(data.user));
      alert("Seller logged in");
      navigate("/MSeller");
    } catch (err) {
      console.error(err);
      const msg = err && typeof err === 'object' && 'message' in err ? (err as Error).message : String(err);
      alert(msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h2 className="text-2xl font-semibold mb-4">Seller Login</h2>
      <form onSubmit={submit} className="space-y-4">
        <input className="input input-bordered w-full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="input input-bordered w-full" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="flex justify-between items-center">
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate("/auth/seller/register")}>Register</button>
        </div>
        <div className="text-center">
          <button 
            type="button" 
            className="btn btn-link text-sm" 
            onClick={() => navigate("/auth/forgot", { state: { role: "Seller" } })}
          >
            Forgot your password?
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerLogin;
