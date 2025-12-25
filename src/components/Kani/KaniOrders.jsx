import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Pagination from "../../components/Pagination/Pagination"; // Make sure to import Pagination
import { GET_Kani_URL, GET_IMAGE } from "../../Constants/utils";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const KaniOrders = () => {
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

  useEffect(() => {
    fetchKaniOrders(pagination.currentPage);
  }, [pagination.currentPage]);

  // const handleUpdate = (e, item) => {
  //       console.log(item, "jjhh");

  //       e.preventDefault();
  //       if (item && item.id) {
  //           navigate(`/UpdateKani`);
  //       } else {
  //           console.error("Item or its ID is missing");
  //       }
  //   };
//   const handleUpdate = (e, order) => {
//   e.preventDefault();

//   // If you just want to go to Update page
//   navigate("/UpdateKani");

//   // OR if you want to pass order id later:
//   // navigate(`/UpdateKani/${order.id}`);
// };

const handleUpdate = (e, order) => {
  e.preventDefault();

  const orderProductId = order?.orderProducts?.[0]?.id;

  if (!orderProductId) {
    toast.error("Order Product ID not found");
    return;
  }

  navigate(`/UpdateKani/${orderProductId}`);
};




  const fetchKaniOrders = async (page = 1) => {
    console.log("fetchKaniOrders called");

    if (!token) {
      toast.error("No access token found. Please login.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching Kani orders from API...");
      
      // Add pagination parameters to the URL
      const apiUrl = `${GET_Kani_URL}?page=${page - 1}&size=${pagination.itemsPerPage}`;
      
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch Kani Orders: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Data received from API:", data);

      // Handle paginated response
      if (data?.content) {
        setOrders(data.content);
        setPagination(prev => ({
          ...prev,
          currentPage: data.number + 1, // Convert 0-based to 1-based
          totalPages: data.totalPages,
          totalItems: data.totalElements
        }));
      } else if (Array.isArray(data)) {
        // Handle non-paginated response (backward compatibility)
        setOrders(data);
        setPagination(prev => ({
          ...prev,
          currentPage: 1,
          totalPages: Math.ceil(data.length / prev.itemsPerPage),
          totalItems: data.length
        }));
      } else {
        setOrders([]);
        setPagination(prev => ({
          ...prev,
          currentPage: 1,
          totalPages: 0,
          totalItems: 0
        }));
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Page change handler
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // Calculate starting index for serial numbers
  const getStartingSerialNumber = () => {
    return (pagination.currentPage - 1) * pagination.itemsPerPage + 1;
  };

  // Function to get images from the product
  const getProductImages = (order) => {
    if (!order || !order.orderProducts || !order.orderProducts[0]) {
      return { referenceImage: null, actualImage: null };
    }

    const product = order.orderProducts[0].products;
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

    if (orders.length === 0) {
      return (
        <tr>
          <td colSpan="9" className="text-center py-6">
            No orders found
          </td>
        </tr>
      );
    }

    const startingSerialNumber = getStartingSerialNumber();

    return orders.map((order, index) => {
      const product = order.orderProducts?.[0]?.products;
      
      // Get images from the product
      const { referenceImage, actualImage } = getProductImages(order);
      const refImageUrl = getImageUrl(referenceImage);
      const actImageUrl = getImageUrl(actualImage);
      
      // Get all images for the product
      const productImages = product?.images || [];

      return (
        <tr key={order.orderNo || index} className="bg-white dark:bg-boxdark hover:bg-gray-50 dark:hover:bg-gray-800">
          <td className="px-4 py-3 border-b text-center">{startingSerialNumber + index}</td>
          <td className="px-4 py-3 border-b text-center font-medium">
            {product?.productId || order.productId || "-"}
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
                      console.error(`Failed to load refImage: ${refImageUrl}`);
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
                      console.error(`Failed to load actImage: ${actImageUrl}`);
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
                                      onClick={(e) => handleUpdate(e, order)}
                                      title="Edit Product"
                                    />

                                  {/* <FiEdit size={17} className='text-teal-500 hover:text-teal-700 mx-2' onClick={(e) => handleUpdate(e, item)} title='Edit Product' />  | */}
                                  {/* <FiTrash2 size={17} className='text-red-500 hover:text-red-700 mx-2' onClick={(e) => handleDelete(e, item?.id)} title='Delete Product' /> */}
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
                          console.error(`Failed to load reference image: ${image.referenceImage}`);
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
                          console.error(`Failed to load actual image: ${image.actualImage}`);
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
              Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}-
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} 
              of {pagination.totalItems} orders
            </p>
          </div>
        </div>

        <div className="my-6 px-6 sm:px-10 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-slate-300 dark:bg-slate-700 dark:text-white">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center">SNO</th>
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