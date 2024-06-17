"use client";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import React from "react";

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
        type="button"
        onClick={handleDropdown}
      >
        <EllipsisVerticalIcon className="h-6 w-6" />
      </button>

      {isOpen && (
        <div
          id="dropdown"
          className="absolute right-0 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700"
        >
          <ul
            className="flex w-full py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            <li className="flex w-full">
              <button
                onClick={handleClientSignOut}
                className="flex-grow px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Sign out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NavbarDropdown;
