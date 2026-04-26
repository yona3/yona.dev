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
        d="M13 37.5c0-13.3 12.2-24 25.8-24 8.2 0 14.8 5.6 14.8 13.1 0 16.3-12.8 25.9-28.2 25.9C17.6 52.5 13 46.7 13 37.5Z"
        fill="#D7C4AE"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2.25"
      />
      <path
        d="M14.3 35.6c2-6.4 7.2-13.2 14.5-17.5 1.7 2.1 2.8 4.6 3.1 7.4 2.2-3 4.8-5.3 7.6-7 1.2 2.3 1.8 4.8 1.8 7.4 2.5-2.4 5.1-3.9 7.9-4.7 2.6 2.5 4.2 5.9 4.2 9.9 0 3.4-.7 6.5-2 9.3-8.6-2.7-18.6-4.3-37.1-4.8Z"
        fill="#7F715F"
        opacity="0.9"
      />
      <path
        d="M9.5 37.4c4.2-4.6 11.6-5 15.4-.9 3.5 3.8 2.9 10.6-1.3 14.4-4.5.7-9.8-4.3-12-8.7-.7-1.4-1.5-3.3-2.1-4.8Z"
        fill="#F1E5D4"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2.25"
      />
      <path
        d="M8 37.5c-2.1-1.2-2-3.2.1-4 2-.8 4.6.6 5 2.7"
        fill="#5C4434"
      />
      <path
        d="M21.2 37.2c0 1.1-.8 1.9-1.8 1.9s-1.8-.8-1.8-1.9.8-1.9 1.8-1.9 1.8.8 1.8 1.9Z"
        fill="#4B3A2F"
      />
      <path
        d="M24.2 45.7c-2.8 2.4-7.6 2.4-10.5-.3"
        fill="none"
        stroke="#A78F77"
        strokeLinecap="round"
        strokeWidth="2.25"
      />
      <path
        d="M28 52c-1.2 2.3-4.2 2.5-5.6.8M41.5 50.5c-.9 2.5-3.9 3.2-5.5 1.7"
        fill="none"
        stroke="#7F715F"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
};
