// constants/index.ts

import { Category, MessInfo } from "../types";

/**
 * Mapping of meal time keys to Bengali labels
 */
export const MEAL_TIMES = {
  morning: "সকাল",
  afternoon: "দুপুর",
  night: "রাত",
} as const;

/**
 * Complete mess information
 */
export const MESS_INFO: MessInfo = {
  name: "ছাত্রাবাস স্মাট মেস",
  established: "2021-08-01",
  type: "Boys Mess",
  owner: {
    name: "Abir Hasan",
    contact: "+8801712345678",
    email: "abir@smatmess.com",
  },
  address: {
    street: "House 12, Road 7",
    area: "Uttara Sector 10",
    city: "Dhaka",
    postalCode: "1230",
    country: "Bangladesh",
  },
  contact: {
    phone: "+880961234567",
    email: "info@smatmess.com",
    facebook: "https://facebook.com/smatmess",
    website: "https://smatmess.com",
  },
  capacity: 50,
  mealTiming: {
    breakfast: "7:30 AM - 9:00 AM",
    lunch: "1:00 PM - 2:30 PM",
    dinner: "8:00 PM - 9:30 PM",
  },
  offDays: ["Friday"],
  notes: "All meals are served fresh. Monthly and daily plans available.",
};

/**
 * Food categories with items and their meal time configurations
 */
