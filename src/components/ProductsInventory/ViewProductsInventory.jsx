import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { FiEdit, FiTrash2, FiX, FiChevronDown, FiChevronRight } from "react-icons/fi";
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import { BASE_URL, GET_INVENTORY, GET_INVENTORYYS, customStyles as createCustomStyles } from '../../Constants/utils';
import { Field, Form, Formik } from 'formik';
import useProduct from '../../hooks/useProduct';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// ✅ Import react-window
import * as ReactWindow from 'react-window';

const { FixedSizeList } = ReactWindow;

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
    
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [isSubGroupLoading, setIsSubGroupLoading] = useState({});

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
    });

    const [selectedInventory, setSelectedInventory] = useState(null);
    const [isRecentHistoryModalOpen, setIsRecentHistoryModalOpen] = useState(false);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);

    const [recentHistoryData, setRecentHistoryData] = useState([]);
    const [summaryData, setSummaryData] = useState(null);
    const [transactionsData, setTransactionsData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [subGroupInventoryData, setSubGroupInventoryData] = useState({});
    const [subGroupTotalPages, setSubGroupTotalPages] = useState({});
    const [subGroupTotalItems, setSubGroupTotalItems] = useState({});
    const [subGroupCurrentPage, setSubGroupCurrentPage] = useState({});
    const listRefs = useRef({});

    useEffect(() => {
        getLocation();
        getInventoryProductId();
    }, []);

    const ViewInventory = async (page = 1, filters = {}) => {
        try {
            if (page === 1 && !filters.productId && !filters.address) {
                setIsLoading(true);
            } else {
                setIsPageLoading(true);
            }
            
            const pageNumber = page - 1;
            
            const response = await fetch(`${GET_INVENTORYYS}?page=${pageNumber}&size=20`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();

            setInventoryData(data.content || []);
            setPagination({
                totalItems: data?.totalElements || 0,
                data: data?.content || [],
                totalPages: data?.totalPages || 0,
                currentPage: (data?.number || 0) + 1,
                itemsPerPage: data?.size || 20
            });
        } catch (error) {
            console.error("Error fetching inventory:", error);
            toast.error("Failed to fetch Inventory");
        } finally {
            setIsLoading(false);
            setIsPageLoading(false);
        }
    };

    useEffect(() => {
        ViewInventory(1);
    }, []);

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        ViewInventory(newPage);
    };

    const toggleGroup = async (groupId) => {
        const isExpanding = !expandedGroups[groupId];
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: isExpanding
        }));

        if (isExpanding) {
            const group = inventoryData.find(g => g.id === groupId);
            if (group && group.subGroups) {
                group.subGroups.forEach(subGroup => {
                    if (subGroup.inventories && subGroup.inventories.length > 0) {
                        setSubGroupInventoryData(prev => ({
                            ...prev,
                            [subGroup.id]: subGroup.inventories
                        }));
                        setSubGroupTotalItems(prev => ({
                            ...prev,
                            [subGroup.id]: subGroup.inventories.length
                        }));
                        setSubGroupTotalPages(prev => ({
                            ...prev,
                            [subGroup.id]: Math.ceil(subGroup.inventories.length / 100)
                        }));
                        setSubGroupCurrentPage(prev => ({
                            ...prev,
                            [subGroup.id]: 0
                        }));
                    }
                });
            }
        }
    };

    const toggleSubGroup = async (subGroupId) => {
        const isExpanding = !expandedSubGroups[subGroupId];
        setExpandedSubGroups(prev => ({
            ...prev,
            [subGroupId]: isExpanding
        }));

        if (isExpanding) {
            setIsSubGroupLoading(prev => ({ ...prev, [subGroupId]: true }));
            
            let allInventories = [];
            
            for (const group of inventoryData) {
                const found = group.subGroups?.find(sg => sg.id === subGroupId);
                if (found) {
                    allInventories = found.inventories || [];
                    break;
                }
            }

            if (allInventories.length > 0) {
                setSubGroupInventoryData(prev => ({
                    ...prev,
                    [subGroupId]: allInventories
                }));
                setSubGroupTotalItems(prev => ({
                    ...prev,
                    [subGroupId]: allInventories.length
                }));
                setSubGroupTotalPages(prev => ({
                    ...prev,
                    [subGroupId]: Math.ceil(allInventories.length / 100)
                }));
                setSubGroupCurrentPage(prev => ({
                    ...prev,
                    [subGroupId]: 0
                }));
            }
            
            setIsSubGroupLoading(prev => ({ ...prev, [subGroupId]: false }));
        }
    };

    const handleSubGroupPageChange = (subGroupId, direction) => {
        setSubGroupCurrentPage(prev => {
            const current = prev[subGroupId] || 0;
            const total = subGroupTotalPages[subGroupId] || 1;
            const newPage = direction === 'next' ? current + 1 : current - 1;
            return {
                ...prev,
                [subGroupId]: Math.max(0, Math.min(total - 1, newPage))
            };
        });
        if (listRefs.current[subGroupId]) {
            listRefs.current[subGroupId].scrollTo(0);
        }
    };

    const getGroupInventoryCount = useCallback((subGroups) => {
        return subGroups.reduce((total, subGroup) => {
            return total + (subGroup.inventories?.length || 0);
        }, 0);
    }, []);

    const getTotalProductsInGroup = useCallback((subGroups) => {
        const uniqueProducts = new Set();
        subGroups.forEach(subGroup => {
            subGroup.inventories?.forEach(inv => {
                if (inv.productId) uniqueProducts.add(inv.productId);
            });
        });
        return uniqueProducts.size;
    }, []);

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

    // ✅ FIXED: Virtualized Inventory Row Component - Uses div instead of tr
    const InventoryRow = ({ index, style, data }) => {
        const { items, onViewHistory, onViewSummary } = data;
        const item = items[index];
        
        if (!item) return null;

        return (
            <div style={style} className="flex items-center bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 border-b border-gray-200 dark:border-gray-600">
                <div className="px-5 py-2 text-sm w-[5%] pl-16 flex-shrink-0">{index + 1}</div>
                <div className="px-5 py-2 text-sm w-[20%] flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="truncate">{item.productDescription || 'N/A'}</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 whitespace-nowrap">
                            Item
                        </span>
                    </div>
                </div>
                <div className="px-5 py-2 text-sm w-[10%] flex-shrink-0">{item.productId || 'N/A'}</div>
                <div className="px-5 py-2 text-sm w-[10%] flex-shrink-0">{item.locationName || 'N/A'}</div>
                <div className="px-5 py-2 text-sm w-[8%] flex-shrink-0">
                    <span className="font-semibold">{item.openingBalance || 0}</span>
                </div>
                <div className="px-5 py-2 text-sm w-[8%] flex-shrink-0">{item.purchase || 0}</div>
                <div className="px-5 py-2 text-sm w-[8%] flex-shrink-0">{item.sale || 0}</div>
                <div className="px-5 py-2 text-sm w-[8%] flex-shrink-0">{item.branchTransferInwards || 0}</div>
                <div className="px-5 py-2 text-sm w-[8%] flex-shrink-0">{item.branchTransferOutwards || 0}</div>
                <div className="px-5 py-2 text-sm w-[8%] flex-shrink-0">
                    <span className={`font-bold ${(item.closingBalance || 0) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {item.closingBalance || 0}
                    </span>
                </div>
                <div className="px-5 py-2 text-sm w-[8%] flex-shrink-0">{item.inProgressOrders || 0}</div>
                <div className="px-5 py-2 text-sm w-[8%] flex-shrink-0">
                    <button
                        onClick={() => onViewHistory(item)}
                        className="text-blue-500 hover:text-blue-700 underline text-xs whitespace-nowrap"
                    >
                        View History
                    </button>
                </div>
                <div className="px-5 py-2 text-sm w-[8%] flex-shrink-0">
                    <button
                        onClick={() => onViewSummary(item)}
                        className="text-green-500 hover:text-green-700 underline text-xs whitespace-nowrap"
                    >
                        View Summary
                    </button>
                </div>
            </div>
        );
    };

    // ✅ FIXED: Virtualized Inventory List Component - Uses div instead of table
    const VirtualizedInventoryList = ({ items, subGroupId, onViewHistory, onViewSummary }) => {
        const listRef = useRef(null);
        const currentPage = subGroupCurrentPage[subGroupId] || 0;
        const totalPages = subGroupTotalPages[subGroupId] || 1;
        const totalItems = subGroupTotalItems[subGroupId] || 0;
        
        const itemsPerPage = 100;
        const start = currentPage * itemsPerPage;
        const currentItems = items.slice(start, start + itemsPerPage);

        useEffect(() => {
            if (listRef.current) {
                listRefs.current[subGroupId] = listRef.current;
            }
        }, [subGroupId]);

        if (items.length === 0) {
            return (
                <div className="px-5 py-4 text-center text-gray-500 italic">
                    No inventory items found for this sub group
                </div>
            );
        }

        // ✅ Check if FixedSizeList is available
        if (!FixedSizeList) {
            // Fallback: Render without virtualization
            return (
                <div>
                    {totalItems > itemsPerPage && (
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-700">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                Showing {start + 1} - {Math.min(start + itemsPerPage, totalItems)} of {totalItems} items
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        if (currentPage > 0) {
                                            handleSubGroupPageChange(subGroupId, 'prev');
                                        }
                                    }}
                                    disabled={currentPage === 0}
                                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 rounded">
                                    Page {currentPage + 1} of {totalPages}
                                </span>
                                <button
                                    onClick={() => {
                                        if (currentPage < totalPages - 1) {
                                            handleSubGroupPageChange(subGroupId, 'next');
                                        }
                                    }}
                                    disabled={currentPage >= totalPages - 1}
                                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="max-h-[400px] overflow-y-auto">
                        {currentItems.map((item, idx) => (
                            <div key={idx} className="flex items-center bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 border-b border-gray-200 dark:border-gray-600">
                                <div className="px-5 py-2 text-sm w-[5%] pl-16 flex-shrink-0">{idx + 1}</div>
                                <div className="px-5 py-2 text-sm w-[20%] flex-shrink-0">
                                    <span className="truncate">{item.productDescription || 'N/A'}</span>
                                </div>
                                <div className="px-5 py-2 text-sm w-[10%] flex-shrink-0">{item.productId || 'N/A'}</div>
                                <div className="px-5 py-2 text-sm w-[10%] flex-shrink-0">{item.locationName || 'N/A'}</div>
                                <div className="px-5 py-2 text-sm w-[8%] flex-shrink-0">{item.openingBalance || 0}</div>
                                <div className="px-5 py-2 text-sm w-[8%] flex-shrink-0">{item.purchase || 0}</div>
                                <div className="px-5 py-2 text-sm w-[8%] flex-shrink-0">{item.sale || 0}</div>
                                <div className="px-5 py-2 text-sm w-[8%] flex-shrink-0">{item.branchTransferInwards || 0}</div>
                                <div className="px-5 py-2 text-sm w-[8%] flex-shrink-0">{item.branchTransferOutwards || 0}</div>
                                <div className="px-5 py-2 text-sm w-[8%] flex-shrink-0">
                                    <span className={`font-bold ${(item.closingBalance || 0) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {item.closingBalance || 0}
                                    </span>
                                </div>
                                <div className="px-5 py-2 text-sm w-[8%] flex-shrink-0">{item.inProgressOrders || 0}</div>
                                <div className="px-5 py-2 text-sm w-[8%] flex-shrink-0">
                                    <button onClick={() => onViewHistory(item)} className="text-blue-500 hover:text-blue-700 underline text-xs">View History</button>
                                </div>
                                <div className="px-5 py-2 text-sm w-[8%] flex-shrink-0">
                                    <button onClick={() => onViewSummary(item)} className="text-green-500 hover:text-green-700 underline text-xs">View Summary</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="w-full">
                {totalItems > itemsPerPage && (
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-700">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Showing {start + 1} - {Math.min(start + itemsPerPage, totalItems)} of {totalItems} items
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    if (currentPage > 0) {
                                        handleSubGroupPageChange(subGroupId, 'prev');
                                    }
                                }}
                                disabled={currentPage === 0}
                                className="px-3 py-1 text-sm bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                            >
                                Previous
                            </button>
                            <span className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 rounded">
                                Page {currentPage + 1} of {totalPages}
                            </span>
                            <button
                                onClick={() => {
                                    if (currentPage < totalPages - 1) {
                                        handleSubGroupPageChange(subGroupId, 'next');
                                    }
                                }}
                                disabled={currentPage >= totalPages - 1}
                                className="px-3 py-1 text-sm bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* ✅ Using div with fixed height instead of table */}
                <div style={{ height: '400px', width: '100%' }}>
                    <FixedSizeList
                        ref={listRef}
                        height={400}
                        itemCount={currentItems.length}
                        itemSize={48}
                        width="100%"
                        itemData={{
                            items: currentItems,
                            onViewHistory,
                            onViewSummary
                        }}
                    >
                        {InventoryRow}
                    </FixedSizeList>
                </div>
            </div>
        );
    };

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

    const PageLoadingSpinner = () => (
        <div className="absolute inset-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
            <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Loading page...</p>
            </div>
        </div>
    );

    // Recent History Modal
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
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
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

    // Inventory Summary Modal
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
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                </div>
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

    // ✅ FIXED: Render table rows with virtualization - Using td with div inside
    const renderTableRows = useMemo(() => {
        if (!inventoryData || inventoryData.length === 0) {
            return (
                <tr className="bg-white dark:bg-slate-700">
                    <td colSpan="13" className="px-5 py-5 text-center">No Data Found</td>
                </tr>
            );
        }

        const rows = [];

        inventoryData.forEach((group) => {
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
                group.subGroups.forEach((subGroup) => {
                    const isSubGroupExpanded = expandedSubGroups[subGroup.id];
                    const inventoryCount = subGroup.inventories?.length || 0;
                    const isLoading = isSubGroupLoading[subGroup.id];

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
                                            Inventory: {inventoryCount}
                                        </span>
                                        {isLoading && (
                                            <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></span>
                                        )}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    );

                    // If sub group is expanded, show virtualized inventory items
                    if (isSubGroupExpanded) {
                        const inventoryItems = subGroupInventoryData[subGroup.id] || [];
                        
                        // ✅ Table headers for the virtualized list - Now uses proper th elements
                        rows.push(
                            <tr key={`subgroup-headers-${subGroup.id}`} style={{ backgroundColor: 'rgb(71 85 105)' }}>
                                <th className="px-9 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white w-[5%]">
                                    S.No
                                </th>
                                <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white w-[20%]">
                                    Product Description
                                </th>
                                <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white w-[10%]">
                                    Product Id
                                </th>
                                <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white w-[10%]">
                                    Location
                                </th>
                                <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white w-[8%]">
                                    Opening Balance
                                </th>
                                <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white w-[8%]">
                                    Purchase
                                </th>
                                <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white w-[8%]">
                                    Sale
                                </th>
                                <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white w-[8%]">
                                    Transfer In
                                </th>
                                <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white w-[8%]">
                                    Transfer Out
                                </th>
                                <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white w-[8%]">
                                    Closing Balance
                                </th>
                                <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white w-[8%]">
                                    In Progress
                                </th>
                                <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white w-[8%]">
                                    Recent History
                                </th>
                                <th className="px-5 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap text-white w-[8%]">
                                    Summary
                                </th>
                            </tr>
                        );

                        // ✅ Virtualized list as a single cell spanning all columns
                        rows.push(
                            <tr key={`virtualized-${subGroup.id}`}>
                                <td colSpan="13" className="px-0 py-0">
                                    {isLoading ? (
                                        <div className="flex justify-center items-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            <span className="ml-2 text-gray-600">Loading inventory items...</span>
                                        </div>
                                    ) : (
                                        <VirtualizedInventoryList
                                            items={inventoryItems}
                                            subGroupId={subGroup.id}
                                            onViewHistory={(item) => {
                                                setSelectedInventory(item);
                                                fetchRecentHistory(item.productIntegerId, item.locationId);
                                                setIsRecentHistoryModalOpen(true);
                                            }}
                                            onViewSummary={(item) => {
                                                setSelectedInventory(item);
                                                fetchInventorySummary(item.locationId, item.productIntegerId);
                                                setIsSummaryModalOpen(true);
                                            }}
                                        />
                                    )}
                                </td>
                            </tr>
                        );
                    }
                });
            }
        });

        return rows;
    }, [inventoryData, expandedGroups, expandedSubGroups, subGroupInventoryData, isSubGroupLoading, getGroupInventoryCount, getTotalProductsInGroup]);

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
            
            {isLoading && <FullPageSpinner />}
            
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800 relative">
                {isPageLoading && <PageLoadingSpinner />}
                
                <div className="pt-5">
                    <div className='flex flex-row items-center justify-between w-full'>
                        <h2 className="text-xl text-slate-500 font-semibold w-full flex items-center justify-between">
                            <span>View INVENTORY</span>
                            <span className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/20 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800/30 text-sm font-semibold text-blue-700 dark:text-blue-300 ml-4">
                                Product Groups: {inventoryData.length}
                            </span>
                        </h2>
                    </div>

                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <tbody>
                                    {renderTableRows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination 
                        totalPages={pagination.totalPages} 
                        currentPage={pagination.currentPage} 
                        handlePageChange={handlePageChange} 
                    />
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