import React, { useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import useproductSubGroup from '../../hooks/useproductSubGroup';
import Pagination from '../Pagination/Pagination';
import ViewTable from './ViewTable';
import { toast } from 'react-toastify';

const ProductSubGroup = () => {
  const {
    productSubGroup,
    edit,
    currentproductSubGroup,
    pagination,
    groups,
    handleDelete,
    handleUpdate,
    handleSubmit,
    handleBulkCreate,
    handlePageChange,
  } = useproductSubGroup();

  // State for dynamic subgroup fields
  const [subgroupFields, setSubgroupFields] = useState(['']);
  const [isBulkMode, setIsBulkMode] = useState(true); // Toggle between single and bulk mode

  // Functions for dynamic fields
  const addSubgroupField = () => {
    setSubgroupFields([...subgroupFields, '']);
  };

  const removeSubgroupField = (index) => {
    if (subgroupFields.length > 1) {
      const newFields = [...subgroupFields];
      newFields.splice(index, 1);
      setSubgroupFields(newFields);
    }
  };

  const updateSubgroupField = (index, value) => {
    const newFields = [...subgroupFields];
    newFields[index] = value;
    setSubgroupFields(newFields);
  };

  const resetSubgroupFields = () => {
    setSubgroupFields(['']);
  };

  // Handle bulk creation
  const handleBulkSubmit = async (values, { setSubmitting, resetForm }) => {
    // Filter out empty fields
    const validSubgroups = subgroupFields
      .map(field => field.trim())
      .filter(name => name !== '');

    if (validSubgroups.length === 0) {
      toast.error('Please enter at least one subgroup name');
      setSubmitting(false);
      return;
    }

    if (!values.groupId) {
      toast.error('Please select a group');
      setSubmitting(false);
      return;
    }

    const result = await handleBulkCreate(values.groupId, validSubgroups);

    if (result.success) {
      resetForm();
      resetSubgroupFields();
    }

    setSubmitting(false);
  };
  console.log(productSubGroup, "6565");


  return (
    <DefaultLayout>
      <Breadcrumb pageName="Configurator/Product SubGroups" />



      <div>


        <Formik
          initialValues={{ groupId: '' }}
          onSubmit={handleBulkSubmit}
        >
          {({ values, isSubmitting, resetForm }) => (
            <Form>
              <div className="flex flex-col gap-9">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                      Add Multiple SubGroups
                    </h3>
                  </div>

                  <div className="p-6.5">
                    {/* Group Selection */}
                    <div className="mb-6">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Select Group <span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        name="groupId"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-800 dark:text-white dark:focus:border-primary"
                      >
                        <option value="">Select a Group</option>
                        {groups?.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.productGroupName || group.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="groupId"
                        component="div"
                        className="text-red-500 mt-1"
                      />
                    </div>

                    {/* Dynamic Subgroup Fields */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-black dark:text-white">
                          SubGroup Names <span className="text-danger">*</span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({subgroupFields.filter(f => f.trim() !== '').length} entered)
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={addSubgroupField}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add Field
                        </button>
                      </div>

                      <div className="space-y-3">
                        {subgroupFields.map((field, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={field}
                                onChange={(e) => updateSubgroupField(index, e.target.value)}
                                placeholder={`SubGroup Name ${index + 1}`}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-800 dark:text-white dark:focus:border-primary"
                              />
                              {field.trim() === '' && (
                                <div className="text-red-500 text-sm mt-1">
                                  This field is empty
                                </div>
                              )}
                            </div>
                            {subgroupFields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSubgroupField(index)}
                                className="px-3 py-2 bg-danger text-white rounded hover:bg-red-700 transition-colors"
                                title="Remove this field"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        <p>Tips:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>Click "Add Field" to add more subgroups</li>
                          <li>Empty fields will be ignored</li>
                          <li>All subgroups will be assigned to the selected group</li>
                        </ul>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 mt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                       className="flex md:w-[230px] w-[190px] md:h-[37px] h-[47px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-4">
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Creating...
                          </>
                        ) : (
                          `Create ${subgroupFields.filter(f => f.trim() !== '').length} SubGroup(s)`
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          resetForm();
                          resetSubgroupFields();
                        }}
                        className="px-6 py-2.5 border border-stroke rounded-lg hover:bg-gray-50 dark:border-strokedark dark:hover:bg-gray-800 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>


        {/* SUBGROUPS TABLE */}
        {!edit && (
          <div className="p-6 bg-white dark:bg-slate-800 rounded-sm border border-stroke dark:border-strokedark shadow-default mt-10">
            {/* Hierarchical Groups Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 w-20">#</th>
                    <th scope="col" className="px-6 py-3">Group Name</th>
                    <th scope="col" className="px-6 py-3">SubGroups</th>
                    <th scope="col" className="px-6 py-3 w-32">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* If no data */}
                  {(!productSubGroup || productSubGroup.length === 0) ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center justify-center py-8">
                          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">No subgroups found</p>
                          <p className="text-gray-500 dark:text-gray-500 mt-1">Start by creating subgroups above</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    // Group and display data
                    (() => {
                


                      return productSubGroup.map((group, groupIndex) => (
                        <React.Fragment key={group.id}>
                          {/* Group Row */}
                          <tr className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                              {groupIndex + 1}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                              <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                {group?.productGroupName}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {group?.subgroups.map((subgroup, index) => (
                                  <span
                                    key={subgroup.id}
                                    className="inline-flex items-center px-2 py-1 mb-1 text-xs font-medium bg-primary/10 text-primary rounded"
                                  >
                                    {subgroup.productSubGroupName}
                                  </span>
                                ))}
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className=" space-x-3">
                                {/* Edit Button */}

                               
                                  <button
                                    onClick={(e) => handleUpdate(group)}
                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                    title="Edit subgroup"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                             


                                {/* Delete Button */}
                                <button
                                  onClick={(e) => handleDelete(e, subgroup.id)}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  title="Delete subgroup"
                                >

                                </button>
                              </div>
                            </td>



                          </tr>



                          {/* Empty state for group with no subgroups */}
                          {group.subgroups.length === 0 && (
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <td colSpan="4" className="px-6 py-4 pl-12 text-gray-500 dark:text-gray-400 italic">
                                No subgroups added yet
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ));
                    })()
                  )}
                </tbody>
              </table>
            </div>



            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  totalPages={pagination.totalPages}
                  currentPage={pagination.currentPage}
                  handlePageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}

        
      </div>
    </DefaultLayout>
  );
};

export default ProductSubGroup;