import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import Breadcrumb from '../../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
//  import Flatpickr from 'react-flatpickr';
import { GET_Vouchersearch_URL } from "../../../Constants/utils";
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




const productgrp = [
    { value: 'BrandA', label: 'Brand A' },
    { value: 'BrandB', label: 'Brand B' },
    { value: 'BrandC', label: 'Brand C' },
];


const ViewVoucher = () => {

    const {  Voucherr,getVoucherr } = useVoucher();
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



useEffect(() => {
 getVoucherr()
}, [])
console.log(Voucherr,"jjhhgg");

    // const formattedSupplier = supplier.map(supplier => ({
    //     label: supplier.name,
    //     value: supplier.name
    // }));
    const VoucherType = [
        { value: 'supplier', label: 'supplier' },
        { value: 'customer', label: 'customer' },
    
    ];

    const voucherName = Voucherr && Voucherr.map((vouch) => ({
        label: vouch.name,
        value: vouch.name
      }));
      const voucherType = Voucherr && Voucherr.map((vouch) => ({
        label: vouch.typeOfVoucher,
        value: vouch.typeOfVoucher
      }));
      



    const [IsVoucherModalOpen, setIsVoucherModalOpen] = useState(false)




    const [SelectedVoucherData, setSelectedVoucherData] = useState([])




  


    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
    });


  




    const getVoucher = async (page, filters = {}) => {
        console.log(filters, "filterssssssssssssssssssssssssssssssssssssssss");
        console.log("Fetching Vouchers for page", page); // Log the page number being requested

        try {
            const response = await fetch(`${GET_Vouchersearch_URL}?page=${page || 0}`, {
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

                if (data) {
                    setVoucher(data?.content); // Update Vouchers state
                } else {
                    console.log("No Vouchers found in the response");
                    setVoucher([]); // Set an empty state
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
            console.error("Error fetching Vouchers:", error);
            toast.error("Failed to fetch Vouchers");
            setVoucher([]); // Reset to an empty state in case of an error
        }
    };

    useEffect(() => {
        getVoucher()
    }, [])

    const handlePageChange = (newPage) => {
        console.log("Page change requested:", newPage);

        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        getVoucher(newPage-1); // Correct function name and 1-indexed for user interaction
    };

    console.log(Voucher, "heyVoucher");




    const renderTableRows = () => {
        
        if (!Voucher) {
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



console.log(Voucher,"jumping");


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
                    <p className="text-gray-900 whitespace-no-wrap">{item?.defaultGodown} </p>
                </td>
            
             
                
                <td>
                    <span onClick={() => navigate(`/voucher/create/${item.id}`)} className="bg-green-100 text-green-800 text-[10px] font-medium me-2 text-center py-2 px-4 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-pointer w-[210px]"> Add Entry</span>
                </td>
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
                            onClick={() => navigate(`/Voucher/updateVoucher/${item?.VoucherId}`)}
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
            typeOfVoucher:values?.typeOfVoucher||undefined, 
            name:values.name


        };
        getVoucher(pagination.currentPage-1, filters);
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
                                // VoucherNo: '',
                                // customerName: "",
                                // supplierName: "",
                                // ProductId: "",
                                typeOfVoucher:"",
                                name:""



                            }}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, values, handleBlur }) => (
                                <Form>
                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">



                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                                    
                                            
                                            {/* <div className="z-20 bg-transparent dark:bg-form-Field">
                                                <ReactSelect
                                                    name="supplierName"

                                                    value={productgrp.find(option => option.value === values.customerName)}
                                                    onChange={(option) => setFieldValue('supplierName', option ? option.value : null)}
                                                    // options={formattedSupplier}

                                                    options={[{ label: 'View All Suppliers', value: null }, ...formattedSupplier]}
                                                    styles={customStyles} // Pass custom styles here
                                                    className="bg-white dark:bg-form-Field"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select supplier Name"
                                                />
                                            </div> */}
                                              <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Voucher Name</label>
                                                <ReactSelect
                                                    name="name"

                                                    value={voucherName.find(option => option.value === values.name)}
                                                    onChange={(option) => setFieldValue('name', option ? option.value : null)}
                                                    // options={formattedSupplier}

                                                    options={[{ label: 'View All ', value: null }, ...voucherName]}
                                                    styles={customStyles} // Pass custom styles here
                                                    className="bg-white dark:bg-form-Field"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select Name"
                                                />
                                                
                                            </div>
                                              <div className="flex-1 min-w-[300px]">
                                              <label className="mb-2.5 block text-black dark:text-white">Voucher Type</label>
                                                <ReactSelect
                                                    name="typeOfVoucher"

                                                    value={voucherType.find(option => option.value === values.typeOfVoucher)}
                                                    onChange={(option) => setFieldValue('typeOfVoucher', option ? option.value : null)}
                                                    // options={formattedSupplier}

                                                    options={[{ label: 'View All ', value: null }, ...voucherType]}
                                                    styles={customStyles} // Pass custom styles here
                                                    className="bg-white dark:bg-form-Field"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select Type"
                                                />
                                                
                                            </div>
                                          
                                            
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
                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" >SNO</th>

                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">VoucherName</th>
                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Voucher Type</th>
                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">defaultGodown</th>
                                        <th className="px-2 py-3 bVoucher-b-2 bVoucher-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Add Entries</th>

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
