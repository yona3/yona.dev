import Image from "next/legacy/image";
import type { FC } from "react";

type Props = {
  image: string;
  name: string;
  description: string;
  tech: string;
  url: string;
};

export const WorkItem: FC<Props> = ({
  image,
  name,
  description,
  tech,
  url,
}) => {
  const contents = (
    <div
      className="
        h-72 cursor-pointer rounded-md border
        border-gray-800 shadow transition duration-500
        sm:h-80 md:hover:opacity-70
      "
    >
      <div className="relative z-0 h-2/3 overflow-hidden rounded-t-md border-b bg-gray-800">
        <Image src={image} layout="fill" objectFit="cover" alt={name} />
      </div>
      <div className="px-3 py-2 text-left sm:px-5">
        <h3 className="text-base font-semibold sm:text-lg">{name}</h3>
        <div className="mt-2 flex flex-col justify-between">
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
