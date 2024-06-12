import React from 'react';
import { CogIcon, EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import logo from '../images/1904labsFull_lightBG.svg';

const Navbar = () => {
    return (
        <nav className="bg-white flex items-center justify-between px-4 py-2 drop-shadow-sm shadow-sm">
            <div className="flex items-center justify-start">
                <Image src={logo} alt="1904labs" width="200" />
            </div>
            <div className="flex items-center">
                <CogIcon className="h-6 w-6 mr-4" />
                <EllipsisVerticalIcon className="h-6 w-6" />
            </div>
        </nav>
    );
};

export default Navbar;