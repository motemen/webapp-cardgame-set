import { Card } from "../types";

export const isSet = (cards: Card[]): boolean => {
  if (cards.length !== 3) return false;

  const properties: (keyof Omit<Card, "id">)[] = [
    "shape",
    "color",
    "fill",
    "number",
  ];

  return properties.every((prop) => {
    const values = new Set(cards.map((card) => card[prop]));
    return values.size === 1 || values.size === 3;
  });
};
