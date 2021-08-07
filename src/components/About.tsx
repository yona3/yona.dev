import { SectionLayout } from "./shared/SectionLayout";

// eslint-disable-next-line react/display-name
export const About = () => {
  return (
    <div>
      <SectionLayout>
        <div>
          <h2 className="text-2xl font-semibold">About</h2>
          <div className="px-4 mt-8 text-base text-left">
            <p>
              私は琉球大学の理学部に所属している大学生です。
              普段は趣味でWebアプリ開発をしています。
            </p>
            <br />
            <p>
              現在は主にReactとFirebaseで構築したWebサービスを運営・開発したり、TypeScriptを使ったAPI開発をしています。
            </p>
          </div>
        </div>
      </SectionLayout>
    </div>
  );
};
