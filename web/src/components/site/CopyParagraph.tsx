import { Fragment } from "react";

type Props = {
  className?: string;
  lines: readonly string[];
};

export const CopyParagraph = ({ className, lines }: Props) => {
  return (
    <p className={className}>
      {lines.map((line, index) => (
        <Fragment key={`${line}-${index}`}>
          {index > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </p>
  );
};
