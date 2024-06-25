import Link from "next/link";

interface TextNavLinkProps {
  to: string;
  border?: boolean;
  LeadingIcon?: React.FC<any>;
  children: React.ReactNode;
}

const TextNavLink = ({
  to,
  border = false,
  LeadingIcon,
  children,
}: TextNavLinkProps) => {
  return (
    <Link
      href={to}
      className={`mt-4 flex max-w-60 space-x-2 text-sm ${border ? "border border-solid border-form-primary bg-gradient-to-r from-form-primary from-45% to-transparent to-55% bg-3x-wide bg-right p-2 transition-all duration-500 hover:bg-left hover:text-form-primary-contrast" : "hover:text-form-primary-hover"} m-auto cursor-pointer items-center justify-center text-form-primary`}
    >
      {LeadingIcon && <LeadingIcon className="h-8 w-8" />}
      {children}
    </Link>
  );
};

export default TextNavLink;
