type Work = {
  image: string;
  name: string;
  description: string;
  tech: string;
  url: string;
};

export const WORKS: Work[] = [
  {
    image: "/blog.png",
    name: "Blog",
    description: "個人ブログ",
    tech: "Next.js, TypeScript, microCMS",
    url: "/blog",
  },
  {
    image: "/typescanner.png",
    name: "typescanner",
    description: "型ガードのためのTypeScriptライブラリ",
    tech: "TypeScript",
    url: "https://github.com/yona3/typescanner",
  },
  {
    image: "/pigu_icon.svg",
    name: "pigu",
    description: "琉大生向け情報共有サイト",
    tech: "React, TypeScript, Firebase",
    url: "https://pigu-ryu.web.app",
  },
  {
    image: "/opinion-box_icon.svg",
    name: "piguご意見箱",
    description: "匿名で意見を送れる意見箱",
    tech: "Next.js, TypeScript, Firebase",
    url: "https://pigu-opinion-box.vercel.app",
  },
  {
    image: "/syllabus_link.png",
    name: "syllabus link",
    description: "シラバスのリンクを生成するChrome拡張機能",
    tech: "JavaScript",
    url: "https://chrome.google.com/webstore/detail/syllabus-link/cbkclpogeoklpidegnmlfkppfmgehcgd",
  },
  {
    image: "/neko-gacha_icon.svg",
    name: "ねこガチャ",
    description: "ランダムで猫の画像を表示するサイト",
    tech: "HTML, CSS, JavaScript",
    url: "https://cat-gacha.netlify.app",
  },
];
