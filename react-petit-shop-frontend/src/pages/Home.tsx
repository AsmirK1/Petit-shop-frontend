import { Link, useNavigate } from "react-router-dom";
import { useCallback } from "react";

export const Home = () => {
  const navigate = useNavigate();

  const handleSellerClick = useCallback(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('seller_token') : null;
    if (token) {
      navigate('/MSeller');
    } else {
      navigate('/auth/seller');
    }
  }, [navigate]);

  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] gap-10">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-primary drop-shadow mb-8">Welcome to Petit Shop</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        <div className="card bg-gradient-to-br from-primary to-secondary text-white shadow-xl w-full">
          <div className="card-body flex flex-col">
            <h2 className="card-title text-2xl">Buyers!</h2>
            <p className="mb-4">If you want to buy a product and support small businesses</p>
            <div className="card-actions mt-auto justify-end">
              <Link to="/shop" className="btn btn-accent btn-wide">Shop Now</Link>
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-secondary to-primary text-white shadow-xl w-full">
          <div className="card-body flex flex-col">
            <h2 className="card-title text-2xl">Sellers!</h2>
            <p className="mb-4">If you have a product or service to offer</p>
            <div className="card-actions mt-auto justify-end">
              <button type="button" onClick={handleSellerClick} className="btn btn-accent btn-wide">Start Selling</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
