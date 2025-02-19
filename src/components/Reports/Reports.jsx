import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
//  import Flatpickr from 'react-flatpickr';
import { DELETE_ORDER_URL, DOWNLOADCSV_REPORT, DOWNLOAD_REPORT, VIEW_ALL_ORDERS, VIEW_CREATED_ORDERS, VIEW_REPORT } from "../../Constants/utils";
import ReactSelect from 'react-select';
import useorder from '../../hooks/useOrder';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import useReports from '../../hooks/useReports';




const productgrp = [
    { value: 'BrandA', label: 'Brand A' },
    { value: 'BrandB', label: 'Brand B' },
    { value: 'BrandC', label: 'Brand C' },
];


const Reports = () => {

    const { productGroup, Supplier, orderType, getSupplier,
        getOrderNo,
        getProdId, orderNo,
        prodId, getCustomer, Customer } = useReports();

        const [loading, setLoading] = useState(false);

    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const theme = useSelector(state => state?.persisted?.theme);

    const customStyles = createCustomStyles(theme?.mode);
const [report, setreport] = useState()

    const { token } = currentUser;

    // console.log(productIdd,"huhuuhuuuuuuuuuuuuuuuuu");

    const [Order, setOrder] = useState()

    const [supplierNameOptions, setsupplierNameOptions] = useState([])
    const [orderNameOptions, setorderNameOptions] = useState([])
    // const supplier = useSelector(state => state?.nonPersisted?.supplier);
    const order = useSelector(state => state?.nonPersisted?.order);
    const navigate = useNavigate();
    useEffect(() => {
        getSupplier(),
            getOrderNo(),
            getProdId(),
            getCustomer()

    }, []);

    const formattedProductGroup = productGroup?.map(prod => ({
        label: prod.productGroupName,
        value: prod.productGroupName
    }));
    const formattedOrderType = orderType?.map(type => ({
        label: type.orderTypeName,
        value: type.orderTypeName
    }));
    const formattedCustomer = Customer?.map(cust => ({
        label: cust.customerName,
        value: cust.customerName
    }));



    const formattedSupplier = Supplier?.map(sup => ({
        label: sup.name,
        value: sup.id
    }));

    console.log(Supplier,"jhjhjh");

    // console.log(Customer,"kjkjkjkj");
    // console.log(supplier, customer, productIdd, "orderNo");

    const formattedProdId = prodId.map(prodId => ({
        label: prodId,
        value: prodId
    }));

    const formattedOrderNo = orderNo.map(orderNo => ({
        label: orderNo,
        value: orderNo
    }));

    // const formattedProdId = productIdd.map(prod => ({
    //     label: prod,
    //     value: prod
    // }));




    // const formattedCustomer = customer.map(customer => ({
    //     label: customer.customerName,
    //     value: customer.customerName
    // }));





    // useEffect(() => {
    //     if (supplier.data) {
    //         const formattedOptions = supplier.data.map(supp => ({
    //             value: supp.id,
    //             label: supp?.name,
    //             supplierNameObject: supp,
    //             suplierid: { id: supp.id }
    //         }));
    //         setsupplierNameOptions(formattedOptions);
    //     }
    // }, [supplier.data]);

    // console.log(supplierNameOptions, "heyyy");


    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
    });


    // useEffect(() => {
    //     if (supplier.data) {
    //         const formattedOptions = supplier.data.map(supp => ({
    //             value: supp.id,
    //             label: supp?.name,
    //             supplierNameObject: supp,
    //             suplierid: { id: supp.id }
    //         }));
    //         setsupplierNameOptions(formattedOptions);
    //     }
    // }, [supplier.data]);




    // const getOrder = async (page, filters = {}) => {
    //     console.log(filters, "filterssssssssssssssssssssssssssssssssssssssss");
    //     console.log("Fetching orders for page", page); // Log the page number being requested

    //     try {
    //         const response = await fetch(`${VIEW_CREATED_ORDERS}?page=${page || 1}`, {
    //             method: "POST", // GET method
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${token}`,
    //             },
    //             body: JSON.stringify(filters)
    //         });

    //         const textResponse = await response.text();

    //         console.log(textResponse, "japaaaaaaaaaaaaaaaaaan");

    //         // Get the raw text response
    //         // Log raw response before parsing   

    //         // Try parsing the response only if it's valid JSON
    //         try {
    //             const data = JSON.parse(textResponse); // Try parsing as JSON
    //             console.log("Parsed Response:", data);

    //             if (data?.content) {
    //                 setOrder(data.content); // Update orders state
    //             } else {
    //                 console.log("No orders found in the response");
    //                 setOrder([]); // Set an empty state
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
    //         console.error("Error fetching orders:", error);
    //         toast.error("Failed to fetch orders");
    //         setOrder([]); // Reset to an empty state in case of an error
    //     }
    // };

    // useEffect(() => {
    //     getOrder()
    // }, [])

 

    console.log(order, "heyorder");


    //   console.log(order)
    //   useEffect(() => {
    //     if (order.data) {
    //         const formattedOptions = order.data.map(ord => ({
    //             value: ord.id,
    //             label: ord?.name,
    //             orderNameObject: ord,
    //             orderid: { id: ord.id }
    //         }));
    //         setorderNameOptions(formattedOptions);
    //     }
    // }, [order.data]);

    const renderTableRows = () => {
        console.log(report);
        if (!report || !report.length) { 
            return (
                <tr className='bg-white dark:bg-slate-700 dark:text-white'>
                    <td colSpan="6" className="px-5 py-5 border-b border-gray-200 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap text-center">No Order Found</p>
                    </td>
                </tr>
            );
        }

        const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

        const handleDelete = async (e, id) => {
            e.preventDefault();
            try {
                const response = await fetch(`${DELETE_ORDER_URL}/${id}`, { // Correct API endpoint
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    toast.success(`Order Deleted Successfully !!`);

                    // Check if the current page becomes empty
                    const isCurrentPageEmpty = Order.length === 1;

                    if (isCurrentPageEmpty && pagination.currentPage > 1) {
                        const previousPage = pagination.currentPage - 1;
                        handlePageChange(previousPage); // Go to the previous page if current page becomes empty
                    } else {
                        getOrder(pagination.currentPage); // Refresh orders on the current page
                    }
                } else {
                    toast.error(`${data.errorMessage}`);
                }
            } catch (error) {
                console.error(error);
                toast.error("An error occurred");
            }
        };
        return report.map((item, index) => (

            <tr key={index} className='bg-white dark:bg-slate-700 dark:text-white'>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{startingSerialNumber + index}</p>
                </td>

                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item?.orderNo}</p>

                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item.customerName}</p>
                </td>


                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item?.products?.productId}</p>
                </td>

                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item.receivedQuantity}</p>
                </td>
              
                

               
                {/* <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    {item.products &&
                        item.products.map((prodId, index) => (
                            <p key={index} className="text-gray-900 whitespace-nowrap">
                                {prodId?.productId}
                            </p>
                        ))}
                </td> */}
                 <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item?.orderQuantity||0}</p>
                </td>
              

                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    {item.productSuppliers &&
                        item.productSuppliers.map((supp, index) => (
                            <p key={index} className="text-gray-900 whitespace-nowrap">
                                {supp?.supplier?.name}
                            </p>
                        ))}
                </td>









           
            </tr>
        ));








    };
    const getReport = async (page, filters = {}) => {
        console.log(filters, "filterssssssssssssssssssssssssssssssssssssssss");
        console.log("Fetching orders for page", page); // Log the page number being requested

        try {
        const response = await fetch(`${VIEW_REPORT}?page=${page || 1}`, {
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
                    setreport(data.content); // Update orders state
                } else {
                    console.log("No orders found in the response");
                    setreport([]); // Set an empty state
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
            console.error("Error fetching orders:", error);
            toast.error("Failed to fetch orders");
            setOrder([]); // Reset to an empty state in case of an error
        }
    };

    useEffect(() => {
        getReport()
    }, [])

    // const handlePageChange = (newPage) => {
    //     console.log("Page change requested:", newPage);

    //     setPagination((prev) => ({ ...prev, currentPage: newPage }));
    //     getOrder(newPage); // Correct function name and 1-indexed for user interaction
    // };


    const handleSubmit = (values) => {

        console.log(values, "valiiiiii");
        const filters = {



            orderType: values.orderTypeName,
            group: values.productGroup,
            orderNo: values.orderNo ,
            customerName: values.customerName ,
            supplierId: values.supplierName ,
            productId: values.ProductId ,


            fromDate: values.fromDate,
            toDate: values.toDate,


        };
        console.log(filters,"kk");
getReport(pagination.currentPage, filters)
        // getOrder(pagination.currentPage, filters);
        // ViewInventory(pagination.currentPage, filters);
    };

    // const handlegenerateReport = async (values) => {

    //     const filters = {



    //         orderType: values.orderTypeName,
    //         group: values.productGroup,
    //         orderNo: values.orderNo ,
    //         customerName: values.customerName ,
    //         supplierId: values.supplierName ,
    //         productId: values?.productId,


    //         fromDate: values.fromDate,
    //         toDate: values.toDate,


    //     };
    //     console.log(filters, "lala");

    //     try {
    //         const response = await fetch(`${DOWNLOAD_REPORT}`, {
    //           method: 'POST',
    //           headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${token}`,
    //           },
    //           body:JSON.stringify({filters})

    //         });
    //         const data = await response.json();
    //         console.log(data,"datattatattatata");
    //         if (response) {
    //             console.log(response,"afterok");
    //             // const blob = await response.blob();

    //             // // Create a temporary download link
    //             // const url = window.URL.createObjectURL(blob);
    //             // const link = document.createElement('a');
    //             // link.href = url;
    //             // // link.setAttribute('download'.pdf` // Filename for the downloaded file);

    //             // // Append to the document and trigger the download
    //             // document.body.appendChild(link);
    //             // link.click();

    //             // // Clean up
    //             // link.parentNode.removeChild(link);
    //             // window.URL.revokeObjectURL(url);

    //          toast.success("report downlaoded Successfully")


    //             // getSize(pagination.currentPage); // Fetch updated Size
    //         } else {
    //             toast.error(`${data.errorMessage}`);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("An error occurred");
    //     } finally {
            
    //     }
    // }

    const handlegenerateReport = async (values) => {
        const filters = {
            orderType: values.orderTypeName,
            group: values.productGroup,
            orderNo: values.orderNo,
            customerName: values.customerName,
            supplierId: values.supplierName,
            productId: values?.ProductId,
            fromDate: values.fromDate,
            toDate: values.toDate,
        };
    
        console.log(filters, "lala");
    
        try {
            const response = await fetch(`${DOWNLOAD_REPORT}`, { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body:JSON.stringify(filters), // Convert body to JSON string
            });
    
            if (!response.ok) {
                const errorText = await response.text(); // Get error response as text
                throw new Error(errorText || "Failed to download report");
            }
    
            const blob = await response.blob(); // Get the binary PDF file
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            // link.setAttribute("download", "report.pdf"); // Ensure correct filename
    
            document.body.appendChild(link);
            link.click();
    
            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
    
            toast.success("Report downloaded successfully");
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while downloading the report");
        }
    };
    const handlegenerateCsv = async (values) => {
        const filters = {
            orderType: values.orderTypeName,
            group: values.productGroup,
            orderNo: values.orderNo,
            customerName: values.customerName,
            supplierId: values.supplierName,
            productId: values?.ProductId,
            fromDate: values.fromDate,
            toDate: values.toDate,
        };
    
        console.log(filters, "lala");
    
        try {
            const response = await fetch(`${DOWNLOADCSV_REPORT}`, { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(filters), // Convert body to JSON string
            });
    
            if (!response.ok) {
                const errorText = await response.text(); // Get error response as text
                throw new Error(errorText || "Failed to download report");
            }
    
            const blob = await response.blob(); // Get the binary CSV file
            
            // Extract the filename from the Content-Disposition header
            const disposition = response.headers.get("Content-Disposition");
            let filename = "report.csv"; // Default filename
            if (disposition && disposition.includes("attachment")) {
                const match = disposition.match(/filename="(.+)"/);
                if (match && match[1]) {
                    filename = match[1];
                }
            }
    
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename); // Use the filename from the header
    
            document.body.appendChild(link);
            link.click();
    
            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
    
            toast.success("Report downloaded successfully");
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while downloading the report");
        }
    };
    
    









    const handlePageChange = (newPage) => {
        console.log("Page change requested:", newPage);

        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        getReport(newPage); // Correct function name and 1-indexed for user interaction
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Order/ View Order" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className='flex justify-between'>
                        <h2 className="text-xl font-semibold leading-tight">Order Report</h2>
                        {/* <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success dark:bg-white dark:text-slate-800`}>
                            TOTAL PRODUCTS: {pagination.totalItems}
                        </p> */}
                    </div>


                    <div className='items-center justify-center'>
                        <Formik
                            initialValues={{
                                orderTypeName: '',
                                productGroup: "",
                                orderNo: '',
                                ProductId: "",
                                supplierName: "",
                                customerName: "",
                                fromDate: '',
                                toDate: ''



                            }}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, values, handleBlur }) => (
                                <Form>
                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">

                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Order Type</label>
                                            <ReactSelect
                                                name="orderType"
                                                // value={orderNameOptions.find(option => option.value === values.orderNo)}
                                                onChange={(option) => {
                                                    setFieldValue('orderTypeName', option.value);

                                                }}
                                                // onBlur={handleBlur}
                                                // options={formattedorder}

                                                options={[{ label: 'View All Order', value: null }, ...formattedOrderType]}

                                                styles={customStyles}
                                                className="bg-white dark:bg-form-input"
                                                classNamePrefix="react-select"
                                                placeholder="Select"
                                            />

                                        </div>


                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Product Group
                                                <span className="text-red-700 text-xl mt-[40px] justify-center items-center"> *</span>
                                            </label>
                                            <div className="z-20 bg-transparent dark:bg-form-Field">
                                                <ReactSelect
                                                    name="productGroup"

                                                    // value={productgrp.find(option => option.value === values.customerName)}
                                                    onChange={(option) => setFieldValue('productGroup', option ? option.value : null)}


                                                    options={[{ label: 'Select', value: null }, ...formattedProductGroup]}
                                                    styles={customStyles} // Pass custom styles here
                                                    className="bg-white dark:bg-form-Field"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select supplier Name"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">

                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Order No</label>
                                            <ReactSelect
                                                name="orderNo"
                                                // value={orderNameOptions.find(option => option.value === values.orderNo)}
                                                onChange={(option) => {
                                                    setFieldValue('orderNo', option.value);

                                                }}
                                                // onBlur={handleBlur}
                                                // options={formattedorder}

                                                options={[{ label: 'Select', value: null }, ...formattedOrderNo]}

                                                styles={customStyles}
                                                className="bg-white dark:bg-form-input"
                                                classNamePrefix="react-select"
                                                placeholder="Select"
                                            />

                                        </div>


                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Supplier
                                                <span className="text-red-700 text-xl mt-[40px] justify-center items-center"> *</span>
                                            </label>
                                            <div className="z-20 bg-transparent dark:bg-form-Field">
                                                <ReactSelect
                                                    name="supplierName"

                                                    // value={productgrp.find(option => option.value === values.customerName)}
                                                    onChange={(option) => setFieldValue('supplierName', option ? option.value : null)}
                                                    // options={formattedSupplier}

                                                    options={[{ label: 'Select', value: null }, ...formattedSupplier]}
                                                    styles={customStyles} // Pass custom styles here
                                                    className="bg-white dark:bg-form-Field"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select supplier Name"
                                                />
                                            </div>
                                        </div>
                                    </div>




                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Product Id</label>
                                            <ReactSelect
                                                name="ProductId"
                                                // value={formattedProdId.find(option => option.value === values.ProductId)}
                                                onChange={(option) => {
                                                    setFieldValue('ProductId', option.value);

                                                }}
                                                // onBlur={handleBlur}
                                                // // options={formattedCustomer}
                                                options={[{ label: 'Select', value: null }, ...formattedProdId]}
                                                styles={customStyles}
                                                className="bg-white dark:bg-form-input"
                                                classNamePrefix="react-select"
                                                placeholder="Select"
                                            />

                                        </div>
                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Customer</label>
                                            <ReactSelect
                                                name="customerName"
                                                // value={productgrp.find(option => option.value === values.customerName)}
                                                onChange={(option) => {
                                                    setFieldValue('customerName', option.value);

                                                }}
                                                // onBlur={handleBlur}
                                                // // options={formattedCustomer}
                                                options={[{ label: 'Select', value: null }, ...formattedCustomer]}
                                                styles={customStyles}
                                                className="bg-white dark:bg-form-input"
                                                classNamePrefix="react-select"
                                                placeholder="Select"
                                            />

                                        </div>

                                    </div>

                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                From Date
                                            </label>
                                            <Field
                                                name='fromDate'
                                                type="date"
                                                placeholder="Enter From Date"
                                                className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                            />
                                        </div>


                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                To Date
                                            </label>
                                            <Field
                                                name='toDate'
                                                type="date"
                                                placeholder="Enter To Date"
                                                className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <div>

                                            <button
                                                type="submit"
                                                className="flex md:w-[150px] w-[220px] md:h-[37px] mr-4 h-[40px] pt-2 rounded-lg justify-center  bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                        <div>

                                            <button
                                                type="button"
                                                onClick={() => handlegenerateReport(values)}
                                                className="flex md:w-[150px] mr-4 w-[220px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center  bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
                                            >
                                                Generate Report
                                            </button>
                                        </div>
                                        <div>

                                            <button
                                                type="button"
                                                onClick={() => handlegenerateCsv(values)}
                                                className="flex md:w-[180px] w-[220px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center  bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
                                            >
                                                Generate Report (csv)
                                            </button>
                                        </div>


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
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" >SNO</th>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Order No</th>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product Id</th>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ordered Quantity</th>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Recieved Quantity</th>
                                        
                                        
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Supplier</th>
                                        {/* <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[600px] md:w-[120px]">ADD BOM </th> */}

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

export default Reports
