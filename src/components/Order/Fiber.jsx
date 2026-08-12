import React, { useState, useEffect, useRef } from 'react';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { FiEye, FiPrinter } from 'react-icons/fi';
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../Constants/utils';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Col, Row } from 'react-bootstrap';

const Fiber = () => {
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const navigate = useNavigate();

  const [orderProducts, setOrderProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });

  const [printData, setPrintData] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);

  // Fetch order products with pagination
  const fetchOrderProducts = async (page = 1) => {
    setLoading(true);
    try {
      const apiPage = page - 1;
      
      const response = await fetch(
        `${BASE_URL}/order/orderCategory/plainOrders?page=${apiPage}&size=10`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      console.log(data, 'kj');

      if (response.ok) {
        setOrderProducts(data.orders || []);
        setPagination({
          currentPage: page,
          totalPages: data.totalPages || 1,
          itemsPerPage: data.size || 10,
          totalItems: data.totalItems || 0,
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
    fetchOrderProducts(1);
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchOrderProducts(newPage);
    }
  };

  // Handle Print for specific row
  const handlePrintRow = (item) => {
    setPrintData(item);
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setIsPrinting(false);
        setPrintData(null);
      }, 1000);
    }, 500);
  };

  // Handle after print
  useEffect(() => {
    const handleAfterPrint = () => {
      setIsPrinting(false);
      setPrintData(null);
    };

    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  // Render table rows
  const renderTableRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="8" className="px-5 py-10 text-center">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">
                Loading...
              </span>
            </div>
          </td>
        </tr>
      );
    }

    if (orderProducts.length === 0) {
      return (
        <tr>
          <td
            colSpan="8"
            className="px-5 py-10 text-center text-gray-500 dark:text-gray-400"
          >
            No order products available
          </td>
        </tr>
      );
    }

    const startingSerialNumber =
      (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

    return orderProducts.map((item, index) => (
      <tr
        key={item.id || index}
        className="bg-white dark:bg-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
      >
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
          <p className="text-gray-900 dark:text-white whitespace-no-wrap">
            {startingSerialNumber + index}
          </p>
        </td>
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
          <span className="text-gray-900 dark:text-white whitespace-nowrap font-medium">
            {item.orderNo || 'N/A'}
          </span>
        </td>
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm whitespace-no-wrap tracking-wider">
          {item.orderProducts && item.orderProducts.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {item.orderProducts.map((product, idx) => (
                <span 
                  key={idx} 
                  className="text-gray-900 dark:text-white whitespace-nowrap"
                >
                  {product.productName || 'N/A'}
                  {idx < item.orderProducts.length - 1 && ', '}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-900 dark:text-white whitespace-nowrap">
              {item.productName || 'N/A'}
            </span>
          )}
        </td>
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
          {item.orderProducts?.map((product) => (
            <div key={product.id} className="flex flex-wrap gap-1">
              {product.plainOrderCategoryDetails?.length > 0 ? (
                product.plainOrderCategoryDetails?.map((fiber, idx) => (
                  <span 
                    key={idx} 
                    className="text-gray-900 dark:text-white whitespace-nowrap"
                  >
                    {fiber.fiberProductName}
                    {idx < product.plainOrderCategoryDetails.length - 1 && ', '}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 dark:text-gray-400">
                  No fibers assigned
                </span>
              )}
            </div>
          ))}
        </td>
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm tracking-wider whitespace-no-wrap">
          {item.orderProducts?.map((product) => (
            <div key={product.id} className="space-y-1">
              {product.plainOrderCategoryDetails?.map((fiber, idx) => (
                <div key={idx} className="text-gray-900 dark:text-white">
                  <span className="font-medium">{fiber.deductedInventoryQty || 0}</span>
                </div>
              ))}
            </div>
          ))}
        </td>
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm tracking-wider whitespace-no-wrap">
          {item.orderProducts?.map((product) => (
            <div key={product.id} className="flex flex-wrap gap-1">
              {product.plainOrderCategoryDetails?.map((fiber, idx) => (
                <span 
                  key={idx} 
                  className="text-gray-900 dark:text-white whitespace-nowrap"
                >
                  {fiber.locationName || 'N/A'}
                  {idx < product.plainOrderCategoryDetails.length - 1 && ', '}
                </span>
              ))}
            </div>
          ))}
        </td>
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm tracking-wider whitespace-no-wrap">
          {item.orderProducts?.map((product) => (
            <div key={product.id} className="inline-flex flex-wrap gap-1">
              {product.plainOrderCategoryDetails?.map((fiber, idx) => (
                <span 
                  key={idx} 
                  className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 whitespace-nowrap"
                >
                  {fiber.orderCategory || 'N/A'}
                </span>
              ))}
            </div>
          ))}
        </td>
        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePrintRow(item)}
              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
              title="Print Row"
            >
              <FiPrinter size={18} />
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  // Print Row Component
  const PrintRow = ({ data }) => {
    if (!data) return null;

    const fibers = data.orderProducts?.flatMap(
      (product) => product.plainOrderCategoryDetails || []
    ) || [];

    const getCompanyAddress = () => {
      const addresses = {
        delhi: {
          name: "Kashmir Loom Company Pvt Ltd",
          address: "C-65, Basement, Nizamuddin East, New Delhi",
          gstin: "07AABCK4463H1ZK",
          cin: "U74899DL2000PTC104407",
          contact: "+911146502902, 9810511952",
          email: "shop@kashmirloom.com",
          state: "Delhi",
          stateCode: "07"
        },
        srinagar: {
          name: "Kashmir Loom Company Pvt Ltd",
          address: "GULSHAN ANNEX, MUSKAN ROAD, LAL MANDI, SRINAGAR",
          gstin: "01AABCK4463H1ZW",
          cin: "U74899DL2000PTC104407",
          contact: "+911942313989, 9266577005",
          email: "shop@kashmirloom.com",
          state: "Jammu & Kashmir",
          stateCode: "01"
        }
      };

      const gstRegistration = fibers[0]?.locationName?.toLowerCase() || '';

      if (gstRegistration.includes('delhi')) {
        return addresses.delhi;
      } else if (gstRegistration.includes('srinagar')) {
        return addresses.srinagar;
      }

      return addresses.srinagar;
    };

    const companyAddress = getCompanyAddress();
    
    // Get first fiber for order info
    const firstFiber = fibers[0] || {};
    const orderDate = firstFiber.createdAt 
      ? new Date(firstFiber.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      : 'N/A';

    return (
      <div className="print-row-content" style={{ display: isPrinting ? 'block' : 'none' }}>
        <style>
          {`
            @media print {
              body * {
                visibility: hidden;
              }
              .print-row-content, .print-row-content * {
                visibility: visible;
              }
              .print-row-content {
                position: fixed;
                left: 0;
                top: 0;
                width: 100%;
                padding: 30px 40px;
                background: white;
                z-index: 99999;
              }
              .print-row-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 12px;
                margin-top: 15px;
              }
              .print-row-table th {
                background-color: #f3f4f6;
                border: 1px solid #d1d5db;
                padding: 8px 12px;
                text-align: left;
                font-weight: 600;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .print-row-table td {
                border: 1px solid #d1d5db;
                padding: 8px 12px;
                font-size: 11px;
              }
              .print-row-table tr:nth-child(even) {
                background-color: #f9fafb;
              }
              .print-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                border-bottom: 3px solid #1e3a5f;
                padding-bottom: 15px;
                margin-bottom: 20px;
              }
              .print-header-left {
                flex: 1;
              }
              .print-header-right {
                flex-shrink: 0;
                margin-left: 30px;
                display: flex;
                flex-direction: column;
                align-items: center;
              }
              .company-name {
                font-size: 18px;
                font-weight: 700;
                color: #1e3a5f;
                margin-bottom: 5px;
              }
              .company-detail {
                font-size: 10px;
                color: #4b5563;
                margin-bottom: 2px;
                line-height: 1.4;
              }
              .company-detail strong {
                color: #1f2937;
                font-weight: 600;
              }
              .print-title {
                text-align: center;
                margin: 15px 0;
              }
              .print-title h1 {
                font-size: 22px;
                font-weight: 700;
                color: #1e3a5f;
                margin: 0;
                letter-spacing: 1px;
              }
              .print-title .subtitle {
                color: #6b7280;
                font-size: 12px;
                margin-top: 3px;
              }
              .order-info-bar {
                display: flex;
                justify-content: center;
                gap: 30px;
                background: #f3f4f6;
                padding: 10px 20px;
                border-radius: 6px;
                margin: 10px 0 15px 0;
              }
              .order-info-bar .info-item {
                font-size: 12px;
                color: #374151;
              }
              .order-info-bar .info-item strong {
                font-weight: 600;
                color: #1f2937;
              }
              .print-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin: 15px 0;
                padding: 12px 15px;
                background: #f9fafb;
                border-radius: 6px;
                border: 1px solid #e5e7eb;
              }
              .print-details .detail-item {
                display: flex;
                gap: 8px;
                font-size: 11px;
              }
              .print-details .detail-item .label {
                font-weight: 600;
                color: #4b5563;
                min-width: 100px;
              }
              .print-details .detail-item .value {
                color: #1f2937;
              }
              .print-badge {
                display: inline-block;
                padding: 2px 10px;
                border-radius: 9999px;
                font-size: 10px;
                font-weight: 500;
                background-color: #dbeafe;
                color: #1e40af;
              }
              .print-footer {
                margin-top: 20px;
                text-align: center;
                font-size: 10px;
                color: #9ca3af;
                border-top: 1px solid #e5e7eb;
                padding-top: 12px;
              }
              .no-fibers {
                text-align: center;
                color: #9ca3af;
                padding: 20px;
                font-size: 12px;
              }
              .logo-image {
                max-width: 120px;
                max-height: 80px;
                object-fit: contain;
              }
            }
          `}
        </style>

        <div className="print-row-content-inner">
          {/* Header with Company on Left, Logo on Right */}
          <div className="print-header">
            <div className="print-header-left">
              <div className="company-name">{companyAddress.name}</div>
              <div className="company-detail">{companyAddress.address}</div>
              <div className="company-detail">
                <strong>GSTIN/UIN:</strong> {companyAddress.gstin}
              </div>
              <div className="company-detail">
                <strong>State:</strong> {companyAddress.state} 
                <span style={{ marginLeft: '10px' }}>
                  <strong>Code:</strong> {companyAddress.stateCode}
                </span>
              </div>
              <div className="company-detail">
                <strong>CIN:</strong> {companyAddress.cin}
              </div>
              <div className="company-detail">
                <strong>Contact:</strong> {companyAddress.contact}
              </div>
              <div className="company-detail">
                <strong>E-Mail:</strong> {companyAddress.email}
              </div>
            </div>
            <div className="print-header-right">
              <img
                src="/img/urdulogoo.png"
                alt="Company Logo"
                className="logo-image"
                style={{
                  maxWidth: '120px',
                  maxHeight: '80px',
                  objectFit: 'contain'
                }}
              />
              <div style={{ 
                fontSize: '9px', 
                color: '#6b7280', 
                marginTop: '5px',
                textAlign: 'center'
              }}>
               
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="print-title">
            <h1>FIBER ORDER DETAILS</h1>
            {/* <div className="subtitle">Fiber Allocation Summary</div> */}
          </div>

          {/* Order Info Bar */}
          <div className="order-info-bar">
            <span className="info-item">
              <strong>Order No:</strong> #{data.orderNo || 'N/A'}
            </span>
            <span className="info-item">
              <strong>Date:</strong> {orderDate}
            </span>
            <span className="info-item">
              <strong>Category:</strong> {firstFiber.orderCategory || 'Plain Order'}
            </span>
          </div>

          {/* Details Grid */}
          <div className="print-details">
            <div className="detail-item">
              <span className="label tracking-wider whitespace-nowrap">Destination Product:</span>
              <span className="value tracking-wider whitespace-nowrap">
                {data.orderProducts?.map((p) => p.productName).join(', ') || data.productName || 'N/A'}
              </span>
            </div>
            <div className="detail-item">
              <span className="label tracking-wider whitespace-nowrap">Challan No:</span>
              <span className="value tracking-wider whitespace-nowrap">
                {data.orderProducts?.map((p) => p.challanNo).filter(Boolean).join(', ') || 'N/A'}
              </span>
            </div>
          </div>

          {/* Fiber Table */}
          {fibers.length > 0 ? (
            <table className="print-row-table">
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>#</th>
                  <th style={{ width: '30%' }}>Fiber Product</th>
                  <th style={{ width: '15%' }}>Quantity</th>
                  <th style={{ width: '25%' }}>Location</th>
                  <th style={{ width: '25%' }}>Category</th>
                </tr>
              </thead>
              <tbody>
                {fibers.map((fiber, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{fiber.fiberProductName || 'N/A'}</td>
                    <td>{fiber.deductedInventoryQty || 0}</td>
                    <td>{fiber.locationName || 'N/A'}</td>
                    <td>
                      <span className="print-badge">
                        {fiber.orderCategory || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-fibers">No fibers assigned to this order</div>
          )}

          {/* Footer */}
          <div className="print-footer">
            <p>Generated on: {new Date().toLocaleString()}</p>
            <p style={{ marginTop: '2px' }}>
              This is a system-generated document. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName="Order / Fiber To Orders" />

        <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800 rounded-lg shadow-md">
          <div className="pt-5 pb-5">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between w-full mb-6">
              <h2 className="text-xl text-slate-500 dark:text-slate-300 font-semibold flex items-center justify-between w-full md:w-auto">
                <span>FIBER ALLOCATED TO ORDERS</span>
              </h2>

              <div className="flex items-center gap-4 mt-3 md:mt-0">
                <span className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/20 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800/30 text-sm font-semibold text-blue-700 dark:text-blue-300">
                  TOTAL: {pagination.totalItems}
                </span>
                <button
                  onClick={() => fetchOrderProducts(pagination.currentPage)}
                  className="h-10 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh
                </button>
              </div>
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
                        Destination Product
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Fibers Assigned
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>{renderTableRows()}</tbody>
                </table>
              </div>

              {/* Pagination */}
              {!loading && orderProducts.length > 0 && (
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

      {/* Print Row Component */}
      {isPrinting && printData && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 99999, 
          background: 'white',
          overflow: 'auto'
        }}>
          <PrintRow data={printData} />
        </div>
      )}
    </>
  );
};

export default Fiber;