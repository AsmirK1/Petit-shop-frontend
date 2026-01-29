import React, { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import type { ShippingInfo } from "./ShippingForm";

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity?: number;
  category: string;
  image?: string;
  businessId?: number;
}

interface PayPalCheckoutProps {
  items: CartItem[];
  total: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  shippingInfo?: ShippingInfo | null;
}

export const PayPalCheckout: React.FC<PayPalCheckoutProps> = ({ 
  items, 
  total, 
  onSuccess, 
  onError,
  shippingInfo
}) => {
  const [orderId, setOrderId] = useState<number | null>(null);

  // Debug: Check if PayPal is configured
  React.useEffect(() => {
    console.log("PayPal Client ID:", import.meta.env.VITE_PAYPAL_CLIENT_ID);
    console.log("Cart items:", items);
    console.log("Total:", total);
  }, [items, total]);

  const createOrder = async (_data: any, actions: any) => {
    try {
      console.log("🚀 Creating PayPal order...");
      
      // First, create order in our backend
      const API_BASE = import.meta.env.DEV ? "http://localhost:5062" : "";
      
      const token = localStorage.getItem("buyer_token") || localStorage.getItem("token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Prepare cart items with seller info
      const cartItems = items.map(item => ({
        SellerId: item.businessId || 1,
        ProductId: parseInt(item.id) || 0,
        Name: item.title,
        Price: item.price,
        Quantity: item.quantity || 1
      }));

      console.log("📦 Sending to backend:", { cartItems, total });

      const response = await fetch(`${API_BASE}/api/orders/paypal/create`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          itemsJson: JSON.stringify(cartItems),
          total: total
          ,
          shippingFullName: shippingInfo?.fullName ?? null,
          shippingAddress1: shippingInfo?.address1 ?? null,
          shippingAddress2: shippingInfo?.address2 ?? null,
          shippingCity: shippingInfo?.city ?? null,
          shippingState: shippingInfo?.state ?? null,
          shippingPostalCode: shippingInfo?.postalCode ?? null,
          shippingCountry: shippingInfo?.country ?? null,
          shippingPhone: shippingInfo?.phone ?? null,
          shippingType: shippingInfo?.shippingType ?? null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Backend error:", errorData);
        throw new Error(errorData.error || "Failed to create order");
      }

      const orderData = await response.json();
      console.log("✅ Backend order created:", orderData);
      setOrderId(orderData.orderId);

      // Create PayPal order directly through PayPal SDK
      // NOTE: This creates a simple order without connecting to specific merchant
      // For multi-vendor, you'd need PayPal Partner API or split payments
      const paypalOrderId = await actions.order.create({
        purchase_units: [{
          amount: {
            value: total.toFixed(2),
            currency_code: "USD"
          },
          description: `Petit Shop Order #${orderData.orderId}`
        }],
        application_context: {
          brand_name: "Petit Shop",
          shipping_preference: "NO_SHIPPING"
        }
      });
      
      console.log("✅ PayPal order created:", paypalOrderId);
      return paypalOrderId;
    } catch (err: any) {
      console.error("❌ Create order error:", err);
      onError(err.message || "Failed to create order");
      throw err;
    }
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      // Capture the payment on PayPal
      const details = await actions.order.capture();
      
      const API_BASE = import.meta.env.DEV ? "http://localhost:5062" : "";
      
      const response = await fetch(`${API_BASE}/api/orders/paypal/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderId: orderId,
          payPalOrderId: details.id,
          payPalPayerId: details.payer.payer_id,
          status: "COMPLETED",
          captureId: details.purchase_units[0].payments.captures[0].id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to capture payment");
      }

      const result = await response.json();
      console.log("Payment captured:", result);
      onSuccess();
    } catch (err: any) {
      console.error("Capture payment error:", err);
      onError(err.message || "Failed to capture payment");
    }
  };

  return (
    <div className="paypal-checkout-container">
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(err) => {
          console.error("PayPal SDK error:", err);
          onError("PayPal payment failed. Please try again or contact support.");
        }}
        onCancel={() => {
          console.log("PayPal payment cancelled by user");
          onError("Payment cancelled");
        }}
        style={{
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "paypal"
        }}
      />
    </div>
  );
};

export default PayPalCheckout;
