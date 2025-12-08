import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import { ErrorMessage, Field, FieldArray, Form, Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import useColorMode from '../../../hooks/useColorMode';
import ReactSelect from 'react-select';
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import useVoucher from '../../../hooks/useVoucher';
import { GETPRODUCTBYSUPPLIER, GET_VoucherNos_URL, customStyles as createCustomStyles } from '../../../Constants/utils';
import { useSelector } from 'react-redux';
import Modall from '../../Products/Modall';
import NumberingDetailsModal from './NumberingDetailsModal';
import { useParams } from 'react-router-dom';
import useLedger from '../../../hooks/useLedger';
import { use } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

const CreateVoucher = () => {
    const { id } = useParams();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const { GetVoucherById, Vouchers, CreateVoucherEntry, handleCreateVoucher } = useVoucher();
    const [voucherNos, setvoucherNos] = useState([])
    const { getLedger, Ledger } = useLedger();
    const theme = useSelector(state => state?.persisted?.theme);
    const [vaaluee, setvaaluee] = useState({});
    const customStyles = createCustomStyles(theme?.mode);
    const [ledgers, setLedgers] = useState([]);
    const [openingbalance2, setopeningbalance2] = useState(0)
    const [selectedLedger, setSelectedLedger] = useState(null);

    const [selectedOrder, setselectedOrder] = useState(null)



    const [availableProducts, setAvailableProducts] = useState([]);

    const [availableOrders, setavailableOrders] = useState([])
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingOrders, setloadingOrders] = useState(false)

    console.log(Vouchers, "jharkhand");

    console.log(Ledger, "lolot");

    // Filter ledgers based on voucher type
    const getFilteredLedgers = () => {
        if (!Ledger) return [];

        if (Vouchers?.typeOfVoucher === "Purchase") {
            // For Purchase - show only suppliers (ledgers with supplier data)
            return Ledger.filter(ledg => ledg?.supplier !== null);
        } else if (Vouchers?.typeOfVoucher === "Sales") {
            // For Sales - show only customers (ledgers without supplier data)
            return Ledger.filter(ledg => ledg?.supplier === null);
        } else {
            // For other voucher types (Payment, Contra) - show all ledgers
            return Ledger;
        }
    };

    const LedgerData = getFilteredLedgers()?.map(ledg => ({
        value: ledg?.id,
        label: ledg?.name,
        obj: ledg,
        balance: ledg?.openingBalance,
        isSupplier: ledg?.supplier !== null
    }));

    console.log(LedgerData, "Filtered LedgerData");

    useEffect(() => {
        GetVoucherById(id);
        getLedger();
    }, []);

    // GST Calculation Logic
    const calculateGST = (mrp, hsnCode, gstRegistration, customerAddress, discount = 0) => {
        // If discount is applied, no GST will be applied
        if (discount > 0) {
            return {
                type: 'No GST (Discount Applied)',
                cgstRate: 0,
                sgstRate: 0,
                igstRate: 0,
                cgstAmount: 0,
                sgstAmount: 0,
                gstAmount: 0,
                totalGstAmount: 0,
                inclusivePrice: mrp,
                isSameState: false,
                discountApplied: true
            };
        }

        const igstRate = hsnCode?.igst || 0;
        // const cgstRate = hsnCode?.cgstRate || 0;
        // const sgstRate = hsnCode?.sgstRate || 0;

        // Check if same state (both contain "Srinagar")
        const isSameState = gstRegistration?.toLowerCase().includes('srinagar') &&
            customerAddress?.toLowerCase().includes('srinagar');

        if (isSameState) {
            // Same state - apply CGST + SGST (each half of IGST rate)
            // const cgstRate = igstRate / 2;
            // const sgstRate = igstRate / 2;
            const cgstRate = hsnCode?.cgst || 0;
            const sgstRate = hsnCode?.sgst || 0;
            const cgstAmount = mrp * (cgstRate / 100);
            const sgstAmount = mrp * (sgstRate / 100);
            const totalGstAmount = cgstAmount + sgstAmount;
            const inclusivePrice = mrp + totalGstAmount;

            return {
                type: 'CGST+SGST',
                cgstRate,
                sgstRate,
                cgstAmount,
                sgstAmount,
                totalGstAmount,
                inclusivePrice,
                isSameState: true,
                discountApplied: false
            };
        } else {
            // Different state - apply IGST
            const gstAmount = mrp * (igstRate / 100);
            const inclusivePrice = mrp + gstAmount;

            return {
                type: 'IGST',
                igstRate,
                gstAmount,
                totalGstAmount: gstAmount,
                inclusivePrice,
                isSameState: false,
                discountApplied: false
            };
        }
    };



    const handleOrderSelect = async (option) => {


        setselectedOrder(option);
        setAvailableProducts([]);
        console.log(option, "lklk");

        console.log(selectedOrder, "kikidoyopu");



        try {

            const response = await fetch(`http://localhost:8081/order/order-products/by-order-ids?orderIds=${option}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const data = await response.json();

            console.log(data, "iuiu");



            if (response.ok && Array.isArray(data)) {
                const productOptions = data.map(prod => ({
                    value: prod.product.id,
                    label: prod.product.productDescription,
                    price: prod.product?.retailMrp,
                    hsnCode: prod.product?.hsnCode || '',
                    obj: prod
                }));
                setAvailableProducts(productOptions);
            }

        }
        catch (error) {
            console.error("Error fetching customer products:", error);
        } finally {
            setLoadingProducts(false);
        }
    }
















    const handleLedgerSelect = async (option) => {
        setSelectedLedger(option);
        setavailableOrders([]);

        if (option?.obj?.supplier) {
            setloadingOrders(true);
            try {
                const supplierId = option.obj.supplier.id;
                const response = await fetch(`http://localhost:8081/order/order-product/accepted?id=${supplierId}?type=supplier`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                const data = await response.json();
                console.log(data, "Products data");

                // if (response.ok && Array.isArray(data)) {
                //     const orderOptions = data.map(order => ({
                //         value: prod.id,
                //         label: prod.products.productDescription,
                //         price: prod.products?.retailMrp,
                //         hsnCode: prod.products?.hsnCode || '',
                //         obj: prod
                //     }));
                //     setAvailableProducts(productOptions);
                // }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoadingProducts(false);
            }
        } else if (Vouchers?.typeOfVoucher === "Sales" && option) {
            // For Sales - fetch customer products
            setloadingOrders(true);
            try {
                const customerId = option.value;
                const response = await fetch(`http://localhost:8081/order/by-type?id=${customerId}&type=customer`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                const data = await response.json();
                console.log(data, "order data");

                if (response.ok && Array.isArray(data)) {
                    const orderOptions = data.map(ord => ({
                        value: ord.orderId,
                        label: ord.orderNumber,

                        obj: ord
                    }));
                    setavailableOrders(orderOptions);
                }
            } catch (error) {
                console.error("Error fetching customer products:", error);
            } finally {
                setLoadingProducts(false);
            }
        }
    };




    const getUsedproductsIds = (values, currentIndex) => {
        return values.paymentDetails
            .filter((_, index) => index !== currentIndex)
            .map(item => item.productsId)
            .filter(Boolean);
    };

    const getAvailableProductsForRow = (values, currentIndex) => {
        const usedproductsIds = getUsedproductsIds(values, currentIndex);
        return availableProducts.filter(product =>
            !usedproductsIds.includes(product.value)
        );
    };

    const calculateLineTotal = (entry) => {
        const basePrice = entry.discount > 0 ? entry.rate : entry.exclusiveGst;
        const quantity = entry.quantity || 1;
        return (basePrice * quantity).toFixed(2);
    };

    // Calculate totals for the summary
    const calculateTotals = (values) => {
        let subtotal = 0;
        let totalCGST = 0;
        let totalSGST = 0;
        let totalIGST = 0;
        let totalGST = 0;
        let grandTotal = 0;
        let totalDiscount = 0;
        let totalMRP = 0;
        let totalQuantity = 0;

        values.paymentDetails.forEach(entry => {


            const lineTotal = parseFloat(calculateLineTotal(entry)) || 0;
            subtotal += lineTotal;



            // Calculate MRP total
            const mrpTotal = (entry.mrp || 0) * (entry.quantity || 1);
            totalMRP += mrpTotal;

            // Calculate total quantity
            totalQuantity += (entry.quantity || 1);
     


            // Only calculate GST if no discount is applied
            if (!entry.gstCalculation?.discountApplied) {
                if (entry.gstCalculation?.type === 'CGST+SGST') {
                    totalCGST += (entry.gstCalculation.cgstAmount || 0) * (entry.quantity || 1);
                    totalSGST += (entry.gstCalculation.sgstAmount || 0) * (entry.quantity || 1);
                } else if (entry.gstCalculation?.type === 'IGST') {
                    totalIGST += (entry.gstCalculation.gstAmount || 0) * (entry.quantity || 1);
                }

                totalGST += (entry.gstCalculation?.totalGstAmount || 0) * (entry.quantity || 1);
            }

            // Calculate discount amount
            if (entry.discount > 0) {
                const discountAmount = (entry.mrp * (entry.discount / 100)) * (entry.quantity || 1);
                totalDiscount += discountAmount;
            }
        });

        grandTotal = subtotal + totalGST;
        console.log(subtotal, grandTotal, "jazimmmm");


        return {
            subtotal: subtotal.toFixed(2),
            totalCGST: totalCGST.toFixed(2),
            totalSGST: totalSGST.toFixed(2),
            totalIGST: totalIGST.toFixed(2),
            totalGST: totalGST.toFixed(2),
            totalDiscount: totalDiscount.toFixed(2),
            grandTotal: grandTotal.toFixed(2),
            totalMRP: totalMRP.toFixed(2),
            totalQuantity: totalQuantity
        };
    };

    const validationSchema = Yup.object().shape({
        recieptNumber: Yup.string().required('Voucher number is required'),
        supplierInvoiceNumber: Yup.string().required('Supplier invoice number is required'),
        date: Yup.date().required('Date is required'),
        ledgerId: Yup.string().required('Party account is required'),
    });


    console.log(Vouchers,"humsath");
    
    const GetVoucherNos = async () => {
        try {
       
            const response = await fetch(`${GET_VoucherNos_URL}/${Vouchers.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const data = await response.json();
            console.log(data,"humnahi");
            
            if (response.ok) {
    // Simple and direct approach
    const receiptNum = parseInt(data?.receiptNumber);
    
    if (!isNaN(receiptNum)) {
        setvoucherNos([receiptNum]); // Store as array with one number
    } else {
        setvoucherNos([]); // Store empty array if invalid
    }
    
    return data;
} else {
    toast.error(data.errorMessage || "Error");
    setvoucherNos([]);
    return null;
}
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
            return null;
        }
    };

  useEffect(() => {
    // Only call GetVoucherNos when Vouchers.id is available
    if (Vouchers?.id) {
        GetVoucherNos();
    }
}, [Vouchers.id]);

    let lastvoucher = 0;
    if (voucherNos.length > 0) {
        lastvoucher = Number(voucherNos[voucherNos.length - 1]) || 0;
    }

    const nextVoucher = lastvoucher + 1;

    // Get placeholder text for party account based on voucher type
    const getPartyAccountPlaceholder = () => {
        switch (Vouchers?.typeOfVoucher) {
            case "Purchase":
                return "Select Supplier";
            case "Sales":
                return "Select Customer";
            default:
                return "Select Ledger";
        }
    };

    // Get label text for party account based on voucher type
    const getPartyAccountLabel = () => {
        switch (Vouchers?.typeOfVoucher) {
            case "Purchase":
                return "Supplier Account";
            case "Sales":
                return "Customer Account";
            default:
                return "Party Account Name";
        }
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Configurator/Create Voucher" />
            <div>
                <Formik
                    initialValues={{
                        recieptNumber: `${nextVoucher}`,
                        supplierInvoiceNumber: '',
                        date: '',
                        voucherId: Number(id),
                        ledgerId: "",
                        orderIds: [],
                        currentBalance: "",
                        gstRegistration: Vouchers.defGstRegist || "",
                        narration: "",
                        modeOfPayment:"",
                        cardNumber:"",
                        transactionId:"",

                        isExport: false,
                        totalAmount: 0,
                        totalIgst: 0,
                        totalSgst: 0,
                        totalCgst: 0,

                        totalGst: 0,
                        paymentDetails: [{
                            productsId: null,
                            mrp: 0,
                            rate: 0,
                            exclusiveGst: 0,
                            discount: 0,
                            quantity: 1,
                            value: 0,
                            igstRate: 0,
                            gstAmount: 0,
                            gstCalculation: null
                        }]
                    }}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={handleCreateVoucher}
                >
                    {({ isSubmitting, setFieldValue, values }) => {
                        const totals = calculateTotals(values);

                        useEffect(() => {
                            setFieldValue('totalAmount', totals.subtotal);
                            setFieldValue('totalGst', totals.totalGST);
                            setFieldValue('totalCgst', totals.totalCGST);
                            setFieldValue('totalIgst', totals.totalIGST);
                            setFieldValue('totalSgst', totals.totalSGST);
                        }, [totals.subtotal, totals.totalGST, totals.totalCGST, totals.totalIGST, totals.totalSGST, setFieldValue]);

                        return (
                            <Form>
                                <div className="flex flex-col gap-9">
                                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                            <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                                Create Entry For {Vouchers?.typeOfVoucher}
                                            </h3>
                                        </div>

                                        <div className="flex flex-col p-6.5">
                                            {/* Top Section - Party Account Details */}
                                            <div className='flex flex-row gap-4 mb-6'>

                                                <div className="flex-2 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">{Vouchers?.typeOfVoucher} Voucher Number</label>
                                                    <Field
                                                        type="text"
                                                        name="recieptNumber"
                                                        placeholder="Enter No"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                    />
                                                    <ErrorMessage name="recieptNumber" component="div" className="text-red-500" />
                                                </div>

                                                <div className="flex-2 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Supplier Invoice Number</label>
                                                    <Field
                                                        type="text"
                                                        name="supplierInvoiceNumber"
                                                        placeholder="Enter No"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                    />
                                                    <ErrorMessage name="supplierInvoiceNumber" component="div" className="text-red-500" />
                                                </div>

                                                <div className="flex-2 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">{getPartyAccountLabel()}</label>
                                                    <ReactSelect
                                                        name='ledgerId'
                                                        value={LedgerData.find(opt => opt.value === values.ledgerId)}
                                                        onChange={(option) => {
                                                            setFieldValue('ledgerId', option?.value || '');
                                                            setFieldValue('currentBalance', option?.balance || 0);
                                                            handleLedgerSelect(option);
                                                        }}
                                                        options={LedgerData}
                                                        className="react-select-container bg-white dark:bg-form-Field w-full"
                                                        classNamePrefix="react-select"
                                                        placeholder={getPartyAccountPlaceholder()}
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            ...customStyles,
                                                            menuPortal: (base) => ({ ...base, zIndex: 100000 })
                                                        }}
                                                    />
                                                    <ErrorMessage name="ledgerId" component="div" className="text-red-500 text-xs mt-1" />
                                                </div>

                                                <div className="flex-2 min-w-[250px] " >
                                                    <label className="mb-2.5 block text-black dark:text-white">Orders Pending For{getPartyAccountLabel()}</label>
                                                    <ReactSelect
                                                        name='orderIds'
                                                        style={{ height: "20px" }}
                                                        value={availableOrders.filter(opt => values.orderIds?.includes(opt.value))}
                                                        onChange={(selectedOptions) => {
                                                            const selectedValues = selectedOptions?.map(option => option.value) || [];
                                                            setFieldValue('orderIds', selectedValues);
                                                            console.log(selectedValues, "jojojazim");

                                                            // Call handleOrderSelect with selected values (even if empty)
                                                            handleOrderSelect(selectedValues);
                                                        }}
                                                        options={availableOrders}
                                                        isMulti={true}
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            ...customStyles,
                                                            control: (base, state) => ({
                                                                ...base,
                                                                minHeight: '42px',
                                                                maxHeight: '42px',
                                                                overflowY: 'auto',
                                                                borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
                                                                '&:hover': {
                                                                    borderColor: '#9ca3af',
                                                                },
                                                            }),
                                                            valueContainer: (base) => ({
                                                                ...base,
                                                                maxHeight: '36px',
                                                                overflowY: 'auto',
                                                                flexWrap: 'nowrap',
                                                                display: 'flex',
                                                            }),
                                                            multiValue: (base) => ({
                                                                ...base,
                                                                backgroundColor: '#3b82f6',
                                                                borderRadius: '4px',
                                                                margin: '2px',
                                                                flexShrink: 0,
                                                            }),
                                                            multiValueLabel: (base) => ({
                                                                ...base,
                                                                color: 'white',
                                                                padding: '2px 6px',
                                                                fontSize: '12px',
                                                            }),
                                                            multiValueRemove: (base) => ({
                                                                ...base,
                                                                color: 'white',
                                                                ':hover': {
                                                                    backgroundColor: '#2563eb',
                                                                    color: 'white',
                                                                },
                                                            }),
                                                            indicatorsContainer: (base) => ({
                                                                ...base,
                                                                height: '40px',
                                                            }),
                                                            menuPortal: (base) => ({ ...base, zIndex: 100000 })
                                                        }}
                                                        components={{
                                                            DropdownIndicator: null,
                                                            IndicatorSeparator: null,
                                                        }}
                                                    />
                                                    <ErrorMessage name="orderId" component="div" className="text-red-500 text-xs mt-1" />
                                                </div>


                                            </div>

                                            <div className='flex flex-row gap-4 mb-6'>

                                                <div className="flex-2 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Current Balance</label>
                                                    <Field
                                                        type="text"
                                                        name="currentBalance"
                                                        placeholder="0.00"
                                                        readOnly
                                                        className="w-full bg-gray-100 dark:bg-slate-800 rounded border border-gray-300 py-3 px-5 text-black cursor-not-allowed"
                                                    />
                                                </div>
                                                <div className="flex-2 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Date</label>
                                                    <Field
                                                        name="date"
                                                        type="date"
                                                        placeholder="Enter Date"
                                                        className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                    />
                                                    <ErrorMessage name="date" component="div" className="text-red-500" />
                                                </div>
                                                <div className="flex-2 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Gst Registration</label>
                                                    <Field
                                                        name="gstRegistration"
                                                        type="text"
                                                        placeholder="Enter gst Registration"
                                                        className=" w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                    />
                                                    <ErrorMessage name="gstRegistration" component="div" className="text-red-500" />
                                                </div>

                                                <div className="flex-2 min-w-[250px] ml-5">
                                                    <label className="mt-7 mb-2  block text-black dark:text-white">Is Export</label>
                                                    <div className="flex items-center gap-3">
                                                        <Field
                                                            name="isExport"
                                                            type="checkbox"
                                                            className="h-5 w-5 rounded border-stroke bg-transparent text-primary focus:ring-primary dark:border-form-strokedark dark:bg-form-input"
                                                        />
                                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                                            {values.isExport ? 'Yes (Export)' : 'No (Domestic)'}
                                                        </span>
                                                    </div>
                                                    <ErrorMessage name="isExport" component="div" className="text-red-500 text-sm mt-1" />
                                                </div>
                                            </div>

                                            {/* Products Table - Only for Sales and Purchase */}
                                            {(Vouchers?.typeOfVoucher === "Sales" || Vouchers?.typeOfVoucher === "Purchase") && (
                                                <FieldArray name="paymentDetails">
                                                    {({ push, remove }) => (
                                                        <div className="mb-6">
                                                            <div className="overflow-x-auto">
                                                                <table className="w-full table-fixed border-collapse">
                                                                    <thead>
                                                                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                                                            {[
                                                                                "Product",
                                                                                "MRP",
                                                                                "Rate (inc. GST)",
                                                                                "Discount Applied",
                                                                                "quantity",
                                                                                "Value",
                                                                                "GST Type",
                                                                                "Action"
                                                                            ].map((header, i) => (
                                                                                <th
                                                                                    key={i}
                                                                                    className="w-[220px] py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300 truncate"
                                                                                >
                                                                                    {header}
                                                                                </th>
                                                                            ))}
                                                                        </tr>
                                                                    </thead>

                                                                    <tbody>
                                                                        {values.paymentDetails.map((entry, index) => {
                                                                            const rowProducts = getAvailableProductsForRow(values, index);
                                                                            return (
                                                                                <tr key={entry.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                                                    {/* Product Dropdown */}
                                                                                    <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                                                                        {selectedLedger ? (
                                                                                            <ReactSelect
                                                                                                name={`paymentDetails.${index}.productsId`}
                                                                                                value={rowProducts.find(p => p.value === entry.productsId) || null}
                                                                                                onChange={(option) => {
                                                                                                    const mrp = option?.price || 0;
                                                                                                    const hsnCode = option?.hsnCode || {};
                                                                                                    const igstRate = hsnCode?.igst || 0;

                                                                                                    // Get customer shipping address for GST calculation
                                                                                                    const customerAddress = selectedLedger?.obj?.customer?.shippingAddress || '';
                                                                                                    const gstRegistration = values.gstRegistration || '';
                                                                                                    const currentDiscount = entry.discount || 0;

                                                                                                    // Calculate GST based on location and discount
                                                                                                    const gstCalculation = calculateGST(mrp, hsnCode, gstRegistration, customerAddress, currentDiscount);

                                                                                                    setFieldValue(`paymentDetails.${index}.productsId`, option?.value || null);
                                                                                                    setFieldValue(`paymentDetails.${index}.mrp`, mrp);
                                                                                                    setFieldValue(`paymentDetails.${index}.igstRate`, igstRate);
                                                                                                    setFieldValue(`paymentDetails.${index}.gstAmount`, gstCalculation.totalGstAmount);
                                                                                                    setFieldValue(`paymentDetails.${index}.exclusiveGst`, gstCalculation.inclusivePrice);
                                                                                                    setFieldValue(`paymentDetails.${index}.rate`, gstCalculation.inclusivePrice);
                                                                                                    setFieldValue(`paymentDetails.${index}.gstCalculation`, gstCalculation);
                                                                                                    setFieldValue(`paymentDetails.${index}.value`, calculateLineTotal({
                                                                                                        ...entry,
                                                                                                        exclusiveGst: gstCalculation.inclusivePrice,
                                                                                                        rate: gstCalculation.inclusivePrice
                                                                                                    }));
                                                                                                }}
                                                                                                options={rowProducts}
                                                                                                placeholder="Select Product"
                                                                                                className="react-select-container"
                                                                                                classNamePrefix="react-select"
                                                                                                menuPortalTarget={document.body}
                                                                                                styles={{
                                                                                                    ...customStyles,
                                                                                                    menuPortal: base => ({ ...base, zIndex: 9999 })
                                                                                                }}
                                                                                                isClearable
                                                                                                isDisabled={loadingProducts}
                                                                                            />
                                                                                        ) : (
                                                                                            <div className="text-sm text-gray-400">Select party account first</div>
                                                                                        )}
                                                                                        <ErrorMessage name={`paymentDetails.${index}.productsId`} component="div" className="text-red-500 text-xs mt-1" />
                                                                                    </td>

                                                                                    {/* MRP */}
                                                                                    <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                                                                        <Field
                                                                                            type="number"
                                                                                            name={`paymentDetails.${index}.mrp`}
                                                                                            placeholder="0.00"
                                                                                            readOnly
                                                                                            className="w-full bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm rounded border"
                                                                                        />
                                                                                    </td>

                                                                                    {/* Rate (inc. GST) */}
                                                                                    <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                                                                        <Field
                                                                                            type="number"
                                                                                            name={`paymentDetails.${index}.exclusiveGst`}
                                                                                            placeholder="0.00"
                                                                                            readOnly
                                                                                            className="w-full bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm rounded border"
                                                                                        />
                                                                                    </td>

                                                                                    {/* Discount Applied */}
                                                                                    <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                                                                        <Field
                                                                                            type="number"
                                                                                            name={`paymentDetails.${index}.discount`}
                                                                                            placeholder="0"
                                                                                            min="0"
                                                                                            step="1"
                                                                                            className="w-full py-2 px-3 text-sm rounded border focus:border-primary"
                                                                                            onChange={(e) => {
                                                                                                const discount = parseFloat(e.target.value) || 0;
                                                                                                setFieldValue(`paymentDetails.${index}.discount`, discount);

                                                                                                // Recalculate GST when discount changes
                                                                                                if (entry.productsId) {
                                                                                                    const mrp = entry.mrp || 0;
                                                                                                    const hsnCode = availableProducts.find(p => p.value === entry.productsId)?.hsnCode || {};
                                                                                                    const customerAddress = selectedLedger?.obj?.customer?.shippingAddress || '';
                                                                                                    const gstRegistration = values.gstRegistration || '';

                                                                                                    // Recalculate GST with new discount
                                                                                                    const gstCalculation = calculateGST(mrp, hsnCode, gstRegistration, customerAddress, discount);

                                                                                                    setFieldValue(`paymentDetails.${index}.gstCalculation`, gstCalculation);
                                                                                                    setFieldValue(`paymentDetails.${index}.gstAmount`, gstCalculation.totalGstAmount);
                                                                                                    setFieldValue(`paymentDetails.${index}.exclusiveGst`, gstCalculation.inclusivePrice);

                                                                                                    // Recalculate rate and value
                                                                                                    if (discount > 0) {
                                                                                                        const discountedRate = gstCalculation.inclusivePrice * (1 - discount / 100);
                                                                                                        setFieldValue(`paymentDetails.${index}.rate`, discountedRate);
                                                                                                        setFieldValue(`paymentDetails.${index}.value`, calculateLineTotal({
                                                                                                            ...entry,
                                                                                                            rate: discountedRate,
                                                                                                            discount: discount
                                                                                                        }));
                                                                                                    } else {
                                                                                                        setFieldValue(`paymentDetails.${index}.rate`, gstCalculation.inclusivePrice);
                                                                                                        setFieldValue(`paymentDetails.${index}.value`, calculateLineTotal({
                                                                                                            ...entry,
                                                                                                            rate: gstCalculation.inclusivePrice,
                                                                                                            discount: 0
                                                                                                        }));
                                                                                                    }
                                                                                                }
                                                                                            }}
                                                                                        />
                                                                                    </td>

                                                                                    {/* quantity */}
                                                                                    <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                                                                        <Field
                                                                                            type="number"
                                                                                            name={`paymentDetails.${index}.quantity`}
                                                                                            placeholder="1"
                                                                                            min="1"
                                                                                            step="1"
                                                                                            className="w-full py-2 px-3 text-sm rounded border focus:border-primary"
                                                                                            onChange={(e) => {
                                                                                                const quantity = parseFloat(e.target.value) || 1;
                                                                                                setFieldValue(`paymentDetails.${index}.quantity`, quantity);
                                                                                                setFieldValue(`paymentDetails.${index}.value`, calculateLineTotal({
                                                                                                    ...entry,
                                                                                                    quantity: quantity
                                                                                                }));
                                                                                            }}
                                                                                        />
                                                                                    </td>

                                                                                    {/* Value - Auto-calculated */}
                                                                                    <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark font-medium">
                                                                                        <Field
                                                                                            type="number"
                                                                                            name={`paymentDetails.${index}.value`}
                                                                                            value={calculateLineTotal(entry)}
                                                                                            readOnly
                                                                                            className="w-full bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm rounded border"
                                                                                        />
                                                                                    </td>

                                                                                    {/* GST Type */}
                                                                                    <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                                                                        <span className={`text-xs font-medium px-2 py-1 rounded ${entry.gstCalculation?.type === 'CGST+SGST' ? 'bg-blue-100 text-blue-800' :
                                                                                            entry.gstCalculation?.type === 'IGST' ? 'bg-green-100 text-green-800' :
                                                                                                entry.gstCalculation?.type === 'No GST (Discount Applied)' ? 'bg-yellow-100 text-yellow-800' :
                                                                                                    'bg-gray-100 text-gray-800'
                                                                                            }`}>
                                                                                            {entry.gstCalculation?.type || 'No GST'}
                                                                                        </span>
                                                                                    </td>

                                                                                    {/* Delete Button */}
                                                                                    <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark text-center">
                                                                                        {values.paymentDetails.length > 1 && (
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => remove(index)}
                                                                                                className="text-red-600 hover:text-red-800 transition"
                                                                                            >
                                                                                                <MdDelete size={22} />
                                                                                            </button>
                                                                                        )}
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            {/* Add Row Button */}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    push({
                                                                        id: uuidv4(),
                                                                        productsId: null,
                                                                        mrp: 0,
                                                                        rate: 0,
                                                                        exclusiveGst: 0,
                                                                        discount: 0,
                                                                        quantity: 1,
                                                                        value: 0,
                                                                        igstRate: 0,
                                                                        gstAmount: 0,
                                                                        gstCalculation: null
                                                                    })
                                                                }
                                                                disabled={!selectedLedger}
                                                                className="flex items-center gap-2 mt-4 text-primary hover:text-primary/80 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                                                            >
                                                                <IoMdAdd size={20} /> Add Row
                                                            </button>

                                                            {/* GST Summary */}
                                                            {Vouchers?.typeOfVoucher === "Sales" && (
                                                                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                                    <h4 className="text-lg font-semibold mb-3 text-black dark:text-white">GST Summary</h4>
                                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                                                                        <div>
                                                                            <p className="text-gray-600 dark:text-gray-400">Total MRP</p>
                                                                            <p className="font-medium text-black dark:text-white">₹{totals.totalMRP}</p>
                                                                        </div>

                                                                        <div>
                                                                            <p className="text-gray-600 dark:text-gray-400">Total Quantity</p>
                                                                            <p className="font-medium text-black dark:text-white">{totals.totalQuantity}</p>
                                                                        </div>
                                                                        {totals.totalDiscount > 0 && (
                                                                            <div>
                                                                                <p className="text-gray-600 dark:text-gray-400">Total Discount</p>
                                                                                <p className="font-medium text-red-600">-₹{totals.totalDiscount}</p>
                                                                            </div>
                                                                        )}
                                                                        {totals.totalCGST > 0 && (
                                                                            // <div>
                                                                            //     <p className="text-gray-600 dark:text-gray-400">CGST</p>
                                                                            //     <p className="font-medium text-black dark:text-white">₹{totals.totalCGST}</p>
                                                                            // </div>

                                                                            <div className='flex flex-col'>
                                                                                <p className="text-gray-600 dark:text-gray-400">CGST</p>
                                                                                <Field
                                                                                    type="number"
                                                                                    name="totalCgst"
                                                                                    value={totals.totalCGST}
                                                                                    placeholder="0.00"
                                                                                    readOnly
                                                                                    className="w-full bg-gray-50 dark:bg-slate-800  text-sm rounded border"
                                                                                />
                                                                            </div>
                                                                        )}
                                                                        {totals.totalSGST > 0 && (
                                                                            // <div>
                                                                            //     <p className="text-gray-600 dark:text-gray-400">SGST</p>
                                                                            //     <p className="font-medium text-black dark:text-white">₹{totals.totalSGST}</p>
                                                                            // </div>

                                                                            <div className='flex flex-col'>
                                                                                <p className="text-gray-600 dark:text-gray-400">SGST</p>
                                                                                <Field
                                                                                    type="number"
                                                                                    name="totalSgst"
                                                                                    value={totals.totalSGST}
                                                                                    placeholder="0.00"
                                                                                    readOnly
                                                                                    className="w-full bg-gray-50 dark:bg-slate-800  text-sm rounded border"
                                                                                />
                                                                            </div>
                                                                        )}
                                                                        {totals.totalIGST > 0 && (
                                                                            // <div>
                                                                            //     <p className="text-gray-600 dark:text-gray-400">IGST</p>
                                                                            //     <p className="font-medium text-black dark:text-white">₹{totals.totalIGST}</p>
                                                                            // </div>

                                                                            <div className='flex flex-col'>
                                                                                <p className="text-gray-600 dark:text-gray-400">IGST</p>
                                                                                <Field
                                                                                    type="number"
                                                                                    name="totalIgst"
                                                                                    value={totals.totalIGST}
                                                                                    placeholder="0.00"
                                                                                    readOnly
                                                                                    className="w-full bg-gray-50 dark:bg-slate-800  text-sm rounded border"
                                                                                />
                                                                            </div>
                                                                        )}
                                                                        <div>
                                                                            <p className="text-gray-600 dark:text-gray-400">Total GST</p>
                                                                            <p className="font-medium text-black dark:text-white">₹{totals.totalGST}</p>
                                                                        </div>
                                                                        {/* <div>
                                                                            <p className="text-gray-600 dark:text-gray-400">Grand Total</p>
                                                                            <p className="font-medium text-lg text-primary">₹{totals?.subtotal}</p>
                                                                        </div> */}
                                                                        <div className='flex flex-col'>
                                                                            <p className="text-gray-600 dark:text-gray-400">Grand Total</p>
                                                                            <Field
                                                                                type="number"
                                                                                name="totalAmount"
                                                                                value={totals?.subtotal}
                                                                                placeholder="0.00"
                                                                                readOnly
                                                                                className="w-full bg-gray-50 dark:bg-slate-800  text-sm rounded border"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}


                                                        </div>
                                                    )}
                                                </FieldArray>
                                            )}

                                            {/* For Payment and Contra - Simple Amount Field */}
                                            {(Vouchers?.typeOfVoucher === "Payment" || Vouchers?.typeOfVoucher === "Contra") && (
                                                <div className="mb-6">
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full table-fixed border-collapse">
                                                            <thead>
                                                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                                                    <th className="w-[220px] py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300">
                                                                        Amount
                                                                    </th>
                                                                    <th className="w-[100px] py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300">
                                                                        Action
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {values.paymentDetails.map((entry, index) => (
                                                                    <tr key={entry.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                                        <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                                                            <Field
                                                                                type="number"
                                                                                name={`paymentDetails.${index}.amount`}
                                                                                placeholder="0.00"
                                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black dark:bg-form-Field dark:text-white focus:border-primary"
                                                                                min="0"
                                                                                step="0.01"
                                                                            />
                                                                        </td>
                                                                        <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark text-center">
                                                                            {values.paymentDetails.length > 1 && (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => remove(index)}
                                                                                    className="text-red-600 hover:text-red-800 transition"
                                                                                >
                                                                                    <MdDelete size={22} />
                                                                                </button>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            push({
                                                                id: uuidv4(),
                                                                amount: 0
                                                            })
                                                        }
                                                        className="flex items-center gap-2 mt-4 text-primary hover:text-primary/80 font-medium"
                                                    >
                                                        <IoMdAdd size={20} /> Add Row
                                                    </button>
                                                </div>
                                            )}

                                            {/* Narration Field */}
                                            <div className="mb-4">
                                                <label className="mb-2.5 block text-black dark:text-white">Narration</label>
                                                <Field
                                                    as="textarea"
                                                    name="narration"
                                                    placeholder="Narration"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                />
                                            </div>

                                            <div className="flex justify-center mt-4 items-center">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="flex md:w-[120px] w-[170px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
                                                >
                                                    {isSubmitting ? 'Saving...' : 'Create Voucher'}
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
    )
}

export default CreateVoucher;