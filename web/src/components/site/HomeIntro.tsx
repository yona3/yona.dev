"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import { HedgehogEmoji } from "./HedgehogEmoji";
import { HedgehogRunner } from "./HedgehogRunner";
import { HelloBubble } from "./HelloBubble";
import styles from "./site.module.css";

const LAP_DURATION_MS = 4300;

export const HomeIntro = () => {
  const isReduced = useReducedMotion();
  const [isRunning, setIsRunning] = useState(false);
  const [cycle, setCycle] = useState(0);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timerRef.current !== undefined) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleHedgehogClick = () => {
    if (isRunning) return;
    setIsRunning(true);
    timerRef.current = window.setTimeout(() => {
      setIsRunning(false);
      setCycle((c) => c + 1);
      timerRef.current = undefined;
    }, LAP_DURATION_MS);
  };

  return (
    <div className={styles.nameHeading}>
      <h1 id="home-title">
        <HelloBubble key={cycle} hidden={isRunning} />
      </h1>
      {isReduced ? (
        <span aria-hidden="true">
          <HedgehogEmoji className={styles.hedgehogEmoji} />
        </span>
      ) : (
        <HedgehogRunner
          className={styles.hedgehogEmoji}
          isRunning={isRunning}
          onClick={handleHedgehogClick}
        />
      )}
    </div>
  );
};
