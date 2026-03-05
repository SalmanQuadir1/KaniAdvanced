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

const ViewStockJournel = () => {
    const location = useSelector(state => state?.nonPersisted?.location);
    const description = useSelector(state => state?.nonPersisted?.material);
    const theme = useSelector(state => state?.persisted?.theme);
    const [locationSel, setLocationSel] = useState([]);
    const [descriptionValue, setDescriptionValue] = useState(null);
    const [descriptionSel, setDescriptionSel] = useState([]);
    const { stockJournal, ViewStock, handleDelete, handleUpdate, handlePageChange, pagination } = useStockJournal();
    const [statusSel, setStatusSel] = useState([]);

    useEffect(() => {
        ViewStock();
    }, []);


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
            { value: 'Created', label: 'Created' },
            { value: 'Approved', label: 'Approved' },
            { value: 'Rejected', label: 'Rejected' },
        ];
    };

    const customStyles = createCustomStyles(theme?.mode);
    const renderTableRows = () => {
        if (!stockJournal|| !stockJournal.length) return  (
            <tr>
                <td className="px-5 py-5 border-b border-gray-200 text-sm" colSpan="6">
                    <p className="text-gray-900 text-center whitespace-no-wrap">
                        No Data Found
                    </p>
                </td>
            </tr>
        );;

        const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

        return stockJournal.map((item, index) => (
            <tr key={index} className='bg-white dark:bg-slate-700 dark:text-white'>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{startingSerialNumber + index}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{item.sourceMaterial.description}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{item.sourceLocation?.address}</td>
                {/* <td className="px-5 py-5 border-b border-gray-200 text-sm">{item.sourceQuantity}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{item.sourcePrice}</td> */}
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{item.destinationMaterial.description}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{item.destinationLocation.address}</td>
                {/* <td className="px-5 py-5 border-b border-gray-200 text-sm">{item.destinationQuantity}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{item.destinationPrice}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{item.additionalCharges}</td> */}
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{item.journalStatus}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
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
                </td>
            </tr>
        ));
    };
    const handleSubmit = (values) => {
        console.log(values,"from frontttttt");
        const filters = {
            address: values.address || undefined, // Source Location
            description: values.description || undefined, // Source Material
            journalStatus: values.status || undefined, // Journal Status
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
                  address: '',
                  description: '',
                  journalStatus: '',
                }}
                onSubmit={handleSubmit}
              >
                {({ setFieldValue, values }) => (
                  <Form>
                    <div className="flex flex-col gap-9">
                      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-3">
                        <div className="mb-4.5 flex flex-wrap gap-6">
                          <div className="flex-1 min-w-[300px]">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Source Location
                            </label>
                            <Field
                              name="address"
                              component={ReactSelect}
                              options={locationSel}
                              styles={customStyles}
                              placeholder="Select Location"
                              value={locationSel.find(
                                (option) => option.label === values.address,
                              )}
                              onChange={(option) =>
                                setFieldValue(
                                  'address',
                                  option?.label === 'Select'
                                    ? ''
                                    : option?.label || '',
                                )
                              }
                            />
                          </div>
                          <div className="flex-1 min-w-[300px]">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Source Material
                            </label>
                            <ReactSelect
                              name="description"
                              // value={descriptionValue}
                              onChange={(option) =>
                                setFieldValue(
                                  'description',
                                  option?.label === 'Select'
                                    ? ''
                                    : option?.label || '',
                                )
                              }
                              value={descriptionSel.find(
                                (option) => option.label === values.description,
                              )}
                              options={descriptionSel}
                              styles={customStyles}
                              placeholder="Select Description"
                            />
                          </div>
                          <div className=" w-[378px]">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Status
                            </label>
                            <Field
                              name="status"
                              component={ReactSelect}
                              options={statusSel}
                              styles={customStyles}
                              placeholder="Select Status"
                              value={statusSel.find(
                                (option) => option.value === values.status,
                              )}
                              onChange={(option) =>
                                setFieldValue('status', option?.value || '')
                              }
                            />
                          </div>
                        </div>
                        <div className="mt-6 flex justify-center">
                          <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 w-[150px]"
                          >
                            Search
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
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Source Material
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Source Location
                      </th>
                      {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Source Quantity</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Source Price</th> */}
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Destination Material
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Destination Location
                      </th>
                      {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Destination Quantity</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Destination Price</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Additional Charges</th> */}
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Journal Status
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
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

export default ViewStockJournel;
