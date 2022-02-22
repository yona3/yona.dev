type Like = {
  category: "作品" | "バンド" | "飲食物";
  list?: string[];
  description?: string;
};

export const LIKES: Like[] = [
  {
    category: "作品",
    list: [
      "進撃の巨人",
      "SLAM DUNK",
      "エヴァンゲリオン",
      "寄生獣",
      "ヒカルの碁",
      "斉木楠雄のΨ難",
      "映像研には手を出すな!",
      "3月のライオン",
    ],
  },
  {
    category: "バンド",
    list: [
      "BUMP OF CHICKEN",
      "King Gnu",
      "東京事変",
      "UNISON SQUARE GARDEN",
      "赤い公園",
      "きのこ帝国",
      "ZAZEN BOYS",
      "ゆらゆら帝国",
    ],
  },
  {
    category: "飲食物",
    description: "甘いものを食べながらコーヒーを飲むのが好きです。",
  },
];
