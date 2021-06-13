import { forwardRef } from "react";

import { SectionLayout } from "./shared/SectionLayout";

export const About = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref}>
      <SectionLayout>
        <div>
          <h2 className="text-2xl font-semibold">About</h2>
          <div className="px-4 mt-8 text-sm sm:text-base text-left">
            <p>
              私は地方大学の理学部に所属している大学生です。
              大学1年生のときにWeb開発に興味を持ち、勉強を始めました。
            </p>
            <br />
            <p>
              現在はReactとFirebaseで構築したWebサービスを運営したり、TypeScriptを使ったバックエンド開発の勉強をしています。
            </p>
          </div>
        </div>
      </SectionLayout>
    </div>
  );
});
