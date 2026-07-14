import React, { useState, useEffect } from 'react';
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineReload,
  AiOutlineSearch,
  AiOutlineFilter,
  AiOutlinePlus,
} from 'react-icons/ai';
import ReactSelect from 'react-select';
import {
  FiPackage,
  FiUsers,
  FiCreditCard,
  FiTruck,
  FiClock,
} from 'react-icons/fi';
import DefaultLayout from '../../layout/DefaultLayout';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CUSTOMERSHOPIFY_URL } from '../../Constants/utils';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useorder from '../../hooks/useOrder';

import { customStyles as createCustomStyles } from '../../Constants/utils';
const ShopifyOrders = () => {

  const {prodId}=useorder()
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVouchers, setSelectedVouchers] = useState({});
  const { getCustomer, customer, getVoucherList, VoucherList } = useorder();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 50,
    nextPageUrl: null,
    prevPageUrl: null,
    totalOrders: 0,
  });
  const theme = useSelector((state) => state?.persisted?.theme);
  const customStyles = createCustomStyles(theme?.mode);
  const [filters, setFilters] = useState({
    status: 'any',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [checkingCustomers, setCheckingCustomers] = useState({});
  const { currentUser } = useSelector((state) => state?.persisted?.user);

  const { token } = currentUser;
  // Get access token from environment
  const accessToken = import.meta.env.VITE_SHOPIFY_ACCESS_TOKEN;

  // Helper function to parse Link header
  const parseLinkHeader = (linkHeader) => {
    if (!linkHeader) return { next: null, prev: null };

    const links = {};
    const parts = linkHeader.split(',');

    parts.forEach((part) => {
      const section = part.trim();
      const urlMatch = section.match(/<([^>]*)>/);
      const relMatch = section.match(/rel="([^"]*)"/);

      if (urlMatch && relMatch) {
        const url = urlMatch[1];
        const rel = relMatch[1];
        links[rel] = url;
      }
    });

    return {
      next: links.next || null,
      previous: links.previous || null,
    };
  };

  // Extract page_info from URL
  const extractPageInfo = (url) => {
    if (!url) return null;
    const match = url.match(/page_info=([^&]*)/);
    return match ? match[1] : null;
  };

  // Fetch orders with cursor-based pagination
  const fetchOrders = async (url = null) => {
    setIsLoading(true);
    setError(null);

    try {
      let apiUrl;

      if (url) {
        const urlObj = new URL(url);
        apiUrl = `/shopify${urlObj.pathname}${urlObj.search}`;
      } else {
        const params = new URLSearchParams({
          limit: pagination.limit.toString(),
          status: filters.status,
        });

        if (filters.search) {
          params.append('query', filters.search);
        }

        apiUrl = `/shopify/admin/api/2026-01/orders.json?${params.toString()}`;
      }

      console.log('Fetching orders from:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors || 'Failed to fetch orders');
      }

      const data = await response.json();
      console.log(data, 'llllllllllll');

      const ordersData = data.orders || [];

      // Parse Link header for pagination
      const linkHeader = response.headers.get('Link');
      const parsedLinks = parseLinkHeader(linkHeader);

      setPagination((prev) => {
        let newPage = prev.currentPage;
        if (url && parsedLinks.next) {
          newPage = prev.currentPage + 1;
        } else if (url && parsedLinks.previous) {
          newPage = prev.currentPage - 1;
        } else if (!url) {
          newPage = 1;
        }

        return {
          ...prev,
          currentPage: newPage,
          totalOrders: prev.totalOrders + ordersData.length,
          nextPageUrl: parsedLinks.next,
          prevPageUrl: parsedLinks.previous,
        };
      });

      setOrders(ordersData);

      // Auto-check customers after orders load
      // if (ordersData.length > 0) {
      //   checkCustomersInOrders(ordersData);
      // }
    } catch (err) {
      setError({
        message: err.message,
        details:
          'Unable to fetch orders. Please check your access token and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stateOption = [
    { value: '01', label: 'Jammu & Kashmir' },
    { value: '02', label: 'Himachal Pradesh' },
    { value: '03', label: 'Punjab' },
    { value: '04', label: 'Chandigarh' },
    { value: '05', label: 'Uttarakhand' },
    { value: '06', label: 'Haryana' },
    { value: '07', label: 'Delhi' },
    { value: '08', label: 'Rajasthan' },
    { value: '09', label: 'Uttar Pradesh' },
    { value: '10', label: 'Bihar' },
    { value: '11', label: 'Sikkim' },
    { value: '12', label: 'Arunachal Pradesh' },
    { value: '13', label: 'Nagaland' },
    { value: '14', label: 'Manipur' },
    { value: '15', label: 'Mizoram' },
    { value: '16', label: 'Tripura' },
    { value: '17', label: 'Meghalaya' },
    { value: '18', label: 'Assam' },
    { value: '19', label: 'West Bengal' },
    { value: '20', label: 'Jharkhand' },
    { value: '21', label: 'Odisha' },
    { value: '22', label: 'Chhattisgarh' },
    { value: '23', label: 'Madhya Pradesh' },
    { value: '24', label: 'Gujarat' },
    { value: '25', label: 'Daman & Diu' },
    { value: '26', label: 'Dadra & Nagar Haveli' },
    { value: '27', label: 'Maharashtra' },
    { value: '28', label: 'Andhra Pradesh' },
    { value: '29', label: 'Karnataka' },
    { value: '30', label: 'Goa' },
    { value: '31', label: 'Lakshadweep' },
    { value: '32', label: 'Kerala' },
    { value: '33', label: 'Tamil Nadu' },
    { value: '34', label: 'Puducherry' },
    { value: '35', label: 'Andaman & Nicobar Islands' },
    { value: '36', label: 'Telangana' },
    { value: '37', label: 'Andhra Pradesh (New)' },
    { value: '38', label: 'Ladakh' },
  ];

  useEffect(() => {
    getVoucherList();
  }, []);

  const formattedVoucher = VoucherList.filter(
    (voucher) => voucher.typeOfVoucher === 'Sales',
  ).map((voucher) => ({
    label: voucher.name,
    value: voucher.id,
  }));

  console.log(formattedVoucher, '1122');
  console.log(selectedVouchers, '885');

  // Check customers in orders
  // const checkCustomersInOrders = async (ordersData) => {
  //   try {
  //     const customersToCheck = ordersData
  //       .filter(order => order.customer?.phone)
  //       .map(order => ({
  //         orderId: order.id,
  //         contactNumber: order.customer.phone,
  //         email: order.customer.email,
  //         customerName:`${order.customer.first_name} ${order.customer.last_name}`,
  //         // firstName: order.customer.first_name,
  //         // lastName: order.customer.last_name,
  //         shopifyCustomerId: order.customer.id,
  //         countryName:order.customer.country,
  //         shippingState:order.customer.premises,
  //         typeOfopeningBalance:"DEBIT",
  //         openingBalances:0
  //       }));

  //     if (customersToCheck.length === 0) return;

  //     const response = await fetch('/api/customers/bulk-check', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ customers: customersToCheck }),
  //     });

  //     const data = await response.json();

  //     setOrders(prevOrders => prevOrders.map(order => {
  //       const status = data.find(c => c.orderId === order.id);
  //       return {
  //         ...order,
  //         customerInDatabase: status?.exists || false,
  //         customerId: status?.customerId || null,
  //       };
  //     }));
  //   } catch (error) {
  //     console.error('Error checking customers:', error);
  //   }
  // };
  const getStateCode = (stateName) => {
    if (!stateName) return '';

    const state = stateOption.find(
      (item) =>
        item.label.trim().toLowerCase() === stateName.trim().toLowerCase(),
    );

    return state ? state.value : '';
  };
  // Handle Create Voucher with customer check
  const handleCreateVoucher = async (order) => {
    try {
      const customerPhone =
        order.customer?.phone || order.shipping_address?.phone;

      if (!customerPhone) {
        alert(
          'Customer phone number not available. Please add phone number in Shopify.',
        );
        return;
      }

      setCheckingCustomers((prev) => ({ ...prev, [order.id]: true }));
      const shippingStateCode = getStateCode(order?.shipping_address?.province);
      // Use the single sync endpoint
      const response = await fetch(`${CUSTOMERSHOPIFY_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contactNumber: customerPhone,
          email: order.customer?.email || '',
          customerName: `${order.customer?.first_name} ${order.customer?.last_name}`,
          // firstName: order.customer?.first_name || '',
          // lastName: order.customer?.last_name || '',
          shopifyCustomerId: order.customer?.id,
          orderId: order.id,
          shippingAddress: order?.shipping_address?.address1,
          billingAddress: order?.billing_address?.address1,
          countryName: order?.billing_address?.country || '',
          shippingState: getStateCode(order?.shipping_address?.province),
          typeOfopeningBalance: 'DEBIT',
          previousOpType: 'DEBIT',
          openingBalances: 0,
        }),
      });

      const data = await response.json();
      console.log(order, '222222222umer');

      const voucherData = {
        // ── Customer Info ──────────────────────────────────
        customer: {
          id: order.customer?.id || null,
          name:
            `${order.customer?.first_name} ${order.customer.last_name}` ||
            order.customer?.name ||
            '',
          phone: order.phone,
          country:
            order.shipping_address?.country ||
            order.billing_address?.country ||
            '',
        },

        // ── Order Info ─────────────────────────────────────
        order: {
          id: order.orderId || order.id,
          orderNumber: order.orderNumber,
        },

        // ── Products from line_items ───────────────────────
        // Each item: sku, price (retailMrp), quantity, hsnCode
        products: (order.line_items || []).map((item) => ({
          sku: item.sku || item.product?.productId || '',
          productId: item.product?.id || item.productId || null,
          name:
            item.product?.productDescription || item.title || item.sku || '',
          price: item.price || item.product?.retailMrp || 0, // MRP inclusive of GST
          quantity: item.quantity || 1,
          hsnCode: item.product?.hsnCode || {}, // { igst, cgst, sgst }
          orderProductId: item.id || null, // line_item id
        })),

        // ── Flags ─────────────────────────────────────────
        isNewCustomer: order.isNew || false,
      };

      if (!response.ok) {
        toast.error(data.errorMessage || 'Failed to sync customer');
        navigate(`/create-voucher-from-order/${selectedVouchers}`, {
          state: voucherData,
        });
        // navigate('/create-voucher', {
        //   state: {
        //     customer: data.customer,
        //     order: order,
        //     isNewCustomer: data.isNew || false,
        //   },
        // });
      }

      // Based on your API response structure
      // Assuming the API returns: { success: true, customer: {...}, isNew: boolean }
      if (data.success) {
        // Navigate to voucher page with customer data
        navigate('/create-voucher', {
          state: {
            customer: data.customer,

            order: order,
            isNewCustomer: data.isNew || false,
          },
        });
      } else {
        toast.error(
          data.message || 'Failed to sync customer. Please try again.',
        );
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error syncing customer: ' + error.message);
    } finally {
      setCheckingCustomers((prev) => ({ ...prev, [order.id]: false }));
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    if (accessToken && accessToken !== 'undefined') {
      fetchOrders();
    } else {
      setError({
        message: 'Access token not configured',
        details: 'Please add VITE_SHOPIFY_ACCESS_TOKEN to your .env file',
      });
    }
  }, []);

  // Handle page change
  const handlePageChange = (direction) => {
    if (direction === 'next' && pagination.nextPageUrl) {
      fetchOrders(pagination.nextPageUrl);
    } else if (direction === 'prev' && pagination.prevPageUrl) {
      fetchOrders(pagination.prevPageUrl);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
      nextPageUrl: null,
      prevPageUrl: null,
      totalOrders: 0,
    }));
    fetchOrders();
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Apply filters - reset to first page
  const applyFilters = () => {
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
      nextPageUrl: null,
      prevPageUrl: null,
      totalOrders: 0,
    }));
    fetchOrders();
    setShowFilters(false);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: 'any',
      search: '',
    });
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
      nextPageUrl: null,
      prevPageUrl: null,
      totalOrders: 0,
    }));
    fetchOrders();
    setShowFilters(false);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get fulfillment status badge color
  const getFulfillmentBadgeColor = (status) => {
    const colors = {
      fulfilled: 'bg-green-100 text-green-800',
      partial: 'bg-yellow-100 text-yellow-800',
      unfulfilled: 'bg-red-100 text-red-800',
      any: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || colors.any;
  };

  // Get payment status badge color
  const getPaymentBadgeColor = (status) => {
    const colors = {
      paid: 'bg-green-100 text-green-800',
      partially_paid: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-orange-100 text-orange-800',
      refunded: 'bg-purple-100 text-purple-800',
      voided: 'bg-red-100 text-red-800',
      any: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || colors.any;
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Shopify Orders
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and track all your Shopify store orders
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
              >
                <AiOutlineFilter size={18} />
                <span>Filters</span>
              </button>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 disabled:opacity-50"
              >
                <AiOutlineReload
                  className={isLoading ? 'animate-spin' : ''}
                  size={18}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Status
                  </label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="any">All Orders</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Orders
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="Search by order # or customer..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                    />
                    <AiOutlineSearch
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={applyFilters}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex-1"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats Summary */}
          {!isLoading && orders.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Orders on Page</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {orders.length}
                    </p>
                  </div>
                  <FiPackage className="text-blue-500" size={28} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current Page</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {pagination.currentPage}
                    </p>
                  </div>
                  <FiUsers className="text-green-500" size={28} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Per Page</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {pagination.limit}
                    </p>
                  </div>
                  <FiCreditCard className="text-purple-500" size={28} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Fulfilled</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        orders.filter(
                          (o) => o.fulfillment_status === 'fulfilled',
                        ).length
                      }
                    </p>
                  </div>
                  <FiTruck className="text-orange-500" size={28} />
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <FiClock className="text-red-500 mt-0.5" size={24} />
                <div>
                  <p className="text-red-800 font-medium">{error.message}</p>
                  {error.details && (
                    <p className="text-red-600 text-sm mt-1">{error.details}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-600">Loading orders...</p>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <FiPackage className="text-gray-300" size={64} />
                <p className="text-gray-500 mt-4">No orders found</p>
                <p className="text-gray-400 text-sm">
                  Try adjusting your filters or refresh
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Order
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Products
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Channel
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Payment
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Fulfillment
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Items
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Tags
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Select Voucher
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600">
                            {order.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(order.created_at)}
                        </td>
                        <td>
                          {order.line_items?.map((item) => (
                            <div
                              key={item.id}
                              className="text-sm text-gray-700 tracking-wider whitespace-nowrap"
                            >
                              {item.sku} (Qty: {item.quantity})
                            </div>
                          ))}
                        </td>

                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">
                            {order.customer?.first_name}{' '}
                            {order.customer?.last_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.customer?.email || 'No email'}
                          </div>
                          {order.customer?.phone && (
                            <div className="text-xs text-gray-500">
                              {order.customer.phone}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {order.source_name || 'ONLINE STORE'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            ₹{parseFloat(order.total_price).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getPaymentBadgeColor(
                              order.financial_status,
                            )}`}
                          >
                            {order.financial_status || 'pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getFulfillmentBadgeColor(
                              order.fulfillment_status,
                            )}`}
                          >
                            {order.fulfillment_status || 'unfulfilled'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {order.line_items?.length || 0}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {order.tags
                              ?.split(',')
                              .filter((t) => t.trim())
                              .map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full"
                                >
                                  {tag.trim()}
                                </span>
                              ))}
                            {(!order.tags || !order.tags.trim()) && (
                              <span className="text-xs text-gray-400">
                                No tags
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                          <ReactSelect
                            options={formattedVoucher}
                            placeholder="Select Voucher"
                            className="w-full z-90 bg-transparent dark:bg-form-Field"
                            styles={customStyles}
                            menuPortalTarget={document.body}
                            onChange={(selectedOption) => {
                              setSelectedVouchers(
                                (prev) => selectedOption?.value || null,
                              );
                            }}
                            value={formattedVoucher.find(
                              (option) => option.value === selectedVouchers.id,
                            )}
                            menuPosition="fixed"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <Button
                              variant={
                                order.customerInDatabase ? 'primary' : 'danger'
                              }
                              className={`w-full text-white font-medium rounded-lg px-4 py-2 transition-all duration-200 transform hover:scale-105 hover:shadow-md ${
                                order.customerInDatabase
                                  ? 'bg-blue-600 hover:bg-blue-700'
                                  : 'bg-red-600 hover:bg-red-700'
                              }`}
                              onClick={() => handleCreateVoucher(order)}
                              disabled={checkingCustomers[order.id]}
                            >
                              {checkingCustomers[order.id] ? (
                                <span className="flex items-center justify-center gap-2">
                                  <span className="spinner-border spinner-border-sm"></span>
                                  Checking...
                                </span>
                              ) : order.customerInDatabase ? (
                                <span className="flex items-center justify-center gap-1">
                                  <AiOutlinePlus size={16} />
                                  Create Voucher
                                </span>
                              ) : (
                                <span className="flex items-center justify-center gap-1">
                                  <AiOutlinePlus size={16} />
                                  Check Customer & Create Voucher
                                </span>
                              )}
                            </Button>
                            {order.customerInDatabase && (
                              <span className="text-xs text-green-600 text-center">
                                ✅ Existing Customer
                              </span>
                            )}
                            {!order.customerInDatabase &&
                              order.customer?.phone && (
                                <span className="text-xs text-orange-600 text-center">
                                  ⚠️ New Customer
                                </span>
                              )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && orders.length > 0 && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between flex-wrap gap-2">
                <div className="text-sm text-gray-600">
                  Showing {(pagination.currentPage - 1) * pagination.limit + 1}{' '}
                  to{' '}
                  {Math.min(
                    pagination.currentPage * pagination.limit,
                    pagination.totalOrders,
                  )}{' '}
                  of {pagination.totalOrders} orders
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange('prev')}
                    disabled={!pagination.prevPageUrl}
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <AiOutlineArrowLeft size={16} />
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {pagination.currentPage}
                  </span>
                  <button
                    onClick={() => handlePageChange('next')}
                    disabled={!pagination.nextPageUrl}
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <AiOutlineArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ShopifyOrders;
