import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
//  import Flatpickr from 'react-flatpickr';
import { DELETE_ORDER_URL, VIEW_ALL_ORDERS, VIEW_APPROVED_ORDERS, VIEW_CREATED_ORDERS, VIEW_PARTIALLYAPPROVED_ORDERS, VIEW_PROFORMA } from "../../Constants/utils";
import ReactSelect from 'react-select';
import useorder from '../../hooks/useOrder';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import { MdCreateNewFolder } from 'react-icons/md';




const productgrp = [
    { value: 'BrandA', label: 'Brand A' },
    { value: 'BrandB', label: 'Brand B' },
    { value: 'BrandC', label: 'Brand C' },
];


const ViewOrderApproved = () => {

    const { handleUpdate, getorderNumber, orderNo, getSupplier, getProdId, productIdd, supplier, getCustomer, customer } = useorder();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const theme = useSelector(state => state?.persisted?.theme);

    const customStyles = createCustomStyles(theme?.mode);


    const { token } = currentUser;

    console.log(productIdd,"huhuuhuuuuuuuuuuuuuuuuu");
    
    const [Order, setOrder] = useState()

    const [supplierNameOptions, setsupplierNameOptions] = useState([])
    const [orderNameOptions, setorderNameOptions] = useState([])
    // const supplier = useSelector(state => state?.nonPersisted?.supplier);
    const order = useSelector(state => state?.nonPersisted?.order);
    const navigate = useNavigate();
    useEffect(() => {
        getorderNumber();
        getSupplier();
        getCustomer();
        getProdId();

    }, []);


    console.log(supplier, customer, productIdd, "orderNo");

    const formattedorder = orderNo.map(order => ({
        label: order,
        value: order
    }));

    const formattedSupplier = supplier.map(supplier => ({
        label: supplier.name,
        value: supplier.name
    }));

    const formattedProdId = productIdd.map(prod => ({
        label: prod,
        value: prod
    }));



    
    const formattedCustomer = customer.map(customer => ({
        label: customer.customerName,
        value: customer.customerName
    }));





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




    const getOrder = async (page, filters = {}) => {
        console.log(filters, "filterssssssssssssssssssssssssssssssssssssssss");
        console.log("Fetching orders for page", page); // Log the page number being requested

        try {
            const response = await fetch(`${VIEW_PROFORMA}?page=${page || 1}`, {
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
                    setOrder(data.content); // Update orders state
                } else {
                    console.log("No orders found in the response");
                    setOrder([]); // Set an empty state
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
        getOrder()
    }, [])

    const handlePageChange = (newPage) => {
        console.log("Page change requested:", newPage);

        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        getOrder(newPage); // Correct function name and 1-indexed for user interaction
    };

    console.log(Order, "heyorder");


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
        console.log(Order);
        if (!Order || !Order.length) {
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







        return Order.map((item, index) => (

            <tr key={index} className='bg-white dark:bg-slate-700 dark:text-white'>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{startingSerialNumber + index}</p>
                </td>

                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item?.pid}</p>

                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item.orderTypeName}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item.orderNo}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item.customerName}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    {item.products &&
                        item.products.map((prodId, index) => (
                            <p key={index} className="text-gray-900 whitespace-nowrap">
                                {prodId?.productId}
                            </p>
                        ))}
                </td>

                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    {item.products &&
                        item.products.map((prodId, index) => (
                            <p key={index} className="text-gray-900 whitespace-nowrap">
                                {prodId.productStatus}
                            </p>
                        ))}
                </td>









                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="flex text-gray-900 whitespace-no-wrap">


                    <MdCreateNewFolder
    size={17}
    className="text-teal-500 hover:text-teal-700 mx-2"
    onClick={() => {
        if (item.orderTypeName === "WSClients") {
            navigate(`/Order/updateOrderProforma/${item?.id}`); // Navigate to WSClients page
        } else if (item.orderTypeName === "RetailClients") {
            navigate(`/Order/updateRetailProforma/${item?.id}`); // Navigate to RetailClients page
        }
    }}
    title="Edit Order"
/>

                        {/* <FiEdit size={17} className='text-teal-500 hover:text-teal-700 mx-2' onClick={() => navigate(`/Order/updateOrderProforma/${item?.id}`)} title='Edit Order' />   */}
                             {/* {
                                                        item.orderTypeName === "WSClients" ? (
                                                            <MdCreateNewFolder
                                                                size={17}
                                                                className="text-teal-500 hover:text-teal-700 mx-2"
                                                                onClick={() => navigate(`/Order/updateOrderProforma${item?.id}`)}
                                                                title="Create proforma"
                                                            />
                                                        ) : item.orderTypeName === "RetailClients" ? (
                                                            <MdCreateNewFolder
                                                                size={17}
                                                                className="text-teal-500 hover:text-teal-700 mx-2"
                                                                onClick={() => navigate(`/Order/generateRetailProforma/${item?.id}`)} // Navigate to a different page for RetailClients
                                                                title="Create proforma"
                                                            />
                                                        ) : null
                                                    } */}
                        {/* <FiTrash2 size={17} className='text-red-500 hover:text-red-700 mx-2' onClick={(e) => handleDelete(e, item?.id)} title='Delete Product' /> */}
                    </p>
                </td>
            </tr>
        ));
    };


    const handleSubmit = (values) => {

        console.log(values, "valiiiiii");
        const filters = {




            orderNo: values.orderNo || undefined,
            supplierName: values.supplierName || undefined,

            customerName: values.customerName || undefined,
            productId: values.productId || undefined
        };
        getOrder(pagination.currentPage, filters);
        // ViewInventory(pagination.currentPage, filters);
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Order/ View Order" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className='flex justify-between'>
                        <h2 className="text-xl font-semibold leading-tight">Search ProForma</h2>
                        {/* <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success dark:bg-white dark:text-slate-800`}>
                            TOTAL PRODUCTS: {pagination.totalItems}
                        </p> */}
                    </div>


                    <div className='items-center justify-center'>
                        <Formik
                            initialValues={{
                         
                                customerName: "",
                           
                       



                            }}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, values, handleBlur }) => (
                                <Form>
                                




                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                                     
                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Customer</label>
                                            <ReactSelect
                                                name="customerName"
                                                value={productgrp.find(option => option.value === values.customerName)}
                                                onChange={(option) => {
                                                    setFieldValue('customerName', option.value);

                                                }}
                                                onBlur={handleBlur}
                                                // options={formattedCustomer}
                                                options={[{ label: 'View All Customers', value: null }, ...formattedCustomer]}
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
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" >SNO</th>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">PID</th>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Order Type</th>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"> Order No</th>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                                        {/* <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[600px] md:w-[120px]">ADD BOM </th> */}
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product Id</th>
                                        
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
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

export default ViewOrderApproved
