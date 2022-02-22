type Like = {
  category: "作品" | "バンド" | "食べ物";
  list?: string[];
  description?: string;
};

export const LIKE_LIST: Like[] = [
  {
    category: "作品",
    list: [
      "進撃の巨人",
      "エヴァンゲリオン",
      "寄生獣",
      "SLAM DUNK",
      "ヒカルの碁",
      "3月のライオン",
      "攻殻機動隊",
      "映像研には手を出すな!",
      "斉木楠雄のΨ難",
    ],
  },
  {
    category: "バンド",
    list: [
      "BUMP OF CHICKEN",
      "King Gnu",
      "赤い公園",
      "UNISON SQUARE GARDEN",
      "東京事変",
      "きのこ帝国",
      "ゆらゆら帝国",
      "ZAZEN BOYS",
      "NUMBER GIRL",
    ],
  },
  {
    category: "食べ物",
    description: "甘いものを食べながらコーヒーを飲むのが好きです。",
  },
];
