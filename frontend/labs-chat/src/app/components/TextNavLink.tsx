import Link from "next/link";

const TextNavLink = ({ to, children }) => {
  return (
    <Link
      href={to}
      className="mt-4 flex cursor-pointer justify-center space-x-2 align-middle text-blue-500"
    >
      {children}
    </Link>
  );
};

export default TextNavLink;
