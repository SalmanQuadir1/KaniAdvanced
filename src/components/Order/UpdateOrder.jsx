import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from "react-router-dom";
import ReactSelect from 'react-select';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
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
import { MdDelete } from 'react-icons/md';
import SupplierUpdate from './SupplierUpdate';
import { useFormikContext } from "formik";
import SupplierUpdateProduct from './SupplierUpdateProduct';

const UpdateOrder = () => {
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const [orderType, setOrderType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderTypeOptions, setorderTypeOptions] = useState([])
  const [prodIdOptions, setprodIdOptions] = useState([])
  const [prodIdd, setprodIdd] = useState("")
  const [order, setOrder] = useState(null);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isSupplierModalOpenProduct, setIsSupplierModalOpenProduct] = useState(false);
  const [suppId, setsuppId] = useState()
  const [isLoading, setIsLoading] = useState(true);
  const [customerOptions, setcustomerOptions] = useState([])
  const { token } = currentUser;
  const navigate = useNavigate();

  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedRowIdProduct, setSelectedRowIdProduct] = useState(null);
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
  const [selectedSuppliersProduct, setSelectedSuppliersProduct] = useState([]);

  const [prodIdModal, setprodIdModal] = useState([])

  // Helper function to check if product is new (from prodIdModal)
  const isNewProduct = (index) => {
    return index >= (order?.orderProducts?.length || 0);
  };

  // FIXED: handleCheckboxChange with proper data extraction
  const handleCheckboxChange = (selectedRowId, supplierId, supplierName) => {
    console.log('Adding supplier - RAW DATA:', { selectedRowId, supplierId, supplierName });
    
    // Check if supplierId is an object (from your console log)
    let actualSupplierId;
    let actualSupplierName;
    
    if (supplierId && typeof supplierId === 'object') {
      // If supplierId is an object like {productId: '...', supplierName: 'WAJID ALI GANIE', id: 48}
      actualSupplierId = supplierId.id; // Extract the id (48)
      actualSupplierName = supplierId.supplierName || supplierName || ''; // Extract the name
    } else {
      // If supplierId is already a number/string
      actualSupplierId = supplierId;
      actualSupplierName = supplierName || '';
    }
    
    console.log('Adding supplier - EXTRACTED:', { 
      actualSupplierId, 
      actualSupplierName,
      originalSupplierId: supplierId
    });
    
    setSelectedSuppliers((prev) => {
      const updated = [...prev];
      const rowIndex = updated.findIndex(
        (row) => row.selectedRowId === selectedRowId
      );

      if (rowIndex !== -1) {
        const supplierExists = updated[rowIndex].supplierIds.some(
          (s) => s.supplierId === actualSupplierId
        );

        if (supplierExists) {
          updated[rowIndex].supplierIds = updated[rowIndex].supplierIds.filter(
            (s) => s.supplierId !== actualSupplierId
          );
        } else {
          updated[rowIndex].supplierIds.push({
            supplierId: actualSupplierId, // Should be number like 48
            supplierName: actualSupplierName, // Should be "WAJID ALI GANIE"
            supplierOrderQty: 0,
          });
        }
      } else {
        updated.push({
          selectedRowId,
          supplierIds: [{ 
            supplierId: actualSupplierId, // Should be number like 48
            supplierName: actualSupplierName, // Should be "WAJID ALI GANIE"
            supplierOrderQty: 0
          }],
        });
      }
      return updated;
    });
    
    toast.success(`Supplier ${actualSupplierName} added`);
  };

  // FIXED: handleCheckboxChangeProduct with proper data extraction
  const handleCheckboxChangeProduct = (selectedRowId, supplier) => {
    console.log("Adding supplier to product - RAW:", selectedRowId, supplier);
    
    // Extract supplier ID and name correctly
    const supplierId = supplier.id || (supplier.supplierId && typeof supplier.supplierId === 'object' ? supplier.supplierId.id : supplier.supplierId);
    const supplierName = supplier.supplierName || supplier.name || 
                        (supplier.supplierId && typeof supplier.supplierId === 'object' ? supplier.supplierId.supplierName : '');
    
    console.log("Adding supplier to product - EXTRACTED:", { 
      selectedRowId, 
      supplierId, 
      supplierName 
    });
    
    setSelectedSuppliersProduct((prev) => {
      const updated = [...prev];
      const rowIndex = updated.findIndex(
        (row) => row.selectedRowId === selectedRowId
      );

      if (rowIndex !== -1) {
        const supplierExists = updated[rowIndex].supplierIds.some(
          (s) => s.supplierId === supplierId
        );

        if (!supplierExists) {
          updated[rowIndex].supplierIds.push({
            supplierId: supplierId, // Should be number
            supplierName: supplierName, // Should be string
            supplierOrderQty: 0,
          });
        }
      } else {
        updated.push({
          selectedRowId,
          supplierIds: [{
            supplierId: supplierId, // Should be number
            supplierName: supplierName, // Should be string
            supplierOrderQty: 0,
          }],
        });
      }
      return updated;
    });
    
    toast.success(`Supplier ${supplierName} added`);
  };

  const openSupplierModal = (id, rowIndex) => {
    setIsSupplierModalOpen(true);
    setSelectedRowId(rowIndex);
    setsuppId(id)
  };

  const openSupplierModalProduct = (id, rowIndex) => {
    setIsSupplierModalOpenProduct(true);
    setSelectedRowIdProduct(rowIndex);
    setsuppId(id)
  };

  const closeSupplierModal = () => {
    setIsSupplierModalOpen(false);
  };

  const closeSupplierModalProduct = () => {
    setIsSupplierModalOpenProduct(false);
  };

  const handleSupplierModalSubmit = () => {
    console.log("Selected Suppliers:", selectedSuppliers);
    
    // Check what's actually in the state
    selectedSuppliers.forEach((item, idx) => {
      console.log(`Supplier group ${idx}:`, item);
      item.supplierIds.forEach((supplier, sIdx) => {
        console.log(`  Supplier ${sIdx}:`, {
          supplierId: supplier.supplierId,
          supplierName: supplier.supplierName,
          typeOfId: typeof supplier.supplierId
        });
      });
    });
    
    const suppliersForCurrentProduct = selectedSuppliers.filter(
      item => item.selectedRowId === selectedRowId
    );
    
    // if (suppliersForCurrentProduct.length > 0) {
    //   const suppliersCount = suppliersForCurrentProduct[0].supplierIds.length;
    //   toast.success(`${suppliersCount} supplier(s) added successfully`);
    // }
    
    closeSupplierModal();
  };

  const handleSupplierModalSubmitProduct = () => {
    console.log("Selected Suppliers Product:", selectedSuppliersProduct);
    
    const suppliersForCurrentProduct = selectedSuppliersProduct.filter(
      item => item.selectedRowId === selectedRowIdProduct
    );
    
    // if (suppliersForCurrentProduct.length > 0) {
    //   toast.success(`${suppliersForCurrentProduct[0].supplierIds.length} supplier(s) added successfully`);
    // }
    
    closeSupplierModalProduct();
  };

  // Updates both state and Formik for NEW products (from prodIdModal)
  const handleSupplierQuantityUpdate = (productIndex, supplierIndex, quantity, setFieldValue, values) => {
    const qty = parseInt(quantity) || 0;
    
    setSelectedSuppliersProduct(prev => {
      const updated = [...prev];
      const productSuppliers = updated.find(
        item => item.selectedRowId === productIndex
      );
      
      if (productSuppliers && productSuppliers.supplierIds[supplierIndex]) {
        productSuppliers.supplierIds[supplierIndex].supplierOrderQty = qty;
      }
      
      return updated;
    });
    
    const startingIndex = order?.orderProducts?.length || 0;
    const actualIndex = startingIndex + productIndex;
    
    const productSuppliers = selectedSuppliersProduct.find(
      item => item.selectedRowId === productIndex
    );
    
    if (productSuppliers && productSuppliers.supplierIds[supplierIndex]) {
      const supplier = productSuppliers.supplierIds[supplierIndex];
      
      const currentSuppliers = values.orderProducts[actualIndex]?.productSuppliers || [];
      
      let updatedSuppliers;
      const existingIndex = currentSuppliers.findIndex(
        s => s.supplier?.id === supplier.supplierId
      );
      
      if (existingIndex !== -1) {
        updatedSuppliers = [...currentSuppliers];
        updatedSuppliers[existingIndex] = {
          ...updatedSuppliers[existingIndex],
          supplierOrderQty: qty
        };
      } else {
        updatedSuppliers = [
          ...currentSuppliers,
          {
            supplier: { 
              id: supplier.supplierId
            },
            supplierOrderQty: qty
          }
        ];
      }
      
      setFieldValue(`orderProducts[${actualIndex}].productSuppliers`, updatedSuppliers);
    }
  };

  // Handle quantity updates for EXISTING products
  const handleSupplierQuantityUpdateExisting = (productIndex, supplierIndex, quantity, setFieldValue, values) => {
    const qty = parseInt(quantity) || 0;
    
    setSelectedSuppliers(prev => {
      const updated = [...prev];
      const productSuppliers = updated.find(
        item => item.selectedRowId === productIndex
      );
      
      if (productSuppliers && productSuppliers.supplierIds[supplierIndex]) {
        productSuppliers.supplierIds[supplierIndex].supplierOrderQty = qty;
      }
      
      return updated;
    });
    
    const productSuppliers = selectedSuppliers.find(
      item => item.selectedRowId === productIndex
    );
    
    if (productSuppliers && productSuppliers.supplierIds[supplierIndex]) {
      const supplier = productSuppliers.supplierIds[supplierIndex];
      
      const currentSuppliers = values.orderProducts[productIndex]?.productSuppliers || [];
      
      let updatedSuppliers;
      const existingIndex = currentSuppliers.findIndex(
        s => s.supplier?.id === supplier.supplierId
      );
      
      if (existingIndex !== -1) {
        updatedSuppliers = [...currentSuppliers];
        updatedSuppliers[existingIndex] = {
          ...updatedSuppliers[existingIndex],
          supplierOrderQty: qty
        };
      } else {
        updatedSuppliers = [
          ...currentSuppliers,
          {
            supplier: { 
              id: supplier.supplierId
            },
            supplierOrderQty: qty
          }
        ];
      }
      
      setFieldValue(`orderProducts[${productIndex}].productSuppliers`, updatedSuppliers);
    }
  };

  // Deletes from both state and Formik for NEW products
  const handleDeleteSupplierProduct = (productIndex, supplierIndex, setFieldValue, values) => {
    const productSuppliers = selectedSuppliersProduct.find(
      item => item.selectedRowId === productIndex
    );
    
    if (!productSuppliers || !productSuppliers.supplierIds[supplierIndex]) {
      return;
    }
    
    const supplierId = productSuppliers.supplierIds[supplierIndex].supplierId;
    
    setSelectedSuppliersProduct(prev => {
      const updated = [...prev];
      const productRowIndex = updated.findIndex(
        row => row.selectedRowId === productIndex
      );
      
      if (productRowIndex !== -1) {
        updated[productRowIndex].supplierIds = updated[productRowIndex].supplierIds.filter(
          (_, idx) => idx !== supplierIndex
        );
        
        if (updated[productRowIndex].supplierIds.length === 0) {
          updated.splice(productRowIndex, 1);
        }
      }
      
      return updated;
    });
    
    const startingIndex = order?.orderProducts?.length || 0;
    const actualIndex = startingIndex + productIndex;
    
    const currentSuppliers = values.orderProducts[actualIndex]?.productSuppliers || [];
    const updatedSuppliers = currentSuppliers.filter(
      s => s.supplier?.id !== supplierId
    );
    
    setFieldValue(`orderProducts[${actualIndex}].productSuppliers`, updatedSuppliers);
    
    toast.success('Supplier removed successfully');
  };

  // Delete supplier from existing product
  const handleDeleteSupplierExisting = (productIndex, supplierIndex, setFieldValue, values) => {
    const productSuppliers = selectedSuppliers.find(
      item => item.selectedRowId === productIndex
    );
    
    if (!productSuppliers || !productSuppliers.supplierIds[supplierIndex]) {
      return;
    }
    
    const supplierId = productSuppliers.supplierIds[supplierIndex].supplierId;
    
    setSelectedSuppliers(prev => {
      const updated = [...prev];
      const productRowIndex = updated.findIndex(
        row => row.selectedRowId === productIndex
      );
      
      if (productRowIndex !== -1) {
        updated[productRowIndex].supplierIds = updated[productRowIndex].supplierIds.filter(
          (_, idx) => idx !== supplierIndex
        );
        
        if (updated[productRowIndex].supplierIds.length === 0) {
          updated.splice(productRowIndex, 1);
        }
      }
      
      return updated;
    });
    
    const currentSuppliers = values.orderProducts[productIndex]?.productSuppliers || [];
    const updatedSuppliers = currentSuppliers.filter(
      s => s.supplier?.id !== supplierId
    );
    
    setFieldValue(`orderProducts[${productIndex}].productSuppliers`, updatedSuppliers);
    
    toast.success('Supplier removed successfully');
  };

  useEffect(() => {
    getorderType();
    getprodId();
    getCustomer();
  }, [])

  const { id } = useParams();

  const handleUpdateSubmit = async (values) => {
    console.log("=== DEBUG: Checking Formik values BEFORE submission ===");
    values.orderProducts.forEach((product, index) => {
      console.log(`Product ${index} (isNew: ${isNewProduct(index)}):`, {
        productId: product.products?.productId,
        suppliersCount: product.productSuppliers?.length || 0,
        suppliers: product.productSuppliers?.map((s, i) => ({
          index: i,
          supplierId: s.supplier?.id,
          supplierData: s.supplier,
          quantity: s.supplierOrderQty
        })) || []
      });
    });

    const formattedData = {
      orderNo: values.orderNo,
      orderType: values.orderType ? { id: values.orderType.id } : null,
      customer: values.customer ? { id: values.customer.id } : null,
      purchaseOrderNo: values.purchaseOrderNo,
      poDate: values.poDate,
      salesChannel: values.salesChannel,
      employeeName: values.employeeName,
      customisationDetails: values.customisationDetails,
      orderDate: values.orderDate,
      expectingDate: values.expectingDate,
      shippingDate: values.shippingDate,
      tagsAndLabels: values.tagsAndLabels,
      logoNo: values.logoNo,
      clientInstruction: values.clientInstruction,
      
      orderProducts: values.orderProducts.map((product, index) => {
        const isNew = isNewProduct(index);
        
        const allSuppliers = product.productSuppliers?.map(supplier => {
          let supplierId;
          
          const extractSupplierId = (obj) => {
            if (!obj) return null;
            
            if (typeof obj === 'number' || typeof obj === 'string') {
              return obj;
            }
            
            if (obj && typeof obj === 'object') {
              if (obj.id !== undefined && obj.id !== null) {
                if (typeof obj.id === 'object') {
                  return extractSupplierId(obj.id);
                }
                return obj.id;
              }
              
              if (obj.supplier !== undefined && obj.supplier !== null) {
                return extractSupplierId(obj.supplier);
              }
              
              const idKeys = Object.keys(obj).filter(key => 
                key.toLowerCase().includes('id')
              );
              
              for (const key of idKeys) {
                const result = extractSupplierId(obj[key]);
                if (result) return result;
              }
            }
            
            return null;
          };
          
          supplierId = extractSupplierId(supplier.supplier || supplier);
          
          return {
            ...(supplier.id && { id: supplier.id }),
            supplier: {
              id: supplierId
            },
            supplierOrderQty: Number(supplier.supplierOrderQty) || 0
          };
        }) || [];
        
        const validSuppliers = allSuppliers.filter(supplier => {
          const id = supplier.supplier?.id;
          return id !== null && id !== undefined && id !== '' && !isNaN(Number(id));
        });
        
        const uniqueSuppliers = [];
        const seenSupplierIds = new Set();
        
        validSuppliers.forEach(supplier => {
          const supplierId = supplier.supplier.id;
          if (!seenSupplierIds.has(supplierId)) {
            seenSupplierIds.add(supplierId);
            uniqueSuppliers.push(supplier);
          }
        });
        
        return {
          ...(!isNew && product.id && { id: product.id }),
          products: {
            id: product.products?.id || product.products?.productId || product.id || ''
          },
          orderCategory: product.orderCategory || '',
          inStockQuantity: Number(product.inStockQuantity) || 0,
          clientOrderQuantity: Number(product.clientOrderQuantity) || 0,
          quantityToManufacture: Number(product.quantityToManufacture) || 0,
          units: product.units || 'Pcs',
          value: Number(product.value) || 0,
          clientShippingDate: product.clientShippingDate || null,
          expectedDate: product.expectedDate || null,
          productSuppliers: uniqueSuppliers
        };
      })
    };

    try {
      const url = `${UPDATE_ORDER_URL}/${id}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        let errorMessage = "Failed to update order";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.errorMessage || errorMessage;
        } catch (e) {
          console.error("Could not parse error response:", e);
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      const totalSuppliers = formattedData.orderProducts.reduce((acc, product) => acc + product.productSuppliers.length, 0);
      toast.success(`Order Updated Successfully `);
      
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message || "An error occurred while updating the order");
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
      setOrder(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOrderById();
  }, [id]);

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

  useEffect(() => {
    if (customer && Array.isArray(customer)) {
      const formatted = customer.map(c => ({
        value: c.id,
        label: c.customerName,
        data: c
      }));
      setcustomerOptions(formatted);
    }
  }, [customer]);

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
    clientInstruction: Yup.string().required('Client Instruction is required'),
    customer: orderType ? Yup.string().required('Customer is required') : Yup.string(),
  });

  const handleProductIdChange = (option, setFieldValue) => {
    setFieldValue('productId', option.prodId);
    setprodIdd(option.prodId)
    setIsModalOpen(true);
    setIsSupplierModalOpen(false)
  };

  const handleModalSubmit = (values) => {
    setprodIdModal((prevValues) => [...prevValues, values])
    setIsModalOpen(false)
  }

  const handleSubmit = (values, { setSubmitting }) => {
    console.log(values, "kiki");
  };

  const handleDeleteSupplier = (rowIndex, supplierIndex, setFieldValue, values) => {
    handleDeleteSupplierExisting(rowIndex, supplierIndex, setFieldValue, values);
  };

  const handleDeleteSupplierr = (rowIndex, supplierIndex, setFieldValue, values) => {
    const updatedProductSuppliers = values.orderProducts[rowIndex].productSuppliers?.filter(
      (_, idx) => idx !== supplierIndex
    ) || [];

    setFieldValue(`orderProducts[${rowIndex}].productSuppliers`, updatedProductSuppliers);
    
    toast.success('Supplier removed successfully');
  };

  const handleDeleteRow = (index) => {
    const updatedRows = prodIdModal.filter((_, i) => i !== index);
    setprodIdModal(updatedRows);
    
    setSelectedSuppliersProduct(prev => 
      prev.filter(item => item.selectedRowId !== index)
    );
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
            customer: order?.customer || null,
            purchaseOrderNo: order?.purchaseOrderNo || '',
            poDate: order?.poDate || '',
            salesChannel: order?.salesChannel || '',
            employeeName: order?.employeeName || '',
            customisationDetails: order?.customisationDetails || '',
            orderDate: order?.orderDate || '',
            expectingDate: order?.expectingDate || '',
            shippingDate: order?.shippingDate || '',
            tagsAndLabels: order?.tagsAndLabels || '',
            logoNo: order?.logoNo || '',
            clientInstruction: order?.clientInstruction || '',
            orderProducts: [
              ...(order?.orderProducts?.map(product => ({
                id: product.id,
                products: {
                  id: product.products.id,
                  productId: product.products.productId,
                },
                orderCategory: product.orderCategory || '',
                inStockQuantity: product.inStockQuantity || '',
                clientOrderQuantity: product.clientOrderQuantity || '',
                quantityToManufacture: product.quantityToManufacture || '',
                units: product.units || '',
                value: product.value || '',
                clientShippingDate: product.clientShippingDate || '',
                expectedDate: product.expectedDate || '',
                productSuppliers: product.productSuppliers?.map(supplier => ({
                  ...(supplier.id && { id: supplier.id }),
                  supplier: { id: supplier?.supplier?.id || '' },
                  supplierOrderQty: supplier.supplierOrderQty || 0
                })) || []
              })) || []),
              
              ...(prodIdModal?.map(item => ({
                products: {
                  id: item.id || item.productId || '',
                  productId: item.productId || item.id || '',
                },
                orderCategory: item.orderCatagory || '',
                inStockQuantity: 0,
                clientOrderQuantity: 0,
                quantityToManufacture: 0,
                units: item.units || 'Pcs',
                value: 0,
                clientShippingDate: '',
                expectedDate: '',
                productSuppliers: []
              })) || [])
            ]
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, handleBlur, isSubmitting }) => (
            <Form>
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
                        <label className="mb-2.5 block text-black dark:text-white">Order No</label>
                        <ReactSelect
                          name="orderNo"
                          value={order?.orderNo ? { label: order.orderNo, value: order.orderNo } : null}
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
                    </div>

                    {(values.orderType?.orderTypeName === "RetailClients" || values.orderType?.orderTypeName === "WSClients") && (
                      <div>
                        <div className="flex-1 min-w-[300px] mt-4">
                          <label className="mb-2.5 block text-black dark:text-white">Customer</label>
                          <ReactSelect
                            name="customer"
                            styles={customStyles}
                            className="bg-white dark:bg-form-Field"
                            value={
                              values.customer
                                ? {
                                  label: values.customer.customerName,
                                  value: values.customer.id,
                                  data: values.customer
                                }
                                : null
                            }
                            onChange={(option) => setFieldValue("customer", option ? option.data : null)}
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
                              placeholder="Enter Purchase Order"
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
                              value={salesChannelOptions.find(option => option.value === values.salesChannel) || null}
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
                          <label className="mb-2.5 block text-black dark:text-white">Order Date</label>
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
                          value={productgrp.find(option => option.value === values.tagsAndLabels) || null}
                          onChange={(option) => setFieldValue('tagsAndLabels', option.value)}
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

                    <div className="flex-1 min-w-[200px] mt-11">
                      <label className="mb-2.5 block text-black dark:text-white">Product Id</label>
                      <ReactSelect
                        name="productId"
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

                    <div className="shadow-md rounded-lg mt-3 overflow-scroll">
                      <table className="min-w-full leading-normal overflow-auto">
                        <thead>
                          <tr className='bg-slate-300 dark:bg-slate-700 dark:text-white'>
                            <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Product Id
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Order Category
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Client Order Qty
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Units
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              In Stock Qty
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Qty To Manufacture
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Value
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Client Shipping Date
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Expected Date
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Supplier Details
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Action
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {order?.orderProducts?.map((product, index) => (
                            <tr key={product.id}>
                              <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                <Field
                                  name={`orderProducts[${index}].products.productId`}
                                  value={values.orderProducts?.[index]?.products?.productId || ""}
                                  className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                  placeholder="Enter Product ID"
                                  readOnly
                                />
                              </td>

                              <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                <Field
                                  name={`orderProducts[${index}].orderCategory`}
                                  value={values.orderProducts[index]?.orderCategory || ''}
                                  className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                  readOnly
                                />
                              </td>

                              <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                <Field
                                  name={`orderProducts[${index}].clientOrderQuantity`}
                                  className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                  onChange={(e) => {
                                    const value = Number(e.target.value);
                                    setFieldValue(`orderProducts[${index}].clientOrderQuantity`, value);
                                    setFieldValue(`orderProducts[${index}].quantityToManufacture`, value);
                                  }}
                                />
                              </td>

                              <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                <Field
                                  name={`orderProducts[${index}].units`}
                                  className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                />
                              </td>

                              <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                <Field
                                  name={`orderProducts[${index}].inStockQuantity`}
                                  className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                  onChange={(e) => {
                                    const value = Number(e.target.value) || 0;
                                    const initialQuantityToManufacture = values.orderProducts[index]?.clientOrderQuantity || 0;
                                    const newQuantityToManufacture = Math.max(0, initialQuantityToManufacture - value);

                                    setFieldValue(`orderProducts[${index}].inStockQuantity`, value);
                                    setFieldValue(`orderProducts[${index}].quantityToManufacture`, newQuantityToManufacture);
                                  }}
                                />
                              </td>

                              <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                <Field
                                  name={`orderProducts[${index}].quantityToManufacture`}
                                  className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                />
                              </td>

                              <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                <Field
                                  name={`orderProducts[${index}].value`}
                                  className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                />
                              </td>

                              <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                <Field
                                  type="date"
                                  name={`orderProducts[${index}].clientShippingDate`}
                                  className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                />
                              </td>

                              <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                <Field
                                  type="date"
                                  name={`orderProducts[${index}].expectedDate`}
                                  className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                />
                              </td>

                              <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                <IoIosAdd size={30} onClick={() => openSupplierModal(product?.products?.id, index)} />
                              </td>

                              <td className="px-5 py-5 border-b border-gray-200 text-sm">
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
                                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Action
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {product.productSuppliers?.map((supplierData, supplierIndex) => (
                                          <tr key={supplierData.supplier?.id}>
                                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                              <Field
                                                name={`orderProducts[${index}].productSuppliers[${supplierIndex}].supplier.name`}
                                                value={supplierData.supplier?.name || ""}
                                                className="w-[130px] bg-gray-200 dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                              />
                                            </td>

                                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                              <Field
                                                name={`orderProducts[${index}].productSuppliers[${supplierIndex}].supplierOrderQty`}
                                                placeholder="Supplier Quantity"
                                                type="number"
                                                className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                              />
                                            </td>

                                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                              <MdDelete
                                                size={20}
                                                className="text-red-500"
                                                onClick={() => handleDeleteSupplierr(index, supplierIndex, setFieldValue, values)}
                                              />
                                            </td>
                                          </tr>
                                        ))}

                                        {selectedSuppliers
                                          .find((supplierRow) => supplierRow.selectedRowId === index)
                                          ?.supplierIds.map((supplier, supplierIndex) => {
                                            const startingIndex = product.productSuppliers?.length || 0;
                                            const adjustedIndex = startingIndex + supplierIndex;

                                            return (
                                              <tr
                                                key={`supplier-row-${index}-${adjustedIndex}`}
                                                className="bg-white dark:bg-slate-700 dark:text-white px-5 py-3"
                                              >
                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                  <input
                                                    type="text"
                                                    value={supplier.supplierName || ""}
                                                    readOnly
                                                    className="w-[130px] bg-gray-100 dark:bg-gray-700 rounded border py-2 px-3"
                                                  />
                                                </td>

                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                  <input
                                                    type="number"
                                                    value={supplier.supplierOrderQty || 0}
                                                    onChange={(e) => {
                                                      const newQuantity = Number(e.target.value) || 0;
                                                      handleSupplierQuantityUpdateExisting(
                                                        index, 
                                                        supplierIndex, 
                                                        newQuantity,
                                                        setFieldValue,
                                                        values
                                                      );
                                                    }}
                                                    className="w-[130px] bg-white dark:bg-form-input rounded border py-2 px-3"
                                                    placeholder="Enter quantity"
                                                    min="0"
                                                  />
                                                </td>

                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                  <MdDelete
                                                    size={20}
                                                    className="text-red-500"
                                                    onClick={() => handleDeleteSupplier(index, supplierIndex, setFieldValue, values)}
                                                  />
                                                </td>
                                              </tr>
                                            );
                                          })}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}

                          {prodIdModal?.map((item, index) => {
                            const startingIndex = order?.orderProducts?.length || 0;
                            const adjustedIndex = startingIndex + index;

                            const productSuppliers = selectedSuppliersProduct.find(
                              supplierRow => supplierRow.selectedRowId === index
                            );

                            return (
                              <tr key={adjustedIndex} className="bg-white dark:bg-slate-700 dark:text-white px-5 py-3">
                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <div>
                                    <Field
                                      type="text"
                                      name={`orderProducts[${adjustedIndex}].products.id`}
                                      value={item?.productId || ""}
                                      readOnly
                                      className="w-[130px] bg-gray-200 dark:bg-gray-700 rounded border-[1.5px] border-stroke py-3 px-5 text-black dark:text-white outline-none transition focus:border-primary active:border-primary disabled:cursor-default"
                                    />
                                  </div>
                                </td>

                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <div>
                                    <Field
                                      name={`orderProducts[${adjustedIndex}].orderCategory`}
                                      value={item?.orderCatagory || ""}
                                      placeholder="Enter Order Category"
                                      onChange={(e) => {
                                        setFieldValue(`orderProducts[${adjustedIndex}].orderCategory`, e.target.value);
                                      }}
                                      readOnly
                                      className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                    />
                                  </div>
                                </td>

                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <div>
                                    <Field
                                      type="number"
                                      name={`orderProducts[${adjustedIndex}].clientOrderQuantity`}
                                      placeholder="Enter Client Order Qty"
                                      onChange={(e) => {
                                        const value = Number(e.target.value);
                                        setFieldValue(`orderProducts[${adjustedIndex}].clientOrderQuantity`, value);
                                        setFieldValue(`orderProducts[${adjustedIndex}].quantityToManufacture`, value);
                                      }}
                                      className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                    />
                                  </div>
                                </td>

                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <div>
                                    <Field
                                      name={`orderProducts[${adjustedIndex}].units`}
                                      placeholder="Enter Units"
                                      className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                    />
                                  </div>
                                </td>

                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <div>
                                    <Field
                                      type="number"
                                      name={`orderProducts[${adjustedIndex}].inStockQuantity`}
                                      placeholder="Enter In Stock Qty"
                                      onChange={(e) => {
                                        const inStockValue = Number(e.target.value);
                                        const clientOrderValue = Number(values.orderProducts[adjustedIndex]?.clientOrderQuantity || 0);
                                        const newQuantityToManufacture = Math.max(clientOrderValue - inStockValue, 0);

                                        setFieldValue(`orderProducts[${adjustedIndex}].inStockQuantity`, inStockValue);
                                        setFieldValue(`orderProducts[${adjustedIndex}].quantityToManufacture`, newQuantityToManufacture);
                                      }}
                                      className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                    />
                                  </div>
                                </td>

                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <div>
                                    <Field
                                      type="number"
                                      name={`orderProducts[${adjustedIndex}].quantityToManufacture`}
                                      placeholder="Enter Qty To Manufacture"
                                      readOnly
                                      className="w-[130px] bg-gray-200 dark:bg-gray-700 rounded border-[1.5px] border-stroke py-3 px-5 text-black dark:text-white outline-none transition focus:border-primary active:border-primary disabled:cursor-default"
                                    />
                                  </div>
                                </td>

                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <div>
                                    <Field
                                      name={`orderProducts[${adjustedIndex}].value`}
                                      type="number"
                                      placeholder="Enter Value"
                                      className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                    />
                                  </div>
                                </td>

                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <div>
                                    <div
                                      className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus-within:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus-within:border-primary"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <ReactDatePicker
                                        selected={values.orderProducts[adjustedIndex]?.clientShippingDate || null}
                                        onChange={(date) => setFieldValue(`orderProducts[${adjustedIndex}].clientShippingDate`, date ? date.toISOString().split("T")[0] : "")}
                                        dateFormat="yyyy-MM-dd"
                                        placeholderText="Enter Client Shipping Date"
                                        className="w-full bg-transparent outline-none"
                                        wrapperClassName="w-full"
                                      />
                                    </div>
                                  </div>
                                </td>

                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <div>
                                    <div
                                      className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus-within:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus-within:border-primary"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <ReactDatePicker
                                        selected={values.orderProducts[adjustedIndex]?.expectedDate || null}
                                        onChange={(date) => setFieldValue(`orderProducts[${adjustedIndex}].expectedDate`, date ? date.toISOString().split("T")[0] : "")}
                                        dateFormat="yyyy-MM-dd"
                                        placeholderText="Enter Client expected Date"
                                        className="w-full bg-transparent outline-none"
                                        wrapperClassName="w-full"
                                      />
                                    </div>
                                  </div>
                                </td>

                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <div>
                                    <IoIosAdd 
                                      size={30} 
                                      className="cursor-pointer hover:text-blue-600"
                                      onClick={() => {
                                        setSelectedRowIdProduct(index);
                                        openSupplierModalProduct(item?.id, index);
                                      }} 
                                    />
                                  </div>
                                </td>

                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
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
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                              Action
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {productSuppliers?.supplierIds?.map((supplier, supplierIndex) => (
                                            <tr
                                              key={`supplier-row-${index}-${supplierIndex}`}
                                              className="bg-white dark:bg-slate-700 dark:text-white px-5 py-3"
                                            >
                                              <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                <input
                                                  type="text"
                                                  value={supplier.supplierName || ""}
                                                  readOnly
                                                  className="w-[130px] bg-gray-100 dark:bg-gray-700 rounded border py-2 px-3"
                                                />
                                              </td>

                                              <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                <input
                                                  type="number"
                                                  value={supplier.supplierOrderQty || 0}
                                                  onChange={(e) => {
                                                    const newQuantity = Number(e.target.value) || 0;
                                                    handleSupplierQuantityUpdate(
                                                      index, 
                                                      supplierIndex, 
                                                      newQuantity, 
                                                      setFieldValue, 
                                                      values
                                                    );
                                                  }}
                                                  className="w-[130px] bg-white dark:bg-form-input rounded border py-2 px-3"
                                                  placeholder="Enter quantity"
                                                  min="0"
                                                />
                                              </td>

                                              <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                <MdDelete
                                                  size={20}
                                                  className="text-red-500 cursor-pointer hover:text-red-700"
                                                  onClick={() => handleDeleteSupplierProduct(index, supplierIndex, setFieldValue, values)}
                                                />
                                              </td>
                                            </tr>
                                          ))}
                                          
                                          {(!productSuppliers || productSuppliers.supplierIds.length === 0) && (
                                            <tr>
                                              <td colSpan="3" className="px-5 py-5 text-center text-gray-500">
                                                No suppliers added. Click the + button to add suppliers.
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </td>
                                
                                <td className="px-5 py-5 border-b items-center justify-center">
                                  <MdDelete 
                                    className='text-red-700 cursor-pointer hover:text-red-900' 
                                    size={30} 
                                    onClick={() => handleDeleteRow(index)} 
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex-1 min-w-[200px] mt-11">
                      <label className="mb-2.5 block text-black dark:text-white">Client Instruction</label>
                      <Field
                        as="textarea"
                        name="clientInstruction"
                        placeholder="Enter client instruction"
                        value={values.clientInstruction}
                        className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                      />
                    </div>

                    {(values.orderType?.orderTypeName === "RetailClients" || values.orderType?.orderTypeName === "WSClients") && (
                      <div className="flex-1 min-w-[200px] mt-11">
                        <label className="mb-2.5 block text-black dark:text-white">Customisation Details</label>
                        <Field
                          as="textarea"
                          name="customisationDetails"
                          placeholder="Enter client instruction"
                          className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                          value={values.customisationDetails}
                        />
                      </div>
                    )}

                    <div className="flex justify-center mt-4">
                      <button
                        type="button"
                        onClick={() => handleUpdateSubmit(values)}
                        className="w-1/3 px-6 py-2 text-white bg-primary rounded-lg shadow hover:bg-primary-dark focus:outline-none"
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
          <SupplierUpdate
            suppliers={suppliers}
            id={suppId}
            selectedSuppliers={selectedSuppliers}
            selectedSuppliersProduct={selectedSuppliersProduct}
            selectedRowId={selectedRowId}
            handleCheckboxChange={handleCheckboxChange}
            closeModal={closeSupplierModal}
            order={order}
            handleSubmit={handleSupplierModalSubmit}
          />
        )}

        {isSupplierModalOpenProduct && (
          <SupplierUpdateProduct
            suppliers={suppliers}
            id={suppId}
            selectedSuppliersProduct={selectedSuppliersProduct}
            selectedRowId={selectedRowIdProduct}
            handleCheckboxChangeProduct={handleCheckboxChangeProduct}
            closeModalProduct={closeSupplierModalProduct}
            order={order}
            handleSubmit={handleSupplierModalSubmitProduct}
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
          style={{ marginLeft: '70px', marginRight: '0' }}
        />
      </div>
    </DefaultLayout>
  );
};

export default UpdateOrder;