import React, { useEffect } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import useLedger from '../../hooks/useLedger';

const CreateLedger = () => {

    const { getGroup, Group, handleSubmit } = useLedger()
    const theme = useSelector(state => state?.persisted?.theme);
    const customStyles = createCustomStyles(theme?.mode);

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
        { value: 'SALES', label: 'SALES' },
        { value: 'PURCHASE', label: 'PURCHASE' },
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
                    onSubmit={(values) => {
                        handleSubmit(values)
                        // Handle form submission here
                    }}
                >
                    {({ values, setFieldValue }) => (
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
                                                    <label className="mb-2.5 block text-black dark:text-white">Name</label>
                                                    <Field
                                                        type="text"
                                                        name="name"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Ledger Category</label>
                                                    <ReactSelect
                                                        name="ledgerType"
                                                        value={ledgerType.find(option => option.value === values.ledgerType)}
                                                        onChange={(option) => setFieldValue('ledgerType', option.value)}
                                                        options={ledgerType}
                                                        styles={customStyles}
                                                        className="bg-white dark:bg-form-Field w-full"
                                                        classNamePrefix="react-select"
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
                                                        type="text"
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
                                            <h4 className="mb-2.5 font-medium text-black dark:text-white">Under</h4>
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
                                            <h4 className="mb-2.5 font-semibold text-2xl text-center text-black dark:text-white">Banking Details</h4>
                                            <div className='flex flex-col gap-4'>
                                                <div className="mb-4.5">
                                                    {/* Yes/No Select for Bank Details */}
                                                    <div className="flex-1 min-w-[250px] z-20 bg-transparent dark:bg-form-Field mb-4">
                                                        <label className="mb-2.5 block text-black dark:text-white">Provide bank details</label>
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
                                                        <label className="mb-2.5 block text-black dark:text-white">Registration type</label>
                                                        <ReactSelect
                                                            name="registrationType"
                                                            value={gstRegistrationTypes.find(option => option.value === values.registrationType)}
                                                            onChange={(option) => setFieldValue('registrationType', option.value)}
                                                            options={gstRegistrationTypes}
                                                            styles={customStyles}
                                                            className="bg-white dark:bg-form-Field w-full"
                                                            classNamePrefix="react-select"
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
                                                <h4 className="font-medium text-black dark:text-white">Opening Balance Type:</h4>
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
                                                    <span className="text-black dark:text-white">Credit (CR)</span>
                                                </label>
                                            </div>

                                            {/* Opening Balance Input */}
                                            <h4 className="mb-2.5 font-medium text-black dark:text-white">
                                                Opening Balance (on {openingBalancesDate})
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
                                                className="flex w-[120px] h-[37px] pt-2 rounded-lg justify-center bg-primary p-2.5 font-medium text-sm text-gray hover:bg-opacity-90"
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