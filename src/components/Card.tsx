import { Card as CardType } from "../types";
import clsx from "clsx";

interface CardProps {
  card: CardType;
  isSelected: boolean;
  onClick: () => void;
}

export const Card = ({ card, isSelected, onClick }: CardProps) => {
  const shapes = {
    diamond: "M 15,20 L 40,35 L 65,20 L 40,5 Z",
    pill: "M 25,10 L 55,10 A 10,10 0 0 1 55,30 L 25,30 A 10,10 0 0 1 25,10 Z",
    wave: "M 20,10 C 30,10 35,20 40,10 C 45,0 55,10 60,10 L 60,30 C 55,30 45,20 40,30 C 35,40 30,30 20,30 Z",
  };

  const colors = {
    green: "#4CAF50",
    purple: "#9C27B0",
    red: "#F44336",
  };

  const fills = {
    solid: "fill",
    striped: "url(#stripe)",
    empty: "none",
  };

  return (
    <div
      className={clsx(
        "relative w-36 h-48 border-2 rounded-lg cursor-pointer transition-all p-4 bg-white",
        "hover:shadow-lg",
        isSelected ? "border-blue-500 shadow-lg" : "border-gray-300"
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 80 40"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <pattern
              id={`stripe-${card.id}`}
              patternUnits="userSpaceOnUse"
              width="2"
              height="2"
              patternTransform="rotate(45)"
            >
              <rect width="2" height="2" fill="white" />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="2"
                stroke={colors[card.color]}
                strokeWidth="1"
              />
            </pattern>
          </defs>
          {Array.from({ length: card.number }).map((_, i) => (
            <path
              key={i}
              d={shapes[card.shape]}
              stroke={colors[card.color]}
              strokeWidth={1.8}
              fill={
                card.fill === "striped"
                  ? `url(#stripe-${card.id})`
                  : card.fill === "solid"
                  ? colors[card.color]
                  : fills[card.fill]
              }
              transform={`translate(0, ${i * 30 - (card.number - 1) * 15})`}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};
