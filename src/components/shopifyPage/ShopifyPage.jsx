import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineShoppingCart, AiOutlineCloudServer } from 'react-icons/ai';
import { BiKey } from 'react-icons/bi';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import DefaultLayout from '../../layout/DefaultLayout';

const ShopifyPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // Pre-filled store details (just for display)
  const storeDetails = {
    storeName: 'kashmir-loom',
    // storeUrl: 'https://kashmir-loom.myshopify.com',
    storeUrl:
      'https://kashmir-loom.myshopify.com/admin/api/2026-04/products.json',
    apiVersion: '2026-04',
  };

  // Only the access token is editable
  const [accessToken, setAccessToken] = useState('');

  const validateForm = () => {


    if (!accessToken.trim()) {
      setError({ message: 'Access token is required' });
      return false;
    }
    if (!accessToken.startsWith('shp')) {
      setError({
        message:
          'Invalid access token format. Token should start with "shp"',
      });
      return false;
    }
    return true;
  };

  const testConnection = async () => {
    setError(null);
    setResponse(null);


    if (!validateForm()) return;

    setIsLoading(true);

    try {
      
      // GET API endpoint to test connection
      const apiEndpoint = `${storeDetails.storeUrl}`;

      const response = await fetch('/shopify/admin/api/2026-01/orders.json?status=any&limit=250', {
        
        method: 'GET',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',

          'access-control-allow-origin': '*',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors || 'Connection failed');
      }

      setResponse({
        success: true,
        message: `✅ Successfully connected to ${data.shop.name}!`,
        shop: data.shop,
      });
    } catch (err) {
      setError({
        message: err.message,
        details:
          'Unable to connect to Shopify store. Please check your access token.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-full">
                <AiOutlineShoppingCart size={32} className="text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Shopify Integration
            </h1>
            <p className="text-gray-600">
              Connect your Shopify store to Craft-Flow ERP
            </p>
          </div>

          {/* Main Form */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 space-y-6">
              {/* Store Details - Read Only Display */}
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Store Information
                  </h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Store Name:</span>
                      <span className="font-medium text-gray-800">
                        {storeDetails.storeName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Store URL:</span>
                      <span className="font-medium text-gray-800">
                        {storeDetails.storeUrl}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">API Version:</span>
                      <span className="font-medium text-gray-800">
                        {storeDetails.apiVersion}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Access Token Input */}
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-2">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <BiKey className="text-purple-500" size={24} />
                    Authentication
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Token <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      placeholder="shp_xxxxxxxxxxxxxxxxxxxxxxxx"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-mono"
                      required
                    />
                    <BiKey
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Your Shopify private app access token (starts with shp)
                  </p>
                </div>
              </div>

              {/* Test Connection Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={testConnection}
                  disabled={isLoading || !accessToken}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Testing Connection...</span>
                    </>
                  ) : (
                    <>
                      <AiOutlineCloudServer size={20} />
                      <span>Test Shopify Connection</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Response/Error Messages */}
            {response && response.success && (
              <div className="mx-6 mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 mt-0.5" size={24} />
                  <div className="flex-1">
                    <p className="text-green-800 font-medium">
                      {response.message}
                    </p>
                    {response.shop && (
                      <div className="mt-2 text-sm text-green-700 space-y-1">
                        <p>📧 Email: {response.shop.email}</p>
                        <p>🌐 Domain: {response.shop.domain}</p>
                        <p>💼 Plan: {response.shop.plan_name}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mx-6 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <FiAlertCircle className="text-red-500 mt-0.5" size={24} />
                  <div className="flex-1">
                    <p className="text-red-800 font-medium">{error.message}</p>
                    {error.details && (
                      <p className="text-red-600 text-sm mt-1">
                        {error.details}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Help Section */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                How to get your Access Token:
              </h3>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Go to Shopify Admin → Apps → Develop apps</li>
                <li>Click "Create an app" (private app)</li>
                <li>
                  Enable Admin API access with <strong>read_shop</strong>{' '}
                  permission
                </li>
                <li>Click "Install app" and copy the Admin API access token</li>
                <li>Paste the token above (starts with shp)</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ShopifyPage;
