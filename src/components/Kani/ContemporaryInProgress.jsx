import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
import { DELETE_ORDER_URL, GET_INPROGRESS_CONTEMPORARY_ORDERS_URL } from "../../Constants/utils";
import ReactSelect from 'react-select';
import useorder from '../../hooks/useOrder';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../Constants/utils';

const productgrp = [
    { value: 'BrandA', label: 'Brand A' },
    { value: 'BrandB', label: 'Brand B' },
    { value: 'BrandC', label: 'Brand C' },
];

const ContemporaryInProgress = () => {
    const { handleUpdate, getorderNumber, orderNo, getSupplier, getProdId, productIdd, supplier, getCustomer, customer } = useorder();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const theme = useSelector(state => state?.persisted?.theme);
    const customStyles = createCustomStyles(theme?.mode);
    const { token } = currentUser;

    const [Order, setOrder] = useState([]);
    const [supplierNameOptions, setsupplierNameOptions] = useState([]);
    const [orderNameOptions, setorderNameOptions] = useState([]);
    const navigate = useNavigate();

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 20,
    });

    useEffect(() => {
        getorderNumber();
        getSupplier();
        getCustomer();
        getProdId();
    }, []);

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

   const getOrder = async (page, filters = {}) => {
    console.log("Fetching Contemporary in-progress orders with filters:", filters);
    
    try {
        // Spring Boot uses 0-indexed pages, so subtract 1
        const pageNumber = page ? page - 1 : 0;
        
        // Build query parameters from filters
        const queryParams = new URLSearchParams({
            page: pageNumber, // Use 0-indexed page number
            ...(filters.orderNo && { orderNo: filters.orderNo }),
            ...(filters.supplierName && { supplierName: filters.supplierName }),
            ...(filters.customerName && { customerName: filters.customerName }),
            ...(filters.productId && { productId: filters.productId })
        }).toString();

        const url = `${GET_INPROGRESS_CONTEMPORARY_ORDERS_URL}?${queryParams}`;
        console.log("Fetching from URL:", url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Parsed Contemporary orders data:", data);

        if (data?.content && data.content.length > 0) {
            setOrder(data.content);
        } else {
            console.log("No Contemporary orders found on this page");
            setOrder([]);
        }

        setPagination({
            totalItems: data?.totalElements || 0,
            data: data?.content || [],
            totalPages: data?.totalPages || 0,
            currentPage: (data?.number || 0) + 1, // Convert back to 1-indexed for display
            itemsPerPage: data?.size || 20,
        });

    } catch (error) {
        console.error("Error fetching Contemporary orders:", error);
        toast.error("Failed to fetch Contemporary orders. Please try again.");
        setOrder([]);
    }
};

    useEffect(() => {
        getOrder();
    }, []);

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        getOrder(newPage);
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            const response = await fetch(`${DELETE_ORDER_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(`Order Deleted Successfully !!`);
                const isCurrentPageEmpty = Order.length === 1;

                if (isCurrentPageEmpty && pagination.currentPage > 1) {
                    const previousPage = pagination.currentPage - 1;
                    handlePageChange(previousPage);
                } else {
                    getOrder(pagination.currentPage);
                }
            } else {
                toast.error(`${data.errorMessage}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    };

    const renderTableRows = () => {
        if (!Order || !Order.length) {
            return (
                <tr className='bg-white dark:bg-slate-700 dark:text-white'>
                    <td colSpan="6" className="px-5 py-5 border-b border-gray-200 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap text-center">No Contemporary Orders Found</p>
                    </td>
                </tr>
            );
        }

        const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

        return Order.map((item, index) => (
            <tr key={item.id} className='bg-white dark:bg-slate-700 dark:text-white'>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{startingSerialNumber + index}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item?.orderNo}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item.customer?.customerName || 'N/A'}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    {item.orderProducts && item.orderProducts.length > 0 ? (
                        item.orderProducts.map((orderProduct, prodIndex) => (
                            <p key={prodIndex} className="text-gray-900 whitespace-nowrap">
                                {orderProduct.products?.productId || 'N/A'}
                            </p>
                        ))
                    ) : (
                        <p className="text-gray-900 whitespace-nowrap">N/A</p>
                    )}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    {item.orderProducts && item.orderProducts.length > 0 ? (
                        item.orderProducts.map((orderProduct, prodIndex) => (
                            <p key={prodIndex} className="text-gray-900 whitespace-nowrap">
                                {orderProduct.productStatus || item.status || 'N/A'}
                            </p>
                        ))
                    ) : (
                        <p className="text-gray-900 whitespace-nowrap">N/A</p>
                    )}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="flex text-gray-900 whitespace-no-wrap">
                        <FiEdit 
                            size={17} 
                            className='text-teal-500 hover:text-teal-700 mx-2' 
                            onClick={() => navigate(`/Order/updatepartiallyApproved/${item?.id}`)} 
                            title='Edit Order' 
                        />  |
                        <FiTrash2 
                            size={17} 
                            className='text-red-500 hover:text-red-700 mx-2' 
                            onClick={(e) => handleDelete(e, item?.id)} 
                            title='Delete Product' 
                        />
                    </p>
                </td>
            </tr>
        ));
    };

    const handleSubmit = (values) => {
        const filters = {
            orderNo: values.orderNo || undefined,
            supplierName: values.supplierName || undefined,
            customerName: values.customerName || undefined,
            productId: values.productId || undefined
        };
        getOrder(pagination.currentPage, filters);
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Contemporary In Progress Orders" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className='flex justify-between'>
                        <h2 className="text-xl font-semibold leading-tight">CONTEMPORARY IN PROGRESS ORDERS</h2>
                    </div>

                    <div className='items-center justify-center'>
                        <Formik
                            initialValues={{
                                orderNo: '',
                                customerName: "",
                                supplierName: "",
                                ProductId: ""
                            }}
                            onSubmit={handleSubmit}
                        >
                            {/* Add your form fields here if needed */} 
                        </Formik>
                    </div>

                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr className='bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SNO</th>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Order No</th>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product Id</th>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
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
                            handlePageChange={handlePageChange} 
                        />
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default ContemporaryInProgress