import React, { useEffect, useState, useMemo, useRef } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ReactSelect from 'react-select';
import { IoMdAdd } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import Breadcrumb from '../../Breadcrumbs/Breadcrumb';
import useVoucher from '../../../hooks/useVoucher';
import {
  BASE_URL,
  GETPRODUCTS,
  GET_INVENTORYLOCATION,
  GET_VoucherNos_URL,
  customStyles as createCustomStyles,
} from '../../../Constants/utils';
import { useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import useLedger from '../../../hooks/useLedger';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Modalll from '../../Order/Modallll';

const CreateVoucherShopify = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigationState = location.state || {};
  const { customer, products, order, isNewCustomer } = navigationState;

  console.log(customer, '112233');

  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const { GetVoucherById, Vouchers, handleCreateVoucher } = useVoucher();
  const { getLedger, Ledger, getLedgerIncome, LedgerIncome } = useLedger();
  const theme = useSelector((state) => state?.persisted?.theme);
  const customStyles = createCustomStyles(theme?.mode);

  const [selectedLedger, setSelectedLedger] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [newShippingState, setNewShippingState] = useState('');
  const [regType, setRegType] = useState('');
  const [showGSTLedgers, setShowGSTLedgers] = useState(false);
  const [isCustModelOpen, setIsCustModelOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [openingBalanceType, setOpeningBalanceType] = useState('DEBIT');
  const [openingBalance, setOpeningBalance] = useState('');

  const [selectedInventoryData, setSelectedInventoryData] = useState([]);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);

  // ── Fetch voucher, ledgers, products ──
  useEffect(() => {
    GetVoucherById(id);
    getLedger();
    getLedgerIncome();
  }, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch(GETPRODUCTS, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok && Array.isArray(data.content)) {
          const productOptions = data.content.map((product) => ({
            value: product.id,
            label: `${product?.productId} - ${product.barcode}`,
            sku: product.productId,
            price: product?.retailMrp,
            hsnCode: product?.hsnCode || {},
            obj: product,
            fromOrder: false,
          }));
          setAllProducts(productOptions);
        }
      } catch (error) {
        console.error('Error fetching all products:', error);
      }
    };
    fetchAllProducts();
  }, [Vouchers?.typeOfVoucher]);

  // ── Memoized derived arrays ──
  const LedgerData = useMemo(() => {
    return (Ledger || [])
      .filter((ledg) => ledg?.ledgerType === 'CUSTOMER')
      .map((ledg) => ({
        value: ledg?.id,
        label: ledg?.name,
        obj: ledg,
        balance: ledg?.openingBalances,
        type: ledg.ledgerType,
      }));
  }, [Ledger]);

  const igstOptions = useMemo(() => {
    return (Ledger || [])
      .filter(
        (ledg) =>
          ledg?.name &&
          ledg.name.toLowerCase().includes('igst') &&
          !ledg.name.toLowerCase().includes('sale') &&
          !ledg.name.toLowerCase().includes('purchase'),
      )
      .map((ledg) => ({ value: ledg.id, label: ledg.name }));
  }, [Ledger]);

  const cgstOptions = useMemo(() => {
    return (Ledger || [])
      .filter(
        (ledg) =>
          ledg?.name &&
          ledg.name.toLowerCase().includes('cgst') &&
          !ledg.name.toLowerCase().includes('sale') &&
          !ledg.name.toLowerCase().includes('purchase'),
      )
      .map((ledg) => ({ value: ledg.id, label: ledg.name }));
  }, [Ledger]);

  const sgstOptions = useMemo(() => {
    return (Ledger || [])
      .filter(
        (ledg) =>
          ledg?.name &&
          ledg.name.toLowerCase().includes('sgst') &&
          !ledg.name.toLowerCase().includes('sale') &&
          !ledg.name.toLowerCase().includes('purchase'),
      )
      .map((ledg) => ({ value: ledg.id, label: ledg.name }));
  }, [Ledger]);

  const destinationLedgerOptions = useMemo(() => {
    return (LedgerIncome || []).map((ledg) => ({
      value: ledg?.id,
      label: ledg?.name,
    }));
  }, [LedgerIncome]);

  // ── Static options ──
  const salesChannelOptions = [
    { value: 'WS-Domestic', label: 'WS-Domestic' },
    { value: 'Websale', label: 'Websale' },
    { value: 'Social Media', label: 'Social Media' },
    { value: 'Shop-in-Shop', label: 'Shop-in-Shop' },
    { value: 'WS-International', label: 'WS-International' },
    { value: 'Event-International', label: 'Event-International' },
    { value: 'Event-Domestic', label: 'Event-Domestic' },
    { value: 'Retail-Delhi', label: 'Retail-Delhi' },
    { value: 'Retail-SXR', label: 'Retail-SXR' },
  ];

  const stateOption = [
    { value: '01', label: 'Jammu & Kashmir' },
    { value: '02', label: 'Himachal Pradesh' },
    { value: '03', label: 'Punjab' },
    { value: '04', label: 'Chandigarh' },
    { value: '05', label: 'Uttarakhand' },
    { value: '06', label: 'Haryana' },
    { value: '07', label: 'Delhi' },
    { value: '08', label: 'Rajasthan' },
    { value: '09', label: 'Uttar Pradesh' },
    { value: '10', label: 'Bihar' },
    { value: '11', label: 'Sikkim' },
    { value: '12', label: 'Arunachal Pradesh' },
    { value: '13', label: 'Nagaland' },
    { value: '14', label: 'Manipur' },
    { value: '15', label: 'Mizoram' },
    { value: '16', label: 'Tripura' },
    { value: '17', label: 'Meghalaya' },
    { value: '18', label: 'Assam' },
    { value: '19', label: 'West Bengal' },
    { value: '20', label: 'Jharkhand' },
    { value: '21', label: 'Odisha' },
    { value: '22', label: 'Chhattisgarh' },
    { value: '23', label: 'Madhya Pradesh' },
    { value: '24', label: 'Gujarat' },
    { value: '25', label: 'Daman & Diu' },
    { value: '26', label: 'Dadra & Nagar Haveli' },
    { value: '27', label: 'Maharashtra' },
    { value: '28', label: 'Andhra Pradesh' },
    { value: '29', label: 'Karnataka' },
    { value: '30', label: 'Goa' },
    { value: '31', label: 'Lakshadweep' },
    { value: '32', label: 'Kerala' },
    { value: '33', label: 'Tamil Nadu' },
    { value: '34', label: 'Puducherry' },
    { value: '35', label: 'Andaman & Nicobar Islands' },
    { value: '36', label: 'Telangana' },
    { value: '37', label: 'Andhra Pradesh (New)' },
    { value: '38', label: 'Ladakh' },
  ];

  // ── Helper Functions ──
  const calculateGST = (
    mrp,
    hsnCode,
    gstRegistration,
    customerAddress,
    discount = 0,
    customerState,
  ) => {
    const igstRate = hsnCode?.igst || 0;
    const cgstRate = hsnCode?.cgst || 0;
    const sgstRate = hsnCode?.sgst || 0;
    const totalGstRate = igstRate || cgstRate + sgstRate;
    const basePrice = mrp / (1 + totalGstRate / 100);

    const registrationCode = String(gstRegistration || '').trim();
    const customerStateCode = String(customerState || '').trim();
    const shippingStateCode = newShippingState
      ? String(newShippingState).trim()
      : null;
    const getStateCode = (state) => {
      const s = String(state || '')
        .toLowerCase()
        .trim();
      if (s === '01' || s.includes('jammu') || s.includes('kashmir'))
        return '01';
      if (s === '07' || s.includes('delhi')) return '07';
      return s;
    };
    const regState = getStateCode(registrationCode);
    const custState = shippingStateCode
      ? getStateCode(shippingStateCode)
      : getStateCode(customerStateCode);
    const isSameState =
      regState === custState && (regState === '01' || regState === '07');

    let cgstAmount = 0,
      sgstAmount = 0,
      gstAmount = 0,
      totalGstAmount = 0;
    let type = '';

    if (isSameState) {
      cgstAmount = basePrice * (cgstRate / 100);
      sgstAmount = basePrice * (sgstRate / 100);
      totalGstAmount = cgstAmount + sgstAmount;
      type = 'CGST+SGST';
    } else {
      gstAmount = basePrice * (igstRate / 100);
      totalGstAmount = gstAmount;
      type = 'IGST';
    }

    const discountedBasePrice =
      discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
    const finalPrice = discountedBasePrice + totalGstAmount;

    return {
      type,
      cgstRate,
      sgstRate,
      igstRate,
      basePrice,
      cgstAmount,
      sgstAmount,
      gstAmount,
      totalGstAmount,
      finalPrice,
      discountApplied: discount > 0,
      discountPercentage: discount,
      isSameState,
    };
  };

  const calculateLineTotal = (entry) => {
    const basePrice = entry.gstCalculation?.basePrice || 0;
    const discount = entry.discount || 0;
    const quantity = entry.quantity || 1;
    const discountedBasePrice = basePrice * (1 - discount / 100);
    const gstAmount = (entry.gstCalculation?.totalGstAmount || 0) * quantity;
    return (discountedBasePrice * quantity + gstAmount).toFixed(2);
  };

  const calculateTotals = (values) => {
    let subtotal = 0,
      totalCGST = 0,
      totalSGST = 0,
      totalIGST = 0,
      totalGST = 0,
      totalDiscount = 0,
      totalMRP = 0,
      totalQuantity = 0,
      totalBasePrice = 0;

    values.paymentDetails.forEach((entry) => {
      const basePrice = entry.gstCalculation?.basePrice || 0;
      const discount = entry.discount || 0;
      const quantity = entry.quantity || 1;
      const discountedBasePrice = basePrice * (1 - discount / 100);
      const baseTotal = basePrice * quantity;
      const discountAmount = ((basePrice * discount) / 100) * quantity;
      totalBasePrice += baseTotal;
      totalDiscount += discountAmount;
      totalMRP += (entry.mrp || 0) * quantity;
      totalQuantity += quantity;

      if (entry.gstCalculation) {
        const gst = entry.gstCalculation;
        if (gst.type === 'CGST+SGST') {
          totalCGST += (gst.cgstAmount || 0) * quantity;
          totalSGST += (gst.sgstAmount || 0) * quantity;
          totalGST += (gst.cgstAmount + gst.sgstAmount) * quantity;
        } else if (gst.type === 'IGST') {
          totalIGST += (gst.gstAmount || 0) * quantity;
          totalGST += (gst.gstAmount || 0) * quantity;
        }
      }
      subtotal +=
        (discountedBasePrice + (entry.gstCalculation?.totalGstAmount || 0)) *
        quantity;
    });

    return {
      subtotal: subtotal.toFixed(2),
      totalCGST: totalCGST.toFixed(2),
      totalSGST: totalSGST.toFixed(2),
      totalIGST: totalIGST.toFixed(2),
      totalGST: totalGST.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      totalMRP: totalMRP.toFixed(2),
      totalQuantity,
      totalBasePrice: totalBasePrice.toFixed(2),
    };
  };

  // ── Inventory modal ──
  const openInventoryModal = async (productId) => {
    if (!productId) return;
    try {
      const response = await fetch(`${GET_INVENTORYLOCATION}/${productId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setSelectedInventoryData(data);
      setIsInventoryModalOpen(true);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch inventory');
    }
  };

  // ── Formik setup ──
  const validationSchema = Yup.object({
    recieptNumber: Yup.string().required('Voucher number is required'),
    ledgerId: Yup.string().required('Customer is required'),
  });
  console.log(Vouchers, 'kk');

  const initialValues = {
    recieptNumber: '',
    date: new Date().toISOString().split('T')[0],
    voucherId: Number(id),
    ledgerId: '',
    // orderIds: [],
    locationId: Vouchers?.defGstRegist?.id,
    destinationLedgerId: '',
    currentBalance: 0,
    narration: '',
    salesChannel: '',
    isExport: customer.country?.toLowerCase() !== 'india' ? true : false,
    igstLedgerId: null,
    cgstLedgerId: null,
    sgstLedgerId: null,
    totalAmount: 0,
    totalIgst: 0,
    totalCgst: 0,
    totalSgst: 0,
    totalGst: 0,
    totalWithoutgst: 0,
    paymentDetails:
      products && products.length > 0
        ? products.map((prod) => ({
            id: uuidv4(),
            productsId: prod.sku || null,
            // orderProductId: prod.sku,
            mrp: prod.price || 0,
            basePrice: 0,
            rate: prod.price || 0,
            exclusiveGst: prod.price || 0,
            discount: 0,
            quantity: prod.quantity || 1,
            value: (prod.price || 0) * (prod.quantity || 1),
            igstRate: 0,
            gstAmount: 0,
            gstCalculation: null,
          }))
        : [
            {
              // id: uuidv4(),
              productsId: null,
              // orderProductId: null,
              mrp: 0,
              basePrice: 0,
              rate: 0,
              exclusiveGst: 0,
              discount: 0,
              quantity: 1,
              value: 0,
              igstRate: 0,
              gstAmount: 0,
              gstCalculation: null,
            },
          ],
  };

  // ── Render ──
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Create Sales Voucher" />
      <Formik
        initialValues={initialValues}
        enableReinitialize={false}
        validationSchema={validationSchema}
        onSubmit={handleCreateVoucher}
      >
        {({ isSubmitting, setFieldValue, values }) => {
          const totals = calculateTotals(values);

          useEffect(() => {
            if (Vouchers?.defGstRegist?.id) {
              setFieldValue('locationId', Vouchers.defGstRegist.id);
            }
          }, [Vouchers?.defGstRegist?.id]);

          // ── Fetch voucher number ──
          useEffect(() => {
            const fetchVoucherNo = async () => {
              try {
                const response = await fetch(`${GET_VoucherNos_URL}/${id}`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                });
                const data = await response.json();
                if (response.ok && data?.nextReceipt) {
                  setFieldValue('recieptNumber', String(data.nextReceipt));
                }
              } catch (error) {
                console.error('Error fetching voucher number:', error);
              }
            };
            fetchVoucherNo();
          }, []);

          // ── Auto‑select customer from navigation ──
          useEffect(() => {
            if (customer && LedgerData.length > 0) {
              const matched = LedgerData.find(
                (ledg) =>
                  ledg.label?.toLowerCase() === customer.name?.toLowerCase() ||
                  ledg.value === customer.id,
              );
              if (matched) {
                setFieldValue('ledgerId', matched.value);
                setFieldValue('currentBalance', matched.balance || 0);
                setSelectedLedger(matched);
                setRegType(matched.obj?.registrationType || '');
                if (matched.obj?.shippingState) {
                  setNewShippingState(matched.obj.shippingState);
                }
              }
            }
          }, [customer, LedgerData]);

          // ── Auto‑select destination ledger ──
          useEffect(() => {
            if (Vouchers?.defGstRegist && destinationLedgerOptions.length > 0) {
              const regState = Vouchers.defGstRegist.state?.toLowerCase() || '';
              const isSXR =
                regState.includes('jammu') || regState.includes('kashmir');
              const location = isSXR ? 'SXR' : 'Delhi';
              const base = 'Sale';
              let ledgerType = '';
              if (values.isExport) {
                ledgerType = `${base} Export`;
              } else if (newShippingState) {
                const shipState = newShippingState === '01' ? 'SXR' : 'Delhi';
                ledgerType =
                  shipState === location
                    ? `${base} Local-${location}`
                    : `${base} IGST-${location}`;
              } else {
                ledgerType = `${base} IGST-${location}`;
              }
              const matched = destinationLedgerOptions.find((opt) =>
                opt.label?.toLowerCase().includes(ledgerType.toLowerCase()),
              );
              if (matched && matched.value !== values.destinationLedgerId) {
                setFieldValue('destinationLedgerId', matched.value);
              }
            }
          }, [
            Vouchers?.defGstRegist,
            values.isExport,
            newShippingState,
            destinationLedgerOptions,
          ]);

          // ── Auto‑select GST ledgers ──
          useEffect(() => {
            if (Vouchers?.defGstRegist) {
              const regState = Vouchers.defGstRegist.state?.toLowerCase() || '';
              const isSXR =
                regState.includes('jammu') || regState.includes('kashmir');
              const location = isSXR ? 'sxr' : 'delhi';
              const partyState =
                newShippingState === '01'
                  ? 'sxr'
                  : newShippingState === '07'
                  ? 'delhi'
                  : null;
              const isSameState = partyState && location === partyState;

              let igst = null,
                cgst = null,
                sgst = null;
              if (values.isExport) {
                // No GST
              } else if (isSameState) {
                cgst =
                  cgstOptions.find(
                    (opt) =>
                      opt.label.toLowerCase().includes('cgst') &&
                      !opt.label.toLowerCase().includes('input') &&
                      opt.label.toLowerCase().includes(location),
                  ) ||
                  cgstOptions.find(
                    (opt) =>
                      opt.label.toLowerCase().includes('cgst') &&
                      !opt.label.toLowerCase().includes('input'),
                  );
                sgst =
                  sgstOptions.find(
                    (opt) =>
                      opt.label.toLowerCase().includes('sgst') &&
                      !opt.label.toLowerCase().includes('input') &&
                      opt.label.toLowerCase().includes(location),
                  ) ||
                  sgstOptions.find(
                    (opt) =>
                      opt.label.toLowerCase().includes('sgst') &&
                      !opt.label.toLowerCase().includes('input'),
                  );
              } else {
                igst =
                  igstOptions.find(
                    (opt) =>
                      opt.label.toLowerCase().includes('igst') &&
                      !opt.label.toLowerCase().includes('input') &&
                      opt.label.toLowerCase().includes(location),
                  ) ||
                  igstOptions.find(
                    (opt) =>
                      opt.label.toLowerCase().includes('igst') &&
                      !opt.label.toLowerCase().includes('input'),
                  );
              }
              if (igst && igst.value !== values.igstLedgerId)
                setFieldValue('igstLedgerId', igst.value);
              if (cgst && cgst.value !== values.cgstLedgerId)
                setFieldValue('cgstLedgerId', cgst.value);
              if (sgst && sgst.value !== values.sgstLedgerId)
                setFieldValue('sgstLedgerId', sgst.value);
            }
          }, [Vouchers?.defGstRegist, newShippingState, values.isExport]);

          // ── Update totals ──
          // useEffect(() => {
          //   setFieldValue('totalAmount', totals.subtotal);
          //   setFieldValue('totalGst', totals.totalGST);
          //   setFieldValue('totalCgst', totals.totalCGST);
          //   setFieldValue('totalIgst', totals.totalIGST);
          //   setFieldValue('totalSgst', totals.totalSGST);
          //   setFieldValue(
          //     'totalWithoutgst',
          //     (
          //       parseFloat(totals.totalBasePrice) -

          //       parseFloat(totals.totalDiscount)
          //     ).toFixed(2),
          //   );
          // }, [totals]); // 👈 add dependency on totals
          useEffect(() => {
            const newTotals = calculateTotals(values);
            setFieldValue('totalAmount', newTotals.subtotal);
            setFieldValue('totalGst', newTotals.totalGST);
            setFieldValue('totalCgst', newTotals.totalCGST);
            setFieldValue('totalIgst', newTotals.totalIGST);
            setFieldValue('totalSgst', newTotals.totalSGST);
            setFieldValue(
              'totalWithoutgst',
              (
                parseFloat(newTotals.totalBasePrice) -
                parseFloat(newTotals.totalDiscount)
              ).toFixed(2),
            );
          }, [values.paymentDetails, calculateTotals]);

          console.log(allProducts, '411');

          const hasAutoFilled = useRef(false);

          useEffect(() => {
            if (
              products &&
              products.length > 0 &&
              allProducts.length > 0 &&
              !hasAutoFilled.current
            ) {
              values.paymentDetails.forEach((entry, index) => {
                // Try match by ID first
                let matchedOption = allProducts.find(
                  (opt) =>
                    normalizeString(opt.sku) ===
                      normalizeString(entry.productsId) ||
                    normalizeString(opt.label) ===
                      normalizeString(entry.productsId),
                );
                // If not, try by normalised label
                if (!matchedOption && entry.productsId) {
                  const normEntry = normalizeString(entry.productsId);
                  matchedOption = allProducts.find(
                    (opt) => normalizeString(opt.label) === normEntry,
                  );
                }

                if (matchedOption) {
                  const mrp = matchedOption.price || 0;
                  const hsnCode = matchedOption.hsnCode || {};
                  const gstCalc = calculateGST(
                    mrp,
                    hsnCode,
                    Vouchers?.defGstRegist?.state || '',
                    customer?.shippingAddress || '',
                    entry.discount || 0,
                    newShippingState || customer?.shippingState || '',
                  );

                  setFieldValue(
                    `paymentDetails.${index}.productsId`,
                    matchedOption.value,
                  );
                  setFieldValue(`paymentDetails.${index}.mrp`, mrp);
                  setFieldValue(
                    `paymentDetails.${index}.rate`,
                    gstCalc.finalPrice,
                  );
                  setFieldValue(
                    `paymentDetails.${index}.exclusiveGst`,
                    gstCalc.finalPrice,
                  );
                  setFieldValue(
                    `paymentDetails.${index}.gstCalculation`,
                    gstCalc,
                  );
                  setFieldValue(
                    `paymentDetails.${index}.gstAmount`,
                    gstCalc.totalGstAmount,
                  );
                  setFieldValue(
                    `paymentDetails.${index}.igstRate`,
                    hsnCode?.igst || 0,
                  );
                  const lineTotal = calculateLineTotal({
                    ...entry,
                    gstCalculation: gstCalc,
                    quantity: entry.quantity || 1,
                    discount: entry.discount || 0,
                  });
                  setFieldValue(`paymentDetails.${index}.value`, lineTotal);
                }
              });
              hasAutoFilled.current = true;
            }
          }, [
            allProducts,
            products,
            Vouchers?.defGstRegist,
            customer,
            newShippingState,
            setFieldValue,
            values.paymentDetails,
          ]);
          const normalizeString = (str) => {
            return String(str ?? '')
              .trim()
              .replace(/\s+/g, ' ')
              .toLowerCase();
          };
          return (
            <Form>
              <div className="flex flex-col gap-9">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                      {Vouchers?.name || 'Sales Voucher'}
                    </h3>
                  </div>

                  <div className="flex flex-col p-6.5">
                    {/* Top Row */}
                    <div className="flex flex-row gap-4 flex-wrap">
                      <div className="flex-2 max-w-[120px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Voucher Number
                        </label>
                        <Field
                          type="text"
                          name="recieptNumber"
                          placeholder="Enter No"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white"
                        />
                        <ErrorMessage
                          name="recieptNumber"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      <div className="flex-2 min-w-[150px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Date
                        </label>
                        <Field
                          name="date"
                          type="date"
                          className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white"
                        />
                        <ErrorMessage
                          name="date"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      <div className="flex-2 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Customer Account
                        </label>
                        <ReactSelect
                          name="ledgerId"
                          value={LedgerData.find(
                            (opt) => opt.value === values.ledgerId,
                          )}
                          onChange={(option) => {
                            setFieldValue('ledgerId', option?.value || '');
                            setFieldValue(
                              'currentBalance',
                              option?.balance || 0,
                            );
                            setSelectedLedger(option);
                            if (option?.obj?.shippingState) {
                              setNewShippingState(option.obj.shippingState);
                            }
                            setRegType(option?.obj?.registrationType || '');
                          }}
                          options={LedgerData}
                          className="react-select-container bg-white dark:bg-form-Field w-full"
                          classNamePrefix="react-select"
                          placeholder="Select Customer"
                          menuPortalTarget={document.body}
                          styles={{
                            ...customStyles,
                            menuPortal: (base) => ({ ...base, zIndex: 100000 }),
                          }}
                        />
                        <ErrorMessage
                          name="ledgerId"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                        <div
                          style={{ backgroundColor: '#333A48' }}
                          className="flex w-[150px] items-center gap-2 rounded-xl cursor-pointer mx-2 px-2 text-white mt-2 py-2 hover:bg-opacity-90 transition-colors"
                          onClick={() => setIsCustModelOpen(true)}
                        >
                          <IoMdAdd size={20} />
                          <span className="cursor-pointer text-sm">
                            Add Customer
                          </span>
                        </div>
                      </div>

                      {/* Customer Orders dropdown removed */}

                      <div className="flex-2 max-w-[120px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          GST Registration
                        </label>
                        <Field
                          name="gstRegistration"
                          value={Vouchers?.defGstRegist?.state || ''}
                          type="text"
                          readOnly
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white"
                        />
                      </div>

                      <div className="flex-2 min-w-[120px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Current Balance
                        </label>
                        <Field
                          type="text"
                          name="currentBalance"
                          readOnly
                          className="w-full bg-gray-100 dark:bg-slate-800 rounded border border-gray-300 py-3 px-5 text-black cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Second Row */}
                    <div className="flex flex-row gap-4 mt-4 flex-wrap">
                      <div className="flex-2 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Sales Channel
                        </label>
                        <ReactSelect
                          name="salesChannel"
                          value={salesChannelOptions.find(
                            (opt) => opt.value.toLowerCase() === 'websale',
                          )}
                          onChange={(opt) =>
                            setFieldValue('salesChannel', opt.value)
                          }
                          options={salesChannelOptions}
                          styles={customStyles}
                          className="bg-white dark:bg-form-input"
                          classNamePrefix="react-select"
                          placeholder="Select"
                        />
                      </div>

                      <div className="flex-2 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Destination Ledger
                        </label>
                        <ReactSelect
                          name="destinationLedgerId"
                          value={destinationLedgerOptions.find(
                            (opt) => opt.value === values.destinationLedgerId,
                          )}
                          onChange={(opt) =>
                            setFieldValue(
                              'destinationLedgerId',
                              opt?.value || '',
                            )
                          }
                          options={destinationLedgerOptions}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          placeholder="Select Ledger"
                          menuPortalTarget={document.body}
                          styles={{
                            ...customStyles,
                            menuPortal: (base) => ({ ...base, zIndex: 100000 }),
                          }}
                        />
                      </div>

                      <div className="flex-2 min-w-[200px]">
                        <label className="block text-black dark:text-white">
                          Is Export
                        </label>
                        <div className="flex items-center gap-3 mt-2">
                          <Field
                            name="isExport"
                            type="checkbox"
                            className="h-5 w-5 rounded border-stroke bg-transparent text-primary focus:ring-primary dark:border-form-strokedark dark:bg-form-input"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {values.isExport ? 'Yes (Export)' : 'No (Domestic)'}
                          </span>
                        </div>
                      </div>

                      {/* Supply Location */}
                      <div
                        className="relative"
                        style={{
                          minHeight: values.isDeliveryDifferent
                            ? '200px'
                            : 'auto',
                        }}
                      >
                        <div className="flex flex-col gap-3 min-w-[250px]">
                          <label className="whitespace-nowrap text-black dark:text-white">
                            Supply Location
                          </label>
                          <div className="flex items-center gap-3">
                            <Field
                              type="checkbox"
                              name="isDeliveryDifferent"
                              className="h-5 w-5 rounded border-stroke bg-transparent text-primary focus:ring-primary dark:border-form-strokedark dark:bg-form-input"
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setFieldValue('isDeliveryDifferent', checked);
                                if (!checked) {
                                  setFieldValue(
                                    'customerNewDeliveryShippingAddress',
                                    '',
                                  );
                                  setFieldValue(
                                    'customerNewDeliveryShippingState',
                                    '',
                                  );
                                  setNewShippingState('');
                                }
                              }}
                            />
                          </div>
                        </div>
                        {values.isDeliveryDifferent && (
                          <div className="absolute left-0 right-0 top-[40px] z-20 mt-4 animate-fadeIn bg-white p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex flex-wrap gap-4">
                              <div className="flex-1 min-w-[200px]">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  New Delivery Address
                                </label>
                                <Field
                                  as="textarea"
                                  name="customerNewDeliveryShippingAddress"
                                  placeholder="Enter Delivery Address"
                                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white"
                                />
                              </div>
                              <div className="flex-1 min-w-[220px]">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  New Shipping State{' '}
                                  <span className="text-red-600">*</span>
                                </label>
                                <ReactSelect
                                  value={stateOptions.find(
                                    (opt) =>
                                      opt.value ===
                                      values.customerNewDeliveryShippingState,
                                  )}
                                  onChange={(opt) => {
                                    setFieldValue(
                                      'customerNewDeliveryShippingState',
                                      opt?.value || '',
                                    );
                                    setNewShippingState(opt?.value || '');
                                  }}
                                  options={stateOptions}
                                  styles={customStyles}
                                  className="bg-white dark:bg-form-input"
                                  classNamePrefix="react-select"
                                  placeholder="Select State"
                                  menuPortalTarget={document.body}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* GST Ledgers Collapsible */}
                    <div className="mt-4">
                      <div
                        className="flex items-center gap-2 cursor-pointer mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowGSTLedgers(!showGSTLedgers)}
                      >
                        {showGSTLedgers ? (
                          <FaChevronUp size={16} />
                        ) : (
                          <FaChevronDown size={16} />
                        )}
                        <span className="font-medium text-black dark:text-white">
                          GST Ledgers{' '}
                          {showGSTLedgers
                            ? '(Click to hide)'
                            : '(Click to show)'}
                          <span className="text-red-600">
                            {' '}
                            Important To Check These Ledgers Before Submit
                          </span>
                        </span>
                      </div>
                      {showGSTLedgers && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 mb-4">
                          <div>
                            <label className="mb-2.5 block text-black dark:text-white">
                              IGST Ledger
                            </label>
                            <ReactSelect
                              value={igstOptions.find(
                                (opt) => opt.value === values.igstLedgerId,
                              )}
                              onChange={(opt) =>
                                setFieldValue('igstLedgerId', opt?.value || '')
                              }
                              options={igstOptions}
                              placeholder="Select IGST"
                              styles={customStyles}
                              menuPortalTarget={document.body}
                            />
                          </div>
                          <div>
                            <label className="mb-2.5 block text-black dark:text-white">
                              CGST Ledger
                            </label>
                            <ReactSelect
                              value={cgstOptions.find(
                                (opt) => opt.value === values.cgstLedgerId,
                              )}
                              onChange={(opt) =>
                                setFieldValue('cgstLedgerId', opt?.value || '')
                              }
                              options={cgstOptions}
                              placeholder="Select CGST"
                              styles={customStyles}
                              menuPortalTarget={document.body}
                            />
                          </div>
                          <div>
                            <label className="mb-2.5 block text-black dark:text-white">
                              SGST Ledger
                            </label>
                            <ReactSelect
                              value={sgstOptions.find(
                                (opt) => opt.value === values.sgstLedgerId,
                              )}
                              onChange={(opt) =>
                                setFieldValue('sgstLedgerId', opt?.value || '')
                              }
                              options={sgstOptions}
                              placeholder="Select SGST"
                              styles={customStyles}
                              menuPortalTarget={document.body}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Products Table */}
                    <FieldArray name="paymentDetails">
                      {({ push, remove }) => (
                        <div className="mb-6 mt-4">
                          <div className="overflow-x-auto">
                            <table className="w-full table-fixed border-collapse">
                              <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                  <th className="w-[220px] py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300">
                                    Product
                                  </th>
                                  <th className="w-[120px] py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300">
                                    Inventory
                                  </th>
                                  <th className="w-[100px] py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300">
                                    Qty
                                  </th>
                                  <th className="w-[120px] py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300">
                                    MRP
                                  </th>
                                  <th className="w-[120px] py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300">
                                    Rate
                                  </th>
                                  <th className="w-[120px] py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300">
                                    Discount %
                                  </th>
                                  <th className="w-[150px] py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300">
                                    Total Value
                                  </th>
                                  <th className="w-[120px] py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300">
                                    GST Type
                                  </th>
                                  <th className="w-[80px] py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300">
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {values.paymentDetails.map((entry, index) => {
                                  const allAvailable = allProducts.filter(
                                    (p) =>
                                      !values.paymentDetails.some(
                                        (e, i) =>
                                          i !== index && e.sku === p.value,
                                      ),
                                  );
                                  return (
                                    <tr
                                      key={entry.id || index}
                                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                      <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                        <ReactSelect
                                          value={
                                            allProducts.find(
                                              (option) =>
                                                option.value ===
                                                values.paymentDetails[index]
                                                  .productsId,
                                            ) || null
                                          }
                                          onChange={(option) => {
                                            const mrp = option?.price || 0;
                                            const hsnCode =
                                              option?.hsnCode || {};
                                            const gstCalc = calculateGST(
                                              mrp,
                                              hsnCode,
                                              Vouchers?.defGstRegist?.state ||
                                                '',
                                              customer?.shippingAddress || '',
                                              entry.discount || 0,
                                              newShippingState ||
                                                customer?.shippingState ||
                                                '',
                                            );
                                            setFieldValue(
                                              `paymentDetails.${index}.productsId`,
                                              option?.value || null,
                                            );
                                            // setFieldValue(
                                            //   `paymentDetails.${index}.orderProductId`,
                                            //   option?.orderProdId || null,
                                            // );
                                            setFieldValue(
                                              `paymentDetails.${index}.mrp`,
                                              mrp,
                                            );
                                            setFieldValue(
                                              `paymentDetails.${index}.rate`,
                                              gstCalc.finalPrice,
                                            );
                                            setFieldValue(
                                              `paymentDetails.${index}.exclusiveGst`,
                                              gstCalc.finalPrice,
                                            );
                                            setFieldValue(
                                              `paymentDetails.${index}.gstCalculation`,
                                              gstCalc,
                                            );
                                            setFieldValue(
                                              `paymentDetails.${index}.gstAmount`,
                                              gstCalc.totalGstAmount,
                                            );
                                            setFieldValue(
                                              `paymentDetails.${index}.value`,
                                              calculateLineTotal({
                                                ...entry,
                                                gstCalculation: gstCalc,
                                              }),
                                            );
                                            setFieldValue(
                                              `paymentDetails.${index}.igstRate`,
                                              hsnCode?.igst || 0,
                                            );
                                          }}
                                          options={allAvailable}
                                          placeholder="Select Product"
                                          className="react-select-container w-[220px]"
                                          classNamePrefix="react-select"
                                          menuPortalTarget={document.body}
                                          styles={{
                                            ...customStyles,
                                            menuPortal: (base) => ({
                                              ...base,
                                              zIndex: 9999,
                                            }),
                                          }}
                                          isClearable
                                          isDisabled={!selectedLedger}
                                        />
                                        <ErrorMessage
                                          name={`paymentDetails.${index}.productsId`}
                                          component="div"
                                          className="text-red-500 text-xs mt-1"
                                        />
                                      </td>
                                      <td className="border-b border-[#eee] py-4 pl-3 dark:border-strokedark">
                                        <span
                                          onClick={() =>
                                            openInventoryModal(entry.productsId)
                                          }
                                          className="bg-green-100 text-green-800 text-[10px] font-medium py-0.5 pl-2 ml-5 rounded border border-green-400 cursor-pointer"
                                        >
                                          VIEW
                                        </span>
                                      </td>
                                      <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                        <Field
                                          type="number"
                                          name={`paymentDetails.${index}.quantity`}
                                          min="1"
                                          className="w-full py-2 px-3 text-sm rounded border focus:border-primary"
                                          onChange={(e) => {
                                            const qty =
                                              parseFloat(e.target.value) || 1;
                                            setFieldValue(
                                              `paymentDetails.${index}.quantity`,
                                              qty,
                                            );
                                            setFieldValue(
                                              `paymentDetails.${index}.value`,
                                              calculateLineTotal({
                                                ...entry,
                                                quantity: qty,
                                              }),
                                            );
                                          }}
                                        />
                                      </td>
                                      <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                        <Field
                                          type="number"
                                          name={`paymentDetails.${index}.mrp`}
                                          readOnly
                                          className="w-full bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm rounded border"
                                        />
                                      </td>
                                      <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                        <Field
                                          type="number"
                                          name={`paymentDetails.${index}.rate`}
                                          readOnly
                                          className="w-full bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm rounded border"
                                        />
                                      </td>
                                      <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                        <Field
                                          type="number"
                                          name={`paymentDetails.${index}.discount`}
                                          min="0"
                                          max="100"
                                          className="w-full py-2 px-3 text-sm rounded border focus:border-primary"
                                          value={
                                            entry.discount === 0
                                              ? ''
                                              : entry.discount
                                          }
                                          onChange={(e) => {
                                            let disc =
                                              parseFloat(e.target.value) || 0;
                                            if (disc > 100) disc = 100;
                                            setFieldValue(
                                              `paymentDetails.${index}.discount`,
                                              disc,
                                            );
                                            const mrp = entry.mrp || 0;
                                            const hsnCode = entry.hsnCode || {};
                                            const gstCalc = calculateGST(
                                              mrp,
                                              hsnCode,
                                              Vouchers?.defGstRegist?.state ||
                                                '',
                                              customer?.shippingAddress || '',
                                              disc,
                                              newShippingState ||
                                                customer?.shippingState ||
                                                '',
                                            );
                                            setFieldValue(
                                              `paymentDetails.${index}.gstCalculation`,
                                              gstCalc,
                                            );
                                            setFieldValue(
                                              `paymentDetails.${index}.gstAmount`,
                                              gstCalc.totalGstAmount,
                                            );
                                            setFieldValue(
                                              `paymentDetails.${index}.rate`,
                                              gstCalc.finalPrice,
                                            );
                                            setFieldValue(
                                              `paymentDetails.${index}.value`,
                                              calculateLineTotal({
                                                ...entry,
                                                gstCalculation: gstCalc,
                                                discount: disc,
                                              }),
                                            );
                                          }}
                                        />
                                      </td>
                                      <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark font-medium">
                                        <Field
                                          type="number"
                                          name={`paymentDetails.${index}.value`}
                                          value={(() => {
                                            const bp =
                                              entry.gstCalculation?.basePrice ||
                                              0;
                                            const disc = entry.discount || 0;
                                            const qty = entry.quantity || 1;
                                            const gst =
                                              entry.gstCalculation
                                                ?.totalGstAmount || 0;
                                            return (
                                              bp * (1 - disc / 100) * qty +
                                              gst * qty
                                            ).toFixed(2);
                                          })()}
                                          readOnly
                                          className="w-full bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm rounded border"
                                        />
                                      </td>
                                      <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                        {entry.gstCalculation && (
                                          <span
                                            className={`text-xs font-medium px-2 py-1 rounded ${
                                              entry.gstCalculation.type ===
                                              'CGST+SGST'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-green-100 text-green-800'
                                            }`}
                                          >
                                            {entry.gstCalculation.type}
                                          </span>
                                        )}
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
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          {/* Add Row Buttons */}
                          <div className="flex items-center gap-4 mt-4">
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
                                  gstCalculation: null,
                                })
                              }
                              disabled={!selectedLedger}
                              className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                              <IoMdAdd size={20} /> Add Row
                            </button>
                            <span className="text-gray-400">|</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newIndex = values.paymentDetails.length;
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
                                  gstCalculation: null,
                                  isNewProduct: true,
                                });
                              }}
                              disabled={!selectedLedger}
                              className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                              <IoMdAdd size={20} /> Add New Product (Not in
                              Order)
                            </button>
                          </div>
                        </div>
                      )}
                    </FieldArray>

                    {/* GST Summary */}
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="text-lg font-semibold mb-3 text-black dark:text-white">
                        GST Summary
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Total (Excl. GST)
                          </p>
                          <p className="font-medium text-black dark:text-white">
                            ₹
                            {(
                              parseFloat(totals.totalBasePrice) -
                              parseFloat(totals.totalDiscount)
                            ).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Total Quantity
                          </p>
                          <p className="font-medium text-black dark:text-white">
                            {totals.totalQuantity}
                          </p>
                        </div>
                        {parseFloat(totals.totalCGST) > 0 && (
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">
                              CGST
                            </p>
                            <p className="font-medium text-black dark:text-white">
                              ₹{totals.totalCGST}
                            </p>
                          </div>
                        )}
                        {parseFloat(totals.totalSGST) > 0 && (
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">
                              SGST
                            </p>
                            <p className="font-medium text-black dark:text-white">
                              ₹{totals.totalSGST}
                            </p>
                          </div>
                        )}
                        {parseFloat(totals.totalIGST) > 0 && (
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">
                              IGST
                            </p>
                            <p className="font-medium text-black dark:text-white">
                              ₹{totals.totalIGST}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Total GST
                          </p>
                          <p className="font-medium text-black dark:text-white">
                            ₹{totals.totalGST}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Grand Total
                          </p>
                          <p className="font-bold text-black dark:text-white">
                            ₹{totals.subtotal}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Narration */}
                    <div className="mb-4">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Narration
                      </label>
                      <Field
                        as="textarea"
                        name="narration"
                        placeholder="Narration"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white"
                      />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-center mt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex md:w-[220px] w-[270px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center bg-primary md:p-2.5 font-medium md:text-sm text-white hover:bg-opacity-90"
                      >
                        {isSubmitting ? 'Saving...' : 'Create Voucher'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inventory Modal */}
              {isInventoryModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-95 flex justify-center items-center z-50">
                  <div className="bg-slate-100 rounded p-6 shadow-lg ml-[200px] w-[870px] h-[400px] mt-[60px] overflow-auto">
                    <div className="text-right">
                      <button
                        onClick={() => setIsInventoryModalOpen(false)}
                        className="text-red-500 text-xl font-bold"
                      >
                        &times;
                      </button>
                    </div>
                    <h2 className="text-2xl text-center mb-4 font-extrabold">
                      INVENTORY DETAILS
                    </h2>
                    <table className="min-w-full leading-normal">
                      <thead>
                        <tr className="bg-slate-300 dark:bg-slate-700 dark:text-white">
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            LOCATION
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            OPENING BALANCE
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            BRANCH TRANSFER (INWARDS)
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            BRANCH TRANSFER (OUTWARDS)
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            CLOSING BALANCE
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            PURCHASE
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            SALE
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            IN PROGRESS ORDERS
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInventoryData.map((row) => (
                          <tr key={row.id}>
                            <td className="px-2 py-2 border-b">
                              {row?.location?.address}
                            </td>
                            <td className="px-2 py-2 border-b">
                              {row.openingBalance}
                            </td>
                            <td className="px-2 py-2 border-b">
                              {row.branchTransferInwards}
                            </td>
                            <td className="px-2 py-2 border-b">
                              {row.branchTransferOutwards}
                            </td>
                            <td className="px-2 py-2 border-b">
                              {row.closingBalance}
                            </td>
                            <td className="px-2 py-2 border-b">
                              {row.purchase}
                            </td>
                            <td className="px-2 py-2 border-b">{row.sale}</td>
                            <td className="px-2 py-2 border-b">
                              {row.inProgressOrders}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Add Customer Modal */}
              {isCustModelOpen && (
                <Modalll
                  isOpen={isCustModelOpen}
                  onRequestClose={() => setIsCustModelOpen(false)}
                  className="modal mr-[200px] mt-[30px] mb-[50px] z-99999"
                  overlayClassName="modal-overlay"
                  width="800px"
                >
                  <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-slate-500 text-center text-xl dark:text-black">
                      Add New Customer
                    </h3>
                  </div>
                  <div className="p-4 max-h-[70vh] overflow-y-auto">
                    <div className="flex flex-row gap-4">
                      <div className="mb-4">
                        <label className="block text-black dark:text-white mb-2">
                          Customer Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={newCustomerName}
                          onChange={(e) => setNewCustomerName(e.target.value)}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white"
                          placeholder="Enter customer name"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Shipping Address{' '}
                          <span className="text-red-600">*</span>
                        </label>
                        <textarea
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          placeholder="Shipping Address"
                          rows="3"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Shipping State <span className="text-red-600">*</span>
                        </label>
                        <ReactSelect
                          value={
                            stateOptions.find(
                              (opt) => opt.value === shippingState,
                            ) || null
                          }
                          onChange={(opt) =>
                            setShippingState(opt ? opt.value : '')
                          }
                          options={stateOptions}
                          styles={customStyles}
                          className="bg-white dark:bg-form-input"
                          classNamePrefix="react-select"
                          placeholder="Select State"
                        />
                      </div>
                    </div>
                    <div className="mb-4 border-t border-stroke pt-4 dark:border-strokedark">
                      <h4 className="font-medium text-black dark:text-white mb-3">
                        Opening Balance
                      </h4>
                      <div className="flex items-center gap-4 mb-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="openingBalanceType"
                            value="DEBIT"
                            checked={openingBalanceType === 'DEBIT'}
                            onChange={(e) =>
                              setOpeningBalanceType(e.target.value)
                            }
                            className="h-4 w-4"
                          />
                          <span>Debit (DR)</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="openingBalanceType"
                            value="CREDIT"
                            checked={openingBalanceType === 'CREDIT'}
                            onChange={(e) =>
                              setOpeningBalanceType(e.target.value)
                            }
                            className="h-4 w-4"
                          />
                          <span>Credit (CR)</span>
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={openingBalance}
                          onChange={(e) => setOpeningBalance(e.target.value)}
                          placeholder="Amount"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white"
                        />
                        <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                          {openingBalanceType === 'CREDIT' ? 'Cr.' : 'Dr.'}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-300">
                      <button
                        type="button"
                        onClick={() => setIsCustModelOpen(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          toast.info('Add customer logic here');
                        }}
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600"
                        disabled={
                          !newCustomerName.trim() ||
                          !shippingAddress.trim() ||
                          !shippingState
                        }
                      >
                        Add Customer
                      </button>
                    </div>
                  </div>
                </Modalll>
              )}
            </Form>
          );
        }}
      </Formik>
    </DefaultLayout>
  );
};

export default CreateVoucherShopify;
