import Basic from "../app/components/Basic";
import React from "react";

// Define the component metadata for Storybook
const meta = {
  title: "Game Components/Basic Prize Picker",
  component: Basic,
  tags: ["autodocs"],
  // Define controls for props
  argTypes: {
    count: { control: { type: "number", min: 4, max: 10 } },
    uiStyle: {
      control: { type: "select" },
      options: ["default", "casino", "roulette"],
    },
  },
};

export default meta;

// --- Story Templates ---

// 1. Story for the "Item Name Mode" (different items)
export const ItemNameMode = {
  args: {
    count: 4,
    uiStyle: "default",
    award: [
      { id: 1, item: "TV", inventory: 1 },
      { id: 2, item: "Watch", inventory: 5 },
      { id: 3, item: "Tablet", inventory: 0 }, // Out of stock
      { id: 4, item: "Pen", inventory: 10 },
    ],
  },
};

// 2. Story for the "Single Gift Mode" (only numbers/slots)
export const SingleGiftMode = {
  args: {
    count: 4,
    uiStyle: "casino",
    // The "item" field is missing, triggering the singleGiftMode logic
    award: [{ id: 1, inventory: 1 }],
  },
};
