# ウェブテーブルゲーム詳細設計

## 1. 技術スタック
- **フレームワーク**: Vite + React
- **スタイル**: Tailwind CSS
- **状態管理**: useState / useReducer
- **その他**: 
  - React Hooks を活用
  - 可能ならローカルストレージを利用してゲームの状態を保存

## 2. コンポーネント構成
### `App.tsx`
- 全体の管理を行うルートコンポーネント
- `GameBoard` を表示し、ゲームの状態を管理

### `GameBoard.tsx`
- カードの描画・選択処理
- `Card` コンポーネントのリストを表示
- 3枚選択されたら `isSet()` をチェック

### `Card.tsx`
- 各カードを描画
- クリックで選択状態を変更

### `ScoreBoard.tsx`（オプション）
- プレイヤーのスコアを表示

### `GameController.tsx`
- 山札の管理
- 12枚の場のカードを管理
- `isSet()` を用いて場にセットが存在するか確認し、不足時に補充

## 3. 状態管理
- `deck`: 81枚のカードを保持
- `board`: 現在場にある12枚（or それ以上）
- `selectedCards`: 現在選択中の3枚
- `score`: プレイヤーのスコア

## 4. カードのデータ構造
```ts
type Card = {
  id: number;
  shape: "diamond" | "pill" | "wave";
  color: "green" | "purple" | "red";
  fill: "solid" | "striped" | "empty";
  number: 1 | 2 | 3;
};
```

## 5. セット判定ロジック

```ts
const isSet = (cards: Card[]): boolean => {
  if (cards.length !== 3) return false;
  const properties = ["shape", "color", "fill", "number"];
  return properties.every((prop) => {
    const values = new Set(cards.map((card) => card[prop as keyof Card]));
    return values.size === 1 || values.size === 3;
  });
};
```

## 6. ゲームの流れ
- ゲーム開始時に81枚のカードをシャッフルし、山札を生成
- 山札から12枚を board に配置
- プレイヤーがカードを3枚選択
- isSet() でセット判定
- 正解なら board のカードを入れ替え、スコアを更新
- 山札がなくなり、場にセットが存在しなければゲーム終了
- もう一度遊ぶ場合はリセット

## 7. UI・UX

- 正解時のアニメーション
- 不正解時のフィードバック
- タップしやすいカードレイアウト
- レスポンシブ対応（タブレット・PC）

## ディレクトリ構成

```
/game-app
├── public/              # 静的ファイル（アイコンなど）
├── src/                 # ソースコード
│   ├── components/      # UIコンポーネント
│   │   ├── Card.tsx     # カード表示コンポーネント
│   │   ├── GameBoard.tsx # ゲーム盤面
│   │   ├── ScoreBoard.tsx # スコア表示（オプション）
│   │   ├── GameController.tsx # ゲームの進行管理
│   ├── hooks/           # カスタムフック（必要なら）
│   ├── utils/           # ユーティリティ関数
│   │   ├── isSet.ts     # セット判定ロジック
│   ├── styles/          # Tailwind CSS 用の追加スタイル
│   ├── App.tsx          # ルートコンポーネント
│   ├── main.tsx         # エントリーポイント
│   ├── types.ts         # 型定義（カードのデータ型など）
├── index.html           # HTML テンプレート
├── package.json         # 依存関係
├── tsconfig.json        # TypeScript 設定
├── vite.config.ts       # Vite 設定
```
