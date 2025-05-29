import React, { useState, useEffect } from 'react';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import MaterialPoModal from '../../hooks/MaterialPoModal';  // Import the modal component
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Pagination from '../Pagination/Pagination';
import { Link } from 'react-router-dom';
import useCustomer from '../../hooks/useCustomer';
import {  customStyles as createCustomStyles } from '../../Constants/utils';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { FaBook } from 'react-icons/fa6';
import reactSelect from 'react-select';
import { useSelector } from 'react-redux';


const ViewCustomer = () => {
  const { Customer,Customerr,getCustomerr, getCustomer, handleDelete, pagination, handleUpdate, handlePageChange, GetCustomerById } = useCustomer();
  const [showModal, setShowModal] = useState(false);
  const theme = useSelector(state => state?.persisted?.theme);
  const customStyles = createCustomStyles(theme?.mode);
  const [selectedMaterialPos, setSelectedMaterialPos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getCustomer();
    getCustomerr()
  }, []);

  const handleViewMaterialPos = (materialPos) => {
    setSelectedMaterialPos(materialPos);
    setShowModal(true);
  };

  // const handleSearch = (e) => {
  //   setSearchQuery(e.target.value);
  // };
  console.log(Customer, "cusssssssss");
  const formattedCustomer = Customerr.map(cust => ({
    label: cust.customerName,
    value: cust.customerName
}));

  // const filteredCustomer = Customer?.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  // console.log(filteredCustomer,"filteredddddddddddddd");
  const renderTableRows = () => {
    // if (!filteredCustomer || !filteredCustomer.length) return (
    //   <tr>
    //     <td colSpan="6" className="text-center">No results found</td>
    //   </tr>
    // );

    const startingSerialNumber =
      (pagination.currentPage - 1) * pagination.itemsPerPage + 1;
    return Customer.map((item, index) => (
      <tr key={index} className="bg-white dark:bg-slate-700 dark:text-white">
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {startingSerialNumber + index}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {item.customerName}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">{item.countryName}</p>
        </td>
        {/* <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {' '}
            {item?.customerGroup?.customerGroupName}
          </p>
        </td> */}
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap"> {item?.email}</p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {' '}
            {item?.contactNumber}
          </p>
        </td>
        <td className="px-5 py-5  border-b border-gray-200  text-sm">
          <p className="flex text-gray-900 whitespace-no-wrap">
            <FaBook size={17} className='text-teal-500 hover:text-teal-700 mx-2' onClick={(e) => navigate(`/customer/updateLedger/${item.id}`)} title='Update Ledger' />

          </p>
        </td>
        <td className="px-5 py-5  border-b border-gray-200  text-sm">
          <p className="flex text-gray-900 whitespace-no-wrap">
            {/* {
            item?.updateLedger && <TiTickOutline size={30}/>
           } */}

          </p>
        </td>

        <td className="px-5 py-5  border-b border-gray-200  text-sm">
          <p className="flex text-gray-900 whitespace-no-wrap">
            <FiEdit
              size={17}
              className="text-teal-500 hover:text-teal-700 mx-2"
              onClick={(e) => handleUpdate(e, item)}
              title="Edit Customer"
            />{' '}
            |
            <FiTrash2
              size={17}
              className="text-red-500  hover:text-red-700 mx-2"
              onClick={(e) => handleDelete(e, item?.id)}
              title="Delete Customer"
            />
          </p>
        </td>
      </tr>
    ));
  };
  const handleSubmit = (values) => {
    const filters = {
        customerName: values.customerName || undefined,
    };
    getCustomer(pagination.currentPage, filters);
};

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Customer / View Customer" />
      <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
        <div className="pt-5">
          <div className='items-center justify-center'>
            <Formik
              initialValues={{
                customerName: '',
              }}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values }) => (
                <Form>
                  <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                    <div className="flex-1 min-w-[300px]">
                      <label className="mb-2.5 block text-black dark:text-white">Customer</label>
                      <Field
                        name="customerName"
                        component={reactSelect}
                        options={[{ label: 'View All Customer', value: null }, ...formattedCustomer]}
                        styles={customStyles}
                        placeholder="Select Customer"
                        value={formattedCustomer.find(option => option.value === values.customerName)}
                        onChange={option => setFieldValue('customerName', option ? option.value : '')}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="flex md:w-[240px] w-[220px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center  bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
                    >
                      Search
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          {/* <div className="flex justify-center items-center p-3">
            <input
              type="text"
              name="search"
              placeholder="Search by Name"
              className="w-[300px] rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
              value={searchQuery}
              // onChange={handleSearch}
            />
            <button className="w-[80px] h-12 rounded-lg bg-blue-700 text-white dark:bg-blue-600 dark:text-slate-300  ml-4">
              Search
            </button>
          </div> */}
          <div className="flex justify-between mt-10">
            <h2 className="text-xl font-semibold leading-tight">
              View Customer
            </h2>
            <p
              className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success  dark:bg-white dark:text-slate-800`}
            >
              Total Customer: {pagination.totalItems}
            </p>
          </div>
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="bg-slate-300 dark:bg-slate-700 dark:text-white">
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      S.No
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Country
                    </th>
                    {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Customer Group
                    </th> */}

                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Contact Number
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Update Ledger
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Updated Ledger
                    </th>


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
    </DefaultLayout>
  );
};

export default ViewCustomer;