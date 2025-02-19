import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ReactSelect from 'react-select';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/themes/material_blue.css'; // Import a Flatpickr theme
import Modal from './Modal';
import * as Yup from 'yup';
import useorder from '../../hooks/useOrder';
import ReactDatePicker from "react-datepicker";
import useProduct from '../../hooks/useProduct';
import { GET_PRODUCTBYID_URL, GET_ORDERBYID_URL, UPDATE_ORDER_URL, VIEW_ORDER_PRODUCT, UPDATE_ORDERPRODUCT_ALL, UPDATE_ISSUECHALLAN } from '../../Constants/utils';
import { IoIosAdd, IoMdAdd, IoMdTrash } from "react-icons/io";
import ModalUpdate from './ModalUpdate';
import SupplierModal from './SupplierModal';
import { FiTrash2 } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SupplierModall from './SupplierModall';
const IssueChalaan = () => {
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const [orderType, setOrderType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderTypeOptions, setorderTypeOptions] = useState([])
  const [prodIdOptions, setprodIdOptions] = useState([])
  const [prodIdd, setprodIdd] = useState("")
  const [order, setOrder] = useState(null); // To store fetched product data
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [suppId, setsuppId] = useState()
  const [isLoading, setIsLoading] = useState(true); // Loader state
  const [customerOptions, setcustomerOptions] = useState([])
  const { token } = currentUser;



  const [orderProduct, setorderProduct] = useState([])

  const [selectedRowId, setSelectedRowId] = useState(null);
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "Supplier A" },
    { id: 2, name: "Supplier B" },
    { id: 3, name: "Supplier C" },
  ])
  const {

    productId,

  } = useorder();










  const { id } = useParams();




  const [selectedSuppliers, setSelectedSuppliers] = useState([]);






  console.log(selectedSuppliers, "selecteddddddddd Suppliersss");




  console.log(isSupplierModalOpen, "ll");

  console.log(isModalOpen, "jj");









  // Close modal
  const closeSupplierModal = () => {
    setIsSupplierModalOpen(false);
  };












  console.log(productId, "looool");





 


  const getOrderById = async () => {
    try {
      const response = await fetch(`${VIEW_ORDER_PRODUCT}/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const data = await response.json();
      console.log(data, "luciiiiferrrrrrrrrrrrrr")
      setOrder(data); // Store fetched product
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setIsLoading(false); // Stop loader
    }
  };


  // Fetch data when component mounts
  useEffect(() => {
    getOrderById();
  }, [id]);

  const [prodIdModal, setprodIdModal] = useState([])












  const OrderCategoryOptions = [
    { value: 'Embroidery', label: 'Embroidery' },
    { value: 'Dyeing', label: 'Dyeing' },
    { value: 'PlainOrder', label: 'PlainOrder' },

  ];


  const ExecutionStatus = [
    { value: 'Accepted', label: 'Accepted' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'NeedModification', label: 'Need Modification' },

  ];

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












  useEffect(() => {
    if (order?.productSuppliers) {
      const initialSuppliers = order.productSuppliers.map((supplier) => ({
        selectedRowId: supplier.productId, // Assuming there's a productId field
        supplierId: supplier.supplier.id,
        supplierName: supplier.supplier.name,
        supplierOrderQty: supplier.supplierOrderQty || 0,
      }));

      setSelectedSuppliers(initialSuppliers); // Set suppliers when page loads
    }
  }, [order]);



 








  console.log(selectedSuppliers, "kikikikikikikiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");



















  const handleModalSubmit = (values) => {
    console.log(values, "gfdsa");



    setprodIdModal((prevValues) => [...prevValues, values])
    setIsModalOpen(false)

  }


  const handleSubmit = async (values) => {


    const formattedValues={
      challanNo:values.challanNo,
      challanDate: values.challanDate,
      challanDate1: values.challanDate1,
      challanDate2: values.challanDate2,
      challanDate3: values.challanDate3,
      challanDate4: values.challanDate4,
      expectedSupplierDate: values.expectedSupplierDate
    }
   
    try {
      const url = `${UPDATE_ISSUECHALLAN}/${id}`;
      const method = "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formattedValues)
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Order Status Updated  successfully`);



        // getCurrency(pagination.currentPage); // Fetch updated Currency
      } else {
        toast.error(`${data.errorMessage}`);
      }
    } catch (error) {
      console.error(error, response);
      toast.error("An error occurred");
    }

    // You can now send `finalData` to the backend or do any other operation with it
  };













  console.log(prodIdModal, "proddidmodal");







  console.log(selectedSuppliers, "supppppppppppppppppppplierssssssssssssssssss");
