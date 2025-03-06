import { useState } from "react";
import { HistoryEntry } from "../types";
import { Card } from "./Card";

interface SetHistoryProps {
  history: HistoryEntry[];
}

export const SetHistory = ({ history }: SetHistoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 履歴が空の場合は何も表示しない
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 border border-gray-200 rounded-lg bg-white shadow-sm">
      <div
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-semibold">セット履歴</h2>
        <button className="text-gray-500">
          {isExpanded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-4">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="p-3 border border-gray-100 rounded-md bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {entry.cards.map((card) => (
                    <div
                      key={card.id}
                      className="w-20 h-28 transform scale-75 origin-top-left -ml-2"
                    >
                      <Card card={card} isSelected={false} onClick={() => {}} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
