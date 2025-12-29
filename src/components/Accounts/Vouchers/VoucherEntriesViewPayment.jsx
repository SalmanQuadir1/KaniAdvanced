import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import Breadcrumb from '../../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
//  import Flatpickr from 'react-flatpickr';
import { GET_VoucherEntriessearch_URL, GET_VoucherEntriessearchPayment_URL, GET_Vouchersearch_URL, UPDATETOGGLE_Voucher_URL } from "../../../Constants/utils";
import ReactSelect from 'react-select';
import useOrder from '../../../hooks/useOrder';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Pagination from '../../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../../Constants/utils';
import { MdCreateNewFolder } from "react-icons/md";
import { FaPrint } from "react-icons/fa";




;


const VoucherEntriesViewPayment = () => {

    const { id } = useParams();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const theme = useSelector(state => state?.persisted?.theme);
    const [isLoading, setisLoading] = useState(false)
    const customStyles = createCustomStyles(theme?.mode);
    const [prodIdOptions, setprodIdOptions] = useState([])




    const { token } = currentUser;



    const [Voucher, setVoucher] = useState()




    // const supplier = useSelector(state => state?.nonPersisted?.supplier);
    const Order = useSelector(state => state?.nonPersisted?.Voucher);
    const navigate = useNavigate();




















    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
    });







    const getVoucher = async (page = 1, filters = {}) => {


        try {
            const response = await fetch(`${GET_VoucherEntriessearchPayment_URL}/search/${id}?page=${page}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(filters)
            });

            // First check if the response is OK (status 200-299)
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server responded with ${response.status}: ${errorText}`);
            }

            // Try to parse as JSON
            const data = await response.json();
            console.log("Received data:", data);

            if (!data?.content) {
                console.warn("No content in response, setting empty array");
                setVoucher([]);
            } else {
                setVoucher(data.content);
            }

            // Update pagination state
            setPagination({
                totalItems: data?.totalElements || 0,
                data: data?.content || [],
                totalPages: data?.totalPages || 1,
                currentPage: data?.number !== undefined ? data.number  : 0,
                itemsPerPage: data?.size || 10,
            });

        } catch (error) {
            console.error("Error in getVoucher:", error);

            // More specific error messages
            if (error instanceof SyntaxError) {
                toast.error("Invalid JSON response from server");
            } else {
                toast.error(error.message || "Failed to fetch vouchers");
            }

            setVoucher([]);
            setPagination(prev => ({
                ...prev,
                totalItems: 0,
                data: [],
                totalPages: 1,
                currentPage: 1
            }));
        }
    };

    useEffect(() => {
        getVoucher()
    }, [])

    const handlePageChange = (newPage) => {
        console.log("Page change requested:", newPage);

        setPagination((prev) => ({ ...prev, currentPage: newPage-1 }));
        getVoucher(newPage -1); // Correct function name and 1-indexed for user interaction
    };

    console.log(Voucher, "heyVoucher");




    const renderTableRows = () => {

        if (!Voucher || Voucher.length === 0) {
            return (
                <tr className='bg-white dark:bg-slate-700 dark:text-white'>
                    <td colSpan="6" className="px-5 py-5 bVoucher-b bVoucher-gray-200 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap text-center">No Voucher Found</p>
                    </td>
                </tr>
            );
        }

          const startingSerialNumber = (pagination.currentPage * pagination.itemsPerPage) + 1;

        const handleDelete = async (e, id) => {
            e.preventDefault();
            try {
                const response = await fetch(`${DELETE_Voucher_URL}/${id}`, { // Correct API endpoint
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    toast.success(`Voucher Deleted Successfully !!`);

                    // Check if the current page becomes empty
                    const isCurrentPageEmpty = Voucher.length === 1;

                    if (isCurrentPageEmpty && pagination.currentPage > 1) {
                        const previousPage = pagination.currentPage - 1;
                        handlePageChange(previousPage); // Go to the previous page if current page becomes empty
                    } else {
                        getVoucher(pagination.currentPage); // Refresh Vouchers on the current page
                    }
                } else {
                    toast.error(`${data.errorMessage}`);
                }
            } catch (error) {
                console.error(error);
                toast.error("An error occurred");
            }
        };






console.log(Voucher,"amjh");







        return Voucher.map((item, index) => (

           <tr key={index} className='bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200'>
    <td className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-slate-700 px-2.5 py-1 rounded-full">
            {startingSerialNumber + index}
        </span>
    </td>

    <td className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
            
            <div>
                {
                    item.recieptNumber === null ? (
                        <p className="text-sm font-medium text-gray-900 dark:text-white">N/A</p>
                    ) : (
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{item?.recieptNumber}</p>
                    
                    )
                }
               
            </div>
        </div>
    </td>

    <td className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 whitespace-nowrap">
        <div className="flex flex-col">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/30 border border-red-200 dark:border-red-700">
                <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm font-medium text-red-700 dark:text-red-300">{item?.ledgerName}</span>
            </div>
            
        </div>
    </td>

    <td className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 whitespace-nowrap">
        <div className="flex flex-col">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/30 border border-green-200 dark:border-green-700">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">{item?.toLedgerName}</span>
            </div>
            
        </div>
    </td>

    <td className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 whitespace-nowrap">
        <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(item?.paymentDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                })}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(item?.paymentDate).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </p>
        </div>
    </td>

    <td className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
                ₹{item?.amount?.toLocaleString('en-IN') || '0.00'}
            </span>
            
        </div>
    </td>

    <td className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-xs">
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                {item?.narration || 'No description'}
            </p>
            
        </div>
    </td>

    <td className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-2">
            {item.posInvoicing === true && (
                <button
                    onClick={() => navigate(`/printentrypaymentPos/${item.id}/${item.gstRegistration}`)}
                    className="flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                    title="Print POS Entry"
                >
                    <FaPrint className="mr-1.5" size={12} />
                    POS Print
                </button>
            )}
            
            <button
                // onClick={() => navigate(`/printentrypayment/${item.id}/${item.gstRegistration}`)}
                 onClick={() => navigate(`/printentrypayments/${item.id}/${item.gstRegistration}`)}
                
                title="Print Entry"
            >
                <FaPrint  className="text-teal-500 hover:text-teal-700 mx-2" size={17} />
              
            </button>

            {/* <button
                onClick={(e) => handleDelete(e, item?.id)}
                className="flex items-center px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                title="Delete Entry"
            >
                <FiTrash2 className="mr-1.5" size={12} />
                Delete
            </button> */}
        </div>
    </td>
</tr>
        ));
    };


    const handleSubmit = (values) => {

        console.log(values, "valiiiiii");
        const filters = {
            voucherId: Number(id)||"",

            recieptNumber: values.recieptNumber || undefined,
            fromDate: values.fromDate || undefined,
            toDate: values.toDate || undefined,
            gstRegistration: values.gstRegistration || undefined,
            ledgerId: values.ledgerId || undefined,






        };
        getVoucher(pagination.currentPage, filters);
        // ViewInventory(pagination.currentPage, filters);
    };

    console.log(prodIdOptions, "llkkllkk");
    const closeVoucherModal = () => {
        setIsVoucherModalOpen(false);
        setSelectedVoucherData(null);
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Voucher/ View Voucher" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className='flex justify-between'>
                        <h2 className="text-xl font-semibold leading-tight">View Voucher</h2>
                        {/* <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success dark:bg-white dark:text-slate-800`}>
                            TOTAL PRODUCTS: {pagination.totalItems}
                        </p> */}
                    </div>


                    <div className='items-center justify-center'>
                        <Formik
                            initialValues={{
                                recieptNumber: "",
                                fromDate: "",
                                toDate: "",
                                gstRegistration: "",
                                ledgerId: "",
                            }}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, values, handleBlur }) => (
                                <Form className='shadow-lg p-4'>
                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                                        {/* Receipt Number Field */}
                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Receipt Number</label>
                                            <Field
                                                type="text"
                                                name="recieptNumber"
                                                placeholder="Enter Receipt Number"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        {/* From Date Field */}
                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">From Date</label>
                                            <Field
                                                type="date"
                                                name="fromDate"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        {/* To Date Field */}
                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">To Date</label>
                                            <Field
                                                type="date"
                                                name="toDate"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                        {/* GST Registration Field */}
                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">GST Registration</label>
                                            <Field
                                                type="text"
                                                name="gstRegistration"
                                                placeholder="Enter GST Registration"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        {/* Ledger ID Field */}
                                    

                                        {/* Voucher Name Field */}

                                    </div>



                                    <div className="flex justify-center mt-6">
                                        <button
                                            type="submit"
                                            className="flex md:w-[240px] w-[220px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
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
                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" >SNO</th>

                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Reciept Number</th>
                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">From</th>
                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Particular Ledger</th>
                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">narration</th>


                                        {/* <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[600px] md:w-[120px]">ADD BOM </th> */}

                                        <th className="px-5 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTableRows()}
                                </tbody>
                            </table>
                        </div>
                        <Pagination totalPages={pagination.totalPages} currentPage={pagination.currentPage+1} handlePageChange={handlePageChange} />
                    </div>


                </div>

            </div>

        </DefaultLayout>
    )
}

export default VoucherEntriesViewPayment
