import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
import { DELETE_ORDER_URL, DOWNLOADACCCSV_REPORT, DOWNLOADCSV_REPORT, DOWNLOADSALESCSV_REPORT, DOWNLOAD_REPORT, VIEW_ALL_ORDERS, VIEW_CREATED_ORDERS, VIEW_REPORT } from "../../Constants/utils";
import ReactSelect from 'react-select';
import useorder from '../../hooks/useOrder';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import useReports from '../../hooks/useReports';
import { FaDownload } from 'react-icons/fa6';

const SalesReports = () => {
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
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
        fromDate: new Date().toISOString().split('T')[], 
        toDate: '' 
    });

    // Function to fetch a specific page from API
    const fetchPageData = async (page, filters) => {
        if (!filters.fromDate || !filters.toDate) return;
        
        setLoading(true);
        
        try {
            const response = await fetch(
                `${DOWNLOADSALESCSV_REPORT}?fromDate=${filters.fromDate}&toDate=${filters.toDate}&page=${page - 1}&size=${pagination.itemsPerPage}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            if (!response.ok) {
                throw new Error("Failed to fetch page data");
            }
            
            const data = await response.json();
            
            setReportData(data.content || []);
            setFilteredData(data.content || []);
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

    // Handle CSV download
    const handlegenerateCsv = async (values) => {
        if (!values.fromDate || !values.toDate) {
            toast.warning("Please select both From Date and To Date");
            return;
        }

        try {
            const response = await fetch(`${DOWNLOADSALESCSV_REPORT}/download?fromDate=${values.fromDate}&toDate=${values.toDate}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to download report");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `sales_report_${values.fromDate}_to_${values.toDate}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Report downloaded successfully");
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while downloading the report");
        }
    };

    // Handle pagination
    const handlePageChange = async (page) => {
        await fetchPageData(page, currentFilters);
    };

    // Format currency values
    const formatCurrency = (value) => {
        return Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Format percentage values
    const formatPercentage = (value) => {
        return Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
    };

    // Render table rows
    const renderTableRows = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan="16" className="px-5 py-10 text-center">
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
                    <td colSpan="16" className="px-5 py-10 text-center">
                        <p className="text-gray-500 dark:text-gray-400">Select dates and click "View" to load report</p>
                    </td>
                </tr>
            );
        }

        if (!currentPageData.length) {
            return (
                <tr>
                    <td colSpan="16" className="px-5 py-10 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No data found for the selected date range</p>
                    </td>
                </tr>
            );
        }

        const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

        return currentPageData.map((item, index) => (
            <tr key={item.id || index} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-center">
                    {startingSerialNumber + index}
                </td>
                  <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm">
                    {item.saleDate || '-'}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm">
                    {item.salesChannel || '-'}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm">
                    {item.supplier || '-'}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm">
                    {item.stockGroup || '-'}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-900 dark:text-white">
                    {item.itemName || '-'}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm">
                    {item.partNo || '-'}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm">
                    {item.designName || '-'}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm">
                    {item.style || '-'}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm">
                    {item.size || '-'}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm">
                    {item.designGroup || '-'}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm">
                    {item.productStatus || '-'}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm">
                    {item.colour || '-'}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-right">
                    {formatCurrency(item.qtySold)}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-right">
                    {formatCurrency(item.saleValue)}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-right">
                    {formatCurrency(item.costPrice)}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-right">
                    {formatCurrency(item.mrp)}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-right">
                    {formatPercentage(item.grossProfitPercentage)}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-right">
                    {formatPercentage(item.discountPercentageOnMRP)}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-right">
                    {formatCurrency(item.stockInHand)}
                </td>
            </tr>
        ));
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="/Report/SalesReports" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className='flex justify-between items-center mb-6'>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                            Sales Report
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
                            {({ setFieldValue, values, handleBlur }) => (
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
                                            className="flex items-center justify-center gap-2 mb-4 md:w-[180px] w-[200px] md:h-[45px] h-[45px] rounded-lg bg-primary text-white font-medium hover:bg-opacity-90 transition-all"
                                        >
                                            <FiEye size={18} />
                                            View Report
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handlegenerateCsv(values)}
                                            className="flex items-center justify-center gap-2 mb-4 md:w-[200px] w-[220px] md:h-[45px] h-[45px] rounded-lg bg-success text-white font-medium hover:bg-opacity-90 transition-all"
                                        >
                                            <FaDownload size={18} />
                                            Generate Report
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>

                    {/* Table Section */}
                    <div className="mt-8 overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
                            <thead className="bg-gray-100 dark:bg-slate-700">
                                <tr>
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">#</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Sales Date</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Sales Channel</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Supplier</th>
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
                                    <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Sale Value</th>
                                    <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Cost Price</th>
                                    <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">MRP</th>
                                    <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Gross Profit %</th>
                                    <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Discount % on MRP</th>
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

export default SalesReports