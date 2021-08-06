import Link from "next/link";
import { useRouter } from "next/router";
import type { VFC } from "react";

const ITEMS = ["About", "Products", "Blog"];

interface Props {
  refs: { [key: string]: HTMLElement };
}

export const Header: VFC<Props> = ({ refs }) => {
  const router = useRouter();

  const handleScroll = (name: string) => {
    if (router.pathname !== "/") return router.push("/");
    refs[name.toLowerCase()].scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <header
      className="
        py-5 px-5 sm:px-10 font-mono
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
          <h1 className="text-xl font-semibold cursor-pointer ">
            {"🦔"} yona{"'"}s home
          </h1>
        </Link>
        <nav>
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
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                  <li
                    onClick={() => handleScroll(name)}
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
