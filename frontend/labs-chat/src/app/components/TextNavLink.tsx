import Link from "next/link";

const TextNavLink = ({ to, border = false, children }) => {
  return (
    <Link
      href={to}
      className={`mt-4 flex max-w-60 text-sm ${border && "rounded-lg border border-solid border-form-primary p-2"} m-auto max-w-80 cursor-pointer justify-center space-x-2 align-middle text-form-primary hover:text-form-primary-hover`}
    >
      {children}
    </Link>
  );
};

export default TextNavLink;
