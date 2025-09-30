'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  poolName: string;
}

export default function ComingSoonModal({ isOpen, onClose, poolName }: ComingSoonModalProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  if (!isOpen) return null;

  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-8 border border-gray-200 dark:border-gray-700">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Coming Soon! 🚀
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            Deep Protocol liquidity deposits are currently being built.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            We're working hard to bring you seamless liquidity provisioning for <span className="font-semibold text-purple-600 dark:text-purple-400">{poolName}</span> and all Raydium pools.
          </p>
        </div>

        {/* Features Preview */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 mb-8 border border-purple-200 dark:border-purple-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            What's Coming:
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700 dark:text-gray-300">One-click liquidity deposits</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700 dark:text-gray-300">Automated yield tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700 dark:text-gray-300">Smart contract integration</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700 dark:text-gray-300">Real-time portfolio analytics</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          {!isAuthenticated ? (
            <>
              <button
                onClick={handleSignUp}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Sign Up for Early Access
              </button>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Join the waitlist and be the first to know when deposits go live!
              </p>
            </>
          ) : (
            <>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-green-900 dark:text-green-300">
                    You're on the waitlist! 🎉
                  </span>
                </div>
                <p className="text-xs text-green-700 dark:text-green-400 mt-2">
                  We'll notify you as soon as deposits are available.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Continue Browsing
              </button>
            </>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            In the meantime, you can explore pools and track opportunities.
          </p>
        </div>
      </div>
    </div>
  );
}
