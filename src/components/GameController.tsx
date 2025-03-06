import { useState, useEffect } from "react";
import { Card, HistoryEntry } from "../types";
import { GameBoard } from "./GameBoard";
import { SetHistory } from "./SetHistory";
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

const DEFAULT_BOARD_SIZE = 12;

export const GameController = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [board, setBoard] = useState<Card[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [showEffect, setShowEffect] = useState<{
    show: boolean;
    cards?: Card[];
  }>({ show: false });
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newDeck = generateDeck();
    setDeck(newDeck.slice(DEFAULT_BOARD_SIZE));
    setBoard(newDeck.slice(0, DEFAULT_BOARD_SIZE));
    setGameOver(false);
    // 新しいゲームを開始するときに履歴をリセットしない
    // 複数のゲームにわたって履歴を保持する
    // setHistory([]);
  };

  const handleSetFound = (cards: Card[]) => {
    if (isSet(cards)) {
      // Show success effect
      setShowEffect({ show: true, cards });
      setTimeout(() => {
        setShowEffect({ show: false });
      }, 3000); // 3秒間エフェクトを表示

      // 履歴に追加
      const newHistoryEntry: HistoryEntry = {
        id: Date.now(), // タイムスタンプをIDとして使用
        cards: [...cards], // カードの配列をコピー
        timestamp: Date.now(),
      };
      setHistory((prev) => [...prev, newHistoryEntry]);

      let newBoard: Card[];
      // Draw 3 new cards if available
      // And if there is space on the board
      if (deck.length >= 3 && board.length <= DEFAULT_BOARD_SIZE) {
        const newCards = deck.slice(0, 3);
        setDeck(deck.slice(3));
        newBoard = board.map((card) =>
          cards.some((c) => c.id === card.id) ? newCards.shift()! : card
        );
        setBoard(newBoard);
      } else {
        // Remove found set from board
        newBoard = board.filter((card) => !cards.some((c) => c.id === card.id));
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
      {showEffect.show && (
        <div className="fixed inset-0 bg-green-500 bg-opacity-30 backdrop-blur-sm z-50 animate-fade-out flex flex-col items-center justify-center">
          <div className="text-4xl text-white font-bold animate-bounce mb-8">
            SET!
          </div>
          {showEffect.cards && (
            <div className="flex gap-4 scale-80 transform">
              {showEffect.cards.map((card) => (
                <div key={card.id} className="w-32 m-4">
                  <GameBoard cards={[card]} onSetFound={() => {}} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="flex justify-center mb-4 space-x-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-600"
          onClick={startNewGame}
        >
          New Game
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-600"
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

      {/* セット履歴の表示 */}
      <SetHistory history={history} />
    </div>
  );
};
