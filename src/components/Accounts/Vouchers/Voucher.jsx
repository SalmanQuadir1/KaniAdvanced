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
import { GET_VoucherBYID} from '../../../Constants/utils';
import useVoucher from '../../../hooks/useVoucher';

const Voucher = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const theme = useSelector(state => state?.persisted?.theme);
    const customStyles = createCustomStyles(theme?.mode);
     const {
        Voucher,
        edit,
        currentVoucher,

        handleSubmit,

        nature,
        invoice,
        under,

    } = useVoucher();
    
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!id);
    const [showNumberingModal, setShowNumberingModal] = useState(false);
    const [gstDetails, setgstDetails] = useState([]);
    const [hsnOptions, sethsnOptions] = useState([]);
    const [vaaluee, setvaaluee] = useState({});
    
    const { Locations, getAllLocation } = useLocation();
    const hsnCode = useSelector(state => state?.persisted?.hsn);

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
        { value: 'Registration Srinagar', label: 'Registration Srinagar' },
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

    // Initial values
    const initialValues = {
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
        defGstRegist: '',
        methodVouchNumbering: false,
        gstratedetails: '',
        hsnCode: null,
        gstDescription: '',
        hsn_Sac: '',
    };

    // Fetch voucher by ID if in edit mode
    const fetchVoucherById = async () => {
        if (!id) return;
        
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
                const data = await response.json();
                // Format data for form
                const formattedData = {
                    ...data,
                    actVoucher: data.actVoucher?.toString() || 'true',
                };
                return formattedData;
            } else {
                toast.error('Failed to fetch voucher data');
                return null;
            }
        } catch (error) {
            console.error('Error fetching voucher:', error);
            toast.error('Failed to fetch voucher data');
            return null;
        } finally {
            setFetching(false);
        }
    };

    // Form submission handler
    // const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    //     setLoading(true);
    //     try {
    //         const url = id ? `${UPDATE_VOUCHER_URL}/${id}` : CREATE_VOUCHER_URL;
    //         const method = id ? "PUT" : "POST";
            
    //         const response = await fetch(url, {
    //             method: method,
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${token}`
    //             },
    //             body: JSON.stringify(values)
    //         });

    //         const data = await response.json();
    //         if (response.ok) {
    //             toast.success(id ? 'Voucher updated successfully' : 'Voucher created successfully');
    //             if (!id) {
    //                 resetForm();
    //             }
    //             navigate('/vouchers'); // Navigate to voucher list
    //         } else {
    //             toast.error(data.errorMessage || 'Operation failed');
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("An error occurred");
    //     } finally {
    //         setLoading(false);
    //         setSubmitting(false);
    //     }
    // };

    // Fetch locations and HSN codes
    useEffect(() => {
        getAllLocation();
        
        if (hsnCode.data) {
            const formattedOptions = hsnCode.data.map(hsn => ({
                value: hsn.id,
                label: hsn?.hsnCodeName,
                hsnObject: hsn,
            }));
            sethsnOptions(formattedOptions);
        }
    }, [hsnCode.data]);

    const formattedLocation = Locations?.map(loc => ({
        label: loc.address,
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

    // Render GST details based on selection
    const renderGSTDetails = (values, setFieldValue) => {
        if (values.gstratedetails === "Specify Slab Based Rates") {
            return (
                <div className="mt-4 p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3">Slab Based Rates</h4>
                    {gstDetails.length > 0 ? (
                        gstDetails.map((gst, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4 mb-3">
                                <Field
                                    name={`gstDetails[${index}].greaterThan`}
                                    placeholder="Greater Than"
                                    className="p-2 border rounded"
                                />
                                <Field
                                    name={`gstDetails[${index}].upTo`}
                                    placeholder="Up To"
                                    className="p-2 border rounded"
                                />
                                <Field
                                    name={`gstDetails[${index}].type`}
                                    placeholder="Type"
                                    className="p-2 border rounded"
                                />
                                <Field
                                    name={`gstDetails[${index}].gstRate`}
                                    placeholder="Rate %"
                                    className="p-2 border rounded"
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No slab rates configured</p>
                    )}
                </div>
            );
        } else if (values.gstratedetails === "Use GST Classification") {
            return (
                <div className="mt-4 p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3">HSN Code Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">HSN Code</label>
                            <ReactSelect
                                name="hsnCode"
                                value={hsnOptions?.find(opt => opt.value === values.hsnCode?.id)}
                                onChange={(opt) => {
                                    setFieldValue("hsnCode", opt?.hsnObject);
                                    setvaaluee({ hsnCode: opt?.hsnObject });
                                }}
                                options={hsnOptions}
                                styles={customStyles}
                                placeholder="Select HSN Code"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">GST Description</label>
                            <Field
                                name="gstDescription"
                                value={vaaluee?.hsnCode?.productDescription || ''}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">HSN/SAC</label>
                            <Field
                                name="hsn_Sac"
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="block mb-2">IGST %</label>
                                <Field
                                    value={vaaluee?.hsnCode?.igst || ''}
                                    disabled
                                    className="w-full p-2 border rounded bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">CGST %</label>
                                <Field
                                    value={vaaluee?.hsnCode?.cgst || ''}
                                    disabled
                                    className="w-full p-2 border rounded bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">SGST %</label>
                                <Field
                                    value={vaaluee?.hsnCode?.sgst || ''}
                                    disabled
                                    className="w-full p-2 border rounded bg-gray-100"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    if (fetching) {
        return (
            <DefaultLayout>
                <Breadcrumb pageName={id ? "Update Voucher" : "Create Voucher"} />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName={id ? "Update Voucher" : "Create Voucher"} />
            
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                        {id ? "Update Voucher" : "Create Voucher"}
                    </h3>
                </div>

                <Formik
                    initialValues={initialValues}
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
                                                value={defGstRegist.find(opt => opt.value === values.defGstRegist)}
                                                onChange={(opt) => setFieldValue('defGstRegist', opt?.value)}
                                                options={defGstRegist}
                                                styles={customStyles}
                                                placeholder="Select registration"
                                            />
                                        </div>
                                    </div>
                                    
                                    {renderYesNoRadio('methodVouchNumbering', 'Use Common Voucher Numbering for All GST Registrations', values, setFieldValue)}
                                </div>

                                {/* GST Details */}
                                <div className="mb-8">
                                    <h4 className="text-lg font-semibold mb-4 text-black dark:text-white">GST Details</h4>
                                    <div className="mb-6">
                                        <label className="mb-2.5 block text-black dark:text-white">GST Calculation Method</label>
                                        <ReactSelect
                                            name="gstratedetails"
                                            value={gstdetails.find(opt => opt.value === values.gstratedetails)}
                                            onChange={(opt) => setFieldValue('gstratedetails', opt?.value)}
                                            options={gstdetails}
                                            styles={customStyles}
                                            placeholder="Select GST method"
                                        />
                                    </div>
                                    
                                    {renderGSTDetails(values, setFieldValue)}
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center mt-8">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || loading}
                                        className="flex items-center justify-center md:w-[150px] w-full md:h-[44px] h-[44px] rounded-lg bg-primary font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                {id ? 'Updating...' : 'Creating...'}
                                            </div>
                                        ) : (
                                            id ? 'Update Voucher' : 'Create Voucher'
                                        )}
                                    </button>
                                    
                                    {id && (
                                        <button
                                            type="button"
                                            onClick={() => navigate(-1)}
                                            className="ml-4 flex items-center justify-center md:w-[100px] w-full md:h-[44px] h-[44px] rounded-lg bg-gray-200 font-medium text-gray-700 hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                    )}
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
                    setgstDetails(data);
                    setShowNumberingModal(false);
                }}
            />
        </DefaultLayout>
    );
};

export default Voucher;