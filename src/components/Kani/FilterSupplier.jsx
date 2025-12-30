import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Pagination from "../../components/Pagination/Pagination";
import { GET_Kani_URL } from "../../Constants/utils";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";

const FilterSupplier = () => {
  const [allFlattenedProducts, setAllFlattenedProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useClientPagination, setUseClientPagination] = useState(true);

  const navigate = useNavigate();

  const handleViewSupplierProduct = (productId) => {
    navigate(`/supplier-product/view/${productId}`);
  };

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 0,
    totalItems: 0,
  });

  const { currentUser } = useSelector(
    (state) => state?.persisted?.user || {}
  );
  const token = currentUser?.token;

  // Fetch data when component mounts and when page changes (if server pagination works)
  useEffect(() => {
    if (useClientPagination) {
      // For client-side pagination, only fetch once
      if (pagination.currentPage === 1) {
        fetchKaniOrders();
      } else {
        // Just update displayed products for client-side pagination
        updateDisplayedProducts();
      }
    } else {
      // For server-side pagination, fetch on every page change
      fetchKaniOrders();
    }
  }, [pagination.currentPage, useClientPagination]);

  // Update displayed products when all data changes
  useEffect(() => {
    updateDisplayedProducts();
  }, [allFlattenedProducts, pagination.currentPage]);

  const updateDisplayedProducts = () => {
    if (allFlattenedProducts.length === 0) {
      setDisplayedProducts([]);
      return;
    }
    
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    const currentPageData = allFlattenedProducts.slice(startIndex, endIndex);
    setDisplayedProducts(currentPageData);
  };

  const flattenOrderProducts = (ordersData) => {
    const flattened = [];
    ordersData.forEach((order) => {
      order.orderProducts?.forEach((orderProduct) => {
        flattened.push({
          ...orderProduct,
          orderInfo: {
            orderNo: order.orderNo,
            orderDate: order.orderDate,
            customer: order.customer,
          },
        });
      });
    });
    return flattened;
  };

  // Try different pagination approaches
  const fetchKaniOrders = async () => {
    if (!token) {
      toast.error("No access token found. Please login.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching Kani orders...");
      
      // First try without pagination to get all data
      const apiUrl = `${GET_Kani_URL}`;
      console.log("API URL:", apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch orders (${response.status})`);
      }

      const data = await response.json();
      console.log("API Response data:", data);
      
      // Check if data is paginated
      if (data.content && Array.isArray(data.content)) {
        console.log("Server supports pagination!");
        console.log("Total elements:", data.totalElements);
        console.log("Total pages:", data.totalPages);
        
        // Try to use server-side pagination if we have more than one page
        if (data.totalPages > 1) {
          setUseClientPagination(false);
          handlePaginatedResponse(data);
        } else {
          // Only one page, use client-side pagination
          setUseClientPagination(true);
          handleClientSidePagination(data.content);
        }
      } else if (Array.isArray(data)) {
        // Direct array response - use client-side pagination
        setUseClientPagination(true);
        handleClientSidePagination(data);
      } else {
        console.warn("Unexpected data format:", data);
        toast.error("Unexpected data format from server");
      }

    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      toast.error(err.message || "Failed to load Kani orders");
    } finally {
      setLoading(false);
    }
  };

  // Handle server-side paginated response
  const handlePaginatedResponse = (data) => {
    const ordersArray = data.content || [];
    const flattened = flattenOrderProducts(ordersArray);
    
    // Use server-provided pagination info
    const totalItems = data.totalElements || 0;
    const totalPages = data.totalPages || 1;
    
    console.log(`Server pagination - Total: ${totalItems}, Pages: ${totalPages}`);
    
    setPagination(prev => ({
      ...prev,
      totalPages: totalPages,
      totalItems: totalItems
    }));
    
    setAllFlattenedProducts(flattened);
  };

  // Handle client-side pagination
  const handleClientSidePagination = (ordersArray) => {
    const flattened = flattenOrderProducts(ordersArray);
    const totalItems = flattened.length;
    const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
    
    console.log(`Client pagination - Total: ${totalItems}, Pages: ${totalPages}`);
    
    setPagination(prev => ({
      ...prev,
      totalPages: totalPages,
      totalItems: totalItems
    }));
    
    setAllFlattenedProducts(flattened);
  };

  // Function to fetch a specific page from server (if server pagination works)
  const fetchPageFromServer = async (pageNumber) => {
    try {
      // Convert to 0-based index for Spring Boot
      const pageIndex = pageNumber - 1;
      const apiUrl = `${GET_Kani_URL}?page=${pageIndex}&size=${pagination.itemsPerPage}`;
      
      console.log(`Fetching page ${pageNumber} from server: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`Page ${pageNumber} data:`, data);
        return data;
      }
    } catch (err) {
      console.error(`Error fetching page ${pageNumber}:`, err);
    }
    return null;
  };

  // Page change handler
  const handlePageChange = async (page) => {
    console.log(`Changing page from ${pagination.currentPage} to ${page}`);
    
    if (!useClientPagination) {
      // Try to fetch the page from server
      setLoading(true);
      const pageData = await fetchPageFromServer(page);
      
      if (pageData) {
        handlePaginatedResponse(pageData);
      } else {
        // Fall back to client-side pagination
        console.log("Server pagination failed, using client-side");
        setUseClientPagination(true);
        toast.warning("Using client-side pagination");
      }
      setLoading(false);
    }
    
    // Update current page (for both client and server pagination)
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // Calculate starting serial number
  const getStartingSerialNumber = () => {
    return (pagination.currentPage - 1) * pagination.itemsPerPage + 1;
  };

  const renderTableRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="5" className="text-center py-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading suppliers...</span>
            </div>
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan="5" className="text-center py-6 text-red-500">
            {error}
          </td>
        </tr>
      );
    }

    if (displayedProducts.length === 0 && !loading) {
      return (
        <tr>
          <td colSpan="5" className="text-center py-6">
            No supplier data found
          </td>
        </tr>
      );
    }

    const startingSerialNumber = getStartingSerialNumber();

    return displayedProducts.map((orderProduct, index) => {
      const supplier = orderProduct?.productSuppliers?.[0];

      return (
        <tr
          key={orderProduct.id || index}
          className="bg-white dark:bg-boxdark hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          {/* SNO */}
          <td className="px-4 py-3 border-b text-center">
            {startingSerialNumber + index}
          </td>

          {/* SUPPLIER NAME */}
          <td className="px-4 py-3 border-b text-center">
            {supplier?.supplier?.name || (
              <span className="text-gray-400">—</span>
            )}
          </td>

          {/* SUPPLIER QUANTITY */}
          <td className="px-4 py-3 border-b text-center">
            {supplier?.supplierOrderQty ?? (
              <span className="text-gray-400">0</span>
            )}
          </td>

          {/* PRODUCT GROUP */}
          <td className="px-4 py-3 border-b text-center">
            {orderProduct?.products?.productGroup?.productGroupName || (
              <span className="text-gray-400">—</span>
            )}
          </td>

          {/* ACTIONS */}
          {/* <td className="px-5 py-5 border-b border-gray-200 text-sm">
            <p className="flex text-gray-900 whitespace-no-wrap justify-center">
              <FiEdit
                size={17}
                className="text-teal-500 hover:text-teal-700 mx-2 cursor-pointer"
                onClick={() => handleViewSupplierProduct(orderProduct.id)}
                title="View Supplier Product"
              />
            </p>
          </td> */}
          <td className="px-5 py-5 border-b border-gray-200 text-sm">
  <div className="flex justify-center">
    <span
      onClick={() => handleViewSupplierProduct(orderProduct.id)}
      className="bg-green-100 text-green-800 text-[10px] font-medium px-2.5 py-1 rounded
                 dark:bg-gray-700 dark:text-green-400 border border-green-400
                 cursor-pointer w-[120px] text-center hover:bg-green-200"
    >
      VIEW PRODUCT
    </span>
  </div>
</td>

        </tr>
      );
    });
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Kani Suppliers" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:bg-boxdark mb-6">
        <div className="flex justify-between items-center border-b border-stroke dark:border-strokedark py-4 px-6">
          <div>
            <h3 className="text-xl font-medium text-slate-500 dark:text-white">
              Kani Suppliers
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {pagination.totalItems > 0 ? (
                <>
                  Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}-
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} 
                  of {pagination.totalItems} suppliers
                  {useClientPagination && (
                    <span className="ml-2 text-xs text-yellow-600"></span>
                  )}
                </>
              ) : (
                "No suppliers found"
              )}
            </p>
          </div>
        </div>

        <div className="my-6 px-6 sm:px-10 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-slate-300 dark:bg-slate-700 dark:text-white">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center">SNO</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center">Supplier Name</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center">Supplier Quantity</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center">Product Group</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody>{renderTableRows()}</tbody>
            </table>
            
            {/* Pagination Component - Only show if we have more than one page */}
            {pagination.totalPages > 1 && (
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

export default FilterSupplier;