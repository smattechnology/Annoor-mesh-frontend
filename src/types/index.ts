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

export interface MealTime {
  breakfast?: boolean;
  lunch?: boolean;
  dinner?: boolean;
  editable?: boolean;
}
export interface Unit {
  id: string;
  label: string;
  icon: string;
  price: number;
  created_at: string;
  updated_at: string;
}
export interface ProductCategory {
  id: string;
  label: string;
  icon: string;
  created_at: string;
  updated_at: string;
}
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  category: ProductCategory;
  unit: Unit;
  units: Unit[];
  created_at: string;
  updated_at: string;
}
export interface Category {
  id: string;
  label: string;
  icon: string;
  rand_select: "STATIC" | "DYNAMIC";
  min: number;
  max: number;
  products: ProductMap;
}
export interface CategoryPayload {
  id: string;
  label: string;
  icon: string;
  rand_select: "STATIC" | "DYNAMIC";
  min: number;
  max: number;
  products: Product[];
  created_at: string;
  updated_at: string;
}
export type CategoryMap = { [categoryId: string]: Category };
export type ProductMap = Record<string, Product>;

export type SelectedItemMap = Record<
  string,
  {
    bld: MealTime;
    unit: Unit;
    quantity: number;
  }
>;
export type SelectedCategoryMap = Record<string, SelectedItemMap>;

export type SelectedItemError = Record<
  string,
  { type: "error" | "warning"; message: string }
>;

export interface OrderItem {
  id: string; // item id
  product: Product;
  unit: Unit;
  quantity: number;
  auto: boolean;
  for_breakfast: boolean;
  for_lunch: boolean;
  for_dinner: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export type OrderStatus = "PENDING" | "PROCESSING" | "DELIVERED" | "FAILED";

export interface OrderData {
  id: string;
  user: UserData;
  mess: MessData;
  meal_budget: number;
  total_meal: number;
  status: OrderStatus;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  items: OrderItem[];
}
