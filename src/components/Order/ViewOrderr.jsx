import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { Formik, Form, Field } from 'formik';
import { useNavigate } from "react-router-dom";
import ReactSelect from 'react-select';
import 'flatpickr/dist/themes/material_blue.css';
import { useSelector } from 'react-redux';
import { GET_ORDERBYID_URL } from '../../Constants/utils';
import useorder from '../../hooks/useOrder';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const ViewOrderr = () => {
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderTypeOptions, setOrderTypeOptions] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [SelectedLocation, setSelectedLocation] = useState([]);

  const { getLocation, Location, getorderType, orderTypee, getCustomer, customer } = useorder();

  // Custom styles for React Select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '50px',
      fontSize: '16px',
      backgroundColor: '#f3f4f6',
      borderColor: '#d1d5db',
      cursor: 'default',
      '&:hover': {
        borderColor: '#d1d5db',
      },
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
    option: (provided, state) => ({
      ...provided,
      cursor: 'default',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      display: 'none', // Hide dropdown indicator
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none', // Hide separator
    }),
    menu: (provided) => ({
      ...provided,
      display: 'none', // Hide menu - no dropdown
    }),
  };

  // Fetch locations
  useEffect(() => {
    getLocation();
    getorderType();
    getCustomer();
  }, []);

  // Format location options
  useEffect(() => {
    if (Location && Location.length > 0) {
      const formattedOptions = Location.map(location => ({
        value: location?.id,
        label: location.address,
        LocationObject: location,
        LocationId: { id: location.id },
      }));
      setSelectedLocation(formattedOptions);
    }
  }, [Location]);

  // Format order type options
  useEffect(() => {
    if (orderTypee && orderTypee.length > 0) {
      const formattedOptions = orderTypee.map(order => ({
        value: order.id,
        label: order?.orderTypeName,
        orderTypeObject: order,
        orderTypeId: { id: order.id }
      }));
      setOrderTypeOptions(formattedOptions);
    }
  }, [orderTypee]);

  // Format customer options
  useEffect(() => {
    if (customer && Array.isArray(customer) && customer.length > 0) {
      const formatted = customer.map(c => ({
        value: c.id,
        label: c.customerName,
        data: c
      }));
      setCustomerOptions(formatted);
    }
  }, [customer]);

  // Sales channel options (read-only display)
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

  // Tag options (read-only display)
  const productgrp = [
    { value: 'KLC', label: 'KLC' },
    { value: 'CLIENT', label: 'CLIENT' },
    { value: 'NO T&L', label: 'NO T&L' },
  ];

  // Fetch order by ID
  const getOrderById = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${GET_ORDERBYID_URL}/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getOrderById();
    }
  }, [id]);

  // Helper function to get supplier name
  const getSupplierName = (supplierId, productSuppliers) => {
    if (!productSuppliers || !productSuppliers.length) return 'N/A';
    const found = productSuppliers.find(s => s.supplier?.id === supplierId);
    return found?.supplier?.name || 'N/A';
  };

  // Read-only select component
  const ReadOnlySelect = ({ value, options, placeholder }) => {
    const selectedOption = options?.find(opt => opt.value === value) || options?.find(opt => opt.value === value?.id);
    return (
      <div className="w-full rounded border-[1.5px] border-stroke bg-gray-100 dark:bg-gray-700 py-3 px-5 text-black dark:text-white cursor-default">
        {selectedOption?.label || placeholder || 'Not Selected'}
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Order/View Order" />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading order details...</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Order/View Order" />
      <div>
        <Formik
          enableReinitialize={true}
          initialValues={{
            orderNo: order?.orderNo || '',
            orderType: order?.orderType || '',
            locationId: order?.location?.id || '',
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
            orderProducts: order?.orderProducts?.map(product => ({
              products: {
                id: product.products?.id || '',
                productId: product.products?.productId || '',
              },
              sourceProductId: product.sourceProductId || null,
              sourceProductName: product.sourceProductName || '',
              orderCategory: product.orderCategory || '',
              inStockQuantity: product.inStockQuantity || 0,
              clientOrderQuantity: String(product.clientOrderQuantity || ''),
              quantityToManufacture: product.quantityToManufacture || 0,
              units: product.units || 'Pcs',
              value: product.value || 0,
              clientShippingDate: product.clientShippingDate || '',
              expectedDate: product.expectedDate || '',
              productSuppliers: product.productSuppliers?.map(supplier => ({
                supplier: {
                  id: supplier?.supplier?.id || '',
                  name: supplier?.supplier?.name || ''
                },
                supplierOrderQty: supplier.supplierOrderQty || 0
              })) || []
            })) || []
          }}
          onSubmit={() => {}}
        >
          {({ values }) => (
            <Form>
              <div className="flex flex-col gap-9">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                      Order Details
                    </h3>
                  </div>
                  <div className="p-6.5">
                    {/* Order Information */}
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white font-medium">Order Number</label>
                        <div className="w-full rounded border-[1.5px] border-stroke bg-gray-100 dark:bg-gray-700 py-3 px-5 text-black dark:text-white">
                          {values.orderNo || 'N/A'}
                        </div>
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white font-medium">Order Type</label>
                        <ReadOnlySelect 
                          value={values.orderType?.id} 
                          options={orderTypeOptions} 
                          placeholder="Not Selected"
                        />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white font-medium">Order Date</label>
                        <div className="w-full rounded border-[1.5px] border-stroke bg-gray-100 dark:bg-gray-700 py-3 px-5 text-black dark:text-white">
                          {values.orderDate ? new Date(values.orderDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white font-medium">Location</label>
                        <ReadOnlySelect 
                          value={values.locationId} 
                          options={SelectedLocation} 
                          placeholder="Not Selected"
                        />
                      </div>
                    </div>

                    {/* Customer Section */}
                    {(values.orderType?.orderTypeName === "RetailClients" || values.orderType?.orderTypeName === "WSClients") && (
                      <div className="mt-4">
                        <div className="flex-1 min-w-[300px]">
                          <label className="mb-2.5 block text-black dark:text-white font-medium">Customer</label>
                          <ReadOnlySelect 
                            value={values.customer?.id} 
                            options={customerOptions} 
                            placeholder="Not Selected"
                          />
                        </div>
                        <div className="flex flex-wrap gap-4 mt-4">
                          <div className="flex-1 min-w-[200px]">
                            <label className="mb-2.5 block text-black dark:text-white font-medium">Customer Purchase Order No</label>
                            <div className="w-full rounded border-[1.5px] border-stroke bg-gray-100 dark:bg-gray-700 py-3 px-5 text-black dark:text-white">
                              {values.purchaseOrderNo || 'N/A'}
                            </div>
                          </div>
                          <div className="flex-1 min-w-[200px]">
                            <label className="mb-2.5 block text-black dark:text-white font-medium">PO Date</label>
                            <div className="w-full rounded border-[1.5px] border-stroke bg-gray-100 dark:bg-gray-700 py-3 px-5 text-black dark:text-white">
                              {values.poDate ? new Date(values.poDate).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-4">
                          <div className="flex-1 min-w-[300px]">
                            <label className="mb-2.5 block text-black dark:text-white font-medium">Sales Channel</label>
                            <ReadOnlySelect 
                              value={values.salesChannel} 
                              options={salesChannelOptions} 
                              placeholder="Not Selected"
                            />
                          </div>
                          <div className="flex-1 min-w-[200px]">
                            <label className="mb-2.5 block text-black dark:text-white font-medium">Employee Name</label>
                            <div className="w-full rounded border-[1.5px] border-stroke bg-gray-100 dark:bg-gray-700 py-3 px-5 text-black dark:text-white">
                              {values.employeeName || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Shipping & Tags */}
                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white font-medium">Shipping Date</label>
                        <div className="w-full rounded border-[1.5px] border-stroke bg-gray-100 dark:bg-gray-700 py-3 px-5 text-black dark:text-white">
                          {values.shippingDate ? new Date(values.shippingDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white font-medium">Tags & Labels</label>
                        <ReadOnlySelect 
                          value={values.tagsAndLabels} 
                          options={productgrp} 
                          placeholder="Not Selected"
                        />
                      </div>
                    </div>

                    {/* Logo No */}
                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white font-medium">Logo No</label>
                        <div className="w-full rounded border-[1.5px] border-stroke bg-gray-100 dark:bg-gray-700 py-3 px-5 text-black dark:text-white">
                          {values.logoNo || 'N/A'}
                        </div>
                      </div>
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white font-medium">Expected Date</label>
                        <div className="w-full rounded border-[1.5px] border-stroke bg-gray-100 dark:bg-gray-700 py-3 px-5 text-black dark:text-white">
                          {values.expectingDate ? new Date(values.expectingDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Products Table */}
                    <div className="shadow-md rounded-lg mt-6 overflow-x-auto">
                      <table className="min-w-full leading-normal">
                        <thead>
                          <tr className='bg-slate-300 dark:bg-slate-700 dark:text-white'>
                            <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Source Product Id
                            </th>
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
                          </tr>
                        </thead>
                        <tbody>
                          {values.orderProducts?.length > 0 ? (
                            values.orderProducts.map((product, index) => (
                              <tr key={index} className="bg-white dark:bg-slate-700">
                                <td className="px-5 py-3 border-b border-gray-200 text-sm">
                                  <div className="w-[130px] bg-gray-100 dark:bg-gray-700 rounded border py-2 px-3 text-center">
                                    {product.orderCategory?.toLowerCase() === 'dyeing' || 
                                     product.orderCategory?.toLowerCase() === 'embroidery' ? 
                                     (product.sourceProductName || 'N/A') : 
                                     'Plain Order'}
                                  </div>
                                </td>
                                <td className="px-5 py-3 border-b border-gray-200 text-sm">
                                  <div className="w-[130px] bg-gray-100 dark:bg-gray-700 rounded border py-2 px-3 text-center">
                                    {product.products?.productId || 'N/A'}
                                  </div>
                                </td>
                                <td className="px-5 py-3 border-b border-gray-200 text-sm">
                                  <div className="w-[130px] bg-gray-100 dark:bg-gray-700 rounded border py-2 px-3 text-center">
                                    {product.orderCategory || 'N/A'}
                                  </div>
                                </td>
                                <td className="px-5 py-3 border-b border-gray-200 text-sm">
                                  <div className="w-[130px] bg-gray-100 dark:bg-gray-700 rounded border py-2 px-3 text-center">
                                    {product.clientOrderQuantity || '0'}
                                  </div>
                                </td>
                                <td className="px-5 py-3 border-b border-gray-200 text-sm">
                                  <div className="w-[130px] bg-gray-100 dark:bg-gray-700 rounded border py-2 px-3 text-center">
                                    {product.units || 'Pcs'}
                                  </div>
                                </td>
                                <td className="px-5 py-3 border-b border-gray-200 text-sm">
                                  <div className="w-[130px] bg-gray-100 dark:bg-gray-700 rounded border py-2 px-3 text-center">
                                    {product.inStockQuantity || '0'}
                                  </div>
                                </td>
                                <td className="px-5 py-3 border-b border-gray-200 text-sm">
                                  <div className="w-[130px] bg-gray-100 dark:bg-gray-700 rounded border py-2 px-3 text-center">
                                    {product.quantityToManufacture || '0'}
                                  </div>
                                </td>
                                <td className="px-5 py-3 border-b border-gray-200 text-sm">
                                  <div className="w-[130px] bg-gray-100 dark:bg-gray-700 rounded border py-2 px-3 text-center">
                                    ₹{product.value?.toLocaleString() || '0'}
                                  </div>
                                </td>
                                <td className="px-5 py-3 border-b border-gray-200 text-sm">
                                  <div className="w-[167px] bg-gray-100 dark:bg-gray-700 rounded border py-2 px-3 text-center">
                                    {product.clientShippingDate ? new Date(product.clientShippingDate).toLocaleDateString() : 'N/A'}
                                  </div>
                                </td>
                                <td className="px-5 py-3 border-b border-gray-200 text-sm">
                                  <div className="w-[167px] bg-gray-100 dark:bg-gray-700 rounded border py-2 px-3 text-center">
                                    {product.expectedDate ? new Date(product.expectedDate).toLocaleDateString() : 'N/A'}
                                  </div>
                                </td>
                                <td className="px-5 py-3 border-b border-gray-200 text-sm">
                                  <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                      <thead>
                                        <tr className="bg-gray-200 dark:bg-gray-600">
                                          <th className="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-white">Supplier</th>
                                          <th className="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-white">Qty</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {product.productSuppliers?.length > 0 ? (
                                          product.productSuppliers.map((supplier, idx) => (
                                            <tr key={idx} className="border-b border-gray-200">
                                              <td className="px-3 py-2 text-xs text-center">
                                                {supplier.supplier?.name || 'N/A'}
                                              </td>
                                              <td className="px-3 py-2 text-xs text-center">
                                                {supplier.supplierOrderQty || '0'}
                                              </td>
                                            </tr>
                                          ))
                                        ) : (
                                          <tr>
                                            <td colSpan="2" className="px-3 py-2 text-xs text-center text-gray-500">
                                              No suppliers
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="11" className="px-5 py-5 text-center text-gray-500">
                                No products found in this order
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Client Instruction */}
                    <div className="flex-1 min-w-[200px] mt-6">
                      <label className="mb-2.5 block text-black dark:text-white font-medium">Client Instruction</label>
                      <div className="w-full rounded border-[1.5px] border-stroke bg-gray-100 dark:bg-gray-700 py-3 px-5 text-black dark:text-white min-h-[80px] whitespace-pre-wrap">
                        {values.clientInstruction || 'No client instructions provided'}
                      </div>
                    </div>

                    {/* Customisation Details */}
                    {(values.orderType?.orderTypeName === "RetailClients" || values.orderType?.orderTypeName === "WSClients") && (
                      <div className="flex-1 min-w-[200px] mt-4">
                        <label className="mb-2.5 block text-black dark:text-white font-medium">Customisation Details</label>
                        <div className="w-full rounded border-[1.5px] border-stroke bg-gray-100 dark:bg-gray-700 py-3 px-5 text-black dark:text-white min-h-[80px] whitespace-pre-wrap">
                          {values.customisationDetails || 'No customisation details provided'}
                        </div>
                      </div>
                    )}

                    {/* Back Button */}
                    <div className="flex justify-center mt-6">
                      <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-1/3 px-6 py-3 text-white bg-primary rounded-lg shadow hover:bg-primary-dark focus:outline-none transition-colors"
                      >
                        Back to Orders
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

export default ViewOrderr;