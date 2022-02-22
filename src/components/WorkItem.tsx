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
        sm:hover:scale-[1.05]
        border border-gray-200 shadow-md transform
        sm:hover:shadow-lg h-72 sm:h-80 rounded-2xl 
        transition duration-500 cursor-pointer
      "
    >
      <div className="overflow-hidden relative z-0 h-2/3 bg-yellow-50 rounded-t-2xl border-b">
        <Image src={image} layout="fill" objectFit="cover" />
      </div>
      <div className="py-2 px-3 sm:px-5 text-left">
        <h3 className="text-base sm:text-lg font-semibold">{name}</h3>
        <div className="flex flex-col justify-between mt-2">
          <p className="text-xs sm:text-sm">{description}</p>
          <p className="mt-2 text-xs text-gray-500">Tech: {tech}</p>
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
