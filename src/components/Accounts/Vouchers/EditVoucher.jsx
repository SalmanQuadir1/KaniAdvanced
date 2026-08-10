// src/pages/Voucher/EditVoucher.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { FaSave, FaArrowLeft, FaSpinner } from 'react-icons/fa';

import ReactSelect from 'react-select';
import { customStyles as createCustomStyles, EDIT_ENTRY_URL } from '../../../Constants/utils';


import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../Breadcrumbs/Breadcrumb';
import useVoucher from '../../../hooks/useVoucher';
import useLedger from '../../../hooks/useLedger';

const EditVoucher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const theme = useSelector((state) => state?.persisted?.theme);
  const customStyles = createCustomStyles(theme?.mode);

  const { GetVoucherById, Vouchers, updateVoucher } = useVoucher();
  const { getLedger, Ledger, getLedgerIncome, LedgerIncome } = useLedger();

  const [loading, setLoading] = useState(true);
  const [voucherData, setVoucherData] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [selectedLedger, setSelectedLedger] = useState(null);

  // Fetch voucher data
  useEffect(() => {
    const fetchVoucherData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${EDIT_ENTRY_URL}/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch voucher data');
        }

        const data = await response.json();
        setVoucherData(data);

        // Set initial values from fetched data
        setInitialValues({
          recieptNumber: data.recieptNumber || '',
          date: data.date || new Date().toISOString().split('T')[0],
          ledgerId: data.ledgerId || '',
          narration: data.narration || '',
          amount: data.amount || 0,
          typeOfVoucher: data.typeOfVoucher || '',
          paymentDate: data.paymentDate || '',
          modeOfPayment: data.modeOfPayment || '',
          chequeNumber: data.chequeNumber || '',
          cardNumber: data.cardNumber || '',
          transactionId: data.transactionId || '',
          cashAmount: data.cashAmount || null,
          cashLedgerId: data.cashLedgerId || null,
          cardAmount: data.cardAmount || null,
          cardLedgerId: data.cardLedgerId || null,
          bankAmount: data.bankAmount || null,
          bankLedgerId: data.bankLedgerId || null,
          chequeAmount: data.chequeAmount || null,
          chequeLedgerId: data.chequeLedgerId || null,
          destinationLedgerId: data.destinationLedgerId || null,
          igstLedgerId: data.igstLedgerId || null,
          cgstLedgerId: data.cgstLedgerId || null,
          sgstLedgerId: data.sgstLedgerId || null,
          discountLedgerId: data.discountLedgerId || null,
          discountAmount: data.discountAmount || 0,
          roundOffLedgerId: data.roundOffLedgerId || null,
          roundOffAmount: data.roundOffAmount || 0,
          courrierLedgerId: data.courrierLedgerId || null,
          courrierAmount: data.courrierAmount || 0,
          totalAmount: data.totalAmount || 0,
          totalGst: data.totalGst || 0,
          totalCgst: data.totalCgst || 0,
          totalSgst: data.totalSgst || 0,
          totalIgst: data.totalIgst || 0,
          paymentReceivedType: data.paymentReceivedType || '',
          amountReceived: data.amountReceived || 0,
          currency: data.currency || 'INR',
          currencyValue: data.currencyValue || 1,
          salesChannel: data.salesChannel || '',
          isExport: data.isExport || false,
          supplierInvoiceNumber: data.supplierInvoiceNumber || '',
          giftVoucherAmount: data.giftVoucherAmount || 0,
          giftVoucherLedgerId: data.giftVoucherLedgerId || null,
          toLedgerId: data.toLedgerId || null,
          currentBalance: data.currentBalance || '',
          currentBalance2: data.currentBalance2 || '',
          paymentDetails: data.paymentDetails || [
            {
              productsId: null,
              orderProductId: null,
              mrp: 0,
              basePrice: 0,
              rate: 0,
              exclusiveGst: 0,
              wholesalePrice: 0,
              discount: 0,
              quantity: 1,
              value: 0,
              voucherAmount: 0,
              igstRate: 0,
              gstAmount: 0,
              gstCalculation: null,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching voucher:', error);
        toast.error('Failed to load voucher data');
        navigate('/vouchers');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVoucherData();
      getLedger();
      getLedgerIncome();
    }
  }, [id, token]);

  // Validation schema
  const validationSchema = Yup.object().shape({
    recieptNumber: Yup.string().required('Voucher number is required'),
    ledgerId: Yup.string().required('Party account is required'),
    amount: Yup.number().min(0, 'Amount must be greater than or equal to 0'),
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(`/api/entryPayment/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update voucher');
      }

      toast.success('Voucher updated successfully!');
      navigate('/vouchers');
    } catch (error) {
      console.error('Error updating voucher:', error);
      toast.error(error.message || 'Failed to update voucher');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Loading voucher...
            </p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (!initialValues) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-red-500">Voucher not found</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Edit Voucher" />

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="bg-white dark:bg-boxdark rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/vouchers')}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Edit Voucher #{voucherData?.recieptNumber || id}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {voucherData?.typeOfVoucher || 'Voucher'} - Update details
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  voucherData?.status === 'COMPLETED'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : voucherData?.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                {voucherData?.status || 'DRAFT'}
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="px-6 py-6">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Voucher Number */}
                    <div>
                      <label className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Voucher Number <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        name="recieptNumber"
                        placeholder="Enter voucher number"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 py-3 px-4 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        disabled
                      />
                    </div>

                    {/* Date */}
                    <div>
                      <label className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date
                      </label>
                      <Field
                        type="date"
                        name="date"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent py-3 px-4 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      />
                    </div>

                    {/* Ledger/Party Account */}
                    <div className="col-span-2">
                      <label className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Party Account <span className="text-red-500">*</span>
                      </label>
                      <ReactSelect
                        name="ledgerId"
                        value={
                          Ledger?.find(
                            (ledger) => ledger.id === values.ledgerId,
                          )?.name || ''
                        }
                        onChange={(option) => {
                          setFieldValue('ledgerId', option?.value || '');
                        }}
                        options={
                          Ledger?.map((ledger) => ({
                            value: ledger.id,
                            label: ledger.name,
                          })) || []
                        }
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Select Party Account"
                        menuPortalTarget={document.body}
                        styles={{
                          ...customStyles,
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 100000,
                          }),
                        }}
                      />
                      <ErrorMessage
                        name="ledgerId"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {/* Amount */}
                    <div className="col-span-2">
                      <label className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Amount <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="number"
                        name="amount"
                        placeholder="0.00"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent py-3 px-4 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        min="0"
                        step="0.01"
                      />
                      <ErrorMessage
                        name="amount"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {/* Mode of Payment */}
                    <div className="col-span-2">
                      <label className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Mode of Payment
                      </label>
                      <ReactSelect
                        name="modeOfPayment"
                        value={
                          values.modeOfPayment
                            ? {
                                value: values.modeOfPayment,
                                label: values.modeOfPayment,
                              }
                            : null
                        }
                        onChange={(option) => {
                          setFieldValue('modeOfPayment', option?.value || '');
                        }}
                        options={[
                          { value: 'Cash', label: 'Cash' },
                          { value: 'Card', label: 'Card' },
                          { value: 'Cheque', label: 'Cheque' },
                          { value: 'Bank Transfer', label: 'Bank Transfer' },
                        ]}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Select Mode of Payment"
                        menuPortalTarget={document.body}
                        styles={{
                          ...customStyles,
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 100000,
                          }),
                        }}
                      />
                    </div>

                    {/* Payment Details - Conditional fields based on mode */}
                    {values.modeOfPayment === 'Cheque' && (
                      <>
                        <div>
                          <label className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Cheque Number
                          </label>
                          <Field
                            type="text"
                            name="chequeNumber"
                            placeholder="Enter cheque number"
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent py-3 px-4 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Cheque Amount
                          </label>
                          <Field
                            type="number"
                            name="chequeAmount"
                            placeholder="0.00"
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent py-3 px-4 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                            step="0.01"
                          />
                        </div>
                      </>
                    )}

                    {values.modeOfPayment === 'Card' && (
                      <>
                        <div>
                          <label className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Card Number
                          </label>
                          <Field
                            type="text"
                            name="cardNumber"
                            placeholder="Enter card number"
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent py-3 px-4 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Card Amount
                          </label>
                          <Field
                            type="number"
                            name="cardAmount"
                            placeholder="0.00"
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent py-3 px-4 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                            step="0.01"
                          />
                        </div>
                      </>
                    )}

                    {values.modeOfPayment === 'Bank Transfer' && (
                      <>
                        <div>
                          <label className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Transaction ID
                          </label>
                          <Field
                            type="text"
                            name="transactionId"
                            placeholder="Enter transaction ID"
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent py-3 px-4 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Bank Amount
                          </label>
                          <Field
                            type="number"
                            name="bankAmount"
                            placeholder="0.00"
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent py-3 px-4 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                            step="0.01"
                          />
                        </div>
                      </>
                    )}

                    {/* Narration */}
                    <div className="col-span-2">
                      <label className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Narration
                      </label>
                      <Field
                        as="textarea"
                        name="narration"
                        rows="4"
                        placeholder="Enter narration..."
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent py-3 px-4 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <FaSave className="text-sm" />
                          Update Voucher
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/vouchers')}
                      className="flex-1 py-3 px-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditVoucher;
