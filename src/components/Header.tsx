import Link from "next/link";
import type { VFC } from "react";

const ITEMS = ["About", "Products", "Blog"];

export const Header: VFC = () => {
  return (
    <header
      className="
        py-5 px-5 sm:px-10 font-mono
        text-center bg-yellow-50 shadow
      "
    >
      <div className="flex justify-between items-center mx-auto max-w-screen-xl ">
        <Link href="/">
          <h1 className="text-base sm:text-xl text-gray-800 cursor-pointer ">
            {"🦔"} yona{"'"}s home
          </h1>
        </Link>
        <nav>
          {/* pc */}
          <div className="hidden sm:block">
            <ul className="flex justify-between w-64">
              {ITEMS.map((name) => {
                return name === "Blog" ? (
                  <Link key="name" href="/blog">
                    <li
                      className="
                        cursor-pointer
                        box-border relative flex-col-reverse
                        border-b-2 border-gray-800 border-opacity-0
                        hover:border-opacity-100 transition duration-200
                      "
                    >
                      {name}
                    </li>
                  </Link>
                ) : (
                  <li
                    key={name}
                    className="
                      cursor-pointer
                      box-border relative flex-col-reverse 
                      border-b-2 border-gray-800 border-opacity-0
                      hover:border-opacity-100 transition duration-200
                    "
                  >
                    {name}
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};
