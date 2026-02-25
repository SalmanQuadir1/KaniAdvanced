import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ReactSelect from 'react-select';
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import useVoucher from '../../../hooks/useVoucher';
import { GETPRODUCTS, GET_VoucherNos_URL, customStyles as createCustomStyles } from '../../../Constants/utils';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useLedger from '../../../hooks/useLedger';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

const CreateCreditNote = () => {
    const { id } = useParams();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const { GetVoucherById, Vouchers, handleCreateVoucher } = useVoucher();
    const [voucherNos, setvoucherNos] = useState('')
    const { getLedger, Ledger, getLedgerIncome, LedgerIncome } = useLedger();
    const theme = useSelector(state => state?.persisted?.theme);
    const customStyles = createCustomStyles(theme?.mode);
    const [selectedLedger, setSelectedLedger] = useState(null);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [salesVouchers, setSalesVouchers] = useState([]);

    // Filter ledgers for customers only
    const getFilteredLedgers = () => {
        if (!Ledger) return [];
        return Ledger.filter(ledg => ledg?.ledgerType === "CUSTOMER");
    };

    const LedgerData = getFilteredLedgers()?.map(ledg => ({
        value: ledg?.id,
        customerId: ledg?.customer ? ledg.customer.id : null,
        label: ledg?.name,
        obj: ledg,
        balance: ledg?.openingBalances,
        type: ledg.typeOfOpeningBalance
    }));

    // GST Ledgers for Output GST reversal
    const igstLedgers = Ledger.filter(ledg =>
        ledg?.name && ledg.name.toLowerCase().includes('igst') && !ledg.name.toLowerCase().includes('input')
    );
    const cgstLedgers = Ledger.filter(ledg =>
        ledg?.name && ledg.name.toLowerCase().includes('cgst') && !ledg.name.toLowerCase().includes('input')
    );
    const sgstLedgers = Ledger.filter(ledg =>
        ledg?.name && ledg.name.toLowerCase().includes('sgst') && !ledg.name.toLowerCase().includes('input')
    );

    const igstOptions = igstLedgers?.map(ledg => ({ value: ledg?.id, label: ledg?.name }));
    const cgstOptions = cgstLedgers?.map(ledg => ({ value: ledg?.id, label: ledg?.name }));
    const sgstOptions = sgstLedgers?.map(ledg => ({ value: ledg?.id, label: ledg?.name }));

    useEffect(() => {
        GetVoucherById(id);
        getLedger();
        getLedgerIncome();
        fetchAllProducts();
    }, []);

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
            if (response.ok) {
                setvoucherNos(data.nextReceipt);
                return data.nextReceipt;
            } else {
                toast.error(data.errorMessage || "Error");
                return null;
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
            return null;
        }
    };

    useEffect(() => {
        if (Vouchers?.id) {
            GetVoucherNos();
        }
    }, [Vouchers.id]);

    const fetchAllProducts = async () => {
        try {
            const response = await fetch(`${GETPRODUCTS}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            const data = await response.json();
            if (response.ok && Array.isArray(data.content)) {
                const productOptions = data?.content?.map(product => ({
                    value: product.id,
                    label: `${product?.productDescription} ${product.barcode}`,
                    price: product?.retailMrp,
                    hsnCode: product?.hsnCode || {},
                    obj: product
                }));
                setAllProducts(productOptions);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleLedgerSelect = async (option) => {
        setSelectedLedger(option);
        // Fetch sales vouchers for this customer
        try {
            const response = await fetch(`http://localhost:8081/voucher/by-customer/${option?.value}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            const data = await response.json();
            if (response.ok) {
                const voucherOptions = data.map(v => ({
                    value: v.id,
                    label: `${v.recieptNumber} - ${v.date}`,
                    obj: v
                }));
                setSalesVouchers(voucherOptions);
            }
        } catch (error) {
            console.error("Error fetching sales vouchers:", error);
        }
    };

    const calculateLineTotal = (entry) => {
        const basePrice = entry.exclusiveGst || entry.rate || entry.mrp || 0;
        const quantity = entry.quantity || 1;
        return (basePrice * quantity).toFixed(2);
    };

    const calculateTotals = (values) => {
        let subtotal = 0;
        let totalCGST = 0;
        let totalSGST = 0;
        let totalIGST = 0;
        let totalGST = 0;
        let totalMRP = 0;
        let totalQuantity = 0;

        values.paymentDetails.forEach(entry => {
            if (entry.gstCalculation) {
                const lineTotal = parseFloat(entry.exclusiveGst || 0) * (entry.quantity || 1);
                subtotal += lineTotal;

                const mrpTotal = (entry.mrp || 0) * (entry.quantity || 1);
                totalMRP += mrpTotal;
                totalQuantity += (entry.quantity || 1);

                if (entry.gstCalculation.type === 'CGST+SGST') {
                    totalCGST += (entry.gstCalculation.cgstAmount || 0) * (entry.quantity || 1);
                    totalSGST += (entry.gstCalculation.sgstAmount || 0) * (entry.quantity || 1);
                } else if (entry.gstCalculation.type === 'IGST') {
                    totalIGST += (entry.gstCalculation.gstAmount || 0) * (entry.quantity || 1);
                }
                totalGST += (entry.gstCalculation.totalGstAmount || 0) * (entry.quantity || 1);
            }
        });

        return {
            subtotal: subtotal.toFixed(2),
            totalCGST: totalCGST.toFixed(2),
            totalSGST: totalSGST.toFixed(2),
            totalIGST: totalIGST.toFixed(2),
            totalGST: totalGST.toFixed(2),
            totalMRP: totalMRP.toFixed(2),
            totalQuantity: totalQuantity
        };
    };

    const calculateGST = (mrp, hsnCode, gstRegistration, customerState, discount = 0) => {
        const discountedPrice = discount > 0 ? mrp * (1 - discount / 100) : mrp;
        const igstRate = hsnCode?.igst || 0;
        const cgstRate = hsnCode?.cgst || 0;
        const sgstRate = hsnCode?.sgst || 0;
        const registrationState = gstRegistration?.state || '';

        const isSameState = registrationState === customerState;

        if (isSameState) {
            const cgstAmount = discountedPrice * (cgstRate / 100);
            const sgstAmount = discountedPrice * (sgstRate / 100);
            const totalGstAmount = cgstAmount + sgstAmount;
            const inclusivePrice = discountedPrice + totalGstAmount;

            return {
                type: 'CGST+SGST',
                cgstRate, sgstRate, igstRate: 0,
                cgstAmount, sgstAmount, gstAmount: 0,
                totalGstAmount, inclusivePrice,
                originalMrp: mrp, discountedPrice,
                discountApplied: discount > 0,
                discountPercentage: discount,
                isSameState: true
            };
        } else {
            const gstAmount = discountedPrice * (igstRate / 100);
            const inclusivePrice = discountedPrice + gstAmount;
            return {
                type: 'IGST',
                igstRate, cgstRate: 0, sgstRate: 0,
                gstAmount, cgstAmount: 0, sgstAmount: 0,
                totalGstAmount: gstAmount, inclusivePrice,
                originalMrp: mrp, discountedPrice,
                discountApplied: discount > 0,
                discountPercentage: discount,
                isSameState: false
            };
        }
    };

    const validationSchema = Yup.object().shape({
        recieptNumber: Yup.string().required('Voucher number is required'),
        ledgerId: Yup.string().required('Customer account is required'),
        date: Yup.date().required('Date is required'),
    });

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Configurator/Create Credit Note" />
            <div>
                <Formik
                    initialValues={{
                        recieptNumber: voucherNos,
                        date: '',
                        voucherId: Number(id),
                        ledgerId: "",
                        salesVoucherId: "",
                        currentBalance: "",
                        narration: "",
                        igstLedgerId: null,
                        cgstLedgerId: null,
                        sgstLedgerId: null,
                        typeOfVoucher: "Credit Note",
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
                        }, []);

                        return (
                            <Form>
                                <div className="flex flex-col gap-9">
                                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                            <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                                Credit Note Entry
                                            </h3>
                                        </div>

                                        <div className="flex flex-col p-6.5">
                                            {/* Top Section */}
                                            <div className='flex flex-row gap-4 mb-6 flex-wrap'>
                                                <div className="flex-1 min-w-[200px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Credit Note Number</label>
                                                    <Field
                                                        type="text"
                                                        name="recieptNumber"
                                                        placeholder="Enter No"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white"
                                                    />
                                                    <ErrorMessage name="recieptNumber" component="div" className="text-red-500" />
                                                </div>

                                                <div className="flex-1 min-w-[200px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Date</label>
                                                    <Field
                                                        name="date"
                                                        type="date"
                                                        className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white"
                                                    />
                                                    <ErrorMessage name="date" component="div" className="text-red-500" />
                                                </div>

                                                <div className="flex-1 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Customer Account</label>
                                                    <ReactSelect
                                                        name='ledgerId'
                                                        value={LedgerData.find(opt => opt.value === values.ledgerId)}
                                                        onChange={(option) => {
                                                            setFieldValue('ledgerId', option?.value || '');
                                                            setFieldValue('currentBalance', option?.balance || 0);
                                                            handleLedgerSelect(option);
                                                        }}
                                                        options={LedgerData}
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Customer"
                                                        menuPortalTarget={document.body}
                                                        styles={{ ...customStyles, menuPortal: (base) => ({ ...base, zIndex: 100000 }) }}
                                                    />
                                                    <ErrorMessage name="ledgerId" component="div" className="text-red-500 text-xs mt-1" />
                                                </div>

                                                <div className="flex-1 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Reference Sales Voucher</label>
                                                    <ReactSelect
                                                        name='salesVoucherId'
                                                        value={salesVouchers.find(opt => opt.value === values.salesVoucherId)}
                                                        onChange={(option) => setFieldValue('salesVoucherId', option?.value)}
                                                        options={salesVouchers}
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Sales Voucher"
                                                        menuPortalTarget={document.body}
                                                        styles={{ ...customStyles, menuPortal: (base) => ({ ...base, zIndex: 100000 }) }}
                                                        isDisabled={!values.ledgerId}
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-[150px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Current Balance</label>
                                                    <Field
                                                        type="text"
                                                        name="currentBalance"
                                                        placeholder="0.00"
                                                        readOnly
                                                        className="w-full bg-gray-100 dark:bg-slate-800 rounded border border-gray-300 py-3 px-5 text-black cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>

                                            {/* GST Ledgers */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-4">
                                                <div>
                                                    <label className="mb-2.5 block text-black dark:text-white">IGST Ledger (Reversal)</label>
                                                    <ReactSelect
                                                        name='igstLedgerId'
                                                        value={igstOptions.find(opt => opt.value === values.igstLedgerId)}
                                                        onChange={(option) => setFieldValue('igstLedgerId', option?.value || '')}
                                                        options={igstOptions}
                                                        classNamePrefix="react-select"
                                                        placeholder="Select IGST"
                                                        menuPortalTarget={document.body}
                                                        styles={{ ...customStyles, menuPortal: (base) => ({ ...base, zIndex: 100000 }) }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2.5 block text-black dark:text-white">CGST Ledger (Reversal)</label>
                                                    <ReactSelect
                                                        name='cgstLedgerId'
                                                        value={cgstOptions.find(opt => opt.value === values.cgstLedgerId)}
                                                        onChange={(option) => setFieldValue('cgstLedgerId', option?.value || '')}
                                                        options={cgstOptions}
                                                        classNamePrefix="react-select"
                                                        placeholder="Select CGST"
                                                        menuPortalTarget={document.body}
                                                        styles={{ ...customStyles, menuPortal: (base) => ({ ...base, zIndex: 100000 }) }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2.5 block text-black dark:text-white">SGST Ledger (Reversal)</label>
                                                    <ReactSelect
                                                        name='sgstLedgerId'
                                                        value={sgstOptions.find(opt => opt.value === values.sgstLedgerId)}
                                                        onChange={(option) => setFieldValue('sgstLedgerId', option?.value || '')}
                                                        options={sgstOptions}
                                                        classNamePrefix="react-select"
                                                        placeholder="Select SGST"
                                                        menuPortalTarget={document.body}
                                                        styles={{ ...customStyles, menuPortal: (base) => ({ ...base, zIndex: 100000 }) }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Products Table - Similar to Debit Note but with discount field */}
                                            <FieldArray name="paymentDetails">
                                                {({ push, remove }) => (
                                                    <div className="mb-6">
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full table-fixed border-collapse">
                                                                <thead>
                                                                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                                                        {["Product", "MRP", "Discount %", "Quantity", "Value", "GST Type", "Action"].map((header, i) => (
                                                                            <th key={i} className="w-[180px] py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300">
                                                                                {header}
                                                                            </th>
                                                                        ))}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {values.paymentDetails.map((entry, index) => (
                                                                        <tr key={entry.id || index}>
                                                                            <td className="border-b py-4 px-3">
                                                                                {selectedLedger ? (
                                                                                    <ReactSelect
                                                                                        name={`paymentDetails.${index}.productsId`}
                                                                                        value={allProducts.find(p => p.value === entry.productsId)}
                                                                                        onChange={(option) => {
                                                                                            const mrp = option?.price || 0;
                                                                                            const hsnCode = option?.hsnCode || {};
                                                                                            const customerState = selectedLedger?.obj?.shippingState || '';
                                                                                            const gstRegistration = Vouchers?.defGstRegist?.state || '';
                                                                                            const currentDiscount = entry.discount || 0;

                                                                                            const gstCalculation = calculateGST(
                                                                                                mrp, hsnCode, gstRegistration, customerState, currentDiscount
                                                                                            );

                                                                                            setFieldValue(`paymentDetails.${index}.productsId`, option?.obj.id);
                                                                                            setFieldValue(`paymentDetails.${index}.mrp`, mrp);
                                                                                            setFieldValue(`paymentDetails.${index}.exclusiveGst`, gstCalculation.inclusivePrice);
                                                                                            setFieldValue(`paymentDetails.${index}.rate`, gstCalculation.inclusivePrice);
                                                                                            setFieldValue(`paymentDetails.${index}.gstCalculation`, gstCalculation);
                                                                                            
                                                                                            const lineTotal = calculateLineTotal({
                                                                                                exclusiveGst: gstCalculation.inclusivePrice,
                                                                                                quantity: entry.quantity || 1
                                                                                            });
                                                                                            setFieldValue(`paymentDetails.${index}.value`, lineTotal);
                                                                                        }}
                                                                                        options={allProducts}
                                                                                        placeholder="Select Product"
                                                                                        classNamePrefix="react-select"
                                                                                        menuPortalTarget={document.body}
                                                                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                                                        isClearable
                                                                                    />
                                                                                ) : (
                                                                                    <div className="text-sm text-gray-400">Select customer first</div>
                                                                                )}
                                                                            </td>
                                                                            <td className="border-b py-4 px-3">
                                                                                <Field
                                                                                    type="number"
                                                                                    name={`paymentDetails.${index}.mrp`}
                                                                                    placeholder="0.00"
                                                                                    readOnly
                                                                                    className="w-full bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm rounded border"
                                                                                />
                                                                            </td>
                                                                            <td className="border-b py-4 px-3">
                                                                                <Field
                                                                                    type="number"
                                                                                    name={`paymentDetails.${index}.discount`}
                                                                                    placeholder="0"
                                                                                    min="0"
                                                                                    max="100"
                                                                                    className="w-full py-2 px-3 text-sm rounded border focus:border-primary"
                                                                                    onChange={(e) => {
                                                                                        const discount = parseFloat(e.target.value) || 0;
                                                                                        setFieldValue(`paymentDetails.${index}.discount`, discount > 100 ? 100 : discount);
                                                                                        
                                                                                        if (entry.productsId) {
                                                                                            const mrp = entry.mrp || 0;
                                                                                            const hsnCode = allProducts.find(p => p.value === entry.productsId)?.hsnCode || {};
                                                                                            const customerState = selectedLedger?.obj?.shippingState || '';
                                                                                            const gstRegistration = Vouchers?.defGstRegist?.state || '';

                                                                                            const gstCalculation = calculateGST(
                                                                                                mrp, hsnCode, gstRegistration, customerState, discount
                                                                                            );

                                                                                            setFieldValue(`paymentDetails.${index}.gstCalculation`, gstCalculation);
                                                                                            setFieldValue(`paymentDetails.${index}.exclusiveGst`, gstCalculation.inclusivePrice);
                                                                                            setFieldValue(`paymentDetails.${index}.rate`, gstCalculation.inclusivePrice);
                                                                                            
                                                                                            const lineTotal = calculateLineTotal({
                                                                                                exclusiveGst: gstCalculation.inclusivePrice,
                                                                                                quantity: entry.quantity || 1
                                                                                            });
                                                                                            setFieldValue(`paymentDetails.${index}.value`, lineTotal);
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </td>
                                                                            <td className="border-b py-4 px-3">
                                                                                <Field
                                                                                    type="number"
                                                                                    name={`paymentDetails.${index}.quantity`}
                                                                                    placeholder="1"
                                                                                    min="1"
                                                                                    className="w-full py-2 px-3 text-sm rounded border focus:border-primary"
                                                                                    onChange={(e) => {
                                                                                        const quantity = parseFloat(e.target.value) || 1;
                                                                                        setFieldValue(`paymentDetails.${index}.quantity`, quantity);
                                                                                        setFieldValue(`paymentDetails.${index}.value`, calculateLineTotal({
                                                                                            exclusiveGst: entry.exclusiveGst,
                                                                                            quantity: quantity
                                                                                        }));
                                                                                    }}
                                                                                />
                                                                            </td>
                                                                            <td className="border-b py-4 px-3">
                                                                                <Field
                                                                                    type="number"
                                                                                    name={`paymentDetails.${index}.value`}
                                                                                    value={calculateLineTotal(entry)}
                                                                                    readOnly
                                                                                    className="w-full bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm rounded border"
                                                                                />
                                                                            </td>
                                                                            <td className="border-b py-4 px-3">
                                                                                {entry.gstCalculation && (
                                                                                    <div className="flex flex-col">
                                                                                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                                                                                            entry.gstCalculation.type === 'CGST+SGST' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                                                                        }`}>
                                                                                            {entry.gstCalculation.type}
                                                                                        </span>
                                                                                        {entry.gstCalculation.discountApplied && (
                                                                                            <span className="text-xs text-orange-600 mt-1">
                                                                                                {entry.gstCalculation.discountPercentage}% off
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            </td>
                                                                            <td className="border-b py-4 px-3 text-center">
                                                                                {values.paymentDetails.length > 1 && (
                                                                                    <button type="button" onClick={() => remove(index)} className="text-red-600 hover:text-red-800">
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
                                                            onClick={() => push({
                                                                id: uuidv4(),
                                                                productsId: null,
                                                                mrp: 0,
                                                                rate: 0,
                                                                exclusiveGst: 0,
                                                                discount: 0,
                                                                quantity: 1,
                                                                value: 0,
                                                                gstCalculation: null
                                                            })}
                                                            disabled={!selectedLedger}
                                                            className="flex items-center gap-2 mt-4 text-primary hover:text-primary/80 font-medium disabled:text-gray-400"
                                                        >
                                                            <IoMdAdd size={20} /> Add Row
                                                        </button>

                                                        {/* Summary */}
                                                        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                            <h4 className="text-lg font-semibold mb-3">Summary</h4>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                <div>
                                                                    <p className="text-gray-600 dark:text-gray-400">Total MRP</p>
                                                                    <p className="font-medium">₹{totals.totalMRP}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-600 dark:text-gray-400">Total Quantity</p>
                                                                    <p className="font-medium">{totals.totalQuantity}</p>
                                                                </div>
                                                                {parseFloat(totals.totalCGST) > 0 && (
                                                                    <div>
                                                                        <p className="text-gray-600 dark:text-gray-400">CGST</p>
                                                                        <p className="font-medium">₹{totals.totalCGST}</p>
                                                                    </div>
                                                                )}
                                                                {parseFloat(totals.totalSGST) > 0 && (
                                                                    <div>
                                                                        <p className="text-gray-600 dark:text-gray-400">SGST</p>
                                                                        <p className="font-medium">₹{totals.totalSGST}</p>
                                                                    </div>
                                                                )}
                                                                {parseFloat(totals.totalIGST) > 0 && (
                                                                    <div>
                                                                        <p className="text-gray-600 dark:text-gray-400">IGST</p>
                                                                        <p className="font-medium">₹{totals.totalIGST}</p>
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <p className="text-gray-600 dark:text-gray-400">Total GST</p>
                                                                    <p className="font-medium">₹{totals.totalGST}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-600 dark:text-gray-400">Grand Total</p>
                                                                    <p className="font-bold text-primary">₹{totals.subtotal}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </FieldArray>

                                            {/* Narration */}
                                            <div className="mb-4">
                                                <label className="mb-2.5 block text-black dark:text-white">Narration</label>
                                                <Field
                                                    as="textarea"
                                                    name="narration"
                                                    placeholder="Enter reason for credit note"
                                                    rows="3"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white"
                                                />
                                            </div>

                                            {/* Submit Button */}
                                            <div className="flex justify-center mt-4">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="flex md:w-[220px] w-full justify-center bg-primary p-3 font-medium text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                                                >
                                                    {isSubmitting ? 'Creating...' : 'Create Credit Note'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </DefaultLayout>
    );
};

export default CreateCreditNote;