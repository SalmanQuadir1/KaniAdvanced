import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import Breadcrumb from '../../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
//  import Flatpickr from 'react-flatpickr';
import { DELETE_Voucher_URL, GET_VoucherName_URL, GET_Vouchersearch_URL, UPDATETOGGLE_Voucher_URL } from "../../../Constants/utils";
import ReactSelect from 'react-select';
import useOrder from '../../../hooks/useOrder';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Pagination from '../../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../../Constants/utils';
import { MdCreateNewFolder } from "react-icons/md";
import useVoucher from '../../../hooks/useVoucher';
import { IoIosAdd } from 'react-icons/io';





const productgrp = [
    { value: 'BrandA', label: 'Brand A' },
    { value: 'BrandB', label: 'Brand B' },
    { value: 'BrandC', label: 'Brand C' },
];


const ViewVoucher = () => {

    const { Voucherr, getVoucherr } = useVoucher();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const theme = useSelector(state => state?.persisted?.theme);
    const [isLoading, setisLoading] = useState(false)
    const customStyles = createCustomStyles(theme?.mode);
    const [prodIdOptions, setprodIdOptions] = useState([])




    const { token } = currentUser;
    const [voucherrr, setvoucherrr] = useState([])


    const [Voucher, setVoucher] = useState()




    // const supplier = useSelector(state => state?.nonPersisted?.supplier);
    const Order = useSelector(state => state?.nonPersisted?.Voucher);
    const navigate = useNavigate();



    useEffect(() => {
        getVoucherr()
    }, [])
    console.log(voucherrr, "jjhhgg");

    // const formattedSupplier = supplier.map(supplier => ({
    //     label: supplier.name,
    //     value: supplier.name
    // }));


    const voucherName = voucherrr && voucherrr.map((vouch) => ({
        label: vouch.name,
        value: vouch.name
    }));
    const voucherType = voucherrr && voucherrr.map((vouch) => ({
        label: vouch.typeOfVoucher,
        value: vouch.typeOfVoucher
    }));


    console.log(voucherType, "type");


    const [IsVoucherModalOpen, setIsVoucherModalOpen] = useState(false)




    const [SelectedVoucherData, setSelectedVoucherData] = useState([])







    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
    });



    const getVouchernameAndType = async () => {
        try {
            const response = await fetch(`${GET_VoucherName_URL}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setvoucherrr(data);
            console.log("Voucher names and types:", data);


        } catch (error) {
            logger.error("Error fetching voucher names and types:", error);
        }
    }





    const getVoucher = async (page = 1, filters = {}) => {
        console.log("Fetching vouchers with filters:", filters);
        console.log("Page:", page);

        try {
            const response = await fetch(`${GET_Vouchersearch_URL}?page=${page}`, {
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
                currentPage: data?.number !== undefined ? data.number + 1 : 1,
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
        getVouchernameAndType()
    }, [])

    const handlePageChange = (newPage) => {
        console.log("Page change requested:", newPage);

        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        getVoucher(newPage - 1); // Correct function name and 1-indexed for user interaction
    };

    console.log(Voucher, "heyVoucher");




    const renderTableRows = () => {

        if (!Voucher || Voucher == []) {
            return (
                <tr className='bg-white dark:bg-slate-700 dark:text-white'>
                    <td colSpan="6" className="px-5 py-5 bVoucher-b bVoucher-gray-200 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap text-center">No Voucher Found</p>
                    </td>
                </tr>
            );
        }

        const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

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





        // console.log(selectedBOMData, "jijiji");



        console.log(Voucher, "jumping");


        const handleToggle = async (voucher) => {
            try {
                const newStatus = !voucher.actVoucher; // flip the current status
                const response = await fetch(`${UPDATETOGGLE_Voucher_URL}/${voucher.id}`, {
                    method: "PUT",   // or POST if backend expects POST
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ actVoucher: newStatus }),
                });

                console.log(response, "kkjj");

                if (!response.ok) {
                    throw new Error("Failed to update voucher status");
                }

                toast.success(`Voucher ${newStatus ? "Activated" : "Deactivated"} successfully`);

                // Refresh the table after update
                getVoucher(pagination.currentPage);
            } catch (err) {
                console.error(err);
                toast.error("Error updating voucher status");
            }
        };



        return Voucher.map((item, index) => (

            <tr key={index} className='bg-white dark:bg-slate-700 dark:text-white'>
                <td className="px-5 py-5 bVoucher-b bVoucher-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{startingSerialNumber + index}</p>
                </td>


                <td className="px-5 py-5 bVoucher-b bVoucher-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item?.name}</p>
                </td>
                <td className="px-5 py-5 bVoucher-b bVoucher-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item?.typeOfVoucher} </p>
                </td>


                <td className="px-5 py-5 bVoucher-b bVoucher-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item?.defGstRegist && item?.defGstRegist?.state} </p>
                </td>
                <td className="px-5 py-5 bVoucher-b bVoucher-gray-200 text-sm">
                    <IoIosAdd size={30} onClick={() => navigate(`/configurator/vouchers/${item.id}`)} />
                </td>
                <td className="px-5 py-5  text-sm">
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={item?.actVoucher || false}
                            onChange={() => handleToggle(item)}
                        />
                        <div className="relative w-11 h-6 bg-black rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 transition-all duration-300 ease-in-out
                    peer-checked:bg-green-500">
                            {/* Knob */}
                            <div className="absolute top-[2px] left-[2px] w-5 h-5 bg-white border-2 border-gray-800 rounded-full transition-all duration-300 ease-in-out
                      peer-checked:translate-x-5 peer-checked:border-green-500">
                            </div>
                        </div>

                        <span className="ml-3 text-sm font-medium text-gray-700">
                            {item?.actVoucher ? 'Active' : 'Inactive'}
                        </span>
                    </label>
                </td>



                <td>
                    <span onClick={() => navigate(`/voucher/create/${item.id}`)} className=" view-badge bg-green-100 text-green-800 text-[10px] font-medium me-2 text-center py-2 px-4 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-pointer w-[210px]"> Add Entry</span>
                </td>

                {
                    item.typeOfVoucher == "Payment" && (
                        <td>
                            <span onClick={() => navigate(`/voucherEntriesPayment/${item.id}`)} className=" view-badge bg-blue-100 text-green-800 text-[10px] font-medium me-2 text-center py-2 px-4 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-pointer w-[210px]"> View Entries</span>
                        </td>
                    )

                }


                {
                    item.typeOfVoucher !== "Payment" && (
                        <td>
                            <span onClick={() => navigate(`/voucherEntries/${item.id}`)} className="view-badge bg-blue-100 text-green-800 text-[10px] font-medium me-2 text-center py-2 px-4 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-pointer w-[210px]"> View Entries</span>
                        </td>
                    )
                }
                {/* <td className="px-5 py-5 bVoucher-b bVoucher-gray-200 text-sm">
                    {item.products &&
                        item.products.map((prodId, index) => (
                            <p key={index} className="text-gray-900 whitespace-nowrap">
                                {prodId?.productId}
                            </p>
                        ))}
                </td> */}

                {/* <td className="px-5 py-5 bVoucher-b bVoucher-gray-200 text-sm">
                    {item.products &&
                        item.products.map((prodId, index) => (
                            <p key={index} className="text-gray-900 whitespace-nowrap">
                                {prodId.productStatus}
                            </p>
                        ))}
                </td> */}









                <td className="px-5 py-5 bVoucher-b bVoucher-gray-200 text-sm">
                    <p className="flex text-gray-900 whitespace-no-wrap">
                        <FiEdit
                            size={17}
                            className="text-teal-500 hover:text-teal-700 mx-2"
                            onClick={() => navigate(`/Voucher/update/${item?.id}`)}
                            title="Edit Voucher"
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
            typeOfVoucher: values?.typeOfVoucher || undefined,
            name: values.name


        };
        getVoucher(pagination.currentPage - 1, filters);
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
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800 mb-4">
                <div className="pt-5 pb-4">
                    <div className='flex flex-col justify-center items-center mb-6'>
                        <h2 className="text-xl font-semibold leading-tight mb-3">View Voucher</h2>
                        <div className='w-full border-b-2 border-gray-300 dark:border-gray-600'></div>
                    </div>


                    <div className='items-center justify-center mb-3 '>
                        <Formik
                            initialValues={{
                                // VoucherNo: '',
                                // customerName: "",
                                // supplierName: "",
                                // ProductId: "",
                                typeOfVoucher: "",
                                name: ""



                            }}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, values, handleBlur }) => (
                                <Form>
                                    <div className="mb-6 flex justify-center items-center gap-6 mt-8">
                                        {/* Voucher Name Field */}
                                        <div className="min-w-[300px]">
                                            <label className="mb-2.5 block font-bold text-black dark:text-white">
                                                Voucher Name
                                            </label>
                                            <ReactSelect
                                                name="name"
                                                value={voucherName.find(option => option.value === values.name)}
                                                onChange={(option) => setFieldValue('name', option ? option.value : null)}
                                                options={[{ label: 'View All', value: null }, ...voucherName]}
                                                styles={customStyles}
                                                className="bg-white dark:bg-form-Field"
                                                classNamePrefix="react-select"
                                                placeholder="Select Voucher Name"
                                                isClearable
                                            />
                                        </div>

                                        {/* Voucher Type Field */}
                                        <div className="min-w-[300px]">
                                            <label className="mb-2.5 block font-bold text-black dark:text-white">
                                                Voucher Type
                                            </label>
                                            <ReactSelect
                                                name="typeOfVoucher"
                                                value={voucherType.find(option => option.value === values.typeOfVoucher)}
                                                onChange={(option) => setFieldValue('typeOfVoucher', option ? option.value : null)}
                                                options={[{ label: 'View All', value: null }, ...voucherType]}
                                                styles={customStyles}
                                                className="bg-white dark:bg-form-Field"
                                                classNamePrefix="react-select"
                                                placeholder="Select Voucher Type"
                                                isClearable
                                            />
                                        </div>
                                    </div>

                                    {/* Search Button */}
                                    <div className="flex justify-center mt-4">
                                        <button
                                            type="submit"
                                            className="flex w-[240px] h-[44px] rounded-lg justify-center items-center bg-primary font-medium text-white hover:bg-opacity-90 transition duration-300 shadow-md hover:shadow-lg"
                                        >
                                            <span className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                                Search
                                            </span>
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>

                </div>
            </div>
            <div>

                <div className='mt-9 bg-white'>

                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8  overflow-x-auto">
                        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr className='bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" >SNO</th>

                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">VoucherName</th>
                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Voucher Type</th>
                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">GST REGISTRATION</th>
                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ADD SUB VOUCHER</th>
                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Activation Status</th>
                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Add Entries</th>
                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">View Entries</th>
                                        {/* <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[600px] md:w-[120px]">ADD BOM </th> */}

                                        <th className="px-5 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
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

export default ViewVoucher
