import { SectionLayout } from "./shared/SectionLayout";

// eslint-disable-next-line react/display-name
export const About = () => {
  return (
    <div className="pb-4 md:pb-8">
      <SectionLayout>
        <div className="mx-auto max-w-3xl text-left">
          <h2 className="text-2xl sm:text-3xl font-semibold">About</h2>
          <div className="mt-8 text-base">
            <p className="text-base sm:text-lg leading-relaxed">
              私は琉球大学の理学部に所属している大学2年生です。
              普段はWebアプリ開発をしています。
              現在は主に大学生向けのサービスを運営・開発したり、Webのバックエンド開発やシステム開発をしています。
            </p>
            <br />
            <p className="text-base sm:text-lg leading-relaxed">
              生まれも育ちも沖縄県で、趣味はギターとバスケです。苦手な食べ物は「しいたけ」と「いか」です。好きな曲はBUMP
              OF CHICKENの「いか」です。
            </p>
          </div>
        </div>
      </SectionLayout>
    </div>
  );
};
