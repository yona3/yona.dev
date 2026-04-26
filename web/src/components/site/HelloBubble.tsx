"use client";

import { useEffect, useState } from "react";

import styles from "./site.module.css";

const TEXT = "Hello, I'm yona!";
const TYPE_DELAY_MS = 70;
const TYPE_START_DELAY_MS = 320;

type Props = {
  hidden?: boolean;
};

export const HelloBubble = ({ hidden = false }: Props) => {
  const [shown, setShown] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const isReduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (isReduceMotion) {
      const fillIn = window.setTimeout(() => {
        setShown(TEXT);
        setIsTyping(false);
      }, 0);
      return () => window.clearTimeout(fillIn);
    }
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
  }, []);

  const className = hidden
    ? `${styles.nameSpeech} ${styles.nameSpeechHidden}`
    : styles.nameSpeech;

  return (
    <>
      <span className={styles.visuallyHidden}>{TEXT}</span>
      <span aria-hidden="true" className={className}>
        <span>{shown}</span>
        {isTyping && !hidden && <span className={styles.nameCaret} />}
      </span>
    </>
  );
};
