import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ReactSelect from 'react-select';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { customStyles as createCustomStyles } from '../../../Constants/utils';
import { useSelector } from 'react-redux';
import NumberingDetailsModal from './NumberingDetailsModal';
import useLocation from '../../../hooks/useLocation';
import { toast } from 'react-toastify';
import { GET_VoucherBYID, UPDATEVoucher_URL } from '../../../Constants/utils';

const UpdateVoucher = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const theme = useSelector(state => state?.persisted?.theme);
    const customStyles = createCustomStyles(theme?.mode);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showNumberingModal, setShowNumberingModal] = useState(false);
    const [gstDetails, setGstDetails] = useState([]);
    const [initialFormValues, setInitialFormValues] = useState(null);
    const [generatedVoucherNo, setGeneratedVoucherNo] = useState('');
    const [numberingConfig, setNumberingConfig] = useState(null);

    const { Locations, getAllLocation } = useLocation();

    useEffect(() => {
        getAllLocation();
    }, []);

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
        { value: 'StockJournal', label: 'Stock Journal' },
    ];

    const yesNo = [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' },
    ];

    const NumberingBehaviour = [
        { value: 'ReNumberVoucher', label: 'Re-Number Voucher' },
        { value: 'RetainOriginalVoucherNo', label: 'Retain Original Voucher No' },
    ];

    const methodVouchNumbering = [
        { value: 'Automatic', label: 'Automatic' },
        { value: 'AutomaticManualOverride', label: 'Automatic (Manual Override)' },
        { value: 'Manual', label: 'Manual' },
        { value: 'MultiUserAuto', label: 'Multi-User Auto' },
        { value: 'None', label: 'None' },
    ];

    // Fetch voucher data by ID
    const fetchVoucherById = async () => {
        setFetching(true);
        try {
            const response = await fetch(`${GET_VoucherBYID}/${id}`, {
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
                setGeneratedVoucherNo(voucherData.generatedVoucherNo || '');

                // If there are GST details, set them
                if (voucherData.gstDetails) {
                    setGstDetails(voucherData.gstDetails);
                }
            } else {
                toast.error('Failed to fetch voucher data');
                navigate('/configurator/vouchers');
            }
        } catch (error) {
            console.error('Error fetching voucher:', error);
            toast.error('Failed to fetch voucher data');
            navigate('/configurator/vouchers');
        } finally {
            setFetching(false);
        }
    };
    console.log(initialFormValues, "00000000000");

    const formatVoucherData = (voucherData) => {
        return {
            name: voucherData.name || '',
            typeOfVoucher: voucherData.typeOfVoucher || '',
            abbreviation: voucherData.abbreviation || '',
            actVoucher: voucherData.actVoucher?.toString() || 'true',
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
            defGstRegist: voucherData.defGstRegist?.id || '',
            methodVouchNumbering: voucherData.methodVouchNumbering || '',
            vchNumbGstRegistration: voucherData.vchNumbGstRegistration || false,
            gstratedetails: voucherData.gstratedetails || '',
            gstDescription: voucherData.gstDescription || '',
            hsn_Sac: voucherData.hsn_Sac || '',
            generatedVoucherNo: voucherData.generatedVoucherNo || '',
        };
    };

    useEffect(() => {
        if (id) {
            fetchVoucherById();
        }
    }, [id]);

    // Handle form submission
    const handleSubmit = async (values, { setSubmitting }) => {
        setLoading(true);

        try {
            // Prepare the data
            const formData = {
                ...values,
                autoReceiptNumber: generatedVoucherNo,
                ...(gstDetails.length > 0 ? { gstDetails } : {})
            };

            // Clean up data for ReactSelect fields
            if (values.defaultGodown && typeof values.defaultGodown === 'object') {
                formData.defaultGodown = values.defaultGodown.value;
            }

            const response = await fetch(`${UPDATEVoucher_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Voucher updated successfully');
                navigate('/configurator/vouchers');
            } else {
                toast.error(data.errorMessage || 'Update failed');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error("An error occurred during update");
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    // Handle manual voucher number change
    const handleManualVoucherChange = (e, setFieldValue) => {
        const value = e.target.value;
        setGeneratedVoucherNo(value);
        setFieldValue('generatedVoucherNo', value);
    };

    // Handle numbering method change
    const handleNumberingMethodChange = (opt, setFieldValue) => {
        setFieldValue('methodVouchNumbering', opt?.value);
    };

    const formattedLocation = Locations?.map(loc => ({
        label: loc.address,
        value: loc.id
    }));

    const formattedGstLocation = Locations?.map(loc => ({
        label: `Registration ${loc.state}`,
        value: loc.id
    }));

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

    // Render voucher number input based on numbering method
    const renderVoucherNumberInput = (values, setFieldValue) => {
        if (values.methodVouchNumbering === 'Automatic') {
            return (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h5 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
                        Current Voucher Number
                    </h5>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 dark:text-blue-400 font-bold text-2xl">
                                {generatedVoucherNo || values.autoReceiptNumber || '1'}
                            </p>
                            <p className="text-sm text-blue-500 dark:text-blue-300 mt-1">
                                System generated voucher number
                            </p>
                        </div>
                        <Field
                            type="hidden"
                            name="generatedVoucherNo"
                            value={generatedVoucherNo || values.autoReceiptNumber || '1'}
                        />
                    </div>
                </div>
            );
        } else if (values.methodVouchNumbering === 'Manual') {
            return (
                <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h5 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-4">
                        Manual Voucher Number
                    </h5>
                    <div>
                        <label className="mb-2.5 block text-black dark:text-white">
                            Voucher Number
                        </label>
                        <input
                            type="text"
                            value={generatedVoucherNo || values.autoReceiptNumber || ''}
                            onChange={(e) => handleManualVoucherChange(e, setFieldValue)}
                            placeholder="e.g., VCH-001, INV-2024-001"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>
                </div>
            );
        } else if (values.setAdditionalNumb) {
            return (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h5 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
                        Voucher Number (with Additional Settings)
                    </h5>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 dark:text-green-400 font-bold text-2xl">
                                {generatedVoucherNo || values.autoReceiptNumber || 'Not configured'}
                            </p>
                            <p className="text-sm text-green-500 dark:text-green-300 mt-1">
                                Voucher number with prefix/suffix and padding
                            </p>
                        </div>
                        <Field
                            type="hidden"
                            name="generatedVoucherNo"
                            value={generatedVoucherNo || values.autoReceiptNumber}
                        />
                    </div>
                    {!generatedVoucherNo && !values.autoReceiptNumber && (
                        <button
                            type="button"
                            onClick={() => setShowNumberingModal(true)}
                            className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Configure Numbering Details
                        </button>
                    )}
                </div>
            );
        }
        return null;
    };

    if (fetching) {
        return (
            <DefaultLayout>
                <Breadcrumb pageName="Update Voucher" />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </DefaultLayout>
        );
    }

    if (!initialFormValues) {
        return (
            <DefaultLayout>
                <Breadcrumb pageName="Update Voucher" />
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">No voucher data found</p>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Update Voucher" />

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                        Update Voucher
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
                                {/* Basic Information */}
                                <div className="mb-8">
                                    <h4 className="text-lg font-semibold mb-4 text-black dark:text-white">
                                        Basic Information
                                    </h4>

                                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-md w-fit">
                                        <span className="font-bold text-black dark:text-white">
                                            Voucher Number:
                                        </span>
                                        <span className="font-bold text-primary text-lg">
                                            {initialFormValues.autoReceiptNumber}
                                        </span>
                                    </div>

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
                                                name="methodVouchNumbering"
                                                value={methodVouchNumbering.find(opt => opt.value === values.methodVouchNumbering)}
                                                onChange={(opt) => handleNumberingMethodChange(opt, setFieldValue)}
                                                options={methodVouchNumbering}
                                                isDisabled="true"
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
                                                isDisabled="true"
                                                styles={customStyles}
                                                placeholder="Select behavior"
                                            />
                                        </div>
                                    </div>

                                    {/* Render voucher number input based on selected method */}
                                    {/* {renderVoucherNumberInput(values, setFieldValue)} */}



                                    <div className="space-y-4">
                                        {/* Show Additional Numbering option only if not Auto or Manual */}
                                        {values.methodVouchNumbering !== 'Automatic' &&
                                            values.methodVouchNumbering !== 'Manual' && (
                                                <>
                                                    {renderYesNoRadio('setAdditionalNumb', 'Set Additional Numbering Details', values, setFieldValue)}
                                                </>
                                            )}

                                        {renderYesNoRadio('unusedVchNos', 'Show Unused Voucher Numbers', values, setFieldValue)}

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
                                                onChange={(opt) => setFieldValue('defaultGodown', opt?.value)}
                                                styles={customStyles}
                                            isDisabled="true"
                                                placeholder="Select location"
                                            />
                                        </div>

                                      
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
                                                isDisabled="true"
                                                value={formattedGstLocation.find(opt => opt.value === values.defGstRegist)}
                                                onChange={(opt) => setFieldValue('defGstRegist', opt?.value)}
                                                options={formattedGstLocation}
                                                styles={customStyles}
                                                placeholder="Select registration"
                                            />
                                        </div>
                                    </div>

                                    {renderYesNoRadio('vchNumbGstRegistration', 'Use Common Voucher Numbering for All GST Registrations', values, setFieldValue)}
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center mt-8 gap-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || loading}
                                        className="flex items-center justify-center md:w-[250px] w-full md:h-[44px] h-[44px] rounded-lg bg-primary font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Updating...
                                            </div>
                                        ) : (
                                            'Update Voucher'
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => navigate('/configurator/vouchers')}
                                        className="flex items-center justify-center md:w-[100px] w-full md:h-[44px] h-[44px] rounded-lg bg-gray-200 font-medium text-gray-700 hover:bg-gray-300"
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
                    const generateVoucherNumber = (numberingData) => {
                        const {
                            startingNum = '1',
                            widthNumPart = '3',
                            prefillZero = false,
                            prefixParticular = '',
                            suffixParticular = '',
                            restartNumStartNum = '',
                        } = numberingData;

                        const getCurrentFinancialYear = () => {
                            const currentDate = new Date();
                            const currentYear = currentDate.getFullYear();
                            const currentMonth = currentDate.getMonth() + 1;

                            let financialYearStart, financialYearEnd;

                            if (currentMonth >= 4) {
                                financialYearStart = currentYear;
                                financialYearEnd = currentYear + 1;
                            } else {
                                financialYearStart = currentYear - 1;
                                financialYearEnd = currentYear;
                            }

                            const startShort = financialYearStart.toString().slice(-2);
                            const endShort = financialYearEnd.toString().slice(-2);

                            return `${startShort}-${endShort}`;
                        };

                        let numericalPart = restartNumStartNum || startingNum;

                        if (prefillZero && widthNumPart) {
                            const width = parseInt(widthNumPart) || 3;
                            numericalPart = numericalPart.toString().padStart(width, '0');
                        }

                        let prefix = prefixParticular || '';
                        let suffix = suffixParticular || getCurrentFinancialYear();

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

                    const voucherNumber = generateVoucherNumber(data);
                    setGeneratedVoucherNo(voucherNumber);
                    setNumberingConfig(data);
                    setGstDetails(data);
                    setShowNumberingModal(false);
                    toast.success(`Voucher number updated: ${voucherNumber}`);
                }}
            />
        </DefaultLayout >
    );
};

export default UpdateVoucher;