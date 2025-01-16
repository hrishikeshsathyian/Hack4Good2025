export interface createUserBody {
  display_name: string;
  email: string;
  phone_number: string;
  age: number;
  date_of_birth: Date;
  voucher_points: number;
}

export interface User {
  uid: number;
  display_name: string;
  email: string;
  phone_number: string;
  age: number;
  date_of_birth: Date;
  voucher_points: number;
}

export interface firebaseUser {
  display_name: string;
  email: string;
  uid: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  qty: number;
  price: number;
  category: string;
}

export interface TopItem {
  name: string;
  quantity: number;
}

export interface PendingItem {
  id: string;
  name: string;
  price: number;
  date_purchased: Date;
  status: string;
}

export interface Transaction {
  id: string;
  user_name: string;
  status: string;
  acquired_at: Date;
  product_name: string;
  price: number;
}
