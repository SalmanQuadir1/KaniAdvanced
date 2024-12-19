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
import useProduct from '../../hooks/useProduct';
import { GET_PRODUCTBYID_URL } from '../../Constants/utils';
import { IoMdAdd, IoMdTrash } from "react-icons/io";
const UpdateOrder = () => {
  const [orderType, setOrderType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderTypeOptions, setorderTypeOptions] = useState([])
  const [prodIdOptions, setprodIdOptions] = useState([])
  const [prodIdd, setprodIdd] = useState("")


  const {
    getorderType,
    orderTypee,
    productId,
    getprodId

  } = useorder();




  useEffect(() => {
    getorderType();
    getprodId();





  }, [])

  console.log(productId, "looool");

  const [prodIdModal, setprodIdModal] = useState([])

  useEffect(() => {
    if (orderTypee) {
      const formattedOptions = orderTypee.map(order => ({
        value: order.id,
        label: order?.orderTypeName,
        orderTypeObject: order,
        orderTypeId: { id: order.id }
      }));
      setorderTypeOptions(formattedOptions);
    }

    if (productId) {
      const formattedProdIdOptions = productId.map(prodId => ({
        value: prodId.id,
        label: prodId?.productId,
        prodIdObject: prodId,
        prodId: prodId.id
      }));
      setprodIdOptions(formattedProdIdOptions);
    }
  }, [orderTypee]);



  const customModalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      width: '50%',
      height: '70%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const productgrp = [
    { value: 'BrandA', label: 'Brand A' },
    { value: 'BrandB', label: 'Brand B' },
    { value: 'BrandC', label: 'Brand C' },
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

  const validationSchema = Yup.object().shape({
    orderType: Yup.string().required('Order Type is required'),
    orderDate: Yup.date().required('Order Date is required'),
    shippingDate: Yup.date().required('Shipping Date is required'),
    tags: Yup.string().required('Tags are required'),
    logoNo: Yup.string().required('Logo No is required'),
    productId: Yup.string().required('Product Id is required'),
    clientInstruction: Yup.string().required('Client Instruction is required'),
    customer: orderType ? Yup.string().required('Customer is required') : Yup.string(),
  });

  const handleProductIdChange = (option, setFieldValue) => {
    console.log(option, "optionnnnnnn");
    setFieldValue('productId', option.prodId);
    setprodIdd(option.prodId)

    setIsModalOpen(true);

  };


  const handleModalSubmit = (values) => {
    console.log(values, "japnam");
    setprodIdModal([values])
    setIsModalOpen(false)

  }

  const handleSubmit = (values, { setSubmitting }) => {

    console.log(values, "kiki");
    // setTimeout(() => {
    //   alert(JSON.stringify(values, null, 2));
    //   setSubmitting(false);
    //   console.log('Form Submitted:', values);
    // }, 400);
  };
  console.log(prodIdModal, "proddidmodal");
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Order/Update Order" />
      <div>
        <Formik
          initialValues={{
            orderType: '',
            orderDate: '',
            shippingDate: '',
            tags: '',
            logoNo: '',
            productId: '',
            clientInstruction: '',
            customer: '',
          }}
          validationSchema={validationSchema}
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
                    
                    <div className="flex flex-wrap gap-4">

                    <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Order No</label>
                        <ReactSelect
                          name="orderType"
                          // value={orderTypeOptions?.find(option => option.value === values.orderType?.id) || null}
                          // onChange={(option) => setFieldValue('orderType', option ? option.orderTypeObject : null)}
                          // options={orderTypeOptions}
                          styles={customStyles}
                          className="bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          placeholder="Select Order Type"
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
                        />
                        <ErrorMessage name="orderType" component="div" className="text-red-600 text-sm" />
                      </div>
                      {values.orderType && (
                        console.log(values.orderType, "kiki")


                      )}


                     
                    </div>

                    {(values.orderType.orderTypeName === "RetailClients" || values.orderType.orderTypeName === "WSClients") && (

                      <div >
                        <div className="flex-1 min-w-[300px] mt-4">
                          <label className="mb-2.5 block text-black dark:text-white">Customer</label>
                          <ReactSelect
                            name="Customer"
                            value={orderTypeOptions?.find(option => option.value === values.orderType?.id) || null}
                            onChange={(option) => setFieldValue('orderType', option ? option.orderTypeObject : null)}
                            options={orderTypeOptions}
                            styles={customStyles}
                            className="bg-white dark:bg-form-Field"
                            classNamePrefix="react-select"
                            placeholder="Select Customer"
                          />
                          <ErrorMessage name="Customer" component="div" className="text-red-600 text-sm" />
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex-1 min-w-[200px] mt-7">
                            <label className="mb-2.5 block text-black dark:text-white">Customer Purchase Order No</label>
                            <Field
                              name="purchaseOrder"
                              placeholder="Enter Prchase Order"
                              className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                            />
                            <ErrorMessage name="customer" component="div" className="text-red-600 text-sm" />
                          </div>
                          <div className="flex-1 min-w-[200px] mt-7">
                            <label className="mb-2.5 block text-black dark:text-white">PO Date</label>
                            <Field
                              name='poDate'
                              type="date"
                              placeholder="Enter Purchase Order Date"
                              className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                            />
                            <ErrorMessage name="poDate" component="div" className="text-red-600 text-sm" />
                          </div>
                        </div>


                        <div className="flex flex-wrap gap-4">
                          <div className="flex-1 min-w-[300px] mt-4">
                            <label className="mb-2.5 block text-black dark:text-white">Sales Channel</label>
                            <ReactSelect
                              name="salesChannel"
                              value={orderTypeOptions?.find(option => option.value === values.orderType?.id) || null}
                              onChange={(option) => setFieldValue('orderType', option ? option.orderTypeObject : null)}
                              options={orderTypeOptions}
                              styles={customStyles}
                              className="bg-white dark:bg-form-Field"
                              classNamePrefix="react-select"
                              placeholder="Select Customer"
                            />
                            <ErrorMessage name="Customer" component="div" className="text-red-600 text-sm" />
                          </div>


                          <div className="flex-1 min-w-[200px] mt-4">
                            <label className="mb-2.5 block text-black dark:text-white">Employee Name</label>
                            <Field
                              name="employeeName"
                              placeholder="Enter Employee Name"
                              className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                            />
                            <ErrorMessage name="employeeName" component="div" className="text-red-600 text-sm" />
                          </div>
                        </div>

                      </div>

                    )}
                    <div className="flex flex-wrap gap-4">

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


                      <div className="flex-1 min-w-[300px] mt-4">
                        <label className="mb-2.5 block text-black dark:text-white">Expected Receiving Date</label>
                        <Field
                          name='shippingDate'
                          type="date"
                          placeholder="Enter Shipping Date"
                          className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="shippingDate" component="div" className="text-red-600 text-sm" />
                      </div>

                     
                    </div>
                    <div className="flex flex-wrap gap-4">


                    <div className="flex-1 min-w-[300px] mt-4">
                        <label className="mb-2.5 block text-black dark:text-white">Tags</label>
                        <ReactSelect
                          name="tags"
                          value={productgrp.find(option => option.value === values.tags)}
                          onChange={(option) => setFieldValue('tags', option.value)}
                          onBlur={handleBlur}
                          options={productgrp}
                          styles={customStyles}
                          className="bg-white dark:bg-form-input"
                          classNamePrefix="react-select"
                          placeholder="Select"
                        />
                        <ErrorMessage name="tags" component="div" className="text-red-600 text-sm" />
                      </div>

                    <div className="flex-1 min-w-[300px] mt-4">
                      <label className="mb-2.5 block text-black dark:text-white">Logo No</label>
                      <div>
                        <label className="flex items-center">
                          <Field type="radio" name="logoNo" value="Yes" />
                          <span className="ml-1">Yes</span>
                        </label>
                        <label className="flex items-center">
                          <Field type="radio" name="logoNo" value="No" />
                          <span className="ml-1">No</span>
                        </label>
                      </div>
                      <ErrorMessage name="logoNo" component="div" className="text-red-600 text-sm" />
                    </div>

                    </div>





                    {orderType && (
                      <div >

                        <div className="flex flex-wrap gap-4">
                          <div className="flex-1 min-w-[200px] mt-7">
                            <label className="mb-2.5 block text-black dark:text-white">Employee Name</label>
                            <Field
                              name="employeeName"
                              placeholder="Enter Prchase Order"
                              className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                            />
                            <ErrorMessage name="customer" component="div" className="text-red-600 text-sm" />
                          </div>

                        </div>
                      </div>

                    )}

                    
                    <div className="flex-1 min-w-[200px] mt-11">
                      <label className="mb-2.5 block text-black dark:text-white">Product Id</label>
                      <ReactSelect
                        name="productId"
                        value={prodIdOptions?.find(option => option.value === values.productId?.id) || null}

                        onChange={(option) => handleProductIdChange(option, setFieldValue)}

                        options={prodIdOptions}
                        styles={customStyles}
                        className="bg-white dark:bg-form-Field"
                        classNamePrefix="react-select"
                        placeholder="Select ProductId"
                      />
                      <ErrorMessage name="productId" component="div" className="text-red-600 text-sm" />
                    </div>


                    




                    {prodIdModal.length > 0 && (

                      <div className="  shadow-md rounded-lg  mt-3 overflow-scroll">
                        <table className="min-w-full leading-normal overflow-auto">
                          <thead>
                            <tr className='bg-slate-300 dark:bg-slate-700 dark:text-white'>
                              <th
                                className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider "
                              >
                                Product Id
                              </th>
                              <th
                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                              >
                                Order Category
                              </th>
                              <th
                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                              >
                                Client Order Qty
                              </th>
                              <th
                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                              >
                                Units
                              </th>
                              <th
                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                              >
                                In Stock Qty
                              </th>
                              <th
                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                              >
                                Qty To Manufacture
                              </th>
                              <th
                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                              >
                                Value
                              </th>
                              <th
                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                              >
                                Client Shipping Date
                              </th>
                              <th
                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                              >
                                Expected Date
                              </th>
                              <th
                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                              >
                                Add Weaver/Embroider
                              </th>
                              <th
                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                              >
                                Weaver/Embroider Details
                              </th>
                              <th
                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                              >
                                Action
                              </th>

                              <th
                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"
                              ></th>
                            </tr>
                          </thead>
                          <tbody>
                            {prodIdModal.map((item, index) => (
                              <tr key={item.id} className='bg-white dark:bg-slate-700 dark:text-white px-5 py-3'>
                                <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                  <div >

                                    <Field
                                      name="employeeName"
                                      value={item?.productId}
                                      placeholder="Enter Prchase Order"
                                      className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage name="customer" component="div" className="text-red-600 text-sm" />
                                  </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                  <div >

                                    <Field
                                      name="employeeName"
                                      value={item?.productId}
                                      placeholder="Enter Prchase Order"
                                      className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage name="customer" component="div" className="text-red-600 text-sm" />
                                  </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                  <div >

                                    <Field
                                      name="employeeName"
                                      value={item?.productId}
                                      placeholder="Enter Prchase Order"
                                      className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage name="customer" component="div" className="text-red-600 text-sm" />
                                  </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                  <div >

                                    <Field
                                      name="employeeName"
                                      value={item?.productId}
                                      placeholder="Enter Prchase Order"
                                      className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage name="customer" component="div" className="text-red-600 text-sm" />
                                  </div>
                                </td>

                                <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                  <div >

                                    <Field
                                      name="employeeName"
                                      value={item?.productId}
                                      placeholder="Enter Prchase Order"
                                      className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage name="customer" component="div" className="text-red-600 text-sm" />
                                  </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                  <div >

                                    <Field
                                      name="employeeName"
                                      value={item?.productId}
                                      placeholder="Enter Prchase Order"
                                      className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage name="customer" component="div" className="text-red-600 text-sm" />
                                  </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                  <div >

                                    <Field
                                      name="employeeName"
                                      value={item?.productId}
                                      placeholder="Enter Prchase Order"
                                      className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage name="customer" component="div" className="text-red-600 text-sm" />
                                  </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                  <div >

                                    <Field
                                      type="date"
                                      name="employeeName"

                                      placeholder="Enter Prchase Order"
                                      className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage name="customer" component="div" className="text-red-600 text-sm" />
                                  </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                  <div >

                                    <Field
                                      type="date"
                                      name="employeeName"

                                      placeholder="Enter Prchase Order"
                                      className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage name="customer" component="div" className="text-red-600 text-sm" />
                                  </div>
                                </td>
                                {/* <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">{item?.orderType?.orderTypeName}</p>
                                </td> */}
                              </tr>

                            ))}


                          </tbody>
                        </table>
                      </div>
                    )}






                    <div className="flex-1 min-w-[200px] mt-11">
                      <label className="mb-2.5 block text-black dark:text-white">Client Instruction</label>
                      <Field
                        as="textarea"
                        name="clientInstruction"
                        placeholder="Enter client instruction"
                        className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                      />
                      <ErrorMessage name="clientInstruction" component="div" className="text-red-600 text-sm" />
                    </div>

                    {(values.orderType.orderTypeName === "RetailClients" || values.orderType.orderTypeName === "WSClients") && (
                      <div className="flex-1 min-w-[200px] mt-11">
                        <label className="mb-2.5 block text-black dark:text-white">Customisation Details</label>
                        <Field
                          as="textarea"
                          name="customisationDetails"
                          placeholder="Enter client instruction"
                          className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="customisationDetails" component="div" className="text-red-600 text-sm" />
                      </div>


                    )}



<div className="flex justify-center mt-4"> {/* Centering the button */}
                                            <button
                                                type="button" // Ensures the button does not trigger the form submission
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
        <Modal
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

export default UpdateOrder;