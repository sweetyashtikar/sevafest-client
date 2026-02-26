"use client";

import {NotificationForm, NotificationTable} from "@/components/admin/Notification"

export default function NotificationPage() {
 
  const notificationData = [
    { users: "All Users", title: "Hi Groc", description: "Testing", date: "02-May-2025 12:39:31" },
    { users: "All Users", title: "Hi Groc", description: "Testing", date: "02-May-2025 12:39:04" },
    { users: "All Users", title: "Hi Groc", description: "Testing", date: "02-May-2025 12:38:37" },
    { users: "All Users", title: "Hi Groc", description: "Testing", date: "02-May-2025 12:38:09" },
    { 
      users: "Lorem Ipsum", 
      title: "Lorem Ipsum", 
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s", 
      date: "13-Mar-2025 12:48:16" 
    },
  ];

  return (
    <div className="p-6 bg-[#f8f9fa] min-h-screen font-sans">
      <div className="max-w-[1600px] mx-auto">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">Notification</h1>
          <nav className="text-xs text-gray-400">
            <span className="hover:text-orange-600 cursor-pointer">Home</span> / 
            <span className="text-orange-600 ml-1 font-semibold underline decoration-orange-200 underline-offset-4">Notification</span>
          </nav>
        </div>

        {/* Responsive Grid Layout */}
        <div className="flex flex-col xl:flex-row gap-8 items-start">
          <NotificationForm />
          <NotificationTable data={notificationData} />
        </div>

        {/* Footer Section */}
        <footer className="mt-16 border-t border-gray-200 pt-6 text-center text-[11px] text-gray-400">
          Copyright © 2026. Developed By <span className="text-orange-600 font-bold hover:underline cursor-pointer">Appzeto - 10 Minute App</span>
        </footer>
      </div>
    </div>
  );
}