import type { VFC } from "react";

const year = new Date().getFullYear();

export const Footer: VFC = () => {
  return (
    <footer
      className="
        absolute bottom-0 py-6 w-full text-center 
        border-t border-gray-800
      "
    >
      <p className="text-sm text-gray-400">&copy; {year}, yona</p>
    </footer>
  );
};
