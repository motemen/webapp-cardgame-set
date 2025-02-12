import { Card as CardType } from "../types";
import clsx from "clsx";

interface CardProps {
  card: CardType;
  isSelected: boolean;
  onClick: () => void;
}

export const Card = ({ card, isSelected, onClick }: CardProps) => {
  const shapes = {
    diamond: "M8 1 L14 8 L8 15 L2 8 Z",
    pill: "M8 8 A2.5 2.5 0 1 1 8 8.001",
    wave: "M2 9 Q4 5, 6 8 Q8 11, 10 8 Q12 5, 14 8 Q13 10, 8 10 Q3 10, 2 9",
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
        "relative w-24 h-36 border-2 rounded-lg cursor-pointer transition-all p-4 bg-white",
        "hover:shadow-lg",
        isSelected ? "border-blue-500 shadow-lg" : "border-gray-300"
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 16 16"
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
              strokeWidth={card.shape === "wave" ? "1.8" : "1"}
              fill={
                card.fill === "striped"
                  ? `url(#stripe-${card.id})`
                  : card.fill === "solid"
                  ? colors[card.color]
                  : fills[card.fill]
              }
              transform={`translate(0, ${i * 6 - (card.number - 1) * 3})`}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};
