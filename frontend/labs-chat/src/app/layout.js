import { Inter } from "next/font/google";
import "./globals.css";
import AmplifyClientProvider from "@components/AmplifyClientProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Labs Chat",
  description: "1904Labs Chat bot",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AmplifyClientProvider />
        {children}
      </body>
    </html>
  );
}
