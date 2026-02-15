import { SectionLayout } from "./shared/SectionLayout";

export const About = () => {
  return (
    <div className="pb-4 md:pb-8">
      <SectionLayout>
        <div className="mx-auto max-w-3xl text-left">
          <h2 className="text-2xl font-semibold sm:text-3xl">About</h2>
          <div className="mt-8 text-sm sm:text-base">
            <p className="leading-relaxed">
              沖縄出身のソフトウェアエンジニア。琉球大学理学部物質地球科学科を卒業後、2025年よりエンジニアとして働いています。フロントエンドからバックエンド、インフラまで幅広く取り組んでいます。
            </p>
            <p className="mt-4 leading-relaxed">
              趣味は音楽（バンド）、サッカー観戦、個人開発。
            </p>
          </div>
        </div>
      </SectionLayout>
    </div>
  );
};