console.log(order?.orderCategory,"jjhhjjhh");

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Order/Update Order Product" />
      <div>
        <Formik
          enableReinitialize={true}
          initialValues={{


            // orderNo: order?.orderNo || '',
            orderCategory: order?.orderCategory || '',
            productId: order?.products?.productId,
            quantityToManufacture: order?.quantityToManufacture,

            expectedDate: order?.expectedDate,

            productsId: order?.products?.id,
            // supplierName: product.productSuppliers?.supplier?.name || '', // Safely accessing supplier name
            // supplierOrderQty: product.productSuppliers?.[0]?.supplierOrderQty || 0,
            productSuppliers: order?.productSuppliers?.map(supplier => ({
              supplier: {
                id: supplier?.id, // Send supplier ID
              },

              supplierOrderQty: supplier.supplierOrderQty || 0,
            })) || [],


            challanNo: "",
            challanDate: "",

            challanDate1: "",

            challanDate2: "",

            challanDate3: "",

            challanDate4: "",
            expectedSupplierDate:"",
            updatedBy:order?.updatedBy





            // customer: '',
          }}
          // validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, handleBlur, isSubmitting }) => (
            <Form>
              <div className="flex flex-col gap-9">
                {/* Form fields */}
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                      Issue Chalaan
                    </h3>
                  </div>
                  <div className="p-6.5">
                    <div className="flex flex-wrap gap-3">
                      {/* Order No */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Order No</label>
                        <ReactSelect
                          name="orderNo"

                          value={order?.orderNo ? { label: order.orderNo, value: order.orderNo } : null} // Display orderNo
                          styles={customStyles}
                          className="bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          placeholder="Select Order No"
                          isDisabled={true} // Disabled field
                        />
                        <ErrorMessage name="orderNo" component="div" className="text-red-600 text-sm" />
                      </div>

                      {/* Order Category */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Order Category</label>
                        <Field
                          name="orderCategory"
                          value={order?.orderCategory || null}
                          // onChange={(option) => setFieldValue("orderCategory", option.value)} // Store only value
                         
                          styles={customStyles}
                          isDisabled={true}
                          className="bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          placeholder="Select Order Category"
                        />


                        <ErrorMessage name="salesChannel" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Product ID</label>
                        <Field
                          name="orderCategory"
                          readOnly
                        
                          value={order?.orderCategory || null}// Ensure it reflects Formik state
                          // onChange={(e) => setFieldValue("productId", e.target.value)} // Update Formik state
                          className="w-[200px] bg-gray-3 dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          placeholder="Enter Product ID"
                        />
                        <ErrorMessage name="productId" component="div" className="text-red-600 text-sm" />
                      </div>

                      {/* Product ID */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Product ID</label>
                        <Field
                          name="productId"
                          readOnly
                        
                          value={values?.productId} // Ensure it reflects Formik state
                          onChange={(e) => setFieldValue("productId", e.target.value)} // Update Formik state
                          className="w-[200px] bg-gray-3 dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          placeholder="Enter Product ID"
                        />
                        <ErrorMessage name="productId" component="div" className="text-red-600 text-sm" />
                      </div>

                      {/* Quantity to Manufacture */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Quantity to Manufacture</label>
                        <Field
                          name="quantityToManufacture"
                          className="w-[200px] bg-gray-200 dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          readOnly // Read-only field
                        />
                        <ErrorMessage name="quantityToManufacture" component="div" className="text-red-600 text-sm" />
                      </div>
                    </div>



                    <div className="flex flex-wrap gap-3 mt-5">
                      {/* Order No */}


                      {/* Order Category */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Expected Date</label>
                        <Field
                          type="date"
                          readOnly
                          // name={`orderProducts[${index}].expectedDate`}
                          value={values.expectedDate || ""}
                          className="w-[200px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                        //readOnly
                        />
                        <ErrorMessage name="salesChannel" component="div" className="text-red-600 text-sm" />
                      </div>





                      {/* Product ID */}

                    </div>


                    <div>



                    </div>





                    <div className="flex flex-wrap gap-3">
                      <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                          <table className="min-w-full leading-normal">
                            <thead>
                              <tr className='px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Supplier Name
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Supplier Quantity
                                </th>

                              </tr>
                            </thead>
                            <tbody>
                              {selectedSuppliers.map((supplierData, index) => (
                                <tr key={index}>
                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <input

                                      value={supplierData.supplierName} // Display only this supplier's name
                                      readOnly
                                      className="w-[130px] bg-gray-200 dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                    />
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <Field
                                      readOnly
                                      name={`selectedSuppliers[${index}].supplierOrderQty`}
                                      value={supplierData.supplierOrderQty}
                                      type="number"
                                      className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                    />
                                  </td>
                                  <Field
                                    name={`productSuppliers[${index}].supplier.id`}
                                    type="hidden"
                                    value={supplierData.supplierId} // Send Supplier ID in Form Submission
                                  />

                                </tr>
                              ))}
                            </tbody>


                          </table>
                          {/* Add New Supplier Button */}


                          {/* <button
              type="button"
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              onClick={() => {
                const newSupplier = { supplierName: '', supplierOrderQty: 0 };
                setFieldValue('productSuppliers', [...values.productSuppliers, newSupplier]);
              }}
            >
              Add Supplier
            </button> */}


                        </div>
                      </div>
                    </div>


                    <div className="flex flex-wrap gap-3 mt-5">
                      {/* Order No */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Chalaan No</label>
                        <Field
                          name="challanNo"
                          // value={values?.value} // Ensure it reflects Formik state
                          // onChange={(e) => setFieldValue("productId", e.target.value)} // Update Formik state
                          className="w-[200px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          placeholder="Enter Product ID"
                        />
                        <ErrorMessage name="orderNo" component="div" className="text-red-600 text-sm" />
                      </div>

                      {/* Order Category */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Chalaan Date</label>
                        <Field
                          name="challanDate"
                          type="date"
                          // name={`orderProducts[${index}].expectedDate`}
                          // value={values.expectedDate || ""}
                          className="w-[200px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                        //readOnly
                        />
                        <ErrorMessage name="salesChannel" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Chalaan Date</label>
                        <Field
                          type="date"
                          name="challanDate1"
                          // name={`orderProducts[${index}].expectedDate`}
                          // value={values.expectedDate || ""}
                          className="w-[200px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                        //readOnly
                        />
                        <ErrorMessage name="salesChannel" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Chalaan Date</label>
                        <Field
                          type="date"
                          name="challanDate2"
                          // name={`orderProducts[${index}].expectedDate`}
                          // value={values.expectedDate || ""}
                          className="w-[200px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                        //readOnly
                        />
                        <ErrorMessage name="salesChannel" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Chalaan Date</label>
                        <Field
                          type="date"
                          name="challanDate3"
                          // name={`orderProducts[${index}].expectedDate`}
                          // value={values.expectedDate || ""}
                          className="w-[200px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                        //readOnly
                        />
                        <ErrorMessage name="salesChannel" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Chalaan Date</label>
                        <Field
                          type="date"
                          name="challanDate4"
                          // name={`orderProducts[${index}].expectedDate`}
                          // value={values.expectedDate || ""}
                          className="w-[200px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                        //readOnly
                        />
                        <ErrorMessage name="salesChannel" component="div" className="text-red-600 text-sm" />
                      </div>  <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Expected Supplier Date</label>
                        <Field
                          type="date"
                          name="expectedSupplierDate"
                          // name={`orderProducts[${index}].expectedDate`}
                          // value={values.expectedDate || ""}
                          className="w-[200px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                        //readOnly
                        />
                        <ErrorMessage name="salesChannel" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Last Updated By</label>
                        <Field
                          name="updatedBy"
                          value={values?.updatedBy} // Ensure it reflects Formik state
                          onChange={(e) => setFieldValue("productId", e.target.value)} // Update Formik state
                          className="w-[200px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          placeholder="Enter Product ID"
                        />
                        <ErrorMessage name="orderNo" component="div" className="text-red-600 text-sm" />
                      </div>





                      {/* Product ID */}

                    </div>













                    <div className="flex justify-center mt-4"> {/* Centering the button */}
                      <button
                        // type="button" // Ensures the button does not trigger the form submission
                        // onClick={(e) => handleUpdateSubmit(values, e)}
                        className="w-1/3 px-6 py-2 text-white bg-primary rounded-lg shadow hover:bg-primary-dark focus:outline-none" // Increased width
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>


            </Form>
          )}
        </Formik>


        <ModalUpdate
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          prodIdd={prodIdd}
          GET_PRODUCTBYID_URL={GET_PRODUCTBYID_URL}
          onSubmit={handleModalSubmit}
          width="70%"
          height="80%"
          style={{ marginLeft: '70px', marginRight: '0' }}  // Add this line
        />


      </div>
    </DefaultLayout>
  );
};

export default IssueChalaan;
