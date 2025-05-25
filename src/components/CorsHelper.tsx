import React, { useState } from 'react';
import { AlertTriangle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

export const CorsHelper: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <AlertTriangle className="h-4 w-4 text-gray-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-400">
            Having CORS Issues?
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <p className="text-gray-400 text-sm">
            If you're seeing CORS errors, here are some solutions:
          </p>

          <div className="space-y-3">
            <div className="bg-gray-800 p-3 rounded border border-gray-600">
              <h4 className="font-medium text-white mb-2">Option 1: Browser Extension (Easiest)</h4>
              <p className="text-sm text-gray-300 mb-2">
                Install a CORS browser extension to disable CORS for development:
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Chrome: "CORS Unblock" or "Disable CORS"</li>
                <li>• Firefox: "CORS Everywhere"</li>
                <li>• Enable the extension and refresh the page</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-3 rounded border border-gray-600">
              <h4 className="font-medium text-white mb-2">Option 2: Chrome with Disabled Security</h4>
              <p className="text-sm text-gray-300 mb-2">
                Launch Chrome with disabled web security (for development only):
              </p>
              <code className="text-xs bg-gray-700 p-2 rounded block text-gray-300">
                chrome --disable-web-security --disable-features=VizDisplayCompositor --user-data-dir=/tmp/chrome_dev
              </code>
            </div>

            <div className="bg-gray-800 p-3 rounded border border-gray-600">
              <h4 className="font-medium text-white mb-2">Option 3: Use Proxy (Already Configured)</h4>
              <p className="text-sm text-gray-300">
                This app is configured to use a development proxy that should bypass CORS issues.
                If you're still seeing errors, the proxy might not be working correctly.
              </p>
            </div>

            <div className="bg-gray-800 p-3 rounded border border-gray-600">
              <h4 className="font-medium text-white mb-2">Option 4: Contact API Provider</h4>
              <p className="text-sm text-gray-300">
                Ask JobTread to whitelist your domain (localhost:5173) in their CORS policy.
              </p>
            </div>
          </div>

          <div className="bg-red-900/30 border border-red-600 rounded p-3">
            <p className="text-sm text-red-200">
              <strong>Security Note:</strong> Only use CORS-disabling solutions for development.
              Never disable CORS in production environments.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
