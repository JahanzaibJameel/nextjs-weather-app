import Head from 'next/head';
import Link from 'next/link';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Weather App</title>
        <meta name="description" content="Privacy policy for Weather App - Learn how we collect, use, and protect your data." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/privacy" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-lg p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Privacy Policy
              </h1>
              
              <p className="text-gray-600 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              
              <div className="prose prose prose-gray max-w-none">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
                
                <p className="mb-4">
                  <strong>Weather Data:</strong> We collect weather information from the OpenWeatherMap API based on your search queries or geolocation coordinates. This includes current temperature, weather conditions, humidity, wind speed, and other meteorological data.
                </p>
                
                <p className="mb-4">
                  <strong>Location Data:</strong> When you use geolocation, we collect your device's GPS coordinates (latitude and longitude) to provide localized weather information. This data is only used for the current weather request and is not stored permanently.
                </p>
                
                <p className="mb-4">
                  <strong>Search History:</strong> We store your recent search queries locally in your browser to provide quick access to previously searched locations. This data is stored only on your device and is not transmitted to our servers.
                </p>
                
                <p className="mb-4">
                  <strong>Favorites:</strong> If you choose to save locations as favorites, we store these preferences locally on your device. This includes location names and coordinates for quick access to your preferred weather locations.
                </p>
                
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
                
                <p className="mb-4">
                  <strong>Weather Service:</strong> Your search queries and location coordinates are sent to the OpenWeatherMap API to retrieve current weather data. We do not store personal information with the weather service provider.
                </p>
                
                <p className="mb-4">
                  <strong>Local Storage:</strong> Search history and favorites are stored locally in your browser using localStorage. This allows the app to function without requiring server-side storage of your preferences.
                </p>
                
                <p className="mb-4">
                  <strong>Analytics:</strong> We use Sentry for error tracking and performance monitoring. This helps us identify and fix issues to improve the app experience.
                </p>
                
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Sharing and Third Parties</h2>
                
                <p className="mb-4">
                  <strong>No Personal Data Sale:</strong> We do not sell, rent, or share your personal information with third parties for marketing purposes.
                </p>
                
                <p className="mb-4">
                  <strong>Service Providers:</strong> We use OpenWeatherMap for weather data and Sentry for error tracking. These services have their own privacy policies and terms of service.
                </p>
                
                <p className="mb-4">
                  <strong>Legal Compliance:</strong> We comply with applicable data protection laws including GDPR and CCPA where applicable.
                </p>
                
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
                
                <ul className="list-disc list-inside space-y-4 text-gray-600">
                  <li className="mb-2">
                    <strong>Access:</strong> You can request a copy of all personal information we hold about you.
                  </li>
                  <li className="mb-2">
                    <strong>Correction:</strong> You can request correction of inaccurate personal information.
                  </li>
                  <li className="mb-2">
                    <strong>Deletion:</strong> You can request deletion of your personal information, subject to legal obligations.
                  </li>
                  <li className="mb-2">
                    <strong>Data Portability:</strong> You can request export of your data in a machine-readable format.
                  </li>
                  <li className="mb-2">
                    <strong>Geolocation:</strong> You can disable geolocation at any time through your browser settings.
                  </li>
                  <li className="mb-2">
                    <strong>Local Storage:</strong> You can clear your local storage (search history, favorites) at any time through your browser settings.
                  </li>
                </ul>
                
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                
                <p className="mb-4">
                  If you have questions about this privacy policy or how we handle your data, please contact us through the app or email us at privacy@weatherapp.com.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-lg p-6">
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                ← Back to Weather App
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
