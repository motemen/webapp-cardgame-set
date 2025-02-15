import { useState, useEffect } from "react";
import { Card as CardType } from "../types";
import { Card } from "./Card";
import { isSet } from "../utils/isSet";
import clsx from "clsx";

interface GameBoardProps {
  cards: CardType[];
  onSetFound: (cards: CardType[]) => void;
}

export const GameBoard = ({ cards, onSetFound }: GameBoardProps) => {
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleCardClick = (card: CardType) => {
    if (selectedCards.find((c) => c.id === card.id)) {
      setSelectedCards(selectedCards.filter((c) => c.id !== card.id));
    } else if (selectedCards.length < 3) {
      const newSelectedCards = [...selectedCards, card];
      setSelectedCards(newSelectedCards);

      if (newSelectedCards.length === 3) {
        if (isSet(newSelectedCards)) {
          // setFeedback("correct");
          onSetFound(newSelectedCards);
        } else {
          setFeedback("incorrect");
        }
        // Clear selection after a short delay
        setTimeout(() => {
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="relative">
      {feedback && (
        <div
          className={clsx(
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 px-8 py-4 rounded-lg text-white font-bold text-2xl transition-opacity",
            {
              "bg-green-500": feedback === "correct",
              "bg-red-500": feedback === "incorrect",
            }
          )}
        >
          {feedback === "correct" ? "正解！" : "不正解"}
        </div>
      )}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 p-4 justify-center">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            isSelected={selectedCards.some((c) => c.id === card.id)}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>
    </div>
  );
};
