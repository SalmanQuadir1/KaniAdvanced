import React, { useState, useEffect } from 'react';
import { 
  AiOutlineArrowLeft, 
  AiOutlineArrowRight, 
  AiOutlineReload,
  AiOutlineSearch,
  AiOutlineFilter,
  AiOutlineWarning,
  AiOutlineCheckCircle
} from 'react-icons/ai';
import { FiPackage, FiBox, FiGrid, FiAlertTriangle, FiCheck, FiX } from 'react-icons/fi';
import { MdOutlineInventory, MdOutlineLocationOn } from 'react-icons/md';
import DefaultLayout from '../../layout/DefaultLayout';

const ShopifyInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 50,
    nextPageUrl: null,
    prevPageUrl: null,
    totalItems: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    lowStockThreshold: 10,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [inventoryLevels, setInventoryLevels] = useState({});
  const [allVariantIds, setAllVariantIds] = useState([]);

  // Get access token from environment
  const accessToken = import.meta.env.VITE_SHOPIFY_ACCESS_TOKEN;

  // Helper function to parse Link header
  const parseLinkHeader = (linkHeader) => {
    if (!linkHeader) return { next: null, prev: null };
    
    const links = {};
    const parts = linkHeader.split(',');
    
    parts.forEach(part => {
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

  // Fetch inventory levels for specific items
  const fetchInventoryLevels = async (inventoryItemIds) => {
    if (!inventoryItemIds || inventoryItemIds.length === 0) return;

    try {
      // Split into chunks of 100 (Shopify limit)
      const chunkSize = 100;
      const chunks = [];
      for (let i = 0; i < inventoryItemIds.length; i += chunkSize) {
        chunks.push(inventoryItemIds.slice(i, i + chunkSize));
      }

      const allLevels = {};
      
      for (const chunk of chunks) {
        const ids = chunk.join(',');
        const response = await fetch(
          `/shopify/admin/api/2026-01/inventory_levels.json?inventory_item_ids=${ids}`,
          {
            method: 'GET',
            headers: {
              'X-Shopify-Access-Token': accessToken,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch inventory levels');
        }

        const data = await response.json();
        data.inventory_levels?.forEach(level => {
          if (!allLevels[level.inventory_item_id]) {
            allLevels[level.inventory_item_id] = [];
          }
          allLevels[level.inventory_item_id].push({
            locationId: level.location_id,
            quantity: level.available,
          });
        });
      }
      
      setInventoryLevels(allLevels);
    } catch (err) {
      console.error('Error fetching inventory levels:', err);
    }
  };

  // Fetch products to get variant IDs, then fetch inventory items
  const fetchProducts = async (url = null) => {
    setIsLoading(true);
    setError(null);

    try {
      let apiUrl;
      
      if (url) {
        // Use the URL from Link header
        const urlObj = new URL(url);
        apiUrl = `/shopify${urlObj.pathname}${urlObj.search}`;
      } else {
        // Initial request - build the URL
        const params = new URLSearchParams({
          limit: pagination.limit.toString(),
        });

        if (filters.search) {
          params.append('query', filters.search);
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
      const products = data.products || [];

      // Extract all variants from products
      const variants = [];
      products.forEach(product => {
        product.variants?.forEach(variant => {
          variants.push({
            ...variant,
            product_title: product.title,
            product_id: product.id,
          });
        });
      });

      // Now fetch inventory items for these variants
      if (variants.length > 0) {
        const variantIds = variants.map(v => v.id);
        setAllVariantIds(variantIds);
        await fetchInventoryItems(variantIds, products);
      } else {
        setInventory([]);
        setInventoryLevels({});
      }

      // Parse Link header for pagination
      const linkHeader = response.headers.get('Link');
      console.log('Link Header:', linkHeader);
      
      const parsedLinks = parseLinkHeader(linkHeader);
      console.log('Parsed Links:', parsedLinks);

      // Update pagination state
      setPagination(prev => {
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
          totalItems: prev.totalItems + products.length,
          nextPageUrl: parsedLinks.next,
          prevPageUrl: parsedLinks.previous,
        };
      });

    } catch (err) {
      setError({
        message: err.message,
        details: 'Unable to fetch products. Please check your access token and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch inventory items using variant IDs
  const fetchInventoryItems = async (variantIds, products) => {
    try {
      // Split variant IDs into chunks of 100
      const chunkSize = 100;
      const chunks = [];
      for (let i = 0; i < variantIds.length; i += chunkSize) {
        chunks.push(variantIds.slice(i, i + chunkSize));
      }

      let allInventoryItems = [];
      const allInventoryItemIds = [];

      for (const chunk of chunks) {
        const ids = chunk.join(',');
        const response = await fetch(
          `/shopify/admin/api/2026-01/inventory_items.json?ids=${ids}`,
          {
            method: 'GET',
            headers: {
              'X-Shopify-Access-Token': accessToken,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Inventory items error:', errorData);
          continue;
        }

        const data = await response.json();
        const items = data.inventory_items || [];
        allInventoryItems = [...allInventoryItems, ...items];
        items.forEach(item => allInventoryItemIds.push(item.id));
      }

      setInventory(allInventoryItems);

      // Fetch inventory levels for all inventory items
      if (allInventoryItemIds.length > 0) {
        await fetchInventoryLevels(allInventoryItemIds);
      }

    } catch (err) {
      console.error('Error fetching inventory items:', err);
      setError({
        message: 'Failed to fetch inventory items',
        details: err.message,
      });
    }
  };

  // Initial fetch on component mount
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

  // Handle page change
  const handlePageChange = (direction) => {
    if (direction === 'next' && pagination.nextPageUrl) {
      fetchProducts(pagination.nextPageUrl);
    } else if (direction === 'prev' && pagination.prevPageUrl) {
      fetchProducts(pagination.prevPageUrl);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      nextPageUrl: null,
      prevPageUrl: null,
      totalItems: 0,
    }));
    setInventoryLevels({});
    setInventory([]);
    fetchProducts();
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      nextPageUrl: null,
      prevPageUrl: null,
      totalItems: 0,
    }));
    setInventoryLevels({});
    setInventory([]);
    fetchProducts();
    setShowFilters(false);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      lowStockThreshold: 10,
    });
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      nextPageUrl: null,
      prevPageUrl: null,
      totalItems: 0,
    }));
    setInventoryLevels({});
    setInventory([]);
    fetchProducts();
    setShowFilters(false);
  };

  // Get total quantity for an item across all locations
  const getTotalQuantity = (inventoryItemId) => {
    const levels = inventoryLevels[inventoryItemId] || [];
    return levels.reduce((sum, level) => sum + level.quantity, 0);
  };

  // Get inventory status
  const getInventoryStatus = (inventoryItemId) => {
    const total = getTotalQuantity(inventoryItemId);
    const threshold = parseInt(filters.lowStockThreshold) || 10;
    
    if (total === 0) {
      return { status: 'out_of_stock', label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    } else if (total <= threshold) {
      return { status: 'low_stock', label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'in_stock', label: 'In Stock', color: 'bg-green-100 text-green-800' };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Find variant by inventory item ID
  const findVariantByInventoryItemId = (inventoryItemId) => {
    // Since we don't have direct mapping, we'll find it from the inventory items
    // The inventory item ID is the same as the variant's inventory_item_id
    return allVariantIds.find(id => id === inventoryItemId);
  };

  return (
    <DefaultLayout>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopify Inventory</h1>
            <p className="text-gray-600 mt-1">
              Manage and track all your Shopify store inventory items
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
              <AiOutlineReload className={isLoading ? 'animate-spin' : ''} size={18} />
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
                  Search Products
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search by product title..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                  />
                  <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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
                <p className="text-xs text-gray-500 mt-1">Items with stock below this will be highlighted</p>
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
        {!isLoading && inventory.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
                </div>
                <FiPackage className="text-blue-500" size={28} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Stock</p>
                  <p className="text-2xl font-bold text-green-600">
                    {inventory.filter(item => getInventoryStatus(item.id).status === 'in_stock').length}
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
                    {inventory.filter(item => getInventoryStatus(item.id).status === 'low_stock').length}
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
                    {inventory.filter(item => getInventoryStatus(item.id).status === 'out_of_stock').length}
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
          ) : inventory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FiPackage className="text-gray-300" size={64} />
              <p className="text-gray-500 mt-4">No inventory items found</p>
              <p className="text-gray-400 text-sm">Try adjusting your filters or refresh</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Total Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Locations
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Tracked
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Cost
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.map((item) => {
                    const totalStock = getTotalQuantity(item.id);
                    const status = getInventoryStatus(item.id);
                    const levels = inventoryLevels[item.id] || [];
                    
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">
                            {item.title || 'Unnamed Item'}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {item.id}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-600 font-mono">
                            {item.sku || '-'}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className={`text-sm font-semibold ${
                            status.status === 'out_of_stock' ? 'text-red-600' :
                            status.status === 'low_stock' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {totalStock}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            {levels.map((level, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">Location {level.locationId}</span>
                                <span className="font-medium">{level.quantity}</span>
                              </div>
                            ))}
                            {levels.length === 0 && (
                              <span className="text-xs text-gray-400">No stock</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {item.tracked ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <AiOutlineCheckCircle size={16} />
                              <span className="text-sm">Yes</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-gray-400">
                              <FiX size={16} />
                              <span className="text-sm">No</span>
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {item.cost ? `$${parseFloat(item.cost).toFixed(2)}` : '-'}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(item.updated_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && inventory.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between flex-wrap gap-2">
              <div className="text-sm text-gray-600">
                Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of{' '}
                {pagination.totalItems} items
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange('prev')}
                  disabled={!pagination.prevPageUrl}
                  className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <AiOutlineArrowLeft size={16} />
                </button>
                <span className="text-sm text-gray-700">
                  Page {pagination.currentPage}
                </span>
                <button
                  onClick={() => handlePageChange('next')}
                  disabled={!pagination.nextPageUrl}
                  className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
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