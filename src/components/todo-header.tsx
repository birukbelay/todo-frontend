"use client";

import { useAuth } from "@/lib/state/context/jotai-auth";
import { Tooltip } from "antd";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function TodoHeader() {
  const router = useRouter();
  const {logout} = useAuth()

  const { user } = useAuth();
  const handleLogout = async () => {
    await logout()
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 text-white p-1.5 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-800">TodoMaster</span>
          </div>
        </Link>

        {/* User info and logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-gray-800">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
          </div>

          <Tooltip title="Logout">
            <button
              onClick={handleLogout}
              className="ml-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
