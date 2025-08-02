export interface MessOwner {
  name: string;
  contact: string;
  email: string;
}

export interface MessAddress {
  street: string;
  area: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface MessContact {
  phone: string;
  email: string;
  facebook: string;
  website: string;
}

export interface MealTiming {
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface MessInfo {
  name: string;
  established: string;
  type: string;
  owner: MessOwner;
  address: MessAddress;
  contact: MessContact;
  capacity: number;
  mealTiming: MealTiming;
  offDays: string[];
  notes: string;
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
