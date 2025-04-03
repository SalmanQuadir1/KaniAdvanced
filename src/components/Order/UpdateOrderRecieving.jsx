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
import { GET_PRODUCTBYID_URL, GET_ORDERBYID_URL, UPDATE_ORDER_URL, VIEW_ORDER_PRODUCT, UPDATE_ORDERPRODUCT_ALL, UPDATE_ISSUECHALLAN, UPDATE_ORDERRECIEVED } from '../../Constants/utils';
import { IoIosAdd, IoMdAdd, IoMdTrash } from "react-icons/io";
import ModalUpdate from './ModalUpdate';
import SupplierModal from './SupplierModal';
import { FiTrash2 } from 'react-icons/fi';
import { useNavigate, useNavigation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SupplierModall from './SupplierModall';
const UpdateOrderRecieving = () => {
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

  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "Supplier A" },
    { id: 2, name: "Supplier B" },
    { id: 3, name: "Supplier C" },
  ])
  const {

    productId,getLocation,Location

  } = useorder();



useEffect(() => {
 getLocation()
}, [])

console.log(Location,"llkkllkkllkk");







  const { id } = useParams();




  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [selectedLocation, setselectedLocation] = useState([])


  const Locations = [
    { value: 'Srinagar', label: 'Srinagar' },
    { value: 'Delhi', label: 'Delhi' },


  ];

  const Status = [
    { value: 'Closed', label: 'Closed' },


  ];

  const PendingStatus = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Forced_Closure', label: 'Forced Closure' },


  ];





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


  useEffect(() => {
    if (Location) {
      const formattedOptions = Location.map(location => ({
        value: location?.id,
        label: `${location?.state}(${location.address})`,
        LocationObject: location,
        LocationId: { id: location.id }
      }));
  

      setselectedLocation(formattedOptions); // Set Location when page loads
    }
  }, [Location]);












  console.log(selectedSuppliers, "kikikikikikikiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");



















  const handleModalSubmit = (values) => {
    console.log(values, "gfdsa");



    setprodIdModal((prevValues) => [...prevValues, values])
    setIsModalOpen(false)

  }


  const handleSubmit = async (values) => {
    console.log(values,'jamhhgg');
   


    const formattedValues = {
     
      receivedQuantity: values.receivedQuantity,
      receivedDate: values.receivedDate,

      pendingQuantity: values.pendingQuantity,
      defectiveQuantity: values.defectiveQuantity,
      extraQuantity: values.extraQuantity,
      productStatus: values.productStatus,
      location: values.location
    }
    

    try {
      const url = `${UPDATE_ORDERRECIEVED}/${id}`;
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
      if (response?.ok) {
        toast.success(`Order Recieved Status Updated successfully`);
        navigate("/order/partiallyApproved")



        // getCurrency(pagination.currentPage); // Fetch updated Currency
      } else {
        console.log(response,"kk");
        toast.error(`${data}`);
      }
    } catch (error) {
      console.error(error,"hfff");
      toast.error(error);
    }

    // You can now send `finalData` to the backend or do any other operation with it
  };













  







 


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

            clientOrderQuantity: order?.clientOrderQuantity,
            units: order?.units,
            expectedSupplierDate: order?.expectedSupplierDate,
            updatedBy: order?.updatedBy,

            // supplierName: product.productSuppliers?.supplier?.name || '', // Safely accessing supplier name
            // supplierOrderQty: product.productSuppliers?.[0]?.supplierOrderQty || 0,
            productSuppliers: order?.productSuppliers?.map(supplier => ({
              supplier: {
                id: supplier?.id, // Send supplier ID
              },

              supplierOrderQty: supplier.supplierOrderQty || 0,
            })) || [],


            receivedQuantity: "",
            receivedDate: "",

            pendingQuantity: "",

            defectiveQuantity: "",

            extraQuantity: "",

            productStatus: "",
            location: "",
            // expectedSupplierDate: "",
            // updatedBy: order?.updatedBy





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
                      Update Order
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
                        <ReactSelect
                          name="orderCategory"
                          value={OrderCategoryOptions.find(option => option.value === values.orderCategory) || null}
                          onChange={(option) => setFieldValue("orderCategory", option.value)} // Store only value
                          options={OrderCategoryOptions}
                          styles={customStyles}
                          isDisabled={true}
                          className="bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          placeholder="Select Order Category"
                        />


                        <ErrorMessage name="salesChannel" component="div" className="text-red-600 text-sm" />
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

                    </div>



                    <div className="flex flex-wrap gap-3 mt-5">

                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Client Order Quantity</label>
                        <Field
                          name="clientOrderQuantity"
                          className="w-[200px] bg-gray-200 dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          readOnly // Read-only field
                        />
                        <ErrorMessage name="clientOrderQuantity" component="div" className="text-red-600 text-sm" />
                      </div>
                      {/* Order No */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Unit</label>
                        <Field
                          name="units"
                          className="w-[200px] bg-gray-200 dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          readOnly
                        />
                        <ErrorMessage name="units" component="div" className="text-red-600 text-sm" />
                      </div>


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

                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Expected Supplier Date</label>
                        <Field
                          type="date"
                          readOnly
                          // name={`orderProducts[${index}].expectedDate`}
                          value={values.expectedSupplierDate || ""}
                          className="w-[200px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                        //readOnly
                        />
                        <ErrorMessage name="salesChannel" component="div" className="text-red-600 text-sm" />
                      </div>





                      {/* Product ID */}

                    </div>

                    <div className="flex flex-wrap gap-3 mt-5">

                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Recieved Quantity</label>
                        <Field
                          type="number"
                          name="receivedQuantity"
                          className="w-[200px] bg-gray-200 dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          onChange={(e) => {
                            const receivedQuantity = parseInt(e.target.value) || 0;
                            const clientOrderQuantity = parseInt(values.clientOrderQuantity) || 0;

                            setFieldValue("receivedQuantity", receivedQuantity);
                            setFieldValue("pendingQuantity", Math.max(0, clientOrderQuantity - receivedQuantity));
                            setFieldValue("extraQuantity", Math.max(0, receivedQuantity - clientOrderQuantity));
                          }}
                        />

                        <ErrorMessage name="quantityToManufacture" component="div" className="text-red-600 text-sm" />
                      </div>
                      {/* Order No */}

                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Recieved Date</label>
                        <Field
                          type="date"
                          name="receivedDate"

                          // name={receivedDate}
                          // name={`orderProducts[${index}].expectedDate`}
                          // value={values.receivedDate || ""}
                          className="w-[200px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                        //readOnly
                        />
                        <ErrorMessage name="salesChannel" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Pending Quantity</label>
                        <Field
                          name="pendingQuantity"
                          className="w-[200px] bg-gray-200 dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          readOnly // Read-only field
                        />
                        <ErrorMessage name="pendingQuantity" component="div" className="text-red-600 text-sm" />
                      </div>

                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Defective Quantity</label>
                        <Field
                          type="number"
                          name="defectiveQuantity"
                          className="w-[200px] bg-gray-200 dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                        // Read-only field
                        />
                        <ErrorMessage name="defectiveQuantity" component="div" className="text-red-600 text-sm" />
                      </div>


                      {/* Order Category */}








                      {/* Product ID */}

                    </div>

                    <div className="flex flex-wrap gap-3 mt-5">

                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Extra Quantity</label>
                        <Field
                          name="extraQuantity"
                          className="w-[200px] bg-gray-200 dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          readOnly // Read-only field
                        />
                        <ErrorMessage name="extraQuantity" component="div" className="text-red-600 text-sm" />
                      </div>

                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Product Location</label>
                        <ReactSelect
                          name="location"
                          value={
                            selectedLocation?.find(option => option.value === values.location.id) || null
                          }
                          // value={
                          //   salesChannelOptions.find((option) => option.value === values.salesChannel) || null
                          // } // Display the selected value
                          onChange={(option) =>
                            setFieldValue("location", option ? { id: option.value } : null)
                          } // Update Formik value
                          options={selectedLocation}
                          styles={customStyles}
                          className="bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          placeholder="Execution Status"
                        />
                        <ErrorMessage name="location" component="div" className="text-red-600 text-sm" />
                      </div>
























                      {/* Order No */}


                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Last Updated By</label>
                        <Field
                          name="updatedBy"
                          className="w-[200px] bg-gray-200 dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          readOnly // Read-only field
                        />
                        <ErrorMessage name="updatedBy" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Status</label>
                        <ReactSelect
                          name="productStatus"
                          // value={
                          //   salesChannelOptions.find((option) => option.value === values.salesChannel) || null
                          // } // Display the selected value
                          onChange={(option) =>
                            setFieldValue("productStatus", option ? option.value : "")
                          } // Update Formik value
                          options={values.pendingQuantity > 0 || values.defectiveQuantity > 0 ? PendingStatus : Status}
                          styles={customStyles}
                          className="bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          placeholder="Status"
                        />
                        <ErrorMessage name="productStatus" component="div" className="text-red-600 text-sm" />
                      </div>


                      {/* Order Category */}








                      {/* Product ID */}

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

export default UpdateOrderRecieving;
