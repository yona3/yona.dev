import type { VFC } from "react";

const ITEMS = ["About", "Products", "Blog"];

export const Header: VFC = () => {
  return (
    <header className="py-5 px-5 sm:px-10 font-mono text-center bg-yellow-50 shadow">
      <div className="flex justify-between items-center mx-auto max-w-screen-xl ">
        <h1 className="text-base sm:text-xl text-gray-800 ">
          {"🦔"} yona{"'"}s home
        </h1>
        <nav>
          {/* pc */}
          <div className="hidden sm:block">
            <ul className="flex justify-between w-64">
              {ITEMS.map((name) => (
                <li
                  key={name}
                  className="box-border relative flex-col-reverse border-b-2 border-gray-800 border-opacity-0 hover:border-opacity-100 transition duration-200 cursor-pointer"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};
