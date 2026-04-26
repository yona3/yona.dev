"use client";

import { HedgehogEmoji } from "./HedgehogEmoji";
import styles from "./site.module.css";

type Props = {
  className?: string;
  isRunning: boolean;
  onClick: () => void;
};

export const HedgehogRunner = ({ className, isRunning, onClick: handleClick }: Props) => {
  return (
    <button
      aria-label="ハリネズミを走らせる"
      className={`${styles.hedgehogButton} ${isRunning ? styles.hedgehogRunning : ""}`}
      onClick={handleClick}
      type="button"
    >
      <span className={styles.hedgehogWobbleHost}>
        <HedgehogEmoji className={className} />
      </span>
    </button>
  );
};
