import React, { useState, useEffect } from 'react';
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
            const response = await fetch(`${GET_INVENTORYYS}?page=${page || 0}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            const data = await response.json();
            console.log(data, "API Response");

            setInventoryData(data.content || []);
            setPagination({
                totalItems: data?.totalElements,
                data: data?.content,
                totalPages: data?.totalPages,
                currentPage: data?.number + 1,
                itemsPerPage: data.size
            });
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch Inventory");
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

    // Calculate total inventory count for a group
    const getGroupInventoryCount = (subGroups) => {
        return subGroups.reduce((total, subGroup) => {
            return total + (subGroup.inventories?.length || 0);
        }, 0);
    };

    // Calculate total products in group
    const getTotalProductsInGroup = (subGroups) => {
        const uniqueProducts = new Set();
        subGroups.forEach(subGroup => {
            subGroup.inventories?.forEach(inv => {
                if (inv.productId) uniqueProducts.add(inv.productId);
            });
        });
        return uniqueProducts.size;
    };

    // API functions for the three modals
    const fetchRecentHistory = async (productId,locationId) => {
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
        ViewInventory(pagination.currentPage, filters);
    };

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

    const renderTableRows = () => {
        if (!inventoryData || inventoryData.length === 0) {
            return (
                <tr className="bg-white dark:bg-slate-700">
                    <td colSpan="15" className="px-5 py-5 text-center">No Data Found</td>
                </tr>
            );
        }

        const rows = [];
        let serialNumber = 1;

        inventoryData.forEach((group, groupIndex) => {
            const isGroupExpanded = expandedGroups[group.id];
            const totalProductsInGroup = getTotalProductsInGroup(group.subGroups || []);
            const totalInventoryCount = getGroupInventoryCount(group.subGroups || []);

            // Product Group Row with Colspan
            rows.push(
                <tr key={`group-${group.id}`} className="bg-blue-50 dark:bg-blue-900/30 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50" onClick={() => toggleGroup(group.id)}>
                    <td colSpan="15" className="px-5 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {isGroupExpanded ? <FiChevronDown className="text-blue-600" /> : <FiChevronRight className="text-blue-600" />}
                                <span className="font-bold text-lg text-blue-800 dark:text-blue-300">
                                    {group.productGroupName}
                                </span>
                                {/* <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                    (Group ID: {group.id})
                                </span> */}
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
                    const inventoryCount = subGroup.inventories?.length || 0;

                    // Sub Group Row
                    rows.push(
                        <tr key={`subgroup-${subGroup.id}`} className="bg-gray-50 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => toggleSubGroup(subGroup.id)}>
                            <td colSpan="15" className="px-5 py-3 border-b border-gray-200 pl-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {isSubGroupExpanded ? <FiChevronDown className="text-gray-600" /> : <FiChevronRight className="text-gray-600" />}
                                        <span className="font-semibold text-md text-gray-700 dark:text-gray-300">
                                            {subGroup.productSubGroupName}
                                        </span>
                                        {/* <span className="text-xs text-gray-400">(ID: {subGroup.id})</span> */}
                                    </div>
                                    <div className="flex gap-3 text-xs">
                                        <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                                            Inventory: {inventoryCount}
                                        </span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    );

                    // If sub group is expanded, show inventory items
                    if (isSubGroupExpanded && subGroup.inventories && subGroup.inventories.length > 0) {
                        subGroup.inventories.forEach((item, idx) => {
                            rows.push(
                                <tr key={`inventory-${item.id}`} className="bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600">
                                    <td className="px-5 py-3 border-b text-sm pl-16">
                                        {serialNumber++}
                                    </td>
                                    <td className="px-5 py-3 border-b text-sm">
                                        {item.productDescription || 'N/A'}
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
                                            onClick={() => {
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
                                            onClick={() => {
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
                    } else if (isSubGroupExpanded && (!subGroup.inventories || subGroup.inventories.length === 0)) {
                        rows.push(
                            <tr key={`empty-${subGroup.id}`} className="bg-white dark:bg-slate-700">
                                <td colSpan="13" className="px-5 py-4 text-center text-gray-500 italic pl-16">
                                    No inventory items found for this sub group
                                </td>
                            </tr>
                        );
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
                                Product Groups: {inventoryData.length}
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
                                    {/* <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
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
                                    </div> */}
                                </Form>
                            )}
                        </Formik>
                    </div>

                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr className='bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                        <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase">S.No</th>
                                        <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase">Product Description</th>
                                        <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase">Product Id</th>
                                        <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase">Location</th>
                                        <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase">Opening Balance</th>
                                        <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase">Purchase</th>
                                        <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase">Sale</th>
                                        <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase">Transfer In</th>
                                        <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase">Transfer Out</th>
                                        <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase">Closing Balance</th>
                                        <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase">In Progress</th>
                                        <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase">Recent History</th>
                                        <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase">Summary</th>
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
        </DefaultLayout>
    );
};

export default ViewProductsInventory;