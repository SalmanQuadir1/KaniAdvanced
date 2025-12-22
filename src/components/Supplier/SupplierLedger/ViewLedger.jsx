import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import Breadcrumb from '../../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
//  import Flatpickr from 'react-flatpickr';
import { VIEW_SUPPLIER_LEDGER, VIEW_SUPPLIER_LEDGERBYID, } from "../../../Constants/utils";
import ReactSelect from 'react-select';
import useOrder from '../../../hooks/useOrder';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Pagination from '../../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../../Constants/utils';
import { MdCreateNewFolder } from "react-icons/md";




const productgrp = [
    { value: 'BrandA', label: 'Brand A' },
    { value: 'BrandB', label: 'Brand B' },
    { value: 'BrandC', label: 'Brand C' },
];


const ViewLedger = () => {

    const { handleUpdate, getLedgerNumber, OrderNo, getSupplier, productId,
        getprodId, supplier, getCustomer, customer } = useOrder();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const theme = useSelector(state => state?.persisted?.theme);
    const [isLoading, setisLoading] = useState(false)
    const customStyles = createCustomStyles(theme?.mode);
    const [prodIdOptions, setprodIdOptions] = useState([])
    useEffect(() => {

        getSupplier();



    }, []);



    const { token } = currentUser;

    console.log(productId, "huhuuhuuuuuuuuuuuuuuuuu");

    const [Ledger, setLedger] = useState()

    const [supplierNameOptions, setsupplierNameOptions] = useState([])



    // const supplier = useSelector(state => state?.nonPersisted?.supplier);
    const Order = useSelector(state => state?.nonPersisted?.Ledger);
    const navigate = useNavigate();


    console.log(supplier, customer, productId, "LedgerNo");



    const formattedSupplier = supplier.map(supplier => ({
        label: supplier.name,
        value: supplier.name
    }));
    const LedgerType = [
        { value: 'supplier', label: 'supplier' },
        { value: 'customer', label: 'customer' },

    ];



    const [IsLEDGERModalOpen, setIsLEDGERModalOpen] = useState(false)




    const [SelectedLEDGERData, setSelectedLEDGERData] = useState([])




    console.log(supplierNameOptions, "heyyy");


    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
    });


    useEffect(() => {
        if (supplier.data) {
            const formattedOptions = supplier.data.map(supp => ({
                value: supp.id,
                label: supp?.name,
                supplierNameObject: supp,
                suplierid: { id: supp.id }
            }));
            setsupplierNameOptions(formattedOptions);
        }
    }, [supplier.data]);




    const getLedger = async (page, filters = {}) => {
        console.log(filters, "filterssssssssssssssssssssssssssssssssssssssss");
        console.log("Fetching Ledgers for page", page); // Log the page number being requested

        try {
            const response = await fetch(`${VIEW_SUPPLIER_LEDGER}?page=${page || 0}`, {
                method: "POST", // GET method
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(filters)
            });

            const textResponse = await response.text();

            console.log(textResponse, "japaaaaaaaaaaaaaaaaaan");

            // Get the raw text response
            // Log raw response before parsing   

            // Try parsing the response only if it's valid JSON
            try {
                const data = JSON.parse(textResponse); // Try parsing as JSON
                console.log("Parsed Response:", data);

                if (data) {
                    setLedger(data?.content); // Update Ledgers state
                } else {
                    console.log("No Ledgers found in the response");
                    setLedger([]); // Set an empty state
                }

                // Update pagination state
                setPagination({
                    totalItems: data?.totalElements || 0,
                    data: data?.content || [],
                    totalPages: data?.totalPages || 0,
                    currentPage: data?.number + 1 || 1,
                    itemsPerPage: data?.size || 0,
                });
            } catch (parseError) {
                console.error("Error parsing response as JSON:", parseError);
                toast.error("Invalid response format.");
            }
        } catch (error) {
            console.error("Error fetching Ledgers:", error);
            toast.error("Failed to fetch Ledgers");
            setLedger([]); // Reset to an empty state in case of an error
        }
    };

    useEffect(() => {
        getLedger()
    }, [])

    const handlePageChange = (newPage) => {
        console.log("Page change requested:", newPage);

        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        getLedger(newPage - 1); // Correct function name and 1-indexed for user interaction
    };

    console.log(Ledger, "heyLedger");




    const renderTableRows = () => {

        if (!Ledger) {
            return (
                <tr className='bg-white dark:bg-slate-700 dark:text-white'>
                    <td colSpan="6" className="px-5 py-5 bLedger-b bLedger-gray-200 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap text-center">No Ledger Found</p>
                    </td>
                </tr>
            );
        }

        const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

        const handleDelete = async (e, id) => {
            e.preventDefault();
            try {
                const response = await fetch(`${DELETE_Ledger_URL}/${id}`, { // Correct API endpoint
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    toast.success(`Ledger Deleted Successfully !!`);

                    // Check if the current page becomes empty
                    const isCurrentPageEmpty = Ledger.length === 1;

                    if (isCurrentPageEmpty && pagination.currentPage > 1) {
                        const previousPage = pagination.currentPage - 1;
                        handlePageChange(previousPage); // Go to the previous page if current page becomes empty
                    } else {
                        getLedger(pagination.currentPage); // Refresh Ledgers on the current page
                    }
                } else {
                    toast.error(`${data.errorMessage}`);
                }
            } catch (error) {
                console.error(error);
                toast.error("An error occurred");
            }
        };


        const openLEDGERModal = (EntriesData) => {
            console.log(EntriesData, "llllllllllllllllllllll888888888888888888888888888");

            if (EntriesData) {
                setSelectedLEDGERData(EntriesData);
                setIsLEDGERModalOpen(true);
            } else {
                toast.error("Supplier data not found");
            }
        };
        console.log(SelectedLEDGERData, "mmmmmmmmmmmmmmmmmmmmmmmmmuuuuuuuuuuuuuuuuuuuuu");


        // console.log(selectedBOMData, "jijiji");



        console.log(Ledger, "jumping");
        console.log(SelectedLEDGERData, "l");

        return Ledger.map((item, index) => (

            <tr key={index} className='bg-white dark:bg-slate-700 dark:text-white'>
                <td className="px-5 py-5 bLedger-b bLedger-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{startingSerialNumber + index}</p>
                </td>


                <td className="px-5 py-5 bLedger-b bLedger-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item?.supplierName || item?.customerName || item?.name}</p>
                </td>
                <td className="px-5 py-5 bLedger-b bLedger-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item?.groupName} </p>
                </td>
                {
                    item.supplierName ? (
                        <td className="px-5 py-5 bLedger-b bLedger-gray-200 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">Supplier</p>
                        </td>
                    ) : item.customerName ? (
                        <td className="px-5 py-5 bLedger-b bLedger-gray-200 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">Customer</p>
                        </td>
                    ) : <td className="px-5 py-5 bLedger-b bLedger-gray-200 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">null</p>
                    </td>
                }
                <td className="px-5 py-5  text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-900">{item?.openingBalances}</span>
                        <span className="text-gray-500">|</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item?.typeOfOpeningBalance?.toLowerCase() === 'credit'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                            }`}>
                            {item?.typeOfOpeningBalance}
                        </span>
                    </div>
                </td>
                <td className="px-5 py-5  text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-900">{item?.previousOpBalance}</span>
                        <span className="text-gray-500">|</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item?.previousOpType?.toLowerCase() === 'credit'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                            }`}>
                            {item?.previousOpType}
                        </span>
                    </div>
                </td>

                <td>
                    <span onClick={() => openLEDGERModal(item)} className="bg-green-100 text-green-800 text-[10px] font-medium me-2 text-center py-2 px-4 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-pointer w-[210px]"> VIEW LEDGER</span>
                </td>
                {/* <td className="px-5 py-5 bLedger-b bLedger-gray-200 text-sm">
                    {item.products &&
                        item.products.map((prodId, index) => (
                            <p key={index} className="text-gray-900 whitespace-nowrap">
                                {prodId?.productId}
                            </p>
                        ))}
                </td> */}

                {/* <td className="px-5 py-5 bLedger-b bLedger-gray-200 text-sm">
                    {item.products &&
                        item.products.map((prodId, index) => (
                            <p key={index} className="text-gray-900 whitespace-nowrap">
                                {prodId.productStatus}
                            </p>
                        ))}
                </td> */}










                <td className="px-5 py-5 bLedger-b bLedger-gray-200 text-sm">
                    <p className="flex text-gray-900 whitespace-no-wrap">
                        <FiEdit
                            size={17}
                            className="text-teal-500 hover:text-teal-700 mx-2"
                            onClick={() => {
                                let queryParam = '';
                                if (item.supplierName) {
                                    queryParam = `supplier=${item?.supplierId}`;
                                } else if (item.customerName) {
                                    queryParam = `customer=${item?.customerId}`;
                                }

                                navigate(`/Ledger/updateLedger/${item?.ledgerId}${queryParam ? `?${queryParam}` : ''}`);
                            }}



                            title="Edit Ledger"
                        />

                        <FiTrash2
                            size={17}
                            className="text-red-500 hover:text-red-700 mx-2"
                            onClick={(e) => handleDelete(e, item?.id)}
                            title="Delete Product"
                        />
                    </p>
                </td>

            </tr>
        ));
    };


    const handleSubmit = (values) => {

        console.log(values, "valiiiiii");
        const filters = {





            // name: values.supplierName || undefined,
            type: values?.type || undefined


        };
        getLedger(pagination.currentPage - 1, filters);
        // ViewInventory(pagination.currentPage, filters);
    };

    console.log(prodIdOptions, "llkkllkk");
    const closeLEDGERModal = () => {
        setIsLEDGERModalOpen(false);
        setSelectedLEDGERData(null);
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Ledger/ View Ledger" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className='flex justify-between'>
                        <h2 className="text-xl font-semibold leading-tight">View Ledger</h2>
                        {/* <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success dark:bg-white dark:text-slate-800`}>
                            TOTAL PRODUCTS: {pagination.totalItems}
                        </p> */}
                    </div>
                    {IsLEDGERModalOpen && SelectedLEDGERData && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999] p-4">
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[85vh] flex flex-col overflow-hidden">
                                {/* Modal Header */}
                                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                        LEDGER DETAILS
                                    </h2>
                                    <button
                                        onClick={closeLEDGERModal}
                                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold bg-gray-100 dark:bg-slate-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <div className="flex-1 overflow-auto p-6">
                                    {/* Summary Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">


                                        <div className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                                            <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">Total Credit</h3>
                                            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                                ₹{SelectedLEDGERData?.ledgerPaymentEntries.reduce((sum, entry) => sum + (parseFloat(entry.credit) || 0), 0).toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
                                            <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Total Debit</h3>
                                            <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                                                ₹{SelectedLEDGERData?.ledgerPaymentEntries.reduce((sum, entry) => sum + (parseFloat(entry.debit) || 0), 0).toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
                                            <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Start Opening Bal</h3>
                                            <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                                                ₹{SelectedLEDGERData?.previousOpBalance?.toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                                            <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-1">Net Balance</h3>
                                            <div className="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                                                <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-1">Opening Balance</h3>
                                                <p className={`text-2xl font-bold ${SelectedLEDGERData?.typeOfOpeningBalance?.toLowerCase() === 'credit'
                                                    ? 'text-red-600 dark:text-red-400'
                                                    : 'text-green-600 dark:text-green-400'
                                                    }`}>
                                                    ₹{parseFloat(SelectedLEDGERData?.openingBalances || 0).toFixed(2)}
                                                    <span className="text-sm ml-2 font-normal">
                                                        ({SelectedLEDGERData?.typeOfOpeningBalance || 'N/A'})
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        {/* <div className=" justify end bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                                            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Total Entries</h3>
                                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                                {SelectedLEDGERData?.ledgerPaymentEntries.length || 0}
                                            </p>
                                        </div> */}
                                        <div className="absolute -top-3 -right-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl">
                                                <span className="text-white font-bold text-lg">
                                                    {SelectedLEDGERData?.ledgerPaymentEntries.length || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Table */}
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-slate-900">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                                        
                                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Debit (₹)</th>
                                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Credit (₹)</th>
                                                        {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Balance (₹)</th>
                                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                    {SelectedLEDGERData?.ledgerPaymentEntries.length > 0 ? (
                                                        SelectedLEDGERData.ledgerPaymentEntries.map((ledger, index) => (
                                                            <tr
                                                                key={index}
                                                                className={`hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50/50 dark:bg-slate-800/50'
                                                                    }`}
                                                            >
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                                    {ledger?.receivedDate ? new Date(ledger?.receivedDate).toLocaleDateString('en-IN', {
                                                                        day: '2-digit',
                                                                        month: 'short',
                                                                        year: 'numeric'
                                                                    }) : 'N/A'}
                                                                </td>
                                                             
                                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                                                                    {ledger.description || ledger.narration || 'No description'}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600 dark:text-red-400">
                                                                    {parseFloat(ledger.debit || 0).toFixed(2)}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                                                                    {parseFloat(ledger.credit || 0).toFixed(2)}
                                                                </td>
                                                                {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800 dark:text-gray-200">
                                                                    {parseFloat(ledger.balance || 0).toFixed(2)}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${parseFloat(ledger.balance || 0) >= 0
                                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                                        }`}>
                                                                        {parseFloat(ledger.balance || 0) >= 0 ? 'Positive' : 'Negative'}
                                                                    </span>
                                                                </td> */}
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="7" className="px-6 py-8 text-center">
                                                                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                                                    <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                                    </svg>
                                                                    <p className="text-lg font-medium">No ledger entries found</p>
                                                                    <p className="text-sm mt-1">This ledger doesn't have any transactions yet.</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Footer Summary */}
                                    {SelectedLEDGERData?.length > 0 && (
                                        <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="flex flex-wrap justify-between items-center">
                                                <div className="flex items-center space-x-6">
                                                    <div className="flex items-center">
                                                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">Debit: Total Outflow</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">Credit: Total Inflow</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Current Balance</p>
                                                    <p className={`text-2xl font-bold mt-1 ${SelectedLEDGERData[SelectedLEDGERData.length - 1]?.balance >= 0
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-red-600 dark:text-red-400'
                                                        }`}>
                                                        ₹{parseFloat(SelectedLEDGERData[SelectedLEDGERData.length - 1]?.balance || 0).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Modal Footer */}
                                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 flex justify-between items-center">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Showing {SelectedLEDGERData?.length || 0} entries • Last updated: {new Date().toLocaleDateString()}
                                    </p>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={closeLEDGERModal}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                                        >
                                            Close
                                        </button>
                                        <button
                                            onClick={() => {
                                                // Add export functionality here
                                                console.log('Export ledger data');
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                            Export CSV
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className='items-center justify-center'>
                        <Formik
                            initialValues={{
                                // LedgerNo: '',
                                // customerName: "",
                                // supplierName: "",
                                // ProductId: "",
                                type: "",



                            }}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, values, handleBlur }) => (
                                <Form>
                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">



                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Ledger Type
                                                <span className="text-red-700 text-xl mt-[40px] justify-center items-center"> *</span>
                                            </label>
                                            {/* <div className="z-20 bg-transparent dark:bg-form-Field">
                                                <ReactSelect
                                                    name="supplierName"

                                                    value={productgrp.find(option => option.value === values.customerName)}
                                                    onChange={(option) => setFieldValue('supplierName', option ? option.value : null)}
                                                    // options={formattedSupplier}

                                                    options={[{ label: 'View All Suppliers', value: null }, ...formattedSupplier]}
                                                    styles={customStyles} // Pass custom styles here
                                                    className="bg-white dark:bg-form-Field"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select supplier Name"
                                                />
                                            </div> */}
                                            <div className="z-20 bg-transparent dark:bg-form-Field">
                                                <ReactSelect
                                                    name="type"

                                                    value={LedgerType.find(option => option.value === values.type)}
                                                    onChange={(option) => setFieldValue('type', option ? option.value : null)}
                                                    // options={formattedSupplier}

                                                    options={[{ label: 'View All ', value: null }, ...LedgerType]}
                                                    styles={customStyles} // Pass custom styles here
                                                    className="bg-white dark:bg-form-Field"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select Type"
                                                />
                                            </div>
                                        </div>
                                    </div>






                                    <div className="flex justify-center">
                                        <button
                                            type="submit"
                                            className="flex md:w-[240px] w-[220px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center  bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
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
                                        <th className="px-2 py-3 bLedger-b-2 bLedger-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" >SNO</th>

                                        <th className="px-2 py-3 bLedger-b-2 bLedger-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">LedgerName</th>
                                        <th className="px-2 py-3 bLedger-b-2 bLedger-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ledger Group</th>
                                        <th className="px-2 py-3 bLedger-b-2 bLedger-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">LedgerType</th>
                                        <th className="px-2 py-3 bLedger-b-2 bLedger-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Opening Balance</th>
                                        <th className="px-2 py-3 bLedger-b-2 bLedger-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Starting Opening Balance</th>
                                        <th className="px-2 py-3 bLedger-b-2 bLedger-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">View Ledger</th>
                                        {/* <th className="px-2 py-3 bLedger-b-2 bLedger-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[600px] md:w-[120px]">ADD BOM </th> */}

                                        <th className="px-5 py-3 bLedger-b-2 bLedger-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTableRows()}
                                </tbody>
                            </table>
                        </div>
                        <Pagination totalPages={pagination.totalPages} currentPage={pagination.currentPage} handlePageChange={handlePageChange} />
                    </div>


                </div>

            </div>

        </DefaultLayout>
    )
}

export default ViewLedger
