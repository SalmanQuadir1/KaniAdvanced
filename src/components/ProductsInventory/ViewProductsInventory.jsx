import React, { useState, useEffect } from 'react';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import { BASE_URL, GET_INVENTORY, customStyles as createCustomStyles } from '../../Constants/utils';
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
    const [invenn, setinvenn] = useState([]);
    const [inventory, setinventory] = useState([]);

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
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

    const ViewInventory = async (page, filters = {}) => {
        try {
            const response = await fetch(`${GET_INVENTORY}?page=${page || 1}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(filters)
            });
            const data = await response.json();
            console.log(data, "llk");

            setinvenn(data.content);
            setinventory(data.content);
            setPagination({
                totalItems: data?.totalElements,
                data: data?.content,
                totalPages: data?.totalPages,
                currentPage: data?.number + 1,
                itemsPerPage: data.size
            });
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch Product");
        }
    };

    useEffect(() => {
        ViewInventory();
    }, []);

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        ViewInventory(newPage);
    };

    const handleUpdate = (id) => {
        navigate(`/inventory/updateInventory/${id}`);
    };

    // API functions for the three modals
    const fetchRecentHistory = async (locationId, productId) => {
        setLoading(true);
        try {
            // Replace with your actual API endpoint
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
            // Replace with your actual API endpoint
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
        ViewInventory(pagination.currentPage, filters);
    };

    // Recent History Modal Component
    const RecentHistoryModal = ({ isOpen, onClose, data, loading, inventoryItem }) => {
        if (!isOpen) return null;

        // Convert single object to array if needed
        const dataArray = Array.isArray(data) ? data : data ? [data] : [];

        console.log(dataArray, "recent history data");

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
                                    Recent History
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                    <p className="mt-2 text-gray-500">Loading...</p>
                                </div>
                            ) : (
                                <div className="mt-2">
                                    <div className="overflow-x-auto max-h-96">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-slate-700 sticky top-0">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                                   
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                                   
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location Name</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {dataArray.length > 0 ? (
                                                    dataArray.map((item, idx) => (
                                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                                            <td className="px-4 py-2 text-sm">{idx + 1}</td>
                                                            
                                                            <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">
                                                                {item.productName || 'N/A'}
                                                            </td>
                                                           
                                                            <td className="px-4 py-2 text-sm">{item.locationName || 'N/A'}</td>
                                                            <td className="px-4 py-2 text-sm">
                                                                <span className="font-semibold text-blue-600">
                                                                    {item.quantity || 0}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-2 text-sm">
                                                                <span className={`font-semibold ${(item.available || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                    {item.available || 0}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-2 text-sm">
                                                                {item.lastUpdated ? new Date(item.lastUpdated).toLocaleString() : 'N/A'}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                                            No recent history found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="bg-gray-50 dark:bg-slate-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="button"
                                onClick={onClose}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-slate-600 text-base font-medium text-gray-700 dark:text-white hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            >
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

    console.log(data, "summary data");
    
    // Handle the response data structure
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
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                                <FiX size={24} />
                            </button>
                        </div>
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                <p className="mt-2 text-gray-500">Loading...</p>
                            </div>
                        ) : (
                            <div className="mt-2">
                                {/* Product Summary Cards */}
                                <div className="mb-6">
                                    <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3">Product Summary</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {/* <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <p className="text-sm text-gray-500">Product ID</p>
                                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                {summaryData.productId || inventoryItem?.productId || 'N/A'}
                                            </p>
                                        </div> */}
                                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <p className="text-sm text-gray-500">Product Name</p>
                                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                                {summaryData.productName || inventoryItem?.productDescription || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                            <p className="text-sm text-gray-500">Total Quantity</p>
                                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                {summaryData.totalQuantity || 0}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                            <p className="text-sm text-gray-500">Total Available</p>
                                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                                {summaryData.totalAvailable || 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Location-wise Details Table */}
                                <div>
                                    <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3">Location-wise Details</h4>
                                    <div className="overflow-x-auto max-h-96">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-slate-700 sticky top-0">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                                    {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location ID</th> */}
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location Name</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {locations.length > 0 ? (
                                                    locations.map((location, idx) => (
                                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                                            <td className="px-4 py-3 text-sm">{idx + 1}</td>
                                                            {/* <td className="px-4 py-3 text-sm">{location.locationId || 'N/A'}</td> */}
                                                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                                {location.locationName || 'N/A'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm">
                                                                <span className="font-semibold text-blue-600">
                                                                    {location.quantity || 0}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-sm">
                                                                <span className={`font-semibold ${(location.available || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                    {location.available || 0}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-sm">
                                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                                    (location.available || 0) > 0 
                                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                                }`}>
                                                                    {(location.available || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                                            No location data found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Summary Statistics */}
                                {locations.length > 0 && (
                                    <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div>
                                                <p className="text-xs text-gray-500">Total Locations</p>
                                                <p className="text-md font-semibold">{locations.length}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Locations with Stock</p>
                                                <p className="text-md font-semibold text-green-600">
                                                    {locations.filter(loc => (loc.available || 0) > 0).length}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Locations Out of Stock</p>
                                                <p className="text-md font-semibold text-red-600">
                                                    {locations.filter(loc => (loc.available || 0) === 0).length}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Average Stock per Location</p>
                                                <p className="text-md font-semibold">
                                                    {Math.round((summaryData.totalQuantity || 0) / (locations.length || 1))}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-slate-600 text-base font-medium text-gray-700 dark:text-white hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

    // Inventory Transactions Modal Component
    const InventoryTransactionsModal = ({ isOpen, onClose, data, loading, inventoryItem }) => {
    if (!isOpen) return null;

    // Convert single object to array if needed
    const transactionsArray = Array.isArray(data) ? data : data ? [data] : [];
    
    console.log(transactionsArray, "transactions data");
    
    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity z-[9998]" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full z-[9999] relative">
                    <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Inventory Transactions - {inventoryItem?.productDescription || transactionsArray[0]?.productName}
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                                <FiX size={24} />
                            </button>
                        </div>
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                <p className="mt-2 text-gray-500">Loading...</p>
                            </div>
                        ) : (
                            <div className="mt-2">
                                {transactionsArray.length > 0 && (
                                    <div className="mb-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                          
                                            <div>
                                                <p className="text-xs text-gray-500">Product Name</p>
                                                <p className="text-sm font-semibold">{transactionsArray[0]?.productName || inventoryItem?.productDescription}</p>
                                            </div>
                                            
                                            <div>
                                                <p className="text-xs text-gray-500">Location Name</p>
                                                <p className="text-sm font-semibold">{transactionsArray[0]?.locationName || inventoryItem?.location?.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="overflow-x-auto max-h-96">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-slate-700 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                               
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>

                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location Name</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {transactionsArray.length > 0 ? (
                                                transactionsArray.map((transaction, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                                        <td className="px-4 py-3 text-sm">{idx + 1}</td>
                                                       
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                            {transaction.productName || 'N/A'}
                                                        </td>
                                                       
                                                        <td className="px-4 py-3 text-sm">{transaction.locationName || 'N/A'}</td>
                                                        <td className="px-4 py-3 text-sm">
                                                            <span className="font-semibold text-blue-600">
                                                                {transaction.quantity || 0}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            <span className={`font-semibold ${(transaction.available || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {transaction.available || 0}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            {transaction.lastUpdated ? new Date(transaction.lastUpdated).toLocaleString() : 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                                (transaction.available || 0) > 0 
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                                    : (transaction.quantity || 0) > 0
                                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                                                            }`}>
                                                                {(transaction.available || 0) > 0 
                                                                    ? 'Available' 
                                                                    : (transaction.quantity || 0) > 0 
                                                                        ? 'In Transit' 
                                                                        : 'Out of Stock'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                                                        No transactions found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* Summary Statistics */}
                                {transactionsArray.length > 0 && (
                                    <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div>
                                                <p className="text-xs text-gray-500">Total Transactions</p>
                                                <p className="text-md font-semibold">{transactionsArray.length}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Total Quantity</p>
                                                <p className="text-md font-semibold text-blue-600">
                                                    {transactionsArray.reduce((sum, t) => sum + (t.quantity || 0), 0)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Total Available</p>
                                                <p className="text-md font-semibold text-green-600">
                                                    {transactionsArray.reduce((sum, t) => sum + (t.available || 0), 0)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Last Update</p>
                                                <p className="text-sm font-semibold">
                                                    {transactionsArray.length > 0 && transactionsArray[0]?.lastUpdated 
                                                        ? new Date(transactionsArray[0].lastUpdated).toLocaleDateString()
                                                        : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-slate-600 text-base font-medium text-gray-700 dark:text-white hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

    const renderTableRows = () => {
        if (!inventory || inventory.length === 0) {
            return (
                <tr className="bg-white dark:bg-slate-700 dark:text-white">
                    <td colSpan="15" className="px-5 py-5 border-b border-gray-200 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap text-center">No Data Found</p>
                    </td>
                </tr>
            );
        }

        const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage;

        return inventory?.map((item, index) => (
            <tr key={index} className='bg-white dark:bg-slate-700 dark:text-white'>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {startingSerialNumber + index + 1}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {item.productDescription}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {item.productId}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {item.location?.address}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {item.openingBalance}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {item.purchase}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {item.sale}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {item.branchTransferInwards}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {item.branchTransferOutwards}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {item.closingBalance}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {item.inProgressOrders}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <button
                        onClick={() => {
                            setSelectedInventory(item);
                            fetchRecentHistory(item.location?.id, item.id);
                            setIsRecentHistoryModalOpen(true);
                        }}
                        className="text-blue-500 hover:text-blue-700 font-medium underline"
                    >
                        View History
                    </button>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <button
                        onClick={() => {
                            setSelectedInventory(item);
                            fetchInventorySummary(item.location?.id, item.id);
                            setIsSummaryModalOpen(true);
                        }}
                        className="text-green-500 hover:text-green-700 font-medium underline"
                    >
                        View Summary
                    </button>
                </td>
                {/* <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <button
                        onClick={() => {
                            setSelectedInventory(item);
                            fetchInventoryTransactions(item.location?.id, item.id);
                            setIsTransactionsModalOpen(true);
                        }}
                        className="text-purple-500 hover:text-purple-700 font-medium underline"
                    >
                        View Transactions
                    </button>
                </td> */}
                {/* <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="flex text-gray-900 whitespace-no-wrap">
                        <FiEdit size={17} className='text-teal-500 hover:text-teal-700 mx-2 cursor-pointer' onClick={(e) => handleUpdate(item.id)} title='Edit Inventory' />  |
                        <FiTrash2 size={17} className='text-red-500 hover:text-red-700 mx-2 cursor-pointer' onClick={(e) => handleInventoryDelete(e, item?.id)} title='Delete Inventory' />
                    </p>
                </td> */}
            </tr>
        ));
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Inventory / View Inventory" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className='flex flex-row items-center justify-between w-full'>
                        <h2 className="text-xl text-slate-500 font-semibold w-full flex items-center justify-between">
                            <span>View INVENTORY</span>
                            <span className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/20 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800/30 text-sm font-semibold text-blue-700 dark:text-blue-300 ml-4">
                                COUNT: {pagination.totalItems}
                            </span>
                        </h2>
                    </div>
                    <div className='items-center justify-center'>
                        <Formik
                            initialValues={{
                                ProductId: '',
                                address: ""
                            }}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, values }) => (
                                <Form>
                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Product Id</label>
                                            <Field
                                                name="ProductId"
                                                component={ReactSelect}
                                                styles={customStyles}
                                                options={[{ label: 'View All Products', value: null }, ...formattedProductId]}
                                                placeholder="Select Product Id"
                                                value={formattedProductId.find(option => option.value === values.ProductId)}
                                                onChange={option => setFieldValue('ProductId', option ? option.value : '')}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Location</label>
                                            <Field
                                                name="address"
                                                component={ReactSelect}
                                                options={[{ label: 'View All Locations', value: null }, ...formattedLocation]}
                                                styles={customStyles}
                                                placeholder="Select Location"
                                                value={formattedLocation.find(option => option.value === values.address)}
                                                onChange={option => setFieldValue('address', option ? option.value : '')}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <button
                                            type="submit"
                                            className="bg-primary hover:bg-blue-600 text-white font-bold h-10 w-[150px] rounded-lg"
                                        >
                                            Search
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr className='bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SNO</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product Desc.</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product Id</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Opening Balance</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Purchase</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sale</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Branch Transfer Inward</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Branch Transfer Outward</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Closing Balance</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">In Progress Orders</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">View Recent History</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">View Inventory Summary</th>

                                        {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTableRows()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination totalPages={pagination.totalPages} currentPage={pagination.currentPage} handlePageChange={handlePageChange} />
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

            <InventoryTransactionsModal
                isOpen={isTransactionsModalOpen}
                onClose={() => setIsTransactionsModalOpen(false)}
                data={transactionsData}
                loading={loading}
                inventoryItem={selectedInventory}
            />
        </DefaultLayout>
    );
};

export default ViewProductsInventory;