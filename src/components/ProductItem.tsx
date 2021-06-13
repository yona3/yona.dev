import Image from "next/image";
import type { VFC } from "react";

interface Props {
  image: string;
  name: string;
  description: string;
  tech: string;
  url: string;
}

export const ProductItem: VFC<Props> = ({ image, name, description, tech, url }) => {
  return (
    <a className="block cursor-pointer" href={url} target="_blank" rel="noreferrer">
      <div className="h-72 sm:h-80 rounded-2xl shadow-md">
        <div className="overflow-hidden relative h-2/3 bg-yellow-50 rounded-t-2xl border-b">
          <Image
            className="transition duration-500 transform hover:scale-110"
            src={image}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="py-2 px-3 sm:px-5 text-left">
          <h3 className="text-base sm:text-lg font-semibold">{name}</h3>
          <div className="flex flex-col justify-between mt-2">
            <p className="text-xs sm:text-sm">{description}</p>
            <p className="mt-2 text-xs text-gray-500">Tech: {tech}</p>
          </div>
        </div>
      </div>
    </a>
  );
};
