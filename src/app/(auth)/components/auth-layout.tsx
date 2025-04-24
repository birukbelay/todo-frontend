import type React from "react";

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function AuthLayout({ title, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-blue-400/10 to-purple-500/10"></div>

          <div className="px-8 pt-10 pb-8">
            <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
              {title}
            </h2>
            <p className="mb-8 text-center text-gray-600"></p>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
