export type Card = {
  id: number;
  shape: "diamond" | "pill" | "wave";
  color: "green" | "purple" | "red";
  fill: "solid" | "striped" | "empty";
  number: 1 | 2 | 3;
};

export type HistoryEntry = {
  id: number; // 履歴エントリのユニークID
  cards: Card[]; // 見つかったセットのカード
  timestamp: number; // 見つけた時刻
};
