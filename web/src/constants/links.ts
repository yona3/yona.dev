export type LinkItem = {
  name: string;
  type: "a" | "Link";
  href: string;
};

export const MY_LINKS: LinkItem[] = [
  {
    name: "GitHub",
    type: "a",
    href: "http://github.com/yona3",
  },
  {
    name: "Twitter",
    type: "a",
    href: "http://twitter.com/yonah6g",
  },
  {
    name: "Zenn",
    type: "a",
    href: "https://zenn.dev/yonajs",
  },
  {
    name: "yona.dev",
    type: "Link",
    href: "/",
  },
];
