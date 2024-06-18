import Link from "next/link"

const TextNavLink = ({ to, children }) => {
    return (
        <Link
            href={to}
            className="flex mt-4 justify-center space-x-2 align-middle cursor-pointer text-blue-500"
        >
            {children}
        </Link>
    )
}

export default TextNavLink;