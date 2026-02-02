import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Pagination from "../../components/Pagination/Pagination";
import { GET_SUPPLIER_ORDERS_URL, GET_IMAGE } from "../../Constants/utils";
import { FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from 'react-router-dom';

const SupplierOrder = () => {
  const { id: supplierId } = useParams();
  const navigate = useNavigate();
  
  const [allOrders, setAllOrders] = useState([]); // Store all fetched orders
  const [filteredOrders, setFilteredOrders] = useState([]); // Orders filtered by supplier
  const [displayedOrders, setDisplayedOrders] = useState([]); // Paginated and grouped orders
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  
  const [pagination, setPagination] = useState({
    currentPage: 0,
    itemsPerPage: 10,
    totalPages: 0,
    totalItems: 0
  });

  const { currentUser } = useSelector((state) => state?.persisted?.user || {});
  const token = currentUser?.token;

  // Fetch orders when page changes OR when supplierId changes
  useEffect(() => {
    if (supplierId) {
      fetchKaniOrders();
    }
  }, [pagination.currentPage, pagination.itemsPerPage, supplierId]);

  // Filter orders by supplierId whenever allOrders or supplierId changes
  useEffect(() => {
    if (allOrders.length > 0 && supplierId) {
      filterOrdersBySupplier();
    }
  }, [allOrders, supplierId]);

  // Filter and paginate whenever filteredOrders or pagination changes
  useEffect(() => {
    if (filteredOrders.length > 0) {
      paginateAndGroupOrders();
    } else {
      setDisplayedOrders([]);
      setPagination(prev => ({ ...prev, totalPages: 0, totalItems: 0 }));
    }
  }, [filteredOrders, pagination.currentPage, pagination.itemsPerPage]);

  // Function to filter orders by supplier ID
  const filterOrdersBySupplier = () => {
    if (!supplierId || !allOrders.length) {
      setFilteredOrders([]);
      return;
    }

    const numericSupplierId = Number(supplierId);
    
    const filtered = allOrders.filter(order => {
      // Check if any orderProduct has this supplier
      return order.orderProducts?.some(orderProduct => {
        // Check product's supplierCode
        if (orderProduct.products?.supplierCode?.id === numericSupplierId) {
          return true;
        }
        
        // Check productSuppliers array
        if (orderProduct.productSuppliers?.some(ps => ps.supplier?.id === numericSupplierId)) {
          return true;
        }
        
        return false;
      });
    });

    console.log(`Filtered ${allOrders.length} orders to ${filtered.length} orders for supplier ${supplierId}`);
    setFilteredOrders(filtered);
    
    // Update total items count
    setPagination(prev => ({
      ...prev,
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / prev.itemsPerPage)
    }));
  };

  // Function to group and paginate filtered orders
  const paginateAndGroupOrders = () => {
    // Calculate pagination indices
    const startIndex = pagination.currentPage * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    
    // Get current page data
    const currentPageData = filteredOrders.slice(startIndex, endIndex);
    
    // Group orders by orderNo
    const groupedOrders = groupOrdersByOrderNo(currentPageData);
    
    setDisplayedOrders(groupedOrders);
    console.log(`Displaying ${groupedOrders.length} grouped orders on page ${pagination.currentPage + 1}`);
  };

  // Function to group orders by order number
  const groupOrdersByOrderNo = (ordersData) => {
    const groupedOrders = {};
    
    if (!Array.isArray(ordersData)) {
      return [];
    }
    
    ordersData.forEach(order => {
      const orderNo = order.orderNo;
      
      if (!groupedOrders[orderNo]) {
        groupedOrders[orderNo] = {
          orderNo: orderNo,
          orderDate: order.orderDate,
          shippingDate: order.shippingDate,
          tagsAndLabels: order.tagsAndLabels,
          orderType: order.orderType,
          customer: order.customer,
          status: order.status,
          products: []
        };
      }
      
      // Filter order products to only include those related to the selected supplier
      if (order.orderProducts && Array.isArray(order.orderProducts)) {
        const numericSupplierId = Number(supplierId);
        
        order.orderProducts.forEach(orderProduct => {
          // Check if this orderProduct belongs to the selected supplier
          const belongsToSupplier = 
            orderProduct.products?.supplierCode?.id === numericSupplierId ||
            orderProduct.productSuppliers?.some(ps => ps.supplier?.id === numericSupplierId);
          
          if (belongsToSupplier) {
            groupedOrders[orderNo].products.push({
              ...orderProduct,
              orderInfo: {
                orderNo: order.orderNo,
                orderDate: order.orderDate,
                shippingDate: order.shippingDate,
                orderType: order.orderType,
                customer: order.customer,
                status: order.status
              }
            });
          }
        });
      }
    });
    
    // Remove orders that have no products after filtering
    const filteredGroupedOrders = Object.values(groupedOrders).filter(
      order => order.products && order.products.length > 0
    );
    
    return filteredGroupedOrders;
  };

  const handleUpdate = (e, orderProduct, orderNo) => {
    e.preventDefault();
    const orderProductId = orderProduct?.id;

    if (!orderProductId) {
      toast.error("Order Product ID not found");
      return;
    }

    navigate(`/UpdateKani/${orderProductId}`);
  };

  // FIXED: Fetch orders WITH supplierId in URL
  const fetchKaniOrders = async () => {
    console.log("Fetching orders for supplier:", supplierId);

    if (!token) {
      toast.error("No access token found. Please login.");
      return;
    }

    if (!supplierId) {
      toast.error("No supplier ID found in URL.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // FIXED: Include supplierId in the URL
      const apiUrl = `${GET_SUPPLIER_ORDERS_URL}/${supplierId}?page=${pagination.currentPage}&size=${pagination.itemsPerPage}`;
      console.log("Fetching from correct URL:", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // If 404, try without pagination first
        if (response.status === 404) {
          console.log("Trying without pagination...");
          const apiUrlWithoutPagination = `${GET_SUPPLIER_ORDERS_URL}/${supplierId}`;
          const response2 = await fetch(apiUrlWithoutPagination, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          
          if (response2.ok) {
            const data = await response2.json();
            handleApiResponse(data);
            return;
          }
        }
        throw new Error(`Failed to fetch orders: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response received");
      
      // Handle the API response
      handleApiResponse(data);
      
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message);
      toast.error(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // New function to handle API response
  const handleApiResponse = (data) => {
    console.log("Handling API response:", data);
    
    let ordersArray = [];
    
    // Check if this is a Spring Data paginated response
    if (data.content && Array.isArray(data.content)) {
      console.log("Detected Spring Data paginated response");
      ordersArray = data.content;
      
      // Extract pagination info from Spring Data response
      const totalItems = data.totalElements || 0;
      const totalPages = data.totalPages || 0;
      
      console.log(`Pagination info: totalElements=${totalItems}, totalPages=${totalPages}`);
      
      setPagination(prev => ({
        ...prev,
        totalPages: totalPages,
        totalItems: totalItems
      }));
      
    } else if (Array.isArray(data)) {
      // Direct array response (no pagination from backend)
      console.log("Detected direct array response");
      ordersArray = data;
      
      // Update total items count
      const totalItems = ordersArray.length;
      const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
      
      setPagination(prev => ({
        ...prev,
        totalPages: totalPages,
        totalItems: totalItems
      }));
      
    } else if (data.data && Array.isArray(data.data)) {
      // Another common API response format
      console.log("Detected data.data array response");
      ordersArray = data.data;
      
      const totalItems = data.total || ordersArray.length;
      const totalPages = data.totalPages || Math.ceil(totalItems / pagination.itemsPerPage);
      
      setPagination(prev => ({
        ...prev,
        totalPages: totalPages,
        totalItems: totalItems
      }));
      
    } else {
      console.warn("Unexpected data format:", data);
      ordersArray = [];
      setPagination(prev => ({
        ...prev,
        totalPages: 0,
        totalItems: 0
      }));
    }
    
    // Store all orders (API already filtered by supplier)
    setAllOrders(ordersArray);
  };

  // Page change handler
  const handlePageChange = (page) => {
    console.log(`Changing page from ${pagination.currentPage + 1} to ${page}`);
    setPagination(prev => ({ ...prev, currentPage: page - 1 }));
  };

  // Calculate starting index for serial numbers (1-based for display)
  const getStartingSerialNumber = () => {
    return (pagination.currentPage * pagination.itemsPerPage) + 1;
  };

  // Calculate ending index for display
  const getEndingSerialNumber = () => {
    const start = getStartingSerialNumber();
    return Math.min(start + displayedOrders.length - 1, pagination.totalItems);
  };

  // Function to get images from the product
  const getProductImages = (product) => {
    if (!product || !product.images || !Array.isArray(product.images)) {
      return { referenceImage: null, actualImage: null };
    }

    let referenceImage = null;
    let actualImage = null;

    product.images.forEach(image => {
      if (image.referenceImage && !referenceImage) {
        referenceImage = image.referenceImage;
      }
      if (image.actualImage && !actualImage) {
        actualImage = image.actualImage;
      }
    });

    return { referenceImage, actualImage };
  };

  // Function to open image modal for a specific product
  const openImageModal = (images) => {
    console.log("Opening image modal with:", images);
    setSelectedImages(images || []);
    setIsImagesModalOpen(true);
  };

  // Function to close image modal
  const closeImageModal = () => {
    setIsImagesModalOpen(false);
    setSelectedImages([]);
  };

  // Function to build image URL
  const getImageUrl = (filename) => {
    if (!filename) return null;
    
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      return filename;
    }
    
    return `${GET_IMAGE}/products/getimages/${filename}`;
  };

  // Simple SVG placeholder
  const getPlaceholder = (text = "No Image") => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56">
        <rect width="56" height="56" fill="#f3f4f6" rx="4"/>
        <text x="50%" y="50%" font-family="Arial" font-size="10" fill="#9ca3af" text-anchor="middle" dy=".3em">
          ${text}
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  // Render product details for each order product in the same row
  const renderOrderProducts = (order, orderIndex) => {
    if (!order.products || order.products.length === 0) {
      return (
        <tr key={`${order.orderNo}-empty`} className="bg-white dark:bg-boxdark">
          <td className="px-4 py-3 border-b text-center">{getStartingSerialNumber() + orderIndex}</td>
          <td className="px-4 py-3 border-b text-center font-medium">{order.orderNo}</td>
          <td colSpan="7" className="px-4 py-3 border-b text-center text-gray-500">
            No products found for this order
          </td>
        </tr>
      );
    }

    return order.products.map((orderProduct, productIndex) => {
      const product = orderProduct.products;
      
      if (!product) {
        console.warn("No product data for orderProduct:", orderProduct);
        return null;
      }
      
      // Get images from the product
      const { referenceImage, actualImage } = getProductImages(product);
      const refImageUrl = getImageUrl(referenceImage);
      const actImageUrl = getImageUrl(actualImage);
      
      // Get all images for the product
      const productImages = product?.images || [];

      // Determine border classes - only show bottom border for the last product in the order
      const isLastProduct = productIndex === order.products.length - 1;
      const borderClass = isLastProduct ? "border-b" : "border-b-0";
      
      return (
        <tr key={`${order.orderNo}-${orderProduct.id || productIndex}`} 
            className={`bg-white dark:bg-boxdark hover:bg-gray-50 dark:hover:bg-gray-800 ${
              productIndex > 0 ? "border-t-0" : ""
            }`}>
          {/* Only show order number for the first product in the order */}
          {productIndex === 0 ? (
            <>
              <td rowSpan={order.products.length} className="px-4 py-3 border-b text-center align-middle">
                {getStartingSerialNumber() + orderIndex}
              </td>
              <td rowSpan={order.products.length} className="px-4 py-3 border-b text-center font-medium align-middle">
                {order.orderNo}
              </td>
            </>
          ) : null}
          
          <td className={`px-4 py-3 ${borderClass} text-center font-medium`}>
            {product?.productId || "-"}
          </td>
          <td className={`px-4 py-3 ${borderClass}`}>
            {product?.productGroup?.productGroupName || "-"}
          </td>
          <td className={`px-4 py-3 ${borderClass}`}>
            {product?.productCategory?.productCategoryName || "-"}
          </td>
       
          <td className={`px-4 py-3 ${borderClass}`}>
            <div className="flex justify-center">
              {refImageUrl ? (
                <div className="relative group">
                  <img
                    src={refImageUrl}
                    alt="Reference"
                    className="h-12 w-12 rounded-full object-cover border shadow-sm transition-transform duration-500 ease-in-out transform group-hover:scale-[2] group-hover:shadow-2xl"
                    crossOrigin="use-credentials"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getPlaceholder("Ref");
                    }}
                  />
                </div>
              ) : (
                <div className="h-12 w-12 rounded-full border border-dashed border-gray-300 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No Ref</span>
                </div>
              )}
            </div>
          </td>

          <td className={`px-4 py-3 ${borderClass}`}>
            <div className="flex justify-center">
              {actImageUrl ? (
                <div className="relative group">
                  <img
                    src={actImageUrl}
                    alt="Actual"
                    className="h-12 w-12 rounded-full object-cover border shadow-sm transition-transform duration-500 ease-in-out transform group-hover:scale-[2] group-hover:shadow-2xl"
                    crossOrigin="use-credentials"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getPlaceholder("Act");
                    }}
                  />
                </div>
              ) : (
                <div className="h-12 w-12 rounded-full border border-dashed border-gray-300 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No Act</span>
                </div>
              )}
            </div>
          </td>
          
          <td className={`px-4 py-3 ${borderClass}`}>
            <div className="flex justify-center">
              <span 
                onClick={() => openImageModal(productImages)}
                className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-pointer hover:bg-green-200 dark:hover:bg-gray-600 transition-colors"
              >
                VIEW 
              </span>
            </div>
          </td>
          
          <td className={`px-5 py-5 ${borderClass} border-gray-200 text-sm`}>
            <p className="flex text-gray-900 whitespace-no-wrap">
              <FiEdit
                size={17}
                className="text-teal-500 hover:text-teal-700 mx-2 cursor-pointer"
                onClick={(e) => handleUpdate(e, orderProduct, order.orderNo)}
                title="Edit Product"
              />
            </p>
          </td>
        </tr>
      );
    }).filter(Boolean); // Filter out any null entries
  };

  const renderTableRows = () => {
    if (loading && allOrders.length === 0) {
      return (
        <tr>
          <td colSpan="9" className="text-center py-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading orders...</span>
            </div>
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan="9" className="text-center py-6 text-red-500">
            {error}
          </td>
        </tr>
      );
    }

    if (displayedOrders.length === 0 && !loading) {
      return (
        <tr>
          <td colSpan="9" className="text-center py-6">
            No orders found for this supplier
          </td>
        </tr>
      );
    }

    const rows = [];
    displayedOrders.forEach((order, orderIndex) => {
      const productRows = renderOrderProducts(order, orderIndex);
      rows.push(...productRows);
    });

    return rows;
  };

  // Render Images Modal
  const renderImagesModal = () => {
    if (!isImagesModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-95 flex justify-center items-center z-50">
        <div className="bg-slate-100 border border-b-1 rounded p-6 shadow-lg w-[90%] max-w-[900px] max-h-[75vh] overflow-auto dark:bg-slate-600">
          <div className="text-right">
            <button 
              onClick={closeImageModal} 
              className="text-red-500 text-xl font-bold hover:text-red-700"
            >
              &times;
            </button>
          </div>
          <h2 className="text-2xl text-center mb-4 font-extrabold">LIST OF IMAGES</h2>

          {/* Reference Images Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-green-700 dark:text-green-400">Reference Images</h3>
            <div className="flex flex-wrap gap-4 py-2">
              {selectedImages.map((image, index) => {
                if (image?.referenceImage) {
                  return (
                    <div key={index} className="relative group">
                      <img
                        className="h-[180px] w-[180px] rounded-lg object-cover border shadow-md transition-transform duration-300 ease-in-out group-hover:scale-105"
                        crossOrigin="use-credentials"
                        src={`${GET_IMAGE}/products/getimages/${image.referenceImage}`}
                        alt={`Reference ${index + 1}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getPlaceholder("Ref");
                        }}
                      />
                      <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 py-[1px] rounded-sm">
                        Ref {index + 1}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
              {!selectedImages.some(img => img?.referenceImage) && (
                <div className="w-full text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No reference images available</p>
                </div>
              )}
            </div>
          </div>

          {/* Actual Images Section */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-3 text-blue-700 dark:text-blue-400">Actual Images</h3>
            <div className="flex flex-wrap gap-4 py-2">
              {selectedImages.map((image, index) => {
                if (image?.actualImage) {
                  return (
                    <div key={index} className="relative group">
                      <img
                        className="h-[180px] w-[180px] rounded-lg object-cover border shadow-md transition-transform duration-300 ease-in-out group-hover:scale-105"
                        crossOrigin="use-credentials"
                        src={`${GET_IMAGE}/products/getimages/${image.actualImage}`}
                        alt={`Actual ${index + 1}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getPlaceholder("Act");
                        }}
                      />
                      <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 py-[1px] rounded-sm">
                        Act {index + 1}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
              {!selectedImages.some(img => img?.actualImage) && (
                <div className="w-full text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No actual images available</p>
                </div>
              )}
            </div>
          </div>

          {/* Total Count */}
          <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-700">
            <p className="text-center text-gray-600 dark:text-gray-400">
              Total Images: {selectedImages.length} 
              (Reference: {selectedImages.filter(img => img?.referenceImage).length}, 
              Actual: {selectedImages.filter(img => img?.actualImage).length})
            </p>
          </div>
        </div>
      </div>
    );
  };

  // If no supplier is selected
  if (!supplierId) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Supplier Orders" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:bg-boxdark p-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Invalid Supplier URL
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              No supplier ID found in the URL.
            </p>
            <button
              type="button"
              onClick={() => navigate("/filter-suppliers")}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 transition"
            >
              Select Supplier
            </button>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Supplier Orders" />

      {/* Images Modal */}
      {renderImagesModal()}

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:bg-boxdark mb-6">
        <div className="flex justify-between items-center border-b border-stroke dark:border-strokedark py-4 px-6">
          <div>
            <h3 className="text-xl font-medium text-slate-500 dark:text-white">
              Orders for Supplier 
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {loading && allOrders.length === 0 ? (
                "Loading orders..."
              ) : pagination.totalItems > 0 ? (
                <>
                  Showing {getStartingSerialNumber()}-
                  {getEndingSerialNumber()} 
                  of {pagination.totalItems} orders
                  {/* <span className="ml-2 text-blue-600 dark:text-blue-400">
                    (from supplier #{supplierId})
                  </span> */}
                </>
              ) : (
                "No orders found for this supplier"
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate("/filter-suppliers")}
              className="inline-flex items-center gap-2 rounded-md bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Back to Suppliers
            </button>
            {/* <button
              type="button"
              onClick={() => {
                setAllOrders([]);
                setFilteredOrders([]);
                fetchKaniOrders();
              }}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 transition"
            >
              Refresh
            </button> */}
          </div>
        </div>

        <div className="my-6 px-6 sm:px-10 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-slate-300 dark:bg-slate-700 dark:text-white">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center">SNO</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center">ORDER No</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center">PRODUCT ID</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">PRODUCT GROUP</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">CATEGORY</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center">REF IMAGE</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center">ACT IMAGE</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center">ALL IMAGES</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>{renderTableRows()}</tbody>
            </table>
            
            {/* Add Pagination Component */}
            {pagination.totalPages > 1 && (
              <div className="mt-4">
                <Pagination 
                  totalPages={pagination.totalPages}
                  currentPage={pagination.currentPage + 1} // Convert to 1-based for UI display
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

export default SupplierOrder;