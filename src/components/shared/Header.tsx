import Link from "next/link";
import { useRouter } from "next/router";
import type { VFC } from "react";

export const Header: VFC = () => {
  const { pathname } = useRouter();

  return (
    <header
      className="
        py-5 px-5 sm:px-10
        text-center bg-yellow-50 shadow
      "
    >
      <div
        className="
          flex justify-center 
          items-center mx-auto max-w-screen-xl 
        "
      >
        <Link href={pathname === "/" ? "/" : "/blog"}>
          <h1 className="font-mono text-xl font-semibold cursor-pointer">
            {"🦔"} yona{"'"}s {pathname === "/" ? "home" : "blog"}
          </h1>
        </Link>
      </div>
    </header>
  );
};
