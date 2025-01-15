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
