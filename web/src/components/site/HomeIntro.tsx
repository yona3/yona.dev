"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import { HedgehogEmoji } from "./HedgehogEmoji";
import { HedgehogRunner } from "./HedgehogRunner";
import { HelloBubble } from "./HelloBubble";
import homeStyles from "./home.module.css";

const LAP_DURATION_MS = 4300;

type Props = {
  helloText: string;
};

export const HomeIntro = ({ helloText }: Props) => {
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
    <div className={homeStyles.nameHeading}>
      <h1 id="home-title">
        <HelloBubble key={cycle} hidden={isRunning} text={helloText} />
      </h1>
      {isReduced ? (
        <span aria-hidden="true">
          <HedgehogEmoji className={homeStyles.hedgehogEmoji} />
        </span>
      ) : (
        <HedgehogRunner
          className={homeStyles.hedgehogEmoji}
          isRunning={isRunning}
          onClick={handleHedgehogClick}
        />
      )}
    </div>
  );
};
