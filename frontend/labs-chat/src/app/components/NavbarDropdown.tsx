"use client";
import { handleSignOut } from "@/helpers/cognito-actions";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import React from 'react';

const NavbarDropdown = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = React.useState(false);

    const handleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClientSignOut = async () => {
        setIsOpen(false);
        await signOut();
        router.push("/auth/login");
    };

    return (
        <div className="relative">
            <button
                id="dropdownDefaultButton"
                data-dropdown-toggle="dropdown"
                type="button"
                onClick={handleDropdown}
            >
                <EllipsisVerticalIcon className="h-6 w-6" />
            </button>

            {isOpen &&
                <div id="dropdown" className="z-10 absolute right-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul className="py-2 flex w-full text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                        <li className="flex w-full">
                            <button onClick={handleClientSignOut} className="flex-grow text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                Sign out
                            </button>
                        </li>
                    </ul>
                </div>
            }
        </div>
    )
}

export default NavbarDropdown;