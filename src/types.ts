export type Card = {
  id: number;
  shape: "diamond" | "pill" | "wave";
  color: "green" | "purple" | "red";
  fill: "solid" | "striped" | "empty";
  number: 1 | 2 | 3;
};
