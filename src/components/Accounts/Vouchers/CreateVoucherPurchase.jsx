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
import { BASE_URL, GETPRODUCTBYSUPPLIER, GET_LEDGERSupplierId__URL, GET_VoucherNos_URL, customStyles as createCustomStyles } from '../../../Constants/utils';
import { useSelector } from 'react-redux';
import Modall from '../../Products/Modall';
import NumberingDetailsModal from './NumberingDetailsModal';
import { useLocation, useParams } from 'react-router-dom';
import useLedger from '../../../hooks/useLedger';
import { use } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';


const CreateVoucherPurchase = () => {
    const { id } = useParams();
    const location = useLocation();
    const [ledgerId, setledgerId] = useState(null)
    const [regType, setregType] = useState('')
    const [gsttype, setgsttype] = useState("")

    const [igstLedid, setigstLedid] = useState(null)
    const [cgstLedid, setcgstLedid] = useState(null)
    const [sgstLedid, setsgstLedid] = useState(null)

    const [newShippingState, setnewShippingState] = useState('')
    const [custaddress, setcustaddress] = useState('')
    const [openingbal, setopeningbal] = useState(0)
    const [showGSTLedgers, setShowGSTLedgers] = useState(false);
    const [destinationLedgerOptions, setDestinationLedgerOptions] = useState([]);

    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const { GetVoucherById, Vouchers, CreateVoucherEntry, handleCreateVoucher } = useVoucher();
    const [voucherNos, setvoucherNos] = useState([])
    const { getLedger, Ledger, getLedgerIncome, LedgerIncome } = useLedger();
    const theme = useSelector(state => state?.persisted?.theme);
    const customStyles = createCustomStyles(theme?.mode);

    const [selectedLedger, setSelectedLedger] = useState(null);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [availableOrders, setavailableOrders] = useState([])
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingOrders, setloadingOrders] = useState(false)

    // Destructure location state
    const {
        supplierName = '',
        supplierId = '',
        billStatus = '',
        billStatusId = '',
        orders = [],
        igst,
        cgst,
        sgst,
        ledgerIdd = null,
        totalBillAmount = 0,
        totalReceivedQty = 0,
        originalData = null
    } = location.state || {};










    // Get Ledger by ID
    const getLedgerId = async () => {
        try {
            const response = await fetch(`${GET_LEDGERSupplierId__URL}/${supplierId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            setledgerId(data?.id);
            setopeningbal(data?.openingBalances || 0)
            setregType(data?.registrationType || '')
            setcustaddress(data?.shippingState || '')
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Ledger");
        }
    }

    useEffect(() => {
        getLedgerId()
    }, [])

    useEffect(() => {
        GetVoucherById(id);
        getLedger();
        getLedgerIncome();
    }, []);

    // Filter ledgers for suppliers
    const getFilteredLedgers = () => {
        if (!Ledger) return [];
        return Ledger.filter(ledg => ledg?.supplier !== null);
    };



    const LedgerData = getFilteredLedgers()?.map(ledg => ({
        value: ledg?.id,
        label: ledg?.name,
        obj: ledg,
        balance: ledg?.openingBalances,
        type: ledg?.ledgerType,
        isSupplier: ledg?.supplier !== null
    }));

    // Destination Ledger Options
    const destinationLedger = LedgerIncome?.map(ledg => ({
        value: ledg?.id,
        label: ledg?.name,
    }));

    // GST Ledgers filtering
    const igstLedgers = Ledger.filter(ledg =>
        ledg?.name &&
        ledg.name.toLowerCase().includes('igst') &&
        !ledg.name.toLowerCase().includes('sale') &&
        !ledg.name.toLowerCase().includes('purchase')
    );

    const cgstLedgers = Ledger.filter(ledg =>
        ledg?.name &&
        ledg.name.toLowerCase().includes('cgst') &&
        !ledg.name.toLowerCase().includes('sale') &&
        !ledg.name.toLowerCase().includes('purchase')
    );

    const sgstLedgers = Ledger.filter(ledg =>
        ledg?.name &&
        ledg.name.toLowerCase().includes('sgst') &&
        !ledg.name.toLowerCase().includes('sale') &&
        !ledg.name.toLowerCase().includes('purchase')
    );

    const igstOptions = igstLedgers?.map(ledg => ({
        value: ledg?.id,
        label: ledg?.name,
    }));

    const cgstOptions = cgstLedgers?.map(ledg => ({
        value: ledg?.id,
        label: ledg?.name,
    }));

    const sgstOptions = sgstLedgers?.map(ledg => ({
        value: ledg?.id,
        label: ledg?.name,
    }));

    // Function to determine GST ledgers based on state and registration
    // Function to determine GST ledgers based on state and registration
    const determineGSTLedgers = (Vouchers, custAddress, isExport, newShippingState, values) => {
        const defGstRegist = Vouchers?.defGstRegist || '';
        const typeOfVoucher = Vouchers?.typeOfVoucher || '';

        // If regType is not "regular", no GST applicable
        if (regType?.toLowerCase() !== "regular") {

            return { igstLedgerId: null, cgstLedgerId: null, sgstLedgerId: null };
        }

        // If export, no GST
        if (isExport) {

            return { igstLedgerId: null, cgstLedgerId: null, sgstLedgerId: null };
        }

        // Determine registration location from GST registration
        const getRegistrationLocation = (gstReg) => {
            if (!gstReg) return null;
            const regLower = gstReg?.state?.toLowerCase() || gstReg?.toLowerCase() || '';

            if (regLower.includes('jammu') || regLower.includes('kashmir') || regLower.includes('j&k') || regLower.includes('jk') || regLower.includes('sxr')) {
                return 'sxr';
            } else if (regLower.includes('delhi') || regLower.includes('ncr') || regLower.includes('nct')) {
                return 'delhi';
            }
            return null;
        };

        // Get supplier state from selected ledger
        const getPartyState = () => {
            const selectedLedgerOption = LedgerData.find(opt => opt.value === values.ledgerId);


            if (selectedLedgerOption?.obj?.shippingState) {
                const state = selectedLedgerOption.obj.shippingState;

                if (state === '01') return 'sxr';
                if (state === '07') return 'delhi';
            }
            // Check from custaddress
            if (custAddress === '01') return 'sxr';
            if (custAddress === '07') return 'delhi';
            return null;
        };

        const registrationLocation = getRegistrationLocation(defGstRegist);
        const partyLocation = getPartyState();



        let igstLedgerId = null;
        let cgstLedgerId = null;
        let sgstLedgerId = null;

        // If no registration location, default logic
        if (!registrationLocation) {

            const anyIgst = igstOptions.find(opt =>
                opt.label.toLowerCase().includes('input') && opt.label.toLowerCase().includes('igst')
            );
            igstLedgerId = anyIgst?.value || null;
            return { igstLedgerId, cgstLedgerId, sgstLedgerId };
        }

        // If no party location, we can't determine - use IGST as fallback
        if (!partyLocation) {

            const anyIgst = igstOptions.find(opt =>
                opt.label.toLowerCase().includes('input') && opt.label.toLowerCase().includes('igst')
            );
            igstLedgerId = anyIgst?.value || null;
            return { igstLedgerId, cgstLedgerId, sgstLedgerId };
        }

        // Check if same state or different state
        if (registrationLocation === partyLocation) {
            // Same state transaction - CGST + SGST


            if (typeOfVoucher.toLowerCase() === "purchase") {
                let cgstState = null;
                let sgstState = null;

                if (registrationLocation === 'sxr') {
                    cgstState = cgstOptions.find(opt =>
                        opt.label.toLowerCase().includes('input') &&
                        opt.label.toLowerCase().includes('cgst') &&
                        (opt.label.toLowerCase().includes('sxr') ||
                            opt.label.toLowerCase().includes('j&k') ||
                            opt.label.toLowerCase().includes('jammu') ||
                            opt.label.toLowerCase().includes('kashmir'))
                    );

                    sgstState = sgstOptions.find(opt =>
                        opt.label.toLowerCase().includes('input') &&
                        opt.label.toLowerCase().includes('sgst') &&
                        (opt.label.toLowerCase().includes('sxr') ||
                            opt.label.toLowerCase().includes('j&k') ||
                            opt.label.toLowerCase().includes('jammu') ||
                            opt.label.toLowerCase().includes('kashmir'))
                    );
                } else {
                    cgstState = cgstOptions.find(opt =>
                        opt.label.toLowerCase().includes('input') &&
                        opt.label.toLowerCase().includes('cgst') &&
                        opt.label.toLowerCase().includes('delhi')
                    );

                    sgstState = sgstOptions.find(opt =>
                        opt.label.toLowerCase().includes('input') &&
                        opt.label.toLowerCase().includes('sgst') &&
                        opt.label.toLowerCase().includes('delhi')
                    );
                }

                // Fallback to any Input CGST/SGST if specific location not found
                if (!cgstState) {
                    cgstState = cgstOptions.find(opt =>
                        opt.label.toLowerCase().includes('input') && opt.label.toLowerCase().includes('cgst')
                    );
                }
                if (!sgstState) {
                    sgstState = sgstOptions.find(opt =>
                        opt.label.toLowerCase().includes('input') && opt.label.toLowerCase().includes('sgst')
                    );
                }

                cgstLedgerId = cgstState?.value || null;
                sgstLedgerId = sgstState?.value || null;
                setcgstLedid(cgstLedgerId);
                setsgstLedid(sgstLedgerId);

            }
        } else {
            // Different state transaction - IGST


            if (typeOfVoucher.toLowerCase() === "purchase") {
                let igstState = null;

                if (registrationLocation === 'sxr') {
                    igstState = igstOptions.find(opt =>
                        opt.label.toLowerCase().includes('input') &&
                        opt.label.toLowerCase().includes('igst') &&
                        (opt.label.toLowerCase().includes('sxr') ||
                            opt.label.toLowerCase().includes('j&k') ||
                            opt.label.toLowerCase().includes('jammu') ||
                            opt.label.toLowerCase().includes('kashmir'))
                    );
                } else {
                    igstState = igstOptions.find(opt =>
                        opt.label.toLowerCase().includes('input') &&
                        opt.label.toLowerCase().includes('igst') &&
                        opt.label.toLowerCase().includes('delhi')
                    );
                }

                // Fallback to any Input IGST
                if (!igstState) {
                    igstState = igstOptions.find(opt =>
                        opt.label.toLowerCase().includes('input') && opt.label.toLowerCase().includes('igst')
                    );
                }

                igstLedgerId = igstState?.value || null;
                setigstLedid(igstLedgerId);

            }
        }


        return { igstLedgerId, cgstLedgerId, sgstLedgerId };
    };

    // Function to determine Destination Ledger
    const determineDestinationLedger = (Vouchers, custAddress, isExport, destinationLedgerOptions, newShippingState, values) => {
        const typeOfVoucher = Vouchers?.typeOfVoucher?.toLowerCase() || '';
        const defGstRegist = Vouchers?.defGstRegist || '';

        // If regType is not "regular", use Purchase ledger without GST
        if (regType?.toLowerCase() !== "regular") {
            return destinationLedgerOptions?.find(opt =>
                opt.label?.toLowerCase().includes('purchase') &&
                !opt.label?.toLowerCase().includes('igst') &&
                !opt.label?.toLowerCase().includes('cgst') &&
                !opt.label?.toLowerCase().includes('sgst')
            )?.value || null;
        }

        // Get registration location
        const getRegistrationLocation = (gstReg) => {
            if (!gstReg) return null;
            const regLower = gstReg?.state?.toLowerCase() || gstReg?.toLowerCase() || '';

            if (regLower.includes('jammu') || regLower.includes('kashmir') || regLower.includes('j&k') || regLower.includes('jk') || regLower.includes('sxr')) {
                return 'sxr';
            } else if (regLower.includes('delhi') || regLower.includes('ncr') || regLower.includes('nct')) {
                return 'delhi';
            }
            return null;
        };

        const getPartyState = () => {
            const selectedLedgerOption = LedgerData.find(opt => opt.value === values.ledgerId);


            if (selectedLedgerOption?.obj?.shippingState) {
                const state = selectedLedgerOption?.obj?.shippingState;


                if (state === '01') return 'sxr';
                if (state === '07') return 'delhi';
            }
            if (custAddress === '01') return 'sxr';
            if (custAddress === '07') return 'delhi';
            return null;
        };

        const registrationLocation = getRegistrationLocation(defGstRegist);
        const partyLocation = getPartyState();



        const baseType = 'Purchase';

        if (isExport) {
            return destinationLedgerOptions?.find(opt =>
                opt.label?.toLowerCase().includes(`${baseType} Export`.toLowerCase())
            )?.value || null;
        }

        if (!registrationLocation) {
            return destinationLedgerOptions?.find(opt =>
                opt.label?.toLowerCase().includes(baseType.toLowerCase())
            )?.value || null;
        }

        if (registrationLocation === partyLocation && partyLocation) {
            // Same state - Purchase Local
            const localLedger = destinationLedgerOptions?.find(opt =>
                opt.label?.toLowerCase().includes(`${baseType} Local`.toLowerCase()) &&
                opt.label?.toLowerCase().includes(registrationLocation)
            );
            if (localLedger) return localLedger.value;

            // Fallback
            return destinationLedgerOptions?.find(opt =>
                opt.label?.toLowerCase().includes(baseType.toLowerCase()) &&
                opt.label?.toLowerCase().includes('local')
            )?.value || null;
        } else {
            // Different state - Purchase IGST
            const igstLedger = destinationLedgerOptions?.find(opt =>
                opt.label?.toLowerCase().includes(`${baseType} IGST`.toLowerCase()) &&
                opt.label?.toLowerCase().includes(registrationLocation)
            );
            if (igstLedger) return igstLedger.value;

            // Fallback
            return destinationLedgerOptions?.find(opt =>
                opt.label?.toLowerCase().includes(baseType.toLowerCase()) &&
                opt.label?.toLowerCase().includes('igst')
            )?.value || null;
        }
    };

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
                setvoucherNos(data);
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
        if (Vouchers?.id) {
            GetVoucherNos();
        }
    }, [Vouchers.id]);

    let lastvoucher = 0;
    if (voucherNos?.receipts?.length > 0) {
        lastvoucher = Number(voucherNos.receipts[voucherNos.receipts.length - 1]) || 0;
    }
    const nextVoucher = lastvoucher + 1;

    const handleOrderSelect = async (selectedValues) => {
        setAvailableProducts([]);
        if (!selectedValues || selectedValues.length === 0) return;

        try {
            const orderIdsParam = selectedValues.join(',');
            const response = await fetch(`${BASE_URL}/order/order-products/by-order-ids?orderIds=${orderIdsParam}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            const data = await response.json();



            if (response.ok && Array.isArray(data)) {
                const productOptions = data.map(prod => ({
                    value: prod.product.id,
                    orderProdId: prod.id,
                    label: prod.product.productId,
                    price: prod.product?.retailMrp,
                    hsnCode: prod.product?.hsnCode || '',
                    obj: prod
                }));
                setAvailableProducts(productOptions);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoadingProducts(false);
        }
    }

    useEffect(() => {
        handleOrderSelect()
    }, [orders])


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

    const calculateLineTotalForPur = (entry) => {
        const basePrice = entry.mrp || 0;
        const quantity = entry.quantity || 1;
        return (basePrice * quantity).toFixed(2);
    };

    const calculateTotals = (values) => {
        let totalBasePrice = 0;  // Total excluding GST (goes to Supplier Ledger)
        let totalGSTAmount = 0;  // Total GST amount (goes to GST Ledgers)
        let totalMRP = 0;        // Total including GST (goes to Destination Ledger)
        let totalQuantity = 0;
        let totalCGST = 0;
        let totalSGST = 0;
        let totalIGST = 0;

        values.paymentDetails.forEach(entry => {
            const quantity = entry.quantity || 1;
            const basePrice = entry.basePrice || entry.rate || entry.mrp || 0;
            const mrp = entry.mrp || 0;

            totalBasePrice += basePrice * quantity;
            totalMRP += mrp * quantity;
            totalQuantity += quantity;

            // GST amounts
            totalIGST += (entry.igstAmount || 0) * quantity;
            totalCGST += (entry.cgstAmount || 0) * quantity;
            totalSGST += (entry.sgstAmount || 0) * quantity;
            totalGSTAmount += (entry.igstAmount || 0) * quantity + (entry.cgstAmount || 0) * quantity + (entry.sgstAmount || 0) * quantity;
        });

        return {
            totalBasePrice: totalBasePrice.toFixed(2),  // For Supplier Ledger
            totalGSTAmount: totalGSTAmount.toFixed(2),  // For GST Ledgers
            totalMRP: totalMRP.toFixed(2),              // For Destination Ledger
            totalQuantity: totalQuantity,
            totalIGST: totalIGST.toFixed(2),
            totalCGST: totalCGST.toFixed(2),
            totalSGST: totalSGST.toFixed(2)
        };
    };

    const validationSchema = Yup.object().shape({
        recieptNumber: Yup.string().required('Voucher number is required'),
        supplierInvoiceNumber: Yup.string().required('Supplier invoice number is required'),
        date: Yup.date().required('Date is required'),
        ledgerId: Yup.string().required('Party account is required'),
    });


    console.log(orders, "0000000000");


    return (
        <DefaultLayout>
            <Breadcrumb pageName="Configurator/Create Voucher" />
            <div>
                <Formik
                    initialValues={{
                        recieptNumber: `${nextVoucher}`,
                        supplierInvoiceNumber: '',
                        date: new Date().toISOString().split('T')[0],
                        voucherId: Number(id),
                        ledgerId: ledgerId,
                        orderIds: orders && orders?.map(ord => ord?.orderId),
                        currentBalance: openingbal || 0,
                        gstRegistration: Vouchers?.defGstRegist?.state || "",
                        destinationLedgerId: null,
                        narration: "",
                        modeOfPayment: "",
                        igstLedgerId: igstLedid || null,
                        cgstLedgerId: cgstLedid || null,
                        sgstLedgerId: sgstLedid || null,
                        chequeNumber: "",
                        cardNumber: "",
                        transactionId: "",
                        isExport: false,
                        totalAmount: orders.reduce((total, order) => total + (order.totalAmount || 0), 0),
                        totalIgst: 0,

                        totalSgst: 0,
                        totalCgst: 0,
                        totalGst: 0,
                        paymentDetails: orders?.map(order => {

                            if (order && order.length > 0) {
                                return order.map(orderProduct => ({
                                    id: uuidv4(),
                                    productsId: orderProduct?.ProductIdString || null,
                                    orderProductId: orderProduct?.id || null,
                                    orderId: order?.orderId,
                                    mrp: orderProduct?.product?.retailMrp || 0,
                                    rate: orderProduct?.product?.retailMrp || 0,
                                    exclusiveGst: orderProduct?.product?.retailMrp || 0,
                                    discount: 0,
                                    quantity: orderProduct?.receivedQuantity || 1,
                                    value: (orderProduct?.product?.retailMrp || 0) * (orderProduct?.receivedQuantity || 1),
                                    voucherAmount: (orderProduct?.product?.retailMrp || 0) * (orderProduct?.receivedQuantity || 1),
                                    igstRate: order?.igst,
                                    cgstRate: order?.cgst,
                                    sgstRate: order?.sgst,
                                    gstAmount: 0,
                                    gstCalculation: null,
                                    productName: orderProduct.product?.productDescription
                                }));
                            }
                            return {
                                id: uuidv4(),
                                productsId: order.productId || null,
                                orderProductId: null,
                                productName: order?.ProductIdString || '',
                                orderId: order.orderId,
                                mrp: order.productCost || 0,
                                rate: order.productCost || 0,
                                igst: order?.Igst || 0,
                                cgst: order?.Cgst || 0,
                                sgst: order?.Sgst || 0,
                                exclusiveGst: order.productCost || 0,
                                discount: 0,
                                quantity: order.receivedQty || 1,
                                value: (order.productCost || 0) * (order.receivedQty || 1),
                                voucherAmount: order.totalAmount || 0,
                                igstRate: 0,
                                gstAmount: 0,
                                gstCalculation: null
                            };
                        }).filter(item => item.quantity > 0)
                    }}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        const totals = calculateTotals(values);

                        const payload = {
                            ...values,
                            // Amount to be credited to Supplier Ledger (Base Price excluding GST)
                            totalAmount: parseFloat(totals.totalBasePrice),
                            // Amount to be debited to Destination Ledger (MRP including GST)
                            destinationAmount: parseFloat(totals.totalMRP),
                            // GST amounts for respective ledgers
                            totalIgst: parseFloat(totals.totalIGST),
                            totalCgst: parseFloat(totals.totalCGST),
                            totalSgst: parseFloat(totals.totalSGST),
                            // GST rates
                            igstRate: values.paymentDetails[0]?.igstRate || 0,
                            cgstRate: values.paymentDetails[0]?.cgstRate || 0,
                            sgstRate: values.paymentDetails[0]?.sgstRate || 0
                        };

                        await handleCreateVoucher(payload, setSubmitting);
                    }}
                >
                    {({ isSubmitting, setFieldValue, values }) => {
                        const totals = calculateTotals(values);

                        // Recalculate GST when regType or isExport changes
                        useEffect(() => {
                            if (values.paymentDetails && values.paymentDetails.length > 0 && values.ledgerId) {
                                // Get registration and party locations
                                const defGstRegist = Vouchers?.defGstRegist || '';

                                const getRegistrationLocation = (gstReg) => {
                                    if (!gstReg) return null;
                                    const regLower = gstReg?.state?.toLowerCase() || gstReg?.toLowerCase() || '';
                                    if (regLower.includes('jammu') || regLower.includes('kashmir') || regLower.includes('j&k') || regLower.includes('jk') || regLower.includes('sxr')) {
                                        return 'sxr';
                                    } else if (regLower.includes('delhi') || regLower.includes('ncr') || regLower.includes('nct')) {
                                        return 'delhi';
                                    }
                                    return null;
                                };

                                const getPartyState = () => {
                                    const selectedLedgerOption = LedgerData.find(opt => opt.value === values.ledgerId);
                                    if (selectedLedgerOption?.obj?.shippingState) {
                                        const state = selectedLedgerOption.obj.shippingState;
                                        if (state === '01') return 'sxr';
                                        if (state === '07') return 'delhi';
                                    }
                                    if (custaddress === '01') return 'sxr';
                                    if (custaddress === '07') return 'delhi';
                                    return null;
                                };

                                const registrationLocation = getRegistrationLocation(defGstRegist);
                                const partyLocation = getPartyState();
                                const gstType = determineProductGSTType(registrationLocation, partyLocation);

                                values.paymentDetails.forEach((entry, index) => {
                                    const mrp = entry.mrp || 0;

                                    let igstRate = entry.igstRate || 0;
                                    let cgstRate = entry.cgstRate || 0;
                                    let sgstRate = entry.sgstRate || 0;

                                    // Create GST calculation object
                                    let gstCalculation = null;




                                    if (regType?.toLowerCase() === "regular" && !values.isExport) {
                                        if (gstType === 'IGST') {
                                            gstCalculation = {
                                                type: 'IGST',
                                                igstRate: igstRate,
                                                cgstRate: 0,
                                                sgstRate: 0,
                                                registrationLocation,
                                                partyLocation
                                            };
                                        } else {
                                            gstCalculation = {
                                                type: 'CGST+SGST',
                                                igstRate: 0,
                                                cgstRate: cgstRate,
                                                sgstRate: sgstRate,
                                                registrationLocation,
                                                partyLocation
                                            };
                                        }
                                    }

                                    const rateCalculation = calculatePurchaseRate(mrp, gstCalculation, regType, values.isExport);

                                    setFieldValue(`paymentDetails.${index}.basePrice`, rateCalculation.basePrice);
                                    setFieldValue(`paymentDetails.${index}.rate`, rateCalculation.basePrice);
                                    setFieldValue(`paymentDetails.${index}.gstCalculation`, gstCalculation);
                                    setFieldValue(`paymentDetails.${index}.igstAmount`, rateCalculation.igstAmount);
                                    setFieldValue(`paymentDetails.${index}.cgstAmount`, rateCalculation.cgstAmount);
                                    setFieldValue(`paymentDetails.${index}.sgstAmount`, rateCalculation.sgstAmount);
                                    setFieldValue(`paymentDetails.${index}.value`, rateCalculation.basePrice * (entry.quantity || 1));
                                    setFieldValue(`paymentDetails.${index}.voucherAmount`, rateCalculation.totalAmount * (entry.quantity || 1));
                                });
                            }
                        }, [regType, values.isExport]);

                        useEffect(() => {
                            if (Vouchers && Vouchers?.typeOfVoucher?.toLowerCase() === "purchase" && destinationLedger?.length > 0) {
                                const selectedValue = determineDestinationLedger(
                                    Vouchers,
                                    custaddress,
                                    values.isExport,
                                    destinationLedger,
                                    newShippingState,
                                    values
                                );
                                if (selectedValue && selectedValue !== values.destinationLedgerId) {
                                    setFieldValue('destinationLedgerId', selectedValue);
                                }
                            }
                        }, [Vouchers?.typeOfVoucher, Vouchers?.defGstRegist, values, custaddress, destinationLedger, values, regType]);

                        // Auto-select GST Ledgers
                        // Auto-select GST Ledgers
                        useEffect(() => {


                            if (!Vouchers || !values.ledgerId || !regType) {

                                return;
                            }

                            if (Vouchers?.typeOfVoucher?.toLowerCase() === "purchase" &&
                                Vouchers?.defGstRegist &&
                                regType === "regular") {

                                const { igstLedgerId, cgstLedgerId, sgstLedgerId } = determineGSTLedgers(
                                    Vouchers,
                                    custaddress,
                                    values.isExport,
                                    newShippingState,
                                    values
                                );



                                if (igstLedgerId && igstLedgerId !== values.igstLedgerId) {
                                    setFieldValue('igstLedgerId', igstLedgerId);
                                }
                                if (cgstLedgerId && cgstLedgerId !== values.cgstLedgerId) {
                                    setFieldValue('cgstLedgerId', cgstLedgerId);
                                }
                                if (sgstLedgerId && sgstLedgerId !== values.sgstLedgerId) {
                                    setFieldValue('sgstLedgerId', sgstLedgerId);
                                }
                            } else if (regType && regType?.toLowerCase() !== "regular") {

                                setFieldValue('igstLedgerId', null);
                                setFieldValue('cgstLedgerId', null);
                                setFieldValue('sgstLedgerId', null);
                            }
                        }, [Vouchers, regType, custaddress, newShippingState, values]);

                        useEffect(() => {
                            if (ledgerId && Vouchers?.typeOfVoucher?.toLowerCase() === "purchase") {
                                // This will trigger the GST useEffect above
                                setFieldValue('ledgerId', ledgerId);
                            }
                        }, [ledgerId]);
                        useEffect(() => {
                            setFieldValue('totalAmount', totals.subtotal);
                        }, [totals.subtotal, setFieldValue]);

                        const handleDestinationLedgerChange = (option) => {
                            setFieldValue('destinationLedgerId', option?.value || '');
                        };

                        const handleIgstLedgerChange = (option) => {
                            setFieldValue('igstLedgerId', option?.value || '');
                        };

                        const handleCgstLedgerChange = (option) => {
                            setFieldValue('cgstLedgerId', option?.value || '');
                        };

                        const handleSgstLedgerChange = (option) => {
                            setFieldValue('sgstLedgerId', option?.value || '');
                        };



                        // Function to calculate purchase rate based on MRP and GST
                        const calculatePurchaseRate = (mrp, gstCalculation, regType, isExport) => {

                            console.log(gstCalculation,"7788");
                            
                            // If not regular supplier or export, no GST - rate = MRP
                            if (regType?.toLowerCase() !== "regular" || isExport) {
                                return {
                                    basePrice: mrp,
                                    gstAmount: 0,
                                    totalAmount: mrp,
                                    cgstAmount: 0,
                                    sgstAmount: 0,
                                    igstAmount: 0,
                                    cgstRate: 0,
                                    sgstRate: 0,
                                    igstRate: 0
                                };
                            }
                            // console.log(gstCalculation, "555555552");


                            // For regular supplier with GST
                            if (gstCalculation?.type === 'IGST') {
                                // MRP is inclusive of GST, calculate base price (excluding GST)
                                const igstRate = gstCalculation.igstRate || 0;
                                const basePrice = mrp / (1 + (igstRate / 100));
                                const igstAmount = mrp - basePrice;

                                return {
                                    basePrice: basePrice,
                                    gstAmount: igstAmount,
                                    totalAmount: mrp,
                                    igstAmount: igstAmount,
                                    cgstAmount: 0,
                                    sgstAmount: 0,
                                    igstRate: igstRate,
                                    cgstRate: 0,
                                    sgstRate: 0
                                };
                            } else if (gstCalculation?.type === 'CGST+SGST') {
                                console.log("tahttt");
                                console.log(gstCalculation,"44444");
                                
                                
                                // MRP is inclusive of GST, calculate base price (excluding GST)
                                const cgstRate = gstCalculation.cgstRate || 0;
                                const sgstRate = gstCalculation.sgstRate || 0;
                                const totalGstRate = cgstRate + sgstRate;
                                const basePrice = mrp / (1 + (totalGstRate / 100));
                                const cgstAmount = basePrice * (cgstRate / 100);
                                const sgstAmount = basePrice * (sgstRate / 100);

                                return {
                                    basePrice: basePrice,
                                    gstAmount: cgstAmount + sgstAmount,
                                    totalAmount: mrp,
                                    igstAmount: 0,
                                    cgstAmount: cgstAmount,
                                    sgstAmount: sgstAmount,
                                    igstRate: 0,
                                    cgstRate: cgstRate,
                                    sgstRate: sgstRate
                                };
                            }

                            // Default - no GST calculation available
                            return {
                                basePrice: mrp,
                                gstAmount: 0,
                                totalAmount: mrp,
                                cgstAmount: 0,
                                sgstAmount: 0,
                                igstAmount: 0,
                                cgstRate: 0,
                                sgstRate: 0,
                                igstRate: 0
                            };
                        };

                        calculatePurchaseRate()

                        // Function to determine GST type for a product based on registration and party states
                        // Function to determine GST type for a product based on registration and party states
                        const determineProductGSTType = (registrationLocation, partyLocation) => {
                            if (!registrationLocation || !partyLocation) {
                                return 'IGST'; // Default to IGST if can't determine
                            }

                            if (registrationLocation === partyLocation) {
                                return 'CGST+SGST';
                            } else {
                                return 'IGST';
                            }
                        };
                        // Calculate GST for all products on initial load and when relevant dependencies change
                        useEffect(() => {


                            // Only run when we have all required data
                            if (!Vouchers || !values.ledgerId || !regType || !orders || orders.length === 0) {

                                return;
                            }

                            if (Vouchers?.typeOfVoucher?.toLowerCase() === "purchase") {
                                // Get registration and party locations
                                const defGstRegist = Vouchers?.defGstRegist || '';

                                const getRegistrationLocation = (gstReg) => {
                                    if (!gstReg) return null;
                                    const regLower = gstReg?.state?.toLowerCase() || gstReg?.toLowerCase() || '';
                                    if (regLower.includes('jammu') || regLower.includes('kashmir') || regLower.includes('j&k') || regLower.includes('jk') || regLower.includes('sxr')) {
                                        return 'sxr';
                                    } else if (regLower.includes('delhi') || regLower.includes('ncr') || regLower.includes('nct')) {
                                        return 'delhi';
                                    }
                                    return null;
                                };

                                const getPartyState = () => {
                                    const selectedLedgerOption = LedgerData.find(opt => opt.value === values.ledgerId);
                                    if (selectedLedgerOption?.obj?.shippingState) {
                                        const state = selectedLedgerOption.obj.shippingState;
                                        if (state === '01') return 'sxr';
                                        if (state === '07') return 'delhi';
                                    }
                                    if (custaddress === '01') return 'sxr';
                                    if (custaddress === '07') return 'delhi';
                                    return null;
                                };

                                const registrationLocation = getRegistrationLocation(defGstRegist);
                                const partyLocation = getPartyState();
                                const gstType = determineProductGSTType(registrationLocation, partyLocation);



                                // Loop through all paymentDetails and calculate GST for each
                                values.paymentDetails.forEach((entry, index) => {
                                    console.log(entry,"00000000000000.");
                                    
                                    const mrp = entry.mrp || 0;

                                    // Get HSN code and GST rates from the product
                                    let igstRate = 0, cgstRate = 0, sgstRate = 0;

                                    // Find the product in availableProducts or orders


                                    // Check if product has GST rates from order data
                                    igstRate = entry.igst || entry.igst || 0;
                                    cgstRate = entry.cgst || entry.cgst || 0;
                                    sgstRate = entry.sgst || entry.sgst || 0;

                                    console.log(igstRate, cgstRate, sgstRate, "444444444444444");

                                    // Create GST calculation object
                                    let gstCalculation = null;

                                    if (regType?.toLowerCase() === "regular" && !values.isExport) {
                                        if (gstType === 'IGST') {
                                            gstCalculation = {
                                                type: 'IGST',
                                                igstRate: igstRate,
                                                cgstRate: 0,
                                                sgstRate: 0,
                                                registrationLocation,
                                                partyLocation
                                            };
                                        } else {
                                            gstCalculation = {
                                                type: 'CGST+SGST',
                                                igstRate: 0,
                                                cgstRate: cgstRate,
                                                sgstRate: sgstRate,
                                                registrationLocation,
                                                partyLocation
                                            };
                                        }
                                    }

                                    // Calculate purchase rate
                                    const rateCalculation = calculatePurchaseRate(mrp, gstCalculation, regType, values.isExport);

                                    // Update form fields
                                    setFieldValue(`paymentDetails.${index}.basePrice`, rateCalculation.basePrice);
                                    setFieldValue(`paymentDetails.${index}.rate`, rateCalculation.basePrice);
                                    setFieldValue(`paymentDetails.${index}.gstCalculation`, gstCalculation);
                                    setFieldValue(`paymentDetails.${index}.igstAmount`, rateCalculation.igstAmount);
                                    setFieldValue(`paymentDetails.${index}.cgstAmount`, rateCalculation.cgstAmount);
                                    setFieldValue(`paymentDetails.${index}.sgstAmount`, rateCalculation.sgstAmount);
                                    setFieldValue(`paymentDetails.${index}.igstRate`, rateCalculation.igstRate);
                                    setFieldValue(`paymentDetails.${index}.cgstRate`, rateCalculation.cgstRate);
                                    setFieldValue(`paymentDetails.${index}.sgstRate`, rateCalculation.sgstRate);
                                    setFieldValue(`paymentDetails.${index}.value`, rateCalculation.basePrice * (entry.quantity || 1));
                                    setFieldValue(`paymentDetails.${index}.voucherAmount`, rateCalculation.totalAmount * (entry.quantity || 1));
                                });
                            }
                        }, [regType, values.ledgerId, Vouchers?.typeOfVoucher, orders, availableProducts, custaddress, values.isExport]);
                        // Function to determine GST type for a product based on registration and party states
                        // const determineProductGSTType = (registrationLocation, partyLocation) => {
                        //     if (!registrationLocation || !partyLocation) {
                        //         return 'IGST'; // Default to IGST if can't determine
                        //     }

                        //     if (registrationLocation === partyLocation) {
                        //         return 'CGST+SGST';
                        //     } else {
                        //         return 'IGST';
                        //     }
                        // };
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
                                            {/* Top Section */}
                                            <div className='flex flex-row gap-4 mb-6'>
                                                <div className="flex-2 min-w-[180px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Voucher Number</label>
                                                    <Field
                                                        type="text"
                                                        name="recieptNumber"
                                                        placeholder="Enter No"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                    />
                                                    <ErrorMessage name="recieptNumber" component="div" className="text-red-500" />
                                                </div>

                                                <div className="flex-2 min-w-[200px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Supplier Invoice Number</label>
                                                    <Field
                                                        type="text"
                                                        name="supplierInvoiceNumber"
                                                        placeholder="Enter No"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                    />
                                                    <ErrorMessage name="supplierInvoiceNumber" component="div" className="text-red-500" />
                                                </div>

                                                <div className="flex-2 min-w-[200px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Supplier Account</label>
                                                    <ReactSelect
                                                        name='ledgerId'
                                                        value={LedgerData.find(opt => opt.value === values.ledgerId)}
                                                        onChange={(option) => {
                                                            setFieldValue('ledgerId', option?.value || '');
                                                            setFieldValue('currentBalance', option?.balance || 0);
                                                            setregType(option?.obj?.registrationType || '');
                                                            setcustaddress(option?.obj?.shippingState || '');
                                                        }}
                                                        options={LedgerData}
                                                        className="react-select-container bg-white dark:bg-form-Field w-full"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Supplier"
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            ...customStyles,
                                                            menuPortal: (base) => ({ ...base, zIndex: 100000 })
                                                        }}
                                                    />
                                                    <ErrorMessage name="ledgerId" component="div" className="text-red-500 text-xs mt-1" />
                                                </div>

                                                <div className="flex-2 min-w-[200px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Orders</label>
                                                    <ReactSelect
                                                        name='orderIds'
                                                        value={orders && orders.map(ord => ({ value: ord.orderId, label: ord.orderNo }))}
                                                        onChange={(selectedOptions) => {
                                                            const selectedValues = selectedOptions?.map(option => option.value) || [];
                                                            setFieldValue('orderIds', selectedValues);
                                                            handleOrderSelect(selectedValues);
                                                        }}
                                                        options={orders && orders.map(ord => ({ value: ord.orderId, label: ord.orderNo }))}
                                                        isMulti={true}
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            ...customStyles,
                                                            menuPortal: (base) => ({ ...base, zIndex: 100000 })
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className='flex flex-row gap-4 mb-6'>
                                                <div className="flex-2 min-w-[180px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Current Balance</label>
                                                    <Field
                                                        type="text"
                                                        name="currentBalance"
                                                        placeholder="0.00"
                                                        readOnly
                                                        className="w-full bg-gray-100 dark:bg-slate-800 rounded border border-gray-300 py-3 px-5 text-black cursor-not-allowed"
                                                    />
                                                </div>

                                                <div className="flex-2 min-w-[180px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Date</label>
                                                    <Field
                                                        name="date"
                                                        type="date"
                                                        className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                    />
                                                    <ErrorMessage name="date" component="div" className="text-red-500" />
                                                </div>

                                                <div className="flex-2 min-w-[200px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Destination Ledger</label>
                                                    <ReactSelect
                                                        name='destinationLedgerId'
                                                        value={destinationLedger?.find(opt => opt.value === values.destinationLedgerId)}
                                                        onChange={handleDestinationLedgerChange}
                                                        options={destinationLedger}
                                                        className="react-select-container bg-white dark:bg-form-Field w-full"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Destination Ledger"
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            ...customStyles,
                                                            menuPortal: (base) => ({ ...base, zIndex: 100000 })
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex-2 min-w-[180px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">GST Registration</label>
                                                    <Field
                                                        name="gstRegistration"
                                                        type="text"
                                                        value={Vouchers?.defGstRegist?.state || ''}
                                                        readOnly
                                                        className="w-full rounded border-[1.5px] border-stroke bg-gray-100 dark:bg-slate-800 py-3 px-5 text-black cursor-not-allowed"
                                                    />
                                                </div>

                                                <div className="flex-2 min-w-[150px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Is Export</label>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <Field
                                                            name="isExport"
                                                            type="checkbox"
                                                            className="h-5 w-5 rounded border-stroke bg-transparent text-primary focus:ring-primary dark:border-form-strokedark dark:bg-form-input"
                                                        />
                                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                                            {values.isExport ? 'Yes' : 'No'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* GST Section - Only for Regular Suppliers */}
                                            {regType?.toLowerCase() === "regular" && (
                                                <div>
                                                    {/* <div
                                                        className="flex items-center gap-2 cursor-pointer mt-4 mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                        onClick={() => setShowGSTLedgers(!showGSTLedgers)}
                                                    >
                                                        {showGSTLedgers ? <FaChevronUp /> : <FaChevronDown />}
                                                        <span className="font-medium text-black dark:text-white">
                                                            GST Ledgers {showGSTLedgers ? '(Click to hide)' : '(Click to show)'}
                                                        </span>
                                                    </div> */}


                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 mb-4">
                                                        <div>
                                                            <label className="mb-2.5 block text-black dark:text-white">IGST Ledger</label>
                                                            <ReactSelect
                                                                value={igstOptions.find(opt => opt.value === values.igstLedgerId)}
                                                                onChange={handleIgstLedgerChange}
                                                                options={igstOptions}
                                                                placeholder="Select IGST Ledger"
                                                                menuPortalTarget={document.body}
                                                                styles={{ ...customStyles, menuPortal: (base) => ({ ...base, zIndex: 100000 }) }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="mb-2.5 block text-black dark:text-white">CGST Ledger</label>
                                                            <ReactSelect
                                                                value={(() => {
                                                                    const selected = cgstOptions.find(opt => opt.value === values.cgstLedgerId);


                                                                    return selected;
                                                                })()}
                                                                onChange={(option) => {
                                                                    handleCgstLedgerChange(option);
                                                                }}
                                                                options={cgstOptions}
                                                                placeholder="Select CGST Ledger"
                                                                menuPortalTarget={document.body}
                                                                styles={{ ...customStyles, menuPortal: (base) => ({ ...base, zIndex: 100000 }) }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="mb-2.5 block text-black dark:text-white">SGST Ledger</label>
                                                            <ReactSelect
                                                                value={sgstOptions.find(opt => opt.value === values.sgstLedgerId)}
                                                                onChange={handleSgstLedgerChange}
                                                                options={sgstOptions}
                                                                placeholder="Select SGST Ledger"
                                                                menuPortalTarget={document.body}
                                                                styles={{ ...customStyles, menuPortal: (base) => ({ ...base, zIndex: 100000 }) }}
                                                            />
                                                        </div>
                                                    </div>

                                                </div>
                                            )}

                                            {/* Message for Non-Regular Suppliers */}
                                            {regType?.toLowerCase() !== "regular" && regType && (
                                                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                                                    <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                                                        ⚠️ This supplier is registered as {regType?.toUpperCase()}. GST is not applicable for this transaction.
                                                    </p>
                                                </div>
                                            )}

                                            {/* Products Table */}
                                            <FieldArray name="paymentDetails">
                                                {({ push, remove }) => (
                                                    <div className="mb-6">
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full table-fixed border-collapse">
                                                                <thead>
                                                                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                                                        <th className="w-[180px] py-4 px-3 font-medium text-black dark:text-white">Product</th>
                                                                        <th className="w-[100px] py-4 px-3 font-medium text-black dark:text-white">Quantity</th>
                                                                        <th className="w-[120px] py-4 px-3 font-medium text-black dark:text-white">MRP (Inc. GST)</th>
                                                                        <th className="w-[120px] py-4 px-3 font-medium text-black dark:text-white">Purchase Rate (Excl. GST)</th>
                                                                        <th className="w-[120px] py-4 px-3 font-medium text-black dark:text-white">GST Type</th>
                                                                        <th className="w-[100px] py-4 px-3 font-medium text-black dark:text-white">GST Amount</th>
                                                                        <th className="w-[120px] py-4 px-3 font-medium text-black dark:text-white">Total Value</th>
                                                                        <th className="w-[80px] py-4 px-3 font-medium text-black dark:text-white">Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {values?.paymentDetails.map((entry, index) => {




                                                                        const rowProducts = getAvailableProductsForRow(values, index);



                                                                        const productInfo = availableProducts.find(p => p.value === entry.productsId);



                                                                        return (
                                                                            <tr key={entry.id || index}>
                                                                                <td className="border-b py-4 px-3">
                                                                                    {entry && entry.productsId ? (
                                                                                        <div className="text-sm font-medium">
                                                                                            {productInfo?.productName || entry.productName || 'Product'}
                                                                                            <Field name={`paymentDetails.${index}.productsId`} value={entry.productsId} />
                                                                                        </div>
                                                                                    ) : (
                                                                                        <ReactSelect
                                                                                            value={rowProducts.find(p => p.value === entry.productsId) || null}
                                                                                            onChange={(option) => {
                                                                                                const mrp = option?.price || 0;
                                                                                                const hsnCode = option?.hsnCode || {};

                                                                                                // Get registration and party locations
                                                                                                const defGstRegist = Vouchers?.defGstRegist || '';
                                                                                                const getRegistrationLocation = (gstReg) => {
                                                                                                    if (!gstReg) return null;
                                                                                                    const regLower = gstReg?.state?.toLowerCase() || gstReg?.toLowerCase() || '';
                                                                                                    if (regLower.includes('jammu') || regLower.includes('kashmir') || regLower.includes('j&k') || regLower.includes('jk') || regLower.includes('sxr')) {
                                                                                                        return 'sxr';
                                                                                                    } else if (regLower.includes('delhi') || regLower.includes('ncr') || regLower.includes('nct')) {
                                                                                                        return 'delhi';
                                                                                                    }
                                                                                                    return null;
                                                                                                };

                                                                                                const getPartyState = () => {
                                                                                                    const selectedLedgerOption = LedgerData.find(opt => opt.value === values.ledgerId);
                                                                                                    if (selectedLedgerOption?.obj?.shippingState) {
                                                                                                        const state = selectedLedgerOption.obj.shippingState;
                                                                                                        if (state === '01') return 'sxr';
                                                                                                        if (state === '07') return 'delhi';
                                                                                                    }
                                                                                                    if (custaddress === '01') return 'sxr';
                                                                                                    if (custaddress === '07') return 'delhi';
                                                                                                    return null;
                                                                                                };

                                                                                                const registrationLocation = getRegistrationLocation(defGstRegist);
                                                                                                const partyLocation = getPartyState();
                                                                                                const gstType = determineProductGSTType(registrationLocation, partyLocation);

                                                                                                // Get GST rates from HSN code
                                                                                                const igstRate = hsnCode?.igst || 0;
                                                                                                const cgstRate = hsnCode?.cgst || 0;
                                                                                                const sgstRate = hsnCode?.sgst || 0;

                                                                                                // Create GST calculation object
                                                                                                let gstCalculation = null;

                                                                                                if (regType?.toLowerCase() === "regular" && !values.isExport) {
                                                                                                    if (gstType === 'IGST') {
                                                                                                        gstCalculation = {
                                                                                                            type: 'IGST',
                                                                                                            igstRate: igstRate,
                                                                                                            cgstRate: 0,
                                                                                                            sgstRate: 0,
                                                                                                            registrationLocation,
                                                                                                            partyLocation
                                                                                                        };
                                                                                                    } else {
                                                                                                        gstCalculation = {
                                                                                                            type: 'CGST+SGST',
                                                                                                            igstRate: 0,
                                                                                                            cgstRate: cgstRate,
                                                                                                            sgstRate: sgstRate,
                                                                                                            registrationLocation,
                                                                                                            partyLocation
                                                                                                        };
                                                                                                    }
                                                                                                }

                                                                                                // Calculate purchase rate
                                                                                                const rateCalculation = calculatePurchaseRate(mrp, gstCalculation, regType, values.isExport);

                                                                                                setFieldValue(`paymentDetails.${index}.productsId`, option?.value || null);
                                                                                                setFieldValue(`paymentDetails.${index}.orderProductId`, option?.orderProdId || null);
                                                                                                setFieldValue(`paymentDetails.${index}.orderId`, option?.obj?.orderId || null);
                                                                                                setFieldValue(`paymentDetails.${index}.mrp`, mrp);
                                                                                                setFieldValue(`paymentDetails.${index}.basePrice`, rateCalculation.basePrice);
                                                                                                setFieldValue(`paymentDetails.${index}.rate`, rateCalculation.basePrice);
                                                                                                setFieldValue(`paymentDetails.${index}.gstCalculation`, gstCalculation);
                                                                                                setFieldValue(`paymentDetails.${index}.igstAmount`, rateCalculation.igstAmount);
                                                                                                setFieldValue(`paymentDetails.${index}.cgstAmount`, rateCalculation.cgstAmount);
                                                                                                setFieldValue(`paymentDetails.${index}.sgstAmount`, rateCalculation.sgstAmount);
                                                                                                setFieldValue(`paymentDetails.${index}.igstRate`, rateCalculation.igstRate);
                                                                                                setFieldValue(`paymentDetails.${index}.cgstRate`, rateCalculation.cgstRate);
                                                                                                setFieldValue(`paymentDetails.${index}.sgstRate`, rateCalculation.sgstRate);
                                                                                                setFieldValue(`paymentDetails.${index}.value`, rateCalculation.basePrice * (entry.quantity || 1));
                                                                                                setFieldValue(`paymentDetails.${index}.voucherAmount`, rateCalculation.totalAmount * (entry.quantity || 1));
                                                                                            }}
                                                                                            options={rowProducts}
                                                                                            placeholder="Select Product"
                                                                                            menuPortalTarget={document.body}
                                                                                            styles={{ ...customStyles, menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                                                            isClearable
                                                                                        />
                                                                                    )}
                                                                                </td>

                                                                                <td className="border-b py-4 px-3">
                                                                                    <Field type="number" name={`paymentDetails.${index}.quantity`} placeholder="1" min="1" step="1" className="w-full py-2 px-3 text-sm rounded border" onChange={(e) => {
                                                                                        const quantity = parseFloat(e.target.value) || 1;
                                                                                        setFieldValue(`paymentDetails.${index}.quantity`, quantity);
                                                                                        setFieldValue(`paymentDetails.${index}.value`, (entry.mrp || 0) * quantity);
                                                                                        setFieldValue(`paymentDetails.${index}.voucherAmount`, (entry.mrp || 0) * quantity);
                                                                                    }} />
                                                                                </td>


                                                                                <td className="border-b py-4 px-3">
                                                                                    <Field type="number" name={`paymentDetails.${index}.mrp`} placeholder="0.00" readOnly className="w-full bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm rounded border" />
                                                                                </td>

                                                                                <td className="border-b py-4 px-3">
                                                                                    <Field type="number" name={`paymentDetails.${index}.rate`} placeholder="0.00" readOnly className="w-full bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm rounded border" />
                                                                                </td>

                                                                                <td className="border-b py-4 px-3">
                                                                                    <div className="text-xs">
                                                                                        {entry.gstCalculation?.type === 'IGST' && (
                                                                                            <span className="text-blue-600">IGST: {entry.igstRate}%</span>
                                                                                        )}
                                                                                        {entry.gstCalculation?.type === 'CGST+SGST' && (
                                                                                            <span className="text-green-600">CGST: {entry.cgstRate}% | SGST: {entry.sgstRate}%</span>
                                                                                        )}
                                                                                        {(!entry.gstCalculation || regType?.toLowerCase() !== "regular") && (
                                                                                            <span className="text-gray-500">No GST</span>
                                                                                        )}
                                                                                    </div>
                                                                                </td>

                                                                                <td className="border-b py-4 px-3">
                                                                                    <Field type="number" name={`paymentDetails.${index}.gstAmount`} placeholder="0.00" readOnly className="w-full bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm rounded border" />
                                                                                </td>

                                                                                <td className="border-b py-4 px-3">
                                                                                    <Field type="number" name={`paymentDetails.${index}.value`} readOnly className="w-full bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm rounded border font-medium" />
                                                                                </td>


                                                                                <td className="border-b py-4 px-3 text-center">
                                                                                    {values.paymentDetails.length > 1 && (
                                                                                        <button type="button" onClick={() => remove(index)} className="text-red-600 hover:text-red-800">
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

                                                        <button type="button" onClick={() => push({ id: uuidv4(), productsId: null, mrp: 0, quantity: 1, value: 0 })} disabled={!values.ledgerId} className="flex items-center gap-2 mt-4 text-primary hover:text-primary/80 font-medium">
                                                            <IoMdAdd size={20} /> Add Row
                                                        </button>

                                                        {/* Summary */}
                                                        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                            <h4 className="text-lg font-semibold mb-3">Purchase Summary</h4>
                                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
                                                                <div>
                                                                    <p className="text-gray-600">Total Quantity</p>
                                                                    <p className="font-medium">{totals.totalQuantity}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-600">Total Base Price (Excl. GST)</p>
                                                                    <p className="font-medium text-blue-600">₹{totals.totalBasePrice}</p>
                                                                    <p className="text-xs text-gray-500">(Goes to Supplier)</p>
                                                                </div>
                                                                {parseFloat(totals.totalIGST) > 0 && (
                                                                    <div>
                                                                        <p className="text-gray-600">Total IGST</p>
                                                                        <p className="font-medium text-purple-600">₹{totals.totalIGST}</p>
                                                                    </div>
                                                                )}
                                                                {parseFloat(totals.totalCGST) > 0 && (
                                                                    <div>
                                                                        <p className="text-gray-600">Total CGST</p>
                                                                        <p className="font-medium text-green-600">₹{totals.totalCGST}</p>
                                                                    </div>
                                                                )}
                                                                {parseFloat(totals.totalSGST) > 0 && (
                                                                    <div>
                                                                        <p className="text-gray-600">Total SGST</p>
                                                                        <p className="font-medium text-green-600">₹{totals.totalSGST}</p>
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <p className="text-gray-600">Grand Total (Inc. GST)</p>
                                                                    <p className="font-bold text-lg text-primary">₹{totals.totalMRP}</p>
                                                                    <p className="text-xs text-gray-500">(Goes to Destination)</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </FieldArray>

                                            {/* Narration */}
                                            <div className="mb-4">
                                                <label className="mb-2.5 block text-black dark:text-white">Narration</label>
                                                <Field as="textarea" name="narration" placeholder="Narration" className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white" />
                                            </div>

                                            {/* Submit Button */}
                                            <div className="flex justify-center mt-4">
                                                <button type="submit" disabled={isSubmitting} className="flex w-[200px] rounded-lg justify-center bg-primary p-3 font-medium text-white hover:bg-opacity-90">
                                                    {isSubmitting ? 'Saving...' : 'Create Voucher'}
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

export default CreateVoucherPurchase;