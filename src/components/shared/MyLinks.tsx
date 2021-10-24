import Link from "next/link";

export const MyLinks = () => {
  return (
    <ul className="flex space-x-1 text-sm text-gray-600">
      <li className="hover:text-gray-400 underline transition">
        <a
          href="http://github.com/yona3"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </li>
      <span>・</span>
      <li className="hover:text-gray-400 underline transition">
        <a
          href="http://twitter.com/yonah6g"
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter
        </a>
      </li>
      <span>・</span>
      <li className="hover:text-gray-400 underline transition">
        <Link href="/">
          <a>yona.dev</a>
        </Link>
      </li>
    </ul>
  );
};
