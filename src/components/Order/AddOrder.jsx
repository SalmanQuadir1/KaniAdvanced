import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ReactSelect from 'react-select';
import flatpickr from 'flatpickr';
import ReactDatePicker from "react-datepicker";
import 'flatpickr/dist/themes/material_blue.css'; // Import a Flatpickr theme
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import Modal from './Modal';
import * as Yup from 'yup';
import { MdDelete } from "react-icons/md";
import useorder from '../../hooks/useOrder';
import useProduct from '../../hooks/useProduct';
import { GET_INVENTORYLOCATION, GET_PRODUCTBYID_URL } from '../../Constants/utils';
import { IoIosAdd, IoMdAdd, IoMdTrash } from "react-icons/io";
import Modall from './Modal';
import SupplierModal from './SupplierModal';
import { FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { customStyles as createCustomStyles } from '../../Constants/utils';
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
  const [isLoading, setisLoading] = useState(false)
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

  useEffect(() => {

     getorderType();
    getCustomer();
  
  }, [])
  


  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true)
       // Set loading to true when data starts loading
      await getprodId();
     
      setisLoading(false)
     // Set loading to false once data is loaded
    };

    fetchData();
  }, []);




  console.log(productId, "proddidddddd");
console.log(customer,"customer");

  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);


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










  const openSupplierModal = (id, rowIndex) => {

    setIsSupplierModalOpen(true);

    setsuppId(id); // For specific supplier modal logic
    setSelectedRowId(rowIndex); // Store the row index
  };






  // Close modal
  const closeSupplierModal = () => {
    setIsSupplierModalOpen(false);
  };


  const handleSupplierModalSubmit = () => {

    closeSupplierModal();
  };











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
    console.log(productId, "japaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

    if (productId) {
      const formattedProdIdOptions = productId?.map(prodId => ({
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
  const theme = useSelector(state => state?.persisted?.theme);
  const customStyles = createCustomStyles(theme?.mode);
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



    setFieldValue('productId', option.prodId);

    setprodIdd(option?.prodId)

    setIsModalOpen(true);
    setIsSupplierModalOpen(false)

  };


  const handleModalSubmit = (values) => {


    setprodIdModal((prevValues) => [...prevValues, values])
    setIsModalOpen(false)

  }
  console.log(prodIdModal, "kiool");

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




  // console.log("Initial Values: ", prodIdModal?.map(item => ({
  //   products: { id: item?.productId || "" },
  //   orderCategory: item?.orderCatagory || "",
  //   orderQuantity: item?.orderQuantity || "",
  // })));
  const handleDeleteSupplier = (rowIndex, supplierIndex) => {
    setSelectedSuppliers((prev) => {
      const updated = [...prev];
      const row = updated.find((row) => row.selectedRowId === rowIndex);

      if (row) {
        // Remove the supplier at supplierIndex
        row.supplierIds.splice(supplierIndex, 1);

        // If no suppliers remain for this row, remove the row completely
        if (row.supplierIds.length === 0) {
          return updated.filter((r) => r.selectedRowId !== rowIndex);
        }
      }

      return updated;
    });

    // Optional: Reset the form field values for the deleted supplier
    setFieldValue(`orderProducts[${rowIndex}].productSuppliers`, (prev) =>
      prev.filter((_, idx) => idx !== supplierIndex)
    );
  };
  const handleDeleteRow = (index) => {
    const updatedRows = prodIdModal.filter((_, i) => i !== index);
    console.log(updatedRows, "rowwwwwwwwwwwwws");
    setprodIdModal(updatedRows);
  };
  console.log(prodIdModal, "prodddddddddddddddddddddddddd");
  const [isPopulated, setIsPopulated] = useState(false);

  console.log(selectedSuppliers, "umerumer");

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Order/Create Order" />
      <div>


        <Formik
          initialValues={{
            orderType: '',
            orderDate: '',
            shippingDate: '',
            tagsAndLabels: '',
            logoNo: '',
            productId: '',
            clientInstruction: '',
            customer: '',
            purchaseOrderNo: "",
            customisationDetails: "",

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
              if (prodIdModal.length > 0) {
                console.log("ProdIdModal updated:", prodIdModal);

                const updatedOrderProducts = prodIdModal.map((item) => ({
                  products: { id: item?.id || "" },
                  orderCategory: item.orderCatagory || "",
                  clientOrderQuantity: item.clientOrderQuantity || "",
                  units: item.units || "",
                }));

                setFieldValue("orderProducts", updatedOrderProducts); // Overwrite all rows at once
              }
            }, [prodIdModal, setFieldValue]);


            // Run only on mount


            useEffect(() => {
              // Automatically populate supplier fields for each product
              prodIdModal.forEach((_, productIndex) => {
                const productSuppliers = selectedSuppliers.find(
                  (supplierRow) => supplierRow.selectedRowId === productIndex
                )?.supplierIds;

                if (productSuppliers) {
                  productSuppliers.forEach((supplier, supplierIndex) => {
                    setFieldValue(
                      `orderProducts[${productIndex}].productSuppliers[${supplierIndex}].supplier.id`,
                      supplier?.supplierId?.id || "" // Ensure correct path to supplier ID
                    );
                  });
                }
              });
            }, [prodIdModal, selectedSuppliers, setFieldValue]);


            return (
              <Form>
                <div className="flex flex-col gap-9">
                  {/* Form fields */}
                  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                      <h3
                        className="font-medium text-slate-500 text-center text-xl dark:text-white"
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          letterSpacing: '0.05em',
                          marginBottom: '1rem',
                        }}
                      >
                        ADD ORDER
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



                        <div className="flex-1 min-w-[200px]">

                          <div className="flex-1 min-w-[200px]">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Order Date
                            </label>
                            <Field name="orderDate">
                              {({ field, form }) => (
                                <ReactDatePicker
                                  {...field}
                                  selected={(field.value && new Date(field.value)) || null}
                                  onChange={(date) =>
                                    form.setFieldValue(
                                      "orderDate",
                                      date ? format(date, "yyyy-MM-dd") : "" // Format without timezone shift
                                    )
                                  }
                                  dateFormat="yyyy-MM-dd" // Display format
                                  placeholderText="Select Order Date"
                                  className="form-datepicker w-[430px] rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                />
                              )}
                            </Field>
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
                                    name="purchaseOrderNo"
                                    placeholder="Enter Prchase Order"
                                    className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                  />
                                  <ErrorMessage name="customer" component="div" className="text-red-600 text-sm" />
                                </div>
                                <div className="flex-1 min-w-[200px] mt-7">
                                  <label className="mb-2.5 block text-black dark:text-white">PO Date</label>
                                  <Field name="poDate">
                                    {({ field, form }) => (
                                      <ReactDatePicker
                                        {...field}
                                        selected={(field.value && new Date(field.value)) || null}
                                        onChange={(date) =>
                                          form.setFieldValue(
                                            "poDate",
                                            date ? format(date, "yyyy-MM-dd") : ""  // Format to yyyy-MM-dd
                                          )
                                        }
                                        dateFormat="yyyy-MM-dd" // Display format in the picker
                                        placeholderText="Select Purchase Order Date"
                                        className="form-datepicker w-[430px] rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                      />
                                    )}
                                  </Field>
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
                          <Field name="shippingDate">
                            {({ field, form }) => (
                              <ReactDatePicker
                                {...field}
                                selected={(field.value && new Date(field.value)) || null}
                                onChange={(date) =>
                                  form.setFieldValue(
                                    "shippingDate",
                                    date ? format(date, "yyyy-MM-dd") : ""  // Format to yyyy-MM-dd
                                  )
                                }
                                dateFormat="yyyy-MM-dd" // Display format in the picker
                                placeholderText="Select Order Date"
                                className="form-datepicker w-[430px] rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                              />
                            )}
                          </Field>
                          <ErrorMessage name="shippingDate" component="div" className="text-red-600 text-sm" />
                        </div>

                        <div className="flex-1 min-w-[300px] mt-4">
                          <label className="mb-2.5 block text-black dark:text-white">Tags</label>
                          <ReactSelect
                            name="tagsAndLabels"
                            value={productgrp.find(option => option.value === values.tags)}
                            onChange={(option) => setFieldValue('tagsAndLabels', option.value)}
                            onBlur={handleBlur}
                            options={productgrp}
                            styles={customStyles}
                            className="bg-white dark:bg-form-input"
                            classNamePrefix="react-select"
                            placeholder="Select"
                          />
                          <ErrorMessage name="tagsAndLabels" component="div" className="text-red-600 text-sm" />
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
                          isLoading={isLoading}
                          options={prodIdOptions||"Loading"}
                          styles={customStyles}
                          className="bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          placeholder={isLoading ? 'Loading Products...' : 'Select ProductId'}
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
                                        <ReactDatePicker
                                          selected={values.orderProducts[index]?.clientShippingDate || null}
                                          onChange={(date) => setFieldValue(`orderProducts[${index}].clientShippingDate`, date ? format(date, "yyyy-MM-dd") : "")}
                                          dateFormat="yyyy-MM-dd"
                                          placeholderText="Enter Client Shipping Date"
                                          className="w-full bg-transparent outline-none"
                                          wrapperClassName="w-full"
                                        />
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

                                        <ReactDatePicker
                                          selected={values.orderProducts[index]?.expectedDate || null}
                                          onChange={(date) => setFieldValue(`orderProducts[${index}].expectedDate`, date ? format(date, "yyyy-MM-dd") : "")}
                                          dateFormat="yyyy-MM-dd"
                                          placeholderText="Enter Client expected Date"
                                          className="w-full bg-transparent outline-none"
                                          wrapperClassName="w-full"
                                        />
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
                                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                    < MdDelete size={20} className='text-red-500 ' onClick={() => handleDeleteSupplier(index, supplierIndex)} />

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

                                  <td className="px-5 py-5 border-b items-center justify-center mt-[100px]">

                                    <MdDelete className='text-red-700' size={30} onClick={() => handleDeleteRow(index)} />

                                  </td>

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

                      {(() => {
                        const selectedOrderType = orderTypeOptions.find(
                          (option) => option.value === values.orderType?.id
                        );

                        return (
                          selectedOrderType &&
                          (selectedOrderType.label === "RetailClients" || selectedOrderType.label === "WSClients") && (

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

                          )
                        );
                      })()}





                      <button
                        type="submit"
                        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-4"
                        disabled={isSubmitting}
                      >
                        Add Order
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
            selectedRowId={selectedRowId}
            id={suppId}
            selectedSuppliers={selectedSuppliers}
            handleCheckboxChange={handleCheckboxChange}
            closeModal={closeSupplierModal}
            handleSubmit={handleSupplierModalSubmit}
          />
        )}

        <Modall
          setIsModalOpen={setIsModalOpen}
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
