export const siteInfo = {
  name: "yona.dev",
  ownerName: "Koh Yonamine",
  url: "https://yona.dev",
  imageUrl: "https://yona.dev/icon.jpeg",
  twitterSite: "@yonah6g",
} as const;

export const siteNavigationItems = [
  { href: "/", label: "Home", page: "home" },
  { href: "/about", label: "About", page: "about" },
  { href: "/notes", label: "Notes", page: "notes" },
] as const;

export type SitePage = (typeof siteNavigationItems)[number]["page"];

export const siteSocialLinks = [
  {
    id: "github",
    href: "https://github.com/yona3",
    label: "GitHub",
  },
  {
    id: "x",
    href: "https://x.com/yonah6g",
    label: "X",
  },
  {
    id: "zenn",
    href: "https://zenn.dev/yonajs",
    label: "Zenn",
  },
] as const;

export type SiteSocialLinkId = (typeof siteSocialLinks)[number]["id"];

export const siteCopy = {
  metadata: {
    description:
      "AI Agent を使った開発、小さな道具づくり、生活の中で考えたことを書いています。",
  },
  layout: {
    skipLinkLabel: "メインコンテンツへスキップ",
    navigationLabel: "主要ナビゲーション",
    constructionNotice: "このサイトは現在工事中です",
  },
  home: {
    hero: {
      labelledBy: "home-title",
      helloText: "Hello, I'm yona!",
      leadParagraphs: [
        [
          "沖縄でソフトウェアエンジニアをしています 🌺",
          "普段の業務では Web システムの開発に携わっています。",
        ],
        [
          "最近は AI Agent と一緒に開発すること、個人で小さな道具を作ることに時間を使っています。技術メモや日々の記録は Notes に書いています ✏️",
        ],
      ],
    },
    socialLinksLabel: "外部プロフィール",
    recentNotes: {
      labelledBy: "recent-notes-title",
      title: "Notes",
      viewAllLabel: "すべて見る",
    },
  },
  about: {
    metadata: {
      title: "このサイトについて | Koh Yonamine",
      description: "このサイトと書いている人について。",
    },
    hero: {
      labelledBy: "about-title",
      title: "このサイトについて",
      leadParagraphs: [
        [
          "こんにちは、Koh Yonamine です。",
          "沖縄でソフトウェアエンジニアをしています 🌺",
        ],
      ],
    },
    body: {
      label: "プロフィール",
      paragraphs: [
        [
          "普段の業務では Web システムの開発に携わっています。最近は AI Agent と一緒に開発すること、その開発フロー自体を整えることに時間を使っています。",
        ],
        [
          "仕事の外では、自分のために小さな道具を作るのが好きです。このサイトもその一つで、書きながら考えるための小さな机として手を入れ続けています。",
        ],
        [
          "コーヒーと本のある時間を大切にしています ☕",
          "人生に決まった意味はないからこそ、作ることや書くことを自由に楽しめると思っています。",
        ],
      ],
    },
  },
  notes: {
    metadata: {
      title: "Notes | Koh Yonamine",
      description: "技術記事、ノート、日々の記録。",
    },
    hero: {
      labelledBy: "notes-title",
      title: "Notes",
      leadParagraphs: [
        [
          "技術記事、考えたことのノート、作業記録を同じ場所に置いています。まとまる前のことも、日付順にそのまま残します。",
        ],
      ],
    },
    listLabel: "ノート一覧",
  },
  noteDetail: {
    notFoundTitle: "Note not found | Koh Yonamine",
  },
} as const;

export const formatSitePageTitle = (title: string): string => {
  return `${title} | ${siteInfo.ownerName}`;
};

export const getNoteUrl = (slug: string): string => {
  return `${siteInfo.url}/notes/${slug}`;
};
