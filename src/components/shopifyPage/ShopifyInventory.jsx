import React, { useState, useEffect } from 'react';
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineReload,
  AiOutlineSearch,
  AiOutlineFilter,
  AiOutlineWarning,
  AiOutlineCheckCircle,
} from 'react-icons/ai';
import {
  FiPackage,
  FiAlertTriangle,
  FiCheck,
  FiX,
} from 'react-icons/fi';
import DefaultLayout from '../../layout/DefaultLayout';

// Hardcoded location IDs and names from your provided data
const LOCATION_1_ID = 53895563;
const LOCATION_1_NAME = 'C-65 Basement';
const LOCATION_2_ID = 60969287760;
const LOCATION_2_NAME = 'Gulshan Annex';

const ShopifyInventory = () => {
  // --- State ---
  const [products, setProducts] = useState([]); // Full product objects with variants
  const [levelsMap, setLevelsMap] = useState({}); // { inventory_item_id: { location_id: quantity } }
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 50,
    nextPageUrl: null,
    prevPageUrl: null,
  });

  const [filters, setFilters] = useState({
    search: '',
    lowStockThreshold: 10,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Environment token
  const accessToken = import.meta.env.VITE_SHOPIFY_ACCESS_TOKEN;

  // --- Helper: Parse Link Header for Pagination ---
  const parseLinkHeader = (linkHeader) => {
    if (!linkHeader) return { next: null, prev: null };

    const links = {};
    const parts = linkHeader.split(',');

    parts.forEach((part) => {
      const section = part.trim();
      const urlMatch = section.match(/<([^>]*)>/);
      const relMatch = section.match(/rel="([^"]*)"/);

      if (urlMatch && relMatch) {
        const url = urlMatch[1];
        const rel = relMatch[1];
        links[rel] = url;
      }
    });

    return {
      next: links.next || null,
      previous: links.previous || null,
    };
  };

  // --- Helper: Get quantities for a specific inventory item ID ---
  const getQuantities = (inventoryItemId) => {
    if (!inventoryItemId) return { loc1: 0, loc2: 0, total: 0 };
    const locMap = levelsMap[inventoryItemId] || {};
    const loc1 = locMap[LOCATION_1_ID] || 0;
    const loc2 = locMap[LOCATION_2_ID] || 0;
    return { loc1, loc2, total: loc1 + loc2 };
  };

  // --- Helper: Get inventory status based on total stock ---
  const getStatus = (total) => {
    const threshold = parseInt(filters.lowStockThreshold) || 10;
    if (total === 0) {
      return {
        status: 'out_of_stock',
        label: 'Out of Stock',
        color: 'bg-red-100 text-red-800',
      };
    } else if (total <= threshold) {
      return {
        status: 'low_stock',
        label: 'Low Stock',
        color: 'bg-yellow-100 text-yellow-800',
      };
    } else {
      return {
        status: 'in_stock',
        label: 'In Stock',
        color: 'bg-green-100 text-green-800',
      };
    }
  };

  // --- Main Fetch Function ---
  const fetchProducts = async (url = null) => {
    setIsLoading(true);
    setError(null);

    try {
      let apiUrl;

      if (url) {
        // If we have a pagination URL from the Link header, use it directly
        const urlObj = new URL(url);
        apiUrl = `/shopify${urlObj.pathname}${urlObj.search}`;
      } else {
        // Build the initial request URL
        const params = new URLSearchParams({
          limit: pagination.limit.toString(),
          fields: 'id,title,variants', // Only fetch what we need
        });

        // Add search filter (uses Shopify's 'title' parameter for simple search)
        if (filters.search) {
          params.append('title', filters.search);
        }

        apiUrl = `/shopify/admin/api/2026-01/products.json?${params.toString()}`;
      }

      console.log('Fetching products from:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors || 'Failed to fetch products');
      }

      const data = await response.json();
      const productsData = data.products || [];

      // --- Step 1: Collect all inventory_item_ids from the fetched variants ---
      const inventoryItemIds = [];
      productsData.forEach((product) => {
        product.variants?.forEach((variant) => {
          if (variant.inventory_item_id) {
            inventoryItemIds.push(variant.inventory_item_id);
          }
        });
      });

      // --- Step 2: Fetch inventory levels for these items for BOTH locations ---
      let allLevels = [];
      if (inventoryItemIds.length > 0) {
        // Shopify allows up to 100 inventory_item_ids per request
        const chunkSize = 100;
        const chunks = [];
        for (let i = 0; i < inventoryItemIds.length; i += chunkSize) {
          chunks.push(inventoryItemIds.slice(i, i + chunkSize));
        }

        for (const chunk of chunks) {
          const idsParam = chunk.join(',');
          const levelResponse = await fetch(
            `/shopify/admin/api/2026-01/inventory_levels.json?inventory_item_ids=${idsParam}&location_ids=${LOCATION_1_ID},${LOCATION_2_ID}`,
            {
              method: 'GET',
              headers: {
                'X-Shopify-Access-Token': accessToken,
                'Content-Type': 'application/json',
              },
            }
          );

          if (!levelResponse.ok) {
            const errorData = await levelResponse.json();
            console.error('Inventory levels error:', errorData);
            continue; // Skip this chunk if it fails, but try the rest
          }

          const levelData = await levelResponse.json();
          allLevels = allLevels.concat(levelData.inventory_levels || []);
        }
      }

      // --- Step 3: Build a map for quick lookup: { inventory_item_id: { location_id: quantity } } ---
      const map = {};
      allLevels.forEach((level) => {
        const itemId = level.inventory_item_id;
        const locId = level.location_id;
        if (!map[itemId]) map[itemId] = {};
        map[itemId][locId] = level.available || 0; // 'available' is the sellable quantity
      });

      // --- Step 4: Update state ---
      setProducts(productsData);
      setLevelsMap(map);

      // --- Step 5: Parse pagination Link header ---
      const linkHeader = response.headers.get('Link');
      console.log('Link Header:', linkHeader);
      const parsedLinks = parseLinkHeader(linkHeader);

      setPagination((prev) => {
        let newPage = prev.currentPage;
        if (url && parsedLinks.next) {
          newPage = prev.currentPage + 1;
        } else if (url && parsedLinks.previous) {
          newPage = prev.currentPage - 1;
        } else if (!url) {
          newPage = 1;
        }
        return {
          ...prev,
          currentPage: newPage,
          nextPageUrl: parsedLinks.next,
          prevPageUrl: parsedLinks.previous,
        };
      });
    } catch (err) {
      console.error('Fetch error:', err);
      setError({
        message: err.message || 'An unexpected error occurred',
        details: 'Please check your access token, network, or try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Initial Fetch ---
  useEffect(() => {
    if (accessToken && accessToken !== 'undefined') {
      fetchProducts();
    } else {
      setError({
        message: 'Access token not configured',
        details: 'Please add VITE_SHOPIFY_ACCESS_TOKEN to your .env file',
      });
    }
  }, []);

  // --- Handlers ---
  const handlePageChange = (direction) => {
    if (direction === 'next' && pagination.nextPageUrl) {
      fetchProducts(pagination.nextPageUrl);
    } else if (direction === 'prev' && pagination.prevPageUrl) {
      fetchProducts(pagination.prevPageUrl);
    }
  };

  const handleRefresh = () => {
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
      nextPageUrl: null,
      prevPageUrl: null,
    }));
    setProducts([]);
    setLevelsMap({});
    fetchProducts();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
      nextPageUrl: null,
      prevPageUrl: null,
    }));
    setProducts([]);
    setLevelsMap({});
    fetchProducts();
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      lowStockThreshold: 10,
    });
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
      nextPageUrl: null,
      prevPageUrl: null,
    }));
    setProducts([]);
    setLevelsMap({});
    fetchProducts();
    setShowFilters(false);
  };

  // --- Compute Stats (based on variants, not products) ---
  const getStats = () => {
    let totalVariants = 0;
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    products.forEach((product) => {
      product.variants?.forEach((variant) => {
        if (!variant.inventory_item_id) return;
        totalVariants++;
        const { total } = getQuantities(variant.inventory_item_id);
        const status = getStatus(total).status;
        if (status === 'in_stock') inStock++;
        else if (status === 'low_stock') lowStock++;
        else if (status === 'out_of_stock') outOfStock++;
      });
    });

    return { totalVariants, inStock, lowStock, outOfStock };
  };

  const stats = getStats();

  // --- Render ---
  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Shopify Inventory
              </h1>
              <p className="text-gray-600 mt-1">
                Product variants with stock levels across both locations
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
              >
                <AiOutlineFilter size={18} />
                <span>Filters</span>
              </button>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 disabled:opacity-50"
              >
                <AiOutlineReload
                  className={isLoading ? 'animate-spin' : ''}
                  size={18}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search by Product Title
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="e.g. T-Shirt"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                    />
                    <AiOutlineSearch
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    value={filters.lowStockThreshold}
                    onChange={handleFilterChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Items with total stock below this will be highlighted
                  </p>
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={applyFilters}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex-1"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats Summary */}
          {!isLoading && products.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Variants</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalVariants}
                    </p>
                  </div>
                  <FiPackage className="text-blue-500" size={28} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">In Stock</p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.inStock}
                    </p>
                  </div>
                  <FiCheck className="text-green-500" size={28} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Low Stock</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {stats.lowStock}
                    </p>
                  </div>
                  <FiAlertTriangle className="text-yellow-500" size={28} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-600">
                      {stats.outOfStock}
                    </p>
                  </div>
                  <FiX className="text-red-500" size={28} />
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AiOutlineWarning className="text-red-500 mt-0.5" size={24} />
                <div>
                  <p className="text-red-800 font-medium">{error.message}</p>
                  {error.details && (
                    <p className="text-red-600 text-sm mt-1">{error.details}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Inventory Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-600">Loading inventory...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <FiPackage className="text-gray-300" size={64} />
                <p className="text-gray-500 mt-4">No products found</p>
                <p className="text-gray-400 text-sm">
                  Try adjusting your filters or refresh the page.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Product / Variant
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        SKU
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        {LOCATION_1_NAME}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        {LOCATION_2_NAME}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <React.Fragment key={product.id}>
                        {product.variants?.map((variant) => {
                          // Skip variants without an inventory_item_id (shouldn't happen, but safety)
                          if (!variant.inventory_item_id) return null;

                          const { loc1, loc2, total } = getQuantities(
                            variant.inventory_item_id
                          );
                          const status = getStatus(total);

                          return (
                            <tr
                              key={variant.id}
                              className="hover:bg-gray-50 transition"
                            >
                              <td className="px-4 py-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.title}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {variant.title || 'Default Title'}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-600 font-mono">
                                  {variant.sku || '-'}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                {loc1}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                {loc2}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div
                                  className={`text-sm font-semibold ${
                                    status.status === 'out_of_stock'
                                      ? 'text-red-600'
                                      : status.status === 'low_stock'
                                      ? 'text-yellow-600'
                                      : 'text-green-600'
                                  }`}
                                >
                                  {total}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${status.color}`}
                                >
                                  {status.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && products.length > 0 && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between flex-wrap gap-2">
                <div className="text-sm text-gray-600">
                  Page {pagination.currentPage}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange('prev')}
                    disabled={!pagination.prevPageUrl}
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
                  >
                    <AiOutlineArrowLeft size={16} />
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange('next')}
                    disabled={!pagination.nextPageUrl}
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
                  >
                    Next
                    <AiOutlineArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ShopifyInventory;