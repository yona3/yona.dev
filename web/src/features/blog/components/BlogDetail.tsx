import Link from "next/link";

import type { BlogDetailProps } from "@/features/blog/types";
import { ProfileAuthor } from "@/features/profile/components/ProfileAuthor";
import { ShareButtons } from "@/shared/components/ShareButtons";
import { formatDate } from "@/shared/utils/date";

import styles from "./BlogDetail.module.css";

export const BlogDetail = ({
  article,
  prev,
  next,
  universityAge,
}: BlogDetailProps) => {
  const title = article.title;
  const url = `https://yona.dev/blog/${article.id}`;

  return (
    <div className="pb-8 pt-10 font-noto text-gray-300 sm:pb-12 sm:pt-24">
      <div className="mx-auto max-w-2xl">
        {/* top */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          <div className="mt-5 flex text-sm text-gray-400">
            <p className="mr-5">公開日: {formatDate(article.publishedAt)}</p>
            <p className="">更新日: {formatDate(article.updatedAt)}</p>
          </div>
          {/* tags */}
          <ul className="mt-5 flex space-x-2">
            {article.tags.map((tag) => (
              <li
                key={tag.id}
                className="
                  cursor-pointer rounded-full border border-gray-400 px-3
                  py-1 text-sm
                "
              >
                {tag.name}
              </li>
            ))}
          </ul>
        </div>
        {/* article */}
        <div
          className={styles.article}
          dangerouslySetInnerHTML={{
            // eslint-disable-next-line @typescript-eslint/naming-convention
            __html: `${article.body}`,
          }}
        />
        {/* author */}
        <div className="mx-auto mt-8 max-w-2xl">
          <ProfileAuthor universityAge={universityAge} />
        </div>
        {/* share */}
        <ShareButtons url={url} title={title} />
        {/* footer */}
        <div className="mt-10">
          {/* prev, next */}
          <div
            className="
            flex flex-col space-y-5 
            text-center sm:flex-row
            sm:justify-between sm:space-y-0
            "
          >
            <div
              className={`${
                !prev && "hidden sm:block"
              } w-full cursor-pointer transition hover:opacity-80 sm:w-2/5`}
            >
              {prev && (
                <Link href={`/blog/${prev.id}`}>
                  <div className="flex justify-center sm:justify-start">
                    <span className="mr-2 font-bold">←</span>
                    <p className="text-center sm:text-left">{prev.title}</p>
                  </div>
                </Link>
              )}
            </div>
            <div
              className={`${
                !next && "hidden sm:block"
              } w-full cursor-pointer transition hover:opacity-80 sm:w-2/5`}
            >
              {next && (
                <Link href={`/blog/${next.id}`}>
                  <div className="flex justify-center text-right sm:justify-end">
                    <p className="text-center sm:text-left">{next.title}</p>
                    <span className="ml-2 font-bold">→</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
