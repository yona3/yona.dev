import Image from "next/image";
import type { VFC } from "react";

import { SectionLayout } from "./shared/SectionLayout";

export const Top: VFC = () => {
  return (
    <SectionLayout>
      <div className="mx-auto max-w-sm">
        <Image className="rounded-full" src="/icon.jpeg" width={125} height={125} />
        <h2 className="mt-2 text-2xl font-semibold">yona</h2>
        <p className="mt-4">Web開発が好きな大学２年生です</p>
        <div className="flex justify-between items-center mx-auto mt-6 w-20">
          <a
            className="block w-8 h-8 ml-1 hover:opacity-70 transition"
            href="https://github.com/yona3"
            target="_blank"
            rel="noreferrer"
          >
            <Image src="/GitHub-Mark.png" width={30} height={30} />
          </a>
          <a
            className="block w-8 h-8 hover:opacity-70 transition"
            href="https://twitter.com/js_yona"
            target="_blank"
            rel="noreferrer"
          >
            <Image src="/twitter_icon.svg" width={32} height={32} />
          </a>
        </div>
      </div>
    </SectionLayout>
  );
};
