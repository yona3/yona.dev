import Image from "next/image";
import Link from "next/link";
import type { VFC } from "react";

export const Author: VFC = () => {
  return (
    <div className="sm:flex p-6 pb-8 rounded-md border shadow-sm">
      {/* left */}
      <div className="m-0 sm:mr-6 text-center">
        <Image
          className="rounded-full"
          src="/icon.jpeg"
          width={112}
          height={112}
        />
      </div>
      {/* right */}
      <div className="mt-1 sm:mt-0 w-full">
        <div className="text-left">
          <p className="text-lg sm:text-xl font-semibold text-center sm:text-left">
            yona
          </p>
          <p className="mt-3 sm:mt-2 text-sm">
            琉球大学の理学部に所属している大学2年生です。
            趣味と仕事でWebアプリ開発やシステム開発をしています。
          </p>
        </div>

        <div className="mt-2">
          <ul className="flex space-x-1 text-sm text-gray-600">
            <li className="hover:text-gray-400 underline transition">
              <a
                href="http://github.com/yona3"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <span>・</span>
            <li className="hover:text-gray-400 underline transition">
              <a
                href="http://twitter.com/yonah6g"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
            </li>
            <span>・</span>
            <li className="hover:text-gray-400 underline transition">
              <Link href="/">
                <a>yona.dev</a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
