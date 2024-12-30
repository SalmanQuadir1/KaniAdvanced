import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import { Field, Formik,Form } from 'formik'
//  import Flatpickr from 'react-flatpickr';
 import ReactSelect from 'react-select';
import useorder from '../../hooks/useOrder';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';



 

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


const ViewOrder = () => {

  const { Order, getOrder, pagination ,handlePageChange ,handleUpdate} = useorder();


  const [supplierNameOptions, setsupplierNameOptions] = useState([])
  const [orderNameOptions, setorderNameOptions] = useState([])
  const supplier = useSelector(state => state?.nonPersisted?.supplier);
  const order = useSelector(state => state?.nonPersisted?.order);
  const navigate = useNavigate();
 useEffect(() => {
        getOrder();
        
    }, []);

    console.log(order,"order");
    useEffect(() => {
            if (supplier.data) {
                const formattedOptions = supplier.data.map(supp => ({
                    value: supp.id,
                    label: supp?.name,
                    supplierNameObject: supp,
                    suplierid: { id: supp.id }
                }));
                setsupplierNameOptions(formattedOptions);
            }
        }, [supplier.data]);

        
      //   console.log(order)
      //   useEffect(() => {
      //     if (order.data) {
      //         const formattedOptions = order.data.map(ord => ({
      //             value: ord.id,
      //             label: ord?.name,
      //             orderNameObject: ord,
      //             orderid: { id: ord.id }
      //         }));
      //         setorderNameOptions(formattedOptions);
      //     }
      // }, [order.data]);

const renderTableRows = () => {
  console.log(Order); 
        if (!Order || !Order.length) {
            return (
                <tr className='bg-white dark:bg-slate-700 dark:text-white'>
                    <td colSpan="6" className="px-5 py-5 border-b border-gray-200 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap text-center">No Order Found</p>
                    </td>
                </tr>
            );
        }

        const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

     
  



        return Order.map((item, index) => (
          
            <tr key={index} className='bg-white dark:bg-slate-700 dark:text-white'>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{startingSerialNumber + index}</p>
                </td>
                
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                <p className="text-gray-900 whitespace-no-wrap">{item?.orderNo}</p>

                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item.customerName}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item.productId}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item.name}</p>
                </td>

                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item.orderDate}</p>
                </td>

               



              

                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="flex text-gray-900 whitespace-no-wrap">
                        <FiEdit size={17} className='text-teal-500 hover:text-teal-700 mx-2' onClick={(e) => handleUpdate(e, item)} title='Edit Product' />  |
                        <FiTrash2 size={17} className='text-red-500 hover:text-red-700 mx-2' onClick={(e) => handleDelete(e, item?.id)} title='Delete Product' />
                    </p>
                </td>
            </tr>
        ));
    };






  return (
    <DefaultLayout>
       <Breadcrumb pageName="Order/ View Order" />
       <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
       <div className="pt-5">
       <div className='flex justify-between'>
                        <h2 className="text-xl font-semibold leading-tight">View Order</h2>
                        {/* <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success dark:bg-white dark:text-slate-800`}>
                            TOTAL PRODUCTS: {pagination.totalItems}
                        </p> */}
                    </div>


                    <div className='items-center justify-center'>
                        <Formik
                            initialValues={{
                                ProductId: '',
                            }}
                            // onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, values ,handleBlur }) => (
                                <Form>
                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                                        {/* <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Order Id</label>
                                            <Field
                                                name="orderId"
                                                // component={ReactSelect}
                                                // options={[{ label: 'View All Products', value: null }, ...formattedProductId]}
                                                // styles={customStyles}
                                                placeholder="Select Product Id"
                                                // value={formattedProductId.find(option => option.value === values.ProductId)}
                                                // onChange={option => setFieldValue('ProductId', option ? option.value : '')}
                                            />
                                        </div> */}
                                        <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Order No</label>
                        <ReactSelect
                          name="orderNo"
                          value={orderNameOptions.find(option => option.value === values.orderNo)}
                          onChange={(option) => {
                            setFieldValue('orderType', option.value);
                            setOrderType(option.value);
                          }}
                          onBlur={handleBlur}
                          // options={productgrp}
                          options={orderNameOptions}
                          styles={customStyles}
                          className="bg-white dark:bg-form-input"
                          classNamePrefix="react-select"
                          placeholder="Select"
                        />
                        
                      </div>

                    
                              <div className="flex-1 min-w-[300px]">
            <label className="mb-2.5 block text-black dark:text-white">
                Supplier 
                <span className="text-red-700 text-xl mt-[40px] justify-center items-center"> *</span>
            </label>
            <div className="z-20 bg-transparent dark:bg-form-Field">
                <ReactSelect
                    name="supplier"
                    value={supplierNameOptions?.find(option => option.value === values.supplier?.id) || null}
                    onChange={(option) => setFieldValue('supplier', option ? option.suplierid : null)}
                    options={supplierNameOptions}
                    styles={customStyles} // Pass custom styles here
                    className="bg-white dark:bg-form-Field"
                    classNamePrefix="react-select"
                    placeholder="Select supplier Name"
                />
            </div>
        </div>
                                    </div>

                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                                    <div className="flex-1 min-w-[300px]">
                      <label className="mb-2.5 block text-black dark:text-white">
                        From Date
                      </label>
                      <Field
                            name='fromDate'
                            type="date"
                            placeholder="Enter Purchase Order Date"
                            className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                          />
                    </div>


                    <div className="flex-1 min-w-[300px]">
                      <label className="mb-2.5 block text-black dark:text-white">
                        To Date
                      </label>
                      <Field
                            name='toDate'
                            type="date"
                            placeholder="Enter Purchase Order Date"
                            className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                          />
                    </div>
                                    </div>


                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                                    <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Customer</label>
                        <ReactSelect
                          name="orderType"
                          value={productgrp.find(option => option.value === values.orderType)}
                          onChange={(option) => {
                            setFieldValue('orderType', option.value);
                            setOrderType(option.value);
                          }}
                          onBlur={handleBlur}
                          options={productgrp}
                          styles={customStyles}
                          className="bg-white dark:bg-form-input"
                          classNamePrefix="react-select"
                          placeholder="Select"
                        />
                        
                      </div>

                                    </div>

                                    <div className="flex justify-center">
                                        <button
                                            type="submit"
                                            className="flex md:w-[240px] w-[220px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center  bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
                                        >
                                            Search
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>



                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr className='bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" >SNO</th>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Order No</th>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product Id</th>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Supplier</th>
                                        {/* <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[600px] md:w-[120px]">ADD BOM </th> */}
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ">Order Date </th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTableRows()}
                                </tbody>
                            </table>
                        </div>
                        <Pagination totalPages={pagination.totalPages} currentPage={pagination.currentPage} handlePageChange={handlePageChange} />
                    </div>


       </div>

       </div>

    </DefaultLayout>
  )
}

export default ViewOrder
