import type { PortfolioListProps } from "@/features/portfolio/types";
import { SectionLayout } from "@/shared/components/SectionLayout";

import { WorkItem } from "./WorkItem";

export const PortfolioList = ({ works }: PortfolioListProps) => {
  return (
    <div>
      <SectionLayout>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-left text-2xl font-semibold sm:text-3xl">
            Works
          </h2>
          <div className="grid gap-6 pt-14 sm:grid-cols-1 md:grid-cols-2">
            {works.map(({ name, image, description, tech, url }) => (
              <div key={name} className="w-full">
                <WorkItem
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
