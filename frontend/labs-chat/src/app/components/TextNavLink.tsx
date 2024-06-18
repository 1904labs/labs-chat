import Link from "next/link";

const TextNavLink = ({ to, border = false, children }) => {
  return (
    <Link
      href={to}
      className={`flex mt-4 ${border && 'border-solid border-blue-500 border p-2 rounded-lg'} cursor-pointer w-full align-middle justify-center space-x-2 text-blue-500 hover:text-blue-800`}
    >
      {children}
    </Link>
  );
};

export default TextNavLink;
