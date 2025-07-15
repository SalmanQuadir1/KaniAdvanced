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
    const { GetVoucherById, Vouchers, CreateVoucherEntry,handleCreateVoucher } = useVoucher();

    const { getLedger, Ledger } = useLedger();
    const theme = useSelector(state => state?.persisted?.theme);
    const [vaaluee, setvaaluee] = useState({});
    const customStyles = createCustomStyles(theme?.mode);
    const [ledgers, setLedgers] = useState([]); // You'll need to fetch these from your API
    const [openingbalance2, setopeningbalance2] = useState(0)
    useEffect(() => {
        GetVoucherById(id);
        getLedger()
        // Fetch ledgers here
        // Example: fetchLedgers().then(data => setLedgers(data));
    }, []);
    console.log(Ledger, "jjhh");


    const LedgerData = Ledger?.map(ledg => ({
        value: ledg?.id,
        label: ledg?.name,
        obj:ledg,
        balance: ledg?.openingBalance

    }));

    const handleledgerIdelect = (option, setFieldValue) => {
        setFieldValue('ledgerId', option.value);
        setFieldValue('currentBalance', option?.balance || 0);
        console.log(option?.balance, "lklklk");
    };
    const handleAccounttSelect = (option, index, setFieldValue) => {

        setFieldValue(`paymentDetails.${index}.ledgerId`, option.value);
        setFieldValue(`paymentDetails.${index}.openingbalance2`, option?.balance || 0);
        // setopeningbalance2(option?.balance || 0)
        // setFieldValue('currentBalance', option?.balance || 0);
        console.log(option?.balance, "lklklk");
    };




   

    const validationSchema = Yup.object().shape({
        recieptNumber: Yup.string().required('Voucher number is required'),
        supplierInvoiceNumber: Yup.string().required('Supplier invoice number is required'),
        date: Yup.date().required('Date is required'),
        // paymentDetails: Yup.array().of(
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
                        recieptNumber: '',
                        supplierInvoiceNumber: '',
                        date: '',
                        voucherId:id,
                        ledgerId: "",
                        currentBalance: "",
                        paymentDetails: [{
                            ledgerId: null,
                            openingBalance: 0,
                            credit: 0,
                            amount:0,
                            debit: 0,
                            narration: ''
                        }]
                    }}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={handleCreateVoucher}
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
                                                <label className="mb-2.5 block text-black dark:text-white">{Vouchers?.typeOfVoucher} Voucher Number</label>
                                                <Field
                                                    type="text"
                                                    name="recieptNumber"
                                                    placeholder="Enter No"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="recieptNumber" component="div" className="text-red-500" />
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
                                        <div className='flex flex-row gap-4'>


                                            {
                                                (Vouchers?.typeOfVoucher === "Payment" || Vouchers?.typeOfVoucher === "Contra") && (
                                                    <>
                                                        <div className="flex-2 min-w-[250px] mb-4">
                                                            <label className="mb-2.5 block text-black dark:text-white">Account</label>
                                                            <ReactSelect
                                                                name={`paymentDetails.ledgerId`}
                                                                // value={values?.ledgerId}
                                                                value={LedgerData.find(option => option.value === values.ledgerId?.id)}
                                                                onChange={(option) => handleledgerIdelect(option, setFieldValue)}
                                                                options={LedgerData}
                                                                styles={customStyles}
                                                                className="bg-white dark:bg-form-Field w-full z-5"
                                                                classNamePrefix="react-select"
                                                                placeholder="Select Ledger"
                                                            // menuShouldBlockScroll={true}
                                                            />
                                                            <ErrorMessage name="supplierInvoiceNumber" component="div" className="text-red-500" />
                                                        </div>
                                                        <div className="flex-2 min-w-[250px] mb-4">
                                                            <label className="mb-2.5 block text-black dark:text-white">Current Balance</label>
                                                            <Field
                                                                type="text"
                                                                name="currentBalance"
                                                                placeholder="Enter No"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                            />
                                                            <ErrorMessage name="currentBalance" component="div" className="text-red-500" />
                                                        </div>
                                                    </>
                                                )
                                            }
                                        </div>

                                        {/* paymentDetails Table */}
                                        <FieldArray name="paymentDetails">
                                            {({ push, remove }) => (
                                                <div className="mb-6">
                                                    <div className="">
                                                        <table className="w-full ">
                                                            <thead>
                                                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                                                    <th className="py-4 px-4 font-medium text-black dark:text-white w-[200px]">Particulars</th>
                                                                    <th className="py-4 px-4 font-medium text-black dark:text-white w-[200px]">Current Balance</th>
                                                                    {(Vouchers?.typeOfVoucher === "Payment" || Vouchers?.typeOfVoucher === "Contra") && (
                                                                        <th className="py-4 px-4 font-medium text-black dark:text-white">Amount</th>
                                                                    )}

                                                                    {(Vouchers?.typeOfVoucher === "Sales" || Vouchers?.typeOfVoucher === "Purchase") && (
                                                                        <>
                                                                            <th className="py-4 px-4 font-medium text-black dark:text-white">Credit</th>
                                                                            <th className="py-4 px-4 font-medium text-black dark:text-white">Debit</th>
                                                                        </>
                                                                    )}

                                                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Action</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                                {values.paymentDetails.map((entry, index) => (
                                                                    <tr key={index}>
                                                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                                            <ReactSelect
                                                                                name={`paymentDetails.${index}.ledgerId`}
                                                                                value={LedgerData.find(option => option.value === entry.ledgerId?.id)}
                                                                                // value={entry.ledgerId}
                                                                                // onChange={(option) => setFieldValue(`paymentDetails.${index}.ledger`, option)}
                                                                                onChange={(option) => handleAccounttSelect(option, index, setFieldValue)}
                                                                                options={LedgerData}
                                                                                styles={customStyles}
                                                                                className="bg-white dark:bg-form-Field w-full z-5"
                                                                                classNamePrefix="react-select"
                                                                                placeholder="Select Ledger"
                                                                            // menuShouldBlockScroll={true}
                                                                            />
                                                                            <ErrorMessage name={`paymentDetails.${index}.ledgerId`} component="div" className="text-red-500" />
                                                                        </td>
                                                                        <td>    <div className="flex-2 min-w-[250px] ">
                                                                          
                                                                            <Field
                                                                                type="text"
                                                                                name={`paymentDetails.${index}.openingbalance2`}
                                                                                placeholder="Enter No"
                                                                                readOnly
                                                                                className="w-full bg-graydark rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                            />
                                                                            <ErrorMessage name="currentBalance" component="div" className="text-red-500" />
                                                                        </div></td>
                                                                        {(Vouchers?.typeOfVoucher === "Payment" || Vouchers?.typeOfVoucher === "Contra") && (
                                                                            <>
                                                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                                                    <Field
                                                                                        type="number"
                                                                                        name={`paymentDetails.${index}.amount`}
                                                                                        placeholder="0.00"
                                                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                        min="0"
                                                                                        step="0.01"
                                                                                    />
                                                                                    <ErrorMessage name={`paymentDetails.${index}.amount`} component="div" className="text-red-500" />
                                                                                </td>

                                                                            </>
                                                                        )}

                                                                        {(Vouchers?.typeOfVoucher === "Sales" || Vouchers?.typeOfVoucher === "Purchase") && (
                                                                            <>

                                                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                                                    <Field
                                                                                        type="number"
                                                                                        name={`paymentDetails.${index}.credit`}
                                                                                        placeholder="0.00"
                                                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                        min="0"
                                                                                        step="0.01"
                                                                                    />
                                                                                    <ErrorMessage name={`paymentDetails.${index}.credit`} component="div" className="text-red-500" />
                                                                                </td>
                                                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                                                    <Field
                                                                                        type="number"
                                                                                        name={`paymentDetails.${index}.debit`}
                                                                                        placeholder="0.00"
                                                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                        min="0"
                                                                                        step="0.01"
                                                                                    />
                                                                                    <ErrorMessage name={`paymentDetails.${index}.debit`} component="div" className="text-red-500" />
                                                                                </td>
                                                                            </>
                                                                        )}
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
                                                        onClick={() => push({ ledgerId: null, credit: 0, debit: 0, narration: '' })}
                                                        className="flex items-center gap-2 mt-4 text-primary"
                                                    >
                                                        <IoMdAdd /> Add Row
                                                    </button>
                                                </div>
                                            )}
                                        </FieldArray>

                                        <div className="flex-2 min-w-[250px] mb-4">
                                            <label className="mb-2.5 block text-black dark:text-white">Narration</label>

                                            <Field
                                                as="textarea"
                                                name="narration"
                                                placeholder="Narration"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                            />

                                        </div>

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