import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ReactSelect from 'react-select';
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import useVoucher from '../../../hooks/useVoucher';
import { GET_VoucherNos_URL, customStyles as createCustomStyles } from '../../../Constants/utils';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useLedger from '../../../hooks/useLedger';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

const CreateJournal = () => {
    const { id } = useParams();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const { GetVoucherById, Vouchers, handleCreateVoucher } = useVoucher();
    const [voucherNos, setvoucherNos] = useState('')
    const { getLedger, Ledger } = useLedger();
    const theme = useSelector(state => state?.persisted?.theme);
    const customStyles = createCustomStyles(theme?.mode);

    // All ledgers
    const LedgerData = Ledger?.map(ledg => ({
        value: ledg?.id,
        label: `${ledg?.name} (${ledg?.ledgerType})`,
        obj: ledg,
        balance: ledg?.openingBalances,
        type: ledg.typeOfOpeningBalance
    }));

    useEffect(() => {
        GetVoucherById(id);
        getLedger();
    }, []);

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
                setvoucherNos(data.nextReceipt);
                return data.nextReceipt;
            } else {
                toast.error(data.errorMessage || "Error");
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

    const calculateTotals = (values) => {
        let totalDebit = 0;
        let totalCredit = 0;

        values.journalEntries.forEach(entry => {
            totalDebit += parseFloat(entry.debit) || 0;
            totalCredit += parseFloat(entry.credit) || 0;
        });

        return {
            totalDebit: totalDebit.toFixed(2),
            totalCredit: totalCredit.toFixed(2),
            difference: (totalDebit - totalCredit).toFixed(2),
            isBalanced: Math.abs(totalDebit - totalCredit) < 0.01
        };
    };

    const validationSchema = Yup.object().shape({
        recieptNumber: Yup.string().required('Voucher number is required'),
        date: Yup.date().required('Date is required'),
        journalEntries: Yup.array().of(
            Yup.object().shape({
                ledgerId: Yup.string().required('Account is required'),
                debit: Yup.number().min(0, 'Debit cannot be negative'),
                credit: Yup.number().min(0, 'Credit cannot be negative'),
            })
        ).test('balanced', 'Total Debit must equal Total Credit', function(entries) {
            if (!entries) return true;
            let totalDebit = 0;
            let totalCredit = 0;
            entries.forEach(entry => {
                totalDebit += parseFloat(entry.debit) || 0;
                totalCredit += parseFloat(entry.credit) || 0;
            });
            return Math.abs(totalDebit - totalCredit) < 0.01;
        })
    });

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Configurator/Create Journal" />
            <div>
                <Formik
                    initialValues={{
                        recieptNumber: voucherNos,
                        date: '',
                        voucherId: Number(id),
                        narration: "",
                        typeOfVoucher: "Journal",
                        journalEntries: [{
                            id: uuidv4(),
                            ledgerId: "",
                            debit: "",
                            credit: "",
                            narration: ""
                        }]
                    }}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={handleCreateVoucher}
                >
                    {({ isSubmitting, setFieldValue, values }) => {
                        const totals = calculateTotals(values);

                        return (
                            <Form>
                                <div className="flex flex-col gap-9">
                                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                            <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                                Journal Entry
                                            </h3>
                                        </div>

                                        <div className="flex flex-col p-6.5">
                                            {/* Top Section */}
                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                                                <div>
                                                    <label className="mb-2.5 block text-black dark:text-white">Journal Number</label>
                                                    <Field
                                                        type="text"
                                                        name="recieptNumber"
                                                        placeholder="Enter No"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white"
                                                    />
                                                    <ErrorMessage name="recieptNumber" component="div" className="text-red-500" />
                                                </div>

                                                <div>
                                                    <label className="mb-2.5 block text-black dark:text-white">Date</label>
                                                    <Field
                                                        name="date"
                                                        type="date"
                                                        className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white"
                                                    />
                                                    <ErrorMessage name="date" component="div" className="text-red-500" />
                                                </div>
                                            </div>

                                            {/* Journal Entries Table */}
                                            <FieldArray name="journalEntries">
                                                {({ push, remove }) => (
                                                    <div className="mb-6">
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full border-collapse">
                                                                <thead>
                                                                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                                                        <th className="py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300 w-1/3">
                                                                            Account
                                                                        </th>
                                                                        <th className="py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300 w-1/6">
                                                                            Debit (₹)
                                                                        </th>
                                                                        <th className="py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300 w-1/6">
                                                                            Credit (₹)
                                                                        </th>
                                                                        <th className="py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300 w-1/4">
                                                                            Narration
                                                                        </th>
                                                                        <th className="py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300 w-1/12">
                                                                            Action
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {values.journalEntries.map((entry, index) => (
                                                                        <tr key={entry.id}>
                                                                            <td className="border-b py-4 px-3">
                                                                                <ReactSelect
                                                                                    name={`journalEntries.${index}.ledgerId`}
                                                                                    value={LedgerData?.find(opt => opt.value === entry.ledgerId)}
                                                                                    onChange={(option) => setFieldValue(`journalEntries.${index}.ledgerId`, option?.value || '')}
                                                                                    options={LedgerData}
                                                                                    classNamePrefix="react-select"
                                                                                    placeholder="Select Account"
                                                                                    menuPortalTarget={document.body}
                                                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                                                    isClearable
                                                                                />
                                                                                <ErrorMessage name={`journalEntries.${index}.ledgerId`} component="div" className="text-red-500 text-xs mt-1" />
                                                                            </td>
                                                                            <td className="border-b py-4 px-3">
                                                                                <Field
                                                                                    type="number"
                                                                                    name={`journalEntries.${index}.debit`}
                                                                                    placeholder="0.00"
                                                                                    className="w-full py-2 px-3 text-sm rounded border focus:border-primary"
                                                                                    onChange={(e) => {
                                                                                        const debit = e.target.value;
                                                                                        setFieldValue(`journalEntries.${index}.debit`, debit);
                                                                                        if (debit && parseFloat(debit) > 0) {
                                                                                            setFieldValue(`journalEntries.${index}.credit`, '');
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </td>
                                                                            <td className="border-b py-4 px-3">
                                                                                <Field
                                                                                    type="number"
                                                                                    name={`journalEntries.${index}.credit`}
                                                                                    placeholder="0.00"
                                                                                    className="w-full py-2 px-3 text-sm rounded border focus:border-primary"
                                                                                    onChange={(e) => {
                                                                                        const credit = e.target.value;
                                                                                        setFieldValue(`journalEntries.${index}.credit`, credit);
                                                                                        if (credit && parseFloat(credit) > 0) {
                                                                                            setFieldValue(`journalEntries.${index}.debit`, '');
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </td>
                                                                            <td className="border-b py-4 px-3">
                                                                                <Field
                                                                                    type="text"
                                                                                    name={`journalEntries.${index}.narration`}
                                                                                    placeholder="Line narration"
                                                                                    className="w-full py-2 px-3 text-sm rounded border focus:border-primary"
                                                                                />
                                                                            </td>
                                                                            <td className="border-b py-4 px-3 text-center">
                                                                                {values.journalEntries.length > 1 && (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => remove(index)}
                                                                                        className="text-red-600 hover:text-red-800"
                                                                                    >
                                                                                        <MdDelete size={22} />
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
                                                            onClick={() => push({
                                                                id: uuidv4(),
                                                                ledgerId: "",
                                                                debit: "",
                                                                credit: "",
                                                                narration: ""
                                                            })}
                                                            className="flex items-center gap-2 mt-4 text-primary hover:text-primary/80 font-medium"
                                                        >
                                                            <IoMdAdd size={20} /> Add Row
                                                        </button>

                                                        {/* Summary */}
                                                        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <p className="text-gray-600 dark:text-gray-400">Total Debit</p>
                                                                    <p className="font-bold text-lg">₹{totals.totalDebit}</p>
                                                                </div>
                                                                <div className="text-2xl text-gray-400">=</div>
                                                                <div>
                                                                    <p className="text-gray-600 dark:text-gray-400">Total Credit</p>
                                                                    <p className="font-bold text-lg">₹{totals.totalCredit}</p>
                                                                </div>
                                                                <div className={`px-4 py-2 rounded ${totals.isBalanced ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                    {totals.isBalanced ? '✓ Balanced' : `Difference: ₹${totals.difference}`}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </FieldArray>

                                            {/* Main Narration */}
                                            <div className="mb-4">
                                                <label className="mb-2.5 block text-black dark:text-white">Narration</label>
                                                <Field
                                                    as="textarea"
                                                    name="narration"
                                                    placeholder="Enter overall narration for the journal"
                                                    rows="3"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white"
                                                />
                                            </div>

                                            {/* Submit Button */}
                                            <div className="flex justify-center mt-4">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting || !totals.isBalanced}
                                                    className="flex md:w-[220px] w-full justify-center bg-primary p-3 font-medium text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                                                >
                                                    {isSubmitting ? 'Creating...' : 'Create Journal'}
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

export default CreateJournal;