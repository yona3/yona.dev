import { SectionLayout } from "./shared/SectionLayout";

// eslint-disable-next-line react/display-name
export const About = () => {
  return (
    <div className="pb-4 md:pb-8">
      <SectionLayout>
        <div className="mx-auto max-w-3xl text-left">
          <h2 className="text-2xl sm:text-3xl font-semibold">About</h2>
          <div className="mt-8 text-base leading-relaxed">
            <p className="text-base sm:text-lg leading-relaxed">
              私は琉球大学の理学部に所属している大学2年生です。
              趣味と仕事でWebアプリ開発やシステム開発をしています。
              現在は個人開発のサービスを開発・運営や、React, Next.js,
              TypeScript, Go言語, Firebaseなどを使用した開発をしています。
            </p>
            <br />
            <p className="text-base sm:text-lg leading-relaxed">
              生まれも育ちも沖縄県で、趣味はプログラミング、ギター、バスケットボールです。こんぶ、しいたけ、レバーが苦手です。
            </p>
          </div>
        </div>
      </SectionLayout>
    </div>
  );
};
