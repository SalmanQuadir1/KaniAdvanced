import React, { useEffect } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import useLedger from '../../hooks/useLedger';
import * as Yup from 'yup';

const CreateLedger = () => {

    const { getGroup, Group, handleSubmit } = useLedger()
    const theme = useSelector(state => state?.persisted?.theme);
    const customStyles = createCustomStyles(theme?.mode);





    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Name is required')
            .min(2, 'Name must be at least 2 characters'),

        ledgerType: Yup.string()
            .required('Ledger Category is required'),





        //   mobileNo: Yup.string()
        //     .required('Mobile No is required')
        //     .matches(/^[0-9]{10}$/, 'Mobile No must be 10 digits'),

        //   email: Yup.string()
        //     .email('Invalid email address')
        //     .required('Email is required'),

        //   city: Yup.string()
        //     .required('City is required'),

        //   country: Yup.string()
        //     .required('Country is required'),

        //   category: Yup.string()
        //     .required('Category is required'),

        //   maximumDiscountApplicable: Yup.number()
        //     .min(0, 'Discount cannot be negative')
        //     .max(100, 'Discount cannot exceed 100%')
        //     .nullable(),

        //   setAlterDealingProducts: Yup.string()
        //     .required('Please select an option'),

        //   accountGroup: Yup.object()
        //     .shape({
        //       id: Yup.string().required('Account Group is required')
        //     })
        //     .nullable()
        //     .required('Account Group is required'),

        //   // Mailing Details
        //   mailingName: Yup.string()
        //     .required('Mailing Name is required'),

        //   mailingAddress: Yup.string()
        //     .required('Mailing Address is required'),

        //   state: Yup.string()
        //     .required('State is required'),

        //   mailingCountry: Yup.string()
        //     .required('Country is required'),

        //   pincode: Yup.string()
        //     .required('Pincode is required')
        //     .matches(/^[0-9]{6}$/, 'Pincode must be 6 digits'),

        // Tax Registration Details
        //   panNo: Yup.string()
        //     .required('PAN/TAN No is required')
        //     .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),

        registrationType: Yup.string()
            .required('Registration Type is required'),


        //   gstin: Yup.string()
        //     .nullable()
        //     .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format'),

        //   setAfterDealingProduct: Yup.string()
        //     .required('Please select an option'),



        typeOfOpeningBalance: Yup.string()
            .required('Opening Balance Type is required')
            .oneOf(['DEBIT', 'CREDIT'], 'Invalid balance type'),

        openingBalances: Yup.number()
            .required('Opening Balance is required')
            .min(0, 'Balance cannot be negative'),

        // Conditional validation for bank details
        provideBankDetails: Yup.string()
            .required('Please specify if bank details are provided'),

        // Bank details validation when provideBankDetails is "true"



    });

    // Mock data for select options
    const gstRegistrationTypes = [
        { value: 'unknown', label: 'Unknown' },
        { value: 'composition', label: 'Composition' },
        { value: 'regular', label: 'Regular' },
        { value: 'unregistered', label: 'Unregistered/Consumer' }
    ];
    const ledgerType = [
        { value: '', label: 'SELECT' },
        { value: 'BANK', label: 'BANK' },
        { value: 'CASH', label: 'CASH' },
        { value: 'SUPPLIER', label: 'SUPPLIER' },
        { value: 'CUSTOMER', label: 'CUSTOMER' },
        { value: 'PAYMENT', label: 'PAYMENT' },
        { value: 'SALES', label: 'SALES' },
        { value: 'PURCHASE', label: 'PURCHASE' },
        { value: 'GIFTVOUCHER', label: 'GIFT VOUCHER' },


        { value: 'PRIMARY', label: 'PRIMARY' },
        { value: 'DUTIES&TAXES', label: 'DUTIES & TAXES' },
        { value: 'DIRECTEXPENSES', label: 'DIRECT EXPENSES' },
        { value: 'DIRECTINCOME', label: 'DIRECT INCOME' },
        { value: 'INDIRECTEXPENSES', label: 'INDIRECT EXPENSES' },
        { value: 'INDIRECTINCOME', label: 'INDIRECT INCOME' },
    ];
    useEffect(() => {
        getGroup()

    }, [])
    console.log(Group, "====+++");

    const formattedGroup = Group.map(gr => ({
        label: gr.groupName,
        value: gr.id
    }));


    const underOptions = [
        { value: 'capital_account', label: 'Capital Account' }
    ];
    const currentYear = new Date().getFullYear().toString().slice(-2); // Gets last 2 digits (e.g., "25" for 2025)
    const openingBalancesDate = `1-Apr-${currentYear}`;
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Ledger Creation" />
            <div>
                <Formik
                    initialValues={{
                        name: '',
                        mobileNo: '',
                        ledgerType: "",
                        email: '',
                        city: "",


                        country: "",
                        category: "",

                        maximumDiscountApplicable: "",
                        setAlterDealingProducts: "",
                        under: '',
                        // Mailing Details
                        mailingName: "",
                        mailingAddress: "",
                        mailingstate: "",
                        mailingCountry: "",
                        pincode: "",

                        // Banking Details


                        // Tax Registration Details
                        panOrTanNo: "",


                        gstinOrUin: "",

                        registrationType: "regular",
                        setAlterAdditionalGstDetails: "",

                        // balance:"",
                        // credit:"",
                        // debit:"",






                        include: 'None',


                        openingBalances: '',
                        previousOpBalance: '',
                        accountGroup: { id: "" },


                        provideBankDetails: 'no',
                        bankName: '',
                        accountNumber: '',
                        ifscCode: '',
                        branch: '',
                        accountType: '',
                        typeOfopeningBalance: "",
                        previousOpType: ""
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        handleSubmit(values);
                        setSubmitting(false);
                    }}
                >
                    {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                        <Form>
                            <div className="flex flex-col gap-9">
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                        <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                            Ledger Creation
                                        </h3>
                                    </div>

                                    <div className="flex flex-col p-6.5">
                                        {/* Name and Mobile No */}
                                        <div className="mb-4.5 flex flex-col gap-6">
                                            <div className='flex flex-row gap-4'>
                                                <div className="flex-1 min-w-[200px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Name <span className='text-red-600 ml-1'>*</span></label>
                                                    <Field
                                                        type="text"
                                                        name="name"
                                                        className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary ${errors.name && touched.name ? 'border-red-500' : ''
                                                            }`}
                                                    />
                                                    <ErrorMessage
                                                        name="name"
                                                        component="div"
                                                        className="text-red-600 text-sm mt-1"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Ledger Category <span className='text-red-600 ml-1'>*</span></label>
                                                    <ReactSelect
                                                        name="ledgerType"
                                                        value={ledgerType.find(option => option.value === values.ledgerType)}
                                                        onChange={(option) => setFieldValue('ledgerType', option.value)}
                                                        options={ledgerType}
                                                        styles={customStyles}
                                                        className="bg-white dark:bg-form-Field w-full"
                                                        classNamePrefix="react-select"
                                                    />
                                                    <ErrorMessage
                                                        name="ledgerType"
                                                        component="div"
                                                        className="text-red-600 text-sm mt-1"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-[200px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Mobile No</label>
                                                    <Field
                                                        type="text"
                                                        name="mobileNo"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-[200px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Email</label>
                                                    <Field
                                                        type="text"
                                                        name="email"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-[200px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">City</label>
                                                    <Field
                                                        type="text"
                                                        name="city"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>
                                            </div>

                                        </div>

                                        <div className="mb-4.5 flex flex-col gap-6">
                                            <div className='flex flex-row gap-4'>
                                                <div className="flex-1 min-w-[200px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Country</label>
                                                    <Field
                                                        type="text"
                                                        name="country"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-[200px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Category</label>
                                                    <Field
                                                        type="text"
                                                        name="category"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-[200px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Max discount Applicable %</label>
                                                    <Field
                                                        type="Number"
                                                        name="maximumDiscountApplicable"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>


                                            </div>

                                        </div>
                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Set/After Dealing Product</label>

                                            <div className="flex items-center gap-4">
                                                <label className="flex items-center">
                                                    <Field
                                                        type="radio"
                                                        name="setAlterDealingProducts"
                                                        value="true"
                                                        className="mr-2"
                                                    />
                                                    Yes
                                                </label>
                                                <label className="flex items-center">
                                                    <Field
                                                        type="radio"
                                                        name="setAlterDealingProducts"
                                                        value="false"
                                                        className="mr-2"
                                                    />
                                                    No
                                                </label>
                                            </div>
                                        </div>



                                        {/* Under Section */}
                                        <div className="mb-4.5 border-t border-stroke pt-4 dark:border-strokedark">
                                            <h4 className="mb-2.5 font-medium text-black dark:text-white">Under <span className='text-red-600 ml-1'>*</span></h4>
                                            <div className="flex-1 min-w-[250px] z-20 bg-transparent dark:bg-form-Field">
                                                <ReactSelect
                                                    name="accountGroup"
                                                    value={formattedGroup.find(option => option.value === values.accountGroup)}
                                                    onChange={(option) => setFieldValue('accountGroup', { id: option.value })}
                                                    options={formattedGroup}
                                                    styles={customStyles}
                                                    className="bg-white dark:bg-form-Field w-full"
                                                    classNamePrefix="react-select"
                                                />

                                                <ErrorMessage
                                                    name="accountGroup"
                                                    component="div"
                                                    className="text-red-600 text-sm mt-1"
                                                />
                                            </div>
                                        </div>

                                        {/* Mailing Details */}
                                        <div className="mb-4.5 border-t  border-stroke pt-4 dark:border-strokedark">
                                            <h4 className="mb-2.5 font-semibold text-black text-2xl dark:text-white text-center">Mailing Details</h4>
                                            <div className='flex flex-row  gap-4'>
                                                <div className="flex-1 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Name</label>
                                                    <Field
                                                        type="text"
                                                        name="mailingName"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Address</label>
                                                    <Field
                                                        type="text"
                                                        name="mailingAddress"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">State</label>
                                                    <Field
                                                        type="text"
                                                        name="state"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>


                                            </div>
                                        </div>
                                        <div className="mb-4.5 border-t  border-stroke pt-4 dark:border-strokedark">

                                            <div className='flex flex-row  gap-4'>
                                                <div className="flex-1 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Country</label>
                                                    <Field
                                                        type="text"
                                                        name="mailingCountry"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Pincode</label>
                                                    <Field
                                                        type="text"
                                                        name="pincode"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tax Registration Details */}
                                        <div className="mb-4.5 border-t border-stroke pt-4 dark:border-strokedark">
                                            <h4 className="mb-2.5 font-semibold text-2xl text-center text-black dark:text-white">Banking Details <span className='text-red-600 ml-1'>*</span></h4>
                                            <div className='flex flex-col gap-4'>
                                                <div className="mb-4.5">
                                                    {/* Yes/No Select for Bank Details */}
                                                    <div className="flex-1 min-w-[250px] z-20 bg-transparent dark:bg-form-Field mb-4">
                                                        <label className="mb-2.5 block text-black dark:text-white">Provide bank details <span className='text-red-600 ml-1'>*</span></label>
                                                        <ReactSelect
                                                            name="provideBankDetails"
                                                            value={[
                                                                { value: 'true', label: 'Yes' },
                                                                { value: 'false', label: 'No' }
                                                            ].find(option => option.value === values.provideBankDetails)}
                                                            onChange={(option) => setFieldValue('provideBankDetails', option.value)}
                                                            options={[
                                                                { value: 'true', label: 'Yes' },
                                                                { value: 'false', label: 'No' }
                                                            ]}
                                                            styles={customStyles}
                                                            className="bg-white dark:bg-form-Field w-full"
                                                            classNamePrefix="react-select"
                                                            placeholder="Select"
                                                        />

                                                        <ErrorMessage
                                                            name="provideBankDetails"
                                                            component="div"
                                                            className="text-red-600 text-sm mt-1"
                                                        />
                                                    </div>

                                                    {/* Bank Details Fields (shown only when Yes is selected) */}
                                                    {values?.provideBankDetails === "true" && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-stroke p-4 rounded-lg dark:border-strokedark">
                                                            <div>
                                                                <label className="mb-2.5 block text-black dark:text-white">Bank Name</label>
                                                                <Field
                                                                    name="bankName"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                />


                                                            </div>

                                                            <div>
                                                                <label className="mb-2.5 block text-black dark:text-white">Account Number</label>
                                                                <Field
                                                                    name="accountNumber"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="mb-2.5 block text-black dark:text-white">IFSC Code</label>
                                                                <Field
                                                                    name="ifscCode"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="mb-2.5 block text-black dark:text-white">Branch</label>
                                                                <Field
                                                                    name="branch"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="mb-2.5 block text-black dark:text-white">Account Type</label>
                                                                <Field
                                                                    as="select"
                                                                    name="accountType"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                >
                                                                    <option value="">Select Account Type</option>
                                                                    <option value="savings">Savings</option>
                                                                    <option value="current">Current</option>
                                                                    <option value="od">OD</option>
                                                                    <option value="fd">Fixed Deposit</option>
                                                                </Field>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='flex flex-row gap-4'>

                                                    <div className="flex-1 min-w-[250px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">PAN/T No.</label>
                                                        <Field
                                                            type="text"
                                                            name="panNo"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[250px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">Registration type <span className='text-red-600 ml-1'>*</span></label>
                                                        <ReactSelect
                                                            name="registrationType"
                                                            value={gstRegistrationTypes.find(option => option.value === values.registrationType)}
                                                            onChange={(option) => setFieldValue('registrationType', option.value)}
                                                            options={gstRegistrationTypes}
                                                            styles={customStyles}
                                                            className="bg-white dark:bg-form-Field w-full"
                                                            classNamePrefix="react-select"
                                                        />
                                                        <ErrorMessage
                                                            name="registrationType"
                                                            component="div"
                                                            className="text-red-600 text-sm mt-1"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[250px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">GSTIN/UN</label>
                                                        <Field
                                                            type="text"
                                                            name="gstin"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-[200px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Set/After Additional Gst Detail</label>

                                                    <div className="flex items-center gap-4">
                                                        <label className="flex items-center">
                                                            <Field
                                                                type="radio"
                                                                name="setAfterDealingProduct"
                                                                value="yes"
                                                                className="mr-2"
                                                            />
                                                            Yes
                                                        </label>
                                                        <label className="flex items-center">
                                                            <Field
                                                                type="radio"
                                                                name="setAfterDealingProduct"
                                                                value="no"
                                                                className="mr-2"
                                                            />
                                                            No
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Opening Balance */}
                                        <div className="mb-4.5 border-t border-stroke pt-4 dark:border-strokedark">
                                            {/* Radio Buttons for Opening Balance Type */}
                                            <div className="mb-2.5 flex items-center gap-4">
                                                <h4 className="font-medium text-black dark:text-white">Opening Balance Type: <span className='text-red-600 ml-1'>*</span></h4>
                                                <label className="flex items-center gap-2">
                                                    <Field
                                                        type="radio"
                                                        name="typeOfOpeningBalance"


                                                        value="DEBIT" // Saves as "DR" if selected
                                                        onChange={(e) => {
                                                            setFieldValue('typeOfOpeningBalance', e.target.value);
                                                            setFieldValue('previousOpType', e.target.value);



                                                        }}
                                                        className="h-4 w-4 border-stroke bg-transparent text-primary focus:ring-0 dark:border-form-strokedark dark:bg-slate-700"
                                                    />
                                                    <span className="text-black dark:text-white">Debit (DR)</span>
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <Field
                                                        type="radio"
                                                        name="typeOfOpeningBalance"
                                                        value="CREDIT" // Saves as "CR" if selected
                                                        onChange={(e) => {
                                                            setFieldValue('typeOfOpeningBalance', e.target.value);
                                                            setFieldValue('previousOpType', e.target.value);



                                                        }}
                                                        className="h-4 w-4 border-stroke bg-transparent text-primary focus:ring-0 dark:border-form-strokedark dark:bg-slate-700"
                                                    />
                                                    <ErrorMessage
                                                        name="typeOfOpeningBalance"
                                                        component="div"
                                                        className="text-red-600 text-sm mt-1"
                                                    />
                                                    <span className="text-black dark:text-white">Credit (CR)</span>
                                                </label>
                                            </div>

                                            {/* Opening Balance Input */}
                                            <h4 className="mb-2.5 font-medium text-black dark:text-white">
                                                Opening Balance (on {openingBalancesDate}) <span className='text-red-600 ml-1'>*</span>
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 min-w-[250px]">
                                                    <Field
                                                        type="number"
                                                        name="openingBalances"
                                                        onChange={(e) => {
                                                            setFieldValue('openingBalances', e.target.value);
                                                            setFieldValue('previousOpBalance', e.target.value);



                                                        }}

                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                    />

                                                    <ErrorMessage
                                                        name="openingBalances"
                                                        component="div"
                                                        className="text-red-600 text-sm mt-1"
                                                    />
                                                </div>
                                                {/* Display "CR" if Credit is selected */}
                                                {values.typeOfopeningBalance === "CREDIT" ? (
                                                    <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                                                        Cr.
                                                    </span>
                                                ) : <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                                                    Dr.
                                                </span>}
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="flex justify-center mt-6">
                                            <button
                                                type="submit"
                                                className="flex md:w-[180px] w-[170px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center  bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
                                            >
                                                Create Ledger
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </DefaultLayout>
    )
}

export default CreateLedger