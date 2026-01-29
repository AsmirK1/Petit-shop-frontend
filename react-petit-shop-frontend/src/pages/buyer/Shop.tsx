import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import type { Product } from "../managementseller/utilities/type";
import { useCart } from "../../context/CartContext";

export const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addItem, updateQuantity, removeItem, items: cartItems } = useCart();
  const sellerUser = typeof window !== 'undefined' ? localStorage.getItem('seller_user') : null;
  const isSeller = !!sellerUser;

  useEffect(() => {
    const apiBase = import.meta.env.DEV ? "http://localhost:5062" : (import.meta.env.VITE_API_URL || "");
    fetch(`${apiBase}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products");
        return res.json();
      })
      .then((data: Product[]) => {
        const arr = data ?? [];
        setProducts(arr);
        try {
          const cats = Array.from(new Set(arr.map((p) => p.category).filter(Boolean))) as string[];
          cats.sort();
          setCategories(cats);
        } catch { }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8">Loading products...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  const filteredProducts = products.filter((p) => {
    const matchesName = (p.title ?? p.name ?? "").toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === "All" || (p.category ?? "").toLowerCase() === selectedCategory.toLowerCase();
    return matchesName && matchesCategory;
  });

  const grouped = filteredProducts.reduce((acc: Record<string, Product[]>, p) => {
    const key = p.category ?? "Uncategorized";
    (acc[key] ||= []).push(p);
    return acc;
  }, {} as Record<string, Product[]>);
  let content: ReactNode = null;
  if (products.length === 0) {
    content = <div className="text-center py-12 text-base-content/60">No products available.</div>;
  } else if (filteredProducts.length === 0) {
    content = <div className="text-center py-12 text-base-content/60">No products match your search.</div>;
  } else {
    content = Object.entries(grouped).map(([category, items]) => (
      <section key={category} className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{category}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((prod) => {
            const id = String(prod.id);
            const inCart = cartItems.find((c) => c.id === id);
            const qty = inCart?.quantity ?? 0;
            const favStored = typeof window !== 'undefined' ? localStorage.getItem('buyer_favorites') : null;
            const favArr = favStored ? JSON.parse(favStored) : [];
            const isFav = favArr.find((f: any) => String(f.id) === id) != null;
            return (
              <div key={prod.id} className="card bg-base-100 shadow-xl">
                <figure className="px-4 pt-4">
                  <img
                    src={prod.image ?? "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                    alt={prod.title ?? prod.name ?? "product"}
                    className="w-full h-40 object-cover rounded-md"
                  />
                </figure>
                <div className="card-body">
                  <h3 className="card-title">{prod.title ?? prod.name}</h3>
                  <p className="text-sm text-gray-500">{prod.category}</p>
                  <p className="text-accent font-bold">${prod.price?.toFixed?.(2) ?? prod.price}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      className={`btn btn-xs ${isFav ? 'btn-warning' : 'btn-ghost'}`}
                      onClick={() => {
                        try {
                          const s = localStorage.getItem('buyer_favorites');
                          const arr = s ? JSON.parse(s) : [];
                          if (isFav) {
                            const updated = arr.filter((a: any) => String(a.id) !== id);
                            localStorage.setItem('buyer_favorites', JSON.stringify(updated));
                          } else {
                            const entry = { id, title: prod.title ?? prod.name, price: prod.price ?? 0, image: prod.image, businessId: prod.businessId };
                            arr.unshift(entry);
                            localStorage.setItem('buyer_favorites', JSON.stringify(arr));
                          }
                          window.dispatchEvent(new CustomEvent('profileUpdated', { detail: { role: 'buyer', user: JSON.parse(localStorage.getItem('buyer_user') || 'null') } }));
                        } catch { }
                      }}
                    >
                      {isFav ? 'Favorited' : '❤'}
                    </button>
                  </div>
                  {isSeller ? (
                    <div className="italic text-base-content/60 mt-4">Seller view — cart disabled</div>
                  ) : (
                    qty > 0 ? (
                      <div className="flex items-center gap-2 mt-4">
                        <button
                          className="btn btn-sm"
                          onClick={() => {
                            if (qty <= 1) removeItem(id);
                            else updateQuantity(id, qty - 1);
                          }}
                        >
                          -
                        </button>
                        <div className="px-3">{qty}</div>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            const cartItem = {
                              id,
                              title: prod.title ?? prod.name,
                              price: prod.price ?? 0,
                              category: prod.category ?? "",
                              image: prod.image,
                              businessId: prod.businessId,
                            };
                            addItem(cartItem as any, 1);
                          }}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-primary mt-4"
                        onClick={() => {
                          const cartItem = {
                            id,
                            title: prod.title ?? prod.name,
                            price: prod.price ?? 0,
                            category: prod.category ?? "",
                            image: prod.image,
                            quantity: 1,
                            businessId: prod.businessId,
                          };
                          addItem(cartItem as any, 1);
                        }}
                      >
                        Add to cart
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    ));
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Shop</h1>
      <div className="mb-6">
        <Link to="/contactus" className="card card-side bg-base-100 shadow-md hover:shadow-lg transition w-full max-w-md">
          <div className="card-body">
            <h3 className="card-title">Need help?</h3>
            <p className="text-sm text-gray-500">Contact us for questions or support</p>
          </div>
          <div className="p-4 flex items-center">
            <button className="btn btn-sm btn-primary">Contact Us</button>
          </div>
        </Link>
      </div>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <input
          placeholder="Search products by name..."
          className="input input-bordered w-full max-w-md"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <label className="text-sm mr-2">Category</label>
          <select
            className="select select-bordered"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Group products by category */}
      {content}
    </div>
  );
};

export default Shop;
