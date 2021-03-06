import { LIKES } from "../constants/like";
import { age, universityAge } from "../utils/age";
import { SectionLayout } from "./shared/SectionLayout";

// eslint-disable-next-line react/display-name
export const About = () => {
  return (
    <div className="pb-4 md:pb-8">
      <SectionLayout>
        <div className="mx-auto max-w-3xl text-left">
          <h2 className="text-2xl font-semibold sm:text-3xl">About</h2>
          <div className="mt-8 text-sm sm:text-base">
            <p className="leading-relaxed">
              私は琉球大学の理学部に所属している大学生です。 現在{universityAge}
              年生の{age}
              歳です。趣味はバスケットボールとギターと個人開発です。
            </p>
            <ul className="mt-4 space-y-4">
              {LIKES.map(({ category, description, list }) => (
                <li key={category} className="leading-7">
                  <span className="mr-1">好きな{category}：</span>
                  {list &&
                    list.map((item, index) => (
                      <span key={index}>
                        {item}
                        <span>、</span>
                        {index === list.length - 1 && "etc."}
                      </span>
                    ))}
                  {description && <span>{description}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionLayout>
    </div>
  );
};
