import Image from "next/image";
import type { VFC } from "react";

import { GithubIcon } from "./icons/GithubIcon";
import { TwitterIcon } from "./icons/TwitterIcon";
import { SectionLayout } from "./shared/SectionLayout";

export const Top: VFC = () => {
  return (
    <SectionLayout>
      <div className="pt-4 mx-auto max-w-sm">
        <Image
          className="rounded-full"
          src="/icon.jpeg"
          width={125}
          height={125}
        />
        <h2 className="mt-2 text-2xl font-semibold">yona</h2>
        <p className="mt-4">Web開発してる大学生です</p>

        <div className="flex justify-center mx-auto mt-6">
          <ul className="flex items-center space-x-4">
            <li className="cursor-pointer">
              <a
                className="block w-8 h-8 hover:opacity-60 transition"
                href="https://github.com/yona3"
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon
                  width="30"
                  height="30"
                  className="flex justify-center items-center"
                />
              </a>
            </li>
            <li className="mt-1 cursor-pointer">
              <a
                className="block w-8 h-8 hover:opacity-60 transition"
                href="https://twitter.com/yonah6g"
                target="_blank"
                rel="noreferrer"
              >
                <TwitterIcon
                  width="28"
                  className="flex justify-center items-center"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </SectionLayout>
  );
};
