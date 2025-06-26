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
import { useParams } from 'react-router-dom';
import useLedger from '../../../hooks/useLedger';

const CreateVoucher = () => {
    const { id } = useParams();
    const { GetVoucherById, Vouchers, CreateVoucherEntry } = useVoucher();

    const {getLedger,Ledger  } = useLedger();
    const theme = useSelector(state => state?.persisted?.theme);
    const [vaaluee, setvaaluee] = useState({});
    const customStyles = createCustomStyles(theme?.mode);
    const [ledgers, setLedgers] = useState([]); // You'll need to fetch these from your API

    useEffect(() => {
        GetVoucherById(id);
        getLedger()
        // Fetch ledgers here
        // Example: fetchLedgers().then(data => setLedgers(data));
    }, []);
console.log(Ledger,"jjhh");
    const handleSubmit = async (values) => {
        try {
            await CreateVoucherEntry({
                voucherNumber: values.voucherNumber,
                supplierInvoiceNumber: values.supplierInvoiceNumber,
                date: values.date,
                entries: values.entries
            });
            // Handle success (show message, redirect, etc.)
        } catch (error) {
            // Handle error
        }
    };

    const validationSchema = Yup.object().shape({
        voucherNumber: Yup.string().required('Voucher number is required'),
        supplierInvoiceNumber: Yup.string().required('Supplier invoice number is required'),
        date: Yup.date().required('Date is required'),
        // entries: Yup.array().of(
        //     Yup.object().shape({
        //         ledger: Yup.object().required('Ledger is required'),
        //         credit: Yup.number().when('debit', {
        //             is: (debit) => !debit || debit === 0,
        //             then: Yup.number().required('Either credit or debit is required').min(0.01, 'Credit must be greater than 0'),
        //             otherwise: Yup.number().equals([0], 'Cannot have both credit and debit')
        //         }),
        //         debit: Yup.number().when('credit', {
        //             is: (credit) => !credit || credit === 0,
        //             then: Yup.number().required('Either credit or debit is required').min(0.01, 'Debit must be greater than 0'),
        //             otherwise: Yup.number().equals([0], 'Cannot have both credit and debit')
        //         })
        //     })
        // ).min(1, 'At least one entry is required')
    });

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Configurator/Create Voucher" />
            <div>
                <Formik
                    initialValues={{
                        voucherNumber: '',
                        supplierInvoiceNumber: '',
                        date: '',
                        entries: [{
                            ledger: null,
                            credit: 0,
                            debit: 0,
                            narration: ''
                        }]
                    }}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue, values }) => (
                        <Form>
                            <div className="flex flex-col gap-9">
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                        <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                            Create Entry For {Vouchers?.typeOfVoucher}
                                        </h3>
                                    </div>

                                    <div className="flex flex-col p-6.5">
                                        <div className='flex flex-row gap-4'>
                                            <div className="flex-2 min-w-[250px] mb-4">
                                                <label className="mb-2.5 block text-black dark:text-white">{Vouchers?.typeOfVoucher} Number</label>
                                                <Field
                                                    type="text"
                                                    name="voucherNumber"
                                                    placeholder="Enter No"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="voucherNumber" component="div" className="text-red-500" />
                                            </div>
                                            <div className="flex-2 min-w-[250px] mb-4">
                                                <label className="mb-2.5 block text-black dark:text-white">Supplier Invoice Number</label>
                                                <Field
                                                    type="text"
                                                    name="supplierInvoiceNumber"
                                                    placeholder="Enter No"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="supplierInvoiceNumber" component="div" className="text-red-500" />
                                            </div>
                                            <div className="flex-2 min-w-[250px] mb-4">
                                                <label className="mb-2.5 block text-black dark:text-white">Date</label>
                                                <Field
                                                    name="date"
                                                    type="date"
                                                    placeholder="Enter Date"
                                                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="date" component="div" className="text-red-500" />
                                            </div>
                                        </div>

                                        {/* Entries Table */}
                                        <FieldArray name="entries">
                                            {({ push, remove }) => (
                                                <div className="mb-6">
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full table-auto">
                                                            <thead>
                                                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Particulars</th>
                                                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Narration</th>
                                                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Credit</th>
                                                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Debit</th>
                                                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {values.entries.map((entry, index) => (
                                                                    <tr key={index}>
                                                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                                            <ReactSelect
                                                                                name={`entries.${index}.ledger`}
                                                                                value={entry.ledger}
                                                                                onChange={(option) => setFieldValue(`entries.${index}.ledger`, option)}
                                                                                options={ledgers}
                                                                                styles={customStyles}
                                                                                className="bg-white dark:bg-form-Field w-full"
                                                                                classNamePrefix="react-select"
                                                                                placeholder="Select Ledger"
                                                                            />
                                                                            <ErrorMessage name={`entries.${index}.ledger`} component="div" className="text-red-500" />
                                                                        </td>
                                                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                                            <Field
                                                                                type="text"
                                                                                name={`entries.${index}.narration`}
                                                                                placeholder="Narration"
                                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                            />
                                                                        </td>
                                                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                                            <Field
                                                                                type="number"
                                                                                name={`entries.${index}.credit`}
                                                                                placeholder="0.00"
                                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                min="0"
                                                                                step="0.01"
                                                                            />
                                                                            <ErrorMessage name={`entries.${index}.credit`} component="div" className="text-red-500" />
                                                                        </td>
                                                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                                            <Field
                                                                                type="number"
                                                                                name={`entries.${index}.debit`}
                                                                                placeholder="0.00"
                                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                min="0"
                                                                                step="0.01"
                                                                            />
                                                                            <ErrorMessage name={`entries.${index}.debit`} component="div" className="text-red-500" />
                                                                        </td>
                                                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                                            {index > 0 && (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => remove(index)}
                                                                                    className="text-red-500 hover:text-red-700"
                                                                                >
                                                                                    <MdDelete size={20} />
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
                                                        onClick={() => push({ ledger: null, credit: 0, debit: 0, narration: '' })}
                                                        className="flex items-center gap-2 mt-4 text-primary"
                                                    >
                                                        <IoMdAdd /> Add Row
                                                    </button>
                                                </div>
                                            )}
                                        </FieldArray>

                                        <div className="flex justify-center mt-4 items-center">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex md:w-[120px] w-[170px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
                                            >
                                                {isSubmitting ? 'Saving...' : 'Create Voucher'}
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

export default CreateVoucher;