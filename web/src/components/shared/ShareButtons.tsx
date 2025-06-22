"use client";

import {
  HatenaIcon,
  HatenaShareButton,
  LineIcon,
  LineShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";

type ShareButtonsProps = {
  url: string;
  title: string;
};

export const ShareButtons = ({ url, title }: ShareButtonsProps) => {
  return (
    <div className="mt-12 space-x-2">
      <LineShareButton className="focus:outline-none" url={url}>
        <LineIcon size={36} round />
      </LineShareButton>
      <TwitterShareButton className="focus:outline-none" url={url}>
        <TwitterIcon size={36} round />
      </TwitterShareButton>
      <HatenaShareButton className="focus:outline-none" url={url} title={title}>
        <HatenaIcon size={36} round />
      </HatenaShareButton>
    </div>
  );
};
