import React from "react";
import { useCart } from "../../context/CartContext";
import type { Page, CartItem } from "../managementseller/utilities/type";

type Props = {
  page: Page;
};

export const PageView: React.FC<Props> = ({ page }) => {
  const { addItem, updateQuantity, removeItem, items: cartItems } = useCart();
  const sellerUser = typeof window !== 'undefined' ? localStorage.getItem('seller_user') : null;
  const isSeller = !!sellerUser;

  return (
    <div className="card bg-base-100 border border-base-200 p-4 shadow-sm mb-6">
      <h3 className="text-xl font-semibold mb-3">{page.title}</h3>
      {page.carts.length === 0 ? (
        <div className="italic text-base-content/60">No items on this page.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {page.carts.map((cart: CartItem) => {
            const qty = cartItems.find((c) => c.id === cart.id)?.quantity ?? 0;
            return (
              <div key={cart.id} className="card p-3 border border-base-200 shadow-sm relative">
                {cart.image && <img src={cart.image} alt={cart.title} className="w-full h-40 object-cover rounded mb-2" />}
                <h4 className="font-semibold">{cart.title}</h4>
                <p className="text-sm text-base-content/70">{cart.category}</p>
                <p className="text-accent font-bold mt-2">${Number(cart.price).toFixed(2)}</p>
                <div className="mt-3">
                  {isSeller ? (
                    <div className="italic text-base-content/60">Seller view — cart disabled</div>
                  ) : (
                    (qty > 0 ? (
                      <div className="flex items-center gap-2">
                        <button
                          className="btn btn-sm"
                          onClick={() => {
                            if (qty <= 1) removeItem(cart.id);
                            else updateQuantity(cart.id, qty - 1);
                          }}
                        >
                          -
                        </button>
                        <div className="px-3">{qty}</div>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => addItem(cart as any, 1)}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button className="btn btn-primary btn-sm" onClick={() => addItem(cart as any, 1)}>Add to cart</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PageView;
