import React from "react";
import Image from "next/image";
import logo from "@images/1904labsFull_lightBG.svg";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col bg-white bg-[center_top] lg:bg-[url('/assets/office_candid_background.jpeg')] lg:bg-cover lg:bg-no-repeat">
      <main className="flex h-full w-full flex-row">
        <div className="flex h-full w-full flex-col bg-white bg-opacity-95 lg:w-2/3">
          <nav className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center justify-start">
              <Image src={logo} alt="1904labs" width="200" />
            </div>
          </nav>
          <div className="flex h-full w-full items-center">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
