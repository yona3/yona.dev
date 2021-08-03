import { forwardRef } from "react";

import { SectionLayout } from "./shared/SectionLayout";

// eslint-disable-next-line react/display-name
export const About = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref}>
      <SectionLayout>
        <div>
          <h2 className="text-2xl font-semibold">About</h2>
          <div className="px-4 mt-8 text-sm sm:text-base text-left">
            <p>
              私は琉球大学の理学部に所属している大学生です。
              卒業後はWebエンジニアとして就職したいのでWeb開発の勉強をしています。
            </p>
            <br />
            <p>
              現在は主にReactとFirebaseで構築したWebサービスを運営・開発したり、TypeScriptを使ったAPI開発の勉強をしています。
            </p>
          </div>
        </div>
      </SectionLayout>
    </div>
  );
});
