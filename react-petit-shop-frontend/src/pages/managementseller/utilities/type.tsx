

export type Cart = {
  id: string;
  title: string;
};

export type Page = {
  id: string;
  title: string;
  carts: CartItem[];
  businessId?: number;
};

export type Business = {
  id: number;
  name: string;
  category: string;
  country: string;
  city: string;
  pages: Page[];
  // optional design/theme for buyer-facing shop
  theme?: {
    primary?: string; // CSS color
    accent?: string; // CSS color
    logo?: string; // URL
  };
};


export type ItemCondition =
  | "New"
  | "Used"
  | "Refurbished"
  | "Handmade"
  | "Vintage"
  | "Open Box";

export  type Product = {
  name: string;
  id: number;
  title: string;
  price: number;
  category: string;
  image?: string;
  businessId?: number;
};

export type CartItem = {
  id: string;
  title: string;
  price: number;
  category: string;
  image?: string; // will store base64 string
  quantity?: number;
  businessId?: number; // Added to track which business owns the product
};
