import Image from "next/image";
import type { VFC } from "react";

type Props = {
  image: string;
  name: string;
  description: string;
  tech: string;
  url: string;
};

export const WorkItem: VFC<Props> = ({
  image,
  name,
  description,
  tech,
  url,
}) => {
  const contents = (
    <div
      className="
        h-72 rounded-md border border-gray-800
        shadow transition duration-500 cursor-pointer
        sm:h-80 md:hover:opacity-70
      "
    >
      <div className="overflow-hidden relative z-0 h-2/3 bg-gray-800 rounded-t-md border-b">
        <Image src={image} layout="fill" objectFit="cover" />
      </div>
      <div className="py-2 px-3 text-left sm:px-5">
        <h3 className="text-base font-semibold sm:text-lg">{name}</h3>
        <div className="flex flex-col justify-between mt-2">
          <p className="text-xs sm:text-sm">{description}</p>
          <p className="mt-2 text-xs text-gray-400">Tech: {tech}</p>
        </div>
      </div>
    </div>
  );

  return (
    <a className="block" href={url} target="_blank" rel="noreferrer">
      {contents}
    </a>
  );
};
