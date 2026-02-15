import Image from "next/image";
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
          className="mx-auto rounded-full"
          alt="yona"
          src="/icon.jpeg"
          width={125}
          height={125}
          priority
        />
        <h2 className="mt-2 text-2xl font-semibold">yona</h2>
        <p className="mt-4">Hello :)</p>

        <div className="mx-auto mt-6 flex justify-center">
          <ul className="flex items-center space-x-4">
            <li className="flex cursor-pointer items-center">
              <a
                className="block transition hover:opacity-60"
                href="https://github.com/yona3"
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon
                  width="32"
                  height="32"
                  className="fill-gray-100"
                />
              </a>
            </li>
            <li className="flex cursor-pointer items-center">
              <a
                className="block transition hover:opacity-60"
                href="https://twitter.com/yonah6g"
                target="_blank"
                rel="noreferrer"
              >
                <TwitterIcon
                  width="30"
                  height="30"
                  className="fill-gray-100"
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
                  height="25"
                  className="fill-gray-100"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </SectionLayout>
  );
};
