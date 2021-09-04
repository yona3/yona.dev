import { ProductItem } from "./ProductItem";
import { SectionLayout } from "./shared/SectionLayout";

const ITEMS: {
  image: string;
  name: string;
  description: string;
  tech: string;
  url: string;
}[] = [
  {
    image: "/blog.png",
    name: "Blog",
    description: "個人ブログ",
    tech: "Next.js, TypeScript, microCMS",
    url: "/blog",
  },
  {
    image: "/pigu_icon.svg",
    name: "pigu",
    description: "琉大生向け情報共有サイト",
    tech: "React, TypeScript, Firebase",
    url: "https://pigu-ryu.web.app",
  },
  {
    image: "/opinion-box_icon.svg",
    name: "piguご意見箱",
    description: "匿名で意見を送れる意見箱",
    tech: "Next.js, TypeScript, Firebase",
    url: "https://pigu-opinion-box.vercel.app",
  },
  {
    image: "/neko-gacha_icon.svg",
    name: "ねこガチャ",
    description: "ランダムで猫の画像を表示するサイト",
    tech: "HTML, CSS, JavaScript",
    url: "https://cat-gacha.netlify.app",
  },
];

// eslint-disable-next-line react/display-name
export const Products = () => {
  return (
    <div>
      <SectionLayout>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-semibold text-left">
            Products
          </h2>
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6 lg:gap-y-12 pt-14">
            {ITEMS.map(({ name, image, description, tech, url }) => (
              <div key={name} className="w-full sm:max-w-md">
                <ProductItem
                  name={name}
                  image={image}
                  description={description}
                  tech={tech}
                  url={url}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionLayout>
    </div>
  );
};
