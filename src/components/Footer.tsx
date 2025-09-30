"use client";

import Link from "next/link";
import { Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
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
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md">
              Solana's AI-powered liquidity pool aggregator. Providing liquidity has never been easier.
            </p>
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Contact
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                support@deep-protocol.fun
                <br />
                info@deep-protocol.fun
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:text-right">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://x.com/DeepProtocol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  <span>Follow us on X</span>
                </a>
              </li>
              <li>
                <Link
                  href="/pools"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Deep Aggregator
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Deep Protocol. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}