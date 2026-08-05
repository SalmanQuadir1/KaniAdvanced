import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { FiEdit, FiTrash2, FiX, FiChevronDown, FiChevronRight, FiSearch } from "react-icons/fi";
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import { BASE_URL, GET_INVENTORY, GET_INVENTORYYS, customStyles as createCustomStyles } from '../../Constants/utils';
import { Field, Form, Formik } from 'formik';
import useProduct from '../../hooks/useProduct';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ViewProductsInventory = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const theme = useSelector(state => state?.persisted?.theme);
    const navigate = useNavigate();

    const [locationValue, setLocationValue] = useState(null);
    const [descriptionValue, setDescriptionValue] = useState(null);
    const customStyles = createCustomStyles(theme?.mode);

    const referenceImages = [];
    const actualImages = [];

    const { inventoryproductId, handleInventoryDelete, getInventoryProductId, getLocation, Location } = useProduct({ referenceImages, actualImages });
    const [inventoryData, setInventoryData] = useState([]);
    const [expandedGroups, setExpandedGroups] = useState({});
    const [expandedSubGroups, setExpandedSubGroups] = useState({});
    
    // LOADING STATES
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(false);

    // SEARCH AND FILTER STATES
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    
    // MAIN PAGINATION STATES (for product groups)
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    
    // SUBGROUP PAGINATION STATES - Store invPage and invSize for each subgroup
    const [subGroupPagination, setSubGroupPagination] = useState({});
    
    // Ref to store the latest subGroupPagination state
    const subGroupPaginationRef = useRef(subGroupPagination);
    
    // Track if we're in search mode
    const [isSearchMode, setIsSearchMode] = useState(false);

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 0,
        pageSize: 10
    });

    // Modal states
    const [selectedInventory, setSelectedInventory] = useState(null);
    const [isRecentHistoryModalOpen, setIsRecentHistoryModalOpen] = useState(false);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);

    // Data states for each modal
    const [recentHistoryData, setRecentHistoryData] = useState([]);
    const [summaryData, setSummaryData] = useState(null);
    const [transactionsData, setTransactionsData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Update ref when subGroupPagination changes
    useEffect(() => {
        subGroupPaginationRef.current = subGroupPagination;
    }, [subGroupPagination]);

    // DEBOUNCE SEARCH
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timeout);
    }, [searchTerm]);

    // FETCH DATA WHEN SEARCH OR PAGINATION CHANGES
    useEffect(() => {
        ViewInventory(0);
    }, [debouncedSearch, size]);

    useEffect(() => {
        getLocation();
        getInventoryProductId();
    }, []);

    const formattedProductId = inventoryproductId?.map(id => ({
        label: id,
        value: id
    })) || [];

    const formattedLocation = Location?.map(loc => ({
        label: loc.address,
        value: loc.address
    })) || [];

    // ViewInventory with search, pagination, and subgroup pagination
    const ViewInventory = async (pageNumber = 0) => {
        try {
            setIsLoading(true);
            
            let url = `${GET_INVENTORYYS}?`;
            const params = [];
            
            // Main pagination params
            if (debouncedSearch && debouncedSearch.trim() !== '') {
                setIsSearchMode(true);
                params.push(`search=${encodeURIComponent(debouncedSearch.trim())}`);
            } else {
                setIsSearchMode(false);
                params.push(`page=${pageNumber}`);
                params.push(`size=${size}`);
            }
            
            // Get the latest subgroup pagination from ref
            const latestSubGroupPagination = subGroupPaginationRef.current;
            
            // Add subgroup pagination params if any subgroup is expanded
            const expandedSubGroupIds = Object.keys(expandedSubGroups).filter(id => expandedSubGroups[id]);
            if (expandedSubGroupIds.length > 0) {
                const firstSubGroupId = expandedSubGroupIds[0];
                const subPagination = latestSubGroupPagination[firstSubGroupId] || { invPage: 0, invSize: 5 };
                params.push(`invPage=${subPagination.invPage || 0}`);
                params.push(`invSize=${subPagination.invSize || 5}`);
                console.log(`Using invPage: ${subPagination.invPage}, invSize: ${subPagination.invSize} from ref`);
            } else {
                params.push(`invPage=0`);
                params.push(`invSize=5`);
            }
            
            url += params.join('&');
            
            console.log("Fetching URL:", url);
            console.log("Mode:", debouncedSearch ? "SEARCH" : "PAGINATION");
            console.log("Main Page:", pageNumber, "Main Size:", size);
            console.log("Subgroup Pagination from ref:", latestSubGroupPagination);
            
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("API Response:", data);

            setInventoryData(data.content || []);
            setPagination({
                totalItems: data?.totalElements || 0,
                data: data?.content || [],
                totalPages: data?.totalPages || 0,
                currentPage: data?.number || 0,
                pageSize: data?.size || size
            });
            
            setPage(data?.number || 0);
            
        } catch (error) {
            console.error("Error fetching inventory:", error);
            toast.error("Failed to fetch Inventory");
        } finally {
            setIsLoading(false);
        }
    };

    // INITIAL LOAD
    useEffect(() => {
        ViewInventory(0);
    }, []);

    // HANDLE MAIN PAGE CHANGE
    const handlePageChange = (newPage) => {
        if (isSearchMode) {
            toast.info("Search results don't support pagination");
            return;
        }
        const zeroBasedPage = newPage - 1;
        setPage(zeroBasedPage);
        ViewInventory(zeroBasedPage);
    };

    // HANDLE MAIN PAGE SIZE CHANGE
    const handlePageSizeChange = (e) => {
        if (isSearchMode) {
            toast.info("Search results don't support pagination");
            return;
        }
        const newSize = parseInt(e.target.value);
        setSize(newSize);
        setPage(0);
        ViewInventory(0);
    };

    // HANDLE SUB GROUP PAGE CHANGE - Update invPage
    const handleSubGroupPageChange = (subGroupId, newPage) => {
        if (isSearchMode) {
            toast.info("Search results don't support pagination");
            return;
        }
        console.log(`SubGroup ${subGroupId} invPage change to:`, newPage);
        
        // Update state with new invPage, keeping existing invSize
        setSubGroupPagination(prev => {
            const currentSize = prev[subGroupId]?.invSize || 5;
            const newState = {
                ...prev,
                [subGroupId]: {
                    ...prev[subGroupId],
                    invPage: newPage,
                    invSize: currentSize
                }
            };
            console.log('New subGroupPagination state:', newState);
            return newState;
        });
        
        // Use setTimeout to ensure state is updated before refetching
        setTimeout(() => {
            ViewInventory(page);
        }, 100);
    };

    // HANDLE SUB GROUP PAGE SIZE CHANGE - Update invSize and reset invPage to 0
    const handleSubGroupSizeChange = (subGroupId, e) => {
        if (isSearchMode) {
            toast.info("Search results don't support pagination");
            return;
        }
        const newSize = parseInt(e.target.value);
        console.log(`SubGroup ${subGroupId} invSize change to:`, newSize);
        
        // Update state with new invSize and reset invPage to 0
        setSubGroupPagination(prev => {
            const newState = {
                ...prev,
                [subGroupId]: {
                    invPage: 0, // Reset to first page when size changes
                    invSize: newSize
                }
            };
            console.log('New subGroupPagination state:', newState);
            return newState;
        });
        
        // Use setTimeout to ensure state is updated before refetching
        setTimeout(() => {
            ViewInventory(page);
        }, 150); // Slightly longer delay to ensure state update
    };

    // HANDLE SEARCH SUBMIT
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim() === '') {
            toast.warning("Please enter a Product ID to search");
            return;
        }
        setDebouncedSearch(searchTerm);
        setPage(0);
        setSubGroupPagination({});
        ViewInventory(0);
    };

    // HANDLE SEARCH ON ENTER KEY
    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (searchTerm.trim() === '') {
                toast.warning("Please enter a Product ID to search");
                return;
            }
            setDebouncedSearch(searchTerm);
            setPage(0);
            setSubGroupPagination({});
            ViewInventory(0);
        }
    };

    // CLEAR SEARCH - Returns to pagination mode
    const handleClearSearch = () => {
        setSearchTerm('');
        setDebouncedSearch('');
        setIsSearchMode(false);
        setPage(0);
        setSubGroupPagination({});
        ViewInventory(0);
    };

    const handleUpdate = (id) => {
        navigate(`/inventory/updateInventory/${id}`);
    };

    const toggleGroup = (groupId) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
    };

    const toggleSubGroup = (subGroupId) => {
        setExpandedSubGroups(prev => ({
            ...prev,
            [subGroupId]: !prev[subGroupId]
        }));
    };

    const getGroupInventoryCount = useCallback((subGroups) => {
        return subGroups.reduce((total, subGroup) => {
            return total + (subGroup.totalInventories || 0);
        }, 0);
    }, []);

    const getTotalProductsInGroup = useCallback((subGroups) => {
        return subGroups.reduce((total, subGroup) => {
            return total + (subGroup.totalProducts || 0);
        }, 0);
    }, []);

    // API functions for the three modals
    const fetchRecentHistory = async (productId, locationId) => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/productInventory/inventory-transactions/product/${productId}/location/${locationId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            setRecentHistoryData(data);
        } catch (error) {
            console.error("Error fetching recent history:", error);
            toast.error("Failed to fetch recent history");
        } finally {
            setLoading(false);
        }
    };

    const fetchInventorySummary = async (locationId, productId) => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/productInventory/inventory-summaries/product/${productId}/location/${locationId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            setSummaryData(data);
        } catch (error) {
            console.error("Error fetching inventory summary:", error);
            toast.error("Failed to fetch inventory summary");
        } finally {
            setLoading(false);
        }
    };

    const fetchInventoryTransactions = async (locationId, productId) => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/productInventory/inventories/product/${productId}/location/${locationId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            setTransactionsData(data);
        } catch (error) {
            console.error("Error fetching inventory transactions:", error);
            toast.error("Failed to fetch inventory transactions");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (values) => {
        const filters = {
            productId: values.ProductId || undefined,
            address: values.address || undefined
        };
        ViewInventory(0);
    };

    // Full Page Spinner Component
    const FullPageSpinner = () => (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin animation-delay-150"></div>
                    </div>
                </div>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 animate-pulse">
                    Loading Inventory...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Please wait while we fetch your data
                </p>
            </div>
        </div>
    );

    // Recent History Modal Component
    const RecentHistoryModal = ({ isOpen, onClose, data, loading, inventoryItem }) => {
        if (!isOpen) return null;
        const dataArray = Array.isArray(data) ? data : data ? [data] : [];

        return (
            <div className="fixed inset-0 z-[9999] overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity z-[9998]" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full z-[9999] relative">
                        <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Recent History - {inventoryItem?.productDescription}
                                </h3>
                                <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                    <FiX size={24} />
                                </button>
                            </div>
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                    <p className="mt-2 text-gray-500">Loading...</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto max-h-96">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">#</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Product Name</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Location</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Quantity</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Available</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Last Updated</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataArray.length > 0 ? dataArray.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2 text-sm">{idx + 1}</td>
                                                    <td className="px-4 py-2 text-sm">{item.productName || 'N/A'}</td>
                                                    <td className="px-4 py-2 text-sm">{item.locationName || 'N/A'}</td>
                                                    <td className="px-4 py-2 text-sm">{item.quantity || 0}</td>
                                                    <td className="px-4 py-2 text-sm">{item.available || 0}</td>
                                                    <td className="px-4 py-2 text-sm">{item.lastUpdated ? new Date(item.lastUpdated).toLocaleString() : 'N/A'}</td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan="6" className="text-center py-8">No recent history found</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border px-4 py-2 bg-white text-base font-medium sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Inventory Summary Modal Component
    const InventorySummaryModal = ({ isOpen, onClose, data, loading, inventoryItem }) => {
        if (!isOpen) return null;
        const summaryData = data || {};
        const locations = summaryData.locations || [];

        return (
            <div className="fixed inset-0 z-[9999] overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity z-[9998]" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full z-[9999] relative">
                        <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Inventory Summary - {summaryData.productName || inventoryItem?.productDescription}
                                </h3>
                                <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                    <FiX size={24} />
                                </button>
                            </div>
                            {loading ? (
                                <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>
                            ) : (
                                <div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <p className="text-sm text-gray-500">Product Name</p>
                                            <p className="text-lg font-bold">{summaryData.productName || inventoryItem?.productDescription}</p>
                                        </div>
                                        <div className="p-4 bg-purple-50 rounded-lg">
                                            <p className="text-sm text-gray-500">Total Quantity</p>
                                            <p className="text-2xl font-bold text-purple-600">{summaryData.totalQuantity || 0}</p>
                                        </div>
                                        <div className="p-4 bg-orange-50 rounded-lg">
                                            <p className="text-sm text-gray-500">Total Available</p>
                                            <p className="text-2xl font-bold text-orange-600">{summaryData.totalAvailable || 0}</p>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto max-h-96">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50 sticky top-0">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">#</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Location Name</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Quantity</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Available</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {locations.length > 0 ? locations.map((location, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm">{idx + 1}</td>
                                                        <td className="px-4 py-3 text-sm">{location.locationName || 'N/A'}</td>
                                                        <td className="px-4 py-3 text-sm">{location.quantity || 0}</td>
                                                        <td className="px-4 py-3 text-sm">{location.available || 0}</td>
                                                        <td className="px-4 py-3 text-sm">
                                                            <span className={`px-2 py-1 rounded-full text-xs ${(location.available || 0) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                {(location.available || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr><td colSpan="5" className="text-center py-8">No location data found</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border px-4 py-2 bg-white text-base font-medium sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Sub Group Pagination Component - Uses invPage and invSize
    const SubGroupPagination = ({ subGroup }) => {
        const { id, totalInventories, totalPages } = subGroup;
        
        // Get pagination state for this specific subgroup
        const paginationState = subGroupPagination[id] || { invPage: 0, invSize: 5 };
        const invPage = paginationState.invPage || 0;
        const invSize = paginationState.invSize || 5;
        
        if (totalInventories === 0 || totalPages === 0) return null;

        // Calculate display range based on invPage and invSize
        const startIndex = invPage * invSize + 1;
        const endIndex = Math.min((invPage + 1) * invSize, totalInventories);

        return (
            <div className="flex flex-col sm:flex-row items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg mt-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Showing {startIndex} - {endIndex} of {totalInventories} items
                </span>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 dark:text-gray-300">Size:</label>
                        <select
                            value={invSize}
                            onChange={(e) => handleSubGroupSizeChange(id, e)}
                            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={500}>500</option>
                        </select>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => handleSubGroupPageChange(id, invPage - 1)}
                            disabled={invPage === 0}
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                        >
                            Previous
                        </button>
                        <span className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 rounded">
                            {invPage + 1} / {totalPages}
                        </span>
                        <button
                            onClick={() => handleSubGroupPageChange(id, invPage + 1)}
                            disabled={invPage >= totalPages - 1}
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // OPTIMIZED: Render table rows using server-provided pagination
    const renderTableRows = useMemo(() => {
        if (!inventoryData || inventoryData.length === 0) {
            return (
                <tr className="bg-white dark:bg-slate-700">
                    <td colSpan="13" className="px-5 py-5 text-center">
                        {isSearchMode ? 'No results found for your search' : 'No Data Found'}
                    </td>
                </tr>
            );
        }

        const rows = [];

        inventoryData.forEach((group, groupIndex) => {
            const isGroupExpanded = expandedGroups[group.id];
            const totalProductsInGroup = getTotalProductsInGroup(group.subGroups || []);
            const totalInventoryCount = getGroupInventoryCount(group.subGroups || []);

            // Product Group Row
            rows.push(
                <tr key={`group-${group.id}`} className="bg-blue-50 dark:bg-blue-900/30 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50" onClick={() => toggleGroup(group.id)}>
                    <td colSpan="13" className="px-5 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {isGroupExpanded ? <FiChevronDown className="text-blue-600" /> : <FiChevronRight className="text-blue-600" />}
                                <span className="font-bold text-lg text-blue-800 dark:text-blue-300 flex items-center gap-2">
                                    {group.productGroupName}
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        Product Group
                                    </span>
                                </span>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <span className="bg-blue-200 dark:bg-blue-800 px-3 py-1 rounded-full">
                                    Sub Groups: {group.subGroups?.length || 0}
                                </span>
                                <span className="bg-green-200 dark:bg-green-800 px-3 py-1 rounded-full">
                                    Products: {totalProductsInGroup}
                                </span>
                                <span className="bg-purple-200 dark:bg-purple-800 px-3 py-1 rounded-full">
                                    Inventory Items: {totalInventoryCount}
                                </span>
                            </div>
                        </div>
                    </td>
                </tr>
            );

            // If group is expanded, show sub groups
            if (isGroupExpanded && group.subGroups && group.subGroups.length > 0) {
                group.subGroups.forEach((subGroup, subGroupIndex) => {
                    const isSubGroupExpanded = expandedSubGroups[subGroup.id];
                    
                    // Get pagination for this subgroup from state
                    const paginationState = subGroupPagination[subGroup.id] || { invPage: 0, invSize: 5 };
                    const invPage = paginationState.invPage || 0;
                    const invSize = paginationState.invSize || 5;
                    
                    // Get inventories for this subgroup (server already paginated)
                    const inventories = subGroup.inventories || [];

                    // Sub Group Row
                    rows.push(
                        <tr key={`subgroup-${subGroup.id}`} className="bg-gray-50 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => toggleSubGroup(subGroup.id)}>
                            <td colSpan="13" className="px-5 py-3 border-b border-gray-200 pl-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {isSubGroupExpanded ? <FiChevronDown className="text-gray-600" /> : <FiChevronRight className="text-gray-600" />}
                                        <span className="font-semibold text-md text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            {subGroup.productSubGroupName}
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                                Sub Group
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex gap-3 text-xs">
                                        <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                                            Inventory: {subGroup.totalInventories || 0}
                                        </span>
                                        <span className="bg-purple-200 dark:bg-purple-800 px-2 py-1 rounded">
                                            invPage: {invPage + 1}/{subGroup.totalPages || 1}
                                        </span>
                                        <span className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded">
                                            invSize: {invSize}
                                        </span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    );

                    // If sub group is expanded, show inventory items
                    if (isSubGroupExpanded) {
                        if (inventories && inventories.length > 0) {
                            // Add table headers inside the subgroup
                            rows.push(
                                <tr 
                                    key={`subgroup-headers-${subGroup.id}`} 
                                    className="dark:bg-slate-700 dark:text-white"
                                    style={{ backgroundColor: 'rgb(71 85 105)' }}
                                >
                                    <th className="px-9 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white">
                                        S.No
                                    </th>
                                    <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white">
                                        Product Description
                                    </th>
                                    <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white">
                                        Product Id
                                    </th>
                                    <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white">
                                        Location
                                    </th>
                                    <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white">
                                        Opening Balance
                                    </th>
                                    <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white">
                                        Purchase
                                    </th>
                                    <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white">
                                        Sale
                                    </th>
                                    <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white">
                                        Transfer In
                                    </th>
                                    <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white">
                                        Transfer Out
                                    </th>
                                    <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white">
                                        Closing Balance
                                    </th>
                                    <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white">
                                        In Progress
                                    </th>
                                    <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white">
                                        Recent History
                                    </th>
                                    <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white">
                                        Summary
                                    </th>
                                </tr>
                            );

                            // Add inventory items
                            inventories.forEach((item, idx) => {
                                const actualIndex = invPage * invSize + idx + 1;
                                
                                rows.push(
                                    <tr key={`inventory-${item.id}`} className="bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600">
                                        <td className="px-5 py-3 border-b text-sm pl-16">
                                            {actualIndex}
                                        </td>
                                        <td className="px-5 py-3 border-b text-sm">
                                            <div className="flex items-center gap-2">
                                                {item.productDescription || 'N/A'}
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                    Item
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 border-b text-sm">
                                            {item.productId || 'N/A'}
                                        </td>
                                        <td className="px-5 py-3 border-b text-sm">
                                            {item.locationName || 'N/A'}
                                        </td>
                                        <td className="px-5 py-3 border-b text-sm">
                                            <span className="font-semibold">{item.openingBalance || 0}</span>
                                        </td>
                                        <td className="px-5 py-3 border-b text-sm">
                                            {item.purchase || 0}
                                        </td>
                                        <td className="px-5 py-3 border-b text-sm">
                                            {item.sale || 0}
                                        </td>
                                        <td className="px-5 py-3 border-b text-sm">
                                            {item.branchTransferInwards || 0}
                                        </td>
                                        <td className="px-5 py-3 border-b text-sm">
                                            {item.branchTransferOutwards || 0}
                                        </td>
                                        <td className="px-5 py-3 border-b text-sm">
                                            <span className={`font-bold ${(item.closingBalance || 0) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                {item.closingBalance || 0}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 border-b text-sm">
                                            {item.inProgressOrders || 0}
                                        </td>
                                        <td className="px-5 py-3 border-b text-sm">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedInventory(item);
                                                    fetchRecentHistory(item.productIntegerId, item.locationId);
                                                    setIsRecentHistoryModalOpen(true);
                                                }}
                                                className="text-blue-500 hover:text-blue-700 underline text-xs"
                                            >
                                                View History
                                            </button>
                                        </td>
                                        <td className="px-5 py-3 border-b text-sm">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedInventory(item);
                                                    fetchInventorySummary(item.locationId, item.productIntegerId);
                                                    setIsSummaryModalOpen(true);
                                                }}
                                                className="text-green-500 hover:text-green-700 underline text-xs"
                                            >
                                                View Summary
                                            </button>
                                        </td>
                                    </tr>
                                );
                            });

                            // Add sub group pagination
                            if (subGroup.totalPages > 1) {
                                rows.push(
                                    <tr key={`subgroup-pagination-${subGroup.id}`}>
                                        <td colSpan="13" className="px-0 py-2">
                                            <SubGroupPagination subGroup={subGroup} />
                                        </td>
                                    </tr>
                                );
                            }
                        } else {
                            // No inventory items
                            rows.push(
                                <tr key={`empty-${subGroup.id}`} className="bg-white dark:bg-slate-700">
                                    <td colSpan="13" className="px-5 py-4 text-center text-gray-500 italic pl-16">
                                        No inventory items found for this sub group
                                    </td>
                                </tr>
                            );
                        }
                    }
                });
            } else if (isGroupExpanded && (!group.subGroups || group.subGroups.length === 0)) {
                rows.push(
                    <tr key={`empty-group-${group.id}`} className="bg-white dark:bg-slate-700">
                        <td colSpan="13" className="px-5 py-4 text-center text-gray-500 italic pl-10">
                            No sub groups found for this product group
                        </td>
                    </tr>
                );
            }
        });

        return rows;
    }, [inventoryData, expandedGroups, expandedSubGroups, getGroupInventoryCount, getTotalProductsInGroup, isSearchMode, subGroupPagination]);

    // Add CSS for animation delay
    const style = document.createElement('style');
    style.textContent = `
        .animation-delay-150 {
            animation-delay: 150ms;
        }
    `;
    document.head.appendChild(style);

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Inventory / View Inventory" />
            
            {/* SHOW FULL PAGE SPINNER WHEN LOADING */}
            {isLoading && <FullPageSpinner />}
            
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800 relative">
                <div className="pt-5">
                    <div className='flex flex-col sm:flex-row items-center justify-between w-full gap-4 mb-4'>
                        <h2 className="text-xl text-slate-500 font-semibold w-full flex items-center justify-between sm:justify-start">
                            <span>View INVENTORY</span>
                            <span className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/20 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800/30 text-sm font-semibold text-blue-700 dark:text-blue-300 ml-4">
                                Groups: {inventoryData.length}
                            </span>
                        </h2>
                    </div>

                    {/* SEARCH AND FILTER BAR */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Search by Product ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                    className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                                />
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        <FiX size={18} />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                            >
                                Search
                            </button>
                        </form>

                        {/* MAIN PAGINATION SIZE CONTROL */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                Groups per page:
                            </label>
                            <select
                                value={size}
                                onChange={handlePageSizeChange}
                                disabled={isSearchMode}
                                className={`px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white ${
                                    isSearchMode ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                    </div>

                    {/* MODE INDICATOR */}
                    <div className="flex justify-between items-center mb-3 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                            {isSearchMode ? (
                                <span className="flex items-center gap-2">
                                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md text-xs font-medium">
                                        SEARCH MODE
                                    </span>
                                    <span>Showing results for: <strong>"{debouncedSearch}"</strong></span>
                                </span>
                            ) : (
                                <span>
                                    Showing {pagination.data?.length || 0} of {pagination.totalItems || 0} product groups
                                </span>
                            )}
                        </span>
                        {!isSearchMode && (
                            <span className="text-gray-600 dark:text-gray-400">
                                Page {pagination.currentPage + 1} of {pagination.totalPages || 1}
                            </span>
                        )}
                        {isSearchMode && (
                            <button
                                onClick={handleClearSearch}
                                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                            >
                                Clear Search & Return to List
                            </button>
                        )}
                    </div>

                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                           <table className="min-w-full leading-normal overflow-auto">
                                <tbody>
                                    {renderTableRows}
                                </tbody>
                             </table>
                        </div>
                    </div>
                    
                    {/* MAIN PAGINATION - Only show when NOT in search mode */}
                    {!isSearchMode && pagination.totalPages > 0 && (
                        <div className="mt-4">
                            <Pagination 
                                totalPages={pagination.totalPages} 
                                currentPage={pagination.currentPage + 1} 
                                handlePageChange={handlePageChange} 
                            />
                        </div>
                    )}
                    
                    {/* Search mode message */}
                    {isSearchMode && (
                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center text-sm text-yellow-700 dark:text-yellow-300">
                            <span className="font-medium">ℹ️ Search Mode:</span> Pagination is disabled. Search results are displayed on a single page.
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <RecentHistoryModal
                isOpen={isRecentHistoryModalOpen}
                onClose={() => setIsRecentHistoryModalOpen(false)}
                data={recentHistoryData}
                loading={loading}
                inventoryItem={selectedInventory}
            />

            <InventorySummaryModal
                isOpen={isSummaryModalOpen}
                onClose={() => setIsSummaryModalOpen(false)}
                data={summaryData}
                loading={loading}
                inventoryItem={selectedInventory}
            />
        </DefaultLayout>
    );
};

export default ViewProductsInventory;