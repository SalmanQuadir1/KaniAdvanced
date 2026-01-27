import React, { useEffect, useState,useRef } from "react";

import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Pagination from "../../components/Pagination/Pagination";
import { GET_Kani_URL } from "../../Constants/utils";
import { useNavigate } from "react-router-dom";

const FilterSupplier = () => {
  const [allFlattenedProducts, setAllFlattenedProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useClientPagination, setUseClientPagination] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });



  const navigate = useNavigate();

  const handleViewSupplierProduct = (productId) => {
    navigate(`/supplier-product/view/${productId}`);
  };

  const handleAddProduct = (id) => {
  navigate(`/UpdateKaniProducts/${id}`);
};


  // Add new handler for supplier navigation
  const handleViewSupplier = (supplierId) => {
    if (supplierId) {
      navigate(`/supplier-order/${supplierId}`);
    } else {
      toast.error("Supplier ID not found");
    }
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

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setOpenDropdownId(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


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
          // Get supplier from productSuppliers array
          supplier: orderProduct?.productSuppliers?.[0]?.supplier || orderProduct?.products?.supplierCode
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

 const openUpdateChallan = (event, id) => {
  const rect = event.currentTarget.getBoundingClientRect();

  setDropdownPos({
    top: rect.bottom + window.scrollY,
    left: rect.left + rect.width / 2,
  });

  setOpenDropdownId(id);
};


const closeUpdateChallan = () => {
  setOpenDropdownId(null);
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

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    } catch (error) {
      return dateString; // Return as-is if parsing fails
    }
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('closed')) return 'bg-green-100 text-green-800';
    if (statusLower.includes('pending')) return 'bg-yellow-100 text-yellow-800';
    if (statusLower.includes('progress') || statusLower.includes('in progress')) return 'bg-blue-100 text-blue-800';
    if (statusLower.includes('partial')) return 'bg-orange-100 text-orange-800';
    if (statusLower.includes('cancel')) return 'bg-red-100 text-red-800';
    if (statusLower.includes('created')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const renderTableRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="10" className="text-center py-6">
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
          <td colSpan="10" className="text-center py-6 text-red-500">
            {error}
          </td>
        </tr>
      );
    }

    if (displayedProducts.length === 0 && !loading) {
      return (
        <tr>
          <td colSpan="10" className="text-center py-6">
            No supplier data found
          </td>
        </tr>
      );
    }

    const startingSerialNumber = getStartingSerialNumber();

    return displayedProducts.map((orderProduct, index) => {
      // Try to get supplier details from multiple possible locations
      const supplierFromSuppliers = orderProduct?.productSuppliers?.[0]?.supplier;
      const supplierFromProducts = orderProduct?.products?.supplierCode;
      const supplier = supplierFromSuppliers || supplierFromProducts || {};
      
      // Get supplier ID from the supplier object
      const supplierId = supplier?.id;
      
      // Get supplier order quantity
      const supplierOrderQty = orderProduct?.productSuppliers?.[0]?.supplierOrderQty || 0;
      
      // Get the fields directly from orderProduct (from your console data)
      const productStatus = orderProduct?.productStatus; // Direct from orderProduct
      const expectedDate = orderProduct?.expectedDate; // Direct from orderProduct
      const challanNo = orderProduct?.challanNo; // Direct from orderProduct
      const receivedDate = orderProduct?.receivedDate; // Direct from orderProduct
      const productId = orderProduct?.products?.productId; // Product ID from products object
      const orderNo = orderProduct?.orderInfo?.orderNo; // Get Order No from orderInfo

      return (
        <tr
          key={orderProduct.id || index}
          className="bg-white dark:bg-boxdark hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          {/* SNO */}
          <td className="px-4 py-3 border-b text-center">
            {startingSerialNumber + index}
          </td>

          {/* ORDER NO - ADDED THIS COLUMN */}
          <td className="px-4 py-3 border-b text-center">
            {orderNo ? (
              <span className="text-gray-800 dark:text-gray-300 font-medium bg-blue-50 dark:bg-gray-800 px-2 py-1 rounded">
                {orderNo}
              </span>
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </td>

          {/* PRODUCT ID */}
          <td className="px-4 py-3 border-b text-center">
            {productId ? (
              <span className="text-gray-800 dark:text-gray-300 font-medium">
                {productId}
              </span>
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </td>

          {/* SUPPLIER NAME - Clickable but normal appearance */}
          <td className="px-4 py-3 border-b text-center">
            {supplier?.name || supplier?.supplierName ? (
              <span
                onClick={() => handleViewSupplier(supplierId)}
                className="text-gray-800 dark:text-gray-300 font-medium cursor-pointer hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-200"
                title="Click to view supplier details"
              >
                {supplier?.name || supplier?.supplierName}
              </span>
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </td>

          {/* SUPPLIER QUANTITY */}
          <td className="px-4 py-3 border-b text-center">
            {supplierOrderQty > 0 ? supplierOrderQty : (
              <span className="text-gray-400">0</span>
            )}
          </td>

          {/* CHALLAN NO  */}
  {/* <td className="px-4 py-3 border-b text-center">
    {orderProduct?.challanNo ? (
      <span className="text-gray-800 dark:text-gray-300 font-medium bg-yellow-50 dark:bg-gray-800 px-2 py-1 rounded">
        {orderProduct.challanNo}
      </span>
    ) : (
      <span className="text-gray-400">—</span>
    )}
  </td> */}
  <td
 className="px-4 py-3 border-b text-center cursor-pointer"
  onClick={(e) => openUpdateChallan(e, orderProduct.id)}
>
  {orderProduct?.challanNo ? (
    <span className="bg-yellow-50 px-2 py-1 rounded">
      {orderProduct.challanNo}
    </span>
  ) : (
    <span className="text-gray-400">—</span>
  )}
  

  {/* Dropdown */}
  {openDropdownId === orderProduct.id && (
    <div
      ref={dropdownRef}
      className="
        fixed
        absolute left-1/2 -translate-x-1/2
        mt-2
        w-70
        bg-white
        border border-gray-200
        rounded-md
        shadow-lg
        z-50
      "
      onClick={(e) => e.stopPropagation()} // prevents close on click inside
    >
      {/* Header */}
      <div className="px-4 py-2 border-b text-[12px] font-medium text-gray-700 flex justify-between">
        <span>Update Challan</span>
        <span
          onClick={closeUpdateChallan}
          className="cursor-pointer text-gray-400 hover:text-gray-600"
        >
          ✕
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-2">
        <label className="block text-[11px] text-gray-600">
          Challan No
        </label>

        <input
          type="text"
          defaultValue={orderProduct?.challanNo || ""}
          placeholder="Enter challan no"
          className="
            w-full
            border border-gray-300
            rounded
            px-2 py-1
            text-[11px]
            focus:outline-none
            focus:ring-1 focus:ring-blue-400
          "
        />

        <button
          className="
            w-full
            mt-2
            bg-blue-600
            text-white
            text-[11px]
            py-1.5
            rounded
            hover:bg-blue-700
            transition
          "
        >
          Update
        </button>
      </div>
    </div>
  )}
</td>


          {/* PRODUCT STATUS */}
          <td className="px-4 py-3 border-b text-center">
            {productStatus ? (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(productStatus)}`}>
                {productStatus}
              </span>
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </td>

          {/* PRODUCT GROUP */}
          <td className="px-4 py-3 border-b text-center">
            {orderProduct?.products?.productGroup?.productGroupName || (
              <span className="text-gray-400">—</span>
            )}
          </td>

          {/* ACTIONS */}
          <td className="px-4 py-3 border-b text-center">
            <span
              onClick={() => handleViewSupplierProduct(orderProduct.id)}
              className="inline-block bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded
                         dark:bg-gray-700 dark:text-green-400 border border-green-400
                         cursor-pointer hover:bg-green-200 transition-colors duration-200"
            >
              VIEW PRODUCT
            </span>

           <span
                onClick={() => handleAddProduct(orderProduct.id)}
                className="inline-block mt-2 bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded
                          dark:bg-gray-700 dark:text-green-400 border border-green-400
                          cursor-pointer hover:bg-green-200 transition-colors duration-200"
              >
                ADD PRODUCT
              </span>

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
  
  {/* In Progress Button */}
  <div>
<button
    type="button"
    onClick={() => navigate("/kani-in-progress")} // or your specific path
    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 transition"
  >
    In Progress Orders
  </button>
          </div>
</div>

        <div className="my-6 px-6 sm:px-10 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-slate-300 dark:bg-slate-700 dark:text-white">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center">SNO</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center">Order No</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center">Product ID</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center">Supplier Name</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center">Supplier Qty</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center">Challan No</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center">Status</th>
                  {/* <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center">Expected Date</th> */}
                  {/* <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center">Received Date</th> */}
                  
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