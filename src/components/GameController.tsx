import { useState, useEffect } from "react";
import { Card } from "../types";
import { GameBoard } from "./GameBoard";
import { isSet } from "../utils/isSet";

const generateDeck = (): Card[] => {
  const shapes = ["diamond", "pill", "wave"] as const;
  const colors = ["green", "purple", "red"] as const;
  const fills = ["solid", "striped", "empty"] as const;
  const numbers = [1, 2, 3] as const;

  const deck: Card[] = [];
  let id = 0;

  for (const shape of shapes) {
    for (const color of colors) {
      for (const fill of fills) {
        for (const number of numbers) {
          deck.push({ id: id++, shape, color, fill, number });
        }
      }
    }
  }

  return shuffleDeck(deck);
};

const shuffleDeck = (deck: Card[]): Card[] => {
  return [...deck].sort(() => Math.random() - 0.5);
};

const findSetInCards = (cards: Card[]): Card[] | null => {
  for (let i = 0; i < cards.length - 2; i++) {
    for (let j = i + 1; j < cards.length - 1; j++) {
      for (let k = j + 1; k < cards.length; k++) {
        const potentialSet = [cards[i], cards[j], cards[k]];
        if (isSet(potentialSet)) {
          return potentialSet;
        }
      }
    }
  }
  return null;
};

export const GameController = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [board, setBoard] = useState<Card[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [showEffect, setShowEffect] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newDeck = generateDeck();
    setDeck(newDeck.slice(12));
    setBoard(newDeck.slice(0, 12));
    setGameOver(false);
  };

  const handleSetFound = (cards: Card[]) => {
    if (isSet(cards)) {
      // Show success effect
      setShowEffect(true);
      setTimeout(() => {
        setShowEffect(false);
      }, 1500); // 1.5秒間エフェクトを表示

      // Remove found set from board
      const newBoard = board.filter(
        (card) => !cards.some((c) => c.id === card.id)
      );

      // Draw 3 new cards if available
      if (deck.length >= 3) {
        const newCards = deck.slice(0, 3);
        setDeck(deck.slice(3));
        setBoard([...newBoard, ...newCards]);
      } else {
        setBoard(newBoard);
      }

      // Check if game is over
      if (deck.length === 0 && !findSetInCards(newBoard)) {
        setGameOver(true);
      }
    }
  };

  const addThreeCards = () => {
    if (deck.length >= 3) {
      const newCards = deck.slice(0, 3);
      setDeck(deck.slice(3));
      setBoard([...board, ...newCards]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      {showEffect && (
        <div className="fixed inset-0 bg-green-500 bg-opacity-30 backdrop-blur-sm z-50 animate-fade-out flex items-center justify-center">
          <div className="text-4xl text-white font-bold animate-bounce">
            SET!
          </div>
        </div>
      )}
      <div className="flex justify-end mb-4 space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={startNewGame}
        >
          New Game
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={addThreeCards}
          disabled={deck.length < 3}
        >
          Add Cards
        </button>
      </div>

      {gameOver ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
          <p className="text-xl">No more sets available</p>
        </div>
      ) : (
        <GameBoard cards={board} onSetFound={handleSetFound} />
      )}
    </div>
  );
};
