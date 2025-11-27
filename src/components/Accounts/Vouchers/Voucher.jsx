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

import { customStyles as createCustomStyles } from '../../../Constants/utils';
import { useSelector } from 'react-redux';
import Modall from '../../Products/Modall';
import NumberingDetailsModal from './NumberingDetailsModal';
import useLocation from '../../../hooks/useLocation';
const Voucher = () => {
    const [gstDetails, setgstDetails] = useState([])
    const [hsnOptions, sethsnOptions] = useState([])
    const [showNumberingModal, setShowNumberingModal] = useState(false);
    const [numberingDetails, setNumberingDetails] = useState(null);
    const {
        Voucher,
        edit,
        currentVoucher,

        handleSubmit,

        nature,
        invoice,
        under,

    } = useVoucher(numberingDetails);
    const theme = useSelector(state => state?.persisted?.theme);
    const [vaaluee, setvaaluee] = useState({})
    const customStyles = createCustomStyles(theme?.mode);


    const hsnCode = useSelector(state => state?.persisted?.hsn);
    useEffect(() => {
        if (hsnCode.data) {
            const formattedOptions = hsnCode.data.map(hsn => ({
                value: hsn.id,
                label: hsn?.hsnCodeName,
                hsnObject: hsn,
            }));
            sethsnOptions(formattedOptions);
        }
    }, [hsnCode]);

    const typeOfVoucher = [

        { value: 'Journal', label: 'Journal' },
        { value: 'Sales', label: 'Sales' },

        { value: 'Purchase', label: 'Purchase' },
        { value: 'Reciept', label: 'Reciept' },

        { value: 'Payment', label: 'Payment' },
        { value: 'CreditNote', label: 'CreditNote' },

        { value: 'DebitNote', label: 'DebitNote' },
        { value: 'Contra', label: 'Contra' },

    ]
    const gstdetails = [

        { value: 'Specify Slab Based Rates', label: 'Specify Slab Based Rates' },
        { value: 'Use GST Classification ', label: 'Use GST Classification' },

    ]


    const defGstRegist = [

        { value: 'Regsitartion Delhi', label: 'RegsitartionDelhi' },
        { value: 'Regsitartion Srinagar', label: 'Regsitartion Srinagar' },

    ]
    const gstOptions = [

        { value: 'Applicable', label: 'Applicable' },
        { value: 'NotApplicable', label: 'NotApplicable' },

    ]


    const yesNo = [

        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' },

    ]
    const NumberingBehaviour = [

        { value: 'ReNumberVoucher', label: 'ReNumber Voucher' },
        { value: 'RetainOriginalVoucherNo', label: 'Retain Original Voucher No' },

    ]

    const methodOfvoucher = [

        { value: 'Automatic', label: 'Automatic' },
        { value: 'AutomaticManualOverride', label: 'Automatic(Manual Override)' },
        { value: 'Manual', label: 'Manual' },
        { value: 'MultiUserAuto', label: 'MultiUser Auto' },
        { value: 'None', label: 'None' },

    ]
    const [gstDetailModal, setgstDetailModal] = useState(false)
    const handlerateDetails = (option, setFieldValue) => {
        console.log(option, "optoooon");
        setFieldValue('gstratedetails', option.value);
        if (option.value === "Specify Slab Based Rates") {

            setgstDetailModal(true)
        }

    }


    const handleModalSubmit = (values) => {

        console.log(values, "ggjio");
        setgstDetails(values)

    }

    const { Locations, getAllLocation } = useLocation()

    useEffect(() => {

        getAllLocation();
    }, []);

    const formattedLocation = Locations?.map(id => ({
        label: id.address,
        value: id.id
    }));



    return (
        <DefaultLayout>
            <Breadcrumb pageName={edit ? "Configurator/Update Voucher" : "Configurator/Create Voucher"} />
            <div>
                <Formik
                    initialValues={currentVoucher}
                    enableReinitialize={true}


                    validate={values => {
                        const errors = {};
                        if (!values.name) {
                            errors.name = 'Required';
                        }



                        return errors;
                    }}

                    onSubmit={handleSubmit}
                >

                    {({ isSubmitting, setFieldValue, values }) => (
                        <Form>
                            <div className="flex flex-col gap-9">
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                        <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                            {edit ? "Update Voucher" : "Create Voucher"}
                                        </h3>
                                    </div>

                                    <div className="flex flex-col  p-6.5">
                                        <div className='flex flex-row gap-4'>
                                            <div className="flex-2 min-w-[250px] mb-4">
                                                <label className="mb-2.5 block text-black dark:text-white">Voucher Name</label>
                                                <Field
                                                    type="text"
                                                    name="name"
                                                    placeholder="Enter Name"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="name" component="div" className="text-red-500" />
                                            </div>

                                        </div>




                                        <div className="mb-4.5 flex flex-col gap-6">
                                            <div className='flex flex-row gap-4'>


                                                <div className="flex-1 min-w-[250px] z-20 bg-transparent dark:bg-form-Field">
                                                    <label className="mb-2.5 block text-black dark:text-white">Type Of Voucher</label>
                                                    <ReactSelect
                                                        name="typeOfVoucher"
                                                        value={typeOfVoucher.find(option => option.value === values.typeOfVoucher) || null}
                                                        onChange={(option) => setFieldValue('typeOfVoucher', option ? option.value : null)}
                                                        options={typeOfVoucher}
                                                        styles={customStyles}
                                                        className="bg-white dark:bg-form-Field w-full"
                                                        classNamePrefix="react-select"
                                                        placeholder="Type Of Voucher"
                                                    />
                                                </div>
                                                <div className="flex-2 min-w-[100px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Abbrevation</label>
                                                    <Field
                                                        name={`abbreviation`}
                                                        type="text"
                                                        value={values.abbreviation}
                                                        placeholder="Abbreviation"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-[250px] z-60 bg-transparent dark:bg-form-Field">
                                                    <label className="mb-2.5 block text-black dark:text-white">Activate This Voucher Type</label>
                                                    <ReactSelect
                                                        name="actVoucher"
                                                        value={yesNo.find(option => option.value === values.actVoucher) || null}
                                                        onChange={(option) => setFieldValue('actVoucher', option ? option.value : null)}
                                                        options={yesNo}
                                                        styles={customStyles}
                                                        className="bg-white dark:bg-form-Field w-full"
                                                        classNamePrefix="react-select"
                                                        placeholder="Activate This Voucher Type"
                                                    />
                                                </div>

                                            </div>
                                            <div className='flex flex-row gap-4'>
                                                <div className="flex-1 min-w-[250px]  bg-transparent dark:bg-form-Field">
                                                    <label className="mb-2.5 block text-black dark:text-white">Method of Voucher Numbering</label>
                                                    <ReactSelect
                                                        name="methodOfVoucher"
                                                        value={methodOfvoucher.find(option => option.value === values.methodOfvoucher) || null}
                                                        onChange={(option) => setFieldValue('methodOfvoucher', option ? option.value : null)}
                                                        options={methodOfvoucher}
                                                        styles={customStyles}
                                                        className="bg-white dark:bg-form-Field w-full"
                                                        classNamePrefix="react-select"
                                                        placeholder="Method Of voucher Numbering"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-[250px] z-20 bg-transparent dark:bg-form-Field">
                                                    <label className="mb-2.5 block text-black dark:text-white">Numbering Behaviour On Insertion/Deletion</label>
                                                    <ReactSelect
                                                        name="numbInsertDelete"
                                                        value={NumberingBehaviour.find(option => option.value === values.numbInsertDelete) || null}
                                                        onChange={(option) => setFieldValue('numbInsertDelete', option ? option.value : null)}
                                                        options={NumberingBehaviour}
                                                        styles={customStyles}
                                                        className="bg-white dark:bg-form-Field w-full"
                                                        classNamePrefix="react-select"
                                                        placeholder="Numbering Behaviour On Insertion"
                                                    />
                                                </div>

                                            </div>

                                            <div className="flex flex-col gap-4 mt-6">
                                                {[
                                                    { name: 'setAdditionalNumb', label: 'Set/Alter Additional Numbering Detail', modal: true },
                                                    { name: 'unusedVchNos', label: 'Show Unused Vchr No"s in transaction for retain the original Vchr No. Behaviour' },
                                                    {
                                                        name: 'dateForVchs',
                                                        label: 'Use Effective Date For Voucher',
                                                        isDateField: true // Mark this field as needing a date field
                                                    },
                                                    { name: 'zeroTransactionAllowed', label: 'Allow Zero Value Transaction' },
                                                    { name: 'optionalVchType', label: 'Make This Voucher Type As (Optional) By Default' },
                                                    { name: 'narrationVchs', label: 'Allow Narration In Voucher' },
                                                    { name: 'narratLedgerVch', label: 'Provide Narration For Each Voucher In Ledger' },
                                                    ...(values.typeOfVoucher !== "Journal" ? [
                                                        { name: 'defAccounting', label: 'Enable Default Accounting Allocation' },
                                                    ] : []),
                                                    ...(values.typeOfVoucher === "Journal" || values.typeOfVoucher === "Payment" || values.typeOfVoucher === "debitNote" ? [
                                                        { name: 'costPurchase', label: 'Track Addditional Cost for Purchases' },
                                                    ] : []),
                                                    ...(values.typeOfVoucher === "Journal" ? [
                                                        { name: 'whatsAppVch', label: 'WhatsApp Voucher After Saving' },
                                                    ] : []),
                                                    ...(values.typeOfVoucher === "Sales" ? [
                                                        { name: 'inteCompTransfer', label: 'Activate Inter Company Transfer' },
                                                    ] : []),
                                                ].map(({ name, label, modal, isDateField }) => (
                                                    <div key={name} className="flex flex-col gap-2 w-full max-w-[500px]">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-black dark:text-white w-1/2">{label}</label>
                                                            <div className="flex gap-4">
                                                                <label className="flex items-center gap-1 text-black dark:text-white">
                                                                    <input
                                                                        type="radio"
                                                                        name={name}
                                                                        value="true"
                                                                        checked={values[name] === true}
                                                                        onChange={() => {
                                                                            setFieldValue(name, true);
                                                                            if (modal) setShowNumberingModal(true);
                                                                        }}
                                                                        className="form-radio text-primary"
                                                                    />
                                                                    Yes
                                                                </label>
                                                                <label className="flex items-center gap-1 text-black dark:text-white">
                                                                    <input
                                                                        type="radio"
                                                                        name={name}
                                                                        value="false"
                                                                        checked={values[name] === false}
                                                                        onChange={() => setFieldValue(name, false)}
                                                                        className="form-radio text-primary"
                                                                    />
                                                                    No
                                                                </label>
                                                            </div>
                                                        </div>
                                                        {/* Show date field if this is the dateForVchs field and it's true */}
                                                        {isDateField && values[name] === true && (
                                                            <div className="flex items-center justify-between">
                                                                <label className="text-black dark:text-white w-1/2">Effective Date</label>

                                                                <Field
                                                                    name="effectiveDate"
                                                                    type="date"
                                                                    value={values.effectiveDate || ''}
                                                                    onChange={(e) => setFieldValue('effectiveDate', e.target.value)}
                                                                    placeholder="effective Date"
                                                                    className=" rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>








                                        </div>

                                        <h1 className='items-center text-center font-semibold text-xl '>Printing Details</h1>
                                        <div className='flex flex-row gap-4'>

                                            <div className="flex flex-col gap-4 mt-6 w-[400px]">

                                                {[




                                                    { name: 'printVch', label: 'Print Voucher After Saving' },

                                                    ...(values.typeOfVoucher == "Sales" ? [
                                                        { name: 'posInvoicing', label: 'Use For Pos Invoicing' },

                                                    ] : []),

                                                    ...(values.typeOfVoucher === "Sales" ? [

                                                        { name: 'setAlterDecl', label: 'Set/Alter Declaration' },
                                                    ] : []),



                                                ].map(({ name, label }) => (
                                                    <div key={name} className="flex items-center justify-between w-full max-w-[500px]">
                                                        <label className="text-black dark:text-white w-1/2">{label}</label>
                                                        <div className="flex gap-4">
                                                            <label className="flex items-center gap-1 text-black dark:text-white">
                                                                <input
                                                                    type="radio"
                                                                    name={name}
                                                                    value="true"
                                                                    checked={values[name] === true}
                                                                    onChange={() => setFieldValue(name, true)}
                                                                    className="form-radio text-primary"
                                                                />
                                                                Yes
                                                            </label>
                                                            <label className="flex items-center gap-1 text-black dark:text-white">
                                                                <input
                                                                    type="radio"
                                                                    name={name}
                                                                    value="false"
                                                                    checked={values[name] === false}
                                                                    onChange={() => setFieldValue(name, false)}
                                                                    className="form-radio text-primary"
                                                                />
                                                                No
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}


                                            </div>





                                            <div className="flex-2 min-w-[250px] ml-7">
                                                <label className="mb-2.5 block text-black dark:text-white ">Default Godown</label>





                                                <Field
                                                    name="defaultGodown"
                                                    component={ReactSelect}
                                                    options={[{ label: 'View All Locations', value: null }, ...formattedLocation]}
                                                    styles={customStyles}
                                                    placeholder="Select Location"
                                                    value={formattedLocation.find(option => option.value === values.defaultGodown)}
                                                    onChange={option => setFieldValue('defaultGodown', option ? { id: option.value } : '')}
                                                />




                                            </div>




                                            {
                                                values.typeOfVoucher == "Sales" && (

                                                    <div className="flex-2 min-w-[250px] ml-7">
                                                        <label className="mb-2.5 block text-black dark:text-white ">Default Title To Print</label>
                                                        <Field
                                                            name={`defTitlePrint`}
                                                            type="text"
                                                            value={values.defTitlePrint}
                                                            placeholder="def Title Print"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>


                                                )
                                            }



                                        </div>
                                        <div className='flex flex-row gap-4 mt-6 mb-7'>
                                            {
                                                values.posInvoicing && (
                                                    <>



                                                        <div className="flex-2 min-w-[300px] ">
                                                            <label className="mb-2.5 block text-black dark:text-white ">Message To Print (1)</label>
                                                            <Field
                                                                name={`msgPrintOne`}
                                                                type="text"
                                                                value={values.msgPrintOne}
                                                                placeholder="Enter msg PrintTwo"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>

                                                        <div className="flex-2 min-w-[300px] ">
                                                            <label className="mb-2.5 block text-black dark:text-white ">Message To Print (2)</label>
                                                            <Field
                                                                name={`msgPrintTwo`}
                                                                type="text"
                                                                value={values.msgPrintTwo}
                                                                placeholder="msg Print Two"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>

                                                    </>



                                                )
                                            }
                                        </div>
                                        <div className='flex gap-4'>
                                        <div className=' gap-4 mt-6 mb-7'>
                                            {
                                                values.typeOfVoucher == "Sales" && (

                                                    <div className="flex-2 min-w-[300px] ">
                                                        <label className="mb-2.5 block text-black dark:text-white ">Default Bank</label>
                                                        <Field
                                                            name={`defBank`}
                                                            type="text"
                                                            value={values.defBank}
                                                            placeholder="Def Bank"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>


                                                )
                                            }

                                        </div>

                                        <div className=' gap-4 mt-6 mb-7'>
                                            {
                                                values.typeOfVoucher == "Sales" && (

                                                    <div className="flex-2 min-w-[300px] ">
                                                        <label className="mb-2.5 block text-black dark:text-white ">Default Jurisdiction</label>
                                                        <Field
                                                            name={`defJurisdiction`}
                                                            type="text"
                                                            value={values.defJurisdiction}
                                                            placeholder="Def Jurisdiction"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>


                                                )
                                            }

                                        </div>
                                        </div>
                                        <div className='flex flex-row gap-4'>








                                        </div>



                                        <div className='flex flex-row gap-4'>

                                            <div className="flex flex-col gap-4 mt-6 w-[400px] mb-7">

                                                {[






                                                    ...(values.typeOfVoucher === "Reciept" ? [

                                                        { name: 'printFormal', label: 'Print Formal Receipt After Saving' },
                                                    ] : []),



                                                ].map(({ name, label }) => (
                                                    <div key={name} className="flex items-center justify-between w-full max-w-[500px]">
                                                        <label className="text-black dark:text-white w-1/2">{label}</label>
                                                        <div className="flex gap-4">
                                                            <label className="flex items-center gap-1 text-black dark:text-white">
                                                                <input
                                                                    type="radio"
                                                                    name={name}
                                                                    value="true"
                                                                    checked={values[name] === true}
                                                                    onChange={() => setFieldValue(name, true)}
                                                                    className="form-radio text-primary"
                                                                />
                                                                Yes
                                                            </label>
                                                            <label className="flex items-center gap-1 text-black dark:text-white">
                                                                <input
                                                                    type="radio"
                                                                    name={name}
                                                                    value="false"
                                                                    checked={values[name] === false}
                                                                    onChange={() => setFieldValue(name, false)}
                                                                    className="form-radio text-primary"
                                                                />
                                                                No
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}


                                            </div>






                                        </div>


                                        <h1 className='items-center text-center font-semibold text-xl '>Statutory Details</h1>

                                        <div className="flex-1 min-w-[250px] z-20 bg-transparent dark:bg-form-Field">
                                            <label className="mb-2.5 block text-black dark:text-white">Default Gst Registration</label>
                                            <ReactSelect
                                                name="defGstRegist"
                                                value={defGstRegist.find(option => option.value === values.defGstRegist) || null}
                                                onChange={(option) => setFieldValue('defGstRegist', option ? option.value : null)}
                                                options={defGstRegist}
                                                styles={customStyles}
                                                className="bg-white dark:bg-form-Field w-full"
                                                classNamePrefix="react-select"
                                                placeholder="Default Gst Registration"
                                            />
                                        </div>

                                        {/* --- subGroup FieldArray --- */}
                                        <div className="flex flex-col gap-4 mt-6 w-[400px] mb-7">

                                            {[








                                                { name: 'methodVouchNumbering', label: 'Use Common Voucher Numbering Series For All Gst Registration' },




                                            ].map(({ name, label }) => (
                                                <div key={name} className="flex items-center justify-between w-full max-w-[500px]">
                                                    <label className="text-black dark:text-white w-1/2">{label}</label>
                                                    <div className="flex gap-4">
                                                        <label className="flex items-center gap-1 text-black dark:text-white">
                                                            <input
                                                                type="radio"
                                                                name={name}
                                                                value="true"
                                                                checked={values[name] === true}
                                                                onChange={() => setFieldValue(name, true)}
                                                                className="form-radio text-primary"
                                                            />
                                                            Yes
                                                        </label>
                                                        <label className="flex items-center gap-1 text-black dark:text-white">
                                                            <input
                                                                type="radio"
                                                                name={name}
                                                                value="false"
                                                                checked={values[name] === false}
                                                                onChange={() => setFieldValue(name, false)}
                                                                className="form-radio text-primary"
                                                            />
                                                            No
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}


                                        </div>
                                        {/* gst */}



                                        <div className="mb-4.5  gap-6">
                                            {/* GST DETAILS Select */}

                                            {/* Conditional Fields based on gstDetails */}


                                            <>

                                                <div className="mb-4.5 mt-6">
                                                    {/* Conditional Rendering: GST Details or HSN Code Section */}
                                                    {/* {gstDetails && gstDetails.length > 0 ? ( */}
                                                    {values.gstratedetails === "Specify Slab Based Rates" ? (

                                                        // Render GST Details Section
                                                        <div className="flex flex-wrap gap-6">
                                                            {gstDetails.map((gst, index) => (
                                                                <div key={index} className="mb-4.5 flex flex-wrap gap-6">
                                                                    <div className="flex-2 min-w-[100px]">
                                                                        <label className="mb-2.5 block text-black dark:text-white">Greater Than</label>
                                                                        <Field
                                                                            name={`gstDetails[${index}].greaterThan`}
                                                                            type="text"
                                                                            value={gst.greaterThan}
                                                                            placeholder="Enter GBP Price"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-2 min-w-[100px]">
                                                                        <label className="mb-2.5 block text-black dark:text-white">Upto</label>
                                                                        <Field
                                                                            name={`gstDetails[${index}].upTo`}
                                                                            type="text"
                                                                            value={gst.upTo}
                                                                            placeholder="Upto"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-2 min-w-[100px]">
                                                                        <label className="mb-2.5 block text-black dark:text-white">Type</label>
                                                                        <Field
                                                                            name={`gstDetails[${index}].type`}
                                                                            type="text"
                                                                            value={gst.type}
                                                                            placeholder="Type"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-2 min-w-[100px]">
                                                                        <label className="mb-2.5 block text-black dark:text-white">Rate</label>
                                                                        <Field
                                                                            name={`gstDetails[${index}].gstRate`}
                                                                            type="text"
                                                                            value={gst.gstRate}
                                                                            placeholder="Rate"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : values.gstratedetails === "Use GST Classification " ? (
                                                        // Render HSN Code and Related Fields Section
                                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                                            <div className="flex-2 min-w-[250px]">
                                                                <label className="mb-2.5 block text-black dark:text-white">
                                                                    HSN Code <span className="text-red-700 text-xl">*</span>
                                                                </label>
                                                                <ReactSelect
                                                                    name="hsnCode"
                                                                    value={hsnOptions?.find((option) => option.value === values.hsnCode?.id) || null}
                                                                    onChange={(option) => setFieldValue("hsnCode", option ? option.hsnObject : null)}
                                                                    options={hsnOptions}
                                                                    styles={customStyles}
                                                                    className="bg-white dark:bg-form-Field"
                                                                    classNamePrefix="react-select"
                                                                    placeholder="Select HSN Code"
                                                                />
                                                            </div>
                                                            <div className="flex-2 min-w-[250px]">
                                                                <label className="mb-2.5 block text-black dark:text-white">IGST (%)</label>
                                                                <Field
                                                                    type="number"
                                                                    value={vaaluee?.hsnCode?.igst}
                                                                    disabled
                                                                    placeholder="Enter IGST Name"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:disabled:bg-slate-600 dark:text-white dark:focus:border-primary"
                                                                />
                                                                <ErrorMessage name="igst" component="div" className="text-red-500" />
                                                            </div>
                                                            <div className="flex-2 min-w-[250px]">
                                                                <label className="mb-2.5 block text-black dark:text-white">CGST (%)</label>
                                                                <Field
                                                                    type="number"
                                                                    value={vaaluee?.hsnCode?.cgst}
                                                                    disabled
                                                                    placeholder="Enter CGST Name"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:disabled:bg-slate-600 dark:text-white dark:focus:border-primary"
                                                                />
                                                                <ErrorMessage name="cgst" component="div" className="text-red-500" />
                                                            </div>
                                                            <div className="flex-2 min-w-[250px]">
                                                                <label className="mb-2.5 block text-black dark:text-white">SGST (%)</label>
                                                                <Field
                                                                    type="number"
                                                                    value={vaaluee?.hsnCode?.sgst}
                                                                    disabled
                                                                    placeholder="Enter SGST Name"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:disabled:bg-slate-600 dark:text-white dark:focus:border-primary"
                                                                />
                                                                <ErrorMessage name="sgst" component="div" className="text-red-500" />
                                                            </div>
                                                            <div className="flex-2 min-w-[250px]">
                                                                <label className="mb-2.5 block text-black dark:text-white">GST Description</label>
                                                                <Field
                                                                    name="gstDescription"
                                                                    value={vaaluee?.hsnCode?.productDescription}
                                                                    type="text"
                                                                    placeholder="Enter GST Description"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                />
                                                            </div>
                                                            <div className="flex-2 min-w-[250px]">
                                                                <label className="mb-2.5 block text-black dark:text-white">HSN/SAC</label>
                                                                <Field
                                                                    name="hsn_Sac"
                                                                    type="text"
                                                                    placeholder="Enter HSN/SAC"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>




















                                            </>

                                        </div>


                                        <div className="flex justify-center mt-4 items-center">
                                            <button
                                                type="submit"
                                                className="flex md:w-[120px] w-[170px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
                                            >
                                                {edit ? "Update Voucher" : "Create Voucher"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* View Table */}

                            </div>
                        </Form>

                    )}


                </Formik>
            </div>
            <NumberingDetailsModal
                show={showNumberingModal}
                onHide={() => setShowNumberingModal(false)}
                onSubmit={(data) => {
                    setNumberingDetails(data);
                    // You can also store this data in your form values if needed
                    // setFieldValue('numberingDetails', data);
                }}
            />

        </DefaultLayout >
    )
}

export default Voucher
