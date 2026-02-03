import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import Breadcrumb from '../../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
//  import Flatpickr from 'react-flatpickr';
import { VIEW_LEDGERBYDATE, VIEW_SUPPLIER_LEDGER, VIEW_SUPPLIER_LEDGERBYID, } from "../../../Constants/utils";
import ReactSelect from 'react-select';
import useOrder from '../../../hooks/useOrder';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Pagination from '../../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../../Constants/utils';
import { MdCreateNewFolder } from "react-icons/md";
import useLedger from '../../../hooks/useLedger';



const productgrp = [
    { value: 'BrandA', label: 'Brand A' },
    { value: 'BrandB', label: 'Brand B' },
    { value: 'BrandC', label: 'Brand C' },
];


const ViewLedger = () => {

    const { ledgerName, getLedgerName } = useLedger()
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const theme = useSelector(state => state?.persisted?.theme);
    const [isLoading, setisLoading] = useState(false)
    const customStyles = createCustomStyles(theme?.mode);
    const [prodIdOptions, setprodIdOptions] = useState([])

    const [ledgerNameOptions, setledgerNameOptions] = useState([])


    useEffect(() => {
        getLedgerName()


        const formattedLedgerName = ledgerName?.map(ledg => ({
            label: ledg?.name,
            value: ledg?.name
        }));
        setledgerNameOptions(formattedLedgerName);
    }, [])

    console.log(ledgerName,"llllllllllllllllllllllllllllllllllllllllllllll");
    
 const formattedLedgerName = ledgerName?.map(ledg => ({
            label: ledg?.name,
            value: ledg?.name
        }));


    const { token } = currentUser;



    const [Ledger, setLedger] = useState()

    const [supplierNameOptions, setsupplierNameOptions] = useState([])



    // const supplier = useSelector(state => state?.nonPersisted?.supplier);
    const Order = useSelector(state => state?.nonPersisted?.Ledger);
    const navigate = useNavigate();







    
    const LedgerType = [
        { value: 'supplier', label: 'supplier' },
        { value: 'customer', label: 'customer' },
        { value: 'cash', label: 'cash' },
        { value: 'sales', label: 'sales' },
        { value: 'purchase', label: 'purchase' },
        { value: 'GIFTVOUCHER', label: 'gift voucher' },
        { value: 'bank', label: 'bank' },


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


    // useEffect(() => {
    //     if (supplier.data) {
    //         const formattedOptions = supplier.data.map(supp => ({
    //             value: supp.id,
    //             label: supp?.name,
    //             supplierNameObject: supp,
    //             suplierid: { id: supp.id }
    //         }));
    //         setsupplierNameOptions(formattedOptions);
    //     }
    // }, [supplier.data]);




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
                    <p className="text-gray-900 whitespace-no-wrap">{item?.name}</p>
                </td>
                <td className="px-5 py-5 bLedger-b bLedger-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item?.groupName} </p>
                </td>
                <td className="px-5 py-5 bLedger-b bLedger-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item?.ledgerType
                    } </p>
                </td>
                {/* {
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
                } */}
                {/* <td className="px-5 py-5  text-sm">
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
                </td> */}
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
                {/* <td className="px-5 py-5  text-sm">
                    <div className="flex items-center gap-2">
                        <p className={`text-lg font-bold ${calculatePeriodBalance() >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                            }`}>
                            ₹{calculatePeriodBalance().toFixed(2)}
                        </p>

                    </div>
                </td> */}

                <td className='whitespace-nowrap px-5 py-5 bLedger-b bLedger-gray-200 text-sm'>
                    <span onClick={() => openLEDGERModal(item)} className="view-badge bg-green-100 text-green-800 text-[10px] font-medium me-2 text-center py-2 px-4 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-pointer w-[210px]"> VIEW LEDGER</span>
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
            name: values?.ledgerName || undefined,
            type: values?.type || undefined,


        };
        getLedger(pagination.currentPage - 1, filters);
        // ViewInventory(pagination.currentPage, filters);
    };

    console.log(prodIdOptions, "llkkllkk");



    ///date logic
    const [dateFilter, setDateFilter] = useState({
        fromDate: '',
        toDate: ''
    });
    const [quickFilter, setQuickFilter] = useState('month');
    const [filteredLedgerEntries, setFilteredLedgerEntries] = useState([]);


    // Function to set current month as default
    const setCurrentMonthFilter = () => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        setDateFilter({
            fromDate: firstDay.toISOString().split('T')[0],
            toDate: lastDay.toISOString().split('T')[0]
        });
    };


    // Function to fetch filtered ledger data

    console.log(SelectedLEDGERData, "22222222222222222222222");

    // Function to reset date filter
    const resetDateFilter = () => {
        setCurrentMonthFilter();
        setQuickFilter('month');
        // Optionally fetch all data or reset to original
        setFilteredLedgerEntries(SelectedLEDGERData?.ledgerPaymentEntries || []);
    };

    // Function to apply quick filter
    const applyQuickFilter = (filterType) => {
        const today = new Date();
        let fromDate, toDate;

        switch (filterType) {
            case 'today':
                fromDate = today.toISOString().split('T')[0];
                toDate = today.toISOString().split('T')[0];
                break;
            case 'month':
                fromDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
                toDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
                break;
            case 'quarter':
                const quarter = Math.floor(today.getMonth() / 3);
                fromDate = new Date(today.getFullYear(), quarter * 3, 1).toISOString().split('T')[0];
                toDate = new Date(today.getFullYear(), (quarter + 1) * 3, 0).toISOString().split('T')[0];
                break;
            case 'year':
                fromDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
                toDate = new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0];
                break;
            case 'all':
                // Set to very old date and future date
                fromDate = '2000-01-01';
                toDate = '2100-12-31';
                break;
            default:
                return;
        }

        setDateFilter({ fromDate, toDate });
        setQuickFilter(filterType);
    };

    // Set quick filter when button clicked
    const setQuickFilterHandler = (filterType) => {
        applyQuickFilter(filterType);
        // Delay fetch to ensure state is updated
        setTimeout(() => fetchFilteredLedgerData(), 100);
    };

    // Calculate period balance


    // Get quick filter label
    const getQuickFilterLabel = () => {
        switch (quickFilter) {
            case 'today': return 'Today';
            case 'month': return 'This Month';
            case 'quarter': return 'This Quarter';
            case 'year': return 'This Year';
            case 'all': return 'All Time';
            default: return 'Custom Range';
        }
    };

    // Initialize when modal opens
    useEffect(() => {
        if (IsLEDGERModalOpen && SelectedLEDGERData) {
            setCurrentMonthFilter();
            // Set initial filtered data to all entries
            setFilteredLedgerEntries(SelectedLEDGERData?.ledgerPaymentEntries || []);
        }
    }, [IsLEDGERModalOpen, SelectedLEDGERData]);

    // Update the openLEDGERModal function to reset filters
    const openLEDGERModal = (EntriesData) => {
        if (EntriesData) {
            setSelectedLEDGERData(EntriesData);
            setIsLEDGERModalOpen(true);
            setQuickFilter('month');
            // Reset to show all entries initially
            setFilteredLedgerEntries(EntriesData.ledgerPaymentEntries || []);
        } else {
            toast.error("Supplier data not found");
        }
    };
    const closeLEDGERModal = () => {
        setIsLEDGERModalOpen(false);
        setSelectedLEDGERData(null);
        setFilteredLedgerEntries([]);
        setQuickFilter('month');
        setDateFilter({ fromDate: '', toDate: '' });
    };

    // Update closeLEDGERModal to reset states

    // Add these calculation functions in your component

    // Calculate total credit for filtered entries
    // Update calculation functions with better array checking


    console.log(filteredLedgerEntries, "7890");


    const calculateTotalCredit = () => {
        if (!Array.isArray(filteredLedgerEntries) || filteredLedgerEntries.length === 0) {
            return 0;
        }

        try {
            let totalCredit = 0;

            // 1. Add normal credit entries
            totalCredit = filteredLedgerEntries.reduce((sum, entry) => {
                const creditValue = entry?.credit !== undefined ? parseFloat(entry.credit) : 0;
                return isNaN(creditValue) ? sum : sum + creditValue;
            }, 0);

            // 2. Add opening balance if it is CREDIT (from first item)
            const firstItem = filteredLedgerEntries[0];
            console.log(SelectedLEDGERData.typeOfOpeningBalance, "1111111111112 cr");

            if (
                SelectedLEDGERData?.previousOpType.toLowerCase() === "credit" &&
                SelectedLEDGERData?.previousOpBalance !== undefined
            ) {
                const openingValue = parseFloat(SelectedLEDGERData.previousOpBalance);
                if (!isNaN(openingValue)) {
                    totalCredit += openingValue;
                }
            }

            return totalCredit;
        } catch (error) {
            console.error("Error calculating total credit:", error);
            return 0;
        }
    };


    const calculateTotalDebit = () => {
        if (!Array.isArray(filteredLedgerEntries) || filteredLedgerEntries.length === 0) {
            return 0;
        }

        try {
            let totalDebit = 0;

            // 1. Add normal debit entries
            totalDebit = filteredLedgerEntries.reduce((sum, entry) => {
                const debitValue = entry?.debit !== undefined ? parseFloat(entry.debit) : 0;
                return isNaN(debitValue) ? sum : sum + debitValue;
            }, 0);

            // 2. Add opening balance if it is DEBIT (from first item)
            const firstItem = filteredLedgerEntries[0];
            console.log(SelectedLEDGERData.typeOfOpeningBalance, "1111111111112");


            if (
                SelectedLEDGERData?.previousOpType.toLowerCase() === "debit" &&
                SelectedLEDGERData?.previousOpBalance !== undefined
            ) {
                const openingValue = parseFloat(SelectedLEDGERData.previousOpBalance);
                if (!isNaN(openingValue)) {
                    totalDebit += openingValue;
                }
            }

            return totalDebit;
        } catch (error) {
            console.error("Error calculating total debit:", error);
            return 0;
        }
    };


    const calculatePeriodBalance = () => {
        try {
            const groupName = SelectedLEDGERData?.groupName?.toLowerCase() || '';

            // IMPORTANT: Since your calculateTotalDebit() and calculateTotalCredit()
            // already include opening balance, we need to subtract it first
            const rawTotalDebit = calculateTotalDebit();
            const rawTotalCredit = calculateTotalCredit();

            const openingBalance = parseFloat(SelectedLEDGERData?.previousOpBalance) || 0;
            const openingType = SelectedLEDGERData?.previousOpType?.toLowerCase() || 'debit';

            // Remove opening balance from totals (since it's already included)
            let totalDebit = rawTotalDebit;
            let totalCredit = rawTotalCredit;

            if (openingType === 'debit') {
                totalDebit -= openingBalance; // Remove opening from debit total
            } else {
                totalCredit -= openingBalance; // Remove opening from credit total
            }

            // Now calculate based on group type
            let closingBalance = 0;

            if (groupName.includes('sundry creditor') ||
                groupName.includes('creditor') ||
                groupName.includes('duties') ||
                groupName.includes('tax') ||
                groupName.includes('gst') ||
                groupName.includes('tds') ||
                groupName.includes('loan') ||
                groupName.includes('capital') ||
                groupName.includes('liabilit') ||
                groupName.includes('sales') ||
                groupName.includes('income') ||
                groupName.includes('revenue')) {
                // Liability/Income: (Opening + Credits) - Debits
                // But since opening is already in totals, we use:
                // Closing = TotalCredit - TotalDebit
                closingBalance = rawTotalCredit - rawTotalDebit;
            } else {
                // Asset/Expense: (Opening + Debits) - Credits
                // Closing = TotalDebit - TotalCredit
                closingBalance = rawTotalDebit - rawTotalCredit;
            }

            return closingBalance;

        } catch (error) {
            console.error('Error calculating period balance:', error);
            return 0;
        }
    };

    // Update the fetchFilteredLedgerData function to recalculate after fetch
    // Update your fetchFilteredLedgerData function to handle both formats
    const fetchFilteredLedgerData = async () => {
        if (!SelectedLEDGERData?.ledgerId) return;

        setisLoading(true);
        try {
            const params = new URLSearchParams();
            if (dateFilter.fromDate) params.append('fromDate', dateFilter.fromDate);
            if (dateFilter.toDate) params.append('toDate', dateFilter.toDate);

            const url = `${VIEW_LEDGERBYDATE}/${SelectedLEDGERData.ledgerId}/filterByDate?${params.toString()}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();
            console.log('API Response:', data); // Debug log to see format

            if (response.ok) {
                // Handle both response formats
                let entries = [];

                // Check if response has 'content' property (paginated response)
                if (data && typeof data === 'object' && 'content' in data) {
                    entries = data.content;
                }
                // Check if response is an array (direct array response)
                else if (Array.isArray(data)) {
                    entries = data;
                }
                // Check if response has 'data' property
                else if (data && typeof data === 'object' && 'data' in data) {
                    entries = Array.isArray(data.data) ? data.data : [];
                }
                // If it's an object but not in expected format, extract values
                else if (data && typeof data === 'object' && !Array.isArray(data)) {
                    // Try to find array values in the object
                    const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
                    if (possibleArrays.length > 0) {
                        entries = possibleArrays[0];
                    }
                }

                console.log('Processed entries:', entries);
                setFilteredLedgerEntries(entries);
            } else {
                toast.error(data.message || "Failed to fetch filtered data");
                setFilteredLedgerEntries([]);
            }
        } catch (error) {
            console.error("Error fetching filtered ledger data:", error);
            toast.error("Error fetching data");
            setFilteredLedgerEntries([]);
        } finally {
            setisLoading(false);
        }
    };

    // Update the openLEDGERModal function to ensure initial array


    console.log(filteredLedgerEntries, "666666666666666666");
    const currentYear = new Date().getFullYear().toString().slice(-2); // Gets last 2 digits (e.g., "25" for 2025)
    const openingBalancesDate = `1-Apr-${currentYear}`;

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Ledger/ View Ledger" />
            <div className="container  px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5 ">
                    <div className='flex flex-row items-center justify-between w-full'>
                        <h2 className="text-xl text-slate-500 font-semibold w-full flex items-center justify-between">
                            <span>View Ledger</span>
                            <span className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/20 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800/30 text-sm font-semibold text-blue-700 dark:text-blue-300 ml-4">
                                TOTAL LEDGERS: {pagination.totalItems}
                            </span>
                        </h2>
                    </div>
                    {IsLEDGERModalOpen && SelectedLEDGERData && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999] p-4">
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[85vh] flex flex-col overflow-hidden">
                                {/* Modal Header */}
                                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
                                    <div className="flex flex-col">
                                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                            LEDGER DETAILS - {SelectedLEDGERData?.name}
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Ledger ID: {SelectedLEDGERData?.ledgerId} • Type: {SelectedLEDGERData?.groupName}
                                        </p>
                                    </div>
                                    <button
                                        onClick={closeLEDGERModal}
                                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold bg-gray-100 dark:bg-slate-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* Date Filter Section */}
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900">
                                    <div className="flex flex-col md:flex-row gap-4 items-end">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    From Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={dateFilter.fromDate}
                                                    onChange={(e) => setDateFilter({ ...dateFilter, fromDate: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    To Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={dateFilter.toDate}
                                                    onChange={(e) => setDateFilter({ ...dateFilter, toDate: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div className="flex mt-5  gap-2">
                                                <button
                                                    onClick={() => fetchFilteredLedgerData()}
                                                    className="flex-1 px-4 h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                                    </svg>
                                                    Apply Filter
                                                </button>
                                                <button
                                                    onClick={() => resetDateFilter()}
                                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                        </div>

                                        {/* Quick Date Filters */}
                                        <div className="flex gap-2 flex-wrap">
                                            <button
                                                onClick={() => setQuickFilterHandler('today')}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${quickFilter === 'today'
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                                                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300'
                                                    }`}
                                            >
                                                Today
                                            </button>
                                            <button
                                                onClick={() => setQuickFilterHandler('month')}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${quickFilter === 'month'
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                                                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300'
                                                    }`}
                                            >
                                                This Month
                                            </button>
                                            <button
                                                onClick={() => setQuickFilterHandler('quarter')}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${quickFilter === 'quarter'
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                                                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300'
                                                    }`}
                                            >
                                                This Quarter
                                            </button>
                                            <button
                                                onClick={() => setQuickFilterHandler('year')}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${quickFilter === 'year'
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                                                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300'
                                                    }`}
                                            >
                                                This Year
                                            </button>
                                            <button
                                                onClick={() => setQuickFilterHandler('all')}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${quickFilter === 'all'
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                                                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300'
                                                    }`}
                                            >
                                                All Time
                                            </button>
                                        </div>
                                    </div>

                                    {/* Loading State */}
                                    {isLoading && (
                                        <div className="mt-3 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                            Loading ledger data...
                                        </div>
                                    )}
                                </div>

                                {/* Modal Body */}
                                <div className="flex-1 overflow-auto p-6">
                                    {/* Beautiful Summary Cards - RESTORED */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                        {/* Total Credit Card */}
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-700/50 shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">Total Credit</h3>
                                                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                                        ₹{calculateTotalCredit().toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                                                <span className="font-medium">Period:</span> {dateFilter.fromDate} to {dateFilter.toDate}
                                            </div>
                                        </div>

                                        {/* Total Debit Card */}
                                        <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-red-200 dark:border-red-700/50 shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Total Debit</h3>
                                                    <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                                                        ₹{calculateTotalDebit().toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                                                <span className="font-medium">Period:</span> {dateFilter.fromDate} to {dateFilter.toDate}
                                            </div>
                                        </div>

                                        {/* Start Opening Balance Card */}
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700/50 shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1"> Opening Balance <br />(as of {openingBalancesDate})</h3>
                                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                                        ₹{SelectedLEDGERData?.previousOpBalance?.toFixed(2)}
                                                    </p>
                                                    <div className="mt-1">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${SelectedLEDGERData?.previousOpType?.toLowerCase() === 'credit'
                                                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                            }`}>
                                                            {SelectedLEDGERData?.previousOpType}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-700/50 shadow-sm relative overflow-hidden shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-1">Closing Balance</h3>
                                                    <p className={`text-3xl font-bold ${calculatePeriodBalance() >= 0
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-red-600 dark:text-red-400'
                                                        }`}>
                                                        ₹{calculatePeriodBalance().toFixed(2)}
                                                        <span className="text-lg ml-2">
                                                            ({calculatePeriodBalance() >= 0 ? 'Credit' : 'Debit'})
                                                        </span>
                                                    </p>
                                                    <div className="mt-1">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${SelectedLEDGERData?.typeOfOpeningBalance?.toLowerCase() === 'credit'
                                                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                            }`}>
                                                            {SelectedLEDGERData?.typeOfOpeningBalance || 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                    </svg>
                                                </div>
                                            </div>
                                            {/* Entry Count Badge */}
                                            <div className="absolute top-2 right-2">
                                                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-violet-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
                                                    {filteredLedgerEntries?.length || 0}
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Net Balance for Period Card */}
                                    <div className="mb-6">
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Net Balance for Selected Period</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        From {dateFilter.fromDate} to {dateFilter.toDate} • {getQuickFilterLabel()}
                                                    </p>
                                                </div>
                                                <div className="mt-3 md:mt-0 text-center md:text-right">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Balance</p>
                                                    <p className={`text-3xl font-bold ${calculatePeriodBalance() >= 0
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-red-600 dark:text-red-400'
                                                        }`}>
                                                        ₹{calculatePeriodBalance().toFixed(2)}
                                                        <span className="text-lg ml-2">
                                                            ({calculatePeriodBalance() >= 0 ? 'Credit' : 'Debit'})
                                                        </span>
                                                    </p>
                                                    <div className="mt-2 flex items-center justify-center md:justify-end gap-4">
                                                        <div className="flex items-center">
                                                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                                            <span className="text-xs text-gray-600 dark:text-gray-400">Credit: ₹{calculateTotalCredit().toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                                            <span className="text-xs text-gray-600 dark:text-gray-400">Debit: ₹{calculateTotalDebit().toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
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
                                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Transaction Ledger</th>
                                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Voucher Type</th>

                                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Debit (₹)</th>
                                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Credit (₹)</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                    {filteredLedgerEntries && filteredLedgerEntries.length > 0 ? (
                                                        filteredLedgerEntries.map((ledger, index) => (
                                                            <tr key={index} className={`hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50/50 dark:bg-slate-800/50'}`}>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                        {ledger?.receivedDate ? (
                                                                            <>
                                                                                <div>{new Date(ledger?.receivedDate).toLocaleDateString('en-IN', {
                                                                                    day: '2-digit',
                                                                                    month: 'short',
                                                                                    year: 'numeric'
                                                                                })}</div>
                                                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                                    {new Date(ledger?.receivedDate).toLocaleTimeString('en-IN', {
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit',
                                                                                        hour12: true
                                                                                    })}
                                                                                </div>
                                                                            </>
                                                                        ) : 'N/A'}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                                    <div className="font-medium">{ledger.toLedgerName || 'No Related Ledger Found'}</div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                        {ledger.voucherNumber ? `Voucher: ${ledger.voucherNumber}` : 'No Voucher'}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                                                                    <div className="truncate" title={ledger.description || 'No description'}>
                                                                        {ledger.description || 'No description'}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                                                                    <div className="truncate" title={ledger.voucherType || 'No voucherType'}>
                                                                        {ledger.voucherType || 'No voucherType'}
                                                                    </div>
                                                                </td>

                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className={`text-sm font-semibold ${parseFloat(ledger.debit || 0) > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`}>
                                                                        {parseFloat(ledger.debit || 0) > 0 ? `₹${parseFloat(ledger.debit || 0).toFixed(2)}` : '-'}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className={`text-sm font-semibold ${parseFloat(ledger.credit || 0) > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                                                                        {parseFloat(ledger.credit || 0) > 0 ? `₹${parseFloat(ledger.credit || 0).toFixed(2)}` : '-'}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="5" className="px-6 py-12 text-center">
                                                                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                                                    <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                                    </svg>
                                                                    <p className="text-lg font-medium mb-1">No transactions found</p>
                                                                    <p className="text-sm">Try adjusting your date filters or select a different period.</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Footer Summary */}
                                    {filteredLedgerEntries && filteredLedgerEntries.length > 0 && (
                                        <div className="mt-6 p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                            <div className="flex flex-col md:flex-row justify-between items-center">
                                                <div className="mb-4 md:mb-0">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        <span className="font-semibold">{filteredLedgerEntries.length}</span> entries •
                                                        Showing data for <span className="font-semibold">{getQuickFilterLabel()}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                        Generated on {new Date().toLocaleDateString('en-IN', {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="text-center md:text-right">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Period Summary</p>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-center">
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Credit Total</p>
                                                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                                                ₹{calculateTotalCredit().toFixed(2)}
                                                            </p>
                                                        </div>
                                                        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
                                                        <div className="text-center">
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Debit Total</p>
                                                            <p className="text-lg font-bold text-red-600 dark:text-red-400">
                                                                ₹{calculateTotalDebit().toFixed(2)}
                                                            </p>
                                                        </div>
                                                        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
                                                        <div className="text-center">
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Net Closing Balance</p>
                                                            <p className={`text-lg font-bold ${calculatePeriodBalance() >= 0
                                                                ? 'text-green-600 dark:text-green-400'
                                                                : 'text-red-600 dark:text-red-400'
                                                                }`}>
                                                                ₹{calculatePeriodBalance().toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Modal Footer */}
                                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span className="text-xs text-gray-600 dark:text-gray-400">Credit</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            <span className="text-xs text-gray-600 dark:text-gray-400">Debit</span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => {
                                                // Export functionality
                                                console.log('Export filtered data');
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Export
                                        </button>
                                        <button
                                            onClick={closeLEDGERModal}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                        >
                                            Close
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
                                ledgerName:"",



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
                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Ledger NAME
                                                <span className="text-red-700 text-xl mt-[40px] justify-center items-center"> *</span>
                                            </label>

                                            <div className="z-20 bg-transparent dark:bg-form-Field">
                                                <ReactSelect
                                                    name="ledgerName"

                                                    value={formattedLedgerName.find(option => option.value === values.ledgerName)}
                                                    onChange={(option) => setFieldValue('ledgerName', option ? option.value : null)}
                                                    // options={formattedSupplier}

                                                    options={[{ label: 'View All Ledgers', value: null }, ...formattedLedgerName]}
                                                    styles={customStyles} 
                                                    className="bg-white dark:bg-form-Field"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select Ledger Name"
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
                                        <th className="px-2 py-3 bLedger-b-2 bLedger-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Opening Balance <br /> (as of {openingBalancesDate})</th>
                                        {/* <th className="px-2 py-3 bLedger-b-2 bLedger-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Closing Balance</th> */}
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
