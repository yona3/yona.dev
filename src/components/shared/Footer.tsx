import type { VFC } from "react";

export const Footer: VFC = () => {
  return (
    <footer
      className="
    absolute bottom-0 py-6 w-full text-center 
    border-t border-gray-200
    "
    >
      <p className="text-sm text-gray-400">
        &copy; {new Date().getFullYear()}, yona
      </p>
    </footer>
  );
};
