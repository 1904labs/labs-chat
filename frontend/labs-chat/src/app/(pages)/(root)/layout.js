import Navbar from "@components/Navbar";
import Sidebar from "@components/Sidebar";
import { ClientChatHistoryProvider } from "@components/ClientChatHistoryProvider";

export const metadata = {
  title: "Labs Chat",
  description: "1904Labs Chat bot",
};

export default function PagesLayout({ children }) {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <main className="flex flex-grow flex-row overflow-y-auto">
        <ClientChatHistoryProvider>
          <Sidebar />
          <div className="flex flex-1 bg-[url('/assets/office_candid_background.jpeg')] bg-cover bg-[center_top] bg-no-repeat">
            {children}
          </div>
        </ClientChatHistoryProvider>
      </main>
    </div>
  );
}
