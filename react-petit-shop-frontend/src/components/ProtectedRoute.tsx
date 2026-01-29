import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;
  requiredAuth: "seller" | "buyer";
  redirectTo?: string;
};

export const ProtectedRoute: React.FC<Props> = ({ 
  children, 
  requiredAuth, 
  redirectTo 
}) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem(`${requiredAuth}_token`);
      setIsAuthenticated(!!token);
      setIsChecking(false);
    };
    checkAuth();
  }, [requiredAuth]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!isAuthenticated) {
    const defaultRedirect = requiredAuth === "seller" 
      ? "/auth/seller" 
      : "/auth/buyer";
    return <Navigate to={redirectTo || defaultRedirect} replace />;
  }

  return <>{children}</>;
};
