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
import { GET_PRODUCTBYID_URL, GET_ORDERBYID_URL, UPDATE_ORDER_URL, UPDATE_ORDERCREATEDDATE } from '../../Constants/utils';
import { IoIosAdd, IoMdAdd, IoMdTrash } from "react-icons/io";
import ModalUpdate from './ModalUpdate';
import SupplierModal from './SupplierModal';
import { FiTrash2 } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md';
const UpdateOrderShippingDate = () => {
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

  const [selectedRowId, setSelectedRowId] = useState(null);
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "Supplier A" },
    { id: 2, name: "Supplier B" },
    { id: 3, name: "Supplier C" },
  ])
  const {
    getorderType,
    orderTypee,
    productId,
    customer,
    getprodId,
    getCustomer,
  } = useorder();


  const [selectedSuppliers, setSelectedSuppliers] = useState([]);

const navigate= useNavigate();









  // Close modal












  console.log(productId, "looool");
  const { id } = useParams();





  const handleUpdateSubmit = async (values) => {
    const formattedValues = {
      updateShippingDate: values?.updateShippingDate,
    };

    try {
      const url = `${UPDATE_ORDERCREATEDDATE}/${id}`;
      const method = "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedValues),
      });

      // Get response as text (not JSON)
      const message = await response.text();

      if (response.ok) {
        toast.success("Order Shipping Date Updated Successfully");
        navigate("/order/updateShippingDate")
      } else {
        toast.error(message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error in handleUpdateSubmit:", error);
      toast.error("An error occurred");
    }
  };




  const getOrderById = async () => {
    try {
      const response = await fetch(`${GET_ORDERBYID_URL}/${id}`, {
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
      setOrder(data); // Store fetched product
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setIsLoading(false); // Stop loader
    }
  };
  console.log(order, 'hloooooo')

  // Fetch data when component mounts
  useEffect(() => {
    getOrderById();
  }, [id]);

  const [prodIdModal, setprodIdModal] = useState([])










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










  console.log(prodIdModal, "proddidmodal");











  console.log(selectedSuppliers, "umerjj");
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Order/Update Order" />
      <div>
        <Formik
          enableReinitialize={true}
          initialValues={{
            orderNo: order?.orderNo || '',
            orderType: order?.orderType || '',
            orderDate: order?.orderDate || '',
            shippingDate: order?.shippingDate || "",
            updateShippingDate: "",




          }}


        >
          {({ values, setFieldValue, handleBlur, isSubmitting }) => (
            <Form>
              <div className="flex flex-col gap-9">
                {/* Form fields */}
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                      Update Order Shipping Date
                    </h3>
                  </div>
                  <div className="p-6.5">
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Order No</label>
                        <ReactSelect
                          name="orderNo"
                          // value={orderTypeOptions?.find(option => option.value === values.orderType?.id) || null}
                          // onChange={(option) => setFieldValue('orderType', option ? option.orderTypeObject : null)}
                          // options={orderTypeOptions}
                          value={order?.orderNo ? { label: order.orderNo, value: order.orderNo } : null} // Display orderNo
                          styles={customStyles}
                          className="bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          placeholder="Select Order Type"


                          isDisabled={true}
                        />
                        <ErrorMessage name="orderType" component="div" className="text-red-600 text-sm" />
                      </div>

                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Order Type</label>
                        <ReactSelect
                          name="orderType"
                          value={orderTypeOptions?.find(option => option.value === values.orderType?.id) || null}
                          onChange={(option) => setFieldValue('orderType', option ? option.orderTypeObject : null)}
                          options={orderTypeOptions}
                          styles={customStyles}
                          className="bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          placeholder="Select Order Type"
                          isDisabled={true}
                        />
                        <ErrorMessage name="orderType" component="div" className="text-red-600 text-sm" />
                      </div>

                      <div className="flex-1 min-w-[200px]">

                        <div className="flex-1 min-w-[300px] mt-4">
                          <label className="mb-2.5 block text-black dark:text-white"> Order Date</label>
                          <Field
                            name='orderDate'
                            type="date"
                            placeholder="Enter Order Date"
                            className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"

                          />
                        </div>
                        <ErrorMessage name="orderDate" component="div" className="text-red-600 text-sm" />
                      </div>


                    </div>


                    <div className="flex flex-wrap gap-4">






                      <div className="flex-1 min-w-[300px] mt-4">
                        <label className="mb-2.5 block text-black dark:text-white">Shipping Date</label>
                        <Field
                          name='shippingDate'
                          type="date"
                          placeholder="Enter Shipping Date"

                          className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                        />

                        <ErrorMessage name="shippingDate" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label className="mb-2.5 block text-black dark:text-white">Updated Shipping Date</label>
                        <Field
                          name='updateShippingDate'
                          type="date"
                          placeholder="Enter Updated Shipping Date"

                          className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                        />

                        <ErrorMessage name="shippingDate" component="div" className="text-red-600 text-sm" />
                      </div>
                    </div>















                    {/* <button
                      type="submit"
                      className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-4"
                      disabled={isSubmitting}
                    >
                     Update Order
                    </button> */}

                    <div className="flex justify-center mt-4"> {/* Centering the button */}
                      <button
                        type="button" // Ensures the button does not trigger the form submission
                        onClick={(e) => handleUpdateSubmit(values, e)}
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





      </div>
    </DefaultLayout>
  );
};

export default UpdateOrderShippingDate;
