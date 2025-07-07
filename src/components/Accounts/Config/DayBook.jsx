import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import Breadcrumb from '../../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'

import ReactSelect from 'react-select';
// import useDayBook from '../../hooks/useDayBook';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Pagination from '../../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../../Constants/utils';

const ViewDayBook = () => {

    // const { handleUpdate, getDayBookNumber, DayBookNo, getSupplier, supplier, getCustomer, customer } = useDayBook();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const theme = useSelector(state => state?.persisted?.theme);
    const [productGroupOption, setproductGroupOption] = useState([]);
    const customStyles = createCustomStyles(theme?.mode);

    const { token } = currentUser;
    const [DayBook, setDayBook] = useState();
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (productGroup.data) {
    //         const formattedOptions = productGroup.data.map(product => ({
    //             value: product.id,
    //             label: product.productGroupName,
    //             productGroupObject: product,
    //         }));
    //         setproductGroupOption(formattedOptions);
    //     }
    // }, [productGroup.data]);

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
    });

    // // Fetch the DayBooks based on the current page
    // const getDayBook = async (page, filters = {}) => {
    //     try {
    //         const response = await fetch(`${SEARCH_DayBook_URL}?page=${page || 1}`, {
    //             method: "POST", // GET method
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${token}`,
    //             },
    //             body: JSON.stringify(filters)
    //         });

    //         const textResponse = await response.text(); // Get the raw text response
    //         // Log raw response before parsing

    //         // Try parsing the response only if it's valid JSON
    //         try {
    //             const data = JSON.parse(textResponse); // Try parsing as JSON
    //             console.log("Parsed Response:", data);

    //             if (data?.content) {
    //                 setDayBook(data.content); // Update DayBooks state
    //             } else {
    //                 console.log("No DayBooks found in the response");
    //                 setDayBook([]); // Set an empty state
    //             }

    //             // Update pagination state
    //             setPagination({
    //                 totalItems: data?.totalElements || 0,
    //                 data: data?.content || [],
    //                 totalPages: data?.totalPages || 0,
    //                 currentPage: data?.number + 1 || 1,
    //                 itemsPerPage: data?.size || 0,
    //             });
    //         } catch (parseError) {
    //             console.error("Error parsing response as JSON:", parseError);
    //             toast.error("Invalid response format.");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching DayBooks:", error);
    //         toast.error("Failed to fetch DayBooks");
    //         setDayBook([]); // Reset to an empty state in case of an error
    //     }
    // };

    // useEffect(() => {
    //     getDayBook(pagination.currentPage);
    // }, [pagination.currentPage]);

    // const handlePageChange = (newPage) => {
    //     setPagination((prev) => ({ ...prev, currentPage: newPage }));
    //     getDayBook(newPage); // Correct function name and 1-indexed for user interaction
    // };

    const renderTableRows = () => {
        if (!DayBook || !DayBook.length) {
            return (
                <tr className='bg-white dark:bg-slate-700 dark:text-white'>
                    <td colSpan="8" className="px-5 py-5 bDayBook-b bDayBook-gray-200 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap text-center">No DayBook Found</p>
                    </td>
                </tr>
            );
        }

        const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

        // const handleDelete = async (e, id) => {
        //     e.preventDefault();
        //     try {
        //         const response = await fetch(`${DELETE_DayBook_URL}/${id}`, {
        //             method: 'DELETE',
        //             headers: {
        //                 "Content-Type": "application/json",
        //                 "Authorization": `Bearer ${token}`,
        //             },
        //         });

        //         const data = await response.json();
        //         if (response.ok) {
        //             toast.success(`DayBook Deleted Successfully !!`);
        //             // Handle page refresh after deletion
        //             getDayBook(pagination.currentPage);
        //         } else {
        //             toast.error(`${data.errorMessage}`);
        //         }
        //     } catch (error) {
        //         console.error(error);
        //         toast.error("An error occurred");
        //     }
        // };

        // return DayBook.map((item, index) => (
        //     <tr key={item.id} className='bg-white dark:bg-slate-700 dark:text-white px-5 py-3'>
        //         <td className="px-5 py-5 bDayBook-b bDayBook-gray-200 text-sm">
        //             <p className="text-gray-900 whitespace-no-wrap">{startingSerialNumber + index}</p>
        //         </td>
        //         <td className="px-5 py-5 bDayBook-b bDayBook-gray-200 text-sm">
        //             <p className="text-gray-900 whitespace-no-wrap">{item?.orderType?.orderTypeName}</p>
        //         </td>
        //         <td className="px-5 py-5 bDayBook-b bDayBook-gray-200 text-sm">
        //             <p className="text-gray-900 whitespace-no-wrap">{item.productGroup.productGroupName}</p>
        //         </td>
        //         <td className="px-5 py-5 bDayBook-b bDayBook-gray-200 text-sm">
        //             <p className="text-gray-900 whitespace-no-wrap">{item.currentDayBook}</p>
        //         </td>
        //         <td className="px-5 py-5 bDayBook-b bDayBook-gray-200 text-sm">
        //             <p className="text-gray-900 whitespace-no-wrap">{item.revisedDayBook}</p>
        //         </td>
        //         <td className="px-5 py-5 bDayBook-b bDayBook-gray-200 text-sm">
        //             <p className="text-gray-900 whitespace-no-wrap">{item.startDate}</p>
        //         </td>
        //         <td className="px-5 py-5 bDayBook-b bDayBook-gray-200 text-sm">
        //             <p className="text-gray-900 whitespace-no-wrap">{item.toDate}</p>
        //         </td>
        //         <td className="px-5 py-5 bDayBook-b bDayBook-gray-200 text-sm">
        //             <p className="flex text-gray-900 whitespace-no-wrap">
        //             <FiEdit size={17} className='text-teal-500 hover:text-teal-700 mx-2' onClick={()=>navigate(`/DayBook/updateDayBook/${item?.id}`)} title='Edit DayBook' />   |
        //                 <FiTrash2 size={17} className='text-red-500 hover:text-red-700 mx-2' onClick={(e) => handleDelete(e, item?.id)} title='Delete Unit' />
        //             </p>
        //         </td>
        //     </tr>
        // ));
    };

    const handleSubmit = (values) => {
        const filters = {
            // productGroup: values.productGroup,
            fromDate: values.fromDate || undefined,
            toDate: values.toDate || undefined,
        };
        // getDayBook(pagination.currentPage, filters);
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="DayBook/ View DayBook" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className='flex justify-between'>
                        <h2 className="text-xl font-semibold leading-tight">View DayBook</h2>
                    </div>
                    <Formik
                        initialValues={{
                            // productGroup: "",
                            fromDate: "",
                            toDate: "",
                        }}
                        onSubmit={handleSubmit}
                    >
                        {({ setFieldValue, values }) => {
                            // useEffect(() => {
                            //     // Check if fromDate is a valid date
                            //     let fromDate = new Date(values.fromDate);

                            //     if (isNaN(fromDate.getTime())) {
                            //         console.error('Invalid start date:', values.fromDate);
                            //         return;  // Exit the effect if the start date is invalid
                            //     }

                            //     console.log(fromDate, 'Original start date');

                            //     // Add 1 year to the fromDate
                            //     fromDate.setFullYear(fromDate.getFullYear() + 1);
                            //     console.log(fromDate, 'Updated start date with 1 year added');

                            //     // Set fromDate and endDate
                            //     setFieldValue('fromDate', values.fromDate); // Ensure the start date is set correctly
                            //     setFieldValue('toDate', fromDate.toISOString().split('T')[0]); // Set the endDate to 1 year after fromDate
                            // }, [values.fromDate, setFieldValue])
                            return (
                                <Form>
                                    <div className="mb-4.5 flex  gap-6 mt-12">
                                        <div className="bg-white dark:bg-form-Field">
                                            <label className="mb-2.5 block text-black dark:text-white">Voucher Type</label>
                                            <ReactSelect
                                                name="productGroup"
                                                // value={productGroupOption?.find(option => option.label === values.productGroup) || null}
                                                // onChange={(option) => setFieldValue('productGroup', option ? option.label : null)}
                                                // options={productGroupOption}
                                                styles={customStyles}
                                                className="bg-white dark:bg-form-Field md:w-[240px]"
                                                classNamePrefix="react-select"
                                                placeholder="Select Product Group"
                                            />
                                        </div>

                                        <div className="mb-4.5 flex gap-6">
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> From Date</label>

                                                <Field
                                                    name='fromDate'
                                                    type="date"
                                                    placeholder="Enter Start Date"
                                                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> To Date</label>
                                                <Field
                                                    disabled
                                                    name='toDate'
                                                    type="date"
                                                    placeholder="Enter To Date"
                                                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                        </div>

                                        {/* Centering the button */}
                                      
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
                            )
                        }}
                    </Formik>

                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr className='px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                        <th className="px-5 py-3 bDayBook-b-2 bDayBook-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SNO</th>
                                        <th className="px-5 py-3 bDayBook-b-2 bDayBook-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                                        <th className="px-5 py-3 bDayBook-b-2 bDayBook-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Particulars</th>
                                        <th className="px-5 py-3 bDayBook-b-2 bDayBook-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Voucher Type</th>
                                        <th className="px-5 py-3 bDayBook-b-2 bDayBook-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Voucher No</th>
                                        <th className="px-5 py-3 bDayBook-b-2 bDayBook-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Debit</th>
                                        <th className="px-5 py-3 bDayBook-b-2 bDayBook-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Credit</th>
                                        <th className="px-5 py-3 bDayBook-b-2 bDayBook-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTableRows()}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            totalPages={pagination.totalPages}
                            currentPage={pagination.currentPage}
                            // handlePageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default ViewDayBook;
