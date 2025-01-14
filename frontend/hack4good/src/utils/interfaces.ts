export interface createUserBody {
  display_name: string;
  email: string;
  number: string;
  age: string;
  voucher_points: string;
}

export interface firebaseUser {
  display_name: string;
  email: string;
  uid: string;
}
