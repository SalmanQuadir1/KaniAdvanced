import React, { useState, useEffect } from 'react';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import { GET_INVENTORYY, customStyles as createCustomStyles } from '../../Constants/utils';
import { Field, Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ViewRecentTransactions = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const theme = useSelector(state => state?.persisted?.theme);
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10,
    });
    const [productOptions, setProductOptions] = useState([]);
    const [transactionTypeOptions] = useState([
        { label: 'All Types', value: '' },
        { label: 'PURCHASE', value: 'PURCHASE' },
        { label: 'SALE', value: 'SALE' },
        { label: 'BRANCH_TRANSFER_IN', value: 'BRANCH_TRANSFER_IN' },
        { label: 'BRANCH_TRANSFER_OUT', value: 'BRANCH_TRANSFER_OUT' },
        { label: 'ADJUSTMENT', value: 'ADJUSTMENT' },
    ]);

    const customStyles = createCustomStyles(theme?.mode);

    // Fetch transactions with pagination and filters
    const fetchTransactions = async (page = 1, filters = {}) => {
        try {
         

            const response = await fetch(`${GET_INVENTORYY}?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            const data = await response.json();
            if (response.ok) {
                setTransactions(data.content || []);
                setPagination({
                    totalItems: data.totalElements || 0,
                    data: data.content || [],
                    totalPages: data.totalPages || 0,
                    currentPage: (data.number || 0) + 1,
                    itemsPerPage: data.size || pagination.itemsPerPage,
                });
            } else {
                toast.error(data.message || "Failed to fetch transactions");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while fetching transactions");
        }
    };

    // Fetch unique product IDs for filter dropdown (optional – you can also fetch from a separate API)
    const fetchProductOptions = async () => {
        try {
            // Assuming there is an endpoint to get distinct product IDs/names
            // If not, you can populate from transaction data after fetch, but a dedicated endpoint is better.
            // Here we'll just extract from existing transactions, but for initial load you might want a separate call.
            const response = await fetch(`${GET_TRANSACTIONS_URL}/distinct-products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const products = await response.json();
                setProductOptions(products.map(p => ({ label: `${p.productName} (${p.productId})`, value: p.productId })));
            }
        } catch (err) {
            console.warn("Could not fetch product options", err);
        }
    };

    useEffect(() => {
        fetchTransactions(1);
        fetchProductOptions();
    }, []);

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
        // You need to re-fetch with current filters; we'll store filters in state if needed
        // For simplicity, call fetchTransactions with new page and current filter values (you can lift filter state)
        fetchTransactions(newPage);
    };

    const handleSubmit = (values) => {
        const filters = {
            productId: values.productId || undefined,
            transactionType: values.transactionType || undefined,
        };
        fetchTransactions(1, filters);
    };

    const renderTableRows = () => {
        if (!transactions.length) {
            return (
                <tr className="bg-white dark:bg-slate-700 dark:text-white">
                    <td colSpan="9" className="px-5 py-5 border-b border-gray-200 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap text-center">No transactions found</p>
                    </td>
                </tr>
            );
        }
        const startSerial = (pagination.currentPage - 1) * pagination.itemsPerPage;
        return transactions.map((item, idx) => (
            <tr key={item.id} className="bg-white dark:bg-slate-700 dark:text-white">
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{startSerial + idx + 1}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{item.productName || '-'}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{item.productId || '-'}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    {item.transactionDate ? new Date(item.transactionDate).toLocaleDateString() : '-'}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{item.transactionType || '-'}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{item.quantity ?? '-'}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{item.rate ?? '-'}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{item.value ?? '-'}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{item.runningBalance ?? '-'}</td>
             </tr>
        ));
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Inventory / Recent Transactions" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className="flex flex-row items-center justify-between w-full">
                        <h2 className="text-xl text-slate-500 font-semibold w-full flex items-center justify-between">
                            <span>Recent Stock Transactions</span>
                            <span className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/20 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800/30 text-sm font-semibold text-blue-700 dark:text-blue-300 ml-4">
                                TOTAL: {pagination.totalItems}
                            </span>
                        </h2>
                    </div>

                 

                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr className="bg-slate-300 dark:bg-slate-700 dark:text-white">
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SNO</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product Name</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product ID</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Transaction Date</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Quantity</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rate</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Value</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Running Balance</th>
                                    </tr>
                                </thead>
                                <tbody>{renderTableRows()}</tbody>
                             </table>
                        </div>
                        {pagination.totalPages > 0 && (
                            <Pagination
                                totalPages={pagination.totalPages}
                                currentPage={pagination.currentPage}
                                handlePageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default ViewRecentTransactions;