import React, { useState, useEffect } from 'react';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../Constants/utils';
import { useNavigate } from 'react-router-dom';

const Fiber = () => {
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const navigate = useNavigate();

  const [orderProducts, setOrderProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0
  });

  // Fetch order products with pagination
  const fetchOrderProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/order/order-category/plain-orders?page=${page }&size=10`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log(data,"kj");
      

      if (response.ok) {
        setOrderProducts(data.content || []);
        setPagination({
          currentPage: page,
          totalPages: data.totalPages || 1,
          itemsPerPage: data.size || 10,
          totalItems: data.totalElements || 0
        });
      } else {
        toast.error(data.errorMessage || 'Failed to fetch order products');
        setOrderProducts([]);
      }
    } catch (error) {
      console.error('Error fetching order products:', error);
      toast.error('An error occurred while fetching data');
      setOrderProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderProducts();
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchOrderProducts(newPage);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter data based on search
  const filteredData = orderProducts.filter((item) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      item.productName?.toLowerCase().includes(searchTerm) ||
      item.locationName?.toLowerCase().includes(searchTerm) ||
      item.orderCategory?.toLowerCase().includes(searchTerm) ||
      item.orderId?.toString().includes(searchTerm)
    );
  });

  // Render table rows
  const renderTableRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="8" className="px-5 py-10 text-center">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">Loading...</span>
            </div>
          </td>
        </tr>
      );
    }

    if (filteredData.length === 0) {
      return (
        <tr>
          <td colSpan="8" className="px-5 py-10 text-center text-gray-500 dark:text-gray-400">
            {searchQuery ? 'No matching order products found' : 'No order products available'}
          </td>
        </tr>
      );
    }

    const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

    return filteredData.map((item, index) => (
      <tr key={item.id || index} className="bg-white dark:bg-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors">
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
          <p className="text-gray-900 dark:text-white whitespace-no-wrap">
            {startingSerialNumber + index}
          </p>
        </td>
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
          <p className="text-gray-900 dark:text-white whitespace-no-wrap font-medium">
            #{item.orderNumber}
          </p>
        </td>
        {
            item.orderProducts && item.orderProducts.length > 0 ? (
              <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
                <p className="text-gray-900 dark:text-white whitespace-no-wrap tracking-wide">

                    {item.orderProducts.map((product, idx) => (
                      <span key={idx} className="block">
                        {product.productName || 'N/A'}
                      </span>
                    ))}
                </p>
              </td>
            ) : (
              <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
                <p className="text-gray-900 dark:text-white whitespace-no-wrap">
                  N/A
                </p>
              </td>
            )
          }
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
          <p className="text-gray-900 dark:text-white whitespace-no-wrap">
            {item.productName || 'N/A'}
          </p>
        </td>
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
          <p className="text-gray-900 dark:text-white whitespace-no-wrap">
            {item.locationName || 'N/A'}
          </p>
        </td>
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.deductedFromInventory 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
          }`}>
            {item.deductedFromInventory ? 'Deducted' : 'Not Deducted'}
          </span>
        </td>
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
          <p className="text-gray-900 dark:text-white whitespace-no-wrap">
            {item.deductedInventoryQty || 0}
          </p>
        </td>
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            {item.orderCategory || 'N/A'}
          </span>
        </td>
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
          <p className="text-gray-900 dark:text-white whitespace-no-wrap text-xs">
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
          </p>
        </td>
      </tr>
    ));
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Order / View Order Products" />
      
      <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800 rounded-lg shadow-md">
        <div className="pt-5 pb-5">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full mb-6">
            <h2 className="text-xl text-slate-500 dark:text-slate-300 font-semibold flex items-center justify-between w-full md:w-auto">
              <span>ORDER PRODUCTS</span>
            </h2>
            
            <div className="flex items-center gap-4 mt-3 md:mt-0">
              <span className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/20 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800/30 text-sm font-semibold text-blue-700 dark:text-blue-300">
                TOTAL: {pagination.totalItems}
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center mb-4 gap-3">
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                name="search"
                placeholder="Search by Product, Order ID, Location..."
                className="w-full h-10 rounded-lg border-2 border-gray-300 bg-white py-2 px-4 pr-10 text-sm text-gray-700 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-500 dark:focus:ring-blue-900/50"
                value={searchQuery}
                onChange={handleSearch}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              )}
            </div>
            <button 
              onClick={() => fetchOrderProducts(pagination.currentPage)}
              className="h-10 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Refresh
            </button>
          </div>

          {/* Table */}
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="bg-slate-300 dark:bg-slate-700 dark:text-white">
                    <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      S.No
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Order No
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Qty Deducted
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Created Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {renderTableRows()}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {!loading && filteredData.length > 0 && (
              <div className="mt-4">
                <Pagination
                  totalPages={pagination.totalPages}
                  currentPage={pagination.currentPage}
                  handlePageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Fiber;