import { WORKS } from "../constants/works";
import { SectionLayout } from "./shared/SectionLayout";
import { WorkItem } from "./WorkItem";

// eslint-disable-next-line react/display-name
export const Works = () => {
  return (
    <div>
      <SectionLayout>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-semibold text-left">
            Works
          </h2>
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6 lg:gap-y-12 pt-14">
            {WORKS.map(({ name, image, description, tech, url }) => (
              <div key={name} className="w-full sm:max-w-md">
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
