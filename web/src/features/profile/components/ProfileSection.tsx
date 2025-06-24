import type { ProfileProps } from "@/features/profile/types";
import { SectionLayout } from "@/shared/components/SectionLayout";

export const ProfileSection = ({ profileData }: ProfileProps) => {
  const { age, universityAge, likes } = profileData;

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
              {likes.map(({ category, description, list }) => (
                <li key={category} className="leading-7">
                  <span className="mr-1">好きな{category}：</span>
                  {list &&
                    list.map((item, index) => (
                      <span key={index}>
                        {item}
                        {index < list.length - 1 && <span>、</span>}
                        {index === list.length - 1 && <span>など</span>}
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
