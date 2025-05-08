import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import Breadcrumb from '../../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
//  import Flatpickr from 'react-flatpickr';
import {  VIEW_SUPPLIER_LEDGER, VIEW_SUPPLIER_LEDGERBYID,  } from "../../../Constants/utils";
import ReactSelect from 'react-select';
import useOrder from '../../../hooks/useOrder';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Pagination from '../../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../../Constants/utils';
import { MdCreateNewFolder } from "react-icons/md";
import useSupplier from '../../../hooks/useSupplier';




const productgrp = [
    { value: 'BrandA', label: 'Brand A' },
    { value: 'BrandB', label: 'Brand B' },
    { value: 'BrandC', label: 'Brand C' },
];


const ViewSuppLedger = () => {

    const { handleUpdate, getLedgerNumber, OrderNo, getSupplier, productId,
        getprodId, supplier, getCustomer, customer } = useOrder();
      
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const theme = useSelector(state => state?.persisted?.theme);
    const [isLoading, setisLoading] = useState(false)
    const customStyles = createCustomStyles(theme?.mode);
    const [prodIdOptions, setprodIdOptions] = useState([])

    useEffect(() => {
      
        getSupplier();
     


    }, []);
  


    const { token } = currentUser;

    console.log(productId, "huhuuhuuuuuuuuuuuuuuuuu");

    const [Ledger, setLedger] = useState()

    const [supplierNameOptions, setsupplierNameOptions] = useState([])


   
    // const supplier = useSelector(state => state?.nonPersisted?.supplier);
    const Order = useSelector(state => state?.nonPersisted?.Ledger);
    const navigate = useNavigate();


    console.log(supplier, customer, productId, "LedgerNo");

  

    const formattedSupplier = supplier.map(supplier => ({
        label: supplier.name,
        value: supplier.name
    }));



const [IsLEDGERModalOpen, setIsLEDGERModalOpen] = useState(false)

 


const [SelectedLEDGERData, setSelectedLEDGERData] = useState([])




    console.log(supplierNameOptions, "heyyy");


    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
    });


    useEffect(() => {
        if (supplier.data) {
            const formattedOptions = supplier.data.map(supp => ({
                value: supp.id,
                label: supp?.name,
                supplierNameObject: supp,
                suplierid: { id: supp.id }
            }));
            setsupplierNameOptions(formattedOptions);
        }
    }, [supplier.data]);




    const getLedger = async (page, filters = {}) => {
        console.log(filters, "filterssssssssssssssssssssssssssssssssssssssss");
        console.log("Fetching Ledgers for page", page); // Log the page number being requested

        try {
            const response = await fetch(`${VIEW_SUPPLIER_LEDGER}?page=${page || 1}`, {
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
                    setLedger(data); // Update Ledgers state
                } else {
                    console.log("No Ledgers found in the response");
                    setLedger([]); // Set an empty state
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
            console.error("Error fetching Ledgers:", error);
            toast.error("Failed to fetch Ledgers");
            setLedger([]); // Reset to an empty state in case of an error
        }
    };

    useEffect(() => {
        getLedger()
    }, [])

    const handlePageChange = (newPage) => {
        console.log("Page change requested:", newPage);

        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        getLedger(newPage); // Correct function name and 1-indexed for user interaction
    };

    console.log(Ledger, "heyLedger");




    const renderTableRows = () => {
        console.log(Ledger);
        if (!Ledger || !Ledger.length) {
            return (
                <tr className='bg-white dark:bg-slate-700 dark:text-white'>
                    <td colSpan="6" className="px-5 py-5 bLedger-b bLedger-gray-200 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap text-center">No Ledger Found</p>
                    </td>
                </tr>
            );
        }

        const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

        const handleDelete = async (e, id) => {
            e.preventDefault();
            try {
                const response = await fetch(`${DELETE_Ledger_URL}/${id}`, { // Correct API endpoint
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    toast.success(`Ledger Deleted Successfully !!`);

                    // Check if the current page becomes empty
                    const isCurrentPageEmpty = Ledger.length === 1;

                    if (isCurrentPageEmpty && pagination.currentPage > 1) {
                        const previousPage = pagination.currentPage - 1;
                        handlePageChange(previousPage); // Go to the previous page if current page becomes empty
                    } else {
                        getLedger(pagination.currentPage); // Refresh Ledgers on the current page
                    }
                } else {
                    toast.error(`${data.errorMessage}`);
                }
            } catch (error) {
                console.error(error);
                toast.error("An error occurred");
            }
        };


        const openLEDGERModal = (id) => {
            console.log("opening");


            const getLEDGER = async () => {
    
                try {
                    const response = await fetch(`${VIEW_SUPPLIER_LEDGERBYID}/${id}`, {
                        method: "GET",
                        headers: {
                            // "Content-Type": "multipart/form-data",
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    console.log("data++++++===",data);
    
    
                    // setLocation(data);
                    setSelectedLEDGERData(data);
    
    
                } catch (error) {
                    console.error(error);
                    toast.error("Failed to fetch Product");
                }
            };
    
            getLEDGER()
                // useEffect(() => {
                //     getLEDGER()
                // }, [])
    
    
    
    
                ;
            // setmrp(mrp)
            setIsLEDGERModalOpen(true);
        };
    
    
        // console.log(selectedBOMData, "jijiji");
    
       


        

        return Ledger.map((item, index) => (

            <tr key={index} className='bg-white dark:bg-slate-700 dark:text-white'>
                <td className="px-5 py-5 bLedger-b bLedger-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{startingSerialNumber + index}</p>
                </td>

                <td className="px-5 py-5 bLedger-b bLedger-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item?.orderNo}</p>

                </td>
                <td className="px-5 py-5 bLedger-b bLedger-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item.supplierName}</p>
                </td>
                <td>
                <span onClick={() => openLEDGERModal(item?.supplierId)} className="bg-green-100 text-green-800 text-[10px] font-medium me-2 text-center py-2 px-4 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-pointer w-[210px]"> VIEW LEDGER</span>
                    </td>
                {/* <td className="px-5 py-5 bLedger-b bLedger-gray-200 text-sm">
                    {item.products &&
                        item.products.map((prodId, index) => (
                            <p key={index} className="text-gray-900 whitespace-nowrap">
                                {prodId?.productId}
                            </p>
                        ))}
                </td> */}

                {/* <td className="px-5 py-5 bLedger-b bLedger-gray-200 text-sm">
                    {item.products &&
                        item.products.map((prodId, index) => (
                            <p key={index} className="text-gray-900 whitespace-nowrap">
                                {prodId.productStatus}
                            </p>
                        ))}
                </td> */}









                <td className="px-5 py-5 bLedger-b bLedger-gray-200 text-sm">
                    <p className="flex text-gray-900 whitespace-no-wrap">
                        <FiEdit
                            size={17}
                            className="text-teal-500 hover:text-teal-700 mx-2"
                            onClick={() => navigate(`/Ledger/updateLedgerCreated/${item?.id}`)}
                            title="Edit Ledger"
                        />
                        |
                        {
                            item.LedgerTypeName === "WSClients" ? (
                                <MdCreateNewFolder
                                    size={17}
                                    className="text-teal-500 hover:text-teal-700 mx-2"
                                    onClick={() => navigate(`/Ledger/generateProforma/${item?.id}`)}
                                    title="Create proforma"
                                />
                            ) : item.LedgerTypeName === "RetailClients" ? (
                                <MdCreateNewFolder
                                    size={17}
                                    className="text-teal-500 hover:text-teal-700 mx-2"
                                    onClick={() => navigate(`/Ledger/generateRetailProforma/${item?.id}`)} // Navigate to a different page for RetailClients
                                    title="Create proforma"
                                />
                            ) : null
                        }
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




       
            supplierName: values.supplierName || undefined,

         
        };
        getLedger(pagination.currentPage, filters);
        // ViewInventory(pagination.currentPage, filters);
    };

    console.log(prodIdOptions, "llkkllkk");
    const closeLEDGERModal = () => {
        setIsLEDGERModalOpen(false);
        setSelectedLEDGERData(null);
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Ledger/ View Ledger" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className='flex justify-between'>
                        <h2 className="text-xl font-semibold leading-tight">View Ledger</h2>
                        {/* <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success dark:bg-white dark:text-slate-800`}>
                            TOTAL PRODUCTS: {pagination.totalItems}
                        </p> */}
                    </div>
                    {IsLEDGERModalOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-95 flex justify-center items-center  z-50 ">
                <div className="bg-slate-100 border border-b-1 rounded p-6 shadow-lg ml-[200px]  w-[870px] h-[400px] mt-[60px] dark:bg-slate-600">
                    <div className="text-right">
                        <button onClick={()=>closeLEDGERModal()} className="text-red-500 text-xl  font-bold">&times;</button>
                    </div>
                    <h2 className="text-2xl text-center mb-4 font-extrabold shadow-sm">LEDGER DETAILS OF SUPPLIERS</h2>
                    <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr className='px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                <th className="px-2 py-3 bLedger-b-2 bLedger-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SupplierName</th>
                                <th className="px-2 py-3 bLedger-b-2 bLedger-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                                        <th className="px-2 py-3 bLedger-b-2 bLedger-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Debit </th>
                                        <th className="px-2 py-3 bLedger-b-2 bLedger-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Credit </th>
                                        <th className="px-2 py-3 bLedger-b-2 bLedger-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Balance  </th>
                                </tr>
                            </thead>
                            <tbody>


                                {/* {selectedINVENTORYData && (
                                    <>
                                        {selectedINVENTORYData.map((row, index) => (
                                            <tr key={row.id}>
                                                <td className="px-2 py-2 border-b dark:text-white">
                                                    <p>{row?.location?.address}</p>
                                                </td>
                                                <td className="px-2 py-2 border-b dark:text-white">
                                                    <p>{row?.openingBalance}</p>
                                                </td>
                                                <td className="px-2 py-2 border-b dark:text-white">
                                                    {row.rate}
                                                </td>
                                                <td className="px-2 py-2 border-b dark:text-white">
                                                    {row.value}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td
                                                className="px-2 py-2 border-t font-bold text-black dark:text-white"
                                                colSpan={3}
                                            >
                                                Total Values
                                            </td>
                                            <td className="px-2 py-2 border-t font-bold text-black dark:text-white">
                                                {selectedINVENTORYData
                                                    .reduce((total, currentRow) => total + (currentRow.value || 0), 0)
                                                    .toFixed(2)}
                                            </td>
                                            <td className="px-2 py-2 border-t"></td>
                                        </tr>
                                    </>
                                )} */}



                            </tbody>
                        </table>
                    </div>

                    {/* <pre>{JSON.stringify(selectedBOMData, null, 2)}</pre> */}
                </div>
            </div>
        )}


                    <div className='items-center justify-center'>
                        <Formik
                            initialValues={{
                                LedgerNo: '',
                                customerName: "",
                                supplierName: "",
                                ProductId: ""



                            }}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, values, handleBlur }) => (
                                <Form>
                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">



                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Supplier
                                                <span className="text-red-700 text-xl mt-[40px] justify-center items-center"> *</span>
                                            </label>
                                            <div className="z-20 bg-transparent dark:bg-form-Field">
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
                                        <th className="px-2 py-3 bLedger-b-2 bLedger-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" >SNO</th>
                                        <th className="px-2 py-3 bLedger-b-2 bLedger-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Order No</th>
                                        <th className="px-2 py-3 bLedger-b-2 bLedger-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SupplierName</th>
                                        <th className="px-2 py-3 bLedger-b-2 bLedger-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">View Ledger</th>
                                        {/* <th className="px-2 py-3 bLedger-b-2 bLedger-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[600px] md:w-[120px]">ADD BOM </th> */}

                                        <th className="px-5 py-3 bLedger-b-2 bLedger-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
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

export default ViewSuppLedger
