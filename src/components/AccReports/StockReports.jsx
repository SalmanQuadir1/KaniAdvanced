import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
import { BASE_URL, DOWNLOADAC_STOCK_REPORT } from "../../Constants/utils";
import ReactSelect from 'react-select';
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import { FaDownload } from 'react-icons/fa6';
import { FiEye } from 'react-icons/fi';

const StockReports = () => {
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [currentPageData, setCurrentPageData] = useState([]);

    // State for dropdown options
    const [designOptions, setDesignOptions] = useState([]);
    const [sizeOptions, setSizeOptions] = useState([]);
    const [designGroupOptions, setDesignGroupOptions] = useState([]);
    const [productStatusOptions, setProductStatusOptions] = useState([]);
    const [colorOptions, setColorOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);

    // Loading states for dropdowns
    const [loadingDesigns, setLoadingDesigns] = useState(false);
    const [loadingSizes, setLoadingSizes] = useState(false);
    const [loadingDesignGroups, setLoadingDesignGroups] = useState(false);
    const [loadingProductStatus, setLoadingProductStatus] = useState(false);
    const [loadingColors, setLoadingColors] = useState(false);
    const [loadingLocations, setLoadingLocations] = useState(false);

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
        startDate: '',
        endDate: '',
        designId: '',
        sizeId: '',
        designGroupId: '',

        colorId: '',
        colorName: '',
        locationId: '',
    });

    // API endpoint URLs - Please update these with your actual endpoints
    const API_ENDPOINTS = {
        designs: `${BASE_URL}/design/viewAll`, // GET all designs
        sizes: `${BASE_URL}/sizes/viewAll`, // GET all sizes
        designGroups: `${BASE_URL}/colors/viewAll`, // GET all design groups
        productStatus: `${BASE_URL}/product-category/viewAll`, // GET all product statuses
        colors: `${BASE_URL}/colors/viewAll`, // GET all colors
        locations: `${BASE_URL}/location/viewAll`, // GET all locations
    };

    // Fetch designs
    const fetchDesigns = async () => {
        setLoadingDesigns(true);
        try {
            const response = await fetch(API_ENDPOINTS.designs, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch designs");
            const data = await response.json();
            // Assuming data is an array of objects with id and name/value properties
            const formattedOptions = data.map(item => ({
                value: item.id || item.value,
                label: item.name || item.label || item.designName || `Design ${item.id}`
            }));
            setDesignOptions(formattedOptions);
        } catch (error) {
            console.error("Error fetching designs:", error);
            toast.error("Failed to load designs");
        } finally {
            setLoadingDesigns(false);
        }
    };

    // Fetch sizes
    const fetchSizes = async () => {
        setLoadingSizes(true);
        try {
            const response = await fetch(API_ENDPOINTS.sizes, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch sizes");
            const data = await response.json();
            const formattedOptions = data.map(item => ({
                value: item.id || item.value,
                label: item.name || item.label || item.sizeName || `Size ${item.id}`
            }));
            setSizeOptions(formattedOptions);
        } catch (error) {
            console.error("Error fetching sizes:", error);
            toast.error("Failed to load sizes");
        } finally {
            setLoadingSizes(false);
        }
    };

    // Fetch design groups
    const fetchDesignGroups = async () => {
        setLoadingDesignGroups(true);
        try {
            const response = await fetch(API_ENDPOINTS.designGroups, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch design groups");
            const data = await response.json();
            const formattedOptions = data.map(item => ({
                value: item.id || item.value,
                label: item.name || item.label || item.groupName || `Design Group ${item.id}`
            }));
            setDesignGroupOptions(formattedOptions);
        } catch (error) {
            console.error("Error fetching design groups:", error);
            toast.error("Failed to load design groups");
        } finally {
            setLoadingDesignGroups(false);
        }
    };

    // Fetch product statuses
    const fetchProductStatuses = async () => {
        setLoadingProductStatus(true);
        try {
            const response = await fetch(API_ENDPOINTS.productStatus, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch product statuses");
            const data = await response.json();
            const formattedOptions = data.map(item => ({
                value: item.id,
                label: item.productCategoryName || item.name || item.status || item.value
            }));
            setProductStatusOptions(formattedOptions);
        } catch (error) {
            console.error("Error fetching product statuses:", error);
            toast.error("Failed to load product statuses");
        } finally {
            setLoadingProductStatus(false);
        }
    };

    // Fetch colors
    const fetchColors = async () => {
        setLoadingColors(true);
        try {
            const response = await fetch(API_ENDPOINTS.colors, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch colors");
            const data = await response.json();
            const formattedOptions = data.map(item => ({
                value: item.id || item.value,
                label: item.name || item.label || item.colorName || `Color ${item.id}`
            }));
            setColorOptions(formattedOptions);
        } catch (error) {
            console.error("Error fetching colors:", error);
            toast.error("Failed to load colors");
        } finally {
            setLoadingColors(false);
        }
    };

    // Fetch locations
    const fetchLocations = async () => {
        setLoadingLocations(true);
        try {
            const response = await fetch(API_ENDPOINTS.locations, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch locations");
            const data = await response.json();
            const formattedOptions = data.map(item => ({
                value: item.id || item.value,
                label: item.state || item.label || item.locationName || `Location ${item.id}`
            }));
            setLocationOptions(formattedOptions);
        } catch (error) {
            console.error("Error fetching locations:", error);
            toast.error("Failed to load locations");
        } finally {
            setLoadingLocations(false);
        }
    };

    // Load all dropdown data on component mount
    useEffect(() => {
        if (token) {
            fetchDesigns();
            fetchSizes();
            fetchDesignGroups();
            fetchProductStatuses();
            fetchColors();
            fetchLocations();
        }
    }, [token]);

    // Helper function to build searchDto with only non-empty values
    const buildSearchDto = (filters, includePagination = false) => {
        const searchDto = {};

        if (filters.startDate) {
            searchDto.startDate = new Date(filters.startDate).toISOString();
        }
        if (filters.endDate) {
            searchDto.endDate = new Date(filters.endDate).toISOString();
        }

        if (filters.designId && filters.designId !== '') {
            searchDto.designId = parseInt(filters.designId);
        }
        if (filters.sizeId && filters.sizeId !== '') {
            searchDto.sizeId = parseInt(filters.sizeId);
        }
        if (filters.designGroupId && filters.designGroupId !== '') {
            searchDto.designGroupId = parseInt(filters.designGroupId);
        }
        if (filters.colorId && filters.colorId !== '') {
            searchDto.colorId = parseInt(filters.colorId);
        }
        if (filters.colorName && filters.colorName !== '') {
            searchDto.colorName = filters.colorName;
        }
        if (filters.locationId && filters.locationId !== '') {
            searchDto.locationId = parseInt(filters.locationId);
        }
        if (filters.productStatus && filters.productStatus !== '') {
            searchDto.productStatus = filters.productStatus;
        }

        if (includePagination) {
            searchDto.page = filters.page || 0;
            searchDto.size = filters.size || pagination.itemsPerPage;
        }

        return searchDto;
    };

    // Function to fetch report data from API
    const fetchReportData = async (page, filters) => {
        setLoading(true);

        try {
            const searchDto = buildSearchDto({
                ...filters,
                page: page - 1,
                size: pagination.itemsPerPage,
            }, true);

            console.log("Request Body:", searchDto);

            const response = await fetch(`${DOWNLOADAC_STOCK_REPORT}/preview`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(searchDto),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch report data");
            }

            const data = await response.json();
            console.log(data, "API Response");

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

            if (data?.content?.length === 0) {
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
            startDate: values.startDate,
            endDate: values.endDate,
            designId: values.designId,
            colorName: values.colorName,
            sizeId: values.sizeId,
            designGroupId: values.designGroupId,

            colorId: values.colorId,
           
            locationId: values.locationId,
        });

        await fetchReportData(1, {
            startDate: values.startDate,
            endDate: values.endDate,
            designId: values.designId,
            sizeId: values.sizeId,
            designGroupId: values.designGroupId,

            colorId: values.colorId,
            colorName: values.colorName,
            locationId: values.locationId,
        });
    };

    // Handle CSV download
    const handleGenerateCsv = async (values) => {
        setLoading(true);

        try {
            const searchDto = buildSearchDto(values, false);

            console.log("Download Request Body:", searchDto);

            const response = await fetch(`${DOWNLOADAC_STOCK_REPORT}/download`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(searchDto),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to download report");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `stock_report_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Report downloaded successfully");
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while downloading the report");
        } finally {
            setLoading(false);
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
                        <p className="text-gray-500 dark:text-gray-400">Select filters and click "View" to load report</p>
                    </td>
                </tr>
            );
        }

        if (!currentPageData.length) {
            return (
                <tr>
                    <td colSpan="16" className="px-5 py-10 text-center">
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
                    {item.locationName || '-'}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                    {item.stockGroup || '-'}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                    {item.category || '-'}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                    {item.productDescription || '-'}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                    {item.partNo || '-'}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                    {item.color || '-'}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                    {item.style || '-'}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                    {item.size || '-'}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                    {item.designName || '-'}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                    {item.productStatus || '-'}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                    {item.color || '-'}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-right text-gray-700 dark:text-gray-300">
                    {item.quantity || 0}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-right text-gray-700 dark:text-gray-300">
                    ₹{Number(item.value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-right text-gray-700 dark:text-gray-300">
                    {item.poInProcess || 0}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-right text-gray-700 dark:text-gray-300">
                    ₹{Number(item.poInProcessValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
            </tr>
        ));
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Report/StockReports" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className='flex justify-between items-center mb-6'>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                            Stock Reports
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
                                startDate: '',
                                endDate: '',
                                designId: '',
                                sizeId: '',
                                designGroupId: '',
                                colorName: '',
                                colorId: '',
                                locationId: '',
                            }}
                        >
                            {({ setFieldValue, values }) => (
                                <Form>
                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Start Date
                                            </label>
                                            <Field
                                                name="startDate"
                                                type="date"
                                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                End Date
                                            </label>
                                            <Field
                                                name="endDate"
                                                type="date"
                                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Design
                                            </label>
                                            <ReactSelect
                                                name='designId'
                                                value={designOptions.find(opt => opt.value === parseInt(values.designId)) || null}
                                                onChange={(option) => setFieldValue('designId', option?.value || '')}
                                                options={designOptions}
                                                isClearable
                                                placeholder={loadingDesigns ? "Loading..." : "Select Design"}
                                                isLoading={loadingDesigns}
                                                styles={customStyles}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Size
                                            </label>
                                            <ReactSelect
                                                name='sizeId'
                                                value={sizeOptions.find(opt => opt.value === parseInt(values.sizeId)) || null}
                                                onChange={(option) => setFieldValue('sizeId', option?.value || '')}
                                                options={sizeOptions}
                                                isClearable
                                                placeholder={loadingSizes ? "Loading..." : "Select Size"}
                                                isLoading={loadingSizes}
                                                styles={customStyles}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Design Group
                                            </label>
                                            <ReactSelect
                                                name='colorId'
                                                value={colorOptions.find(opt => opt.value === parseInt(values.colorId)) || null}
                                                onChange={(option) => setFieldValue('colorId', option?.value || '')}
                                                options={colorOptions}
                                                isClearable
                                                placeholder={loadingDesignGroups ? "Loading..." : " Design Group"}
                                                isLoading={loadingDesignGroups}
                                                styles={customStyles}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                            />
                                        </div>



                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Color
                                            </label>
                                            <Field 
                                            name="colorName"
                                                type="text"
                                                placeholder="Enter Color Name"
                                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Location
                                            </label>
                                            <ReactSelect
                                                name='locationId'
                                                value={locationOptions.find(opt => opt.value === parseInt(values.locationId)) || null}
                                                onChange={(option) => setFieldValue('locationId', option?.value || '')}
                                                options={locationOptions}
                                                isClearable
                                                placeholder={loadingLocations ? "Loading..." : "Select Location"}
                                                isLoading={loadingLocations}
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
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Location Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Stock Group</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Product Description</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Part No</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Design Group</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Style</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Size</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Design</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Product Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Color</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Value</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">PO In Process</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">PO In Process Value</th>
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

export default StockReports;