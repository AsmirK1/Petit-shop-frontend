import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Business, Page as PageType } from "../managementseller/utilities/type";
import PageView from "./PageView";
import { useCart } from "../../context/CartContext";



export const BusinessShop: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { totalItems } = useCart();
  const sellerUser = typeof window !== 'undefined' ? localStorage.getItem('seller_user') : null;
  const isSeller = !!sellerUser;

  useEffect(() => {
    if (!businessId) return;
    (async () => {
      setLoading(true);
      try {
        const API_BASE = import.meta.env.DEV ? "http://localhost:5062" : "";
        const res = await fetch(`${API_BASE}/api/businesses/${businessId}`);
        if (!res.ok) throw new Error("Failed to load business");
        const data = await res.json();
        setBusiness(data);
      } catch (err) {
        console.error(err);
        setBusiness(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [businessId]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!business) return <div className="p-4">Business not found.</div>;

  return (
    <div className="p-0">
      <header
        style={{ background: business.theme?.primary ?? undefined }}
        className={`py-8 px-6 text-white`}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold" style={{ color: business.theme?.primary ? '#fff' : undefined }}>{business.name}</h1>
            <p className="text-sm opacity-90">{business.category} • {business.city}, {business.country}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/businesses" className="btn btn-ghost text-white">Back to directory</Link>
            {!isSeller && <div className="badge badge-lg bg-white text-black">Cart: {totalItems}</div>}
            {isSeller && <div className="italic text-white/80">Seller view</div>}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {business.pages && business.pages.length > 0 ? (
          business.pages.map((p: PageType) => (
            <PageView key={p.id} page={p} />
          ))
        ) : (
          <div className="italic text-base-content/60">This shop has no pages yet.</div>
        )}
        
      </main>
    </div>
  );
};

export default BusinessShop;
