import Image from "next/image";
import Link from "next/link";
import type { VFC } from "react";

import { SectionLayout } from "./shared/SectionLayout";

export const Top: VFC = () => {
  return (
    <SectionLayout>
      <div className="mx-auto max-w-sm">
        <Image
          className="rounded-full"
          src="/icon.jpeg"
          width={125}
          height={125}
        />
        <h2 className="mt-2 text-2xl font-semibold">yona</h2>
        <p className="mt-4">Web開発が好きな大学２年生です</p>
        <div className="flex justify-center mx-auto mt-6">
          <ul className="flex space-x-4">
            <li className="flex items-center cursor-pointer">
              <Link href="/blog">
                <Image
                  className="hover:opacity-70 transition"
                  src="/blog.svg"
                  width={26}
                  height={26}
                />
              </Link>
            </li>
            <li className="cursor-pointer">
              <a
                className="block ml-1 w-8 h-8 hover:opacity-70 transition"
                href="https://github.com/yona3"
                target="_blank"
                rel="noreferrer"
              >
                <Image src="/github.svg" width={31} height={31} />
              </a>
            </li>
            <li className="cursor-pointer">
              <a
                className="block w-8 h-8 hover:opacity-70 transition"
                href="https://twitter.com/js_yona"
                target="_blank"
                rel="noreferrer"
              >
                <Image src="/twitter.svg" width={30} height={30} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </SectionLayout>
  );
};
