import Image from "next/legacy/image";
import type { FC } from "react";

import { GithubIcon } from "./icons/GithubIcon";
import { TwitterIcon } from "./icons/TwitterIcon";
import { ZennIcon } from "./icons/ZennIcon";
import { SectionLayout } from "./shared/SectionLayout";

export const Top: FC = () => {
  return (
    <SectionLayout>
      <div className="mx-auto max-w-sm pt-4">
        <Image
          className="rounded-full"
          alt="yona"
          src="/icon.jpeg"
          width={125}
          height={125}
        />
        <h2 className="mt-2 text-2xl font-semibold">yona</h2>
        <p className="mt-4">Hello :)</p>

        <div className="mx-auto mt-6 flex justify-center">
          <ul className="flex items-center space-x-4">
            <li className="mr-[2px] flex cursor-pointer items-center">
              <a
                className="block transition hover:opacity-60"
                href="https://github.com/yona3"
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon
                  width="32"
                  height="32"
                  className="flex items-center justify-center fill-gray-100"
                />
              </a>
            </li>
            <li className="mt-[2px] flex cursor-pointer items-center">
              <a
                className="block transition hover:opacity-60"
                href="https://twitter.com/yonah6g"
                target="_blank"
                rel="noreferrer"
              >
                <TwitterIcon
                  width="30"
                  className="flex items-center justify-center fill-gray-100"
                />
              </a>
            </li>
            <li className="flex cursor-pointer items-center">
              <a
                className="block transition hover:opacity-60"
                href="https://zenn.dev/yonajs"
                target="_blank"
                rel="noreferrer"
              >
                <ZennIcon
                  width="25"
                  className="flex items-center justify-center fill-gray-100"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </SectionLayout>
  );
};
