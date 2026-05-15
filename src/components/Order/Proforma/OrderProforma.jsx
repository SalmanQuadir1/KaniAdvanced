import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../Breadcrumbs/Breadcrumb';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ReactSelect from 'react-select';
import flatpickr from 'flatpickr';
import ReactDatePicker from "react-datepicker";
import 'flatpickr/dist/themes/material_blue.css';

import useorder from '../../../hooks/useOrder';

import { GET_PRODUCTBYID_URL, GET_ORDERBYID_URL, UPDATE_ORDER_URL, UPDATE_ORDERCREATED_ALL, GET_PID, ADD_ORDERPROFORMA, GET_IMAGE } from '../../../Constants/utils';

import { FiTrash2 } from 'react-icons/fi';
import { useNavigate, useNavigation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md';
import useLocation from '../../../hooks/useLocation';

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
    const [order, setOrder] = useState(null);
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    const [suppId, setsuppId] = useState()
    const [isLoading, setIsLoading] = useState(true);
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
    const { Locations, getAllLocation } = useLocation();

    useEffect(() => {
        getAllLocation();
    }, [])

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
                setPid(data?.pid);
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
            setOrder(data);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setIsLoading(false);
        }
    };
    console.log(order, 'hloooooo')

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

        const isCommercial = values?.modeOfShipment === 'Commercial';

        const proformaProducts = values.orderProducts.map((product) => {
            const gstTax = isCommercial ? 0 : (product.igstTax || 0);
            return {
                product: {
                    id: product.product.id
                },
                orderQty: parseInt(product.orderQty),
                rate: product.wholesalePrice,
                totalPrice: product.totalValueWithGST,
                totalValue: product.totalValue,
                taxibleValue: product.taxibleValue,
                gstTax: gstTax,
                discount: product.discount || 0,
                tax: gstTax,
                discountedPrice: product.discountedPrice || product.totalValue
            };
        });

        const finalData = {
            order: {
                id: order?.id
            },
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
            service: values.service,
            modeOfShipment: values.modeOfShipment,
            rate: values.rate,
            gst: values.totalIgst,
            totalUnits: values.totalUnits,
            totalUnitsValue: values.totalUnitsValue,
            outstandingBalance: values.outstandingBalance,
            shippingAccount: values.shippingAccount,
            labels: values.labels,
            tags: values.tags,
            logo: values.logo,
            proformaProduct: proformaProducts,
        };

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
            } else {
                toast.error(`${data.errorMessage}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
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
                        rate: "1",
                        pid: Pid,
                        orderProducts: order?.orderProducts?.map((product) => ({
                            size: product?.products?.sizes?.sizeName,
                            design: product?.products?.design?.designName,
                            unit: product?.products?.unit?.name,
                            orderQty: product?.clientOrderQuantity,
                            totalValue: 0,
                            totalValueWithGST: 0,
                            taxibleValue: 0,
                            igstTax: product?.products?.hsnCode?.igst || 0,
                            igstAmount: 0,
                            discountedPrice: 0,
                            wholesalePrice: 0,
                            discount: 0,
                            product: {
                                id: product.products?.id || '',
                            },
                        })) || [],
                        totalUnits: "",
                        totalUnitsValue: 0,
                        totalIgst: 0,
                        modeOfShipment: "",
                        shippingAccount: "",
                        courierCharges: 0,
                        advanceReceived: "",
                        total: 0,
                        outstandingBalance: 0,
                        labels: "",
                        tags: "",
                        logo: "",
                        clothBags: ""
                    }}
                >
                    {({ values, setFieldValue }) => {
                        // Calculate values for a single product with dynamic IGST rate
                        const calculateProductValues = (index, wholesalePrice, quantity, discount = 0) => {
                            const currentModeOfShipment = values.modeOfShipment;
                            const igstRate = values.orderProducts[index]?.igstTax || 0;

                            // Calculate discounted price if discount exists
                            const discountedPrice = wholesalePrice - (wholesalePrice * (discount / 100));

                            // Total Value = Wholesale Price (after discount) × Quantity
                            const totalValue = discountedPrice * quantity;

                            if (currentModeOfShipment === 'Commercial') {
                                // Commercial: No IGST
                                const igstAmount = 0;
                                const taxibleValue = totalValue;
                                const totalValueWithGST = totalValue;

                                setFieldValue(`orderProducts[${index}].totalValue`, Math.round(totalValue));
                                setFieldValue(`orderProducts[${index}].totalValueWithGST`, Math.round(totalValueWithGST));
                                setFieldValue(`orderProducts[${index}].taxibleValue`, Math.round(taxibleValue));
                                setFieldValue(`orderProducts[${index}].igstAmount`, 0);
                                setFieldValue(`orderProducts[${index}].discountedPrice`, Math.round(discountedPrice));

                                console.log(`Product ${index} (Commercial):`, {
                                    wholesalePrice,
                                    discountedPrice,
                                    quantity,
                                    totalValue,
                                    igstRate
                                });
                            } else {
                                // Courier: Add IGST based on product's HSN code rate
                                const igstAmount = (totalValue * igstRate) / 100;
                                const taxibleValue = totalValue; // Taxable value is the total value before GST
                                const totalValueWithGST = totalValue + igstAmount;

                                setFieldValue(`orderProducts[${index}].totalValue`, Math.round(totalValue));
                                setFieldValue(`orderProducts[${index}].totalValueWithGST`, Math.round(totalValueWithGST));
                                setFieldValue(`orderProducts[${index}].taxibleValue`, Math.round(taxibleValue));
                                setFieldValue(`orderProducts[${index}].igstAmount`, Math.round(igstAmount));
                                setFieldValue(`orderProducts[${index}].discountedPrice`, Math.round(discountedPrice));

                                console.log(`Product ${index} (Courier):`, {
                                    wholesalePrice,
                                    discountedPrice,
                                    quantity,
                                    totalValue,
                                    igstRate,
                                    igstAmount,
                                    totalValueWithGST
                                });
                            }

                            // Recalculate all totals
                            recalculateAllTotals();
                        };

                        // Recalculate all totals (sum across all products)
                        const recalculateAllTotals = () => {
                            const currentModeOfShipment = values.modeOfShipment;

                            // Calculate total units
                            const totalUnits = values.orderProducts.reduce((sum, product) => {
                                return sum + (parseInt(product.orderQty) || 0);
                            }, 0);
                            setFieldValue("totalUnits", totalUnits);

                            // Calculate total value sum (sum of totalValue - before GST)
                            const totalUnitsValue = values.orderProducts.reduce((sum, product) => {
                                return sum + (product.totalValue || 0);
                            }, 0);
                            setFieldValue("totalUnitsValue", Math.round(totalUnitsValue));

                            if (currentModeOfShipment === 'Commercial') {
                                // Commercial: No IGST
                                setFieldValue("totalIgst", 0);
                                setTaxx(0);
                                setFieldValue("total", Math.round(totalUnitsValue));
                                setTotall(Math.round(totalUnitsValue));
                                setFieldValue("outstandingBalance", Math.round(totalUnitsValue - (parseFloat(values.advanceReceived) || 0)));
                            } else {
                                // Courier: Calculate total IGST amount
                                const totalIgst = values.orderProducts.reduce((sum, product) => {
                                    return sum + (product.igstAmount || 0);
                                }, 0);

                                const totalWithGST = values.orderProducts.reduce((sum, product) => {
                                    return sum + (product.totalValueWithGST || 0);
                                }, 0);

                                setFieldValue("totalIgst", Math.round(totalIgst));
                                setTaxx(Math.round(totalIgst));
                                setFieldValue("total", Math.round(totalWithGST));
                                setTotall(Math.round(totalWithGST));
                                setFieldValue("outstandingBalance", Math.round(totalWithGST - (parseFloat(values.advanceReceived) || 0)));
                            }
                        };

                        // Update wholesale price when currency changes
                        useEffect(() => {
                            if (values.currency && order?.orderProducts) {
                                order.orderProducts.forEach((product, index) => {
                                    let wholesalePrice = 0;

                                    if (values.currency === 'INR') {
                                        wholesalePrice = product?.products?.wholesalePrice || 0;
                                    } else if (values.currency === 'USD') {
                                        wholesalePrice = product?.products?.usdPrice || 0;
                                    } else if (values.currency === 'EUR') {
                                        wholesalePrice = product?.products?.euroPrice || 0;
                                    } else if (values.currency === 'GBP') {
                                        wholesalePrice = product?.products?.gbpPrice || 0;
                                    } else if (values.currency === 'RMB') {
                                        wholesalePrice = product?.products?.rmbPrice || 0;
                                    }

                                    // Apply exchange rate
                                    if (values.rate && values.rate !== 1 && values.rate > 0) {
                                        wholesalePrice = wholesalePrice / parseFloat(values.rate);
                                    }

                                    setFieldValue(`orderProducts[${index}].wholesalePrice`, Math.round(wholesalePrice));
                                    setFieldValue(`orderProducts[${index}].igstTax`, product?.products?.hsnCode?.igst || 0);

                                    // Recalculate product values with new wholesale price
                                    const currentQty = values.orderProducts[index]?.orderQty || 0;
                                    const currentDiscount = values.orderProducts[index]?.discount || 0;

                                    if (currentQty > 0) {
                                        calculateProductValues(index, wholesalePrice, currentQty, currentDiscount);
                                    }
                                });
                            }
                        }, [values.currency, values.rate, order?.orderProducts]);

                        // When mode of shipment changes, recalculate all products
                        useEffect(() => {
                            if (values.modeOfShipment && values.orderProducts.length > 0) {
                                values.orderProducts.forEach((product, index) => {
                                    const wholesalePrice = product.wholesalePrice || 0;
                                    const quantity = product.orderQty || 0;
                                    const discount = product.discount || 0;

                                    if (wholesalePrice > 0 && quantity > 0) {
                                        calculateProductValues(index, wholesalePrice, quantity, discount);
                                    }
                                });
                            }
                        }, [values.modeOfShipment]);

                        // When quantity changes
                        const handleQuantityChange = (index, quantity) => {
                            const wholesalePrice = values.orderProducts[index]?.wholesalePrice || 0;
                            const discount = values.orderProducts[index]?.discount || 0;
                            calculateProductValues(index, wholesalePrice, quantity, discount);
                        };

                        // When discount changes
                        const handleDiscountChange = (index, discount) => {
                            const wholesalePrice = values.orderProducts[index]?.wholesalePrice || 0;
                            const quantity = values.orderProducts[index]?.orderQty || 0;
                            calculateProductValues(index, wholesalePrice, quantity, discount);
                        };

                        // Update totals when advance received changes
                        useEffect(() => {
                            const currentTotal = values.total || 0;
                            const advanceAmount = parseFloat(values.advanceReceived) || 0;
                            setFieldValue("outstandingBalance", Math.round(currentTotal - advanceAmount));
                        }, [values.advanceReceived, values.total]);

                        // Update totals when courier charges change
                        useEffect(() => {
                            let currentTotal = values.total || 0;

                            if (values.shippingAccount === 'KLC' && values.courierCharges >= 0) {
                                const baseTotal = values.modeOfShipment === 'Commercial' ? values.totalUnitsValue : values.total;
                                currentTotal = parseFloat(baseTotal) + parseFloat(values.courierCharges || 0);
                            } else if (values.shippingAccount !== 'KLC') {
                                const baseTotal = values.modeOfShipment === 'Commercial' ? values.totalUnitsValue : values.total;
                                currentTotal = parseFloat(baseTotal);
                            }

                            setFieldValue('total', Math.round(currentTotal));
                            const advanceAmount = parseFloat(values.advanceReceived) || 0;
                            setFieldValue('outstandingBalance', Math.round(currentTotal - advanceAmount));
                        }, [values.shippingAccount, values.courierCharges]);

                        return (
                            <Form>
                                <div className="flex flex-col gap-9">
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
                                                                selected={field.value ? new Date(field.value) : null}
                                                                onChange={(date) => {
                                                                    const formattedDate = date ? date.toISOString().split('T')[0] : '';
                                                                    form.setFieldValue("date", formattedDate);
                                                                }}
                                                                dateFormat="yyyy-MM-dd"
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
                                                        disabled
                                                        className="w-full rounded border-[1.5px] bg-gray-2 border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:bg-gray-300 dark:disabled:bg-gray-600 dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>

                                                <div className="flex-2 min-w-[270px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Bill To
                                                    </label>
                                                    <Field
                                                        name="billTo"
                                                        type="text"
                                                        readOnly
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
                                                        readOnly
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
                                                        readOnly
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>

                                                <div className="flex-2 min-w-[270px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Ship To Email
                                                    </label>
                                                    <Field
                                                        readOnly
                                                        name="shipToEmail"
                                                        type="text"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-[270px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        PO/Date
                                                    </label>
                                                    <Field
                                                        name="poDate"
                                                        type="text"
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
                                                        placeholder="Payment Terms"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-[270px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Ship Date
                                                    </label>
                                                    <Field
                                                        name="shipDate"
                                                        type="text"
                                                        readOnly
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-[270px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Currency</label>
                                                    <ReactSelect
                                                        name="currency"
                                                        value={currency.find(option => option.value === values.currency) || null}
                                                        onChange={(option) => setFieldValue('currency', option.value)}
                                                        options={currency}
                                                        styles={customStyles}
                                                        placeholder="Select Currency"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-[270px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Exchange Rate
                                                    </label>
                                                    <Field
                                                        name="rate"
                                                        type="Number"
                                                        placeholder="Enter Rate"
                                                        value={values.rate}
                                                        onChange={(e) => setFieldValue('rate', e.target.value)}
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-[270px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Freight Terms
                                                    </label>
                                                    <Field
                                                        name="freightTerms"
                                                        type="text"
                                                        placeholder="Freight Terms"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-[270px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Ship Via
                                                    </label>
                                                    <Field
                                                        name="shipVia"
                                                        type="text"
                                                        placeholder="Ship Via"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-4.5 flex flex-wrap gap-6">
                                                <div className="flex items-center">
                                                    <Field
                                                        type="radio"
                                                        name="service"
                                                        value="Service"
                                                        className="mr-2"
                                                    />
                                                    <label className="text-black dark:text-white">Service</label>
                                                </div>
                                                <div className="flex items-center">
                                                    <Field
                                                        type="radio"
                                                        name="service"
                                                        value="Economy"
                                                        className="mr-2"
                                                    />
                                                    <label className="text-black dark:text-white">Economy</label>
                                                </div>
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

                                            {/* Products Table */}
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
                                                                Wholesale Price
                                                            </th>
                                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                Discount %
                                                            </th>
                                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                Total Value <br />(Price × Qty)
                                                            </th>
                                                            {values?.modeOfShipment === 'Courier' && (
                                                                <>
                                                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                        IGST %
                                                                    </th>
                                                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                        IGST Amount
                                                                    </th>
                                                                    {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                        Taxable Value
                                                                    </th> */}
                                                                </>
                                                            )}

                                                            {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                Final Total
                                                            </th> */}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {order?.orderProducts?.map((product, index) => (
                                                            <tr key={product.id}>
                                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                    <div className="relative group">
                                                                        <img
                                                                            className="h-10 w-10 rounded-full transition-transform duration-500 ease-in-out transform group-hover:scale-[2] group-hover:shadow-2xl"
                                                                            crossOrigin="use-credentials"
                                                                            src={`${GET_IMAGE}/products/getimages/${product?.products?.images[0]?.referenceImage}`}
                                                                            alt="Product Image"
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                    <Field
                                                                        name={`orderProducts[${index}].design`}
                                                                        value={product?.products?.design?.designName || ""}
                                                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                    <Field
                                                                        name={`orderProducts[${index}].size`}
                                                                        value={product?.products?.sizes?.sizeName || ""}
                                                                        readOnly
                                                                        className="w-[150px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                    />
                                                                </td>
                                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                    <Field
                                                                        name={`orderProducts[${index}].unit`}
                                                                        value={product?.products?.unit?.name || ""}
                                                                        readOnly
                                                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                    />
                                                                </td>
                                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                    <Field
                                                                        name={`orderProducts[${index}].orderQty`}
                                                                        type="number"
                                                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                        onChange={(e) => {
                                                                            const qty = parseInt(e.target.value) || 0;
                                                                            setFieldValue(`orderProducts[${index}].orderQty`, qty);
                                                                            handleQuantityChange(index, qty);
                                                                        }}
                                                                    />
                                                                </td>
                                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                    <Field
                                                                        name={`orderProducts[${index}].wholesalePrice`}
                                                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                    <Field
                                                                        name={`orderProducts[${index}].discount`}
                                                                        type="number"
                                                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                        onChange={(e) => {
                                                                            const discount = parseFloat(e.target.value) || 0;
                                                                            setFieldValue(`orderProducts[${index}].discount`, discount);
                                                                            handleDiscountChange(index, discount);
                                                                        }}
                                                                    />
                                                                </td>
                                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                    <Field
                                                                        name={`orderProducts[${index}].totalValue`}
                                                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                {values?.modeOfShipment === 'Courier' && (
                                                                    <>
                                                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                            <Field
                                                                                name={`orderProducts[${index}].igstTax`}
                                                                                className="w-[80px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                                readOnly
                                                                            />
                                                                        </td>
                                                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                            <Field
                                                                                name={`orderProducts[${index}].igstAmount`}
                                                                                className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                                readOnly
                                                                            />
                                                                        </td>
                                                                        {/* <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                            <Field
                                                                                name={`orderProducts[${index}].taxibleValue`}
                                                                                className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                                readOnly
                                                                            />
                                                                        </td> */}
                                                                    </>
                                                                )}

                                                                {/* <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                    <Field
                                                                        name={`orderProducts[${index}].totalValueWithGST`}
                                                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                                        readOnly
                                                                    />
                                                                </td> */}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Totals Section */}
                                            <div className='flex justify-between mt-4'>
                                                <h2 className='font-semibold text-2xl'>Total</h2>
                                                <div className='flex-col gap-6 w-1/2'>
                                                    <div className='flex gap-4'>
                                                        <div className="flex-1">
                                                            <label className="mb-2.5 block text-black dark:text-white">
                                                                Total Units
                                                            </label>
                                                            <Field
                                                                name="totalUnits"
                                                                readOnly
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none dark:border-form-strokedark dark:bg-form-field dark:text-white"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="mb-2.5 block text-black dark:text-white">
                                                                Total Value (Before Tax)
                                                            </label>
                                                            <Field
                                                                readOnly
                                                                name="totalUnitsValue"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none dark:border-form-strokedark dark:bg-form-field dark:text-white"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className='flex gap-4 mt-3'>
                                                        <div className="flex-1">
                                                            <label className="mb-2.5 block text-black dark:text-white">
                                                                Mode Of Shipment
                                                            </label>
                                                            <ReactSelect
                                                                name="modeOfShipment"
                                                                value={modeOfShipmentOptions?.find(option => option.value === values.modeOfShipment) || null}
                                                                onChange={(option) => {
                                                                    setFieldValue('modeOfShipment', option.value);
                                                                }}
                                                                options={modeOfShipmentOptions}
                                                                styles={customStyles}
                                                                placeholder="Select Mode of Shipment"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="mb-2.5 block text-black dark:text-white">
                                                                Total IGST
                                                            </label>
                                                            <Field
                                                                name="totalIgst"
                                                                readOnly
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none dark:border-form-strokedark dark:bg-form-field dark:text-white"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className='flex gap-4 mt-3'>
                                                        <div className="flex-1">
                                                            <label className="mb-2.5 block text-black dark:text-white">
                                                                Shipping Account
                                                            </label>
                                                            <ReactSelect
                                                                name="shippingAccount"
                                                                value={ShippingAccountOptions?.find(option => option.value === values.shippingAccount) || null}
                                                                onChange={(option) => setFieldValue('shippingAccount', option.value)}
                                                                options={ShippingAccountOptions}
                                                                styles={customStyles}
                                                                placeholder="Select Shipping Account"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="mb-2.5 block text-black dark:text-white">
                                                                Courier Charges
                                                            </label>
                                                            <Field
                                                                name="courierCharges"
                                                                type="number"
                                                                placeholder="Enter Courier Charges"
                                                                value={values.courierCharges}
                                                                onChange={(e) => setFieldValue('courierCharges', parseFloat(e.target.value) || 0)}
                                                                disabled={values.shippingAccount !== 'KLC'}
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className='flex justify-end gap-4 mt-3'>
                                                        <div className="w-[270px]">
                                                            <label className="mb-2.5 block text-black dark:text-white font-bold">
                                                                Invoice Total
                                                            </label>
                                                            <Field
                                                                readOnly
                                                                name="total"
                                                                className="w-full rounded border-[1.5px] border-primary bg-primary/10 py-3 px-5 text-black font-bold outline-none dark:border-form-strokedark dark:bg-form-field dark:text-white"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className='flex justify-end gap-4 mt-3'>
                                                        <div className="w-[270px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">
                                                                Advance Received
                                                            </label>
                                                            <Field
                                                                name="advanceReceived"
                                                                type="number"
                                                                placeholder="Advance Amount"
                                                                onChange={(e) => setFieldValue('advanceReceived', parseFloat(e.target.value) || 0)}
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none dark:border-form-strokedark dark:bg-form-field dark:text-white"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className='flex justify-end gap-4 mt-3'>
                                                        <div className="w-[270px]">
                                                            <label className="mb-2.5 block text-black dark:text-white font-bold">
                                                                Outstanding Balance
                                                            </label>
                                                            <Field
                                                                readOnly
                                                                name="outstandingBalance"
                                                                className="w-full rounded border-[1.5px] border-warning bg-warning/10 py-3 px-5 text-black font-bold outline-none dark:border-form-strokedark dark:bg-form-field dark:text-white"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Packing Instruction */}
                                            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark mt-6">
                                                <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                                    PACKING INSTRUCTION
                                                </h3>
                                            </div>

                                            <div className='flex gap-4 mt-3'>
                                                <div className="flex-1">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Labels
                                                    </label>
                                                    <ReactSelect
                                                        name="labels"
                                                        value={labelOptions?.find(option => option.value === values.labels) || null}
                                                        onChange={(option) => setFieldValue('labels', option.value)}
                                                        options={labelOptions}
                                                        styles={customStyles}
                                                        placeholder="Select Labels Option"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Tags
                                                    </label>
                                                    <ReactSelect
                                                        name="tags"
                                                        value={tagOptions?.find(option => option.value === values.tags) || null}
                                                        onChange={(option) => setFieldValue('tags', option.value)}
                                                        options={tagOptions}
                                                        styles={customStyles}
                                                        placeholder="Select Tags Option"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Logo
                                                    </label>
                                                    <ReactSelect
                                                        name="logo"
                                                        value={logoOptions?.find(option => option.value === values.logo) || null}
                                                        onChange={(option) => setFieldValue('logo', option.value)}
                                                        options={logoOptions}
                                                        styles={customStyles}
                                                        placeholder="Select Logo Option"
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
                                                <div className="flex items-center">
                                                    <Field
                                                        type="radio"
                                                        name="clothBags"
                                                        value="No"
                                                        className="mr-2"
                                                    />
                                                    <label className="text-black dark:text-white">No</label>
                                                </div>
                                            </div>

                                            <div className="flex justify-center mt-6">
                                                <button
                                                    type="submit"
                                                    className="w-1/3 px-6 py-3 text-white bg-primary rounded-lg shadow hover:bg-primary-dark focus:outline-none font-semibold"
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