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
import { FaPrint } from 'react-icons/fa';

const EditStockJournals = () => {
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

    // Build acceptances for ALL products in the journal
    const acceptances = values.stockJournal.map((item, index) => ({
      transferProductId: item.product.productIdd, // this is the transfer product ID
      acceptedQty: Number(item.acceptedQty) || 0,
      rejectedQty: Number(item.rejectedQty) || 0,
      remarks: item.remarks || ""
    }));

    const finalData = {
      stockJournalId: values.stockJournalId,
      acceptedBy: currentUser?.user.username,
      acceptances: acceptances
    };

    console.log(finalData, "Final data to submit");

    try {
      const url = `${VERIFY_STOCK_JOURNAL}/update`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(finalData)
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Journal updated successfully`);
        navigate("/stock/ViewStockTransfer");
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
      <Breadcrumb pageName="Stock Journal /Edit Stock Journal" />
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
              acceptedQty: product.acceptedQty || 0,
              rejectedQty: product.rejectedQty || 0,
              remarks: product.remarks || "",






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

                    <div className="p-6.5">

                      <h6 className='text-sm text-red-500 mt-3'> * Hover On The Field To View The Full Title</h6>

















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
                                    disabled='true'
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
                                    min="1"
                                    type="number"
                                    onChange={(e) => {
                                      const transferedQty = Number(values.stockJournal[index]?.transferedQuantity) || 0;
                                      const inputValue = e.target.value;
                                      const inputQty = Number(inputValue) || 0;

                                      // Handle empty input (when user clears the field)
                                      if (inputValue === '') {
                                        setFieldValue(`stockJournal[${index}].acceptedQty`, '');
                                        setFieldValue(`stockJournal[${index}].rejectedQty`, transferedQty);
                                        return;
                                      }

                                      // Handle 0 value
                                      if (inputQty === 0) {
                                        toast.error("Accepted Quantity cannot be 0");
                                        setFieldValue(`stockJournal[${index}].acceptedQty`, '');
                                        setFieldValue(`stockJournal[${index}].rejectedQty`, transferedQty);
                                        return;
                                      }

                                      // Handle greater than transfered quantity
                                      if (inputQty > transferedQty) {
                                        toast.error("Accepted Quantity cannot be greater than Transfered Quantity");
                                        setFieldValue(`stockJournal[${index}].acceptedQty`, transferedQty);
                                        setFieldValue(`stockJournal[${index}].rejectedQty`, 0);
                                        return;
                                      }

                                      // Valid input - calculate rejected quantity
                                      const rejectedQty = transferedQty - inputQty;
                                      setFieldValue(`stockJournal[${index}].rejectedQty`, rejectedQty);
                                      setFieldValue(`stockJournal[${index}].acceptedQty`, inputValue);
                                    }}
                                    onBlur={(e) => {
                                      // Additional validation on blur
                                      const value = e.target.value;
                                      const numValue = Number(value) || 0;
                                      const transferedQty = Number(values.stockJournal[index]?.transferedQuantity) || 0;

                                      if (value === '' || numValue === 0) {
                                        setFieldValue(`stockJournal[${index}].acceptedQty`, '');
                                        setFieldValue(`stockJournal[${index}].rejectedQty`, transferedQty);
                                      } else if (numValue > transferedQty) {
                                        setFieldValue(`stockJournal[${index}].acceptedQty`, transferedQty);
                                        setFieldValue(`stockJournal[${index}].rejectedQty`, 0);
                                      }
                                    }}
                                    validate={(value) => {
                                      const numValue = Number(value) || 0;
                                      const transferedQty = Number(values.stockJournal[index]?.transferedQuantity) || 0;

                                      if (value === '' || numValue === 0) {
                                        return "Accepted Quantity cannot be empty or 0";
                                      }
                                      if (numValue > transferedQty) {
                                        return "Cannot exceed transferred quantity";
                                      }
                                    }}
                                    className="w-[150px] bg-white dark:bg-form-input dark:text-white rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                    placeholder="Enter Received Quantity"
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
                                    rows="3"
                                    // onChange={(e) => {
                                    //   const newValue = e.target.value;
                                    //   console.log(`New Product ID: ${newValue}`);
                                    //   setFieldValue(
                                    //     `orderProducts[${index}].products.productId`,
                                    //     newValue
                                    //   );
                                    // }}
                                    className="w-[350px] h-20 bg-white dark:bg-form-input dark:text-white rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                    placeholder="Enter Remarks"
                                  />
                                  <ErrorMessage
                                    name={`stockJournal[${index}].remarks`}
                                    component="div"
                                    className="text-red-600 text-sm"
                                  />
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <div className="flex flex-col items-center gap-1">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${item.transferStatus === "partially_accepted"
                                      ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                                      : item.transferStatus === "fully_accepted"
                                        ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700"
                                        : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                                      }`}>
                                      {item.transferStatus === "partially_accepted" ? (
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                      ) : item.transferStatus === "fully_accepted" ? (
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      ) : (
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                      )}
                                      <span className="capitalize">{item.transferStatus?.replace('_', ' ')}</span>
                                    </span>
                                    {/* <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {item.transferStatus === "partially_accepted" ? "Partially Verified" :
                                        item.transferStatus === "fully_accepted" ? "Fully Verified" :
                                          "Not Verified"}
                                    </span> */}
                                  </div>

                                </td>
                                {/* Radio Button */}





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

                          className={`w-1/3 px-6 py-2 text-white rounded-lg shadow-md transition-colors duration-300  bg-primary hover:bg-primary-dark`}


                        >
                          Update
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

export default EditStockJournals;
