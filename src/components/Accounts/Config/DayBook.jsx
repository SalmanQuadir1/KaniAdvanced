import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import Breadcrumb from '../../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
import ReactSelect from 'react-select';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Pagination from '../../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SEARCH_DayBook_URL, customStyles as createCustomStyles } from '../../../Constants/utils';

const ViewDayBook = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const theme = useSelector(state => state?.persisted?.theme);
    const [voucherTypeOptions, setVoucherTypeOptions] = useState([
        { value: 'SALES', label: 'Sales' },
        { value: 'PURCHASE', label: 'Purchase' },
        { value: 'PAYMENT', label: 'Payment' },
        { value: 'RECEIPT', label: 'Receipt' },
        { value: 'JOURNAL', label: 'Journal' }
    ]);

    const customStyles = createCustomStyles(theme?.mode);
    const { token } = currentUser;
    const [dayBooks, setDayBooks] = useState([]);
    const navigate = useNavigate();

    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10,
    });

    const getDayBook = async (page = 1, filters = {}) => {
        try {
            const response = await fetch(`${SEARCH_DayBook_URL}?page=${page}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(filters)
            });

            const data = await response.json();
            console.log(data, "jumps");

            if (data?.content) {
                setDayBooks(data.content);
            } else {
                setDayBooks([]);
            }

            setPagination({
                totalItems: data?.totalElements || 0,
                totalPages: data?.totalPages || 0,
                currentPage: data?.number + 1 || 1,
                itemsPerPage: data?.size || 10,
            });
        } catch (error) {
            console.error("Error fetching DayBooks:", error);
            toast.error("Failed to fetch DayBooks");
            setDayBooks([]);
        }
    };

    useEffect(() => {
        getDayBook(pagination.currentPage);
    }, [pagination.currentPage]);

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    const handleSubmit = (values) => {
        const filters = {
            typeOfVoucher: values.typeOfVoucher?.value || "",
            startDate: values.startDate || undefined,
            endDate: values.endDate || undefined,
        };
        getDayBook(1, filters);
    };

    const renderTableRows = () => {
        if (!dayBooks || dayBooks.length === 0) {
            return (
                <tr className='bg-white dark:bg-slate-700 dark:text-white'>
                    <td colSpan="8" className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                        No DayBook Entries Found
                    </td>
                </tr>
            );
        }

        return dayBooks.map((entry, index) => {
            const serialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + index + 1;

            return (
                <tr key={entry.id} className='bg-white dark:bg-slate-700 dark:text-white'>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {serialNumber}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {entry.narration}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {entry.typeOfVoucher}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {entry.recieptNumber}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {entry.debitAmount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {entry.creditAmount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {entry.paymentDetails?.length > 0 ? (
                            <div className="flex flex-col">
                                {entry.paymentDetails.map((payment, idx) => (
                                    <div key={idx} className="py-1">
                                        {payment.amount?.toFixed(2) || '0.00'}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            '0.00'
                        )}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        <div className="flex">
                            <FiEdit
                                size={17}
                                className="text-teal-500 hover:text-teal-700 mx-2 cursor-pointer"
                                onClick={() => navigate(`/daybook/edit/${entry.id}`)}
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
                const response = await fetch(`/api/daybook/${id}`, {
                    method: 'DELETE',
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    toast.success("Entry deleted successfully");
                    getDayBook(pagination.currentPage);
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
            <Breadcrumb pageName="DayBook / View DayBook" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className='flex justify-between'>
                        <h2 className="text-xl font-semibold leading-tight dark:text-white">View DayBook</h2>
                    </div>

                    <Formik
                        initialValues={{
                            typeOfVoucher: null,
                            startDate: '',
                            endDate: '',
                        }}
                        onSubmit={handleSubmit}
                    >
                        {({ setFieldValue, values }) => (
                            <Form>
                                <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                                    <div className="w-full md:w-auto">
                                        <label className="mb-2.5 block text-black dark:text-white">Voucher Type</label>
                                        <ReactSelect
                                            name="typeOfVoucher"
                                            value={values.typeOfVoucher}
                                            onChange={(option) => setFieldValue('typeOfVoucher', option)}
                                            options={voucherTypeOptions}
                                            styles={customStyles}
                                            className="bg-white dark:bg-form-field md:w-[240px]"
                                            classNamePrefix="react-select"
                                            placeholder="Select Voucher Type"
                                            isClearable
                                        />
                                    </div>

                                    <div className="flex-1 min-w-[300px]">
                                        <label className="mb-2.5 block text-black dark:text-white">From Date</label>
                                        <Field
                                            name="startDate"
                                            type="date"
                                            className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-[300px]">
                                        <label className="mb-2.5 block text-black dark:text-white">To Date</label>
                                        <Field
                                            name="endDate"
                                            type="date"
                                            className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center mt-6">
                                    <button
                                        type="submit"
                                        className="flex w-[240px] h-[40px] rounded-lg justify-center bg-primary p-2.5 font-medium text-sm text-gray hover:bg-opacity-90"
                                    >
                                        Search
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>

                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr className='px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SNO</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Particulars</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Voucher Type</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Voucher No</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Debit</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Credit</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
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
        </DefaultLayout>
    );
};

export default ViewDayBook;