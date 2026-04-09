import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
import { DOWNLOADACClient_REPORT } from "../../Constants/utils";
import ReactSelect from 'react-select';
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import { FaDownload } from 'react-icons/fa6';
import { FiEye } from 'react-icons/fi';

// Options for sales channel filter
const salesChannelOptions = [
    { value: 'WS-Domestic', label: 'WS-Domestic' },
    { value: 'Websale', label: 'Websale' },
    { value: 'Social Media', label: 'Social Media' },
    { value: 'Shop-in-Shop', label: 'Shop-in-Shop' },
    { value: 'WS-International', label: 'WS-International' },
    { value: 'Event-International', label: 'Event-International' },
    { value: 'Event-Domestic', label: 'Event-Domestic' },
    { value: 'Retail-Delhi', label: 'Retail-Delhi' },
    { value: 'Retail-SXR', label: 'Retail-SXR' },
];

// Options for country filter
const countryOptions = [
    { value: 'India', label: 'India' },
   
    { value: 'USA', label: 'USA' },
    { value: 'UK', label: 'UK' },
    { value: 'UAE', label: 'UAE' },
    { value: 'Singapore', label: 'Singapore' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Germany', label: 'Germany' },
    { value: 'France', label: 'France' },
    { value: 'Japan', label: 'Japan' },
];

// Options for city filter (can be expanded based on your data)
const cityOptions = [
    { value: 'Delhi', label: 'Delhi' },

     { value: 'Srinagar', label: 'Srinagar' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Bangalore', label: 'Bangalore' },
    { value: 'Chennai', label: 'Chennai' },
    { value: 'Kolkata', label: 'Kolkata' },
    { value: 'Hyderabad', label: 'Hyderabad' },
    { value: 'Pune', label: 'Pune' },
    { value: 'Ahmedabad', label: 'Ahmedabad' },
    { value: 'Jaipur', label: 'Jaipur' },
    { value: 'Lucknow', label: 'Lucknow' },
];

const ClientReports = () => {
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

    const [currentFilters, setCurrentFilters] = useState({
        salesChannel: '',
        country: '',
        city: '',
        fromDate: '',
        toDate: '',
    });

    // Function to fetch report data from API
    const fetchReportData = async (page, filters) => {
        setLoading(true);
        
        try {
            // Build query parameters
            const params = new URLSearchParams();
            params.append('page', page - 1);
            params.append('size', pagination.itemsPerPage);
            
          
            if (filters.salesChannel) params.append('salesChannel', filters.salesChannel);
            if (filters.country) params.append('countryName', filters.country);
            if (filters.city) params.append('city', filters.city);
            
            const response = await fetch(`${DOWNLOADACClient_REPORT}/preview?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch report data");
            }

            const data = await response.json();
console.log(data,"110");

            setReportData(data.content || []);
            setFilteredData(data.content || []);
            
            setPagination({
                totalItems: data?.totalElements || 0,
                data: data?.content || [],
                totalPages: data?.totalPages || 0,
                currentPage: (data?.number || 0) + 1,
                itemsPerPage: data?.size || 10,
            });
            
            setCurrentPageData(data?.content || []);
            setIsDataFetched(true);
            
            if (data?.length === 0) {
                toast.info("No data found for the selected filters");
            } else {
                toast.success("Report loaded successfully");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while fetching the report");
            setReportData([]);
            setFilteredData([]);
            setCurrentPageData([]);
            setPagination({
                totalItems: 0,
                data: [],
                totalPages: 0,
                currentPage: 1,
                itemsPerPage: 10,
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle View button click
    const handleViewReport = async (values) => {
    
        setCurrentFilters({
            salesChannel: values.salesChannel || '',
            country: values.country || '',
            city: values.city || '',
            fromDate: values.fromDate,
            toDate: values.toDate,
        });
        
        await fetchReportData(1, {
            ...values,
            salesChannel: values.salesChannel || '',
            country: values.country || '',
            city: values.city || '',
        });
    };

    // Handle CSV download
    const handleGenerateCsv = async (values) => {
       

        const filters = {
           
            salesChannel: values.salesChannel || '',
            countryName: values.country || '',
            city: values.city || '',
        };

        try {
            const response = await fetch(`${DOWNLOADACClient_REPORT}/download?${new URLSearchParams(filters).toString()}`, {
                method: "GET",
                headers: {
                   
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
            link.setAttribute("download", `client_report_${values.fromDate}_to_${values.toDate}.xlsx`);
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
        await fetchReportData(page, currentFilters);
    };

    // Render table rows
    const renderTableRows = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan="8" className="px-5 py-10 text-center">
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
                    <td colSpan="8" className="px-5 py-10 text-center">
                        <p className="text-gray-500 dark:text-gray-400">Select dates and filters, then click "View" to load report</p>
                    </td>
                </tr>
            );
        }

        if (!currentPageData.length) {
            return (
                <tr>
                    <td colSpan="8" className="px-5 py-10 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No data found for the selected filters</p>
                    </td>
                </tr>
            );
        }

        const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

        return currentPageData.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm">
                    {startingSerialNumber + index}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-900 dark:text-white">
                    {item.customerName || '-'}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                    {item.contactNumber || '-'}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                    {item.email || '-'}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                    {item.city || '-'}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                    {item.countryName || '-'}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-right text-gray-700 dark:text-gray-300">
                    {item.salesChannel || '-'}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-right text-gray-700 dark:text-gray-300">
                    ₹{Number(item.salesTurnover || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-right text-gray-700 dark:text-gray-300">
                    ₹{Number(item.currentBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-right text-gray-700 dark:text-gray-300">
                    {item.discount || 0}%
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-right text-gray-700 dark:text-gray-300">
                    {item.lastBillDiscount || 0}%
                </td>
            </tr>
        ));
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Report/ClientReports" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className='flex justify-between items-center mb-6'>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                            Client/Customer Reports
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
                                salesChannel: '',
                                country: '',
                                city: '',
                            }}
                        >
                            {({ setFieldValue, values, handleBlur }) => (
                                <Form>
                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                                       

                                     

                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Sales Channel
                                            </label>
                                            <ReactSelect
                                                name='salesChannel'
                                                value={salesChannelOptions.find(opt => opt.value === values.salesChannel) || null}
                                                onChange={(option) => setFieldValue('salesChannel', option?.value || '')}
                                                options={salesChannelOptions}
                                                isClearable
                                                placeholder="Select Sales Channel"
                                                styles={customStyles}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Country
                                            </label>
                                            <ReactSelect
                                                name='country'
                                                value={countryOptions.find(opt => opt.value === values.country) || null}
                                                onChange={(option) => setFieldValue('country', option?.value || '')}
                                                options={countryOptions}
                                                isClearable
                                                placeholder="Select Country"
                                                styles={customStyles}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                City
                                            </label>
                                            <ReactSelect
                                                name='city'
                                                value={cityOptions.find(opt => opt.value === values.city) || null}
                                                onChange={(option) => setFieldValue('city', option?.value || '')}
                                                options={cityOptions}
                                                isClearable
                                                placeholder="Select City"
                                                styles={customStyles}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-center gap-4 flex-wrap">
                                        <button
                                            type="button"
                                            onClick={() => handleViewReport(values)}
                                            className="flex items-center justify-center gap-2 mb-4 md:w-[180px] w-[200px] md:h-[45px] h-[45px] rounded-lg bg-primary text-white font-medium hover:bg-opacity-90 transition-all"
                                            disabled={loading}
                                        >
                                            <FiEye size={18} />
                                            View Report
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleGenerateCsv(values)}
                                            className="flex items-center justify-center gap-2 mb-4 md:w-[200px] w-[220px] md:h-[45px] h-[45px] rounded-lg bg-success text-white font-medium hover:bg-opacity-90 transition-all"
                                            disabled={loading}
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
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">#</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Customer Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Contact Number</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">City</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Country</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Sales Channel</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Sales Turnover</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Current Balance</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Discount %</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Last Bill Discount %</th>
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

export default ClientReports;