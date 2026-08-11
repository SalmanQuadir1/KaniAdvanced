import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { GET_ORDERBYIDDD_URL } from '../../Constants/utils';
import useorder from '../../hooks/useOrder';
import { toast } from 'react-toastify';
import { 
  FaArrowLeft, 
  FaBox, 
  FaCalendarAlt, 
  FaUser, 
  FaMapMarkerAlt, 
  FaTag, 
  FaFileAlt,
  FaTruck,
  FaShoppingBag,
  FaCreditCard,
  FaCube,
  FaClock,
  FaInfoCircle,
  FaLayerGroup,
  FaHashtag,
  FaUsers,
  FaSpinner
} from 'react-icons/fa';

const ViewOrderr = () => {
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { getLocation, Location, getorderType, orderTypee, getCustomer, customer } = useorder();

  // Fetch dropdown data
  useEffect(() => {
    getLocation();
    getorderType();
    getCustomer();
  }, []);

  // Get order by ID
  const getOrderById = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${GET_ORDERBYIDDD_URL}/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      const data = await response.json();
      console.log(data,"4444444444");
      
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

  // Helper function to get label
  const getLabel = (value, options) => {
    if (!value) return 'Not Selected';
    const found = options?.find(opt => opt.value === value);
    return found?.label || value;
  };

  // Get order type name
  const getOrderTypeName = () => {
    const found = orderTypee?.find(ot => ot.id === order?.orderType?.id);
    return found?.orderTypeName || 'N/A';
  };

  // Get location name
  const getLocationName = () => {
    const found = Location?.find(loc => loc.id === order?.locationId);
    return found?.address || 'N/A';
  };

  // Get customer name
  console.log(order,"lk");
  
  const getCustomerName = () => {
    const found = customer?.find(c => c.id === order?.customerId);
    return found?.customerName || 'N/A';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Status badge
  const StatusBadge = ({ status }) => {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-transparent text-gray-300 border border-gray-500/50">
      {status || 'Unknown'}
    </span>
  );
};

  // Loading state
  if (isLoading) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Order / View Order" />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <FaSpinner className="animate-spin h-16 w-16 text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading order details...</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Order / View Order" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </button>
  <div className="flex items-center gap-3">
  <span className="text-sm text-gray-500">Order Status:</span>
  
  {/* <StatusBadge 
    status={order?.status} 
    style={{ backgroundColor: '#dc2626', color: 'white' }}
  /> */}

     <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                         {order?.status || 'N/A'}
                        </span>
  {/* <span className='text-xs'>{order?.status || 'N/A'}</span> */}
 
</div>
        </div>

        {/* Order Header Card */}
<div className="bg-[#1f2937] rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <FaBox className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Order {order?.orderNo || 'N/A'}</h1>
                <p className="text-indigo-100">Placed on {formatDate(order?.orderDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <div className="text-right">
                <p className="text-indigo-100 text-sm">Order Type</p>
                <p className="text-white font-semibold">{getOrderTypeName()}</p>
              </div>
              <div className="h-12 w-px bg-white/20"></div>
              <div className="text-right">
                <p className="text-indigo-100 text-sm">Total Value</p>
                <p className="text-white font-semibold text-lg">
                  ₹{
                    order.orderProducts?.reduce((sum, p) => sum + (parseFloat(p.value) || 0), 0).toLocaleString() || '0'
                  }
                  {/* ₹{order?.totalValue?.toLocaleString() || '0'} */}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <FaUser className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Customer</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {getCustomerName()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <FaMapMarkerAlt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {getLocationName()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <FaTruck className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Shipping Date</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatDate(order?.shippingDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <FaTag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Tags & Labels</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {order?.tagsAndLabels || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            {(order?.orderType?.orderTypeName === "RetailClients" || 
              order?.orderType?.orderTypeName === "WSClients") && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <FaUsers className="w-5 h-5 text-indigo-600" />
                    Customer Information
                  </h3>
                </div>
                <div className="flex p-6 grid grid-cols-3 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Customer Name</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {getCustomerName()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PO Number</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {order?.purchaseOrderNo || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PO Date</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {formatDate(order?.poDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Sales Channel</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {order?.salesChannel || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Employee Name</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {order?.employeeName || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Logo Number</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {order?.logoNo || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaInfoCircle className="w-5 h-5 text-indigo-600" />
                  Additional Details
                </h3>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-3 gap-4 p-6 ">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Shipping Date</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                    {formatDate(order?.shippingDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Client Instructions</p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    {order?.clientInstruction || 'No client instructions provided'}
                  </p>
                </div>
                {(order?.orderType?.orderTypeName === "RetailClients" || 
                  order?.orderType?.orderTypeName === "WSClients") && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Customisation Details</p>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      {order?.customisationDetails || 'No customisation details provided'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-6">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaShoppingBag className="w-5 h-5 text-indigo-600" />
                  Order Summary
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Products</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {order?.orderProducts?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Items</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {order?.orderProducts?.reduce((sum, p) => sum + (parseInt(p.clientOrderQuantity) || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Value</span>
                  <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    ₹{order?.orderProducts?.reduce((sum, p) => sum + (parseFloat(p.value) || 0), 0).toLocaleString() || '0'}
                  </span>
                </div>
                {/* <div className="pt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Order ID</p>
                  <p className="text-xs font-mono text-gray-600 dark:text-gray-400 mt-1 break-all">
                    {order?.id}
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FaBox className="w-5 h-5 text-indigo-600" />
              Products ({order?.orderProducts?.length || 0})
            </h3>
          </div>
          
          <div className="overflow-x-auto p-6">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client Qty</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">In Stock</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">To Manufacture</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Units</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Suppliers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {order?.orderProducts?.length > 0 ? (
                  order.orderProducts.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {/* <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mr-3">
                            <FaHashtag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          </div> */}
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {product?.productIdName || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {product.orderCategory || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-700 dark:text-gray-300">
                        {product.clientOrderQuantity || '0'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-700 dark:text-gray-300">
                        {product.inStockQuantity || '0'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-700 dark:text-gray-300">
                        {product.quantityToManufacture || '0'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-700 dark:text-gray-300">
                        {product.units || 'Pcs'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                        ₹{product.value?.toLocaleString() || '0'}
                      </td>
                      <td className="px-4 py-4 tracking-wide text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex flex-wrap gap-1">
                          {product.productSuppliers?.length > 0 ? (
                            product.productSuppliers.map((supplier, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded tracking-wide whitespace-nowrap">
                                <span className="font-medium">{supplier.supplier?.name || 'N/A'}</span>
                                <span className="text-gray-500">({supplier.supplierOrderQty || 0})</span>
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">No suppliers</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      <FaBox className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                      No products found in this order
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
          >
            Back
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ViewOrderr;