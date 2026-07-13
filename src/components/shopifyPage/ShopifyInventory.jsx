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
import { FiPackage, FiAlertTriangle, FiCheck, FiX } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DefaultLayout from '../../layout/DefaultLayout';
import { useSelector } from 'react-redux';

// Hardcoded location IDs and names from your provided data
const LOCATION_1_ID = 53895563;
const LOCATION_1_NAME = 'C-65, Basement, Nizamuddin East';
const LOCATION_2_ID = 60969287760;
const LOCATION_2_NAME = 'Gulshan Annex, Srinagar';

// Map your inventory location names to Shopify location IDs
const LOCATION_MAPPING = {
  'Gulshan Annex, Srinagar': LOCATION_2_ID,
  'C-65, Basement, Nizamuddin East': LOCATION_1_ID,
};

const ShopifyInventory = () => {
  // --- State ---
  const [products, setProducts] = useState([]);
  const [levelsMap, setLevelsMap] = useState({});
  const [inventoryData, setInventoryData] = useState([]);
  const [filteredInventoryData, setFilteredInventoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);
  const [syncingItems, setSyncingItems] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);

  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;

  // Bulk sync state
  const [bulkSyncProgress, setBulkSyncProgress] = useState({
    isRunning: false,
    total: 0,
    completed: 0,
    failed: 0,
    current: '',
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 50,
    nextPageUrl: null,
    prevPageUrl: null,
  });

  const [filters, setFilters] = useState({
    search: '',
    lowStockThreshold: 10,
    location: '', // Selected location - empty means all
  });
  const [showFilters, setShowFilters] = useState(false);

  const accessToken = import.meta.env.VITE_SHOPIFY_ACCESS_TOKEN;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

  // --- Fetch Locations from API ---
  const fetchLocations = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/location/viewAll`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch locations: ${response.status}`);
      }

      const data = await response.json();
      console.log('📍 Locations:', data);
      
      const locationList = data.content || data.data || data || [];
      setLocations(locationList);
      
      return locationList;
    } catch (error) {
      console.error('❌ Error fetching locations:', error);
      toast.error('Failed to fetch locations');
      return [];
    }
  };

  // --- Fetch Inventory from Your API with Location Filter ---
  const fetchInventoryData = async (locationFilter = null) => {
    try {
      const requestBody = {
        page: -1,
        size: 1000,
      };

      if (locationFilter) {
        requestBody.locationName = locationFilter;
      }

      console.log(`📡 Fetching inventory for location: ${locationFilter || 'All'}`);

      const response = await fetch(
        `${API_BASE_URL}/productInventory/search`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch inventory: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Inventory Data:', data);
      
      const inventoryList = data.content || data.data || data || [];
      setInventoryData(inventoryList);
      setFilteredInventoryData(inventoryList);
      
      console.log(`✅ Found ${inventoryList.length} items for location: ${locationFilter || 'All'}`);
      
      return inventoryList;
    } catch (error) {
      console.error('❌ Error fetching inventory:', error);
      toast.error('Failed to fetch inventory data');
      return [];
    }
  };

  // --- Handle location change - Auto refetch ---
  const handleLocationChange = async (e) => {
    const locationName = e.target.value;
    console.log(`🔄 Location changed to: ${locationName}`);
    
    setFilters(prev => ({
      ...prev,
      location: locationName
    }));
    
    setIsLoading(true);
    
    // Fetch inventory for the selected location or all
    const fetchedData = await fetchInventoryData(locationName || null);
    setFilteredInventoryData(fetchedData);
    
    // Refresh products to update the table
    await fetchProducts();
    
    setIsLoading(false);
    
    const displayName = locationName || 'All Locations';
    toast.info(`Showing products with inventory at ${displayName}`);
  };

  // --- Sync using Backend API with Spinner ---
  const syncToShopify = async (productId, locationName) => {
    console.log('🔄 Syncing - ProductId:', productId, 'Location:', locationName);
    
    setIsSyncing(true);
    
    try {
      setSyncingItems(prev => ({ ...prev, [productId]: true }));

      const response = await fetch(
        `${API_BASE_URL}/api/inventory/sync`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: productId,
            locationName: locationName
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to sync: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Sync Response:', data);
      
      await Promise.all([
        fetchProducts(),
        fetchInventoryData(filters.location || null)
      ]);
      
      toast.success(`✅ Successfully synced ${productId} for ${locationName}`);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Sync error:', error);
      toast.error(`Failed to sync ${productId}: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setSyncingItems(prev => ({ ...prev, [productId]: false }));
      setIsSyncing(false);
    }
  };

  // Handle single product sync
  const handleSingleSync = async (inventoryItem) => {
    const productId = inventoryItem?.productId;
    const locationName = inventoryItem?.locationName || filters.location;
    
    console.log('📤 Single Sync - Product:', productId, 'Location:', locationName);
    
    if (!productId) {
      toast.error('Product ID is required for syncing');
      return;
    }

    if (!locationName) {
      toast.error('Location is required for syncing');
      return;
    }

    await syncToShopify(productId, locationName);
  };

  // Handle sync all matching products for current location
  const handleSyncAll = async () => {
    const dataToSync = filteredInventoryData;
    
    const matchingItems = dataToSync.filter(item => {
      return products.some(p => 
        p.variants?.some(v => v.sku === item.productId?.toString())
      );
    });

    if (matchingItems.length === 0) {
      toast.warning(`No matching products found`);
      return;
    }

    setBulkSyncProgress({
      isRunning: true,
      total: matchingItems.length,
      completed: 0,
      failed: 0,
      current: '',
    });

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < matchingItems.length; i++) {
      const item = matchingItems[i];
      setBulkSyncProgress(prev => ({
        ...prev,
        current: `${item.productId} - ${item.productDescription}`,
        completed: i + 1,
      }));

      const locationName = item.locationName || filters.location;
      const result = await syncToShopify(item.productId, locationName);
      
      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }

      setBulkSyncProgress(prev => ({
        ...prev,
        completed: i + 1,
        failed: failCount,
      }));
    }

    setBulkSyncProgress(prev => ({ ...prev, isRunning: false }));

    if (failCount > 0) {
      toast.warning(
        `Sync completed: ${successCount} successful, ${failCount} failed. Check console for details.`
      );
    } else {
      toast.success(`All ${successCount} items synced successfully!`);
    }
  };

  // --- Helper Functions ---
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

  // --- Get quantities for the selected location ---
  const getQuantities = (inventoryItemId) => {
    if (!inventoryItemId) return { loc1: 0, loc2: 0, total: 0 };
  
    const locMap = levelsMap[inventoryItemId] || {};
    const loc1 = locMap[LOCATION_1_ID] || 0;
    const loc2 = locMap[LOCATION_2_ID] || 0;
    
    const selectedLocation = filters.location;
    
    let selectedLocationStock = 0;
    if (!selectedLocation) {
      // No location selected - show total across both locations
      selectedLocationStock = loc1 + loc2;
    } else if (selectedLocation === LOCATION_1_NAME) {
      selectedLocationStock = loc1;
    } else if (selectedLocation === LOCATION_2_NAME) {
      selectedLocationStock = loc2;
    } else {
      selectedLocationStock = loc1 + loc2;
    }
    
    return { 
      loc1, 
      loc2, 
      total: selectedLocationStock,
      selectedLocationStock 
    };
  };

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
    // Set loading state
    setIsLoading(true);
    
    try {
      let apiUrl;

      if (url) {
        const urlObj = new URL(url);
        apiUrl = `/shopify${urlObj.pathname}${urlObj.search}`;
      } else {
        const params = new URLSearchParams({
          limit: 250,
          fields: 'id,title,variants',
        });

        if (filters.search) {
          params.append('q', filters.search);
        }

        apiUrl = `/shopify/admin/api/2026-01/products.json?${params.toString()}`;
      }

      console.log('📡 Fetching URL:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error Response:', errorData);
        throw new Error(errorData.errors || 'Failed to fetch products');
      }

      const data = await response.json();
      let productsData = data.products || [];
      
      console.log(`✅ Found ${productsData.length} products from Shopify`);

      if (filters.search && productsData.length > 0) {
        const searchLower = filters.search.toLowerCase();
        productsData = productsData.filter(product => {
          const titleMatch = product.title?.toLowerCase().includes(searchLower);
          const variantMatch = product.variants?.some(v => 
            v.sku?.toLowerCase().includes(searchLower) ||
            v.title?.toLowerCase().includes(searchLower)
          );
          return titleMatch || variantMatch;
        });
        console.log(`🔎 After client-side filtering: ${productsData.length} products`);
      }

      const inventoryItemIds = [];
      productsData.forEach((product) => {
        product.variants?.forEach((variant) => {
          if (variant.inventory_item_id) {
            inventoryItemIds.push(variant.inventory_item_id);
          }
        });
      });

      console.log(`📦 Found ${inventoryItemIds.length} inventory items to fetch`);

      let allLevels = [];
      if (inventoryItemIds.length > 0) {
        const chunkSize = 100;
        const chunks = [];
        for (let i = 0; i < inventoryItemIds.length; i += chunkSize) {
          chunks.push(inventoryItemIds.slice(i, i + chunkSize));
        }

        console.log(`🔄 Fetching inventory in ${chunks.length} chunks`);

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
            console.error('❌ Inventory levels error:', errorData);
            continue;
          }

          const levelData = await levelResponse.json();
          allLevels = allLevels.concat(levelData.inventory_levels || []);
        }
      }

      console.log(`📊 Fetched ${allLevels.length} inventory levels`);

      const map = {};
      allLevels.forEach((level) => {
        const itemId = level.inventory_item_id;
        const locId = level.location_id;
        if (!map[itemId]) map[itemId] = {};
        map[itemId][locId] = level.available || 0;
      });

      setProducts(productsData);
      setLevelsMap(map);

      const linkHeader = response.headers.get('Link');
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

      if (productsData.length === 0 && filters.search) {
        toast.info(`No products found matching "${filters.search}"`);
      }

    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError({
        message: err.message || 'An unexpected error occurred',
        details: 'Please check your access token, network, or try again later.',
      });
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  };

  // --- Find matching inventory in filtered data only ---
  const findMatchingInventory = (sku, inventoryDataList) => {
    if (!sku || !inventoryDataList || inventoryDataList.length === 0) return null;
    
    const match = inventoryDataList.find(item => {
      const itemProductId = item.productId?.toString().trim() || '';
      const skuTrimmed = sku.toString().trim();
      
      if (itemProductId === skuTrimmed) return true;
      if (itemProductId.toLowerCase() === skuTrimmed.toLowerCase()) return true;
      
      const normalize = (str) => str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      if (normalize(itemProductId) === normalize(skuTrimmed)) return true;
      
      return false;
    });
    
    return match;
  };

  // --- Loading Spinner Component ---
  const LoadingSpinner = () => {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin animation-delay-150"></div>
          </div>
        </div>
        <p className="text-gray-600 mt-4 font-medium">Loading inventory...</p>
        <p className="text-gray-400 text-sm mt-1">Please wait while we fetch your data</p>
      </div>
    );
  };

  // --- Full Page Spinner Component ---
  const FullPageSpinner = () => {
    if (!isSyncing) return null;

    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center max-w-sm w-full mx-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin animation-delay-150"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Syncing to Shopify
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Please wait while we sync your inventory...
            </p>
          </div>
          
          <div className="mt-4 flex gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  };

  // --- Bulk Sync Progress Component ---
  const BulkSyncProgress = () => {
    if (!bulkSyncProgress.isRunning) return null;

    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Syncing: {bulkSyncProgress.current}
          </span>
          <span className="text-sm text-blue-600 dark:text-blue-400">
            {bulkSyncProgress.completed}/{bulkSyncProgress.total}
          </span>
        </div>
        <div className="w-full bg-blue-200 dark:bg-blue-800/50 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ 
              width: `${(bulkSyncProgress.completed / bulkSyncProgress.total) * 100}%` 
            }}
          ></div>
        </div>
        {bulkSyncProgress.failed > 0 && (
          <p className="text-xs text-red-600 mt-1">
            Failed: {bulkSyncProgress.failed} items
          </p>
        )}
      </div>
    );
  };

  // --- Lifecycle ---
  useEffect(() => {
    if (accessToken && accessToken !== 'undefined' && token) {
      fetchLocations().then(() => {
        Promise.all([fetchProducts(), fetchInventoryData(null)]);
      });
    } else if (!accessToken || accessToken === 'undefined') {
      setError({
        message: 'Access token not configured',
        details: 'Please add VITE_SHOPIFY_ACCESS_TOKEN to your .env file',
      });
      setIsInitialLoading(false);
    } else if (!token) {
      setError({
        message: 'Authentication token not found',
        details: 'Please log in again',
      });
      setIsInitialLoading(false);
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
    Promise.all([fetchProducts(), fetchInventoryData(filters.location || null)]);
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
      location: '',
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
    fetchInventoryData(null);
    setShowFilters(false);
  };

  // --- Stats ---
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

  // Get matching products count
  const getMatchingCount = () => {
    const dataToUse = filteredInventoryData;
    return dataToUse.filter(item => {
      return products.some(p => 
        p.variants?.some(v => v.sku === item.productId?.toString())
      );
    }).length;
  };

  // --- Render ---
  return (
    <DefaultLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <FullPageSpinner />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Shopify Inventory Sync
              </h1>
              <p className="text-gray-600 mt-1">
                Sync closing balances from inventory to Shopify
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
                disabled={isLoading || isSyncing}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 disabled:opacity-50"
              >
                <AiOutlineReload
                  className={isLoading ? 'animate-spin' : ''}
                  size={18}
                />
                <span>Refresh</span>
              </button>
              <button
                onClick={handleSyncAll}
                disabled={getMatchingCount() === 0 || isLoading || bulkSyncProgress.isRunning || isSyncing}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2 disabled:opacity-50"
              >
                <AiOutlineCheckCircle size={18} />
                <span>Sync All ({getMatchingCount()})</span>
              </button>
            </div>
          </div>

          {/* Location Filter */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Filter by Location:
              </label>
              <div className="flex-1 w-full">
                <select
                  value={filters.location}
                  onChange={handleLocationChange}
                  disabled={isSyncing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50"
                >
                  <option value="">All Locations</option>
                  {locations.map((location, index) => (
                    <option key={index} value={location.locationName || location.name}>
                      {location.locationName || location.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-500 whitespace-nowrap">
                Showing: <span className="font-bold text-blue-600">{filteredInventoryData.length}</span> inventory items
              </div>
            </div>
          </div>

          <BulkSyncProgress />

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search by Product Title or SKU
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="e.g. T-Shirt or SKU"
                      disabled={isSyncing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10 disabled:opacity-50"
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
                    disabled={isSyncing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Items with total stock below this will be highlighted
                  </p>
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={applyFilters}
                    disabled={isSyncing}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex-1 disabled:opacity-50"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={resetFilters}
                    disabled={isSyncing}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats Summary */}
          {!isLoading && !isInitialLoading && products.length > 0 && (
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

          {/* Inventory Summary */}
          {!isLoading && !isInitialLoading && filteredInventoryData.length > 0 && (
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                📍 Inventory Summary {filters.location ? `for ${filters.location}` : '(All Locations)'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Items</p>
                  <p className="text-xl font-bold text-gray-900">{filteredInventoryData.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Matching Products</p>
                  <p className="text-xl font-bold text-green-600">{getMatchingCount()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ready to Sync</p>
                  <p className="text-xl font-bold text-blue-600">{getMatchingCount()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Balance</p>
                  <p className="text-xl font-bold text-purple-600">
                    {filteredInventoryData.reduce((sum, item) => sum + (item.closingBalance || 0), 0)}
                  </p>
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
            {isInitialLoading || isLoading ? (
              <LoadingSpinner />
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <FiPackage className="text-gray-300" size={64} />
                <p className="text-gray-500 mt-4">No products found in Shopify</p>
                <p className="text-gray-400 text-sm">
                  Try refreshing or check your connection.
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
                        Shopify Stock {filters.location ? `(${filters.location})` : '(Total)'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Closing Balance
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <React.Fragment key={product.id}>
                        {product.variants?.map((variant) => {
                          if (!variant.inventory_item_id) return null;

                          // Get stock for selected location or total
                          const { total } = getQuantities(variant.inventory_item_id);
                          const status = getStatus(total);

                          // Find matching inventory
                          const inventoryMatch = findMatchingInventory(variant.sku, filteredInventoryData);

                          const closingBalance = inventoryMatch?.closingBalance || 0;
                          const productDescription = inventoryMatch?.productDescription || '';
                          const isSyncing = syncingItems[variant.sku];

                          // If location is selected, ONLY show products that have inventory at that location
                          if (filters.location && !inventoryMatch) return null;

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
                                {inventoryMatch && (
                                  <div className="text-xs text-green-600 mt-1">
                                    ✓ {productDescription}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-600 font-mono">
                                  {variant.sku || '-'}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`text-sm font-semibold ${
                                  total > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {total}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`text-sm font-semibold ${
                                  closingBalance > 0 ? 'text-blue-600' : 'text-gray-400'
                                }`}>
                                  {closingBalance}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${status.color}`}
                                >
                                  {status.label}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                {inventoryMatch && variant.sku ? (
                                  <button
                                    onClick={() => handleSingleSync(inventoryMatch)}
                                    disabled={isSyncing || bulkSyncProgress.isRunning || isSyncing}
                                    className={`text-xs bg-blue-100 font-medium px-3 py-1 rounded transition  ${
                                      isSyncing || bulkSyncProgress.isRunning || isSyncing
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-300 text-white hover:bg-blue-600 hover:text-white'
                                    }`}
                                  >
                                    {isSyncing ? (
                                      <span className="flex items-center gap-1">
                                        <span className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></span>
                                        Syncing...
                                      </span>
                                    ) : (
                                      'Sync Now'
                                    )}
                                  </button>
                                ) : (
                                  <span className="text-xs text-gray-400">No inventory</span>
                                )}
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
            {!isLoading && !isInitialLoading && products.length > 0 && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between flex-wrap gap-2">
                <div className="text-sm text-gray-600">
                  Page {pagination.currentPage}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange('prev')}
                    disabled={!pagination.prevPageUrl || isSyncing}
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
                  >
                    <AiOutlineArrowLeft size={16} />
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange('next')}
                    disabled={!pagination.nextPageUrl || isSyncing}
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