import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@components/Navbar";
import Sidebar from "@components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Labs Chat",
  description: "1904Labs Chat bot",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen flex-col">
          <Navbar />
          <main className="flex flex-grow flex-row overflow-y-auto">
            <Sidebar />
            <div className="flex flex-1 bg-[url('/assets/office_candid_background.jpeg')] bg-cover bg-[center_top] bg-no-repeat">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
