import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
import { DOWNLOADPURCHASECSV_REPORT } from "../../Constants/utils";
import { FiEye } from 'react-icons/fi';
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import { FaDownload } from 'react-icons/fa6';

const PurchaseReports = () => {
    const [loading, setLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [reportData, setReportData] = useState([]);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [currentPageData, setCurrentPageData] = useState([]);

    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const theme = useSelector(state => state?.persisted?.theme);

    const customStyles = createCustomStyles(theme?.mode);
    const { token } = currentUser;

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10,
    });

    // Store current filter values
    const [currentFilters, setCurrentFilters] = useState({
        fromDate: '', 
        toDate: '' 
    });

    // Function to fetch a specific page from API using POST
    const fetchPageData = async (page, filters) => {
        if (!filters.fromDate || !filters.toDate) return;
        
        setLoading(true);
        
        try {
            const response = await fetch(
                `${DOWNLOADPURCHASECSV_REPORT}/preview?page=${page - 1}&size=${pagination.itemsPerPage}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        startDate: filters.fromDate,
                        endDate: filters.toDate
                    })
                }
            );
            
            if (!response.ok) {
                throw new Error("Failed to fetch page data");
            }
            
            const data = await response.json();
            
            // Store the raw data
            setReportData(data.content || []);
            setCurrentPageData(data.content || []);
            
            setPagination({
                totalItems: data?.totalElements || 0,
                data: data?.content || [],
                totalPages: data?.totalPages || 0,
                currentPage: (data?.number || 0) + 1,
                itemsPerPage: data?.size || 10,
            });
            
        } catch (error) {
            console.error(error);
            toast.error("Failed to load page data");
            setCurrentPageData([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle View button click with server-side pagination
    const handleViewReport = async (values) => {
        if (!values.fromDate || !values.toDate) {
            toast.warning("Please select both From Date and To Date");
            return;
        }
        
        setCurrentFilters({
            fromDate: values.fromDate,
            toDate: values.toDate
        });
        
        await fetchPageData(1, values);
        setIsDataFetched(true);
    };

    // Handle CSV download with POST request
    const handlegenerateCsv = async (values) => {
        if (!values.fromDate || !values.toDate) {
            toast.warning("Please select both From Date and To Date");
            return;
        }

        setDownloadLoading(true);

        try {
            const response = await fetch(`${DOWNLOADPURCHASECSV_REPORT}/download`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    startDate: values.fromDate,
                    endDate: values.toDate
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to download report");
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to download report");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Purchase_report_${values.fromDate}_to_${values.toDate}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Report downloaded successfully");
        } catch (error) {
            console.error(error);
            toast.error(error.message || "An error occurred while downloading the report");
        } finally {
            setDownloadLoading(false);
        }
    };

    // Handle pagination
    const handlePageChange = async (page) => {
        await fetchPageData(page, currentFilters);
    };

    // Format currency values
    const formatCurrency = (value) => {
        const num = Number(value || 0);
        return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Format percentage values
    const formatPercentage = (value) => {
        const num = Number(value || 0);
        return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
    };

    // Calculate total number of product columns
    const productColumns = [
        'stockGroup', 'itemName', 'partNo', 'designName', 'style', 'size', 
        'designGroup', 'productStatus', 'colour', 'qtySold', 'costPrice', 
        'mrp', 'grossProfitPercentage', 'discountPercentageOnMRP', 'stockInHand'
    ];

    // Render a single product row
    const renderProductRow = (product, index, isLast) => {
        return (
            <tr key={`product-${index}`} className={`${!isLast ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                {/* Empty cells for sale-level columns */}
                <td className="px-3 py-2"></td>
                <td className="px-3 py-2"></td>
                <td className="px-3 py-2"></td>
                <td className="px-3 py-2"></td>
                <td className="px-3 py-2"></td>
                <td className="px-3 py-2"></td>
                <td className="px-3 py-2"></td>
                <td className="px-3 py-2"></td>
                <td className="px-3 py-2"></td>
                <td className="px-3 py-2"></td>
                <td className="px-3 py-2"></td>
                
                {/* Product details */}
                <td className="px-3 py-2 text-sm">{product.stockGroup || '-'}</td>
                <td className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white">{product.itemName || '-'}</td>
                <td className="px-3 py-2 text-sm">{product.partNo || '-'}</td>
                <td className="px-3 py-2 text-sm">{product.designName || '-'}</td>
                <td className="px-3 py-2 text-sm">{product.style || '-'}</td>
                <td className="px-3 py-2 text-sm">{product.size || '-'}</td>
                <td className="px-3 py-2 text-sm">{product.designGroup || '-'}</td>
                <td className="px-3 py-2 text-sm">{product.productStatus || '-'}</td>
                <td className="px-3 py-2 text-sm">{product.colour || '-'}</td>
                <td className="px-3 py-2 text-sm text-right">{formatCurrency(product.qtySold)}</td>
                <td className="px-3 py-2 text-sm text-right">{formatCurrency(product.costPrice)}</td>
                <td className="px-3 py-2 text-sm text-right">{formatCurrency(product.mrp)}</td>
                <td className="px-3 py-2 text-sm text-right">{formatPercentage(product.grossProfitPercentage)}</td>
                <td className="px-3 py-2 text-sm text-right">{formatPercentage(product.discountPercentageOnMRP)}</td>
                <td className="px-3 py-2 text-sm text-right">{formatCurrency(product.stockInHand)}</td>
            </tr>
        );
    };

    // Render table rows with col span for multiple products
    const renderTableRows = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan="26" className="px-5 py-10 text-center">
                        <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading...</span>
                        </div>
                    </td>
                </tr>
            );
        }

        if (!isDataFetched) {
            return (
                <tr>
                    <td colSpan="26" className="px-5 py-10 text-start">
                        <p className="text-gray-500 dark:text-gray-400">Select dates and click "View" to load report</p>
                    </td>
                </tr>
            );
        }

        if (!currentPageData.length) {
            return (
                <tr>
                    <td colSpan="26" className="px-5 py-10 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No data found for the selected date range</p>
                    </td>
                </tr>
            );
        }

        const rows = [];
        let serialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

        currentPageData.forEach((sale, saleIndex) => {
            const products = sale.products || [];
            const productCount = products.length;
            
            if (productCount === 0) {
                // Handle case with no products
                rows.push(
                    <tr key={`sale-${saleIndex}`} className="hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-gray-700 transition-colors">
                        <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-center">
                            {serialNumber++}
                        </td>
                        <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm whitespace-nowrap">
                            {sale.saleDate || '-'}
                        </td>
                        <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm">
                            {sale.customerName || '-'}
                        </td>
                        <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm">
                            {sale.PurchaseChannel || '-'}
                        </td>
                        <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm">
                            {sale.supplier || '-'}
                        </td>
                        <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm">
                            {sale.receiptNumber || '-'}
                        </td>
                        <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-right">
                            {formatCurrency(sale.totalAmount)}
                        </td>
                        <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm">
                            {sale.narration || '-'}
                        </td>
                        <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm">
                            {sale.modeOfPayment || '-'}
                        </td>
                        <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm">
                            {sale.paymentStatus || '-'}
                        </td>
                        <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-right">
                            {formatCurrency(sale.saleValue)}
                        </td>
                        <td colSpan="15" className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-center text-gray-500">
                            No products found
                        </td>
                    </tr>
                );
            } else {
                // Render first product with sale details
                rows.push(
                    <tr key={`sale-${saleIndex}-0`} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                        <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-center" rowSpan={productCount}>
                            {serialNumber++}
                        </td>
                        <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm whitespace-nowrap" rowSpan={productCount}>
                            {sale.saleDate || '-'}
                        </td>
                        <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm" rowSpan={productCount}>
                            {sale.customerName || '-'}
                        </td>
                        <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm" rowSpan={productCount}>
                            {sale.PurchaseChannel || '-'}
                        </td>
                        <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm" rowSpan={productCount}>
                            {sale.supplier || '-'}
                        </td>
                        <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm" rowSpan={productCount}>
                            {sale.receiptNumber || '-'}
                        </td>
                        <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-right" rowSpan={productCount}>
                            {formatCurrency(sale.totalAmount)}
                        </td>
                        <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm" rowSpan={productCount}>
                            {sale.narration || '-'}
                        </td>
                        <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm" rowSpan={productCount}>
                            {sale.modeOfPayment || '-'}
                        </td>
                        <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm" rowSpan={productCount}>
                            {sale.paymentStatus || '-'}
                        </td>
                        <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-right" rowSpan={productCount}>
                            {formatCurrency(sale.saleValue)}
                        </td>
                        
                        {/* First product details */}
                        <td className="px-3 py-2 text-sm">{products[0].stockGroup || '-'}</td>
                        <td className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white">{products[0].itemName || '-'}</td>
                        <td className="px-3 py-2 text-sm">{products[0].partNo || '-'}</td>
                        <td className="px-3 py-2 text-sm">{products[0].designName || '-'}</td>
                        <td className="px-3 py-2 text-sm">{products[0].style || '-'}</td>
                        <td className="px-3 py-2 text-sm">{products[0].size || '-'}</td>
                        <td className="px-3 py-2 text-sm">{products[0].designGroup || '-'}</td>
                        <td className="px-3 py-2 text-sm">{products[0].productStatus || '-'}</td>
                        <td className="px-3 py-2 text-sm">{products[0].colour || '-'}</td>
                        <td className="px-3 py-2 text-sm text-right">{formatCurrency(products[0].qtySold)}</td>
                        <td className="px-3 py-2 text-sm text-right">{formatCurrency(products[0].costPrice)}</td>
                        <td className="px-3 py-2 text-sm text-right">{formatCurrency(products[0].mrp)}</td>
                        <td className="px-3 py-2 text-sm text-right">{formatPercentage(products[0].grossProfitPercentage)}</td>
                        <td className="px-3 py-2 text-sm text-right">{formatPercentage(products[0].discountPercentageOnMRP)}</td>
                        <td className="px-3 py-2 text-sm text-right">{formatCurrency(products[0].stockInHand)}</td>
                    </tr>
                );
                
                // Render remaining products (if any)
                for (let i = 1; i < productCount; i++) {
                    rows.push(
                        <tr key={`sale-${saleIndex}-${i}`} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                            {/* Empty cells for sale-level columns (already have rowspan) */}
                            {/* Product details for subsequent products */}
                            <td className="px-3 py-2 text-sm">{products[i].stockGroup || '-'}</td>
                            <td className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white">{products[i].itemName || '-'}</td>
                            <td className="px-3 py-2 text-sm">{products[i].partNo || '-'}</td>
                            <td className="px-3 py-2 text-sm">{products[i].designName || '-'}</td>
                            <td className="px-3 py-2 text-sm">{products[i].style || '-'}</td>
                            <td className="px-3 py-2 text-sm">{products[i].size || '-'}</td>
                            <td className="px-3 py-2 text-sm">{products[i].designGroup || '-'}</td>
                            <td className="px-3 py-2 text-sm">{products[i].productStatus || '-'}</td>
                            <td className="px-3 py-2 text-sm">{products[i].colour || '-'}</td>
                            <td className="px-3 py-2 text-sm text-right">{formatCurrency(products[i].qtySold)}</td>
                            <td className="px-3 py-2 text-sm text-right">{formatCurrency(products[i].costPrice)}</td>
                            <td className="px-3 py-2 text-sm text-right">{formatCurrency(products[i].mrp)}</td>
                            <td className="px-3 py-2 text-sm text-right">{formatPercentage(products[i].grossProfitPercentage)}</td>
                            <td className="px-3 py-2 text-sm text-right">{formatPercentage(products[i].discountPercentageOnMRP)}</td>
                            <td className="px-3 py-2 text-sm text-right">{formatCurrency(products[i].stockInHand)}</td>
                        </tr>
                    );
                }
            }
        });
        
        return rows;
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="/Report/PurchaseReports" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className='flex justify-between items-center mb-6'>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                            Purchase Report
                        </h2>
                        {isDataFetched && (
                            <p className="inline-flex rounded-full bg-primary bg-opacity-10 py-1 px-3 text-sm font-medium text-primary">
                                TOTAL RECORDS: {pagination.totalItems}
                            </p>
                        )}
                    </div>

                    <div className='items-center justify-center'>
                        <Formik
                            initialValues={{
                                fromDate: '',
                                toDate: '',
                            }}
                        >
                            {({ values }) => (
                                <Form>
                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                From Date
                                            </label>
                                            <Field
                                                name='fromDate'
                                                type="date"
                                                placeholder="Enter From Date"
                                                className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                To Date
                                            </label>
                                            <Field
                                                name='toDate'
                                                type="date"
                                                placeholder="Enter To Date"
                                                className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => handleViewReport(values)}
                                            disabled={loading}
                                            className="flex items-center justify-center gap-2 mb-4 md:w-[180px] w-[200px] md:h-[45px] h-[45px] rounded-lg bg-primary text-white font-medium hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    Loading...
                                                </>
                                            ) : (
                                                <>
                                                    <FiEye size={18} />
                                                    View Report
                                                </>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handlegenerateCsv(values)}
                                            disabled={downloadLoading}
                                            className="flex items-center justify-center gap-2 mb-4 md:w-[200px] w-[220px] md:h-[45px] h-[45px] rounded-lg bg-success text-white font-medium hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {downloadLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    Downloading...
                                                </>
                                            ) : (
                                                <>
                                                    <FaDownload size={18} />
                                                    Generate Report
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>

                    {/* Table Section */}
                    <div className="mt-8 overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            <thead className="bg-gray-100 dark:bg-slate-700 sticky top-0">
                                <tr>
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">#</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Sale Date</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Customer Name</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Purchase Channel</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Supplier</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Receipt No</th>
                                    <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Total Amount</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Narration</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Mode of Payment</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Payment Status</th>
                                    <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Sale Value</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Stock Group</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Item Name</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Part No</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Design Name</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Style</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Size</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Design Group</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Product Status</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Colour</th>
                                    <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Qty Sold</th>
                                    <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Cost Price</th>
                                    <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">MRP</th>
                                    <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Gross Profit %</th>
                                    <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Discount %</th>
                                    <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Stock In Hand</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderTableRows()}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {isDataFetched && pagination.totalItems > 0 && (
                            <div className="mt-4">
                                <Pagination 
                                    totalPages={pagination.totalPages} 
                                    currentPage={pagination.currentPage} 
                                    handlePageChange={handlePageChange} 
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default PurchaseReports