export type Condition = "New" | "Like New" | "Good" | "Fair";

export interface Listing {
  id: string;
  title: string;
  price: number;
  condition: Condition;
  image: string;
  seller: string;
  sellerAvatar: string;
  sellerRating: number;
  sellerSales: number;
  location: string;
  likes: number;
  isLiked: boolean;
  rating: number;
  reviewCount: number;
  category: string;
  isFeatured?: boolean;
  isHot?: boolean;
  description: string;
  postedAt: string;
  colorAccent: string;
  views: number;
}

export interface Order {
  id: string;
  title: string;
  price: number;
  image: string;
  counterparty: string;
  counterpartyAvatar: string;
  status: "pending" | "confirmed" | "shipping" | "completed" | "cancelled";
  date: string;
  type: "buying" | "selling";
  category: string;
}
