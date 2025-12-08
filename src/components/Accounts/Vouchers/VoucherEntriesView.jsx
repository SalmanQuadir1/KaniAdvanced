import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import Breadcrumb from '../../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
//  import Flatpickr from 'react-flatpickr';
import { GET_VoucherEntriessearch_URL, GET_Vouchersearch_URL, UPDATETOGGLE_Voucher_URL } from "../../../Constants/utils";
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


const VoucherEntriesView = () => {

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







    const getVoucher = async (page = 0, filters = {}) => {


        try {
            const response = await fetch(`${GET_VoucherEntriessearch_URL}/${id}/search?page=${page}`, {
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

            <tr key={index} className='bg-white dark:bg-slate-700 dark:text-white'>
                <td className="px-5 py-5 bVoucher-b bVoucher-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{startingSerialNumber + index}</p>
                </td>


                <td className="px-5 py-5 bVoucher-b bVoucher-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item?.recieptNumber}</p>
                </td>
                <td className="px-5 py-5 bVoucher-b bVoucher-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item?.ledgerName}</p>
                </td>
                <td className="px-5 py-5 bVoucher-b bVoucher-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item?.gstRegistration} </p>
                </td>


                <td className="px-5 py-5 bVoucher-b bVoucher-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item?.narration} </p>
                </td>
                <td className="px-5 py-5 bVoucher-b bVoucher-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item?.totalAmount} </p>
                </td>
                <td className="px-5 py-5 bVoucher-b bVoucher-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item?.supplierInvoiceNumber} </p>
                </td>




                {/* <td>
                    <span onClick={() => navigate(`/voucher/create/${item.id}`)} className="bg-green-100 text-green-800 text-[10px] font-medium me-2 text-center py-2 px-4 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-pointer w-[210px]"> Add Entry</span>
                </td>
                <td>
                    <span onClick={() => navigate(`/voucher/create/${item.id}`)} className="bg-blue-100 text-green-800 text-[10px] font-medium me-2 text-center py-2 px-4 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-pointer w-[210px]"> View Entries</span>
                </td> */}











                <td className="px-5 py-5 bVoucher-b bVoucher-gray-200 text-sm">
                    <p className="flex text-gray-900 whitespace-no-wrap">
                        <FaPrint
                            size={17}
                            className="text-teal-500 hover:text-teal-700 mx-2"
                            onClick={() => navigate(`/printentrypayment/${item.id}/${item.gstRegistration}`)}
                            title="Print Entry"
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
                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Ledger</label>
                                            {/* <ReactSelect
                                                name="ledgerId"
                                                value={LedgerData?.find(option => option.value === values.ledgerId)}
                                                onChange={(option) => setFieldValue('ledgerId', option ? option.value : null)}
                                                options={[{ label: 'Select Ledger', value: null }, ...LedgerData]}
                                                styles={customStyles}
                                                className="bg-white dark:bg-form-Field"
                                                classNamePrefix="react-select"
                                                placeholder="Select Ledger"
                                            /> */}
                                        </div>

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
                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Party  Name</th>
                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">gstRegistration</th>
                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">narration</th>
                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">totalAmount</th>
                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">supplierInvoiceNumber</th>

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

export default VoucherEntriesView
