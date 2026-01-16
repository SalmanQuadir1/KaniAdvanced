import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ReactSelect from 'react-select';
import { useParams, useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { customStyles as createCustomStyles } from '../../../Constants/utils';
import { useSelector } from 'react-redux';
import NumberingDetailsModal from './NumberingDetailsModal';
import useLocation from '../../../hooks/useLocation';
import { toast } from 'react-toastify';
import { GET_VoucherBYID, ADD_Voucher_URL, UPDATEVoucher_URL, ADD_VoucherEntry_URL } from '../../../Constants/utils';
import useVoucher from '../../../hooks/useVoucher';

const Voucher = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useRouterLocation();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const theme = useSelector(state => state?.persisted?.theme);
    const customStyles = createCustomStyles(theme?.mode);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [showNumberingModal, setShowNumberingModal] = useState(false);
    const [gstDetails, setGstDetails] = useState([]);
    const [hsnOptions, setHsnOptions] = useState([]);
    const [initialFormValues, setInitialFormValues] = useState(null);
    const [operationType, setOperationType] = useState('create'); // 'create', 'create-sub', 'update'
    const [parentVoucherId, setParentVoucherId] = useState(null);
    const [generatedVoucherNo, setGeneratedVoucherNo] = useState(''); // Store generated voucher number

    const { Locations, getAllLocation } = useLocation();

    // Function to generate voucher number based on modal data
    const generateVoucherNumber = (numberingData) => {
        const {
            startingNum = '1',
            widthNumPart = '3',
            prefillZero = false,
            prefixParticular = '',
            suffixParticular = '',
            restartNumStartNum = '',
            restartNumAppForm = '',
            restartPeriodicity = ''
        } = numberingData;

        // Get current financial year for suffix (like 24/25)
        const getCurrentFinancialYear = () => {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;

            // Financial year runs from April to March
            let financialYearStart, financialYearEnd;

            if (currentMonth >= 4) {
                // April or later in the year
                financialYearStart = currentYear;
                financialYearEnd = currentYear + 1;
            } else {
                // January to March
                financialYearStart = currentYear - 1;
                financialYearEnd = currentYear;
            }

            // Get last two digits
            const startShort = financialYearStart.toString().slice(-2);
            const endShort = financialYearEnd.toString().slice(-2);

            return `${startShort}-${endShort}`;
        };

        // Generate numerical part
        let numericalPart = restartNumStartNum || startingNum;

        // Pad with zeros if needed
        if (prefillZero && widthNumPart) {
            const width = parseInt(widthNumPart) || 3;
            numericalPart = numericalPart.toString().padStart(width, '0');
        }

        // Generate prefix
        let prefix = prefixParticular || '';

        // Generate suffix - use provided suffix or financial year
        let suffix = suffixParticular || getCurrentFinancialYear();

        // Construct final voucher number
        let voucherNo = '';

        if (prefix) {
            voucherNo += `${prefix} `;
        }

        voucherNo += `${numericalPart}`;

        if (suffix) {
            voucherNo += `/${suffix}`;
        }

        return voucherNo;
    };

    useEffect(() => {
        getAllLocation();
    }, []);

    // Determine operation type from URL
    useEffect(() => {
        const path = location.pathname;

        if (path.includes('/update/')) {
            setOperationType('update');
        } else if (id && !path.includes('/update/')) {
            setOperationType('create-sub');
            setParentVoucherId(id);
        } else {
            setOperationType('create');
        }
    }, [location.pathname, id]);

    // Dropdown options
    const typeOfVoucher = [
        { value: 'Journal', label: 'Journal' },
        { value: 'Sales', label: 'Sales' },
        { value: 'Purchase', label: 'Purchase' },
        { value: 'Reciept', label: 'Receipt' },
        { value: 'Payment', label: 'Payment' },
        { value: 'CreditNote', label: 'Credit Note' },
        { value: 'DebitNote', label: 'Debit Note' },
        { value: 'Contra', label: 'Contra' },
    ];

    const gstdetails = [
        { value: 'Specify Slab Based Rates', label: 'Specify Slab Based Rates' },
        { value: 'Use GST Classification', label: 'Use GST Classification' },
    ];

    const defGstRegist = [
        { value: 'Registration Delhi', label: 'Registration Delhi' },
        { value: 'Registration Jammu And Kashmir', label: 'Registration Jammu And Kashmir' },
    ];

    const yesNo = [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' },
    ];

    const NumberingBehaviour = [
        { value: 'ReNumberVoucher', label: 'Re-Number Voucher' },
        { value: 'RetainOriginalVoucherNo', label: 'Retain Original Voucher No' },
    ];

    const methodOfvoucher = [
        { value: 'Automatic', label: 'Automatic' },
        { value: 'AutomaticManualOverride', label: 'Automatic (Manual Override)' },
        { value: 'Manual', label: 'Manual' },
        { value: 'MultiUserAuto', label: 'Multi-User Auto' },
        { value: 'None', label: 'None' },
    ];
    console.log(generatedVoucherNo);

    // Initial values
    const defaultInitialValues = {
        name: '',
        typeOfVoucher: '',
        abbreviation: '',
        actVoucher: 'true',
        methodOfvoucher: '',
        numbInsertDelete: '',
        setAdditionalNumb: false,
        unusedVchNos: false,
        dateForVchs: false,
        effectiveDate: '',
        zeroTransactionAllowed: false,
        optionalVchType: false,
        narrationVchs: false,
        autoReceiptNumber: generatedVoucherNo,
        narratLedgerVch: false,
        defAccounting: false,
        costPurchase: false,
        whatsAppVch: false,
        inteCompTransfer: false,
        printVch: false,
        posInvoicing: false,
        setAlterDecl: false,
        defaultGodown: '',
        defTitlePrint: '',
        msgPrintOne: '',
        msgPrintTwo: '',
        defBank: '',
        defJurisdiction: '',
        printFormal: false,
        defGstRegist: { id: '' },
        methodVouchNumbering: false,
        gstratedetails: '',
        // hsnCode: null,
        gstDescription: '',
        hsn_Sac: '',
        generatedVoucherNo: '', // Add field for generated voucher number
        parentVoucherId: null,
    };

    // Fetch voucher data based on operation type
    const fetchData = async () => {
        if (operationType === 'update' && id) {
            // Fetch voucher data for update
            await fetchVoucherById(id);
        } else if (operationType === 'create-sub' && parentVoucherId) {
            // Fetch parent voucher data for reference
            await fetchParentVoucherData(parentVoucherId);
        } else {
            // Create new voucher
            setInitialFormValues({
                ...defaultInitialValues,
                parentVoucherId: parentVoucherId
            });
        }
    };

    const fetchVoucherById = async (voucherId) => {
        setFetching(true);
        try {
            const response = await fetch(`${GET_VoucherBYID}/${voucherId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (response.ok) {
                const voucherData = await response.json();
                const formattedData = formatVoucherData(voucherData);
                setInitialFormValues(formattedData);
            } else {
                toast.error('Failed to fetch voucher data');
                setInitialFormValues(defaultInitialValues);
            }
        } catch (error) {
            console.error('Error fetching voucher:', error);
            toast.error('Failed to fetch voucher data');
            setInitialFormValues(defaultInitialValues);
        } finally {
            setFetching(false);
        }
    };

    const fetchParentVoucherData = async (parentId) => {
        setFetching(true);
        try {
            const response = await fetch(`${GET_VoucherBYID}/${parentId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (response.ok) {
                const parentData = await response.json();
                // Pre-fill some fields from parent for sub-voucher
                const subVoucherData = {
                    ...defaultInitialValues,
                    parentVoucherId: parentId,
                    typeOfVoucher: parentData.typeOfVoucher || '',
                    abbreviation: parentData.abbreviation ? `${parentData.abbreviation}_SUB` : '',
                    generatedVoucherNo: parentData.generatedVoucherNo || '', // Inherit voucher number
                    // Add other fields you want to inherit from parent
                };
                setInitialFormValues(subVoucherData);
            } else {
                // If parent fetch fails, still create sub-voucher
                setInitialFormValues({
                    ...defaultInitialValues,
                    parentVoucherId: parentId
                });
            }
        } catch (error) {
            console.error('Error fetching parent voucher:', error);
            setInitialFormValues({
                ...defaultInitialValues,
                parentVoucherId: parentId
            });
        } finally {
            setFetching(false);
        }
    };

    const formatVoucherData = (voucherData) => {
        console.log(voucherData, "sed godown");
        return {
            name: voucherData.name || '',
            typeOfVoucher: voucherData.typeOfVoucher || '',
            abbreviation: voucherData.abbreviation || '',
            actVoucher: voucherData.actVoucher?.toString() || 'true',
            methodOfvoucher: voucherData.methodOfvoucher || '',
            numbInsertDelete: voucherData.numbInsertDelete || '',
            setAdditionalNumb: voucherData.setAdditionalNumb || false,
            autoReceiptNumber: voucherData.autoReceiptNumber || '',
            unusedVchNos: voucherData.unusedVchNos || false,
            dateForVchs: voucherData.dateForVchs || false,
            effectiveDate: voucherData.effectiveDate || '',
            zeroTransactionAllowed: voucherData.zeroTransactionAllowed || false,
            optionalVchType: voucherData.optionalVchType || false,
            narrationVchs: voucherData.narrationVchs || false,
            narratLedgerVch: voucherData.narratLedgerVch || false,
            defAccounting: voucherData.defAccounting || false,
            costPurchase: voucherData.costPurchase || false,
            whatsAppVch: voucherData.whatsAppVch || false,
            inteCompTransfer: voucherData.inteCompTransfer || false,
            printVch: voucherData.printVch || false,
            posInvoicing: voucherData.posInvoicing || false,
            setAlterDecl: voucherData.setAlterDecl || false,
            defaultGodown: voucherData.defaultGodown || '',
            defTitlePrint: voucherData.defTitlePrint || '',
            msgPrintOne: voucherData.msgPrintOne || '',
            msgPrintTwo: voucherData.msgPrintTwo || '',
            defBank: voucherData.defBank || '',
            defJurisdiction: voucherData.defJurisdiction || '',
            printFormal: voucherData.printFormal || false,
            defGstRegist: { id: voucherData.defGstRegist || '' },
            methodVouchNumbering: voucherData.methodVouchNumbering || false,
            gstratedetails: voucherData.gstratedetails || '',
            // hsnCode: voucherData.hsnCode || null,
            gstDescription: voucherData.gstDescription || '',
            hsn_Sac: voucherData.hsn_Sac || '',
            generatedVoucherNo: voucherData.generatedVoucherNo || '',
            // parentVoucherId: voucherData.parentVoucherId || null,
        };
    };

    // Handle form submission
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log(values, "handle submittttt");
        setLoading(true);


        try {
            let url, method, successMessage;

            if (operationType === 'update' && id) {
                // Update existing voucher
                url = `${UPDATEVoucher_URL}/${id}`;
                method = "PUT";
                successMessage = 'Voucher updated successfully';
            } else if (operationType === 'create-sub' && parentVoucherId) {
                // Create sub-voucher entry
                url = ADD_Voucher_URL;
                method = "POST";
                successMessage = 'Sub-voucher created successfully';
            } else {
                // Create new voucher
                url = ADD_Voucher_URL;
                method = "POST";
                successMessage = 'Voucher created successfully';
            }

            // Prepare the data
            const formData = {
                ...values,
                autoReceiptNumber: generatedVoucherNo.toUpperCase(), // Include generated voucher number
                ...(gstDetails.length > 0 ? { gstDetails } : {})
            };

            // Clean up data for ReactSelect fields
            if (values.defaultGodown && typeof values.defaultGodown === 'object') {
                formData.defaultGodown = values.defaultGodown.value;
            }
            console.log(formData, "form dataaa");

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(successMessage);

                if (operationType === 'create' || operationType === 'create-sub') {
                    resetForm();
                }

                // Navigate based on operation type
                if (operationType === 'update') {
                    navigate('/configurator/vouchers');
                } else if (operationType === 'create-sub') {
                    navigate(`/configurator/vouchers/${parentVoucherId}`);
                } else {
                    navigate('/configurator/vouchers');
                }
            } else {
                toast.error(data.errorMessage || 'Operation failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error("An error occurred during submission");
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [operationType, id, parentVoucherId]);

    const formattedLocation = Locations?.map(loc => ({
        label: loc.address,
        value: loc.id
    }));

    const formattedGstLocation = Locations?.map(loc => ({
        label: `Registration ${loc.state}`,
        value: loc.id
    }));

    console.log(formattedGstLocation, "heyyyyyyyyyyyyyyyyyyyyyyyy");


    // Helper function for yes/no radio buttons
    const renderYesNoRadio = (name, label, values, setFieldValue) => (
        <div className="flex items-center justify-between mb-4">
            <label className="text-black dark:text-white">{label}</label>
            <div className="flex gap-4">
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        name={name}
                        checked={values[name] === true}
                        onChange={() => setFieldValue(name, true)}
                        className="h-4 w-4"
                    />
                    <span className="text-black dark:text-white">Yes</span>
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        name={name}
                        checked={values[name] === false}
                        onChange={() => setFieldValue(name, false)}
                        className="h-4 w-4"
                    />
                    <span className="text-black dark:text-white">No</span>
                </label>
            </div>
        </div>
    );

    // Show generated voucher number in the form
    const renderGeneratedVoucherNumber = () => {
        if (generatedVoucherNo) {
            return (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h5 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
                        Generated Voucher Number
                    </h5>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 dark:text-green-400 font-bold text-2xl">
                                {generatedVoucherNo}
                            </p>
                            <p className="text-sm text-green-500 dark:text-green-300 mt-1">
                                This voucher number will be used for entries
                            </p>
                        </div>
                        <Field type="hidden" name="generatedVoucherNo" value={generatedVoucherNo} />
                    </div>
                </div>
            );
        }
        return null;
    };

    const getPageTitle = () => {
        switch (operationType) {
            case 'update':
                return 'Update Voucher';
            case 'create-sub':
                return 'Create Sub-Voucher';
            default:
                return 'Create Voucher';
        }
    };

    if (fetching || !initialFormValues) {
        return (
            <DefaultLayout>
                <Breadcrumb pageName={getPageTitle()} />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName={getPageTitle()} />

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                        {getPageTitle()}
                        {operationType === 'create-sub' && parentVoucherId && (
                            <div className="text-sm text-gray-500 mt-2">
                                Parent Voucher ID: {parentVoucherId}
                            </div>
                        )}
                    </h3>
                </div>

                <Formik
                    initialValues={initialFormValues}
                    enableReinitialize={true}
                    validationSchema={Yup.object({
                        name: Yup.string().required('Voucher name is required'),
                        typeOfVoucher: Yup.string().required('Voucher type is required'),
                    })}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue, values }) => (
                        <Form>
                            <div className="p-6.5">
                                {/* Show generated voucher number */}
                                {renderGeneratedVoucherNumber()}

                                {/* Basic Information */}
                                <div className="mb-8">
                                    <h4 className="text-lg font-semibold mb-4 text-black dark:text-white">Basic Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="mb-2.5 block text-black dark:text-white">Voucher Name *</label>
                                            <Field
                                                type="text"
                                                name="name"
                                                placeholder="Enter voucher name"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                            />
                                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>

                                        <div>
                                            <label className="mb-2.5 block text-black dark:text-white">Type of Voucher *</label>
                                            <ReactSelect
                                                name="typeOfVoucher"
                                                value={typeOfVoucher.find(opt => opt.value === values.typeOfVoucher)}
                                                onChange={(opt) => setFieldValue('typeOfVoucher', opt?.value)}
                                                options={typeOfVoucher}
                                                styles={customStyles}
                                                placeholder="Select voucher type"
                                                isDisabled={operationType === 'create-sub'} // Disable for sub-vouchers
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2.5 block text-black dark:text-white">Abbreviation</label>
                                            <Field
                                                type="text"
                                                name="abbreviation"
                                                placeholder="e.g., SAL, PUR"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2.5 block text-black dark:text-white">Activate Voucher</label>
                                            <ReactSelect
                                                name="actVoucher"
                                                value={yesNo.find(opt => opt.value === values.actVoucher)}
                                                onChange={(opt) => setFieldValue('actVoucher', opt?.value)}
                                                options={yesNo}
                                                styles={customStyles}
                                                placeholder="Select"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Voucher Settings */}
                                <div className="mb-8">
                                    <h4 className="text-lg font-semibold mb-4 text-black dark:text-white">Voucher Settings</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="mb-2.5 block text-black dark:text-white">Voucher Numbering Method</label>
                                            <ReactSelect
                                                name="methodOfvoucher"
                                                value={methodOfvoucher.find(opt => opt.value === values.methodOfvoucher)}
                                                onChange={(opt) => setFieldValue('methodOfvoucher', opt?.value)}
                                                options={methodOfvoucher}
                                                styles={customStyles}
                                                placeholder="Select method"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2.5 block text-black dark:text-white">Numbering Behavior</label>
                                            <ReactSelect
                                                name="numbInsertDelete"
                                                value={NumberingBehaviour.find(opt => opt.value === values.numbInsertDelete)}
                                                onChange={(opt) => setFieldValue('numbInsertDelete', opt?.value)}
                                                options={NumberingBehaviour}
                                                styles={customStyles}
                                                placeholder="Select behavior"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {renderYesNoRadio('setAdditionalNumb', 'Set Additional Numbering Details', values, setFieldValue)}
                                        {renderYesNoRadio('unusedVchNos', 'Show Unused Voucher Numbers', values, setFieldValue)}

                                        {/* Show button to open numbering modal if setAdditionalNumb is true */}
                                        {values.setAdditionalNumb === true && !generatedVoucherNo && (
                                            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNumberingModal(true)}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                >
                                                    Configure Voucher Numbering Details
                                                </button>
                                                <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">
                                                    Click to set starting number, prefix, suffix, and other numbering details
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between mb-4">
                                            <label className="text-black dark:text-white">Use Effective Date for Vouchers</label>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="dateForVchs"
                                                        checked={values.dateForVchs === true}
                                                        onChange={() => setFieldValue('dateForVchs', true)}
                                                        className="h-4 w-4"
                                                    />
                                                    <span className="text-black dark:text-white">Yes</span>
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="dateForVchs"
                                                        checked={values.dateForVchs === false}
                                                        onChange={() => setFieldValue('dateForVchs', false)}
                                                        className="h-4 w-4"
                                                    />
                                                    <span className="text-black dark:text-white">No</span>
                                                </label>
                                            </div>
                                        </div>

                                        {values.dateForVchs && (
                                            <div className="ml-4">
                                                <label className="block mb-2">Effective Date</label>
                                                <Field
                                                    name="effectiveDate"
                                                    type="date"
                                                    className="w-full md:w-1/2 p-2 border rounded"
                                                />
                                            </div>
                                        )}

                                        {renderYesNoRadio('zeroTransactionAllowed', 'Allow Zero Value Transactions', values, setFieldValue)}
                                        {renderYesNoRadio('optionalVchType', 'Make Voucher Type Optional by Default', values, setFieldValue)}
                                        {renderYesNoRadio('narrationVchs', 'Allow Narration in Voucher', values, setFieldValue)}
                                        {renderYesNoRadio('narratLedgerVch', 'Provide Narration for Each Ledger Entry', values, setFieldValue)}

                                        {values.typeOfVoucher !== "Journal" &&
                                            renderYesNoRadio('defAccounting', 'Enable Default Accounting Allocation', values, setFieldValue)
                                        }

                                        {(values.typeOfVoucher === "Journal" || values.typeOfVoucher === "Payment" || values.typeOfVoucher === "DebitNote") &&
                                            renderYesNoRadio('costPurchase', 'Track Additional Cost for Purchases', values, setFieldValue)
                                        }

                                        {values.typeOfVoucher === "Journal" &&
                                            renderYesNoRadio('whatsAppVch', 'Send WhatsApp Notification', values, setFieldValue)
                                        }

                                        {values.typeOfVoucher === "Sales" &&
                                            renderYesNoRadio('inteCompTransfer', 'Enable Inter-Company Transfer', values, setFieldValue)
                                        }
                                    </div>
                                </div>

                                {/* Printing Details */}
                                <div className="mb-8">
                                    <h4 className="text-lg font-semibold mb-4 text-black dark:text-white">Printing Details</h4>
                                    <div className="space-y-4 mb-6">
                                        {renderYesNoRadio('printVch', 'Print Voucher After Saving', values, setFieldValue)}

                                        {values.typeOfVoucher === "Sales" && (
                                            <>
                                                {renderYesNoRadio('posInvoicing', 'Use for POS Invoicing', values, setFieldValue)}
                                                {renderYesNoRadio('setAlterDecl', 'Set/Alter Declaration Text', values, setFieldValue)}
                                            </>
                                        )}

                                        {values.typeOfVoucher === "Reciept" &&
                                            renderYesNoRadio('printFormal', 'Print Formal Receipt After Saving', values, setFieldValue)
                                        }
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="mb-2.5 block text-black dark:text-white">Default Godown/Location</label>
                                            <ReactSelect
                                                name="defaultGodown"
                                                options={formattedLocation}
                                                value={formattedLocation?.find(opt => opt.value === values.defaultGodown)}
                                                onChange={(opt) => setFieldValue('defaultGodown', { id: opt?.value })}
                                                styles={customStyles}
                                                placeholder="Select location"
                                            />
                                        </div>

                                        {values.typeOfVoucher === "Sales" && (
                                            <>
                                                <div>
                                                    <label className="mb-2.5 block text-black dark:text-white">Default Print Title</label>
                                                    <Field
                                                        type="text"
                                                        name="defTitlePrint"
                                                        placeholder="e.g., Tax Invoice"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-2.5 block text-black dark:text-white">Default Bank</label>
                                                    <Field
                                                        type="text"
                                                        name="defBank"
                                                        placeholder="Bank name"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-2.5 block text-black dark:text-white">Default Jurisdiction</label>
                                                    <Field
                                                        type="text"
                                                        name="defJurisdiction"
                                                        placeholder="Jurisdiction area"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {values.posInvoicing && (
                                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="mb-2.5 block text-black dark:text-white">POS Message Line 1</label>
                                                <Field
                                                    type="text"
                                                    name="msgPrintOne"
                                                    placeholder="First line message"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2.5 block text-black dark:text-white">POS Message Line 2</label>
                                                <Field
                                                    type="text"
                                                    name="msgPrintTwo"
                                                    placeholder="Second line message"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Statutory Details */}
                                <div className="mb-8">
                                    <h4 className="text-lg font-semibold mb-4 text-black dark:text-white">Statutory Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="mb-2.5 block text-black dark:text-white">Default GST Registration</label>
                                            <ReactSelect
                                                name="defGstRegist"
                                                value={formattedGstLocation.find(opt => opt.value === values.defGstRegist)}
                                                onChange={(opt) => setFieldValue('defGstRegist', { id: opt?.value })}
                                                options={formattedGstLocation}
                                                styles={customStyles}
                                                placeholder="Select registration"
                                            />
                                        </div>
                                    </div>

                                    {renderYesNoRadio('methodVouchNumbering', 'Use Common Voucher Numbering for All GST Registrations', values, setFieldValue)}
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center mt-8">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || loading || (values.setAdditionalNumb && !generatedVoucherNo)}
                                        className="flex items-center justify-center md:w-[150px] w-full md:h-[44px] h-[44px] rounded-lg bg-primary font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                {operationType === 'update' ? 'Updating...' :
                                                    operationType === 'create-sub' ? 'Creating Sub-Voucher...' :
                                                        'Creating...'}
                                            </div>
                                        ) : (
                                            operationType === 'update' ? 'Update Voucher' :
                                                operationType === 'create-sub' ? 'Create Sub-Voucher' :
                                                    'Create Voucher'
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        className="ml-4 flex items-center justify-center md:w-[100px] w-full md:h-[44px] h-[44px] rounded-lg bg-gray-200 font-medium text-gray-700 hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>

            <NumberingDetailsModal
                show={showNumberingModal}
                onHide={() => setShowNumberingModal(false)}
                onSubmit={(data) => {
                    // Generate voucher number from modal data
                    const voucherNumber = generateVoucherNumber(data);
                    setGeneratedVoucherNo(voucherNumber);

                    // Store the gst details
                    setGstDetails(data);

                    // Close modal
                    setShowNumberingModal(false);

                    // Show success message
                    toast.success(`Voucher number generated: ${voucherNumber}`);

                    console.log("Generated Voucher No:", voucherNumber);
                }}
            />
        </DefaultLayout>
    );
};

export default Voucher;