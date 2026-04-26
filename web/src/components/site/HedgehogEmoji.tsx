type Props = {
  className?: string;
};

export const HedgehogEmoji = ({ className }: Props) => {
  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      viewBox="0 0 64 64"
    >
      <path
        d="M13 38.4c0-12.7 11.6-22.9 25.2-22.9 9.6 0 16.4 6.3 16.4 14.8 0 13.9-11.9 22.4-28.2 22.4C18 52.7 13 47 13 38.4Z"
        fill="#D8C4AB"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2.25"
      />
      <path
        d="M16 36.2c2.1-7.1 7.6-13.8 15-17.6l2 8.1 4.6-9.6 2.2 10.1 6-8 1 9.6 6.2-4.4c1.3 2.2 2 4.9 2 7.9 0 3.5-.8 6.7-2.4 9.5-9-3-19.6-5-36.6-5.6Z"
        fill="#6F6254"
        opacity="0.9"
      />
      <path
        d="M8.8 38.3c4-5 11.9-5.6 16-.9 3.8 4.3 3 10.6-1.7 13.8-4.8.4-9.8-3.8-12.2-8.5-.7-1.3-1.4-2.8-2.1-4.4Z"
        fill="#F2E5D2"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2.25"
      />
      <path
        d="M8.5 38c-2.5-1-2.8-3.1-.6-4.2 2.4-1.2 5.2.1 5.6 2.5"
        fill="#4C392E"
      />
      <path
        d="M22.2 37.2c0 1.2-.9 2.1-2 2.1s-2-.9-2-2.1.9-2.1 2-2.1 2 .9 2 2.1Z"
        fill="#4B3A2F"
      />
      <path
        d="M26 45.3c-2.9 2.7-8.2 2.7-11.6-.2"
        fill="none"
        stroke="#A78F77"
        strokeLinecap="round"
        strokeWidth="2.25"
      />
      <path
        d="M27.8 52c-1.2 2.3-4.2 2.6-5.8.8M42 50.7c-1 2.4-4 3.1-5.6 1.5"
        fill="none"
        stroke="#6F6254"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
};
