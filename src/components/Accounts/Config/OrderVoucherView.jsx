import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import Breadcrumb from '../../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
import ReactSelect from 'react-select';
import { FiEdit, FiTrash2, FiFilter, FiEye, FiFileText } from 'react-icons/fi';
import Pagination from '../../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SEARCH_OrderVoucher_URL, customStyles as createCustomStyles } from '../../../Constants/utils';

const OrderVoucherView = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const [filter, setfilter] = useState('')
    const theme = useSelector(state => state?.persisted?.theme);

    // NEW: Filter state for showing orders with/without vouchers
    const [voucherFilter, setVoucherFilter] = useState('all'); // 'all', 'with-voucher', 'without-voucher'

    // NEW: State for modals
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrdersWithVouchers, setShowOrdersWithVouchers] = useState(false);
    const [showOrdersWithoutVouchers, setShowOrdersWithoutVouchers] = useState(false);

    const voucherTypeOptions = [
        { value: 'SALES', label: 'Sales' },
        { value: 'PURCHASE', label: 'Purchase' },
        { value: 'PAYMENT', label: 'Payment' },
        { value: 'RECEIPT', label: 'Receipt' },
        { value: 'JOURNAL', label: 'Journal' }
    ];

    const customStyles = createCustomStyles(theme?.mode);
    const { token } = currentUser;
    const [OrderVouchers, setOrderVouchers] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const navigate = useNavigate();

    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10,
    });

    const getOrderVoucher = async (page = 1, filters = {}) => {
        try {
            const response = await fetch(`${SEARCH_OrderVoucher_URL}?filter=${voucherFilter}&page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },

            });

            const data = await response.json();

            console.log(data, "umerrr");


            if (data?.content) {
                setOrderVouchers(data.content);
                // Apply voucher filter immediately after fetching
                applyVoucherFilter(data.content, voucherFilter);
            } else {
                setOrderVouchers([]);
                setFilteredOrders([]);
            }

            setPagination({
                totalItems: data?.totalElements || 0,
                totalPages: data?.totalPages || 0,
                currentPage: data?.number + 1 || 1,
                itemsPerPage: data?.size || 10,
            });
        } catch (error) {
            console.error("Error fetching OrderVouchers:", error);
            toast.error("Failed to fetch OrderVouchers");
            setOrderVouchers([]);
            setFilteredOrders([]);
        }
    };




    // NEW: Function to apply voucher filter
    const applyVoucherFilter = (orders, filterType) => {
        let filtered = [];

        switch (filterType) {
            case 'with-voucher':
                filtered = orders.filter(order => order.hasVoucher === true || order.voucherId);
                break;
            case 'without-voucher':
                filtered = orders.filter(order => !order.hasVoucher && !order.voucherId);
                break;
            default: // 'all'
                filtered = orders;
                break;
        }

        setFilteredOrders(filtered);
    };

    // NEW: Handle filter change
    const handleVoucherFilterChange = (newFilter) => {
        setVoucherFilter(newFilter);
        applyVoucherFilter(OrderVouchers, newFilter);
    };

    useEffect(() => {
        getOrderVoucher(pagination.currentPage);
    }, []);

    // NEW: Watch for changes in OrderVouchers and apply filter
    useEffect(() => {
        if (OrderVouchers.length > 0) {
            applyVoucherFilter(OrderVouchers, voucherFilter);
        }
    }, [OrderVouchers, voucherFilter]);

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };



    // NEW: Open modals
    const openOrdersWithVouchersModal = (order) => {

        setSelectedOrder(order);
        setShowOrdersWithVouchers(true);
    };
    console.log(selectedOrder, "jhjh");

    const openOrdersWithoutVouchersModal = (order) => {
        setSelectedOrder(order);
        setShowOrdersWithoutVouchers(true);
    };

    // NEW: Close modals
    const closeModals = () => {
        setSelectedOrder(null);
        setShowOrdersWithVouchers(false);
        setShowOrdersWithoutVouchers(false);
    };

    const renderTableRows = () => {
        // Use filteredOrders instead of OrderVouchers
        const dataToShow = filteredOrders.length > 0 ? filteredOrders : OrderVouchers;

        if (!dataToShow || dataToShow.length === 0) {
            return (
                <tr className='bg-white dark:bg-slate-700 dark:text-white'>
                    <td colSpan="10" className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                        No OrderVoucher Entries Found
                    </td>
                </tr>
            );
        }

        return dataToShow.map((entry, index) => {
            const serialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + index + 1;
            const hasVoucher = entry.hasVoucher === true || entry.voucherId;

            return (
                <tr key={entry.id} className='bg-white dark:bg-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-600'>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {serialNumber}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {new Date(entry.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {entry.orderNo}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {entry.status}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {entry.fullVoucherCreated ? "Yes" : "No"}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {entry.totalVoucherAmount || 0}
                    </td>

                    {/* 
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {entry.totalVoucherAmount?.length > 0 ? (
                            <div className="flex flex-col">
                                {entry.paymentDetails.map((payment, idx) => (
                                    <div key={idx} className="py-1">
                                        {payment.totalVoucherAmount?.toFixed(2) || '0.00'}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            '0.00'
                        )}
                    </td> */}
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        <div className="flex space-x-3">
                            {/* NEW: View buttons for both types */}
                            <button
                                onClick={() => openOrdersWithVouchersModal(entry)}
                                className="flex items-center text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1 rounded text-sm transition-colors"
                                title="View Orders with Vouchers"
                            >
                                <FiFileText className="mr-1" />
                                With Vouchers
                            </button>
                            <button
                                onClick={() => openOrdersWithoutVouchersModal(entry)}
                                className="flex items-center text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded text-sm transition-colors"
                                title="View Orders without Vouchers"
                            >
                                <FiEye className="mr-1" />
                                Without Vouchers
                            </button>
                        </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        <div className="flex">
                            <FiEdit
                                size={17}
                                className="text-teal-500 hover:text-teal-700 mx-2 cursor-pointer"
                                onClick={() => navigate(`/OrderVoucher/edit/${entry.id}`)}
                                title="Edit Entry"
                            />
                            <FiTrash2
                                size={17}
                                className="text-red-500 hover:text-red-700 mx-2 cursor-pointer"
                                onClick={() => handleDelete(entry.id)}
                                title="Delete Entry"
                            />
                        </div>
                    </td>
                </tr>
            );
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            try {
                const response = await fetch(`/api/OrderVoucher/${id}`, {
                    method: 'DELETE',
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    toast.success("Entry deleted successfully");
                    getOrderVoucher(pagination.currentPage);
                } else {
                    const error = await response.json();
                    toast.error(error.message || "Failed to delete entry");
                }
            } catch (error) {
                console.error("Delete error:", error);
                toast.error("An error occurred while deleting");
            }
        }
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="OrderVoucher / View OrderVoucher" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className='flex justify-between items-center'>
                        <h2 className="text-xl font-semibold leading-tight dark:text-white">View OrderVoucher</h2>

                        {/* NEW: Filter buttons */}
                        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-slate-700 p-2 rounded-lg">
                            <FiFilter className="text-gray-600 dark:text-gray-300" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Voucher:</span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleVoucherFilterChange('all')}
                                    className={`px-3 py-1 text-sm rounded transition-colors ${voucherFilter === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-500'
                                        }`}
                                >
                                    All Orders
                                </button>
                                <button
                                    onClick={() => handleVoucherFilterChange('with-voucher')}
                                    className={`px-3 py-1 text-sm rounded transition-colors ${voucherFilter === 'with-voucher'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-500'
                                        }`}
                                >
                                    With Vouchers
                                </button>
                                <button
                                    onClick={() => handleVoucherFilterChange('without-voucher')}
                                    className={`px-3 py-1 text-sm rounded transition-colors ${voucherFilter === 'without-voucher'
                                        ? 'bg-yellow-600 text-white'
                                        : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-500'
                                        }`}
                                >
                                    Without Vouchers
                                </button>
                            </div>
                        </div>
                    </div>



                    {/* NEW: Filter status display */}
                    <div className="mt-4 mb-2">
                        {voucherFilter === 'all' && (
                            <div className="text-blue-600 dark:text-blue-400 text-sm">
                                Showing all orders ({filteredOrders.length} of {OrderVouchers.length})
                            </div>
                        )}
                        {voucherFilter === 'with-voucher' && (
                            <div className="text-green-600 dark:text-green-400 text-sm">
                                Showing orders with vouchers ({filteredOrders.length} found)
                            </div>
                        )}
                        {voucherFilter === 'without-voucher' && (
                            <div className="text-yellow-600 dark:text-yellow-400 text-sm">
                                Showing orders without vouchers ({filteredOrders.length} found)
                            </div>
                        )}
                    </div>

                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-6 overflow-x-auto">
                        <div className="inline-block min-w-full shadow-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                <thead>
                                    <tr className='bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800 dark:to-slate-900'>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">S.No</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">orderNo</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">status</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Full Voucher Created</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Voucher Amount</th>

                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">View Orders</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTableRows()}
                                </tbody>
                            </table>
                        </div>

                        {pagination.totalPages > 1 && (
                            <Pagination
                                totalPages={pagination.totalPages}
                                currentPage={pagination.currentPage}
                                handlePageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* NEW: Modal for Orders with Vouchers */}
            {showOrdersWithVouchers && selectedOrder && (
                <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 bg-black ml-[200px] bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b dark:border-slate-700">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Orders with Vouchers
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Order ID: {selectedOrder.id || selectedOrder.orderNumber}
                                </p>
                            </div>
                            <button
                                onClick={closeModals}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                            {/* Order Summary */}


                            {/* Products List */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                        Products / Services
                                    </h4>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Total Items: {selectedOrder.products?.length || selectedOrder.items?.length || 0}
                                    </span>
                                </div>

                                {/* Check if products exist */}
                                {selectedOrder.productsWithVoucher && selectedOrder.productsWithVoucher.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 border-b border-gray-200 dark:border-slate-700">
                                                <tr>
                                                    <th className="px-6 py-4 text-left">
                                                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            #
                                                        </span>
                                                    </th>

                                                    <th className="px-6 py-4 text-left">
                                                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            Product Name
                                                        </span>
                                                    </th>

                                                    <th className="px-6 py-4 text-left">
                                                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            Quantity
                                                        </span>
                                                    </th>

                                                    <th className="px-6 py-4 text-left">
                                                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            <span className="inline-flex items-center">
                                                                Voucher Amount
                                                                <svg className="w-3 h-3 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                                                </svg>
                                                            </span>
                                                        </span>
                                                    </th>

                                                    <th className="px-6 py-4 text-left">
                                                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            <span className="inline-flex items-center">
                                                                Voucher Creation Date
                                                                <svg className="w-3 h-3 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                                </svg>
                                                            </span>
                                                        </span>
                                                    </th>

                                                    <th className="px-6 py-4 text-left">
                                                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            <span className="inline-flex items-center">
                                                                Client Shipping Date
                                                                <svg className="w-3 h-3 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                                </svg>
                                                            </span>
                                                        </span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                                                {selectedOrder.productsWithVoucher.map((product, index) => (
                                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                                                            {index + 1}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                            {product.name || product.productName || 'N/A'}
                                                        </td>

                                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                                                            {product.clientOrderQuantity || 1}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                                                            ₹{(product.voucherAmount || product.voucherValue || 0).toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                                                            {new Date(product.voucherCreationDate).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                                                            {product.clientShippingDate || 0}
                                                        </td>
                                                        {/* <td className="px-4 py-3 text-sm font-semibold text-green-600">
                                                            ₹{((product.quantity || 1) * (product.unitPrice || product.price || 0)).toFixed(2)}
                                                        </td> */}
                                                    </tr>
                                                ))}
                                            </tbody>
                                            {/* <tfoot className="bg-gray-50 dark:bg-slate-900">
                                                <tr>
                                                    <td colSpan="5" className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Subtotal:
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">
                                                        ₹{selectedOrder.products.reduce((sum, product) =>
                                                            sum + ((product.quantity || 1) * (product.unitPrice || product.price || 0)), 0
                                                        ).toFixed(2)}
                                                    </td>
                                                </tr>
                                                {selectedOrder.tax && selectedOrder.tax > 0 && (
                                                    <tr>
                                                        <td colSpan="5" className="px-4 py-2 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Tax ({selectedOrder.taxRate || 18}%):
                                                        </td>
                                                        <td className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white">
                                                            ₹{selectedOrder.tax.toFixed(2)}
                                                        </td>
                                                    </tr>
                                                )}
                                                <tr>
                                                    <td colSpan="5" className="px-4 py-3 text-right text-lg font-bold text-gray-900 dark:text-white">
                                                        Total:
                                                    </td>
                                                    <td className="px-4 py-3 text-lg font-bold text-green-600">
                                                        ₹{(selectedOrder.totalAmount || selectedOrder.debitAmount || selectedOrder.creditAmount || 0).toFixed(2)}
                                                    </td>
                                                </tr>
                                            </tfoot> */}
                                        </table>
                                    </div>
                                ) : selectedOrder.items && selectedOrder.items.length > 0 ? (
                                    // Alternative structure: items array
                                    <div className="space-y-3">
                                        {selectedOrder.items.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        ₹{(item.amount || item.value || 0).toFixed(2)}
                                                    </p>
                                                    {item.quantity && (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {item.quantity} × ₹{(item.unitPrice || item.amount || 0).toFixed(2)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    // If no products/items structure found
                                    <div className="text-center py-8 bg-gray-50 dark:bg-slate-900 rounded-lg">
                                        <p className="text-gray-500 dark:text-gray-400">No product details available</p>
                                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                                            This order doesn't have detailed product information
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Associated Vouchers */}
                            {selectedOrder.vouchers && selectedOrder.vouchers.length > 0 && (
                                <div className="mt-8">
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                        Associated Vouchers ({selectedOrder.vouchers.length})
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedOrder.vouchers.map((voucher, index) => (
                                            <div key={index} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            Voucher: {voucher.voucherNumber}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Type: {voucher.type} | Date: {new Date(voucher.date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-sm font-medium rounded-full">
                                                        ₹{voucher.amount?.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center p-6 border-t dark:border-slate-700">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Last updated: {new Date(selectedOrder.updatedAt || selectedOrder.date).toLocaleString()}
                            </div>
                            <div className="flex space-x-3">
                            
                                <button
                                    onClick={closeModals}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* NEW: Modal for Orders without Vouchers */}
            {showOrdersWithoutVouchers && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b dark:border-slate-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Orders without Vouchers
                            </h3>
                            <button
                                onClick={closeModals}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                            >
                                &times;
                            </button>
                        </div>


                        {selectedOrder.productsWithoutVoucher && selectedOrder.productsWithoutVoucher.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                    <thead className="bg-gray-100 dark:bg-slate-900">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">#</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Product Name</th>

                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Client Shipping Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Product Status</th>

                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                                        {selectedOrder.productsWithoutVoucher.map((product, index) => (
                                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                    {product.name || product.productName || 'N/A'}
                                                </td>

                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                                                    {product.clientOrderQuantity || 1}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                                                    {new Date(product.clientShippingDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                                                    {(product.productStatus)}
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                    {/* <tfoot className="bg-gray-50 dark:bg-slate-900">
                                                <tr>
                                                    <td colSpan="5" className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Subtotal:
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">
                                                        ₹{selectedOrder.products.reduce((sum, product) =>
                                                            sum + ((product.quantity || 1) * (product.unitPrice || product.price || 0)), 0
                                                        ).toFixed(2)}
                                                    </td>
                                                </tr>
                                                {selectedOrder.tax && selectedOrder.tax > 0 && (
                                                    <tr>
                                                        <td colSpan="5" className="px-4 py-2 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Tax ({selectedOrder.taxRate || 18}%):
                                                        </td>
                                                        <td className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white">
                                                            ₹{selectedOrder.tax.toFixed(2)}
                                                        </td>
                                                    </tr>
                                                )}
                                                <tr>
                                                    <td colSpan="5" className="px-4 py-3 text-right text-lg font-bold text-gray-900 dark:text-white">
                                                        Total:
                                                    </td>
                                                    <td className="px-4 py-3 text-lg font-bold text-green-600">
                                                        ₹{(selectedOrder.totalAmount || selectedOrder.debitAmount || selectedOrder.creditAmount || 0).toFixed(2)}
                                                    </td>
                                                </tr>
                                            </tfoot> */}
                                </table>
                            </div>
                        ) : selectedOrder.items && selectedOrder.items.length > 0 ? (
                            // Alternative structure: items array
                            <div className="space-y-3">
                                {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                ₹{(item.amount || item.value || 0).toFixed(2)}
                                            </p>
                                            {item.quantity && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {item.quantity} × ₹{(item.unitPrice || item.amount || 0).toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // If no products/items structure found
                            <div className="text-center py-8 bg-gray-50 dark:bg-slate-900 rounded-lg">
                                <p className="text-gray-500 dark:text-gray-400">No product details available</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                                    This order doesn't have detailed product information
                                </p>
                            </div>
                        )}


                        {/* <div className="flex justify-end space-x-4 p-6 border-t dark:border-slate-700">
                            <button
                                onClick={() => navigate(`/OrderVoucher/edit/${selectedOrder.id}`)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create Voucher
                            </button>
                            <button
                                onClick={closeModals}
                                className="px-6 py-2 bg-gray-300 dark:bg-slate-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-slate-500 transition-colors"
                            >
                                Close
                            </button>
                        </div> */}
                    </div>
                </div>
            )}
        </DefaultLayout>
    );
};

export default OrderVoucherView;