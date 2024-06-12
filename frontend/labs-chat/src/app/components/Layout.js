import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <main className="flex flex-grow flex-row overflow-y-auto">
        <Sidebar />
        <div className="flex flex-1 bg-[url('/assets/office_candid_background.jpeg')] bg-cover bg-[center_top] bg-no-repeat">
          {children}
        </div>
      </main>
    </div>
  );
}
