import type { FC } from "react";

// Static year to prevent hydration errors
// TODO: Update annually to match current year
const STATIC_YEAR = 2025;

export const Footer: FC = () => {
  return (
    <footer
      className="
        absolute bottom-0 w-full border-t border-gray-800 
        py-6 text-center
      "
    >
      <p className="text-sm text-gray-400">&copy; {STATIC_YEAR}, yona</p>
    </footer>
  );
};
