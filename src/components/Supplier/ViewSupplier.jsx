import React, { useState, useEffect } from 'react';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import MaterialPoModal from '../../hooks/MaterialPoModal';  // Import the modal component
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Pagination from '../Pagination/Pagination';
import { Link, useNavigate, useNavigation } from 'react-router-dom';
import useSupplier from '../../hooks/useSupplier';
import { ErrorMessage, Field } from 'formik';
import { FaBook } from "react-icons/fa6";
import { TiTickOutline } from "react-icons/ti";
const ViewSupplier = () => {

  const navigate = useNavigate()
  const { Supplier, getSupplier, handleDelete, pagination, handleUpdate, handlePageChange, GetSupplierById } = useSupplier();
  const [showModal, setShowModal] = useState(false);
  const [selectedMaterialPos, setSelectedMaterialPos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getSupplier();
  }, []);

  const handleViewMaterialPos = (materialPos) => {
    setSelectedMaterialPos(materialPos);
    setShowModal(true);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredSupplier = Supplier?.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  console.log(filteredSupplier, "filteredddddddddddddd");
  const renderTableRows = () => {
    if (!filteredSupplier || !filteredSupplier.length) return (
      <tr>
        <td colSpan="6" className="text-center">No results found</td>
      </tr>
    );

    const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;
    return filteredSupplier.map((item, index) => (
      <tr key={index} className='bg-white dark:bg-slate-700 dark:text-white'>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {startingSerialNumber + index}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {item.name}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {item.phoneNumber}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap"> {item.address}</p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap"> {item.supplierCode}</p>
        </td>
        <td className="px-5 py-5  border-b border-gray-200  text-sm">
          <p className="flex text-gray-900 whitespace-no-wrap">
            <FaBook size={17} className='text-teal-500 hover:text-teal-700 mx-2' onClick={(e) => navigate(`/supplier/updateLedger/${item.id}`)} title='Update Ledger' />

          </p>
        </td>
        <td className="px-5 py-5  border-b border-gray-200  text-sm">
          <p className="flex text-gray-900 whitespace-no-wrap">
            {
              item?.updateLedger && <TiTickOutline size={30} />
            }

          </p>
        </td>

        <td className="px-5 py-5  border-b border-gray-200  text-sm">
          <p className="flex text-gray-900 whitespace-no-wrap">
            <FiEdit size={17} className='text-teal-500 hover:text-teal-700 mx-2' onClick={(e) => handleUpdate(e, item)} title='Edit Supplier' />  |
            <FiTrash2 size={17} className='text-red-500  hover:text-red-700 mx-2' onClick={(e) => handleDelete(e, item?.id)} title='Delete Supplier' />
          </p>
        </td>
      </tr>
    ));
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Supplier / View Supplier" />
      <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
        <div className="pt-5">

          <div className='flex flex-row items-center justify-between w-full'>
            <h2 className="text-xl text-slate-500 font-semibold w-full flex items-center justify-between">
              <span>SUPPLIER VIEW</span>
              <span className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/20 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800/30 text-sm font-semibold text-blue-700 dark:text-blue-300 ml-4">
                TOTAL SUPPLIERS: {pagination.totalItems}
              </span>
            </h2>
          </div>

          <div className="flex items-center">
            <input
              type="text"
              name="search"
              placeholder="Search by Name"
              className="w-[180px] h-9 rounded-lg border-2 border-gray-300 bg-white py-2 px-4 text-sm text-gray-700 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-500 dark:focus:ring-blue-900/50"
              value={searchQuery}
              onChange={handleSearch}
            />
            <button className='ml-3 h-9 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-600'>
              Search
            </button>
          </div>


          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className='bg-slate-300 dark:bg-slate-700 dark:text-white'>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">S.No</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone Number</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Address</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Supplier Code</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Update Ledger</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Updated Ledger</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {renderTableRows()}
                </tbody>
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
    </DefaultLayout>
  );
};

export default ViewSupplier;