import type { FC } from "react";

const year = new Date().getFullYear();

export const Footer: FC = () => {
  return (
    <footer
      className="
        absolute bottom-0 w-full border-t border-gray-800 
        py-6 text-center
      "
    >
      <p className="text-sm text-gray-400">&copy; {year}, yona</p>
    </footer>
  );
};
