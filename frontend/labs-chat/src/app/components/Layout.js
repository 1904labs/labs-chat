'use client';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';

export default function Layout({ children }) {
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <main className="flex flex-row overflow-y-auto flex-grow">
                <Sidebar/>
                <div className="flex flex-1 bg-[url('/assets/office_candid_background.jpeg')] bg-no-repeat bg-cover bg-[center_top]">
                    {children}
                </div>
            </main>
        </div>
    );
}