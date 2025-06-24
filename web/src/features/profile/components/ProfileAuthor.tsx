import Image from "next/image";
import type { FC } from "react";

import { MyLinks } from "@/shared/components/MyLinks";

type Props = {
  universityAge: number;
};

export const ProfileAuthor: FC<Props> = ({ universityAge }) => {
  return (
    <div className="rounded-md border border-gray-400 p-4 pb-8 shadow-sm sm:flex sm:p-6">
      {/* left */}
      <div className="m-0 text-center sm:mr-6">
        <Image
          className="rounded-full"
          src="/icon.jpeg"
          alt="yona"
          width={112}
          height={112}
          priority={true}
          sizes="(max-width: 640px) 112px, 112px"
        />
      </div>
      {/* right */}
      <div className="mt-1 w-full sm:mt-0">
        <div className="text-left">
          <p className="text-center text-lg font-semibold sm:text-left sm:text-xl">
            yona
          </p>
          <p className="mt-3 text-sm leading-relaxed sm:mt-2">
            琉球大学の理学部に所属している大学{universityAge}年生です。
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
