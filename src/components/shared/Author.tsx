import Image from "next/image";
import type { VFC } from "react";

import { MyLinks } from "./MyLinks";

export const Author: VFC = () => {
  return (
    <div className="p-4 pb-8 rounded-md border border-gray-400 shadow-sm sm:flex sm:p-6">
      {/* left */}
      <div className="m-0 text-center sm:mr-6">
        <Image
          className="rounded-full"
          src="/icon.jpeg"
          width={112}
          height={112}
        />
      </div>
      {/* right */}
      <div className="mt-1 w-full sm:mt-0">
        <div className="text-left">
          <p className="text-lg font-semibold text-center sm:text-xl sm:text-left">
            yona
          </p>
          <p className="mt-3 text-sm leading-relaxed sm:mt-2">
            {/* TODO: update */}
            琉球大学の理学部に所属している大学2年生です。
            趣味と仕事でWebアプリ開発やシステム開発をしています。
          </p>
        </div>

        <div className="mt-2">
          <MyLinks />
        </div>
      </div>
    </div>
  );
};
