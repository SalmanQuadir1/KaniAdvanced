import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { FaBell, FaCheck, FaClock, FaExclamationTriangle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Pagination from '../Pagination/Pagination';
import { DELAYPRODUCT, NOTIF } from '../../Constants/utils';

const ViewNotifications = () => {
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  
  const [delayedOrders, setDelayedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10,
  });

  // Fetch delayed orders with pagination
  const fetchDelayedOrders = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${DELAYPRODUCT}?page=${page}&size=10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setDelayedOrders(data.content || []);
      setPagination({
        totalItems: data.totalElements || 0,
        totalPages: data.totalPages || 0,
        currentPage: page,
        itemsPerPage: data.size || 10,
      });
    } catch (error) {
      console.error('Error fetching delayed orders:', error);
      toast.error('Failed to load delayed orders');
      setDelayedOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchDelayedOrders(newPage);
  };

  // Initial fetch
  useEffect(() => {
    fetchDelayedOrders(1);
  }, []);

  // Get status badge color
  const getStatusBadge = (status) => {
    const statusMap = {
      'LATE': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'ON_TIME': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'DELAYED': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  // Get party type badge
  const getPartyTypeBadge = (type) => {
    const typeMap = {
      'CUSTOMER': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'SUPPLIER': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    };
    return typeMap[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  // Render table rows
  const renderTableRows = () => {
    if (!delayedOrders || !delayedOrders.length) {
      return (
        <tr>
          <td colSpan="8" className="text-center py-8 text-gray-500 dark:text-gray-400">
            No delayed orders found
          </td>
        </tr>
      );
    }

    const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;
    
    return delayedOrders.map((item, index) => (
      <tr key={item.orderProductId || index} className="bg-white dark:bg-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors duration-150">
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
          <p className="text-gray-900 dark:text-white whitespace-no-wrap">
            {startingSerialNumber + index}
          </p>
        </td>
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
          <p className="text-gray-900 dark:text-white whitespace-no-wrap font-medium">
            #{item.orderNo || 'N/A'}
          </p>
        </td>
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
          <p className="text-gray-900 dark:text-white whitespace-no-wrap">
            {item.productId || 'N/A'}
          </p>
        </td>
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
          <p className="text-gray-700 dark:text-gray-300 whitespace-no-wrap">
            {item.partyName || 'N/A'}
          </p>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getPartyTypeBadge(item.partyType)}`}>
            {item.partyType || 'N/A'}
          </span>
        </td>
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
          <div className="flex flex-col gap-1">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(item.productStatus)}`}>
              {item.productStatus || 'N/A'}
            </span>
            {item.daysLate > 0 && (
              <span className="text-xs font-bold text-red-600 dark:text-red-400">
                {item.daysLate} day(s) late
              </span>
            )}
          </div>
        </td>
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
          <p className="text-gray-700 dark:text-gray-300 whitespace-no-wrap">
            {item.expectedDate || 'N/A'}
          </p>
        </td>
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            ⚠️ Delayed
          </span>
        </td>
      </tr>
    ));
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Delayed Orders" />
      
      <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
        <div className="pt-5">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl text-slate-500 dark:text-slate-300 font-semibold flex items-center gap-3">
              <span>DELAYED ORDERS</span>
              <span className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/20 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800/30 text-sm font-semibold text-blue-700 dark:text-blue-300">
                TOTAL: {pagination.totalItems}
              </span>
              {/* {delayedOrders.length > 0 && (
                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 px-4 py-2 rounded-lg border border-red-200 dark:border-red-800/30 text-sm font-semibold">
                  DELAYED: {delayedOrders.length}
                </span>
              )} */}
            </h2>
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
                      Product ID
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Party
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Expected Date
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-8">
                        <div className="flex justify-center items-center">
                          <div className="relative">
                            <div className="h-12 w-12 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                            <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    renderTableRows()
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <Pagination
              totalPages={pagination.totalPages}
              currentPage={pagination.currentPage}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ViewNotifications;