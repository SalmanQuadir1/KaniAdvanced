import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../Breadcrumbs/Breadcrumb';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ReactSelect from 'react-select';
import flatpickr from 'flatpickr';
import ReactDatePicker from "react-datepicker";
import 'flatpickr/dist/themes/material_blue.css'; // Import a Flatpickr theme

import useorder from '../../../hooks/useOrder';

import { GET_PRODUCTBYID_URL, GET_ORDERBYID_URL, UPDATE_ORDER_URL, UPDATE_ORDERCREATED_ALL, GET_PID, ADD_ORDERPROFORMA } from '../../../Constants/utils';


import { FiTrash2 } from 'react-icons/fi';
import { useNavigate, useNavigation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md';
const OrderProforma = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const [orderType, setOrderType] = useState('');
    const [Pid, setPid] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderTypeOptions, setorderTypeOptions] = useState([])
    const [prodIdOptions, setprodIdOptions] = useState([])
    const [prodIdd, setprodIdd] = useState("")
    const [Taxx, setTaxx] = useState(0)
    const [Totall, setTotall] = useState(0)
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

    const modeOfShipmentOptions = [
        { value: 'Courier', label: 'Courier' },
        { value: 'Commercial', label: 'Commercial' },

    ];


    const ShippingAccountOptions = [
        { value: 'KLC', label: 'KLC' },
        { value: 'CLIENT', label: 'CLIENT' },
        { value: 'KLC FREE SHIPPING', label: 'KLC FREE SHIPPING' },

    ];
    const labelOptions = [
        { value: 'KLC', label: 'KLC' },
        { value: 'CLIENT', label: 'CLIENT' },
        { value: 'No Label', label: 'No Label' },

    ];
    const tagOptions = [
        { value: 'KLC', label: 'KLC' },
        { value: 'CLIENT', label: 'CLIENT' },
        { value: 'No Tags', label: 'No Tags' },

    ];
    const logoOptions = [
        { value: 'KLC', label: 'KLC' },
        { value: 'CLIENT', label: 'CLIENT' },
        { value: 'No Logo', label: 'No Logo' },

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



















    useEffect(() => {
        getorderType();
        getprodId();
        getCustomer();






    }, [])

    console.log(productId, "looool");
    const { id } = useParams();


    //pid generate
    useEffect(() => {
        const getPid = async (page) => {
            try {
                const response = await fetch(`${GET_PID}/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = await response.json();
                console.log(data, "piddd");
                setPid(data?.orderProforma?.pid);

            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch orderType");
            }
        };
        getPid();

    }, [])










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








  

    console.log(order, 'jugnu');


    const handleSubmit = async (values) => {
        console.log('values==========', values);

        // Assuming the structure of `values.orderProducts` is similar to what you provided
        const proformaProducts = values.orderProducts.map((product) => {
            const gstTax = values?.modeOfShipment === 'Courier' ?  product.gstTax:0;
            console.log(product, "jj");
            return {
                product: {
                    id: product.product.id // Assuming you need the id of the product
                },
                orderQty: parseInt(product.orderQty), // Convert to an integer, if needed
                rate: product.wholesalePrice, // Using wholesalePrice as the rate
                totalPrice: product.totalValue, // Using totalValue as the totalPrice
                totalValue: product.totalValue, // Total value is the same
                taxibleValue: product.taxibleValue, // Assuming this value is correct
                gstTax: gstTax, // GST tax is already provided
                discount: product.discount, // Assuming there's a discount property in the product
                tax: product.gstTax * 0.1, // Assuming tax is calculated as 10% of GST tax (modify based on actual logic)
                discountedPrice: product.totalValue - product.discount // Assuming discounted price is totalValue minus discount
            };
        });

        // Prepare the final data with proformaProduct
        const finalData = {
            order: {
                id: order?.id
              },
            //   "pid": "WSPI-12345-02-24",
            pid: values.pid,
            paymentTerms: values.paymentTerms,
            currency: values.currency,
            freightTerms: values.freightTerms,
            shipVia: values.shipVia,
            date: values.date,
            courierCharges: values.courierCharges,
            advanceReceived: values.advanceReceived,
            clothBags: values.clothBags,
            total: values.total,
            //   carrier: values.carrier,
            service: values.service,
            modeOfShipment: values.modeOfShipment,
            rate: values.rate,
            gst: values.gst,
            totalUnits: values.totalUnits,



            totalUnitsValue: values.totalUnitsValue,
            outstandingBalance: values.outstandingBalance,
            //   discount: values.discount,
            //   totalRateValue: values.totalRateValue,
            shippingAccount: values.shippingAccount,
            labels: values.labels,
            tags: values.tags,
            logo: values.logo,
            proformaProduct: proformaProducts, // Replacing orderProducts with proformaProduct
        };

        // Log the finalData to check the format
        console.log(finalData, "finalData");

        try {
            const url = `${ADD_ORDERPROFORMA}`;
            const method = "POST";

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
                toast.success(`Proforma Added successfully`);
                // getCurrency(pagination.currentPage); // Fetch updated Currency (if needed)
            } else {
                toast.error(`${data.errorMessage}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }

        // You can now send `finalData` to the backend or do any other operation with it
    };




    return (
        <DefaultLayout>
            <Breadcrumb pageName="Order/Update Order" />
            <div>
                <Formik
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                    initialValues={{
                        date: "",
                        billTo: order?.customer?.billTo,
                        billtoEmail: order?.customer?.email,
                        shipTo: order?.customer?.shippingAddress,
                        shipToEmail: order?.customer?.email,

                        poDate: order?.poDate,
                        paymentTerms: "",
                        shipDate: order?.shippingDate,
                        freightTerms: "",
                        shipVia: "",
                        service: "",







                        selectedRows: [],
                        orderNo: order?.orderNo || '',
                        currency: "",
                        rate: "",
                        pid: Pid,


                        orderProducts: order?.orderProducts?.map((product) => ({

                            size: product?.products?.sizes?.sizeName,
                            design: product?.products?.design?.designName,
                            unit: product?.products?.unit?.name,
                            orderQty: product?.clientOrderQuantity,// clientorderquantity
                            totalValue: "" || 0,
                            taxibleValue: "" || 0,
                            gstTax: "",
                            discountedPrice: "",
                            // Initialize as 0, will be updated later
                            wholesalePrice: 0,


                            // Default to 0 or the correct price for INR

                            product: {

                                id: product.products?.id || '',  // Set initial value for productId
                            },

                        })) || [],
                        totalUnits: "",
                        totalUnitsValue: "",
                        modeOfShipment: "",
                        gst: "",
                        shippingAccount: "",
                        courierCharges: 0,
                        advanceReceived: "",
                        total: "",

                        outstandingBalance: 0,
                        labels: "",
                        tags: "",
                        logo: "",
                        clothBags: ""





                        // customer: '',
                    }}


                // validationSchema={validationSchema}
                >
                    {({ values, setFieldValue }) => {

                        useEffect(() => {
                            // Calculate the sum of orderQty when the orderProducts data is loaded or updated
                            if (values.currency === "INR") {

                                setFieldValue("rate", 1);
                            }
                            else {
                                setFieldValue("rate", '');
                            }
                        }, [values.currency, setFieldValue]);

                        const calculateValues = (index, wholesalePrice, orderQty, discount, currentRate) => {
                            // Ensure currentRate is properly fetched or defined
                            currentRate = wholesalePrice || wholesalePrice || 1; // Default to 1 if no rate is defined
                            console.log("current rate:", currentRate);
                            // Calculate 'num' based on current rate
                            // Round if needed

                            // Apply the discount to get the discounted price
                            const discountAmount = wholesalePrice * (discount / 100);
                            const discountedPrice = wholesalePrice - discountAmount; // Apply discount to wholesale price

                            // Set taxable value to discounted price
                            const taxableValue = currentRate - discount;

                            // Calculate total value based on order quantity
                            const totalValue = taxableValue * orderQty;

                            console.log("Wholesale Price:", wholesalePrice);
                            console.log("Discounted Price:", discountedPrice);
                            console.log("Taxable Value:", taxableValue);
                            console.log("Order Quantity:", orderQty);
                            let num = 1 / currentRate;
                            num = Math.round(num * 1000);

                            // Determine the GST tax rate based on taxable value and product unit
                            let gstTax = 0;
                            let Tax = 0;

                            // If taxable value >= num, apply unit-based GST rates
                            if (taxableValue >= num) {
                                // Check if the product unit is 'Mtrs' or others
                                const prodUnit = values.orderProducts[index]?.unit;
                                if (prodUnit === 'Mtrs') {
                                    gstTax = 5
                                    Tax = (totalValue * 5) / 100;  // Apply 5% GST for meters
                                } else {
                                    gstTax = 12
                                    Tax = (totalValue * 12) / 100;   // Apply 12% GST for other units
                                }
                            } else {
                                // Apply 5% GST if taxable value is below 'num'
                                gstTax = 5
                                Tax = (totalValue * 5) / 100;
                            }

                            // Update Formik values for the current product
                            setFieldValue(`orderProducts[${index}].gstTax`, gstTax);
                            setFieldValue(`orderProducts[${index}].taxibleValue`, taxableValue);
                            setFieldValue(`orderProducts[${index}].totalValue`, totalValue);
                            setFieldValue('gst', Tax);
                            setFieldValue('total', Tax + totalValue)
                            console.log(Tax + totalValue, "jujujuju");
                            console.log(values.total, "umer shah");
                            setTaxx(Tax)
                            console.log("Tax:", Tax);
                            console.log("GST Tax (Calculated):", gstTax);
                            console.log("Total Value (Calculated):", totalValue);
                        };

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

                        // for wholesale price by crrency
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
                                    } else if (selectedCurrency === 'EURO') {
                                        // Set USD price
                                        setFieldValue(`orderProducts[${index}].wholesalePrice`, product?.products?.euroPrice || 0);
                                    } else if (selectedCurrency === 'GBP') {
                                        // Set USD price
                                        setFieldValue(`orderProducts[${index}].wholesalePrice`, product?.products?.gbpPrice || 0);
                                    } else if (selectedCurrency === 'RMB') {
                                        // Set USD price
                                        setFieldValue(`orderProducts[${index}].wholesalePrice`, product?.products?.rmbPrice || 0);
                                    }

                                });
                            }
                        }, [values.currency, order?.orderProducts, setFieldValue]);

                        // for mode of shipment gst and total
                        useEffect(() => {
                            if (values.modeOfShipment) {
                                console.log(values.modeOfShipment, "kkllkkll");
                                if (values.modeOfShipment === 'Courier' || values.modeOfShipment === '') {
                                    console.log(values?.gst, "gsttststst");
                                    // If mode of shipment is Courier, sum all GST values

                                    setFieldValue('gst', Taxx);
                                    const totalWithGst = values.orderProducts.reduce((sum, product) => {
                                        return sum + (product.totalValue || 0);
                                    }, 0);
                                    setFieldValue('total', totalWithGst + Taxx);
                                    setTotall(totalWithGst + Taxx)// Adding GST to the total
                                } else if (values.modeOfShipment === 'Commercial') {
                                    // If mode of shipment is Commercial, set GST to 0 and recalculate total
                                    setFieldValue('gst', 0);
                                    const totalWithoutGst = values.orderProducts.reduce((sum, product) => {
                                        return sum + (product.totalValue || 0);
                                    }, 0);

                                    setFieldValue('total', totalWithoutGst); // No GST, only totalValue sum
                                }
                            }
                        }, [values.modeOfShipment, values.orderProducts, setFieldValue]);





                        // for total and total units

                        useEffect(() => {
                            // Calculate the sum of totalValue for all products whenever orderProducts changes
                            const totalValueSum = values.orderProducts.reduce((sum, product) => {
                                const totalProductValue = product.totalValue || 0; // Ensure you have a totalValue field for each product
                                return sum + totalProductValue;
                            }, 0);

                            // Update Formik's totalUnitsValue field with the total value sum
                            setFieldValue("totalUnitsValue", totalValueSum);
                            setFieldValue("total", totalValueSum);
                        }, [values.orderProducts, setFieldValue]);

                        // for gst cakculate and taxble 




                        // fro total based on courrier
                        useEffect(() => {
                            // Step 1: Get the current total from the form state (starting fresh)
                            let currentTotal = values.total || 0;

                            // Step 2: Check if shippingAccount is 'KLC' and courierCharges > 0
                            if (values.shippingAccount === 'KLC' && values.courierCharges >= 0) {
                                // Add courier charges to the total if shippingAccount is 'KLC'
                                currentTotal = parseFloat(values.courierCharges) + Totall;
                            } else if (values.shippingAccount !== 'KLC' || values.courierCharges <= 0) {
                                // If courierCharges is 0 or shippingAccount is not 'KLC', don't add any courier charges
                                // Ensure courier charges don't affect the total when shippingAccount isn't 'KLC'
                                currentTotal = currentTotal - (parseFloat(values.courierCharges) || 0); // Subtract the previous courierCharges if needed
                            }

                            // Step 3: Update the total field
                            setFieldValue('total', currentTotal);

                        }, [values.shippingAccount, values.courierCharges, setFieldValue]);



                        // for advance
                        useEffect(() => {
                            // Step 1: Calculate the sum of totalValue for all products again
                            let currentTotal = values.total || 0;

                            // Step 2: Subtract advanceReceived from the totalProductValue
                            let updatedTotal = currentTotal - parseFloat(values.advanceReceived || 0); // Ensure advanceReceived is treated as a number

                            // Step 3: Update outstandingBalance
                            setFieldValue('outstandingBalance', updatedTotal);

                        }, [values.advanceReceived, values.orderProducts, setFieldValue]);













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
                                                                selected={field.value ? new Date(field.value) : null} // Convert string to Date object if value exists
                                                                onChange={(date) => {
                                                                    // Format date to 'yyyy-MM-dd' format before setting it in the form state
                                                                    const formattedDate = date ? date.toISOString().split('T')[0] : ''; // This gives 'YYYY-MM-DD'
                                                                    form.setFieldValue("date", formattedDate);
                                                                }}
                                                                dateFormat="yyyy-MM-dd" // Display format
                                                                placeholderText=" Date"
                                                                className="form-datepicker w-[270px] rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        )}
                                                    </Field>

                                                </div>
                                                <ErrorMessage name="orderDate" component="div" className="text-red-600 text-sm" />




                                                <div className="flex-2 min-w-[270px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">PI</label>
                                                    <Field
                                                        name="pid"
                                                        type="text"
                                                        placeholder="pid"
                                                        readOnly
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                    />
                                                    <ErrorMessage name="orderType" component="div" className="text-red-600 text-sm" />
                                                </div>

                                                <div className="flex-2 min-w-[270px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Bill To
                                                    </label>
                                                    <Field
                                                        name="billTo"
                                                        type="text"
                                                        placeholder="bill To"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>


                                            </div>
                                            <div className="mb-4.5 flex flex-wrap gap-4 mt-3">

                                                <div className="flex-2 min-w-[270px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">


                                                        Bill To Email
                                                    </label>
                                                    <Field
                                                        name="billtoEmail"
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
                                                        name="shipTo"
                                                        type="text"
                                                        placeholder="Enter Warp Colors"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>
                                                <div className="flex-2 min-w-[270px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Ship To Email
                                                    </label>
                                                    <Field
                                                        name="shipToEmail"
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
                                                            name="poDate"
                                                            type="text"
                                                            placeholder="poDate"
                                                            readOnly
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[270px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                            Payment Terms
                                                        </label>
                                                        <Field
                                                            name="paymentTerms"
                                                            type="text"
                                                            placeholder="payment Terms"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>

                                                    <div className="flex-1 min-w-[270px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                            Ship Date
                                                        </label>
                                                        <Field
                                                            name="shipDate"
                                                            type="text"
                                                            placeholder="shippingDate"
                                                            readOnly
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
                                                            name="rate"
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
                                                            name="freightTerms"
                                                            type="text"
                                                            placeholder="freightTerms "
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
                                                            name="shipVia"
                                                            type="text"
                                                            placeholder="shipVia"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>


                                                    <div className="flex items-center">
                                                        <Field
                                                            type="radio"
                                                            name="service"
                                                            value="Service"
                                                            className="mr-2"
                                                        />
                                                        <label className="text-black dark:text-white">Service</label>
                                                    </div>

                                                    {/* Economy checkbox */}
                                                    <div className="flex items-center">
                                                        <Field
                                                            type="radio"
                                                            name="service"
                                                            value="Economy"
                                                            className="mr-2"
                                                        />
                                                        <label className="text-black dark:text-white">Economy</label>
                                                    </div>

                                                    {/* Priority checkbox */}
                                                    <div className="flex items-center">
                                                        <Field
                                                            type="radio"
                                                            name="service"
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
                                                            {
                                                                values?.modeOfShipment === 'Courier' &&(
                                                                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                GST Tax %
                                                            </th>
                                                                )
                                                            }

                                                            
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
                                                                        onBlur={() =>
                                                                            calculateValues(
                                                                                index,
                                                                                values.orderProducts[index]?.wholesalePrice,
                                                                                values.orderProducts[index]?.orderQty,
                                                                                values.orderProducts[index]?.discount || 0
                                                                            )
                                                                        }
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




                                                                {
                                                                values?.modeOfShipment === 'Courier' &&(

                                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                    <Field
                                                                        name={`orderProducts[${index}].gstTax`}
                                                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                    />

                                                                    <ErrorMessage
                                                                        name={`orderProducts[${index}].gstTax`}
                                                                        component="div"
                                                                        className="text-red-600 text-sm"
                                                                    />
                                                                </td>
                                                                )}


                                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                    <Field
                                                                        name={`orderProducts[${index}].discount`}
                                                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                        onBlur={() =>
                                                                            calculateValues(
                                                                                index,
                                                                                values.orderProducts[index]?.wholesalePrice,
                                                                                values.orderProducts[index]?.orderQty,
                                                                                values.orderProducts[index]?.discount || 0
                                                                            )
                                                                        }
                                                                    />
                                                                    <ErrorMessage
                                                                        name={`orderProducts[${index}].discount`}
                                                                        component="div"
                                                                        className="text-red-600 text-sm"
                                                                    />
                                                                </td>

                                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                    <Field
                                                                        name={`orderProducts[${index}].taxibleValue`}
                                                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                        readOnly
                                                                    />
                                                                    <ErrorMessage
                                                                        name={`orderProducts[${index}].clientOrderQuantity`}
                                                                        component="div"
                                                                        className="text-red-600 text-sm"
                                                                    />
                                                                </td>
                                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                    <Field
                                                                        name={`orderProducts[${index}].totalValue`}
                                                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                        readOnly
                                                                    />
                                                                    <ErrorMessage
                                                                        name={`orderProducts[${index}].totalValue`}
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




                                                <div className='flex-col gap-6'>
                                                    {/* Added flex to align them horizontally */}

                                                    <div className='flex gap-4'>
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
                                                                name="totalUnitsValue"
                                                                type="text"
                                                                placeholder="Enter Weft Colors"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>



                                                    {/* Added flex to align them horizontally */}
                                                    <div className='flex gap-4 mt-3'>
                                                        <div className="flex-2 min-w-[270px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">
                                                                Mode Of Shipment
                                                            </label>
                                                            <ReactSelect
                                                                name="modeOfShipment"
                                                                // value={
                                                                //     modeOfShipmentOptions?.find(option => option.value === values.orderType.id) || null
                                                                // }
                                                                onChange={(option) =>
                                                                    setFieldValue('modeOfShipment', option.value) // Send only ID
                                                                }
                                                                options={modeOfShipmentOptions}
                                                                styles={customStyles}
                                                                className="bg-white dark:bg-form-Field"
                                                                classNamePrefix="react-select"
                                                                placeholder="Select Order Type"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[270px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">
                                                                GST
                                                            </label>
                                                            <Field
                                                                name="gst"
                                                                type="text"
                                                                placeholder="Enter Weft Colors"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>











                                                    <div className='flex gap-4 mt-3'>


                                                        <div className="flex-2 min-w-[270px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">
                                                                Shipping Account
                                                            </label>
                                                            <ReactSelect
                                                                name="shippingAccount"
                                                                value={ShippingAccountOptions?.find(option => option.value === values.shippingAccount) || null}
                                                                onChange={(option) => setFieldValue('shippingAccount', option.value)} // Save the selected shipping account
                                                                options={ShippingAccountOptions}
                                                                styles={customStyles}
                                                                className="bg-white dark:bg-form-Field"
                                                                classNamePrefix="react-select"
                                                                placeholder="Select Shipping Account"
                                                            />
                                                        </div>

                                                        {/* Courier Charges Field */}
                                                        <div className="flex-1 min-w-[270px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">
                                                                Courier Charges
                                                            </label>
                                                            <Field
                                                                name="courierCharges"
                                                                type="number"
                                                                placeholder="Enter Courier Charges"
                                                                value={values.courierCharges}
                                                                onChange={(e) => setFieldValue('courierCharges', e.target.value)} // Use setFieldValue directly
                                                                disabled={values.shippingAccount !== 'KLC'} // Disable if shippingAccount is not "KLC"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>

                                                    </div>
                                                    <div className='flex justify-end gap-4 mt-3'>

                                                        <div className="flex-end min-w-[270px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">
                                                                Invoice Total
                                                            </label>
                                                            <Field
                                                                name="total"
                                                                type="text"
                                                                placeholder="Total"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>





                                                    <div className='flex justify-end gap-4 mt-3'>

                                                        <div className="flex-end min-w-[270px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">
                                                                Advance Recieved
                                                            </label>
                                                            <Field
                                                                name="advanceReceived"
                                                                type="text"
                                                                placeholder="Total"

                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='flex justify-end gap-4 mt-3'>

                                                        <div className="flex-end min-w-[270px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">
                                                                Outstanding Balance
                                                            </label>
                                                            <Field
                                                                name="outstandingBalance"
                                                                type="text"
                                                                placeholder="Total"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>



                                                </div>









                                            </div>
                                            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                                <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                                    PACKING INSTRUCTION
                                                </h3>
                                            </div>

                                            <div className='flex gap-4 mt-3'>


                                                <div className="flex-2 min-w-[270px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Labels
                                                    </label>
                                                    <ReactSelect
                                                        name="labels"
                                                        value={labelOptions?.find(option => option.value === values.labels) || null}
                                                        onChange={(option) => setFieldValue('labels', option.value)} // Save the selected shipping account
                                                        options={labelOptions}
                                                        styles={customStyles}
                                                        className="bg-white dark:bg-form-Field"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Shipping Account"
                                                    />
                                                </div>
                                                <div className="flex-2 min-w-[270px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Tags
                                                    </label>
                                                    <ReactSelect
                                                        name="tags"
                                                        value={tagOptions?.find(option => option.value === values.tags) || null}
                                                        onChange={(option) => setFieldValue('tags', option.value)} // Save the selected shipping account
                                                        options={tagOptions}
                                                        styles={customStyles}
                                                        className="bg-white dark:bg-form-Field"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Shipping Account"
                                                    />
                                                </div>

                                                <div className="flex-2 min-w-[270px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Logo
                                                    </label>
                                                    <ReactSelect
                                                        name="logo"
                                                        value={logoOptions?.find(option => option.value === values.logo) || null}
                                                        onChange={(option) => setFieldValue('logo', option.value)} // Save the selected shipping account
                                                        options={logoOptions}
                                                        styles={customStyles}
                                                        className="bg-white dark:bg-form-Field"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Logo"
                                                    />
                                                </div>
                                            </div>
                                            <div className='flex gap-4 mt-5'>
                                                <div className="flex items-center">
                                                    <label>Cloth Bag</label>
                                                    <Field
                                                        type="radio"
                                                        name="clothBags"
                                                        value="Yes"
                                                        className="mr-2 ml-4"
                                                    />
                                                    <label className="text-black dark:text-white">Yes</label>
                                                </div>

                                                {/* Economy checkbox */}
                                                <div className="flex items-center">
                                                    <Field
                                                        type="radio"
                                                        name="clothBags"
                                                        value="No"
                                                        className="mr-2"
                                                    />
                                                    <label className="text-black dark:text-white">No</label>
                                                </div>

                                                {/* Priority checkbox */}




                                            </div>

















                                            <div className="flex justify-center mt-4"> {/* Centering the button */}
                                                <button
                                                    type="submit"


                                                    className="w-1/3 px-6 py-2 text-white bg-primary rounded-lg shadow hover:bg-primary-dark focus:outline-none" // Increased width
                                                >
                                                    Create Proforma
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
