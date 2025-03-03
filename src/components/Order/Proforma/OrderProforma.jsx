import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../Breadcrumbs/Breadcrumb';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ReactSelect from 'react-select';
import flatpickr from 'flatpickr';
import ReactDatePicker from "react-datepicker";
import 'flatpickr/dist/themes/material_blue.css'; // Import a Flatpickr theme

import useorder from '../../../hooks/useOrder';

import { GET_PRODUCTBYID_URL, GET_ORDERBYID_URL, UPDATE_ORDER_URL, UPDATE_ORDERCREATED_ALL } from '../../../Constants/utils';


import { FiTrash2 } from 'react-icons/fi';
import { useNavigate, useNavigation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md';
const OrderProforma = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const [orderType, setOrderType] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderTypeOptions, setorderTypeOptions] = useState([])
    const [prodIdOptions, setprodIdOptions] = useState([])
    const [prodIdd, setprodIdd] = useState("")
    const [order, setOrder] = useState(null); // To store fetched product data
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    const [suppId, setsuppId] = useState()
    const [isLoading, setIsLoading] = useState(true); // Loader state
    const [customerOptions, setcustomerOptions] = useState([])
    const { token } = currentUser;



    const [selectedRowId, setSelectedRowId] = useState(null);
    const currency = [
        { value: 'INR', label: 'INR' },
        { value: 'USD', label: 'USD' },
        { value: 'GBP', label: 'GBP' },
        { value: 'EUR', label: 'EUR' },
        { value: 'RMB', label: 'RMB' },
        { value: 'KWD', label: 'KWD' },
        { value: 'AED', label: 'AED' },
    ];
    const {
        getorderType,
        orderTypee,
        productId,
        customer,
        getprodId,
        getCustomer,
    } = useorder();


    const [selectedSuppliers, setSelectedSuppliers] = useState([]);


    // const handleCheckboxChange = (supplierId) => {
    //   console.log(supplierId, "sssspppp");
    //   setSelectedSuppliers((prev) =>
    //     prev.includes(supplierId)
    //       ? prev.filter((id) => id !== supplierId) // Remove if already selected
    //       : [...prev, supplierId] // Add if not selected
    //   );
    // };
    const handleCheckboxChange = (selectedRowId, supplierId) => {
        setSelectedSuppliers((prev) => {
            const updated = [...prev];
            const rowIndex = updated.findIndex(
                (row) => row.selectedRowId === selectedRowId
            );

            if (rowIndex !== -1) {
                // Update supplierIds for the existing row
                const supplierExists = updated[rowIndex].supplierIds.some(
                    (s) => s.supplierId === supplierId
                );

                if (supplierExists) {
                    // Remove the supplier if already exists
                    updated[rowIndex].supplierIds = updated[rowIndex].supplierIds.filter(
                        (s) => s.supplierId !== supplierId
                    );
                } else {
                    // Add new supplier to the row
                    updated[rowIndex].supplierIds.push({
                        supplierId,
                        supplierName: "", // Optional: default supplier name if needed
                    });
                }
            } else {
                // Add a new row with the selected supplier
                updated.push({
                    selectedRowId,
                    supplierIds: [{ supplierId, supplierName: "" }],
                });
            }
            console.log(updated, "updatedddddddddddddddddddddd");
            return updated;
        });
    };


    console.log(selectedSuppliers, "selecteddddddddd Suppliersss");

    const openSupplierModal = (id, rowIndex) => {
        console.log("opening supplier  modal  after update", id, rowIndex);
        setIsSupplierModalOpen(true);
        setSelectedRowId(rowIndex);
        console.log(id, "ghson");
        setsuppId(id)
    };


    console.log(isSupplierModalOpen, "ll");

    console.log(isModalOpen, "jj");


    // Close modal
    const closeSupplierModal = () => {
        setIsSupplierModalOpen(false);
    };


    const handleSupplierModalSubmit = () => {
        console.log("Selected Suppliers:", selectedSuppliers);
        closeSupplierModal();
    };








    useEffect(() => {
        getorderType();
        getprodId();
        getCustomer();






    }, [])

    console.log(productId, "looool");
    const { id } = useParams();




    const handleSubmit = async (values) => {
        // Map selected row IDs to the desired format
        const selectedProducts = values.selectedRows.map((productId) => ({
            id: productId,
        }));

        // Prepare the final data
        const finalData = {
            orderProducts: selectedProducts, // Include the selected rows
        };

        // Log the data to check the format
        console.log(finalData, "finalData");




        try {
            const url = `${UPDATE_ORDERCREATED_ALL}/${id}`;
            const method = "PUT";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(finalData)
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(`Order Status Updated  successfully`);



                // getCurrency(pagination.currentPage); // Fetch updated Currency
            } else {
                toast.error(`${data.errorMessage}`);
            }
        } catch (error) {
            console.error(error, response);
            toast.error("An error occurred");
        }

        // You can now send `finalData` to the backend or do any other operation with it
    };









    const getOrderById = async () => {
        try {
            const response = await fetch(`${GET_ORDERBYID_URL}/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch product');
            }

            const data = await response.json();
            console.log(data, "datatata")
            setOrder(data); // Store fetched product
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setIsLoading(false); // Stop loader
        }
    };
    console.log(order, 'hloooooo')

    // Fetch data when component mounts
    useEffect(() => {
        getOrderById();
    }, [id]);

    const [prodIdModal, setprodIdModal] = useState([])

    useEffect(() => {
        if (orderTypee) {
            const formattedOptions = orderTypee.map(order => ({
                value: order.id,
                label: order?.orderTypeName,
                orderTypeObject: order,
                orderTypeId: { id: order.id }
            }));
            setorderTypeOptions(formattedOptions);
        }

        if (productId) {
            const formattedProdIdOptions = productId.map(prodId => ({
                value: prodId.id,
                label: prodId?.productId,
                prodIdObject: prodId,
                prodId: prodId.id
            }));
            setprodIdOptions(formattedProdIdOptions);
        }

        if (customer) {
            const formattedCustomerOptions = customer.map(customer => ({
                value: customer.id,
                label: customer?.customerName,
                customerObject: customer,
                customer: customer.id
            }));
            setcustomerOptions(formattedCustomerOptions);
        }
    }, [orderTypee]);








    const customStyles = {
        control: (provided) => ({
            ...provided,
            minHeight: '50px',
            fontSize: '16px',
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: '10px 14px',
        }),
        input: (provided) => ({
            ...provided,
            fontSize: '16px',
        }),
        singleValue: (provided) => ({
            ...provided,
            fontSize: '16px',
        }),
    };








    const handleModalSubmit = (values) => {
        console.log(values, "gfdsa");



        setprodIdModal((prevValues) => [...prevValues, values])
        setIsModalOpen(false)

    }

    console.log(order, 'jugnu');






    return (
        <DefaultLayout>
            <Breadcrumb pageName="Order/Update Order" />
            <div>
                <Formik
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                    initialValues={{
                        date: "",
                        selectedRows: [],
                        orderNo: order?.orderNo || '',
                        currency: "",


                        orderProducts: order?.orderProducts?.map((product) => ({

                            size: product?.products?.sizes?.sizeName,
                            design: product?.products?.design?.designName,
                            unit: product?.products?.unit?.name,
                            orderQty: product?.clientOrderQuantity,// clientorderquantity
                            totalValue: "" || 0,
                            taxibleValue: "" || 0,
                            discountedPrice: "",
                            // Initialize as 0, will be updated later
                            wholesalePrice: 0, // Default to 0 or the correct price for INR

                            product: {

                                id: product.products?.productId || '',  // Set initial value for productId
                            },

                        })) || [],
                        totalUnits: "",
                        totalUnitsValue: "",




                        // customer: '',
                    }}

                // validationSchema={validationSchema}
                >
                    {({ values, setFieldValue }) => {
                        useEffect(() => {
                            // Calculate the sum of orderQty when the orderProducts data is loaded or updated
                            if (order?.orderProducts) {
                                const totalUnits = order.orderProducts.reduce(
                                    (sum, product) => sum + (parseInt(product.clientOrderQuantity) || 0),
                                    0
                                );

                                // Set the totalUnits value in the form state
                                setFieldValue("totalUnits", totalUnits);
                            }
                        }, [order?.orderProducts, setFieldValue]);
                        useEffect(() => {
                            // Ensure currency is selected
                            if (values.currency) {
                                const selectedCurrency = values.currency;
                                console.log(selectedCurrency, "selected currency");
                        
                                // Loop through the orderProducts and update wholesalePrice
                                order?.orderProducts?.forEach((product, index) => {
                                    if (selectedCurrency === 'INR') {
                                        // Set INR wholesale price
                                        setFieldValue(`orderProducts[${index}].wholesalePrice`, product?.products?.wholesalePrice || 0);
                                    } else if (selectedCurrency === 'USD') {
                                        // Set USD price
                                        setFieldValue(`orderProducts[${index}].wholesalePrice`, product?.products?.usdPrice || 0);
                                    }else if (selectedCurrency === 'EURO') {
                                        // Set USD price
                                        setFieldValue(`orderProducts[${index}].wholesalePrice`, product?.products?.euroPrice || 0);
                                    }else if (selectedCurrency === 'GBP') {
                                        // Set USD price
                                        setFieldValue(`orderProducts[${index}].wholesalePrice`, product?.products?.gbpPrice || 0);
                                    }else if (selectedCurrency === 'RMB') {
                                        // Set USD price
                                        setFieldValue(`orderProducts[${index}].wholesalePrice`, product?.products?.rmbPrice || 0);
                                    }
                                    
                                });
                            }
                        }, [values.currency, order?.orderProducts, setFieldValue]);
                        



                        return (
                            <Form>
                                <div className="flex flex-col gap-9">
                                    {/* Form fields */}
                                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                            <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                                Create Order Proforma Information
                                            </h3>
                                        </div>
                                        <div className="p-6.5">
                                            <div className="flex flex-wrap gap-4">




                                                <div className="flex-2 min-w-[200px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Date
                                                    </label>
                                                    <Field name="date">
                                                        {({ field, form }) => (
                                                            <ReactDatePicker
                                                                {...field}
                                                                selected={(field.value && new Date(field.value)) || null}
                                                                onChange={(date) =>
                                                                    form.setFieldValue(
                                                                        "fate",
                                                                        date ? format(date, "yyyy-MM-dd") : "" // Format without timezone shift
                                                                    )
                                                                }
                                                                dateFormat="yyyy-MM-dd" // Display format
                                                                placeholderText=" Date"
                                                                className="form-datepicker w-[270px] rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        )}
                                                    </Field>
                                                </div>
                                                <ErrorMessage name="orderDate" component="div" className="text-red-600 text-sm" />




                                                <div className="flex-2 min-w-[200px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Order No</label>
                                                    <ReactSelect
                                                        name="orderNo"

                                                        value={order?.orderNo ? { label: order.orderNo, value: order.orderNo } : null} // Display orderNo
                                                        styles={customStyles}
                                                        className="bg-white dark:bg-form-Field w-[270px]"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Order Type"


                                                        isDisabled={true}
                                                    />
                                                    <ErrorMessage name="orderType" component="div" className="text-red-600 text-sm" />
                                                </div>

                                                <div className="flex-2 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Bill To
                                                    </label>
                                                    <Field
                                                        name="warpColors"
                                                        type="text"
                                                        placeholder="Enter Warp Colors"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>


                                            </div>
                                            <div className="mb-4.5 flex flex-wrap gap-6 mt-3">

                                                <div className="flex-2 min-w-[270px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">


                                                        Bill To Email
                                                    </label>
                                                    <Field
                                                        name="weftColors"
                                                        type="text"
                                                        placeholder="Enter Weft Colors"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>



                                                <div className="flex-2 min-w-[270px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Ship To
                                                    </label>
                                                    <Field
                                                        name="warpColors"
                                                        type="text"
                                                        placeholder="Enter Warp Colors"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-[270px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Ship To Email
                                                    </label>
                                                    <Field
                                                        name="weftColors"
                                                        type="text"
                                                        placeholder="Enter Weft Colors"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>

                                                <div className="mb-2 flex flex-wrap gap-6 mt-3">
                                                    <div className="flex-1 min-w-[270px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                            PO/Date
                                                        </label>
                                                        <Field
                                                            name="warpColors"
                                                            type="text"
                                                            placeholder="Enter Warp Colors"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[270px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                            Payment Terms
                                                        </label>
                                                        <Field
                                                            name="weftColors"
                                                            type="text"
                                                            placeholder="Enter Weft Colors"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>

                                                    <div className="flex-1 min-w-[270px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                            Ship Date
                                                        </label>
                                                        <Field
                                                            name="weftColors"
                                                            type="text"
                                                            placeholder="Enter Weft Colors"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>



                                                <div className="mb-2 flex flex-wrap gap-6 ">
                                                    <div className="flex-1 min-w-[270px] ">
                                                        <label className="mb-2.5 block text-black dark:text-white">Currency</label>
                                                        <ReactSelect
                                                            name="currency"
                                                            value={currency.find(option => option.value === values.salesChannel)}
                                                            onChange={(option) => setFieldValue('currency', option.value)}

                                                            options={currency}
                                                            styles={customStyles}
                                                            className="bg-white dark:bg-form-input"
                                                            classNamePrefix="react-select"
                                                            placeholder="Select"
                                                        />
                                                        <ErrorMessage name="tags" component="div" className="text-red-600 text-sm" />
                                                    </div>
                                                    <div className="flex-1 min-w-[270px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                            Rate
                                                        </label>
                                                        <Field
                                                            name="weftColors"
                                                            type="Number"
                                                            placeholder="Enter Rate"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>

                                                    <div className="flex-1 min-w-[270px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                            Freight Terms
                                                        </label>
                                                        <Field
                                                            name="Freight Terms"
                                                            type="text"
                                                            placeholder="Enter Freight Terms"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>


                                                <div className="mb-4.5 flex flex-wrap gap-6 mt-3">
                                                    <div className="flex-1 min-w-[270px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                            Ship Via
                                                        </label>
                                                        <Field
                                                            name="warpColors"
                                                            type="text"
                                                            placeholder="Enter Warp Colors"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Field
                                                            type="radio"
                                                            name="shipVia"
                                                            value="Service"
                                                            className="mr-2"
                                                        />
                                                        <label className="text-black dark:text-white">Service</label>
                                                    </div>

                                                    {/* Economy checkbox */}
                                                    <div className="flex items-center">
                                                        <Field
                                                            type="radio"
                                                            name="shipVia"
                                                            value="Economy"
                                                            className="mr-2"
                                                        />
                                                        <label className="text-black dark:text-white">Economy</label>
                                                    </div>

                                                    {/* Priority checkbox */}
                                                    <div className="flex items-center">
                                                        <Field
                                                            type="radio"
                                                            name="shipVia"
                                                            value="Priority"
                                                            className="mr-2"
                                                        />
                                                        <label className="text-black dark:text-white">Priority</label>
                                                    </div>

                                                </div>









                                            </div>



















                                            <div className="shadow-md rounded-lg mt-3 overflow-scroll">
                                                <table className="min-w-full leading-normal overflow-auto">
                                                    <thead>
                                                        <tr className="bg-slate-300 dark:bg-slate-700 dark:text-white">
                                                            <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                Reference Image
                                                            </th>
                                                            <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                Design/Product Information
                                                            </th>
                                                            <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                Size
                                                            </th>
                                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                Units
                                                            </th>
                                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                Qty
                                                            </th>
                                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                WholeSale Price
                                                            </th>

                                                            <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                GST Tax %
                                                            </th>
                                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                Discount
                                                            </th>
                                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                Taxable value
                                                            </th>
                                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                Total Value
                                                            </th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {order?.orderProducts?.map((product, index) => (
                                                            <tr key={product.id}>
                                                                {/* Radio Button */}


                                                                {/* Product ID */}
                                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                    <ReactSelect
                                                                        name="orderNo"
                                                                        value={order?.orderNo ? { label: order.orderNo, value: order.orderNo } : null}
                                                                        styles={customStyles}
                                                                        className="bg-white dark:bg-form-Field w-[180px]"
                                                                        classNamePrefix="react-select"
                                                                        placeholder="Select Order Type"
                                                                        isDisabled={true}
                                                                    />
                                                                    <ErrorMessage
                                                                        name={`orderProducts[${index}].products.id`}
                                                                        component="div"
                                                                        className="text-red-600 text-sm"
                                                                    />
                                                                </td>



                                                                {/* design */}
                                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                    <Field
                                                                        name={`orderProducts[${index}].design`}
                                                                        value={values.orderProducts[index]?.design || ""}
                                                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                        readOnly
                                                                    />
                                                                    <ErrorMessage
                                                                        name={`orderProducts[${index}].design`}
                                                                        component="div"
                                                                        className="text-red-600 text-sm"
                                                                    />
                                                                </td>
                                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                    <Field
                                                                        name={`orderProducts[${index}].size`}
                                                                        onChange={(e) => {
                                                                            const newValue = e.target.value;
                                                                            console.log(`New Product ID: ${newValue}`);
                                                                            setFieldValue(
                                                                                `orderProducts[${index}].size`,
                                                                                newValue
                                                                            );
                                                                        }}
                                                                        className="w-[150px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                        placeholder="Enter Product ID"
                                                                    />
                                                                    <ErrorMessage
                                                                        name={`orderProducts[${index}].size`}
                                                                        component="div"
                                                                        className="text-red-600 text-sm"
                                                                    />
                                                                </td>
                                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                    <Field
                                                                        name={`orderProducts[${index}].unit`}
                                                                        // value={values.orderProducts[index]?.unit || ""}
                                                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                    />
                                                                    <ErrorMessage
                                                                        name={`orderProducts[${index}].value`}
                                                                        component="div"
                                                                        className="text-red-600 text-sm"
                                                                    />
                                                                </td>

                                                                {/* Client Order Quantity */}
                                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                    <Field
                                                                        name={`orderProducts[${index}].orderQty`}
                                                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                    />
                                                                    <ErrorMessage
                                                                        name={`orderProducts[${index}].orderQty`}
                                                                        component="div"
                                                                        className="text-red-600 text-sm"
                                                                    />
                                                                </td>



                                                                {/* wholesalePrice */}


                                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                    <Field
                                                                        name={`orderProducts[${index}].wholesalePrice`}
                                                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                        readOnly // If you want the field to be read-only based on your use case
                                                                    />
                                                                    <ErrorMessage
                                                                        name={`orderProducts[${index}].wholesalePrice`}
                                                                        component="div"
                                                                        className="text-red-600 text-sm"
                                                                    />
                                                                </td>







                                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                    <Field
                                                                        name={`orderProducts[${index}].clientOrderQuantity`}
                                                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                    />
                                                                    <ErrorMessage
                                                                        name={`orderProducts[${index}].clientOrderQuantity`}
                                                                        component="div"
                                                                        className="text-red-600 text-sm"
                                                                    />
                                                                </td>
                                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                    <Field
                                                                        name={`orderProducts[${index}].clientOrderQuantity`}
                                                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                    />
                                                                    <ErrorMessage
                                                                        name={`orderProducts[${index}].clientOrderQuantity`}
                                                                        component="div"
                                                                        className="text-red-600 text-sm"
                                                                    />
                                                                </td>

                                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                    <Field
                                                                        name={`orderProducts[${index}].clientOrderQuantity`}
                                                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                    />
                                                                    <ErrorMessage
                                                                        name={`orderProducts[${index}].clientOrderQuantity`}
                                                                        component="div"
                                                                        className="text-red-600 text-sm"
                                                                    />
                                                                </td>
                                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                    <Field
                                                                        name={`orderProducts[${index}].clientOrderQuantity`}
                                                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                    />
                                                                    <ErrorMessage
                                                                        name={`orderProducts[${index}].clientOrderQuantity`}
                                                                        component="div"
                                                                        className="text-red-600 text-sm"
                                                                    />
                                                                </td>






                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>


                                            <div className='flex justify-between mt-4'>
                                                <h2 className='font-semibold text-2xl'>Total</h2>

                                                <div className='flex gap-6'> {/* Added flex to align them horizontally */}
                                                    <div className="flex-2 min-w-[270px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                            Total Units
                                                        </label>
                                                        <Field
                                                            name="totalUnits"

                                                            type="text"
                                                            placeholder="Enter Warp Colors"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[270px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                            Total Value
                                                        </label>
                                                        <Field
                                                            name="totalUnits"
                                                            type="text"
                                                            placeholder="Enter Weft Colors"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>
                                            </div>



















                                            <div className="flex justify-center mt-4"> {/* Centering the button */}
                                                <button
                                                    type="submit"


                                                    className="w-1/3 px-6 py-2 text-white bg-primary rounded-lg shadow hover:bg-primary-dark focus:outline-none" // Increased width
                                                >
                                                    Accept All
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </Form>
                        )
                    }}
                </Formik>





            </div>
        </DefaultLayout>
    );
};

export default OrderProforma;
