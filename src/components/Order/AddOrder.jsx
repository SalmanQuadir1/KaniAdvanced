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

const AddOrder = () => {
  const [orderType, setOrderType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderTypeOptions, setorderTypeOptions] = useState([])


  const {
    getorderType,
    orderTypee

  } = useorder();


  useEffect(() => {
    getorderType();

  }, [])

  console.log(orderTypee, "ordd");

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
    setFieldValue('productId', option.value);
    setIsModalOpen(true);
  };
  const handleSubmit = (values, { setSubmitting }) => {

    console.log(values, "kiki");
    // setTimeout(() => {
    //   alert(JSON.stringify(values, null, 2));
    //   setSubmitting(false);
    //   console.log('Form Submitted:', values);
    // }, 400);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Order/Create Order" />
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
                      Add Order
                    </h3>
                  </div>
                  <div className="p-6.5">
                    <div className="flex flex-wrap gap-4">
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
                        console.log(values.orderType,"kiki")


                      )}


                      <div className="flex-1 min-w-[200px]">
                      
                        <div className="flex-1 min-w-[200px]">
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
                   
                    {values.orderType.orderTypeName==="RetailClients" && (
                         
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
                      </div>

                    )}
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

                    {/* <div className="flex-1 min-w-[200px] mt-11">
                      <label className="mb-2.5 block text-black dark:text-white">Product Id</label>
                      <ReactSelect
                        name="productId"
                        value={productgrp.find(option => option.value === values.productId)}
                        onChange={(option) => setFieldValue('productId', option.value)}
                        onBlur={handleBlur}
                        options={productgrp}
                        styles={customStyles}
                        className="bg-white dark:bg-form-input"
                        classNamePrefix="react-select"
                        placeholder="Select"
                      />
                      <ErrorMessage name="productId" component="div" className="text-red-600 text-sm" />
                    </div> */}
                    <div className="flex-1 min-w-[200px] mt-11">
                      <label className="mb-2.5 block text-black dark:text-white">Product Id</label>
                      <ReactSelect
                        name="productId"
                        value={productgrp.find(option => option.value === values.productId)}
                        onChange={(option) => handleProductIdChange(option, setFieldValue)}
                        onBlur={handleBlur}
                        options={productgrp}
                        styles={customStyles}
                        className="bg-white dark:bg-form-input"
                        classNamePrefix="react-select"
                        placeholder="Select"

                      />
                      <ErrorMessage name="productId" component="div" className="text-red-600 text-sm" />
                    </div>


                    {orderType && (
                      <div
                        className="inline-block max-w-screen-md shadow-md rounded-lg overflow-hidden mt-7 ml-11"
                      >
                        <div className="overflow-x-auto max-w-full">
                          <table className="min-w-full leading-normal">
                            <thead>
                              <tr className='bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                <th
                                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
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

                          </table>
                        </div>
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



                    <button
                      type="submit"
                      className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-4"
                      disabled={isSubmitting}
                    >
                      Add Order Group
                    </button>
                  </div>
                </div>
              </div>

              <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                initialValues={{ orderCategory: '', productId: '' }}
                onSubmit={(values) => {
                  // Handle form submission here
                  console.log(values);
                  setIsModalOpen(false);
                }}
                width="70%"
                height="80%"
                style={{ marginLeft: '70px', marginRight: '0' }}  // Add this line
              />

            </Form>
          )}
        </Formik>
      </div>
    </DefaultLayout>
  );
};

export default AddOrder;
