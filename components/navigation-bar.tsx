"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavigationBar() {
  const pathname = usePathname();

  const isAdminPage = pathname?.startsWith("/admin");
  const isLoginPage = pathname?.includes("/login");

  if (isLoginPage) {
    return null;
  }

  return (
    <nav className="bg-black shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl uppercase font-bold text-white font-heading"
          >
            Spectaculum
          </Link>

          <div className="flex gap-4">
            <Link
              href="/admin"
              className={`px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-1 text-black bg-white hover:text-gray-700
              `}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
