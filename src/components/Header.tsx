"use client";

import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Twitter } from "lucide-react";
export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [showWithdrawMsg, setShowWithdrawMsg] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close user menu when clicking outside
  useEffect(() => {
    if (!showUserMenu) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src="/logo.svg"
                alt="Deep Protocol Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Deep Protocol
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors${
                pathname === "/" || pathname.startsWith("/ref")
                  ? " font-bold"
                  : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/pools"
              className={`text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors${
                pathname.startsWith("/pools") ? " font-bold" : ""
              }`}
            >
              Deep Aggregator
            </Link>
            <Link
              href="/careers"
              className={`text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors${
                pathname === "/careers" ? " font-bold" : ""
              }`}
            >
              Careers
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Twitter Link */}
            <a
              href="https://x.com/DeepProtocol"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
              title="Follow us on X"
            >
              <Twitter className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
            </a>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === "dark" ? (
                <svg
                  className="w-5 h-5 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user?.fullName.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.fullName.split(" ")[0]}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.fullName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {user?.walletAddress.slice(0, 6)}...
                        {user?.walletAddress.slice(-4)}
                      </p>
                      {user?.referralCode && (
                        <div className="flex items-center mt-2">
                          <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-900 dark:text-white mr-2">
                            {user.referralCode}
                          </span>
                          <button
                            onClick={() => {
                              if (user?.referralCode) {
                                const refLink = `${window.location.origin}/ref/${user.referralCode}`;
                                navigator.clipboard.writeText(refLink);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 1200);
                              }
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="Copy Referral Link"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                          {copied && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Copied link!
                            </span>
                          )}
                        </div>
                      )}
                      {/* Liquidity and Fees */}
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-xs text-gray-700 dark:text-gray-300">
                          <span>Liquidity amount:</span>
                          <span className="font-mono">0.00 SOL</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-700 dark:text-gray-300">
                          <span>Fees earned:</span>
                          <span className="font-mono">0.00 SOL</span>
                        </div>
                        <button
                          className="w-full mt-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-1.5 rounded-lg font-medium hover:opacity-90 transition-opacity text-xs"
                          onClick={() => {
                            setShowWithdrawMsg(true);
                            setTimeout(() => setShowWithdrawMsg(false), 1500);
                          }}
                        >
                          Withdraw
                        </button>
                        {showWithdrawMsg && (
                          <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                            No liquidity to withdraw.
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        router.push("/");
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/signup"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
