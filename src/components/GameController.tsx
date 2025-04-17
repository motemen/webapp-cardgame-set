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
  if (cards.length < 3) return null; // カードが3枚未満の場合はセットは存在しない
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
    let initialBoard = newDeck.slice(0, DEFAULT_BOARD_SIZE);
    let remainingDeck = newDeck.slice(DEFAULT_BOARD_SIZE);

    // 初期盤面にセットがない場合は、セットができるまでカードを追加
    // 山札がある限り続ける
    while (findSetInCards(initialBoard) === null && remainingDeck.length >= 3) {
      initialBoard.push(...remainingDeck.slice(0, 3));
      remainingDeck = remainingDeck.slice(3);
    }

    setDeck(remainingDeck);
    setBoard(initialBoard);
    setGameOver(findSetInCards(initialBoard) === null); // 初期状態でセットがなければ即ゲームオーバー
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

      let currentBoard = board;
      let currentDeck = deck;

      // Draw 3 new cards if available and board size is default or less
      if (
        currentDeck.length >= 3 &&
        currentBoard.length <= DEFAULT_BOARD_SIZE
      ) {
        const newCards = currentDeck.slice(0, 3);
        currentDeck = currentDeck.slice(3);
        currentBoard = currentBoard.map((card) =>
          cards.some((c) => c.id === card.id) ? newCards.shift()! : card
        );
      } else {
        // Remove found set from board without replacing
        currentBoard = currentBoard.filter(
          (card) => !cards.some((c) => c.id === card.id)
        );
      }

      // 場にセットがなく、かつ山札にカードが残っている場合、セットができるまでカードを3枚ずつ追加
      // ただし、盤面のカードがデフォルトサイズ未満の場合も考慮して追加
      while (findSetInCards(currentBoard) === null && currentDeck.length >= 3) {
        // 盤面が12枚未満なら、まず12枚になるまで補充する
        const needsAdding = DEFAULT_BOARD_SIZE - currentBoard.length;
        if (needsAdding > 0) {
          const addCount = Math.min(needsAdding, currentDeck.length);
          currentBoard.push(...currentDeck.slice(0, addCount));
          currentDeck = currentDeck.slice(addCount);
          // 補充後に再度セットを確認し、あればループを抜ける
          if (findSetInCards(currentBoard) !== null) break;
          // まだなければ、3枚追加を試みる
          if (currentDeck.length < 3) break; // 追加するカードがなければループ終了
        }
        // セットがない かつ 盤面が12枚以上、または12枚未満だが補充してもセットができなかった場合、3枚追加
        if (findSetInCards(currentBoard) === null && currentDeck.length >= 3) {
          currentBoard.push(...currentDeck.slice(0, 3));
          currentDeck = currentDeck.slice(3);
        }
      }

      setDeck(currentDeck);
      setBoard(currentBoard);

      // Check if game is over (山札が空で、場にもセットがない)
      if (currentDeck.length === 0 && findSetInCards(currentBoard) === null) {
        setGameOver(true);
      }
    }
  };

  const addThreeCards = () => {
    // ゲームオーバー時、または山札が3枚未満、または盤面が21枚以上の場合は追加しない
    if (gameOver || deck.length < 3 || board.length >= 21) {
      return;
    }
    const newCards = deck.slice(0, 3);
    const nextDeck = deck.slice(3);
    const nextBoard = [...board, ...newCards];

    setDeck(nextDeck);
    setBoard(nextBoard);

    // カード追加後にゲームオーバー条件をチェック
    if (nextDeck.length === 0 && findSetInCards(nextBoard) === null) {
      setGameOver(true);
    }
  };

  // 盤面にセットがあるかチェックする関数
  const checkSetOnBoard = () => {
    const foundSet = findSetInCards(board);
    if (foundSet) {
      // 見つかったセットのカードを一時的にハイライトするなど、視覚的なフィードバックを検討
      alert("盤面にセットがあります");
    } else {
      alert("盤面にセットはありません");
      // 自動でカードを追加するオプションも考えられる
      // if (deck.length >= 3) {
      //   addThreeCards();
      // }
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
              {/* TODO: GameBoardではなくCardコンポーネントを直接使って表示する */}
              {showEffect.cards.map((card) => (
                <div key={card.id} className="w-32 m-4">
                  <GameBoard cards={[card]} onSetFound={() => {}} />{" "}
                  {/* 仮実装 */}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="flex justify-center mb-4 space-x-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" // hover効果を少し変更
          onClick={startNewGame}
        >
          New Game
        </button>
        {/* セットチェックボタンを追加 */}
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed" // disabledスタイル追加
          onClick={checkSetOnBoard}
          disabled={gameOver} // ゲームオーバー時は無効
        >
          Check Set
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed" // disabledスタイル追加
          onClick={addThreeCards}
          // ボタンの無効化条件: ゲームオーバー、山札が3枚未満、盤面が21枚以上
          disabled={gameOver || deck.length < 3 || board.length >= 21}
        >
          Add Cards ({deck.length}) {/* 残り枚数を表示 */}
        </button>
      </div>

      {gameOver ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">ゲームオーバー！</h2>
          <p className="text-xl">もうセットはありません。</p>
          {/* TODO: 最終スコアやプレイ時間などを表示 */}
        </div>
      ) : (
        <GameBoard cards={board} onSetFound={handleSetFound} />
      )}

      {/* セット履歴の表示 */}
      <SetHistory history={history} />
    </div>
  );
};
