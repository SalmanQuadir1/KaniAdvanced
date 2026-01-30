import React, { useEffect, useState } from 'react';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Pagination from '../Pagination/Pagination';
import useStockJournal from '../../hooks/useStockJournel';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import { Field, Form, Formik } from 'formik';
import ReactSelect from 'react-select';
import { useSelector } from 'react-redux';
import useProduct from '../../hooks/useProduct';
import { AiFillProduct } from 'react-icons/ai';
import { MdDateRange } from 'react-icons/md';
import { TbBaselineDensityMedium } from 'react-icons/tb';
import { PiArrowsMergeFill } from 'react-icons/pi';
import { FcAcceptDatabase } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

const ViewStockJournels = () => {
  const location = useSelector(state => state?.nonPersisted?.location);
  const description = useSelector(state => state?.nonPersisted?.material);
  const theme = useSelector(state => state?.persisted?.theme);
  const [locationSel, setLocationSel] = useState([]);
  const [descriptionValue, setDescriptionValue] = useState(null);
  const [descriptionSel, setDescriptionSel] = useState([]);
  const { stockJournal, ViewStock, handleDelete, handleUpdate, handlePageChange, pagination } = useStockJournal();
  const [statusSel, setStatusSel] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    ViewStock();
  }, []);

  const referenceImages = "";
  const actualImages = "";
  const productIdField = "";

  const {
    getProductList,
    productList

  } = useProduct({ referenceImages, actualImages, productIdField });


  useEffect(() => {
    getProductList();
  }, [])

  console.log(productList, "545454");

  const productsOptions = productList.map(product => ({
    value: product.id,
    label: product.productId,
    productId: product.productId,
    productObject: product
  }));



  useEffect(() => {
    setLocationSel(formatOptions(location.data, 'address', 'id', 'locationObject', 'Select Location'));
    setDescriptionSel(formatOptions(description.data, 'description', 'id', 'materialObject'));
    setStatusSel(formatStatusOptions());
  }, [location, description]);

  const formatOptions = (data, labelKey, valueKey, objectKey, placeholder) => {
    return [{ value: '', label: "Select" }]
      .concat(data ? data.map(item => ({
        value: item[valueKey],
        label: item[labelKey],
        [objectKey]: item
      })) : []);
  };
  const formatStatusOptions = () => {
    return [
      { value: '', label: 'Select Status' },
      { value: 'created', label: 'Created' },
      { value: 'approved', label: 'Approved' },
      { value: 'rejected', label: 'Rejected' },
    ];
  };

  const customStyles = createCustomStyles(theme?.mode);
  const renderTableRows = () => {
    if (!stockJournal || !stockJournal.length) return (
      <tr>
        <td className="px-5 py-5 border-b border-gray-200 text-sm" colSpan="6">
          <p className="text-gray-900 text-center whitespace-no-wrap">
            No Data Found
          </p>
        </td>
      </tr>
    );;

    const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

    console.log(stockJournal, "salmaan");


    return stockJournal.map((item, index) => (
      <tr key={index} className='bg-white dark:bg-slate-700 dark:text-white'>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">{startingSerialNumber + index}</td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">{new Date(item.createdDate).toLocaleString()}</td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">{item?.journalStatus}</td>
        {/* <td className="px-5 py-5 border-b border-gray-200 text-sm">{item.sourceQuantity}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{item.sourcePrice}</td> */}
        <td className="px-5 py-5 border-b border-gray-200 text-sm">{item.voucherNo}</td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          {item?.transferProducts?.map((product, productIndex) => (
            <div key={product.id || productIndex} className="mb-2 last:mb-0">
              <div className="font-medium">Product: {product.productId}</div>
              <div className="text-xs text-gray-500 dark:text-gray-300">
                Transfer Qty: {product.transferQty} |
                Received Qty: {product.receivedQty} |
                From: Location {product.sourceLocationName} |
                To: Location {product.destinationLocationName}
              </div>
            </div>
          ))}
        </td>

        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <button
            onClick={() => navigate(`/stockjournel/acceptStockJournal/${item.id}`)}
            disabled={item.journalStatus == 'FULLY_ACCEPTED'}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <FcAcceptDatabase size={18} />
            <span className="font-medium">Accept</span>
          </button>
        </td>





        {/* <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <div className="flex items-center">
            <FiEdit
              size={17}
              className='text-teal-500 hover:text-teal-700 mx-2'
              onClick={(e) => handleUpdate(e, item)}
              title='Edit Inventory'
            />
            <FiTrash2
              size={17}
              className='text-red-500 hover:text-red-700 mx-2'
              onClick={(e) => handleDelete(e, item.id)}
              title='Delete Material PO'
            />
          </div>
        </td> */}
      </tr>
    ));
  };
  const handleSubmit = (values) => {
    console.log(values, "from frontttttt");
    const filters = {
      toDate: values.toDate || undefined, // Source Location
      fromDate: values.fromDate || undefined, // Source Material
      journalStatus: values.journalStatus || undefined, // Journal Status
      voucherNo: values.voucherNo || undefined, // Voucher Number
      productId: values.productId || undefined, // Source Material

    };
    ViewStock(pagination.currentPage, filters);
  };


  return (
    <DefaultLayout>
      <Breadcrumb pageName="Stock Journal / View Stock Journal" />
      <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
        <div className="pt-5">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold leading-tight">
              View Stock Journal
            </h2>
            <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 mb-2 text-sm font-medium bg-success text-success dark:bg-white dark:text-slate-800">
              Total PO: {pagination.totalItems}
            </p>
          </div>
          <div>
            <Formik
              initialValues={{
                productId: '',
                voucherNo: '',
                journalStatus: '',
                fromDate: '',
                toDate: ''
              }}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values }) => (
                <Form>
                  <div className="flex flex-col gap-8">
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
                      {/* Header */}


                      {/* Form Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                          {
                            label: "Products",
                            icon: <AiFillProduct />,
                            color: "blue",
                            field: (
                              <ReactSelect
                                name="productId"
                                onChange={(option) =>
                                  setFieldValue(
                                    'productId',
                                    option?.value === 'Select' ? '' : option?.value || '',
                                  )
                                }
                                value={productsOptions.find(
                                  (option) => option.value === values.productId,
                                )}
                                options={productsOptions}
                                styles={customStyles}
                                placeholder="Select Product"
                              />
                            )
                          },

                          {
                            label: "Voucher No",
                            icon: <TbBaselineDensityMedium />,
                            color: "amber",
                            field: (
                              <Field
                                type="text"
                                name="voucherNo"
                                placeholder="Enter voucher number"
                                className="w-full h-12 px-4 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none"
                              />
                            )
                          },
                          {
                            label: "Status",
                            icon: <PiArrowsMergeFill />,
                            color: "pink",
                            field: (
                              <Field
                                name="journalStatus"
                                component={ReactSelect}
                                options={statusSel}
                                styles={customStyles}
                                placeholder="Select Status"
                                value={statusSel.find(
                                  (option) => option.value === values.journalStatus,
                                )}
                                onChange={(option) =>
                                  setFieldValue('journalStatus', option?.value || '')
                                }
                              />
                            )
                          },
                          {
                            label: "From Date",
                            icon: <MdDateRange />,
                            color: "emerald",
                            field: (
                              <Field
                                type="date"
                                name="fromDate"
                                className="w-full h-12 px-4 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                              />
                            )
                          },
                          {
                            label: "To Date",
                            icon: <MdDateRange />,
                            color: "purple",
                            field: (
                              <Field
                                type="date"
                                name="toDate"
                                className="w-full h-12 px-4 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                              />
                            )
                          },
                        ].map((item, index) => (
                          <div key={index} className="group">
                            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                              <div className="flex items-center gap-2">
                                <div className={`p-1.5 bg-${item.color}-100 dark:bg-${item.color}-900/20 rounded-lg`}>
                                  <div className={`text-${item.color}-600 dark:text-${item.color}-400`}>
                                    {item.icon}
                                  </div>
                                </div>
                                {item.label}
                              </div>
                            </label>
                            <div className="relative">
                              {item.field}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Search Button */}
                      <div className="mt-12 flex justify-center">
                        <button
                          type="submit"
                          className="relative overflow-hidden px-6 py-2 bg-primary  text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex items-center justify-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="text-lg">Search</span>
                          </div>
                          <div className="absolute inset-0 border-2 border-white/20 rounded-2xl group-hover:border-white/40 transition-all duration-300"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="bg-slate-300 dark:bg-slate-700 dark:text-white">
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Serial No.
                    </th>
                    <th className="px-7 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Source Quantity</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Source Price</th> */}
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Voucher Number
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Products
                    </th>
                    {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Destination Quantity</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Destination Price</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Additional Charges</th> */}

                    {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th> */}

                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>{renderTableRows()}</tbody>
              </table>
            </div>
            <Pagination
              totalPages={pagination.totalPages}
              currentPage={pagination.currentPage}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </DefaultLayout >
  );
};

export default ViewStockJournels;
