"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FC } from "react";

export const Header: FC = () => {
  const pathname = usePathname();

  return (
    <header
      className="
        border-b border-gray-800 bg-gray-900
        p-5 text-center shadow sm:px-10
      "
    >
      <div
        className="
          mx-auto flex 
          max-w-screen-xl items-center justify-center 
        "
      >
        <Link href={pathname === "/" ? "/" : "/blog"}>
          <h1 className="cursor-pointer font-mono text-xl font-semibold">
            yona.{pathname === "/" ? "dev" : "blog"}
          </h1>
        </Link>
      </div>
    </header>
  );
};
