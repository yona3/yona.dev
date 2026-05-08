"use client";

import { useEffect, useState } from "react";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import homeStyles from "./home.module.css";
import layoutStyles from "./layout.module.css";
import motionStyles from "./motion.module.css";

const TEXT = "Hello, I'm yona!";
const TYPE_DELAY_MS = 70;
const TYPE_START_DELAY_MS = 320;

type Props = {
  hidden?: boolean;
};

export const HelloBubble = ({ hidden = false }: Props) => {
  const isReduced = useReducedMotion();
  const [shown, setShown] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (isReduced) return;
    let interval: number | undefined;
    const start = window.setTimeout(() => {
      let i = 0;
      interval = window.setInterval(() => {
        i += 1;
        setShown(TEXT.slice(0, i));
        if (i >= TEXT.length) {
          if (interval !== undefined) window.clearInterval(interval);
          setIsTyping(false);
        }
      }, TYPE_DELAY_MS);
    }, TYPE_START_DELAY_MS);
    return () => {
      window.clearTimeout(start);
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [isReduced]);

  const className = hidden
    ? `${homeStyles.nameSpeech} ${motionStyles.bubbleOut}`
    : `${homeStyles.nameSpeech} ${motionStyles.bubbleIn}`;
  const displayedText = isReduced ? TEXT : shown;
  const shouldShowCaret = !isReduced && isTyping && !hidden;

  return (
    <>
      <span className={layoutStyles.visuallyHidden}>{TEXT}</span>
      <span aria-hidden="true" className={className}>
        <span>{displayedText}</span>
        {shouldShowCaret && (
          <span className={`${homeStyles.nameCaret} ${motionStyles.caretBlink}`} />
        )}
      </span>
    </>
  );
};
