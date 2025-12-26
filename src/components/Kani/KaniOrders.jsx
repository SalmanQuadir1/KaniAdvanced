import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Pagination from "../../components/Pagination/Pagination";
import { GET_Kani_URL, GET_IMAGE } from "../../Constants/utils";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const KaniOrders = () => {
  const [allFlattenedProducts, setAllFlattenedProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const navigate = useNavigate();
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 0,
    totalItems: 0
  });

  const { currentUser } = useSelector((state) => state?.persisted?.user || {});
  const token = currentUser?.token;

  // Try with different approaches
  useEffect(() => {
    // Try approach 1: Fetch without pagination first
    fetchKaniOrdersWithoutPagination();
  }, []);

  // Update displayed products when page changes or when all data changes
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

  // Function to flatten order products
  const flattenOrderProducts = (ordersData) => {
    const flattened = [];
    
    ordersData.forEach(order => {
      if (order.orderProducts && Array.isArray(order.orderProducts)) {
        order.orderProducts.forEach(orderProduct => {
          flattened.push({
            ...orderProduct,
            orderInfo: {
              orderNo: order.orderNo,
              orderDate: order.orderDate,
              orderType: order.orderType,
              customer: order.customer,
            }
          });
        });
      }
    });
    
    return flattened;
  };

  const handleUpdate = (e, orderProduct) => {
    e.preventDefault();

    const orderProductId = orderProduct?.id;

    if (!orderProductId) {
      toast.error("Order Product ID not found");
      return;
    }

    navigate(`/UpdateKani/${orderProductId}`);
  };

  // APPROACH 1: Try fetching without any pagination parameters
  const fetchKaniOrdersWithoutPagination = async () => {
    console.log("fetchKaniOrdersWithoutPagination called");

    if (!token) {
      toast.error("No access token found. Please login.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching Kani orders WITHOUT pagination...");
      
      // Try without any parameters first
      const apiUrl = `${GET_Kani_URL}`;
      console.log("API URL:", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Response status:", response.status);
        
        // If 500 error with no params, try with default params
        if (response.status === 500) {
          console.log("Trying with default page parameters...");
          await fetchKaniOrdersWithDefaultParams();
          return;
        }
        
        throw new Error(`Failed to fetch Kani Orders: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Data received from API:", data);
      handleApiResponse(data);
      
    } catch (err) {
      console.error("Error fetching Kani orders:", err);
      setError(err.message);
      toast.error(err.message || "Failed to load Kani orders");
    } finally {
      setLoading(false);
    }
  };

  // APPROACH 2: Try with default page parameters (page=0, size=10)
  const fetchKaniOrdersWithDefaultParams = async () => {
    try {
      console.log("Fetching Kani orders WITH default pagination...");
      
      const apiUrl = `${GET_Kani_URL}?page=0&size=10`;
      console.log("API URL:", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed with pagination: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Data received from API (with params):", data);
      handleApiResponse(data);
      
    } catch (err) {
      console.error("Error with paginated fetch:", err);
      
      // Last resort: Try a different approach
      await fetchKaniOrdersLastResort();
    }
  };

  // APPROACH 3: Last resort - try different parameter combinations
  const fetchKaniOrdersLastResort = async () => {
    try {
      console.log("Trying last resort approach...");
      
      // Try without size parameter
      const apiUrl = `${GET_Kani_URL}?page=0`;
      console.log("API URL (page only):", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Data received (page only):", data);
        handleApiResponse(data);
        return;
      }
      
      // If still failing, show error
      throw new Error("All fetch attempts failed");
      
    } catch (err) {
      console.error("All fetch attempts failed:", err);
      setError("Unable to load orders. Please check API configuration.");
      toast.error("Unable to load orders. Please contact administrator.");
    }
  };

  // Handle API response data
  const handleApiResponse = (data) => {
    let ordersArray = [];
    let flattened = [];
    
    // Check different response formats
    if (Array.isArray(data)) {
      // Direct array response
      ordersArray = data;
      flattened = flattenOrderProducts(data);
    } else if (data?.content && Array.isArray(data.content)) {
      // Paginated response structure
      ordersArray = data.content;
      flattened = flattenOrderProducts(data.content);
    } else {
      console.warn("Unexpected data format:", data);
      ordersArray = [];
      flattened = [];
    }
    
    setOrders(ordersArray);
    setAllFlattenedProducts(flattened);
    
    // Calculate pagination based on flattened products
    const totalItems = flattened.length;
    const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
    
    setPagination(prev => ({
      ...prev,
      currentPage: 1, // Always start at page 1
      totalPages: totalPages,
      totalItems: totalItems
    }));
    
    console.log(`Total orders: ${ordersArray.length}`);
    console.log(`Total flattened products: ${flattened.length}`);
    console.log(`Total pages needed: ${totalPages}`);
  };

  // Page change handler
  const handlePageChange = (page) => {
    console.log(`Changing page from ${pagination.currentPage} to ${page}`);
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // Calculate starting index for serial numbers
  const getStartingSerialNumber = () => {
    return (pagination.currentPage - 1) * pagination.itemsPerPage + 1;
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

  // Function to open image modal
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

  const renderTableRows = () => {
    if (loading) {
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

    if (displayedProducts.length === 0 && !loading) {
      return (
        <tr>
          <td colSpan="9" className="text-center py-6">
            No order products found
          </td>
        </tr>
      );
    }

    const startingSerialNumber = getStartingSerialNumber();

    return displayedProducts.map((orderProduct, index) => {
      const product = orderProduct.products;
      
      // Get images from the product
      const { referenceImage, actualImage } = getProductImages(product);
      const refImageUrl = getImageUrl(referenceImage);
      const actImageUrl = getImageUrl(actualImage);
      
      // Get all images for the product
      const productImages = product?.images || [];

      return (
        <tr key={`${orderProduct.orderInfo?.orderNo}-${orderProduct.id || index}`} 
            className="bg-white dark:bg-boxdark hover:bg-gray-50 dark:hover:bg-gray-800">
          <td className="px-4 py-3 border-b text-center">{startingSerialNumber + index}</td>
          <td className="px-4 py-3 border-b text-center font-medium">
            {orderProduct.orderInfo?.orderNo || "-"}
          </td>

          <td className="px-4 py-3 border-b text-center font-medium">
            {product?.productId || "-"}
          </td>
          <td className="px-4 py-3 border-b">
            {product?.productGroup?.productGroupName || "-"}
          </td>
          <td className="px-4 py-3 border-b">
            {product?.productCategory?.productCategoryName || "-"}
          </td>
       
          <td className="px-4 py-3 border-b">
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

          <td className="px-4 py-3 border-b">
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
          
          <td className="px-4 py-3 border-b">
            <div className="flex justify-center">
              <span 
                onClick={() => openImageModal(productImages)}
                className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-pointer hover:bg-green-200 dark:hover:bg-gray-600 transition-colors"
              >
                VIEW 
              </span>
            </div>
          </td>
          
          <td className="px-5 py-5 border-b border-gray-200 text-sm">
            <p className="flex text-gray-900 whitespace-no-wrap">
              <FiEdit
                size={17}
                className="text-teal-500 hover:text-teal-700 mx-2 cursor-pointer"
                onClick={(e) => handleUpdate(e, orderProduct)}
                title="Edit Product"
              />
            </p>
          </td>
        </tr>
      );
    });
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
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
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
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
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

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Kani Orders" />

      {/* Images Modal */}
      {renderImagesModal()}

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:bg-boxdark mb-6">
        <div className="flex justify-between items-center border-b border-stroke dark:border-strokedark py-4 px-6">
          <div>
            <h3 className="text-xl font-medium text-slate-500 dark:text-white">
              Kani Orders
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {pagination.totalItems > 0 ? (
                <>
                  Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}-
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} 
                  of {pagination.totalItems} order products
                </>
              ) : (
                "No order products found"
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
            {pagination.totalPages > 0 && (
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

export default KaniOrders;