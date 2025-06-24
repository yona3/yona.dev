import Image from "next/image";
import type { FC } from "react";

import { GithubIcon } from "@/shared/components/icons/GithubIcon";
import { TwitterIcon } from "@/shared/components/icons/TwitterIcon";
import { ZennIcon } from "@/shared/components/icons/ZennIcon";
import { SectionLayout } from "@/shared/components/SectionLayout";

export const ProfileHero: FC = () => {
  return (
    <SectionLayout>
      <div className="mx-auto max-w-sm pt-4 text-center">
        <div className="flex justify-center">
          <Image
            className="size-24 rounded-full sm:size-32"
            alt="yona"
            src="/icon.jpeg"
            width={128}
            height={128}
            priority
            sizes="(max-width: 640px) 96px, 128px"
          />
        </div>
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
                  width="30"
                  height="30"
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
                  width="30"
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
