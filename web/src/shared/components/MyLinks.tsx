import Link from "next/link";
import { Fragment } from "react";

import type { LinkItem } from "@/shared/constants/links";
import { MY_LINKS } from "@/shared/constants/links";

const LinkList = ({ type, href, name }: LinkItem) => (
  <li className="underline transition hover:text-gray-300">
    {type === "a" ? (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {name}
      </a>
    ) : (
      <Link href={href}>{name}</Link>
    )}
  </li>
);

export const MyLinks = () => {
  return (
    <ul className="flex space-x-1 text-sm text-gray-400">
      {MY_LINKS.map((link, index) => (
        <Fragment key={link.name}>
          <LinkList {...link} />
          {index !== MY_LINKS.length - 1 && <span>・</span>}
        </Fragment>
      ))}
    </ul>
  );
};
