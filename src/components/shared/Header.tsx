import Link from "next/link";
import type { VFC } from "react";

export const Header: VFC = () => {
  return (
    <header
      className="
        py-5 px-5 sm:px-10
        text-center bg-yellow-50 shadow
      "
    >
      <div
        className="
          flex justify-center sm:justify-between 
          items-center mx-auto max-w-screen-xl 
        "
      >
        <Link href="/">
          <h1 className="font-mono text-xl font-semibold cursor-pointer">
            {"🦔"} yona{"'"}s home
          </h1>
        </Link>
      </div>
    </header>
  );
};
