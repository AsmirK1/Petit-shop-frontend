import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import type { Business, Page as PageType, CartItem } from "./utilities/type";
import { PagePreview } from "./PagePreview";

export const BusinessEditor: React.FC = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiBase = import.meta.env.DEV ? "http://localhost:5062" : (import.meta.env.VITE_API_URL || "");
  const sellerToken = localStorage.getItem("seller_token");
  const authHeaders = (extra?: Record<string,string>) => ({ ...(extra ?? {}), ...(sellerToken ? { Authorization: `Bearer ${sellerToken}` } : {}), "Content-Type": "application/json" });

  useEffect(() => {
    if (!businessId) return;
    setLoading(true);
    fetch(`${apiBase}/api/businesses/${businessId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Business not found");
        return res.json();
      })
      .then((data) => setBusiness(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [businessId]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!business) return <div className="text-center py-8">No business found.</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>Back</button>
        <h1 className="text-2xl font-bold">Manage: {business.name}</h1>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Pages</h2>
        <div className="mt-4 space-y-4">
          {business.pages.map((page: PageType) => (
            <PagePreview
              key={page.id}
              page={page}
              onAddCart={(cart: CartItem) => {
                // create cart item and refresh local state
                fetch(`${apiBase}/api/cartitems`, {
                  method: "POST",
                  headers: authHeaders(),
                  body: JSON.stringify({ ...cart, pageId: page.id }),
                })
                  .then((r) => r.json())
                  .then((saved) => setBusiness((b) => b ? { ...b, pages: b.pages.map(p => p.id === page.id ? { ...p, carts: [...p.carts, saved] } : p) } : b))
                  .catch(() => alert("Failed to save cart"));
              }}
              onUpdatePage={async (id, title) => {
                const res = await fetch(`${apiBase}/api/pages/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ id, title, businessId: business.id }) });
                if (!res.ok) return alert("Failed to update page");
                setBusiness((b) => b ? { ...b, pages: b.pages.map(p => p.id === id ? { ...p, title } : p) } : b);
              }}
              onDeletePage={async (id) => {
                if (!confirm("Delete this page?")) return;
                const res = await fetch(`${apiBase}/api/pages/${id}`, { method: "DELETE", headers: authHeaders() });
                if (!res.ok) return alert("Failed to delete page");
                setBusiness((b) => b ? { ...b, pages: b.pages.filter(p => p.id !== id) } : b);
              }}
              onUpdateCart={async (pageId, cartId, cart) => {
                const res = await fetch(`${apiBase}/api/cartitems/${cartId}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ ...cart, id: cartId, pageId }) });
                if (!res.ok) return alert("Failed to update cart item");
                setBusiness((b) => b ? { ...b, pages: b.pages.map(p => p.id === pageId ? { ...p, carts: p.carts.map(c => c.id === cartId ? { ...c, ...cart } : c) } : p) } : b);
              }}
              onDeleteCart={async (pageId, cartId) => {
                if (!confirm("Delete this cart item?")) return;
                const res = await fetch(`${apiBase}/api/cartitems/${cartId}`, { method: "DELETE", headers: authHeaders() });
                if (!res.ok) return alert("Failed to delete cart item");
                setBusiness((b) => b ? { ...b, pages: b.pages.map(p => p.id === pageId ? { ...p, carts: p.carts.filter(c => c.id !== cartId) } : p) } : b);
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <Link to="/MSeller" className="btn btn-outline">Back to businesses</Link>
      </div>
    </div>
  );
};

export default BusinessEditor;
