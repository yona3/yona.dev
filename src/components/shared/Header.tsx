import Link from "next/link";
import { useRouter } from "next/router";
import type { VFC } from "react";

export const Header: VFC = () => {
  const { pathname } = useRouter();

  return (
    <header
      className="
        p-5 text-center bg-yellow-50
        shadow sm:px-10
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
            yona.{pathname === "/" ? "dev" : "blog"}
          </h1>
        </Link>
      </div>
    </header>
  );
};
