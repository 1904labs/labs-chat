import Link from "next/link";

const TextNavLink = ({ to, border = false, children }) => {
  return (
    <Link
      href={to}
      className={`mt-4 flex ${border && "rounded-lg border border-solid border-blue-500 p-2"} w-full cursor-pointer justify-center space-x-2 align-middle text-blue-500 hover:text-blue-800`}
    >
      {children}
    </Link>
  );
};

export default TextNavLink;
