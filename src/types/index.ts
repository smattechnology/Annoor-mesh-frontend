export interface UserData {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  status: "active" | "inactive";
  dob?: string;
  address?: string;
  created_at: string;
  update_at: string;
  avatar?: string;
  allocated_mess?: MessData;
}

export interface MealTime {
  breakfast?: boolean;
  lunch?: boolean;
  dinner?: boolean;
  editable?: boolean;
}
export type Product = {
  id: string;
  name: string;
  price: string;
  description: string | null;
  category: {
    id: string;
    label: string;
    icon: string;
    created_at: string;
    updated_at: string;
  };
  unit: {
    id: string;
    label: string;
    icon: string;
    created_at: string;
    updated_at: string;
  };
  bld?: MealTime;
  pp?: number; // price per portion, initialized to 0
  created_at: string;
  updated_at: string;
};
export interface Category {
  id: string;
  label: string;
  icon: string;
  products: Product[];
}
export interface SelectedItems {
  [productId: string]: {
    bld?: MealTime;
    price?: number;
  };
}

export type BudgetStatus =
  | "no-budget"
  | "over-budget"
  | "high-utilization"
  | "low-remaining"
  | "normal";

export interface MessAddress {
  id?: string;
  street: string;
  area: string;
  city: string;
  postalCode: number;
  created_at?: string;
  updated_at?: string;
}

export interface MessOwner {
  id?: string;
  name: string;
  phone: string;
  created_at?: string;
  updated_at?: string;
}

export type MessStatus = "active" | "disabled" | "deleted" | "banned";
export type MessType = "BOYS_MESS" | "GIRLS_MESS";

export interface MessData {
  id?: string;
  name: string;
  phone?: string;
  status?: MessStatus;
  type: MessType;
  address: MessAddress;
  owner: MessOwner;
  created_at?: string;
  updated_at?: string;
}
