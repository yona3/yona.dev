"use client";

import { HedgehogEmoji } from "./HedgehogEmoji";
import homeStyles from "./home.module.css";
import motionStyles from "./motion.module.css";

type Props = {
  className?: string;
  isRunning: boolean;
  onClick: () => void;
};

export const HedgehogRunner = ({ className, isRunning, onClick: handleClick }: Props) => {
  return (
    <button
      aria-label="ハリネズミを走らせる"
      className={`${homeStyles.hedgehogButton} ${motionStyles.wobbleButton} ${isRunning ? motionStyles.hedgehogRunning : ""}`}
      onClick={handleClick}
      type="button"
    >
      <span className={`${homeStyles.hedgehogWobbleHost} ${motionStyles.wobbleTarget}`}>
        <HedgehogEmoji className={className} />
      </span>
    </button>
  );
};
