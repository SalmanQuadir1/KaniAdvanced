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
import { GET_PRODUCTBYID_URL, GET_ORDERBYID_URL, UPDATE_ORDER_URL } from '../../Constants/utils';
import { IoIosAdd, IoMdAdd, IoMdTrash } from "react-icons/io";
import ModalUpdate from './ModalUpdate';
import SupplierModal from './SupplierModal';
import { FiTrash2 } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
const UpdateOrderProduct = () => {
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



  //  const handleUpdateSubmit = async (values) => {

  //                console.log(values,"jazim");
  //        try {
  //            const url = `${UPDATE_ORDER_URL }/${id}`;

  //            const response = await fetch(url, {
  //                method: "PUT",
  //                headers: {
  //                    "Content-Type": "application/json",
  //                    "Authorization": `Bearer ${token}`
  //                },
  //                body: JSON.stringify(values)
  //            });

  //            const data = await response.json();
  //            if (response.ok) {
  //             console.log(data,"coming ");

  //                toast.success(`Order Updated successfully`);
  //                // navigate('/inventory/viewMaterialInventory');

  //            } else {
  //                toast.error(`${data.errorMessage}`);
  //            }
  //        } catch (error) {
  //            console.error(error);
  //            toast.error("An error occurred");
  //        } finally {

  //        }

  //    };

  const handleUpdateSubmit = async (values) => {
    console.log(values, "jazim");

    try {
      const url = `${UPDATE_ORDER_URL}/${id}`;
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
        console.log(data, "coming ");
        toast.success(`Order Updated successfully`);
      } else {
        toast.error(`${data.errorMessage}`);
      }
    } catch (error) {
      console.error(error);
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

  // const productgrp = [
  //   { value: 'KLC', label: 'KLC' },
  //   { value: 'CLIENT', label: 'CLIENT' },
  //   { value: 'NO T&L', label: 'NO T&L' },
  // ];

  const productgrp = [
    { value: 'Embroidery', label: 'Embroidery' },
    { value: 'Dyeing', label: 'Dyeing' },
    { value: 'Plain Order', label: 'Plain Order' },
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
  // const handleProductIdChange = (option, setFieldValue, index) => {
  //   const productId = option.value; // Get the selected product ID
  //   setFieldValue(`productId`, productId); // Update the selected product ID in the form state
  //   setFieldValue(`orderProducts[${index}].products.id`, productId); // Update the product ID in the specific order product field

  //   console.log(`Updated Product ID at index ${index}:`, productId); // Debugging log
  // };



  const handleModalSubmit = (values) => {
    console.log(values, "gfdsa");



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
        // {
        //   products: {
        //     id: values.productId, // Product ID from the form values
        //   },
        {
          // products: {
          //   id: values.products?.productId || '',  // Accessing the productId from the products object
          // },

          products: {
            id: values.products?.id || "", // Dynamically fetch product ID
          },
          // products: {
          //   ...product.products,
          //   productId: product.products?.productId || '',  // Set initial value for productId
          // },

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
          enableReinitialize={true}
          initialValues={{
            orderNo: order?.orderNo || '',
            orderType: order?.orderType || '',
            customer: order?.customer?.customerName || '',
            purchaseOrderNo: order?.purchaseOrderNo || '',
            poDate: order?.poDate || '',
            salesChannel: order?.salesChannel || '',
            employeeName: order?.employeeName || '',
            customisationDetails: order?.customisationDetails || '',
            orderDate: order?.orderDate || '',
            expectingDate: order?.expectingDate || '',
            shippingDate: '',
            // tags: '',
            tagsAndLabels: order?.tagsAndLabels || '',
            logoNo: '',
            //productId: order?.orderProducts?.[0]?.products?.id || null,
            //orderCategory: order?.orderProducts?.[0]?.orderCategory || null,
            //orderCategory:order?.orderCategory || '',
            //orderProducts: order?.orderProducts?.map((product) => ({
            orderProducts: order?.orderProducts?.map((product) => ({
              // products: {
              //   id: product.products?.productId || "",   // Ensure the product ID is set
              // },
              products: {
                ...product.products,
                productId: product.products?.productId || '',  // Set initial value for productId
              },
              //            products: {
              //   ...product.products,
              //   productId: product.products?.id || '', // Use the product's id here
              // },
              orderCategory: product.orderCategory || '',
              inStockQuantity: product.inStockQuantity || '',
              clientOrderQuantity: product.clientOrderQuantity || '',
              quantityToManufacture: product.quantityToManufacture || '',
              units: product.units || '',
              value: product.value || '',
              clientShippingDate: product.clientShippingDate || '',
              expectedDate: product.expectedDate || '',
              // supplierName: product.productSuppliers?.supplier?.name || '', // Safely accessing supplier name
              // supplierOrderQty: product.productSuppliers?.[0]?.supplierOrderQty || 0,
              productSuppliers: product.productSuppliers?.map(supplier => ({
                supplierName: supplier.supplier?.name || '',

                supplierOrderQty: supplier.supplierOrderQty || 0,
              })) || [],

            })) || [],

            //orderCategory: order?.orderProducts?.[0]?.orderCategory || '',
            //inStockQuantity: order?.orderProducts?.[0]?.inStockQuantity || '',
            //value: order?.orderProducts?.[0]?.value || '',
            // value:order?.value || '',
            //clientOrderQuantity: order?.orderProducts?.[0]?.clientOrderQuantity || '',
            //quantityToManufacture: order?.orderProducts?.[0]?.quantityToManufacture || '',
            //units: order?.orderProducts?.[0]?.units || '',
            //clientShippingDate: order?.orderProducts?.[0]?.clientShippingDate || '',
            //expectedDate: order?.orderProducts?.[0]?.expectedDate || '',
            // supplierName: order?.orderProducts?.[0]?.productSuppliers?.[0]?.supplier?.name || '',
            // supplierOrderQty: order?.orderProducts?.[0]?.productSuppliers?.[0]?.supplierOrderQty || 0, // Safely accessing supplierOrderQty
            //orderProducts: order.orderProducts || [],
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
                          name="salesChannel"
                          value={
                            salesChannelOptions.find((option) => option.value === values.salesChannel) || null
                          } // Display the selected value
                          onChange={(option) =>
                            setFieldValue("salesChannel", option ? option.value : "")
                          } // Update Formik value
                          options={salesChannelOptions}
                          styles={customStyles}
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
                          className="w-[200px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          placeholder="Enter Product ID"
                        />
                        <ErrorMessage name="productId" component="div" className="text-red-600 text-sm" />
                      </div>

                      {/* Quantity to Manufacture */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Quantity to Manufacture</label>
                        <Field
                          name="quantityToManufacture"
                          className="w-[200px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          readOnly // Read-only field
                        />
                        <ErrorMessage name="quantityToManufacture" component="div" className="text-red-600 text-sm" />
                      </div>
                    </div>



                    <div className="flex flex-wrap gap-3 mt-5">
                      {/* Order No */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Value</label>
                        <Field
                          // name={`orderProducts[${index}].value`}
                          //value={product.value || ""}
                          className="w-[200px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                        //readOnly
                        />
                        <ErrorMessage name="orderNo" component="div" className="text-red-600 text-sm" />
                      </div>

                      {/* Order Category */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Expected Date</label>
                        <Field
                          type="date"
                          // name={`orderProducts[${index}].expectedDate`}
                          //value={product.expectedDate || ""}
                          className="w-[200px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                        //readOnly
                        />
                        <ErrorMessage name="salesChannel" component="div" className="text-red-600 text-sm" />
                      </div>





                      {/* Product ID */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Execution Status</label>
                        <ReactSelect
                          name="salesChannel"
                          value={
                            salesChannelOptions.find((option) => option.value === values.salesChannel) || null
                          } // Display the selected value
                          onChange={(option) =>
                            setFieldValue("salesChannel", option ? option.value : "")
                          } // Update Formik value
                          options={salesChannelOptions}
                          styles={customStyles}
                          className="bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          placeholder="Select Order Category"
                        />
                        <ErrorMessage name="productId" component="div" className="text-red-600 text-sm" />
                      </div>

                      {/* Quantity to Manufacture */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Comments</label>
                        <Field
                          name="quantityToManufacture"
                          className="w-[200px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          readOnly // Read-only field
                        />
                        <ErrorMessage name="quantityToManufacture" component="div" className="text-red-600 text-sm" />
                      </div>
                    </div>


                    <div className="flex flex-wrap gap-3">
                      {/* Order No */}
                      <div className="flex-1 min-w-[200px]">


                        <IoIosAdd size={30} onClick={() => openSupplierModal(product.id)} />







                        {order?.orderProducts?.map((product, index, item) => (
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
                                  {product.productSuppliers?.map((supplierData, supplierIndex) => (
                                    <tr key={supplierData.supplier?.id}>
                                      {/* Supplier Name */}
                                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        <Field
                                          name={`orderProducts[${index}].productSuppliers[${supplierIndex}].supplier.name`}
                                          value={supplierData.supplier?.name || ""}

                                          className="w-[130px] bg-gray-200 dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                        />
                                      </td>

                                      {/* Supplier Quantity */}
                                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        <Field
                                          name={`orderProducts[${index}].productSuppliers[${supplierIndex}].supplierOrderQty`}
                                          type="number"
                                          className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                        />
                                        <ErrorMessage
                                          name={`orderProducts[${index}].productSuppliers[${supplierIndex}].supplierOrderQty`}
                                          component="div"
                                          className="text-red-600 text-sm"
                                        />
                                      </td>

                                      {/* Actions */}
                                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        <FiTrash2
                                          size={17}
                                          className="text-red-500 hover:text-red-700 mx-2"
                                          onClick={() =>
                                            handleDeleteSupplier(index, supplierIndex)
                                          }
                                          title="Delete Supplier"
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>



                    </div>





               







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

export default UpdateOrderProduct;
