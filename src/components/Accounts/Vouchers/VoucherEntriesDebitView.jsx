import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import Breadcrumb from '../../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
import { GET_VoucherEntriessearch_URL, GET_VoucherEntriessearchFORDEBIT_URL } from "../../../Constants/utils";
import ReactSelect from 'react-select';
import { FiTrash2 } from 'react-icons/fi';
import Pagination from '../../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../../Constants/utils';
import { FaPrint } from "react-icons/fa";

const VoucherEntriesDebitView = () => {

    const { id } = useParams();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const theme = useSelector(state => state?.persisted?.theme);
    const [isLoading, setisLoading] = useState(false)
    const customStyles = createCustomStyles(theme?.mode);
    const { token } = currentUser;

    const [search, setsearch] = useState('')

    // Get noteType and status from URL params
    const { noteType, status } = useParams();

    const [Voucher, setVoucher] = useState([]);
    const navigate = useNavigate();

    // Options for dropdowns
    const noteTypeOptions = [
        { value: 'CREDIT_NOTE', label: 'Credit Note' },
        { value: 'DEBIT_NOTE', label: 'Debit Note' },
        { value: 'RECEIPT', label: 'Receipt' },
        { value: 'PAYMENT', label: 'Payment' },
        { value: 'JOURNAL', label: 'Journal' },
        { value: 'CONTRA', label: 'Contra' },
        { value: 'STOCK_JOURNAL', label: 'Stock Journal' }
    ];

    const statusOptions = [
        { value: 'DRAFT', label: 'Draft' },
        { value: 'POSTED', label: 'Posted' },
        { value: 'CANCELLED', label: 'Cancelled' },
        { value: 'APPROVED', label: 'Approved' },
        { value: 'REJECTED', label: 'Rejected' }
    ];

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 0,
        itemsPerPage: 10,
    });

    const [searchParams] = useSearchParams();
    const queryParams = Array.from(searchParams.keys());
    // OR get the first query parameter value
    const firstParam = queryParams.length > 0 ? queryParams[0] : null;

    const getVoucher = async (page = 0, filters = {}) => {
        setisLoading(true);
        try {
            // Include noteType and status from URL params in filters
            const searchFilters = {
                ...filters,
                noteType: noteType || filters.noteType,
                status: status || filters.status
            };

            const response = await fetch(`${GET_VoucherEntriessearchFORDEBIT_URL}/${id}?page=${page}&noteType=${firstParam}&search=${search}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },

            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server responded with ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log("Received data:", data);

            if (!data?.content) {
                console.warn("No content in response, setting empty array");
                setVoucher([]);
            } else {
                setVoucher(data.content);
            }

            setPagination({
                totalItems: data?.totalElements || 0,
                data: data?.content || [],
                totalPages: data?.totalPages || 1,
                currentPage: data?.number !== undefined ? data.number : 0,
                itemsPerPage: data?.size || 10,
            });

        } catch (error) {
            console.error("Error in getVoucher:", error);
            toast.error(error.message || "Failed to fetch vouchers");
            setVoucher([]);
            setPagination(prev => ({
                ...prev,
                totalItems: 0,
                data: [],
                totalPages: 1,
                currentPage: 0
            }));
        } finally {
            setisLoading(false);
        }
    };

    useEffect(() => {
        getVoucher();
    }, [id, noteType, status]); // Re-fetch when URL params change

    const handlePageChange = (newPage) => {
        console.log("Page change requested:", newPage);
        setPagination((prev) => ({ ...prev, currentPage: newPage - 1 }));
        getVoucher(newPage - 1);
    };

    const renderTableRows = () => {
        if (!Voucher || Voucher.length === 0) {
            return (
                <tr className='bg-white dark:bg-slate-700 dark:text-white'>
                    <td colSpan="10" className="px-5 py-5 border-b border-gray-200 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap text-center">No Voucher Found</p>
                    </td>
                </tr>
            );
        }

        const startingSerialNumber = (pagination.currentPage * pagination.itemsPerPage) + 1;
        console.log(Voucher,"5556");
        

        return Voucher.map((item, index) => (
            <tr key={item.id || index} className='bg-white dark:bg-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-600'>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">{startingSerialNumber + index}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">{item?.noteNumber || '-'}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">{item?.noteType || '-'}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">
                        <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium 
                            ${item?.status === 'POSTED' ? 'bg-success text-success' :
                                item?.status === 'DRAFT' ? 'bg-warning text-warning' :
                                    item?.status === 'CANCELLED' ? 'bg-danger text-danger' :
                                        'bg-secondary text-secondary'}`}>
                            {item?.status || '-'}
                        </span>
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">{item?.date || '-'}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">{item?.totalAmount || 0}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">{item?.totalGst || 0}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">{item?.ledgerName || '-'}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">{item?.locationName || '-'}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">{item?.itemCount || 0}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="flex text-gray-900 whitespace-no-wrap">
                        <FaPrint
                            size={17}
                            className="text-teal-500 hover:text-teal-700 mx-2 cursor-pointer"
                            onClick={() => navigate(`/printentries/${item?.id}`)}
                            title="Print Entry"
                        />
                    </p>
                </td>
            </tr>
        ));
    };

    const handleSubmit = (values) => {
        console.log(values, "Search values");
        const filters = {
            voucherId: Number(id) || "",
            search: values.search || undefined,
            noteType: values.noteType || undefined,
            status: values.status || undefined,
            fromDate: values.fromDate || undefined,
            toDate: values.toDate || undefined,
            ledgerName: values.ledgerName || undefined,
            locationName: values.locationName || undefined,
        };
        getVoucher(0, filters); // Reset to first page on new search
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName={`Voucher Entries / ${noteType || 'All'} / ${status || 'All'}`} />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className="text-xl font-semibold leading-tight dark:text-white">
                            Voucher Entries - {noteType?.replace('_', ' ') || 'All'} ({status || 'All Status'})
                        </h2>
                        <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success dark:bg-white dark:text-slate-800">
                            TOTAL ENTRIES: {pagination.totalItems}
                        </p>
                    </div>

                    <div className='items-center justify-center'>
                        <Formik
                            initialValues={{
                                search: "",
                                noteType: noteType || "",
                                status: status || "",
                                fromDate: "",
                                toDate: "",
                                ledgerName: "",
                                locationName: "",
                            }}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, values }) => (
                                <Form className='shadow-lg p-4 rounded-lg mb-6'>
                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                        {/* Note Number Field */}
                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Search By :Note Number/ Ref No.</label>
                                            <Field
                                                type="text"
                                                onChange={(e) => setsearch(e.target.value)}
                                                value={search} // Important: bind the value to state
                                                name="search"
                                                placeholder="Enter Note Number"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        {/* Note Type Dropdown */}
                                        {/* <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Note Type</label>
                                            <ReactSelect
                                                name="noteType"
                                                value={noteTypeOptions.find(opt => opt.value === values.noteType) || null}
                                                onChange={(option) => setFieldValue('noteType', option?.value || '')}
                                                options={noteTypeOptions}
                                                styles={customStyles}
                                                className="bg-white dark:bg-form-Field"
                                                classNamePrefix="react-select"
                                                placeholder="Select Note Type"
                                                isClearable
                                            />
                                        </div> */}


                                        {/* <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Status</label>
                                            <ReactSelect
                                                name="status"
                                                value={statusOptions.find(opt => opt.value === values.status) || null}
                                                onChange={(option) => setFieldValue('status', option?.value || '')}
                                                options={statusOptions}
                                                styles={customStyles}
                                                className="bg-white dark:bg-form-Field"
                                                classNamePrefix="react-select"
                                                placeholder="Select Status"
                                                isClearable
                                            />
                                        </div>

                                 
                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">From Date</label>
                                            <Field
                                                type="date"
                                                name="fromDate"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                   
                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">To Date</label>
                                            <Field
                                                type="date"
                                                name="toDate"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                            />
                                        </div> */}
                                    </div>

                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                        {/* Ledger Name Field */}
                                        {/* <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Ledger/Party Name</label>
                                            <Field
                                                type="text"
                                                name="ledgerName"
                                                placeholder="Enter Ledger Name"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                     
                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Location Name</label>
                                            <Field
                                                type="text"
                                                name="locationName"
                                                placeholder="Enter Location Name"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                            />
                                        </div> */}
                                    </div>

                                    <div className="flex justify-center mt-6 gap-4">
                                        <button
                                            type="submit"
                                            className="flex md:w-[240px] w-[220px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center bg-primary md:p-2.5 font-medium md:text-sm text-white hover:bg-opacity-90"
                                        >
                                            Search
                                        </button>
                                        {/* <button
                                            type="button"
                                            onClick={() => {
                                                // Reset form and clear filters
                                                window.location.href = `/voucherEntriesDebitView/${id}`;
                                            }}
                                            className="flex md:w-[240px] w-[220px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center bg-secondary md:p-2.5 font-medium md:text-sm text-white hover:bg-opacity-90"
                                        >
                                            Clear Filters
                                        </button> */}
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
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Note Number</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Note Type</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Amount</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total GST</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ledger/Party</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Item Count</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="11" className="text-center py-4">Loading...</td>
                                        </tr>
                                    ) : (
                                        renderTableRows()
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {pagination.totalPages > 1 && (
                            <Pagination
                                totalPages={pagination.totalPages}
                                currentPage={pagination.currentPage + 1}
                                handlePageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default VoucherEntriesDebitView