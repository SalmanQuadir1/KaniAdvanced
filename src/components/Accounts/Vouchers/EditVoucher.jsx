// src/pages/Voucher/EditVoucher.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { FaSave, FaArrowLeft, FaSpinner, FaPlus, FaTrash } from 'react-icons/fa';
import { IoMdAdd, IoMdRemove } from 'react-icons/io';
import ReactSelect from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import { customStyles as createCustomStyles, EDIT_ENTRY_URL, GETPRODUCTS } from '../../../Constants/utils';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../Breadcrumbs/Breadcrumb';
import useVoucher from '../../../hooks/useVoucher';
import useLedger from '../../../hooks/useLedger';

const EditVoucher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const theme = useSelector((state) => state?.persisted?.theme);
  const customStyles = createCustomStyles(theme?.mode);

  const { GetVoucherById, Vouchers } = useVoucher();
  const { getLedger, Ledger, getLedgerIncome, LedgerIncome } = useLedger();

  const [loading, setLoading] = useState(true);
  const [voucherData, setVoucherData] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [selectedLedger, setSelectedLedger] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gsttype, setgsttype] = useState('');

  // Fetch all products
  const fetchAllProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch(`${GETPRODUCTS}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && Array.isArray(data) && data.length > 0) {
        const productOptions = data.map((product) => ({
          value: product.id,
          label: `${product?.productId || ''} - ${product?.barcode || ''}`,
          price: product?.retailMrp || 0,
          wholesalePrice: product?.wholesalePrice || product?.retailMrp || 0,
          hsnCode: product?.hsnCode || {},
          obj: product,
          fromOrder: false,
        }));
        setAllProducts(productOptions);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch voucher data
  useEffect(() => {
    const fetchVoucherData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${EDIT_ENTRY_URL}/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch voucher data');
        }

        const data = await response.json();
        setVoucherData(data);
        await getLedger();
        await getLedgerIncome();
        await fetchAllProducts();

        // Set initial values from fetched data
        setInitialValues({
          recieptNumber: data.recieptNumber || '',
          date: data.date || new Date().toISOString().split('T')[0],
          ledgerId: data.ledgerId || '',
          narration: data.narration || '',
          amount: data.amount || 0,
          typeOfVoucher: data.typeOfVoucher || '',
          paymentDate: data.paymentDate || '',
          modeOfPayment: data.modeOfPayment || '',
          chequeNumber: data.chequeNumber || '',
          cardNumber: data.cardNumber || '',
          transactionId: data.transactionId || '',
          cashAmount: data.cashAmount || null,
          cashLedgerId: data.cashLedgerId || null,
          cardAmount: data.cardAmount || null,
          cardLedgerId: data.cardLedgerId || null,
          bankAmount: data.bankAmount || null,
          bankLedgerId: data.bankLedgerId || null,
          chequeAmount: data.chequeAmount || null,
          chequeLedgerId: data.chequeLedgerId || null,
          destinationLedgerId: data.destinationLedgerId || null,
          igstLedgerId: data.igstLedgerId || null,
          cgstLedgerId: data.cgstLedgerId || null,
          sgstLedgerId: data.sgstLedgerId || null,
          discountLedgerId: data.discountLedgerId || null,
          discountAmount: data.discountAmount || 0,
          roundOffLedgerId: data.roundOffLedgerId || null,
          roundOffAmount: data.roundOffAmount || 0,
          courrierLedgerId: data.courrierLedgerId || null,
          courrierAmount: data.courrierAmount || 0,
          totalAmount: data.totalAmount || 0,
          totalGst: data.totalGst || 0,
          totalCgst: data.totalCgst || 0,
          totalSgst: data.totalSgst || 0,
          totalIgst: data.totalIgst || 0,
          paymentReceivedType: data.paymentReceivedType || '',
          amountReceived: data.amountReceived || 0,
          currency: data.currency || 'INR',
          currencyValue: data.currencyValue || 1,
          salesChannel: data.salesChannel || '',
          isExport: data.isExport || false,
          supplierInvoiceNumber: data.supplierInvoiceNumber || '',
          giftVoucherAmount: data.giftVoucherAmount || 0,
          giftVoucherLedgerId: data.giftVoucherLedgerId || null,
          toLedgerId: data.toLedgerId || null,
          currentBalance: data.currentBalance || '',
          currentBalance2: data.currentBalance2 || '',
          orderIds: data.orderIds || [],
          gstRegistration: data.gstRegistration || '',
          locationId: data.locationId || '',
          totalWithoutgst: data.totalWithoutgst || 0,
          isGiftVoucherUsed: data.isGiftVoucherUsed || false,
          customerNewDeliveryShippingAddress: data.customerNewDeliveryShippingAddress || '',
          customerNewDeliveryShippingState: data.customerNewDeliveryShippingState || '',
          totalDiscountPer: data.totalDiscountPer || null,
          remainingBalance: data.remainingBalance || 0,
          totalCurrencyValue: data.totalCurrencyValue || 0,
          paymentDetails: data.paymentDetails && data.paymentDetails.length > 0 
            ? data.paymentDetails.map(item => ({
                ...item,
                id: item.id || uuidv4(),
                gstCalculation: item.gstCalculation || null,
                // Ensure quantity is a number
                quantity: parseFloat(item.quantity) || 1,
                // Ensure mrp and wholesale are numbers
                mrp: parseFloat(item.mrp) || 0,
                wholesalePrice: parseFloat(item.wholesalePrice) || parseFloat(item.mrp) || 0,
                discount: parseFloat(item.discount) || 0,
                value: parseFloat(item.value) || 0,
              }))
            : [{
                id: uuidv4(),
                productsId: null,
                orderProductId: null,
                mrp: 0,
                basePrice: 0,
                rate: 0,
                exclusiveGst: 0,
                wholesalePrice: 0,
                discount: 0,
                quantity: 1,
                value: 0,
                voucherAmount: 0,
                igstRate: 0,
                gstAmount: 0,
                gstCalculation: null,
              }],
        });
      } catch (error) {
        console.error('Error fetching voucher:', error);
        toast.error('Failed to load voucher data');
        navigate('/vouchers');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVoucherData();
    }
  }, [id, token]);

  // Calculate GST - FIXED: This should calculate per unit, not per total quantity
  const calculateGST = (
    mrp,
    hsnCode,
    gstRegistration,
    customerAddress,
    discount = 0,
    customerState,
    isExport = false,
    wholesalePrice = null,
  ) => {
    if (isExport) {
      const basePrice = wholesalePrice || mrp;
      const discountAmount = discount > 0 ? (mrp * discount) / 100 : 0;
      const finalPrice = Math.max(basePrice - discountAmount, 0);
      
      if (typeof setgsttype === 'function') setgsttype('EXPORT');

      return {
        type: 'EXPORT',
        cgstRate: 0, sgstRate: 0, igstRate: 0,
        basePrice,
        wholesalePrice: wholesalePrice || mrp,
        cgstAmount: 0, sgstAmount: 0,
        gstAmount: 0, totalGstAmount: 0,
        finalPrice,
        inclusivePrice: finalPrice,
        originalMrp: mrp,
        discountedPrice: finalPrice,
        discountApplied: discount > 0,
        discountPercentage: discount,
        isSameState: false,
        stateName: 'Export',
        usedShippingState: 'export',
      };
    }

    const igstRate = hsnCode?.igst || 0;
    const cgstRate = hsnCode?.cgst || 0;
    const sgstRate = hsnCode?.sgst || 0;
    const totalGstRate = igstRate || cgstRate + sgstRate;
    const basePrice = mrp / (1 + totalGstRate / 100);
    
    let cgstAmount = 0, sgstAmount = 0, gstAmount = 0, totalGstAmount = 0;
    
    const registrationCode = String(gstRegistration || '').trim();
    const customerStateCode = String(customerState || '').trim();

    const getStateCode = (state) => {
      const stateStr = String(state || '').toLowerCase().trim();
      if (stateStr === '01' || stateStr.includes('jammu') || stateStr.includes('kashmir') || stateStr.includes('srinagar')) {
        return '01';
      }
      if (stateStr === '07' || stateStr.includes('delhi')) {
        return '07';
      }
      return stateStr;
    };

    const registrationStateCode = getStateCode(registrationCode);
    let customerStateToCompare = getStateCode(customerStateCode);

    const isSameState = registrationStateCode === customerStateToCompare &&
      (registrationStateCode === '01' || registrationStateCode === '07');

    if (isSameState) {
      cgstAmount = basePrice * (cgstRate / 100);
      sgstAmount = basePrice * (sgstRate / 100);
      totalGstAmount = cgstAmount + sgstAmount;
      
      if (typeof setgsttype === 'function') setgsttype('SGST+CGST');

      const discountedBasePrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
      const finalPrice = discountedBasePrice + totalGstAmount;

      return {
        type: 'CGST+SGST',
        cgstRate, sgstRate, igstRate: 0,
        basePrice,
        cgstAmount, sgstAmount, gstAmount: 0,
        totalGstAmount,
        finalPrice,
        originalMrp: mrp,
        discountedPrice: discountedBasePrice,
        discountApplied: discount > 0,
        discountPercentage: discount,
        isSameState: true,
        registrationStateCode,
        customerStateCode: customerStateToCompare,
        stateName: registrationStateCode === '01' ? 'Jammu And Kashmir' : 'Delhi',
      };
    } else {
      gstAmount = basePrice * (igstRate / 100);
      totalGstAmount = gstAmount;
      
      if (typeof setgsttype === 'function') setgsttype('IGST');

      const discountedBasePrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
      const finalPrice = discountedBasePrice + totalGstAmount;

      return {
        type: 'IGST',
        igstRate, cgstRate: 0, sgstRate: 0,
        basePrice,
        gstAmount, cgstAmount: 0, sgstAmount: 0,
        totalGstAmount,
        finalPrice,
        originalMrp: mrp,
        discountedPrice: discountedBasePrice,
        discountApplied: discount > 0,
        discountPercentage: discount,
        isSameState: false,
        registrationStateCode,
        customerStateCode: customerStateToCompare,
        stateName: 'Inter-State',
      };
    }
  };

  // Calculate line total - FIXED: Calculate properly with GST
  const calculateLineTotal = (entry) => {
    const quantity = parseFloat(entry.quantity) || 1;
    const discount = parseFloat(entry.discount) || 0;

    if (entry.gstCalculation?.type === 'EXPORT') {
      const wholesalePrice = parseFloat(entry.wholesalePrice) || parseFloat(entry.mrp) || 0;
      const mrp = parseFloat(entry.mrp) || wholesalePrice;
      const discountAmount = (mrp * discount) / 100;
      const discountedWholesale = wholesalePrice - discountAmount;
      const finalDiscounted = discountedWholesale > 0 ? discountedWholesale : 0;
      return (finalDiscounted * quantity).toFixed(2);
    }

    // For GST calculations, use the per-unit GST amount from gstCalculation
    const gstCalculation = entry.gstCalculation;
    if (!gstCalculation) {
      const mrp = parseFloat(entry.mrp) || 0;
      return (mrp * quantity).toFixed(2);
    }

    // Get per-unit values
    const basePrice = gstCalculation.basePrice || 0;
    const totalGstAmountPerUnit = gstCalculation.totalGstAmount || 0;
    
    // Calculate per-unit price with discount
    const discountedBasePrice = basePrice * (1 - discount / 100);
    
    // Total per unit including GST
    const totalPerUnit = discountedBasePrice + totalGstAmountPerUnit;
    
    // Multiply by quantity
    return (totalPerUnit * quantity).toFixed(2);
  };

  // Calculate totals - FIXED: Properly calculate all totals
  const calculateTotals = (values) => {
    let subtotal = 0, totalCGST = 0, totalSGST = 0, totalIGST = 0;
    let totalGST = 0, totalDiscount = 0, totalMRP = 0, totalQuantity = 0;
    let totalBasePrice = 0, totalDiscountedBasePrice = 0;

    values.paymentDetails.forEach((entry) => {
      console.log(entry,"l");
      
      const quantity = parseFloat(entry.quantity) || 1;
      const discount = parseFloat(entry.discount) || 0;
      const mrp = parseFloat(entry.mrp) || 0;
      const gstCalc = entry.mrp;

      if (!gstCalc) {
        totalMRP += mrp * quantity;
        totalQuantity += quantity;
        subtotal += mrp * quantity;
        return;
      }

      const basePrice = gstCalc || 0;
      console.log(basePrice,"11001");
      
      
      // Calculate per-unit discount amount
      const discountPerUnit = (basePrice * discount) / 100;
      const discountedBasePricePerUnit = basePrice - discountPerUnit;
      
      // GST per unit
      let cgstPerUnit = 0, sgstPerUnit = 0, igstPerUnit = 0;
      
      if (gstCalc.type === 'CGST+SGST') {
        cgstPerUnit = gstCalc.cgstAmount || 0;
        sgstPerUnit = gstCalc.sgstAmount || 0;
        totalCGST += cgstPerUnit * quantity;
        totalSGST += sgstPerUnit * quantity;
        totalGST += (cgstPerUnit + sgstPerUnit) * quantity;
      } else if (gstCalc.type === 'IGST') {
        igstPerUnit = gstCalc.gstAmount || 0;
        totalIGST += igstPerUnit * quantity;
        totalGST += igstPerUnit * quantity;
      }

      // Per unit total including GST
      const totalPerUnit = discountedBasePricePerUnit + (gstCalc.totalGstAmount || 0);
      
      // Line total
      const lineTotal = totalPerUnit * quantity;
      
      // Accumulate totals
      subtotal += lineTotal;
      totalMRP += mrp * quantity;
      totalQuantity += quantity;
      totalDiscount += discountPerUnit * quantity;
      totalBasePrice += basePrice * quantity;
      totalDiscountedBasePrice += discountedBasePricePerUnit * quantity;
    });

    return {
      subtotal: subtotal.toFixed(2),
      totalCGST: totalCGST.toFixed(2),
      totalSGST: totalSGST.toFixed(2),
      totalIGST: totalIGST.toFixed(2),
      totalGST: totalGST.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      grandTotal: subtotal.toFixed(2),
      totalMRP: totalMRP.toFixed(2),
      totalQuantity: totalQuantity,
      totalBasePrice: totalBasePrice.toFixed(2),
      totalDiscountedBasePrice: totalDiscountedBasePrice.toFixed(2),
    };
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${EDIT_ENTRY_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update voucher');
      }

      toast.success('Voucher updated successfully!');
      navigate('/vouchers');
    } catch (error) {
      console.error('Error updating voucher:', error);
      toast.error(error.message || 'Failed to update voucher');
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  // Get filtered ledgers
  const getFilteredLedgers = () => {
    if (!Ledger) return [];
    if (Vouchers?.typeOfVoucher?.toLowerCase() === 'purchase') {
      return Ledger.filter((ledg) => ledg?.ledgerType === 'SUPPLIER');
    } else if (Vouchers?.typeOfVoucher?.toLowerCase() === 'sales') {
      return Ledger.filter((ledg) => ledg?.ledgerType === 'CUSTOMER');
    } else {
      return Ledger;
    }
  };

  const LedgerData = getFilteredLedgers()?.map((ledg) => ({
    value: ledg?.id,
    label: ledg?.name,
    obj: ledg,
    balance: ledg?.openingBalances,
    type: ledg.ledgerType,
  }));

  // Get product value
  const getProductValue = (productId) => {
    if (!productId) return null;
    return allProducts.find(p => p.value === productId) || null;
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading voucher...</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (!initialValues) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-red-500">Voucher not found</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Edit Voucher" />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="bg-white dark:bg-boxdark rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/vouchers')}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Edit Voucher #{voucherData?.recieptNumber || id}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {voucherData?.typeOfVoucher || 'Voucher'} - Update product lines only
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  voucherData?.status === 'COMPLETED'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : voucherData?.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                {voucherData?.status || 'DRAFT'}
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="px-6 py-6">
            <Formik
              initialValues={initialValues}
              validationSchema={Yup.object().shape({
                recieptNumber: Yup.string().required('Voucher number is required'),
                ledgerId: Yup.string().required('Party account is required'),
              })}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ setFieldValue, values }) => {
                const totals = calculateTotals(values);
                
                return (
                  <Form>
                    {/* Read-Only Fields Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="col-span-3">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                          Voucher Information (Read-Only)
                        </h3>
                      </div>
                      
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                          Voucher Number
                        </label>
                        <Field
                          type="text"
                          name="recieptNumber"
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 py-2 px-3 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
                          disabled
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                          Date
                        </label>
                        <Field
                          type="text"
                          name="date"
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 py-2 px-3 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
                          disabled
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                          Party Account
                        </label>
                        <Field
                          type="text"
                          name="ledgerId"
                          value={LedgerData?.find(l => l.value === values.ledgerId)?.label || 'N/A'}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 py-2 px-3 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
                          disabled
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                          Type of Voucher
                        </label>
                        <Field
                          type="text"
                          name="typeOfVoucher"
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 py-2 px-3 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
                          disabled
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                          Sales Channel
                        </label>
                        <Field
                          type="text"
                          name="salesChannel"
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 py-2 px-3 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
                          disabled
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                          Currency
                        </label>
                        <Field
                          type="text"
                          name="currency"
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 py-2 px-3 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
                          disabled
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                          Narration
                        </label>
                        <Field
                          type="text"
                          name="narration"
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 py-2 px-3 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
                          disabled
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                          Amount
                        </label>
                        <Field
                          type="text"
                          name="amount"
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 py-2 px-3 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
                          disabled
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                          Mode of Payment
                        </label>
                        <Field
                          type="text"
                          name="modeOfPayment"
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 py-2 px-3 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
                          disabled
                        />
                      </div>

                      {values.modeOfPayment === 'Cheque' && (
                        <>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                              Cheque Number
                            </label>
                            <Field
                              type="text"
                              name="chequeNumber"
                              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 py-2 px-3 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
                              disabled
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                              Cheque Amount
                            </label>
                            <Field
                              type="text"
                              name="chequeAmount"
                              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 py-2 px-3 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
                              disabled
                            />
                          </div>
                        </>
                      )}

                      {values.modeOfPayment === 'Card' && (
                        <>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                              Card Number
                            </label>
                            <Field
                              type="text"
                              name="cardNumber"
                              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 py-2 px-3 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
                              disabled
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                              Card Amount
                            </label>
                            <Field
                              type="text"
                              name="cardAmount"
                              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 py-2 px-3 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
                              disabled
                            />
                          </div>
                        </>
                      )}

                      {values.modeOfPayment === 'Bank Transfer' && (
                        <>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                              Transaction ID
                            </label>
                            <Field
                              type="text"
                              name="transactionId"
                              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 py-2 px-3 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
                              disabled
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                              Bank Amount
                            </label>
                            <Field
                              type="text"
                              name="bankAmount"
                              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 py-2 px-3 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
                              disabled
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Products Section - Editable */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Products (Editable)
                      </h3>
                      <FieldArray name="paymentDetails">
                        {({ push, remove }) => (
                          <div>
                            <div className="overflow-x-auto">
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr className="bg-gray-100 dark:bg-gray-800">
                                    <th className="py-2 px-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300">#</th>
                                    <th className="py-2 px-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Product</th>
                                    <th className="w-[60px] py-2 px-6 text-left text-xs font-medium text-gray-700 dark:text-gray-300">MRP</th>
                                    <th className="py-2 px-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Wholesale</th>
                                    <th className="py-2 px-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Qty</th>
                                    <th className="py-2 px-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Discount %</th>
                                    <th className="py-2 px-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Total</th>
                                    <th className="py-2 px-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {values.paymentDetails.map((entry, index) => (
                                    <tr key={entry.id || index} className="border-b border-gray-200 dark:border-gray-700">
                                      <td className="py-2 px-2 text-sm">{index + 1}</td>
                                      <td className="py-2 px-2 min-w-[200px]">
                                        <ReactSelect
                                          name={`paymentDetails.${index}.productsId`}
                                          value={getProductValue(entry.productsId)}
                                          onChange={(option) => {
                                            if (!option) {
                                              setFieldValue(`paymentDetails.${index}.productsId`, null);
                                              setFieldValue(`paymentDetails.${index}.mrp`, 0);
                                              setFieldValue(`paymentDetails.${index}.wholesalePrice`, 0);
                                              setFieldValue(`paymentDetails.${index}.gstCalculation`, null);
                                              setFieldValue(`paymentDetails.${index}.value`, 0);
                                              return;
                                            }
                                            
                                            const mrp = option?.price || 0;
                                            const wholesalePrice = option?.wholesalePrice || mrp;
                                            const hsnCode = option?.hsnCode || {};
                                            const isExport = values.isExport || false;
                                            
                                            const gstCalculation = calculateGST(
                                              mrp, hsnCode, '',
                                              '', 0, '', isExport, wholesalePrice
                                            );

                                            setFieldValue(`paymentDetails.${index}.productsId`, option?.value);
                                            setFieldValue(`paymentDetails.${index}.mrp`, mrp);
                                            setFieldValue(`paymentDetails.${index}.wholesalePrice`, wholesalePrice);
                                            setFieldValue(`paymentDetails.${index}.gstCalculation`, gstCalculation);
                                            
                                            // Calculate line total with quantity
                                            const currentQuantity = parseFloat(entry.quantity) || 1;
                                            const currentDiscount = parseFloat(entry.discount) || 0;
                                            const lineTotal = calculateLineTotal({
                                              ...entry,
                                              mrp,
                                              wholesalePrice,
                                              gstCalculation,
                                              discount: currentDiscount,
                                              quantity: currentQuantity,
                                            });
                                            setFieldValue(`paymentDetails.${index}.value`, lineTotal);
                                          }}
                                          options={allProducts}
                                          placeholder="Select Product"
                                          className="react-select-container"
                                          classNamePrefix="react-select"
                                          menuPortalTarget={document.body}
                                          styles={{
                                            ...customStyles,
                                            menuPortal: (base) => ({ ...base, zIndex: 100000 }),
                                          }}
                                          isClearable
                                          isDisabled={loadingProducts}
                                        />
                                      </td>
                                      <td className="py-2 px-2">
                                        <Field
                                          type="number"
                                          name={`paymentDetails.${index}.mrp`}
                                          className="w-30 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 py-1 px-2 text-sm"
                                          readOnly
                                        />
                                      </td>
                                      <td className="py-2 px-2">
                                        <Field
                                          type="number"
                                          name={`paymentDetails.${index}.wholesalePrice`}
                                          className="w-30 rounded border border-gray-300 dark:border-gray-600 bg-transparent py-1 px-2 text-sm"
                                          onChange={(e) => {
                                            const value = parseFloat(e.target.value) || 0;
                                            setFieldValue(`paymentDetails.${index}.wholesalePrice`, value);
                                            const currentQuantity = parseFloat(entry.quantity) || 1;
                                            const currentDiscount = parseFloat(entry.discount) || 0;
                                            const lineTotal = calculateLineTotal({
                                              ...entry,
                                              wholesalePrice: value,
                                              quantity: currentQuantity,
                                              discount: currentDiscount,
                                            });
                                            setFieldValue(`paymentDetails.${index}.value`, lineTotal);
                                          }}
                                        />
                                      </td>
                                      <td className="py-2 px-2">
                                        <Field
                                          type="number"
                                          name={`paymentDetails.${index}.quantity`}
                                          className="w-26 rounded border border-gray-300 dark:border-gray-600 bg-transparent py-1 px-2 text-sm"
                                          min="1"
                                          onChange={(e) => {
                                            const value = parseFloat(e.target.value) || 1;
                                            setFieldValue(`paymentDetails.${index}.quantity`, value);
                                            const currentDiscount = parseFloat(entry.discount) || 0;
                                            const lineTotal = calculateLineTotal({
                                              ...entry,
                                              quantity: value,
                                              discount: currentDiscount,
                                            });
                                            setFieldValue(`paymentDetails.${index}.value`, lineTotal);
                                          }}
                                        />
                                      </td>
                                      <td className="py-2 px-2">
                                        <Field
                                          type="number"
                                          name={`paymentDetails.${index}.discount`}
                                          className="w-26 rounded border border-gray-300 dark:border-gray-600 bg-transparent py-1 px-2 text-sm"
                                          min="0"
                                          max="100"
                                          onChange={(e) => {
                                            const value = parseFloat(e.target.value) || 0;
                                            setFieldValue(`paymentDetails.${index}.discount`, value);
                                            
                                            const mrp = parseFloat(entry.mrp) || 0;
                                            const wholesalePrice = parseFloat(entry.wholesalePrice) || mrp;
                                            const hsnCode = {};
                                            const isExport = values.isExport || false;
                                            
                                            const gstCalculation = calculateGST(
                                              mrp, hsnCode, '',
                                              '', value, '', isExport, wholesalePrice
                                            );
                                            
                                            setFieldValue(`paymentDetails.${index}.gstCalculation`, gstCalculation);
                                            const currentQuantity = parseFloat(entry.quantity) || 1;
                                            const lineTotal = calculateLineTotal({
                                              ...entry,
                                              discount: value,
                                              gstCalculation,
                                              quantity: currentQuantity,
                                            });
                                            setFieldValue(`paymentDetails.${index}.value`, lineTotal);
                                          }}
                                        />
                                      </td>
                                      <td className="py-2 px-2 font-medium">
                                        <Field
                                          type="text"
                                          name={`paymentDetails.${index}.value`}
                                          className="w-30 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 py-1 px-2 text-sm"
                                          readOnly
                                        />
                                      </td>
                                      <td className="py-2 px-2">
                                        <button
                                          type="button"
                                          onClick={() => remove(index)}
                                          className="text-red-500 hover:text-red-700 transition-colors"
                                          disabled={values.paymentDetails.length === 1}
                                        >
                                          <FaTrash />
                                        </button>
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
                                wholesalePrice: 0,
                                discount: 0,
                                quantity: 1,
                                value: 0,
                                gstCalculation: null,
                              })}
                              className="mt-3 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm"
                            >
                              <FaPlus /> Add Product
                            </button>
                          </div>
                        )}
                      </FieldArray>
                    </div>

                    {/* Summary - FIXED: Shows complete breakdown */}
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Summary</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Total MRP</p>
                          <p className="text-lg font-bold text-gray-800 dark:text-white">₹{totals.totalMRP}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Total Discount</p>
                          <p className="text-lg font-bold text-red-500">-₹{totals.totalDiscount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Subtotal (excl. GST)</p>
                          <p className="text-lg font-bold text-gray-800 dark:text-white">₹{totals.totalDiscountedBasePrice}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Total GST</p>
                          <p className="text-lg font-bold text-green-600">₹{totals.totalGST}</p>
                        </div>
                        {parseFloat(totals.totalCGST) > 0 && (
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">CGST</p>
                            <p className="text-sm font-semibold text-blue-600">₹{totals.totalCGST}</p>
                          </div>
                        )}
                        {parseFloat(totals.totalSGST) > 0 && (
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SGST</p>
                            <p className="text-sm font-semibold text-blue-600">₹{totals.totalSGST}</p>
                          </div>
                        )}
                        {parseFloat(totals.totalIGST) > 0 && (
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">IGST</p>
                            <p className="text-sm font-semibold text-blue-600">₹{totals.totalIGST}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Grand Total</p>
                          <p className="text-lg font-bold text-primary">₹{totals.grandTotal}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                      >
                        {isSubmitting ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <FaSave className="text-sm" />
                            Update Voucher
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate('/vouchers')}
                        className="flex-1 py-3 px-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditVoucher;