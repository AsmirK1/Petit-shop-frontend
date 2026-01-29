import { useState, useEffect } from "react";
import type { Page, CartItem } from "./utilities/type";
import { BusinessNavbar } from "./components/BusinessNavbar";
import { BusinessFooter } from "./components/BusinessFooter";
import { CreateCartForm } from "./CreateCartForm";

type Props = {
  page: Page;
  onAddCart: (cart: CartItem) => void;
  onUpdatePage?: (id: string, title: string) => void;
  onDeletePage?: (id: string) => void;
  onUpdateCart?: (pageId: string, cartId: string, cart: CartItem) => void;
  onDeleteCart?: (pageId: string, cartId: string) => void;
};
export const PagePreview: React.FC<Props> = ({ page, onAddCart, onUpdatePage, onDeletePage, onUpdateCart, onDeleteCart }) => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(page.title ?? "");
  const [editingCartId, setEditingCartId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState<number | "">("");
  const [editCategory, setEditCategory] = useState("");

  // Keep local title in sync when parent updates
  useEffect(() => {
    setTitle(page.title ?? "");
  }, [page.title]);

  return (
    <div className="card bg-gradient-to-br from-base-100 to-base-200 shadow-md border border-base-300 p-4">
      {!showForm && <BusinessNavbar />}

      <div className="flex justify-between items-center mb-2">
        {!editing ? (
          <h3 className="font-semibold text-lg text-primary">{page.title}</h3>
          ) : (
          <input className="input input-bordered" value={title} onChange={(e) => setTitle(e.target.value)} />
        )}

        <div className="flex items-center gap-2">
          {!editing ? (
            <>
              <button className="btn btn-accent btn-xs shadow" onClick={() => setShowForm(true)}>Add Cart</button>
              <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>Edit</button>
              <button className="btn btn-error btn-sm" onClick={() => onDeletePage?.(page.id ?? (page as any).Id)}>Delete</button>
            </>
          ) : (
            <>
              <button
                className="btn btn-success btn-sm"
                onClick={async () => {
                  const pid = page.id ?? (page as any).Id ?? "";
                  try {
                    console.log("Updating page", pid, title);
                    if (!onUpdatePage) throw new Error("No handler");
                    await onUpdatePage(pid, title);
                  } catch (err) {
                    console.error(err);
                    alert("Failed to update page");
                  } finally {
                    setEditing(false);
                  }
                }}
              >
                Save
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => { setTitle(page.title); setEditing(false); }}>Cancel</button>
            </>
          )}
        </div>
      </div>

      <div className="mt-2 space-y-3">
        {(page.carts || []).length === 0 ? (
          <div className="text-base-content/60 italic">No carts yet.</div>
        ) : (
          (page.carts || []).map((cart) => (
            <div key={cart.id ?? cart.Id ?? `${page.id}-cart-${Math.random().toString(36).slice(2,8)}`} className="card bg-base-100 border border-base-200 p-3 flex items-center gap-4 shadow-sm">
              {cart.image && <img src={cart.image} className="w-14 h-14 object-cover rounded" />}
              {editingCartId === cart.id ? (
                <div className="flex-1">
                  <input className="input input-bordered mb-2 w-full" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                  <input type="number" className="input input-bordered mb-2 w-full" value={editPrice} onChange={e => setEditPrice(e.target.value === "" ? "" : Number(e.target.value))} />
                  <input className="input input-bordered mb-2 w-full" value={editCategory} onChange={e => setEditCategory(e.target.value)} />
                  <div className="flex gap-2">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={async () => {
                        try {
                          const pid = page.id ?? (page as any).Id ?? "";
                          console.log("Updating cart", cart.id, { title: editTitle, price: editPrice, category: editCategory });
                          if (!onUpdateCart) throw new Error("No handler");
                          await onUpdateCart(pid, cart.id, { ...cart, title: editTitle, price: Number(editPrice || 0), category: editCategory });
                          setEditingCartId(null);
                        } catch (err) {
                          console.error(err);
                          alert("Failed to update cart item");
                        }
                      }}
                    >
                      Save
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditingCartId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <h4 className="font-semibold text-base text-primary">{cart.title}</h4>
                  <p className="text-sm text-base-content/70">{cart.category}</p>
                  <p className="text-accent font-bold">${Number(cart.price || cart.Price || 0).toFixed(2)}</p>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <button
                  className="btn btn-outline btn-xs"
                  onClick={() => {
                    setEditingCartId(cart.id);
                    setEditTitle(cart.title);
                    setEditPrice(cart.price);
                    setEditCategory(cart.category);
                  }}
                >
                  Edit
                </button>
                <button className="btn btn-error btn-xs" onClick={() => onDeleteCart?.(page.id ?? (page as any).Id, cart.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {!showForm && <BusinessFooter />}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-xl shadow-lg p-6 border border-base-200 w-full max-w-md">
            <CreateCartForm
              onSave={(cart) => {
                onAddCart(cart);
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
