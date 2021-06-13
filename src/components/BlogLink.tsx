import Link from "next/link";
import type { VFC } from "react";

import { SectionLayout } from "./shared/SectionLayout";

export const BlogLink: VFC = () => {
  return (
    <SectionLayout>
      <Link href="/blog">
        <p
          className="
            border-b-2 border-gray-800 sm:border-opacity-0
            border-opacity-70
            cursor-pointer h-8 inline-block
            box-border relative flex-col-reverse
            sm:hover:border-opacity-100 transition duration-200
          "
        >
          Tech Blog
        </p>
      </Link>
    </SectionLayout>
  );
};
