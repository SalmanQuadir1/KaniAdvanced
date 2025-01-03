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
import { GET_PRODUCTBYID_URL , GET_ORDERBYID_URL ,UPDATE_ORDER_URL } from '../../Constants/utils';
import { IoIosAdd, IoMdAdd, IoMdTrash } from "react-icons/io";
import ModalUpdate from './ModalUpdate';
import SupplierModal from './SupplierModal';
import { FiTrash2 } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
const UpdateOrder = () => {
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
      return updated;
    });
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
   const { id } = useParams();



   const handleUpdateSubmit = async (values) => {
     
                 console.log(values,"jazim");
         try {
             const url = `${UPDATE_ORDER_URL }/${id}`;
    
             const response = await fetch(url, {
                 method: "PUT",
                 headers: {
                     "Content-Type": "application/json",
                     "Authorization": `Bearer ${token}`
                 },
                 body: JSON.stringify(values)
             });
   
             const data = await response.json();
             if (response.ok) {
              console.log(data,"coming ");
             
                 toast.success(`Order Updated successfully`);
                 // navigate('/inventory/viewMaterialInventory');
   
             } else {
                 toast.error(`${data.errorMessage}`);
             }
         } catch (error) {
             console.error(error);
             toast.error("An error occurred");
         } finally {
          
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
              console.log(data,"datatata")
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

  const salesChannelOptions = [
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

  const validationSchema = Yup.object().shape({
    orderType: Yup.string().required('Order Type is required'),
    orderDate: Yup.date().required('Order Date is required'),
    shippingDate: Yup.date().required('Shipping Date is required'),
    tags: Yup.string().required('Tags are required'),
    logoNo: Yup.string().required('Logo No is required'),
    // productId: Yup.string().required('Product Id is required'),
    clientInstruction: Yup.string().required('Client Instruction is required'),
    customer: orderType ? Yup.string().required('Customer is required') : Yup.string(),
  });

  const handleProductIdChange = (option, setFieldValue) => {



    setFieldValue('productId', option.prodId);
    setprodIdd(option.prodId)
    console.log("opennnnnnnn");
    setIsModalOpen(true);
    setIsSupplierModalOpen(false)

  };


  const handleModalSubmit = (values) => {


    setprodIdModal((prevValues) => [...prevValues, values])
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


  

  // useEffect(() => {
  //   if (productId) {
  //     const formattedProdIdOptions = productId.map(prodId => ({
  //       value: prodId.id,
  //       label: prodId.productId,
  //       prodIdObject: prodId,
  //     }));
  //     setprodIdOptions(formattedProdIdOptions);
  //   }
  // }, [productId]);


  const onSubmit = async (values, e) => {
    console.log("Form submission triggered");
    console.log(values, "Received values from frontend");

    const formattedValues = {
      orderDate: values.orderDate,
      value: parseFloat(values.value),
      shippingDate: values.shippingDate,
      expectingDate: values.expectingDate,
      tagsAndLabels: values.tags,
      logoNo: values.logoNo,
      productionExecutionStatus: "In Progress", // You can change this as needed
      productionComments: values.customisationDetails,
      poDate: values.poDate,
      orderCategory: values.orderCategory,
      purchaseOrderNo: values.purchaseOrderNo,
      clientInstruction: values.clientInstruction,
      status: "Created", // Example static value
      customisationDetails: values.customisationDetails,
      createdBy: "Admin", // Replace with a dynamic value if available
      employeeName: values.employeeName,
      salesChannel: values.salesChannel,
      // customer: {
      //   id: 1, // Replace with the actual customer ID from your `values`
      // },
      customer: {
        id: values.customer?.id || null, // Dynamically include the customer ID or set to null if not available
      },
      orderType: {
        id: values.orderType?.id || 4, // Replace with the actual Order Type ID
      },
      orderProducts: [
        {
          products: {
            id: values.productId, // Product ID from the form values
          },
          clientOrderQuantity: parseFloat(values.orderQuantity),
          orderQuantity: parseFloat(values.orderQuantity),
          value: parseFloat(values.value),
          inStockQuantity: parseFloat(values.inStockQuantity),
          quantityToManufacture: parseFloat(values.quantityToManufacture),
          clientShippingDate: values.clientShippingDate,
          expectedDate: values.expectedDate,
          challanNo: "CH12345", // Replace with dynamic value if available
          challanDate: values.shippingDate,
          productSuppliers: [
            {
              supplier: {
                id: 1, // Replace with actual supplier ID
              },
              supplierOrderQty: parseFloat(values.supplierOrderQty),
            },
          ],
        },
      ],
    };
  
    console.log(JSON.stringify(formattedValues, null, 2), "Formatted Values");
    handleUpdateSubmit(formattedValues, e);
};


  
  
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Order/Update Order" />
      <div>
        <Formik
        enableReinitialize
          initialValues={{
            orderNo: order?.orderNo || '', 
            orderType: order?.orderType || '',
            customer: order?.customer?.customerName || '',
            purchaseOrderNo:order?.purchaseOrderNo || '',
            poDate:order?.poDate || '',
            salesChannel:order?.salesChannel || '',
            employeeName:order?.employeeName || '',
            customisationDetails:order?.customisationDetails || '',
            orderDate: order?.orderDate || '', 
            expectingDate:order?.expectingDate || '',
            shippingDate: '',
            // tags: '',
            tagsAndLabels:order?.tagsAndLabels || '',
            logoNo: '',
            productId: order?.orderProducts?.[0]?.products?.id || null,
            orderCategory:order?.orderCategory || '',
            inStockQuantity: order?.orderProducts?.[0]?.inStockQuantity || '',
            value:order?.value || '',
            orderQuantity: order?.orderProducts?.[0]?.orderQuantity || '',
            quantityToManufacture: order?.orderProducts?.[0]?.quantityToManufacture || '',
            units: order?.orderProducts?.[0]?.units || '',
            clientShippingDate: order?.orderProducts?.[0]?.clientShippingDate || '',
            expectedDate: order?.orderProducts?.[0]?.expectedDate || '',
            supplierName: order?.orderProducts?.[0]?.productSuppliers?.[0]?.supplier?.name || '',
            supplierOrderQty: order?.orderProducts?.[0]?.productSuppliers?.[0]?.supplierOrderQty || 0, // Safely accessing supplierOrderQty

            //productId: order?.productId || '',
            // productId: order?.orderProducts?.products?.productId || '',
          //  productId: order?.orderProducts?.[0]?.products?.productId || '',
            clientInstruction: order?.clientInstruction || '', 
            // customer: '',
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
                           
                            // onChange={(option) => setFieldValue('orderType', option ? option.orderTypeObject : null)}
                            // options={orderTypeOptions}
                            styles={customStyles}
                            className="bg-white dark:bg-form-Field"
                            value={customerOptions?.find(option => option.value === values.customer?.id) || null}
                            onChange={(option) => setFieldValue('customer', option ? { id: option.value } : null)}
                            //value={order?.customer?.customerName ? { label: order.customer.customerName, value: order.customer.customerName } : null} // Display customer name
                            //value={customerOptions?.find(option => option.value === values.customer?.id) || null}
                            options={customerOptions}
                            classNamePrefix="react-select"
                            placeholder="Select Customer"
                          />
                          <ErrorMessage name="Customer" component="div" className="text-red-600 text-sm" />
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex-1 min-w-[200px] mt-7">
                            <label className="mb-2.5 block text-black dark:text-white">Customer Purchase Order No</label>
                            <Field
                              name="purchaseOrderNo"
                              placeholder="Enter Prchase Order"
                              className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                             value={values.purchaseOrderNo}
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
                              value={values.poDate}
                            />
                            <ErrorMessage name="poDate" component="div" className="text-red-600 text-sm" />
                          </div>
                        </div>


                        <div className="flex flex-wrap gap-4">
                          <div className="flex-1 min-w-[300px] mt-4">
                            <label className="mb-2.5 block text-black dark:text-white">Sales Channel</label>
                            <ReactSelect
                              name="salesChannel"
                              // value={
                              //   salesChannelOptions.find(option => option.value === values.salesChannel) || null
                              // }
                              
                              //value={salesChannelOptions.find(option => option.value === values.salesChannelOptions)}
                              value={salesChannelOptions.find(option => option.value === values.salesChannel) || null} // Correctly use `values.salesChannel`
                              // onChange={(option) => setFieldValue('orderType', option ? option.salesChannelOptions : null)}
                              options={salesChannelOptions} 
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
                              value={values.employeeName}
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
                          name='expectingDate'
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
                          name="tagsAndLabels"
                          // value={productgrp.find(option => option.value === values.tags)}
                          value={productgrp.find(option => option.value === values.tagsAndLabels) || null}
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
                        // value={prodIdOptions?.find(option => option.value === values.productId?.id) || null}
                        // values={values.productId}
                        // value={prodIdOptions?.find(option => option.value === values.productId) || null}
                        value={prodIdOptions?.find(option => option.value === values.productId) || null}
                        onChange={(option) => handleProductIdChange(option, setFieldValue)}

                        options={prodIdOptions}
                        styles={customStyles}
                        className="bg-white dark:bg-form-Field"
                        classNamePrefix="react-select"
                        placeholder="Select ProductId"
                      />
                      <ErrorMessage name="productId" component="div" className="text-red-600 text-sm" />
                    </div>



                    {prodIdModal   && (

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
                                 Order Qty
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
                              {/* <th
                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                              >
                                Add Weaver/Embroider
                              </th> */}
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
                              >

                              </th>
                            </tr>
                          </thead>
                          <tbody>




                                 {/* {prodIdModal.map((item, index) => ( */}
                                 <tr >
                                <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                  {/* <div >

                                    <Field
                                      name="productId"
                                      // value={item?.productId}
                                       value={prodIdOptions?.find(option => option.value === values.productId) || null}
                                      placeholder="Enter Prchase Order"
                                      className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage name="customer" component="div" className="text-red-600 text-sm" />
                                  </div> */}

                            <Field
                              as="select"
                              name="productId"
                              //name={`prodIdModal[${index}].productId`}
                              value={order?.orderProducts?.[0]?.products?.id }
                              className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                            
                            >
                            
                              {prodIdOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Field>
<ErrorMessage name="productId" component="div" className="text-red-600 text-sm" />

                                </td>
                                <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                  <div >

                                    <Field
                                      name="orderCategory"
                                      // value={item?.orderCatagory || ""}
                                      value={values.orderCategory}
                                      placeholder="Enter Order Category"
                                      className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      readonly
                                    />
                                    <ErrorMessage name="orderCatagory" component="div" className="text-red-600 text-sm" />
                                  </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                  <div >

                                    <Field
                                      name="orderQuantity"
                                      // value={item?.productId}
                                      value={values.orderQuantity}
                                      placeholder="Enter  Order Qty"
                                      className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      readOnly
                                    />
                                    <ErrorMessage name="clientOrderQty" component="div" className="text-red-600 text-sm" />
                                  </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                  <div >

                                    <Field
                                      name="Units"
                                      // value={item?.units}
                                      value={values.units}
                                      placeholder="Enter Units"
                                      className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      readonly                                    
                                    />
                                    <ErrorMessage name="Units" component="div" className="text-red-600 text-sm" />
                                  </div>
                                </td>

                                <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                  <div >

                                    <Field
                                      name="InStockQty"
                                      // value={item?.productId}
                                      value={values.inStockQuantity}
                                      placeholder="Enter In Stock Qty"
                                      className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      readonly
                                    />
                                    <ErrorMessage name="InStockQty" component="div" className="text-red-600 text-sm" />
                                  </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                  <div >

                                    <Field
                                      name="QtyToManufacture"
                                      // value={item?.productId}
                                      value={values.quantityToManufacture}
                                      placeholder="Enter Qty To Manufacture"
                                      className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      readonly
                                    />
                                    <ErrorMessage name="QtyToManufacture" component="div" className="text-red-600 text-sm" />
                                  </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                  <div >

                                    <Field
                                      name="Value"
                                      // value={item?.productId}
                                      value={values.value}
                                      placeholder="Enter Value"
                                      className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      readonly                                    
                                    />
                                    <ErrorMessage name="Value" component="div" className="text-red-600 text-sm" />
                                  </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200  text-sm">


                                  <div >

                                    <Field
                                      type="date"
                                      name="ClientShippingDate"
                                      value={values.clientShippingDate}
                                      placeholder="Enter Client Shipping Date"
                                      className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      readonly
                                    />
                                    <ErrorMessage name="ClientShippingDate" component="div" className="text-red-600 text-sm" />
                                  </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                  <div >

                                    <Field
                                      type="date"
                                      name="Expected Date"
                                      value={values.expectedDate}
                                      placeholder="Enter Expected Date"
                                      className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      readonly
                                    />
                                    <ErrorMessage name="ExpectedDate" component="div" className="text-red-600 text-sm" />
                                  </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200  text-sm">

                                  <td className="px-5 py-5   text-sm">
                                    <div >
                                      <IoIosAdd size={30} onClick={() => openSupplierModal(id)} />
                                      {/* <IoIosAdd size={30} onClick={() => openSupplierModal(item?.id)} /> */}
                                                                              {/* <IoIosAdd size={30} onClick={() => {
                                                                                setSelectedRowId(index)
                                                                                openSupplierModal(item?.id, index)
                                      
                                                                              }
                                      
                                                                              } /> */}
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
                                           {/* {selectedSuppliers?.map((supplier, supplierIndex) => ( */}
                                                                                        <tr >
                                                                                          <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                                            <Field
                                                                                              name="supplierName"
                                                                                              placeholder="Supplier Name"
                                                                                              // value={supplier.supplierName || ""}
                                                                                              value={values.supplierName}
                                                                                              // onChange={(e) =>
                                                                                              //   setFieldValue(`orderProducts[${index}].productSuppliers[${supplierIndex}].supplier.id`, e.target.value)
                                                                                              // }
                                                                                              className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                                                                            />
                                                                                            {/* <ErrorMessage name={`orderProducts[${index}].productSuppliers[${supplierIndex}].supplier.id`} component="div" className="text-red-600 text-sm" /> */}
                                                                                          </td>
                                          
                                                                                          <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                                                                            <div >
                                          
                                                                                              <Field
                                                                                                name="supplierQuantity"
                                                                                                placeholder="Supplier Quantity"
                                                                                                className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                                                                                value={values.supplierOrderQty}                                                                                              
                                                                                              />
                                                                                              {/* <ErrorMessage name="quantity" component="div" className="text-red-600 text-sm" /> */}
                                                                                            </div>
                                          
                                                                                          </td>
                                                                                          <td className="px-5 py-5  border-b border-gray-200  text-sm">
                                                                                            <p className="flex text-gray-900 whitespace-no-wrap">
                                                                                              {/* <FiEdit size={17} className='text-teal-500 hover:text-teal-700 mx-2' onClick={(e) => handleUpdate(e, item)} title='Edit Unit' />  | */}
                                                                                              <FiTrash2 size={17} className='text-red-500  hover:text-red-700 mx-2' onClick={(e) => handleDelete(e, item?.id)} title='Delete Unit' />
                                                                                            </p>
                                                                                          </td>
                                                                                        </tr>
                                                                                      {/* ))} */}



                                                   


                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </td>


                                
                                {/* <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">{item?.orderType?.orderTypeName}</p>
                                </td> */}
                              </tr>

                            {/* ))} */}


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
                                                                   <ErrorMessage name="orderCategory" component="div" className="text-red-600 text-sm" />
                                                                 </div>
                                                               </td>
                             
                             
                                                               <td className="px-5 py-5 border-b border-gray-200  text-sm">
                             
                             
                                                                 <div >
                             
                                                                   <Field
                                                                     type="number"
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
                                                                     type="number"
                             
                                                                     placeholder="Enter In Stock Qty"
                                                                     className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                                                   />
                                                                   <ErrorMessage name="InStockQty" component="div" className="text-red-600 text-sm" />
                                                                 </div>
                                                               </td>
                             
                             
                                                               
                                                               <td className="px-5 py-5 border-b border-gray-200  text-sm">
                             
                             
                                                                 <div >
                             
                                                                   <Field
                                                                     name={`orderProducts[${index}].quantityToManufacture`}
                                                                     // value={item?.productId}
                                                                     type="number"
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
                                                                     type="number"
                                                                     placeholder="Enter Value"
                                                                     className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                                                   />
                                                                   <ErrorMessage name="Value" component="div" className="text-red-600 text-sm" />
                                                                 </div>
                                                               </td>
                                                               <td className="px-5 py-5 border-b border-gray-200  text-sm">
                             
                             
                                                                 <div >
                             
                             
                                                                   <div
                                                                     className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus-within:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus-within:border-primary"
                                                                     onClick={(e) => e.stopPropagation()} // Prevents event bubbling
                                                                   >
                                                                     {/* <ReactDatePicker
                                                                       selected={values.orderProducts[index]?.clientShippingDate || null}
                                                                       onChange={(date) => setFieldValue(`orderProducts[${index}].clientShippingDate`, date ? date.toISOString().split("T")[0] : "")}
                                                                       dateFormat="yyyy-MM-dd"
                                                                       placeholderText="Enter Client Shipping Date"
                                                                       className="w-full bg-transparent outline-none"
                                                                       wrapperClassName="w-full"
                                                                     /> */}
                                                                   </div>
                             
                                                                   <ErrorMessage name="ClientShippingDate" component="div" className="text-red-600 text-sm" />
                                                                 </div>
                                                               </td>
                                                               <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                                                 <div >
                                                                   <div
                                                                     className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus-within:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus-within:border-primary"
                                                                     onClick={(e) => e.stopPropagation()} // Prevents event bubbling
                                                                   >
                             
                                                                     {/* <ReactDatePicker
                                                                       selected={values.orderProducts[index]?.expectedDate || null}
                                                                       onChange={(date) => setFieldValue(`orderProducts[${index}].expectedDate`, date ? date.toISOString().split("T")[0] : "")}
                                                                       dateFormat="yyyy-MM-dd"
                                                                       placeholderText="Enter Client expected Date"
                                                                       className="w-full bg-transparent outline-none"
                                                                       wrapperClassName="w-full"
                                                                     /> */}
                                                                   </div>
                                                                   <ErrorMessage name="ExpectedDate" component="div" className="text-red-600 text-sm" />
                                                                 </div>
                                                               </td>
                                                               <td className="px-5 py-5 border-b border-gray-200  text-sm">
                             
                                                                 <td className="px-5 py-5   text-sm">
                                                                   <div >
                                                                     <IoIosAdd size={30} onClick={() => {
                                                                       setSelectedRowId(index)
                                                                       openSupplierModal(item?.id, index)
                             
                                                                     }
                             
                                                                     } />
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
                                                                         {selectedSuppliers
                                                                           .find((supplierRow) => supplierRow.selectedRowId === index)
                                                                           ?.supplierIds.map((supplier, supplierIndex) => (
                                                                             <tr
                                                                               key={`supplier-row-${index}-${supplierIndex}`}
                                                                               className="bg-white dark:bg-slate-700 dark:text-white px-5 py-3"
                                                                             >
                                                                               {/* Supplier Name Field */}
                                                                               <td
                                                                                 key={`supplier-${supplierIndex}`}
                                                                                 className="px-5 py-5 border-b border-gray-200 text-sm"
                                                                               >
                                                                                 <Field
                                                                                   name={`orderProducts[${index}].productSuppliers[${supplierIndex}].supplier.id`}
                                                                                   placeholder="Supplier Name"
                                                                                   value={supplier?.supplierId?.supplierName || ""}
                                                                                   onChange={(e) =>
                                                                                     setFieldValue(
                                                                                       `orderProducts[${index}].productSuppliers[${supplierIndex}].supplier.id`,
                                                                                       e.target.value
                                                                                     )
                                                                                   }
                                                                                   className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                                                                 />
                                                                                 <ErrorMessage
                                                                                   name={`orderProducts[${index}].productSuppliers[${supplierIndex}].supplier.id`}
                                                                                   component="div"
                                                                                   className="text-red-600 text-sm"
                                                                                 />
                                                                               </td>
                             
                                                                               {/* Supplier Quantity Field */}
                                                                               <td
                                                                                 key={`quantity-${supplierIndex}`}
                                                                                 className="px-5 py-5 border-b border-gray-200 text-sm"
                                                                               >
                                                                                 <Field
                                                                                   name={`orderProducts[${index}].productSuppliers[${supplierIndex}].supplierOrderQty`}
                                                                                   placeholder="Supplier Quantity"
                                                                                   type="number"
                                                                                   className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                                                                 />
                                                                                 <ErrorMessage
                                                                                   name={`orderProducts[${index}].productSuppliers[${supplierIndex}].supplierOrderQty`}
                                                                                   component="div"
                                                                                   className="text-red-600 text-sm"
                                                                                 />
                                                                               </td>
                             
                                                                               {/* Delete Button */}
                                                                               {/* <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                                 < MdDelete size={20} className='text-red-500 ' onClick={() => handleDeleteSupplier(index, supplierIndex)} />
                             
                                                                               </td> */}
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
                             
                                                               {/* <td className="px-5 py-5 border-b items-center justify-center mt-[100px]">
                             
                                                                 <MdDelete className='text-red-700' size={30} onClick={() => handleDeleteRow(index)} />
                             
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
                        value={values.clientInstruction} // Bind to Formik state
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
                          value = {values.customisationDetails} 
                        />
                        <ErrorMessage name="customisationDetails" component="div" className="text-red-600 text-sm" />
                      </div>


                    )}



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
        {isSupplierModalOpen && (
          <SupplierModal
            suppliers={suppliers}
            id={suppId}
            selectedSuppliers={selectedSuppliers}
            selectedRowId={selectedRowId}
            handleCheckboxChange={handleCheckboxChange}
            closeModal={closeSupplierModal}
            handleSubmit={handleSupplierModalSubmit}
          />
        )}

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

export default UpdateOrder;
