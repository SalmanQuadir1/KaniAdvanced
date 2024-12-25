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
import { GET_INVENTORYLOCATION, GET_PRODUCTBYID_URL } from '../../Constants/utils';
import { IoIosAdd, IoMdAdd, IoMdTrash } from "react-icons/io";
import Modall from './Modal';
import SupplierModal from './SupplierModal';
import { FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
const AddOrder = () => {
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const [supplierSelections, setSupplierSelections] = useState({});
  const { token } = currentUser;
  const [orderType, setOrderType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderTypeOptions, setorderTypeOptions] = useState([])
  const [customerOptions, setcustomerOptions] = useState([])
  const [prodIdOptions, setprodIdOptions] = useState([])
  const [prodIdd, setprodIdd] = useState("")

  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isINVENTORYModalOpen, setIsINVENTORYModalOpen] = useState(false);
  const [selectedINVENTORYData, setSelectedINVENTORYData] = useState(null);
  const [suppId, setsuppId] = useState()
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "Supplier A" },
    { id: 2, name: "Supplier B" },
    { id: 3, name: "Supplier C" },
  ])
  const {
    getorderType,
    orderTypee,
    productId,
    getprodId,
    getCustomer,
    customer,
    handleSubmit




  } = useorder();


  const [selectedSuppliers, setSelectedSuppliers] = useState([]);


  const handleCheckboxChange = (supplierId) => {
    console.log(supplierId, "shahumer");
    setSelectedSuppliers((prev) =>
      prev.includes(supplierId)
        ? prev.filter((id) => id !== supplierId) // Remove if already selected
        : [...prev, supplierId] // Add if not selected
    );
  };

  console.log(selectedSuppliers, "selecteddddddddd Suppliersss");

  const openSupplierModal = (id) => {
    console.log("opening supplier  modal");
    setIsSupplierModalOpen(true);
    console.log(id, "ghson");
    setsuppId(id)
  };


  console.log(isSupplierModalOpen, "ll");

  console.log(isModalOpen, "jj");


  // Close modal
  const closeSupplierModal = () => {
    setIsSupplierModalOpen(false);
  };


  const handleSupplierModalSubmit = () => {
    console.log("Selected Suppliers:", selectedSuppliers);
    closeSupplierModal();
  };







  useEffect(() => {
    getorderType();
    getprodId();
    getCustomer();





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
    if (customer) {
      const formattedCustomerOptions = customer.map(customer => ({
        value: customer.id,
        label: customer?.customerName,
        customerObject: customer,
        customer: customer.id
      }));
      setcustomerOptions(formattedCustomerOptions);
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
    { value: 'KLC', label: 'KLC' },
    { value: 'CLIENT', label: 'CLIENT' },
    { value: 'NO T&L', label: 'NO T&L' },
  ];

  const salesChannel = [
    { value: 'WS-Domestic', label: 'WS-Domestic' },
    { value: 'Websale', label: 'Websale' },
    { value: 'Social Media', label: 'Social Media' },
    { value: 'Shop-in-Shop', label: 'Shop-in-Shop' },
    { value: 'WS-International', label: 'WS-International' },
    { value: 'Event-International', label: 'Event-International' },
    { value: 'Event-Domestic', label: 'Event-Domestic' },
    { value: 'Retail-Delhi', label: 'Retail-Delhi' },
    { value: 'Retail-SXR', label: 'Retail-SXR' },
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

  // const validationSchema = Yup.object().shape({
  //   orderType: Yup.string().required('Order Type is required'),
  //   orderDate: Yup.date().required('Order Date is required'),
  //   shippingDate: Yup.date().required('Shipping Date is required'),
  //   tags: Yup.string().required('Tags are required'),
  //   logoNo: Yup.string().required('Logo No is required'),
  //   productId: Yup.string().required('Product Id is required'),
  //   clientInstruction: Yup.string().required('Client Instruction is required'),
  //   customer: orderType ? Yup.string().required('Customer is required') : Yup.string(),
  // });

  const handleProductIdChange = (option, setFieldValue) => {

console.log(option,"mein hun option");

setFieldValue('productId', option.prodId);

setprodIdd(option?.prodId)
console.log("opennnnnnnn");
    setIsModalOpen(true);
    setIsSupplierModalOpen(false)

  };


  const handleModalSubmit = (values) => {


    setprodIdModal((prevValues) => [...prevValues, values])
    setIsModalOpen(false)

  }

  const openINVENTORYModal = (id) => {


    const getInventory = async () => {

      try {
        const response = await fetch(`${GET_INVENTORYLOCATION}/${id}`, {
          method: "GET",
          headers: {
            // "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();

        console.log(data, "juju");
        // setLocation(data);
        setSelectedINVENTORYData(data);


      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch Product");
      }
    };

    getInventory()
      // useEffect(() => {
      //     getInventory()
      // }, [])




      ;
    setIsINVENTORYModalOpen(true);
  };

  const closeINVENTORYModal = () => {
    setIsINVENTORYModalOpen(false);
    setSelectedINVENTORYData(null);
  };



 
  console.log(prodIdModal, "proddidmodal");
  // console.log("Initial Values: ", prodIdModal?.map(item => ({
  //   products: { id: item?.productId || "" },
  //   orderCategory: item?.orderCatagory || "",
  //   clientOrderQuantity: item?.clientOrderQuantity || "",
  // })));

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

            orderProducts: [{
              products: { id: '' },
              orderCategory: '',
              clientOrderQuantity: '',
              units: '',
              value: '',
              inStockQuantity: '',
              quantityToManufacture: '',
              clientShippingDate: '',
              expectedDate: '',
              productSuppliers: [
                {
                  supplier: {
                    id: "", // Supplier ID
                  },
                  supplierOrderQty: "",
                },
              ],
            }]

          }}
          // validationSchema={validationSchema}
          // onSubmit={(values) => {

          //   console.log("Formik Values: ", values); // Log the entire form values
          // }}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, handleBlur, isSubmitting }) => {
            useEffect(() => {
              // Automatically populate fields based on `prodIdModal`
              prodIdModal.forEach((item, index) => {
                setFieldValue(`orderProducts[${index}].products.id`, item?.id || "");
                setFieldValue(`orderProducts[${index}].orderCategory`, item.orderCatagory || "");
                setFieldValue(`orderProducts[${index}].clientOrderQuantity`, item.clientOrderQuantity || "");
                setFieldValue(`orderProducts[${index}].units`, item.units || "");
              });
            }, [prodIdModal, setFieldValue])
            useEffect(() => {
              // Automatically populate supplier fields for each product
              prodIdModal.forEach((_, productIndex) => {
                selectedSuppliers?.forEach((supplier, supplierIndex) => {
                  setFieldValue(
                    `orderProducts[${productIndex}].productSuppliers[${supplierIndex}].supplier.id`,
                    supplier.id || ""
                  );
                });
              });
            }, [prodIdModal, selectedSuppliers, setFieldValue]);






            return (
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
                            value={
                              orderTypeOptions?.find(option => option.value === values.orderType.id) || null
                            }
                            onChange={(option) =>
                              setFieldValue('orderType', option ? { id: option.value } : null) // Send only ID
                            }
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



                      {(() => {
                        const selectedOrderType = orderTypeOptions.find(
                          (option) => option.value === values.orderType?.id
                        );

                        return (
                          selectedOrderType &&
                          (selectedOrderType.label === "RetailClients" || selectedOrderType.label === "WSClients") && (

                            <div >
                              <div className="flex-1 min-w-[300px] mt-4">
                                <label className="mb-2.5 block text-black dark:text-white">Customer</label>
                                <ReactSelect
                                  name="Customer"
                                  value={customerOptions?.find(option => option.value === values.customer?.id) || null}
                                  onChange={(option) => setFieldValue('customer', option ? { id: option.value } : null)}
                                  options={customerOptions}
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
                                    value={salesChannel.find(option => option.value === values.salesChannel)}
                                    onChange={(option) => setFieldValue('salesChannel', option.value)}
                                    onBlur={handleBlur}
                                    options={salesChannel}
                                    styles={customStyles}
                                    className="bg-white dark:bg-form-input"
                                    classNamePrefix="react-select"
                                    placeholder="Select"
                                  />
                                  <ErrorMessage name="tags" component="div" className="text-red-600 text-sm" />
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

                          )
                        );
                      })()}
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

                      {isINVENTORYModalOpen && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-95 flex justify-center items-center  z-50">
                          <div className="bg-slate-100 border border-b-1 rounded p-6 shadow-lg ml-[200px]  w-[870px] h-[400px] mt-[60px]">
                            <div className="text-right">
                              <button onClick={closeINVENTORYModal} className="text-red-500 text-xl  font-bold">&times;</button>
                            </div>
                            <h2 className="text-2xl text-center mb-4 font-extrabold">INVENTORY  DETAILS</h2>
                            <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                              <table className="min-w-full leading-normal">
                                <thead>
                                  <tr className='px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" >LOCATION</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">OPENING BALANCE</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">BRANCH TRANSFER (INWARDS)</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">BRANCH TRANSFER (OUTWARDS)</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">CLOSING BALANCE</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">PURCHASE</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SALE</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">IN PROGRESS ORDERS</th>
                                  </tr>
                                </thead>
                                <tbody>


                                  {selectedINVENTORYData?.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="px-2 py-2 border-b">
                                        <p>{row?.location?.address}</p>

                                      </td>
                                      <td className="px-2 py-2 border-b">
                                        <p>{row?.openingBalance}</p>

                                      </td>
                                      <td className="px-2 py-2 border-b">
                                        {row.branchTransferInwards}
                                      </td>
                                      <td className="px-2 py-2 border-b">
                                        {row.branchTransferOutwards}

                                      </td>
                                      <td className="px-2 py-2 border-b">
                                        {row.closingBalance}
                                      </td>
                                      <td className="px-2 py-2 border-b">
                                        {row.purchase}

                                      </td>
                                      <td className="px-2 py-2 border-b">
                                        {row.sale}

                                      </td>
                                      <td className="px-2 py-2 border-b">
                                        {row.inProgressOrders}

                                      </td>
                                      {/* <td className="px-2 py-2 border-b">
                                                        <FiTrash2 size={17} className='text-red-500 hover:text-red-700 mx-2' title='Delete BOM' />

                                                    </td> */}

                                    </tr>
                                  ))}


                                </tbody>
                              </table>
                            </div>

                            {/* <pre>{JSON.stringify(selectedBOMData, null, 2)}</pre> */}
                          </div>
                        </div>
                      )}



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
                                  View Product Inventory
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
                                  Supplier Details
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



                              {prodIdModal?.map((item, index) => (
                                <tr key={index} className='bg-white dark:bg-slate-700 dark:text-white px-5 py-3'>
                                  <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                    <div >

                                      <Field
                                        name={`orderProducts[${index}].products.id`}

                                        value={item?.productId || ""}

                                        placeholder="Enter Prchase Order"
                                        onChange={(e) => {
                                          console.log(`Product ID: ${e.target.value}`); // Log the value on change
                                        }}
                                        className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      />
                                      <ErrorMessage name="customer" component="div" className="text-red-600 text-sm" />
                                    </div>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                    <div >

                                      <Field
                                        name={`orderProducts[${index}].orderCategory`}
                                        // value={item?.orderCatagory || ""}
                                        placeholder="Enter Order Category"
                                        onChange={(e) => {
                                          console.log(`Order Category: ${e.target.value}`);
                                          setFieldValue(`orderProducts[${index}].orderCategory`, e.target.value); // Update the field value manually
                                        }}
                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      />
                                      <ErrorMessage name="orderCatagory" component="div" className="text-red-600 text-sm" />
                                    </div>
                                  </td>


                                  <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                    <div >

                                      <Field
                                        name={`orderProducts[${index}].clientOrderQuantity`}
                                        // value={item?.productId}
                                        placeholder="Enter Client Order Qty"
                                        className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      />
                                      <ErrorMessage name="clientOrderQty" component="div" className="text-red-600 text-sm" />
                                    </div>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                    <div >

                                      <Field
                                        name={`orderProducts[${index}].units`}
                                        // value={item?.units}
                                        placeholder="Enter Units"
                                        className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      />
                                      <ErrorMessage name="Units" component="div" className="text-red-600 text-sm" />
                                    </div>
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                    <div >

                                      <Field
                                        name={`orderProducts[${index}].inStockQuantity`}
                                        // value={item?.productId}
                                        placeholder="Enter In Stock Qty"
                                        className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      />
                                      <ErrorMessage name="InStockQty" component="div" className="text-red-600 text-sm" />
                                    </div>
                                  </td>


                                  <td className="px-2 py-5 border-b border-gray-200  text-sm ">


                                    <div >

                                      <span onClick={() => openINVENTORYModal(item?.id)} className="bg-green-100 text-green-800 text-[10px] font-medium me-2 text-center py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-pointer w-[220px]"> VIEW INVENTORY</span>


                                    </div>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                    <div >

                                      <Field
                                        name={`orderProducts[${index}].quantityToManufacture`}
                                        // value={item?.productId}
                                        placeholder="Enter Qty To Manufacture"
                                        className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      />
                                      <ErrorMessage name="QtyToManufacture" component="div" className="text-red-600 text-sm" />
                                    </div>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                    <div >

                                      <Field
                                        name={`orderProducts[${index}].value`}
                                        // value={item?.productId}
                                        placeholder="Enter Value"
                                        className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      />
                                      <ErrorMessage name="Value" component="div" className="text-red-600 text-sm" />
                                    </div>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                    <div >

                                      <Field
                                        type="date"
                                        name={`orderProducts[${index}].clientShippingDate`}

                                        placeholder="Enter Client Shipping Date"
                                        className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      />
                                      <ErrorMessage name="ClientShippingDate" component="div" className="text-red-600 text-sm" />
                                    </div>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                    <div >

                                      <Field
                                        type="date"
                                        name={`orderProducts[${index}].expectedDate`}

                                        placeholder="Enter Expected Date"
                                        className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      />
                                      <ErrorMessage name="ExpectedDate" component="div" className="text-red-600 text-sm" />
                                    </div>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200  text-sm">

                                    <td className="px-5 py-5   text-sm">
                                      <div >
                                        <IoIosAdd size={30} onClick={() => openSupplierModal(item?.id)} />
                                      </div>
                                    </td>
                                  </td>




                                  <td className="px-5 py-5 border-b border-gray-200  text-sm">

                                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                                      <div
                                        className="inline-block min-w-full shadow-md rounded-lg overflow-hidden"
                                      >
                                        <table className="min-w-full leading-normal">
                                          <thead>
                                            <tr className='px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                              <th

                                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                              >
                                                Supplier Name
                                              </th>
                                              <th

                                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                              >
                                                Supplier Quantity
                                              </th>

                                              <th

                                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                              >
                                                Action
                                              </th>

                                            </tr>
                                          </thead>
                                          <tbody>

                                            {selectedSuppliers?.map((supplier, supplierIndex) => (
                                              <tr key={supplierIndex} className='bg-white dark:bg-slate-700 dark:text-white px-5 py-3'>
                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                  <Field
                                                    name={`orderProducts[${index}].productSuppliers[${supplierIndex}].supplier.id`}
                                                    placeholder="Supplier Name"
                                                    value={supplier.supplierName || ""}
                                                    onChange={(e) =>
                                                      setFieldValue(`orderProducts[${index}].productSuppliers[${supplierIndex}].supplier.id`, e.target.value)
                                                    }
                                                    className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                                  />
                                                  <ErrorMessage name={`orderProducts[${index}].productSuppliers[${supplierIndex}].supplier.id`} component="div" className="text-red-600 text-sm" />
                                                </td>

                                                <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                                  <div >

                                                    <Field
                                                      name={`orderProducts[${index}].productSuppliers[${supplierIndex}].supplierOrderQty`}
                                                      placeholder="Supplier Quantity"
                                                      className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                                    />
                                                    <ErrorMessage name="quantity" component="div" className="text-red-600 text-sm" />
                                                  </div>

                                                </td>
                                                <td className="px-5 py-5  border-b border-gray-200  text-sm">
                                                  <p className="flex text-gray-900 whitespace-no-wrap">
                                                    {/* <FiEdit size={17} className='text-teal-500 hover:text-teal-700 mx-2' onClick={(e) => handleUpdate(e, item)} title='Edit Unit' />  | */}
                                                    <FiTrash2 size={17} className='text-red-500  hover:text-red-700 mx-2' onClick={(e) => handleDelete(e, item?.id)} title='Delete Unit' />
                                                  </p>
                                                </td>
                                              </tr>
                                            ))}



                                          </tbody>
                                        </table>
                                      </div>
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


              </Form>
            )
          }}
        </Formik>
        {isSupplierModalOpen && (
          <SupplierModal
            suppliers={suppliers}
            id={suppId}
            selectedSuppliers={selectedSuppliers}
            handleCheckboxChange={handleCheckboxChange}
            closeModal={closeSupplierModal}
            handleSubmit={handleSupplierModalSubmit}
          />
        )}

        <Modall
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

export default AddOrder;
