import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
//  import Flatpickr from 'react-flatpickr';
import { VIEW_STOCKJOURNALCREATED } from "../../Constants/utils";
import ReactSelect from 'react-select';

import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import { MdCreateNewFolder } from "react-icons/md";
import useStockJournel from '../../hooks/useStockJournel';




const productgrp = [
    { value: 'BrandA', label: 'Brand A' },
    { value: 'BrandB', label: 'Brand B' },
    { value: 'BrandC', label: 'Brand C' },
];


const ViewStockJournalCreated = () => {

    const { VoucherNo,getVoucherNo } = useStockJournel();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const theme = useSelector(state => state?.persisted?.theme);
    const [isLoading, setisLoading] = useState(false)
    const customStyles = createCustomStyles(theme?.mode);
    const [prodIdOptions, setprodIdOptions] = useState([])
    const [VoucherOptions, setVoucherOptions] = useState([])
 
    useEffect(() => {
        getVoucherNo()
    }, [])

    useEffect(() => {
        if (VoucherNo) {
            const formattedProdIdOptions = VoucherNo?.map(prodId => ({
                value: prodId,
                label: prodId,
              
            }));
            setVoucherOptions(formattedProdIdOptions);
        }
    }, [VoucherNo]);
    
console.log(VoucherNo,'voucherNo======================');


    const { token } = currentUser;

  

    const [StockJournal, setStockJournal] = useState()

   
    const navigate = useNavigate();


  

   



console.log("stockjournal+++++",StockJournal)

  









    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
    });







    const getStockJournal = async (page, filters = {}) => {
        console.log(filters, "filterssssssssssssssssssssssssssssssssssssssss");
        console.log("Fetching StockJournals for page", page); // Log the page number being requested

        try {
            const response = await fetch(`${VIEW_STOCKJOURNALCREATED}?page=${page || 1}`, {
                method: "POST", // GET method
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(filters)
            });

            const textResponse = await response.text();

            console.log(textResponse, "japaaaaaaaaaaaaaaaaaan");

            // Get the raw text response
            // Log raw response before parsing   

            // Try parsing the response only if it's valid JSON
            try {
                const data = JSON.parse(textResponse); // Try parsing as JSON
                console.log("Parsed Response:", data);

                if (data?.content) {
                    setStockJournal(data.content); // Update StockJournals state
                } else {
                    console.log("No StockJournals found in the response");
                    setStockJournal([]); // Set an empty state
                }

                // Update pagination state
                setPagination({
                    totalItems: data?.totalElements || 0,
                    data: data?.content || [],
                    totalPages: data?.totalPages || 0,
                    currentPage: data?.number + 1 || 1,
                    itemsPerPage: data?.size || 0,
                });
            } catch (parseError) {
                console.error("Error parsing response as JSON:", parseError);
                toast.error("Invalid response format.");
            }
        } catch (error) {
            console.error("Error fetching StockJournals:", error);
            toast.error("Failed to fetch StockJournals");
            setStockJournal([]); // Reset to an empty state in case of an error
        }
    };

    useEffect(() => {
        getStockJournal()
    }, [])

    const handlePageChange = (newPage) => {
        console.log("Page change requested:", newPage);

        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        getStockJournal(newPage); // Correct function name and 1-indexed for user interaction
    };

    console.log(StockJournal, "heyStockJournal");




    const renderTableRows = () => {
        console.log(StockJournal);
        if (!StockJournal || !StockJournal.length) {
            return (
                <tr className='bg-white dark:bg-slate-700 dark:text-white'>
                    <td colSpan="6" className="px-5 py-5 bStockJournal-b bStockJournal-gray-200 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap text-center">No StockJournal Found</p>
                    </td>
                </tr>
            );
        }

        const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

        // const handleDelete = async (e, id) => {
        //     e.preventDefault();
        //     try {
        //         const response = await fetch(`${DELETE_StockJournal_URL}/${id}`, { // Correct API endpoint
        //             method: 'DELETE',
        //             headers: {
        //                 "Content-Type": "application/json",
        //                 "Authorization": `Bearer ${token}`,
        //             },
        //         });

        //         const data = await response.json();
        //         if (response.ok) {
        //             toast.success(`StockJournal Deleted Successfully !!`);

        //             // Check if the current page becomes empty
        //             const isCurrentPageEmpty = StockJournal.length === 1;

        //             if (isCurrentPageEmpty && pagination.currentPage > 1) {
        //                 const previousPage = pagination.currentPage - 1;
        //                 handlePageChange(previousPage); // Go to the previous page if current page becomes empty
        //             } else {
        //                 getStockJournal(pagination.currentPage); // Refresh StockJournals on the current page
        //             }
        //         } else {
        //             toast.error(`${data.errorMessage}`);
        //         }
        //     } catch (error) {
        //         console.error(error);
        //         toast.error("An error occurred");
        //     }
        // };







        return StockJournal.map((item, index) => (

            <tr key={index} className='bg-white dark:bg-slate-700 dark:text-white'>
                <td className="px-5 py-5 bStockJournal-b bStockJournal-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{startingSerialNumber + index}</p>
                </td>
                <td className="px-5 py-5 bStockJournal-b bStockJournal-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item?.voucherNo}</p>

                </td>

                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    {item.transferProducts&&
                        item.transferProducts
                        .map((item, index) => (
                            <p key={index} className="text-gray-900 whitespace-nowrap">
                                {item?.productId}
                            </p>
                        ))}
                </td>
                <td className="px-5 py-5 bStockJournal-b bStockJournal-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item.createdDate.split('T')[0]}</p>
                </td>
            

              









                <td className="px-5 py-5 bStockJournal-b bStockJournal-gray-200 text-sm">
                    <p className="flex text-gray-900 whitespace-no-wrap">
                        <FiEdit
                            size={17}
                            className="text-teal-500 hover:text-teal-700 mx-2"
                            onClick={() => navigate(`/StockJournal/verifyStockJournalCreated/${item?.id}`)}
                            title="Edit StockJournal"
                        />
                        
                     
                       
                    </p>
                </td>

            </tr>
        ));
    };


    const handleSubmit = (values) => {

        console.log(values, "valiiiiii");
        const filters = {




            voucherNo: values.voucherNo || undefined,
       
        };
        getStockJournal(pagination.currentPage, filters);
        // ViewInventory(pagination.currentPage, filters);
    };

    console.log(prodIdOptions, "llkkllkk");

    return (
        <DefaultLayout>
            <Breadcrumb pageName="StockJournal/ View StockJournal" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className='flex justify-between'>
                        <h2 className="text-xl font-semibold leading-tight">Verify Stock Journal</h2>
                        {/* <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success dark:bg-white dark:text-slate-800`}>
                            TOTAL PRODUCTS: {pagination.totalItems}
                        </p> */}
                    </div>


                    <div className='items-center justify-center'>
                        <Formik
                            initialValues={{
                                voucherNo: '',
                             



                            }}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, values, handleBlur }) => (
                                <Form>
                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">

                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Voucher No</label>
                                            <ReactSelect
                                                name="StockJournalNo"
                                                value={VoucherOptions.find(option => option.value === values.StockJournalNo)}
                                                onChange={(option) => {
                                                    setFieldValue('voucherNo', option.value);

                                                }}
                                                onBlur={handleBlur}
                                                // options={formattedStockJournal}

                                                options={[{ label: 'View All Vouchers', value: null }, ...VoucherOptions]}

                                                styles={customStyles}
                                                className="bg-white dark:bg-form-input"
                                                classNamePrefix="react-select"
                                                placeholder="Select"
                                            />

                                        </div>


                                  
                                    </div>




                            

                                    <div className="flex justify-center">
                                        <button
                                            type="submit"
                                            className="flex md:w-[240px] w-[220px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center  bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
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
                                        <th className="px-2 py-3 bStockJournal-b-2 bStockJournal-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" >SNO</th>
                                        <th className="px-2 py-3 bStockJournal-b-2 bStockJournal-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Voucher No</th>
                                        <th className="px-2 py-3 bStockJournal-b-2 bStockJournal-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product Id</th>
                                        <th className="px-2 py-3 bStockJournal-b-2 bStockJournal-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>

                                        {/* <th className="px-2 py-3 bStockJournal-b-2 bStockJournal-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[600px] md:w-[120px]">ADD BOM </th> */}

                                        <th className="px-5 py-3 bStockJournal-b-2 bStockJournal-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
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

export default ViewStockJournalCreated
