import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ReactSelect from 'react-select';

import 'flatpickr/dist/themes/material_blue.css'; // Import a Flatpickr theme

import useorder from '../../hooks/useOrder';

import { GET_PRODUCTBYID_URL, GET_ORDERBYID_URL, UPDATE_ORDER_URL, UPDATE_ORDERCREATED_ALL, VIEW_STOCKJOURNALBYID, VERIFY_STOCK_JOURNAL } from '../../Constants/utils';

import { useNavigate, useNavigation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md';
import { IoIosGitMerge } from 'react-icons/io';

const VerifyStockJournals = () => {
  const [StockJournal, setStockJournal] = useState([])
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const [checkAll, setCheckAll] = useState(false);


  const [order, setOrder] = useState(null); // To store fetched product data


  const { token } = currentUser;

  console.log(currentUser, "userrrrrr");






  const [selectedSuppliers, setSelectedSuppliers] = useState([]);


  // const handleCheckboxChange = (supplierId) => {
  //   console.log(supplierId, "sssspppp");
  //   setSelectedSuppliers((prev) =>
  //     prev.includes(supplierId)
  //       ? prev.filter((id) => id !== supplierId) // Remove if already selected
  //       : [...prev, supplierId] // Add if not selected
  //   );
  // };
  const handleCheckboxChange = (selectedRowId, supplierId) => {
    setSelectedSuppliers((prev) => {
      const updated = [...prev];
      const rowIndex = updated.findIndex(
        (row) => row.selectedRowId === selectedRowId
      );

      if (rowIndex !== -1) {
        // Update supplierIds for the existing row
        const supplierExists = updated[rowIndex].supplierIds.some(
          (s) => s.supplierId === supplierId
        );

        if (supplierExists) {
          // Remove the supplier if already exists
          updated[rowIndex].supplierIds = updated[rowIndex].supplierIds.filter(
            (s) => s.supplierId !== supplierId
          );
        } else {
          // Add new supplier to the row
          updated[rowIndex].supplierIds.push({
            supplierId,
            supplierName: "", // Optional: default supplier name if needed
          });
        }
      } else {
        // Add a new row with the selected supplier
        updated.push({
          selectedRowId,
          supplierIds: [{ supplierId, supplierName: "" }],
        });
      }
      console.log(updated, "updatedddddddddddddddddddddd");
      return updated;
    });
  };


  console.log(selectedSuppliers, "selecteddddddddd Suppliersss");
















  const { id } = useParams();

  const getStockJournal = async () => {
    try {
      const response = await fetch(`${VIEW_STOCKJOURNALBYID}/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const data = await response.json();
      console.log(data, "datatata")
      setStockJournal(data); // Store fetched product
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      // Stop loader
    }
  };

  useEffect(() => {
    getStockJournal()
  }, [])


  console.log("stockJournal===========", StockJournal);

  const handleSubmit = async (values) => {
    console.log(values, "Form values");

    // Filter only the selected rows based on selectedRows array
    const selectedIndexes = values.selectedRows.map(id => {
      return values.stockJournal.findIndex(item => item.product?.id === id);
    }).filter(index => index !== -1);

    // Prepare the final data with only selected rows
    const finalData = {
      stockJournalId: values?.stockJournalId,
      acceptedBy: currentUser?.user.username,
      acceptances: selectedIndexes.map(index => ({
        transferProductId: values?.stockJournal[index]?.product.productIdd,
        // transferQty: Number(values.stockJournal[index]?.transferedQuantity),
        acceptedQty: Number(values?.stockJournal[index]?.acceptedQty) || 0,
        rejectedQty: Number(values?.stockJournal[index]?.rejectedQty) || 0,
        remarks: values?.stockJournal[index]?.remarks || ""
      }))
    };

    console.log(finalData, "Final data to submit");

    // Uncomment the API call when ready

    try {
      const url = `${VERIFY_STOCK_JOURNAL}`;
      const method = "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(finalData)
      });
      console.log(response, "kjkjkj");


      const data = await response.json();
      if (response.ok) {
        toast.success(`Journal Verified successfully`);
        navigate("/stockJournal/ViewStockJournal");
      } else {
        toast.error(`${data.errorMessage}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }

  };












  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '50px',
      fontSize: '16px',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '10px 14px',
    }),
    input: (provided) => ({
      ...provided,
      fontSize: '16px',
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: '16px',
    }),
  };
















  return (
    <DefaultLayout>
      <Breadcrumb pageName="Order/Update Order" />
      <div>
        <Formik
          onSubmit={handleSubmit}
          enableReinitialize={true}
          initialValues={{
            selectedRows: [],
            orderNo: StockJournal?.orderNo || '',
            acceptedBy: "",
            stockJournalId: StockJournal?.id || '',
            stockJournal: StockJournal?.transferProducts?.map((product) => ({

              product: {
                ...product.product,
                productIdd: product.id || '',  // Set initial value for productId
              },
              sourceLocation: product?.sourceLocation?.address, // we have to add here city also
              destinationLocation: product?.destinationLocation?.address,
              transferStatus: product?.transferStatus,

              transferedQuantity: product.transferQty || '',
              acceptedQty: null,
              rejectedQty: null,
              remarks: '',






            })) || [],






            // clientInstruction: order?.clientInstruction || '',
            // customer: '',
          }}

        // validationSchema={validationSchema}
        >
          {({ values, setFieldValue }) => {


            return (
              <Form>
                <div className="flex flex-col gap-9">
                  {/* Form fields */}
                  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                      <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                        Verify Stock Journal
                      </h3>
                    </div>
                    <div className="p-6.5">
                      <div className="flex flex-col gap-4">
                        <div className="bg-gradient-to-br from-white/20 to-white/5 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
                          <div className="flex flex-col items-center mb-8">
                            <div className="p-3 mb-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                              Journal Details
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Complete journal information</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                              {
                                key: 'voucherNo',
                                label: 'Voucher No',
                                value: StockJournal?.voucherNo,
                                icon: '#',
                                color: 'blue',
                                gradient: 'from-blue-500/20 to-cyan-500/20',
                                border: 'border-blue-300/50',
                                text: 'text-blue-800 dark:text-blue-200'
                              },
                              {
                                key: 'createdDate',
                                label: 'Created Date',
                                value: StockJournal?.createdDate ? new Date(StockJournal.createdDate).toLocaleString() : '',
                                icon: '📅',
                                color: 'emerald',
                                gradient: 'from-emerald-500/20 to-teal-500/20',
                                border: 'border-emerald-300/50',
                                text: 'text-emerald-800 dark:text-emerald-200'
                              },
                              {
                                key: 'journalStatus',
                                label: 'Status',
                                value: StockJournal?.journalStatus,
                                icon: '📊',
                                color: 'purple',
                                gradient: 'from-purple-500/20 to-pink-500/20',
                                border: 'border-purple-300/50',
                                text: 'text-purple-800 dark:text-purple-200'
                              }
                            ].map((item) => (
                              <div key={item.key} className="relative group">
                                <div className={`absolute -inset-1 bg-gradient-to-r ${item.gradient} rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500`}></div>
                                <div className="relative bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border ${item.border}">
                                  <div className="flex items-center justify-center mb-4">
                                    <div className={`p-2 bg-gradient-to-br ${item.gradient.replace('/20', '')} rounded-lg shadow-md`}>
                                      <span className="text-xl font-bold text-white">{item.icon}</span>
                                    </div>
                                  </div>
                                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 text-center mb-2">
                                    {item.label}
                                  </label>
                                  {item.key === 'journalStatus' ? (
                                    <div className={`text-center text-xl font-bold ${item.text} px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-800/50`}>
                                      {item.value || 'N/A'}
                                    </div>
                                  ) : (
                                    <Field
                                      type="text"
                                      name={item.key}
                                      readOnly
                                      value={item.value}
                                      className={`w-full text-center text-xl font-bold ${item.text} bg-transparent border-none focus:outline-none`}
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <h6 className='text-sm text-red-500'> * Hover On The Field To View The Full Title</h6>

















                      <div className="shadow-md rounded-lg mt-3 overflow-scroll">
                        <table className="min-w-full leading-normal overflow-auto">
                          <thead>
                            <tr className="bg-slate-300 dark:bg-slate-700 dark:text-white">
                              {/* <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Select
                              </th> */}
                              <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Product Id
                              </th>
                              <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Source Location
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Destination Location
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                transfered Quantity
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Recieved Quantity
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Rejected Quantity
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Remarks
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Transfer Status
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Action
                                <Field
                                  type="checkbox"
                                  name="selectAll"
                                  checked={checkAll}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setCheckAll(isChecked);

                                    if (isChecked) {
                                      // Select all products
                                      const allProductIds = StockJournal?.transferProducts?.map(item => item.product?.id) || [];
                                      setFieldValue("selectedRows", allProductIds);

                                      // Auto-fill all quantities
                                      StockJournal?.transferProducts?.forEach((_, index) => {
                                        const transferedQty = values.stockJournal[index]?.transferedQuantity || 0;
                                        setFieldValue(`stockJournal[${index}].acceptedQty`, transferedQty);
                                        setFieldValue(`stockJournal[${index}].rejectedQty`, 0);
                                      });
                                    } else {
                                      // Deselect all
                                      setFieldValue("selectedRows", []);

                                      // Clear all quantities
                                      StockJournal?.transferProducts?.forEach((_, index) => {
                                        setFieldValue(`stockJournal[${index}].acceptedQty`, "");
                                        setFieldValue(`stockJournal[${index}].rejectedQty`, "");
                                      });
                                    }
                                  }}
                                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 ml-2"
                                />
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {StockJournal?.transferProducts?.map((item, index) => (
                              <tr key={item.id}>

                                {/* Product ID */}
                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <Field
                                    name={`stockJournal[${index}].product.productId`}
                                    className="w-[150px] bg-white dark:bg-form-input dark:text-white rounded border-[1.5px] border-stroke py-3 px-5 text-black truncate" // Added truncate
                                    placeholder="Enter Product ID"
                                    title={values.stockJournal[index]?.product?.productId || ''} // Simple tooltip
                                  />
                                  <ErrorMessage
                                    name={`orderProducts[${index}].orderCategory`}
                                    component="div"
                                    className="text-red-600 text-sm"
                                  />
                                </td>


                                {/* Order Category */}

                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <Field
                                    name={`stockJournal[${index}].sourceLocation`}

                                    // }}
                                    title={values?.stockJournal[index]?.sourceLocation}
                                    className="w-[150px] bg-white dark:bg-form-input dark:text-white rounded border-[1.5px] border-stroke py-3 px-5 text-black truncate"
                                    placeholder="Enter Product ID"
                                  />
                                  <ErrorMessage
                                    name={`orderProducts[${index}].orderCategory`}
                                    component="div"
                                    className="text-red-600 text-sm"
                                  />
                                </td>
                                {/* Client Order Quantity */}
                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <Field
                                    name={`stockJournal[${index}].destinationLocation`}
                                    title={values?.stockJournal[index]?.destinationLocation}
                                    className="w-[150px] bg-white dark:bg-form-input dark:text-white rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                    placeholder="Enter Product ID"
                                  />
                                  <ErrorMessage
                                    name={`orderProducts[${index}].orderCategory`}
                                    component="div"
                                    className="text-red-600 text-sm"
                                  />
                                </td>
                                {/* Client Order Quantity */}
                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <Field
                                    name={`stockJournal[${index}].transferedQuantity`}
                                    // onChange={(e) => {
                                    //   const newValue = e.target.value;
                                    //   console.log(`New Product ID: ${newValue}`);
                                    //   setFieldValue(
                                    //     `orderProducts[${index}].products.productId`,
                                    //     newValue
                                    //   );
                                    // }}
                                    className="w-[150px] bg-white dark:bg-form-input dark:text-white rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                    placeholder="Enter Product ID"
                                  />
                                  <ErrorMessage
                                    name={`stockJournal[${index}].transferedQuantity`}
                                    component="div"
                                    className="text-red-600 text-sm"
                                  />
                                </td>
                                {/* Client Order Quantity */}
                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <Field
                                    name={`stockJournal[${index}].acceptedQty`}
                                    onChange={(e) => {
                                      const transferedQty = Number(values.stockJournal[index]?.transferedQuantity) || 0;
                                      const inputQty = Number(e.target.value) || 0;
                                      if (inputQty > transferedQty) {
                                        toast.error("Accepted Quantity cannot be greater than Transfered Quantity");
                                        setFieldValue(`stockJournal[${index}].acceptedQty`, transferedQty);
                                        return;
                                      }
                                      else if (inputQty === 0) {
                                        toast.error("0 cannot be accepted");
                                        setFieldValue(`stockJournal[${index}].acceptedQty`, 1);
                                        setFieldValue(`stockJournal[${index}].rejectedQty`, transferedQty - 1);
                                        return;
                                      }
                                      const rejectedQty = transferedQty - inputQty;
                                      setFieldValue(`stockJournal[${index}].rejectedQty`, rejectedQty);
                                      const newValue = e.target.value;
                                      console.log(`New Product ID: ${newValue}`);
                                      setFieldValue(
                                        `stockJournal[${index}].acceptedQty`,
                                        newValue
                                      );
                                    }}
                                    className="w-[150px] bg-white dark:bg-form-input dark:text-white rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                    placeholder="Enter Recieved Quantity"
                                  />
                                  <ErrorMessage
                                    name={`stockJournal[${index}].acceptedQty`}
                                    component="div"
                                    className="text-red-600 text-sm"
                                  />
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <Field
                                    name={`stockJournal[${index}].rejectedQty`}
                                    // onChange={(e) => {
                                    //   const newValue = e.target.value;
                                    //   console.log(`New Product ID: ${newValue}`);
                                    //   setFieldValue(
                                    //     `orderProducts[${index}].products.productId`,
                                    //     newValue
                                    //   );
                                    // }}
                                    readOnly
                                    className="w-[150px] bg-white dark:bg-form-input dark:text-white rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                    placeholder="Enter rejectedQty"
                                  />
                                  <ErrorMessage
                                    name={`stockJournal[${index}].rejectedQty`}
                                    component="div"
                                    className="text-red-600 text-sm"
                                  />
                                </td>

                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <Field
                                    type="textarea"
                                    name={`stockJournal[${index}].remarks`}
                                    // onChange={(e) => {
                                    //   const newValue = e.target.value;
                                    //   console.log(`New Product ID: ${newValue}`);
                                    //   setFieldValue(
                                    //     `orderProducts[${index}].products.productId`,
                                    //     newValue
                                    //   );
                                    // }}
                                    className="w-[150px] bg-white dark:bg-form-input dark:text-white rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                    placeholder="Enter Remarks"
                                  />
                                  <ErrorMessage
                                    name={`stockJournal[${index}].remarks`}
                                    component="div"
                                    className="text-red-600 text-sm"
                                  />
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <Field
                                    type="text"
                                    name={`stockJournal[${index}].transferStatus`}
                                    readOnly
                                    // onChange={(e) => {
                                    //   const newValue = e.target.value;
                                    //   console.log(`New Product ID: ${newValue}`);
                                    //   setFieldValue(
                                    //     `orderProducts[${index}].products.productId`,
                                    //     newValue
                                    //   );
                                    // }}
                                    className="w-[150px] bg-white dark:bg-form-input dark:text-white rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                  // placeholder="Enter Transfer Status"
                                  />
                                  <ErrorMessage
                                    name={`stockJournal[${index}].transferStatus`}
                                    component="div"
                                    className="text-red-600 text-sm"
                                  />
                                </td>
                                {/* Radio Button */}
                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  {item.transferStatus === "PENDING" || item.transferStatus === "Pending" ? (
                                    // Show checkbox for Pending items
                                    <Field
                                      type="checkbox"
                                      name="selectedRows"
                                      value={item.product?.id}
                                      checked={values.selectedRows.includes(item.product?.id)}
                                      onChange={(e) => {
                                        const checked = e.target.checked;
                                        const productId = item.product?.id;

                                        if (checked) {
                                          // If checked, add the product ID to selectedRows
                                          setFieldValue("selectedRows", [...values.selectedRows, productId]);

                                          // Auto-fill accepted quantity with transfered quantity
                                          setFieldValue(
                                            `stockJournal[${index}].acceptedQty`,
                                            values.stockJournal[index]?.acceptedQty || 0
                                          );

                                          // Auto-calculate rejected quantity
                                          const transferedQty = Number(values.stockJournal[index]?.transferedQuantity) || 0;
                                          const acceptedQty = Number(values.stockJournal[index]?.acceptedQty) || 0;
                                          setFieldValue(
                                            `stockJournal[${index}].rejectedQty`,
                                            transferedQty - acceptedQty
                                          );
                                        } else {
                                          // If unchecked, remove the product ID from selectedRows
                                          setFieldValue(
                                            "selectedRows",
                                            values.selectedRows.filter(id => id !== productId)
                                          );

                                          // Clear the accepted and rejected quantities
                                          setFieldValue(`stockJournal[${index}].acceptedQty`, "");
                                          setFieldValue(`stockJournal[${index}].rejectedQty`, "");
                                        }
                                      }}
                                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                      title="Select this pending item"
                                    />
                                  ) : (
                                    // Show status badge for non-Pending items
                                    <div className="flex justify-center">
                                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${item.transferStatus === "ACCEPTED" || item.transferStatus === "Accepted" || item.transferStatus === "APPROVED"
                                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                          : item.transferStatus === "REJECTED" || item.transferStatus === "Rejected"
                                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                            : item.transferStatus === "COMPLETED" || item.transferStatus === "Completed"
                                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                        }`}>
                                        {item.transferStatus}
                                      </span>
                                    </div>
                                  )}
                                </td>




                                <td
                                  className="px-5 py-5 border-b border-gray-200 text-sm"
                                  colSpan={2} // Use colSpan to span across multiple columns
                                >
                                  {/* <div className="flex items-center gap-2">
                                    <span onClick={() => navigate(`/order/modifyorderproduct/${product?.id}`)} className="bg-green-100 text-green-800 text-[10px] font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 text-center dark:text-green-400 border border-green-400 cursor-pointer w-[100px]"> VIEW ORDER PRODUCT</span>
                                    <span onClick={() => navigate(`/order/viewProduct/${product?.id}`)} className=" bg-red-100 text-red-800 text-[10px] font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 text-center dark:text-red-400 border border-red-400 cursor-pointer w-[100px]">VIEW PRODUCT DETAILS</span>
                                  </div> */}
                                </td>

                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>


















                      <div className="flex justify-center mt-4">
                        <button
                          type="submit"
                          disabled={values.selectedRows.length === 0}
                          className={`w-1/3 px-6 py-2 text-white rounded-lg shadow-md transition-colors duration-300 ${values.selectedRows.length === 0
                            ? "bg-slate-400 cursor-not-allowed"
                            : "bg-primary hover:bg-primary-dark"
                            }`}
                        >
                          Submit Selected ({values.selectedRows.length})
                        </button>
                      </div>
                    </div>
                  </div>
                </div>


              </Form>
            )
          }}
        </Formik>





      </div>
    </DefaultLayout>
  );
};

export default VerifyStockJournals;
