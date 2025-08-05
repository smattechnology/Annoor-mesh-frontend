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
}

export interface MealTime {
  breakfast?: boolean;
  lunch?: boolean;
  dinner?: boolean;
  editable?: boolean;
}

/**
 * Represents a food item with pricing and meal time information
 */
export interface Item {
  id: number;
  name: string;
  price: number;
  unite: string;
  bld?: MealTime;
  pp?: number; // price per portion, initialized to 0
}

/**
 * Represents a category containing multiple food items
 */
export interface Category {
  id: number;
  title: string;
  items: Item[];
}

export type ItemMap = Record<number, Item>;
export type CategoryMap = Record<
  number,
  { id: number; title: string; items: ItemMap }
>;

export type BudgetStatus =
  | "no-budget"
  | "over-budget"
  | "high-utilization"
  | "low-remaining"
  | "normal";

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
  created_at: string;
  updated_at: string;
};

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