export const FOOD_CATEGORIES: Category[] = [
  {
    title: "তেল/মশলা",
    items: [
      {
        id: 1,
        name: "সয়াবিন তেল",
        price: 100,
        unite: "লিটার",
        mdn: { morning: true, afternoon: false, night: true, editable: false },
      },
      {
        id: 2,
        name: "সরিষার তেল",
        price: 80,
        unite: "লিটার",
        mdn: { morning: false, afternoon: true, night: false, editable: true },
      },
      {
        id: 3,
        name: "পাম তেল",
        price: 90,
        unite: "লিটার",
        mdn: { morning: true, afternoon: true, night: false, editable: false },
      },
      {
        id: 4,
        name: "কোকোনাট তেল",
        price: 120,
        unite: "লিটার",
        mdn: { morning: false, afternoon: false, night: true, editable: true },
      },
      {
        id: 5,
        name: "ঘি",
        price: 200,
        unite: "লিটার",
        mdn: { morning: true, afternoon: false, night: false, editable: true },
      },
      {
        id: 6,
        name: "বাটার",
        price: 150,
        unite: "লিটার",
        mdn: { morning: false, afternoon: true, night: true, editable: false },
      },
      {
        id: 7,
        name: "চিনি",
        price: 50,
        unite: "কেজি",
        mdn: { morning: true, afternoon: true, night: true, editable: true },
      },
      {
        id: 8,
        name: "লবণ",
        price: 20,
        unite: "কেজি",
        mdn: {
          morning: false,
          afternoon: false,
          night: false,
          editable: false,
        },
      },
    ],
  },
  {
    title: "শাক",
    items: [
      {
        id: 9,
        name: "পালং শাক",
        price: 20,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: true, editable: true },
      },
      {
        id: 10,
        name: "লাল শাক",
        price: 25,
        unite: "কেজি",
        mdn: { morning: true, afternoon: false, night: false, editable: true },
      },
      {
        id: 11,
        name: "কলমি শাক",
        price: 18,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: false, editable: true },
      },
      {
        id: 12,
        name: "পুঁই শাক",
        price: 22,
        unite: "কেজি",
        mdn: { morning: true, afternoon: false, night: true, editable: true },
      },
      {
        id: 13,
        name: "ঝিঙ্গে শাক",
        price: 28,
        unite: "কেজি",
        mdn: { morning: true, afternoon: true, night: false, editable: true },
      },
      {
        id: 14,
        name: "নটে শাক",
        price: 19,
        unite: "কেজি",
        mdn: { morning: false, afternoon: false, night: true, editable: true },
      },
      {
        id: 15,
        name: "শ্যাম শাক",
        price: 30,
        unite: "কেজি",
        mdn: { morning: true, afternoon: true, night: true, editable: true },
      },
      {
        id: 16,
        name: "সরিষা শাক",
        price: 26,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: false, editable: true },
      },
    ],
  },
  {
    title: "সবজি",
    items: [
      {
        id: 17,
        name: "আলু",
        price: 30,
        unite: "কেজি",
        mdn: { morning: true, afternoon: true, night: true, editable: true },
      },
      {
        id: 18,
        name: "বেগুন",
        price: 35,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: false, editable: true },
      },
      {
        id: 19,
        name: "টমেটো",
        price: 40,
        unite: "কেজি",
        mdn: { morning: true, afternoon: true, night: true, editable: true },
      },
      {
        id: 20,
        name: "শসা",
        price: 25,
        unite: "কেজি",
        mdn: { morning: true, afternoon: false, night: false, editable: true },
      },
      {
        id: 21,
        name: "করলা",
        price: 32,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: true, editable: true },
      },
      {
        id: 22,
        name: "মিষ্টি কুমড়া",
        price: 27,
        unite: "কেজি",
        mdn: { morning: false, afternoon: false, night: true, editable: true },
      },
      {
        id: 23,
        name: "পটল",
        price: 34,
        unite: "কেজি",
        mdn: { morning: true, afternoon: false, night: false, editable: true },
      },
      {
        id: 24,
        name: "কাঁচা মরিচ",
        price: 80,
        unite: "কেজি",
        mdn: {
          morning: false,
          afternoon: false,
          night: false,
          editable: false,
        },
      },
    ],
  },
  {
    title: "মাছ",
    items: [
      {
        id: 25,
        name: "রুই মাছ",
        price: 250,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: true, editable: true },
      },
      {
        id: 26,
        name: "ইলিশ মাছ",
        price: 800,
        unite: "কেজি",
        mdn: { morning: true, afternoon: false, night: false, editable: false },
      },
      {
        id: 27,
        name: "কাতলা",
        price: 300,
        unite: "কেজি",
        mdn: { morning: true, afternoon: true, night: false, editable: true },
      },
      {
        id: 28,
        name: "পাবদা",
        price: 350,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: true, editable: true },
      },
      {
        id: 29,
        name: "টেংরা",
        price: 400,
        unite: "কেজি",
        mdn: { morning: true, afternoon: false, night: false, editable: true },
      },
      {
        id: 30,
        name: "চিংড়ি",
        price: 600,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: true, editable: true },
      },
      {
        id: 31,
        name: "মাগুর মাছ",
        price: 450,
        unite: "কেজি",
        mdn: { morning: true, afternoon: true, night: false, editable: true },
      },
      {
        id: 32,
        name: "সিলভার কার্প",
        price: 220,
        unite: "কেজি",
        mdn: { morning: false, afternoon: false, night: true, editable: true },
      },
    ],
  },
  {
    title: "মাংস",
    items: [
      {
        id: 33,
        name: "গরুর মাংস",
        price: 700,
        unite: "কেজি",
        mdn: { morning: false, afternoon: false, night: true, editable: true },
      },
      {
        id: 34,
        name: "মুরগি",
        price: 180,
        unite: "কেজি",
        mdn: { morning: true, afternoon: true, night: true, editable: true },
      },
      {
        id: 35,
        name: "খাসির মাংস",
        price: 850,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: false, editable: true },
      },
      {
        id: 36,
        name: "হাঁস",
        price: 400,
        unite: "কেজি",
        mdn: { morning: true, afternoon: false, night: true, editable: true },
      },
      {
        id: 37,
        name: "মুরগি লেগ পিস",
        price: 200,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: false, editable: true },
      },
      {
        id: 38,
        name: "চিকেন উইংস",
        price: 210,
        unite: "কেজি",
        mdn: { morning: false, afternoon: false, night: true, editable: true },
      },
      {
        id: 39,
        name: "মুরগি বুকের মাংস",
        price: 220,
        unite: "কেজি",
        mdn: { morning: true, afternoon: true, night: true, editable: true },
      },
      {
        id: 40,
        name: "হাড় ছাড়া মাংস",
        price: 260,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: true, editable: true },
      },
    ],
  },
  {
    title: "নিত্যপ্রয়োজনীয় খাদ্যপণ্য",
    items: [
      {
        id: 41,
        name: "চাল",
        price: 60,
        unite: "কেজি",
        mdn: { morning: true, afternoon: true, night: true, editable: false },
      },
      {
        id: 42,
        name: "ডাল",
        price: 90,
        unite: "কেজি",
        mdn: { morning: false, afternoon: false, night: true, editable: true },
      },
      {
        id: 43,
        name: "চিনি",
        price: 55,
        unite: "কেজি",
        mdn: { morning: true, afternoon: false, night: true, editable: false },
      },
      {
        id: 44,
        name: "আটা",
        price: 45,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: true, editable: true },
      },
      {
        id: 45,
        name: "ময়দা",
        price: 50,
        unite: "কেজি",
        mdn: { morning: true, afternoon: true, night: false, editable: true },
      },
      {
        id: 46,
        name: "চিড়া",
        price: 35,
        unite: "কেজি",
        mdn: { morning: true, afternoon: false, night: false, editable: true },
      },
      {
        id: 47,
        name: "সুজি",
        price: 40,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: false, editable: true },
      },
      {
        id: 48,
        name: "মুড়ি",
        price: 30,
        unite: "কেজি",
        mdn: { morning: true, afternoon: false, night: false, editable: true },
      },
    ],
  },
];

/**
 * Budget status thresholds
 */
export const BUDGET_THRESHOLDS = {
  LOW_REMAINING: 0.2, // 20% remaining budget threshold
  HIGH_UTILIZATION: 0.8, // 80% budget utilization threshold
} as const;
