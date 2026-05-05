import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  useEffect(() => {
    // Log 404 errors to monitoring
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', '404_error', {
        page_path: window.location.pathname,
        referrer: document.referrer,
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Page Not Found - Weather App</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
        <meta name="robots" content="noindex" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h16m-7 4h7m-7-4h7"
                    />
                  </svg>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                404 - Page Not Found
              </h1>
              
              <p className="text-gray-600 mb-8">
                The weather page you're looking for doesn't exist or has been moved.
              </p>
              
              <div className="space-y-4">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Go Home
                </Link>
                
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
