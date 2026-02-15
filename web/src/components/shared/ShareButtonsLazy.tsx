"use client";

import dynamic from "next/dynamic";

type Props = {
  url: string;
  title: string;
};

const ShareButtons = dynamic(
  () => import("./ShareButtons").then((mod) => mod.ShareButtons),
  {
    ssr: false,
    loading: () => <div className="mt-12 h-9" />,
  },
);

export const ShareButtonsLazy = ({ url, title }: Props) => {
  return <ShareButtons url={url} title={title} />;
};
