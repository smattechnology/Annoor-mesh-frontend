export interface BaseEntity {
  id: string;
  createdAt: string;
}

export interface Column<T> {
  label: string;
  accessor: keyof T;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

// types/index.ts

/**
 * Represents meal time availability and editability for an item
 */
export interface MealTime {
  morning: boolean;
  afternoon: boolean;
  night: boolean;
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
  mdn?: MealTime;
}

/**
 * Represents a category containing multiple food items
 */
export interface Category {
  title: string;
  items: Item[];
}

/**
 * Represents meal selections for a specific item
 */
export interface MealSelections {
  [itemId: number]: {
    morning: boolean;
    afternoon: boolean;
    night: boolean;
  };
}

/**
 * Represents active meal times for the mess
 */
export interface MessDaySettings {
  morning: boolean;
  afternoon: boolean;
  night: boolean;
}

/**
 * Mess owner information
 */
export interface MessOwner {
  name: string;
  contact: string;
  email: string;
}

/**
 * Mess address information
 */
export interface MessAddress {
  street: string;
  area: string;
  city: string;
  postalCode: string;
  country: string;
}

/**
 * Mess contact information
 */
export interface MessContact {
  phone: string;
  email: string;
  facebook: string;
  website: string;
}

/**
 * Mess meal timing information
 */
export interface MealTiming {
  breakfast: string;
  lunch: string;
  dinner: string;
}

/**
 * Complete mess information structure
 */
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

/**
 * Props for components that handle meal selection changes
 */
export interface MealChangeHandler {
  (
    id: number,
    mealTime: keyof Omit<MealTime, "editable">,
    value: boolean
  ): void;
}

/**
 * Props for components that handle item toggling
 */
export interface ItemToggleHandler {
  (item: Item): void;
}
