import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ReactSelect from 'react-select';

import 'flatpickr/dist/themes/material_blue.css'; // Import a Flatpickr theme

import useorder from '../../hooks/useOrder';

import { GET_PRODUCTBYID_URL, GET_ORDERBYID_URL, UPDATE_ORDER_URL, UPDATE_ORDERCREATED_ALL, VIEW_STOCKJOURNALBYID } from '../../Constants/utils';

import { useNavigate, useNavigation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md';
import { IoIosGitMerge } from 'react-icons/io';
const VerifyStockJournal = () => {
  const [StockJournal, setStockJournal] = useState([])
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state?.persisted?.user);



  const [order, setOrder] = useState(null); // To store fetched product data


  const { token } = currentUser;







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


  // const handleSubmit = async (values) => {
  //   // Map selected row IDs to the desired format
  //   const selectedProducts = values.selectedRows.map((productId) => ({
  //     id: productId,
  //   }));

  //   // Prepare the final data
  //   const finalData = {
  //     orderProducts: selectedProducts, // Include the selected rows
  //   };

  //   // Log the data to check the format
  //   console.log(finalData, "finalData");




  //   try {
  //     const url = `${UPDATE_ORDERCREATED_ALL}/${id}`;
  //     const method = "PUT";

  //     const response = await fetch(url, {
  //       method: method,
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${token}`
  //       },
  //       body: JSON.stringify(finalData)
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       toast.success(`Order Status Updated  successfully`);



  //       // getCurrency(pagination.currentPage); // Fetch updated Currency
  //     } else {
  //       toast.error(`${data.errorMessage}`);
  //     }
  //   } catch (error) {
  //     console.error(error, response);
  //     toast.error("An error occurred");
  //   } 

  //   // You can now send `finalData` to the backend or do any other operation with it
  // };

















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
          // onSubmit={handleSubmit}
          enableReinitialize={true}
          initialValues={{
            selectedRows: [],
            orderNo: order?.orderNo || '',






            clientInstruction: order?.clientInstruction || '',
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
                      <div className="flex flex-col items-center gap-4">  {/* Changed to flex-col and added items-center */}
                        <div className="w-full max-w-[190px]">  {/* Added max-width and full width */}
                          <div className="flex flex-col items-center">  {/* Centering container */}
                            <label className="mb-2.5 block text-black dark:text-white text-center">Voucher No</label>
                            <Field
                              type="number"
                              name="voucherNo"
                              readOnly
                              value={StockJournal?.voucherNo}
                              placeholder="Enter Voucher Number"
                              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary text-center"  // Added text-center
                            />
                            <ErrorMessage
                              name="voucherNo"  // Fixed: Changed from "orderType" to "voucherNo"
                              component="div"
                              className="text-red-600 text-sm text-center"  // Added text-center
                            />
                          </div>
                        </div>
                      </div>

















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
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {StockJournal?.transferProducts?.map((item, index) => (
                              <tr key={item.id}>
                                {/* Radio Button */}
                                {/* <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <Field
                                    type="checkbox"
                                    name="selectedRows"
                                    value={product.id} // Value of the checkbox (product ID)
                                    checked={values.selectedRows.includes(product.id)} // Check if product ID is in selectedRows
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      if (checked) {
                                        // If checked, add the product ID to selectedRows
                                        setFieldValue("selectedRows", [...values.selectedRows, product.id]);
                                      } else {
                                        // If unchecked, remove the product ID from selectedRows
                                        setFieldValue("selectedRows", values.selectedRows.filter(id => id !== product.id));
                                      }
                                    }}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                  />
                                </td> */}

                                {/* Product ID */}



                                {/* Order Category */}


                                {/* Client Order Quantity */}




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


















                      <div className="flex justify-center mt-4"> {/* Centering the button */}
                        <button
                          type="submit"


                          className="w-1/3 px-6 py-2 text-white bg-primary rounded-lg shadow hover:bg-primary-dark focus:outline-none" // Increased width
                        >
                          Accept All
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

export default VerifyStockJournal;
