import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ReactSelect from 'react-select';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import useVoucher from '../../../hooks/useVoucher';
import { GET_VoucherNos_URL, customStyles as createCustomStyles } from '../../../Constants/utils';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useLedger from '../../../hooks/useLedger';
import { toast } from 'react-toastify';

const CreateReceipt = () => {
    const { id } = useParams();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const { GetVoucherById, Vouchers, handleCreateVoucher } = useVoucher();
    const [voucherNos, setvoucherNos] = useState('')
    const { getLedger, Ledger } = useLedger();
    const theme = useSelector(state => state?.persisted?.theme);
    const customStyles = createCustomStyles(theme?.mode);

    // Get all ledgers except those with credit balance for "from" account
    const allLedgers = Ledger?.map(ledg => ({
        value: ledg?.id,
        label: ledg?.name,
        obj: ledg,
        balance: ledg?.openingBalances,
        type: ledg.typeOfOpeningBalance
    }));

    // Bank and Cash ledgers for "to" account (where money is received)
    const BankCashLedgers = Ledger.filter(ledg => 
        ledg?.name && (ledg.name.toLowerCase().includes('bank') || ledg.name.toLowerCase().includes('cash'))
    );

    const bankCashOptions = BankCashLedgers?.map(ledg => ({
        value: ledg?.id,
        label: ledg?.name,
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

    const validationSchema = Yup.object().shape({
        recieptNumber: Yup.string().required('Voucher number is required'),
        fromLedgerId: Yup.string().required('Received from account is required'),
        toLedgerId: Yup.string().required('Deposited to account is required'),
        amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
        date: Yup.date().required('Date is required'),
        modeOfReceipt: Yup.string().required('Mode of receipt is required'),
    });

    const modeOfReceipt = [
        { value: 'Cash', label: 'Cash' },
        { value: 'Cheque', label: 'Cheque' },
        { value: 'Bank Transfer', label: 'Bank Transfer' },
        { value: 'Card', label: 'Card' },
        { value: 'Online', label: 'Online' },
    ];

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Configurator/Create Receipt" />
            <div>
                <Formik
                    initialValues={{
                        recieptNumber: voucherNos,
                        date: '',
                        voucherId: Number(id),
                        fromLedgerId: "",
                        toLedgerId: "",
                        amount: "",
                        fromBalance: "",
                        toBalance: "",
                        modeOfReceipt: "",
                        reference: "",
                        narration: "",
                        typeOfVoucher: "Receipt"
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
                                            Receipt Entry
                                        </h3>
                                    </div>

                                    <div className="flex flex-col p-6.5">
                                        {/* Top Section */}
                                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
                                            <div>
                                                <label className="mb-2.5 block text-black dark:text-white">Receipt Number</label>
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

                                            <div>
                                                <label className="mb-2.5 block text-black dark:text-white">Mode of Receipt</label>
                                                <ReactSelect
                                                    name="modeOfReceipt"
                                                    value={modeOfReceipt.find(opt => opt.value === values.modeOfReceipt)}
                                                    onChange={(option) => setFieldValue('modeOfReceipt', option?.value || '')}
                                                    options={modeOfReceipt}
                                                    classNamePrefix="react-select"
                                                    placeholder="Select Mode"
                                                    menuPortalTarget={document.body}
                                                    styles={{ ...customStyles, menuPortal: (base) => ({ ...base, zIndex: 100000 }) }}
                                                />
                                                <ErrorMessage name="modeOfReceipt" component="div" className="text-red-500 text-xs mt-1" />
                                            </div>
                                        </div>

                                        {/* From and To Accounts */}
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                                            <div>
                                                <label className="mb-2.5 block text-black dark:text-white">Received From <span className='text-red-600'>*</span></label>
                                                <ReactSelect
                                                    name='fromLedgerId'
                                                    value={allLedgers?.find(opt => opt.value === values.fromLedgerId)}
                                                    onChange={(option) => {
                                                        setFieldValue('fromLedgerId', option?.value || '');
                                                        setFieldValue('fromBalance', option?.balance || 0);
                                                    }}
                                                    options={allLedgers}
                                                    classNamePrefix="react-select"
                                                    placeholder="Select Party"
                                                    menuPortalTarget={document.body}
                                                    styles={{ ...customStyles, menuPortal: (base) => ({ ...base, zIndex: 100000 }) }}
                                                />
                                                <ErrorMessage name="fromLedgerId" component="div" className="text-red-500 text-xs mt-1" />
                                            </div>

                                            <div>
                                                <label className="mb-2.5 block text-black dark:text-white">Deposited To <span className='text-red-600'>*</span></label>
                                                <ReactSelect
                                                    name='toLedgerId'
                                                    value={bankCashOptions?.find(opt => opt.value === values.toLedgerId)}
                                                    onChange={(option) => {
                                                        setFieldValue('toLedgerId', option?.value || '');
                                                        setFieldValue('toBalance', option?.balance || 0);
                                                    }}
                                                    options={bankCashOptions}
                                                    classNamePrefix="react-select"
                                                    placeholder="Select Bank/Cash Account"
                                                    menuPortalTarget={document.body}
                                                    styles={{ ...customStyles, menuPortal: (base) => ({ ...base, zIndex: 100000 }) }}
                                                />
                                                <ErrorMessage name="toLedgerId" component="div" className="text-red-500 text-xs mt-1" />
                                            </div>
                                        </div>

                                        {/* Amount and Reference */}
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                                            <div>
                                                <label className="mb-2.5 block text-black dark:text-white">Amount <span className='text-red-600'>*</span></label>
                                                <Field
                                                    type="number"
                                                    name="amount"
                                                    placeholder="Enter Amount"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white"
                                                />
                                                <ErrorMessage name="amount" component="div" className="text-red-500 text-xs mt-1" />
                                            </div>

                                            <div>
                                                <label className="mb-2.5 block text-black dark:text-white">Reference No.</label>
                                                <Field
                                                    type="text"
                                                    name="reference"
                                                    placeholder="Cheque/Transaction/Invoice No."
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white"
                                                />
                                            </div>
                                        </div>

                                        {/* Additional fields based on mode */}
                                        {values.modeOfReceipt === 'Cheque' && (
                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                                                <div>
                                                    <label className="mb-2.5 block text-black dark:text-white">Cheque Number</label>
                                                    <Field
                                                        type="text"
                                                        name="chequeNumber"
                                                        placeholder="Enter Cheque Number"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2.5 block text-black dark:text-white">Cheque Date</label>
                                                    <Field
                                                        type="date"
                                                        name="chequeDate"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {values.modeOfReceipt === 'Bank Transfer' && (
                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                                                <div>
                                                    <label className="mb-2.5 block text-black dark:text-white">Transaction ID</label>
                                                    <Field
                                                        type="text"
                                                        name="transactionId"
                                                        placeholder="Enter Transaction ID"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2.5 block text-black dark:text-white">Bank Name</label>
                                                    <Field
                                                        type="text"
                                                        name="bankName"
                                                        placeholder="Enter Bank Name"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {values.modeOfReceipt === 'Card' && (
                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                                                <div>
                                                    <label className="mb-2.5 block text-black dark:text-white">Card Number (Last 4 digits)</label>
                                                    <Field
                                                        type="text"
                                                        name="cardNumber"
                                                        placeholder="Enter last 4 digits"
                                                        maxLength="4"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2.5 block text-black dark:text-white">Card Type</label>
                                                    <Field
                                                        as="select"
                                                        name="cardType"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white"
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="Visa">Visa</option>
                                                        <option value="Mastercard">Mastercard</option>
                                                        <option value="Amex">American Express</option>
                                                        <option value="Other">Other</option>
                                                    </Field>
                                                </div>
                                            </div>
                                        )}

                                        {/* Narration */}
                                        <div className="mb-4">
                                            <label className="mb-2.5 block text-black dark:text-white">Narration</label>
                                            <Field
                                                as="textarea"
                                                name="narration"
                                                placeholder="Enter narration"
                                                rows="3"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white"
                                            />
                                        </div>

                                        {/* Summary */}
                                        {values.fromLedgerId && values.toLedgerId && values.amount && (
                                            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                <h4 className="font-semibold mb-2 text-green-800 dark:text-green-300">Receipt Summary</h4>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>Received From: {allLedgers?.find(opt => opt.value === values.fromLedgerId)?.label}</div>
                                                    <div>Deposited To: {bankCashOptions?.find(opt => opt.value === values.toLedgerId)?.label}</div>
                                                    <div>Amount: ₹{values.amount}</div>
                                                    <div>Mode: {values.modeOfReceipt}</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <div className="flex justify-center mt-6">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex md:w-[220px] w-full justify-center bg-primary p-3 font-medium text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                                            >
                                                {isSubmitting ? 'Creating...' : 'Create Receipt'}
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
    );
};

export default CreateReceipt;