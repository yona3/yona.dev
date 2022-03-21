import Image from "next/image";
import type { VFC } from "react";

import { GithubIcon } from "./icons/GithubIcon";
import { TwitterIcon } from "./icons/TwitterIcon";
import { ZennIcon } from "./icons/ZennIcon";
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
        <p className="mt-4">Hello :)</p>

        <div className="flex justify-center mx-auto mt-6">
          <ul className="flex items-center space-x-4">
            <li className="flex items-center mr-[2px] cursor-pointer">
              <a
                className="block hover:opacity-60 transition"
                href="https://github.com/yona3"
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon
                  width="32"
                  height="32"
                  className="flex justify-center items-center fill-gray-100"
                />
              </a>
            </li>
            <li className="flex items-center mt-[2px] cursor-pointer">
              <a
                className="block hover:opacity-60 transition"
                href="https://twitter.com/yonah6g"
                target="_blank"
                rel="noreferrer"
              >
                <TwitterIcon
                  width="30"
                  className="flex justify-center items-center fill-gray-100"
                />
              </a>
            </li>
            <li className="flex items-center cursor-pointer">
              <a
                className="block hover:opacity-60 transition"
                href="https://zenn.dev/yonajs"
                target="_blank"
                rel="noreferrer"
              >
                <ZennIcon
                  width="25"
                  className="flex justify-center items-center fill-gray-100"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </SectionLayout>
  );
};
