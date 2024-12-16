import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import { Field, Formik } from 'formik'
import ReactSelect from 'react-select';
import useorder from '../../hooks/useOrder';
import Modal from './Modal';
import { GET_PRODUCTBYID_URL } from '../../Constants/utils';


const UpdateOrder = () => {
    const [orderTypeOptions, setorderTypeOptions] = useState([])
const [prodIdOptions, setprodIdOptions] = useState([])
 const [orderType, setOrderType] = useState('');
 const [isModalOpen, setIsModalOpen] = useState(false);
   const [prodIdd, setprodIdd] = useState("");

 const {
    getorderType,
    orderTypee,
    productId,
    getprodId

  } = useorder();


 const handleProductIdChange = (option, setFieldValue) => {
    console.log(option, "optionnnnnnn");
    setFieldValue('productId', option.prodId);
    setprodIdd(option.prodId)

    setIsModalOpen(true);

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

      const productgrp = [
        { value: 'BrandA', label: 'Brand A' },
        { value: 'BrandB', label: 'Brand B' },
        { value: 'BrandC', label: 'Brand C' },
      ];

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
      

  return (
    <>
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
                //   validationSchema={validationSchema}
                //   onSubmit={handleSubmit}
                >

               {({ setFieldValue, values ,handleBlur}) => (
                 <form>
                    <div className="flex flex-col gap-9">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                         <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                            Update Order
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
                            
                             </div>
                      


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

                                         </div>

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
                      {/* <ErrorMessage name="productId" component="div" className="text-red-600 text-sm" /> */}
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
                      {/* <ErrorMessage name="clientInstruction" component="div" className="text-red-600 text-sm" /> */}
                    </div>


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
                 </form>
                    )}


{/* <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                prodIdd={prodIdd}
                GET_PRODUCTBYID_URL={GET_PRODUCTBYID_URL}
                initialValues={{ orderCategory: '', productId: '' }}  // Ensure initial values are passed
                onSubmit={(values) => {
                  console.log("Form submitted:", values);
                  // Handle form submission logic here
                  // For example, make an API call, and then close the modal
                  setIsModalOpen(false);
                }}
                width="70%"
                height="80%"
                style={{ marginLeft: '70px', marginRight: '0' }}  // Add this line
              /> */}



                </Formik>
    </div>
    </DefaultLayout>
    </>
  )
}

export default UpdateOrder