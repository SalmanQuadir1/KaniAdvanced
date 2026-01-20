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

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Configurator/Product SubGroups" />
      
      {/* Mode Toggle */}
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setIsBulkMode(true)}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              isBulkMode
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
            }`}
          >
            Bulk Create
          </button>
          <button
            type="button"
            onClick={() => setIsBulkMode(false)}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              !isBulkMode
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
            }`}
          >
            Single Create
          </button>
        </div>
      </div>

      <div>
        {isBulkMode ? (
          /* BULK CREATE FORM */
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
                          className="flex w-48 justify-center items-center py-2.5 rounded-lg bg-primary font-medium text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
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
        ) : (
          /* SINGLE CREATE/EDIT FORM */
          <Formik
            initialValues={currentproductSubGroup}
            enableReinitialize={true}
            validate={(values) => {
              const errors = {};
              if (!values.productSubGroupName) {
                errors.productSubGroupName = 'Required';
              }
              if (!values.groupId) {
                errors.groupId = 'Please select a group';
              }
              return errors;
            }}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, resetForm }) => (
              <Form>
                <div className="flex flex-col gap-9">
                  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                      <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                        {edit ? 'Update SubGroup' : 'Add Single SubGroup'}
                      </h3>
                    </div>
                    <div className="p-6.5">
                      <div className="mb-4.5 flex flex-wrap gap-6">
                        <div className="flex-1 min-w-[300px]">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Select Group
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
                            className="text-red-500"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-[300px]">
                          <label className="mb-2.5 block text-black dark:text-white">
                            SubGroup Name
                          </label>
                          <Field
                            type="text"
                            name="productSubGroupName"
                            placeholder="Enter subgroup name"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-800 dark:text-white dark:focus:border-primary"
                          />
                          <ErrorMessage
                            name="productSubGroupName"
                            component="div"
                            className="text-red-500"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-center gap-4 mt-6">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex md:w-[180px] justify-center py-2 rounded-lg bg-primary font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                        >
                          {edit ? 'Update SubGroup' : 'Create SubGroup'}
                        </button>
                        
                        {edit && (
                          <button
                            type="button"
                            onClick={() => {
                              resetForm();
                              edit && setEdit(false);
                            }}
                            className="px-6 py-2 border border-stroke rounded-lg hover:bg-gray-50 dark:border-strokedark dark:hover:bg-gray-800"
                          >
                            Cancel Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        )}

        {/* SUBGROUPS TABLE */}
        {!edit && (
          <div className="mt-8 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6 dark:border-strokedark">
              <h3 className="font-medium text-slate-500 text-xl dark:text-white">
                SubGroups List
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Showing {productSubGroup.length} of {pagination.totalItems} subgroups
              </p>
            </div>
            
            <div className="p-6">
              <ViewTable
                units={productSubGroup}
                groups={groups}
                pagination={pagination}
                totalItems={pagination.totalItems}
                title={'Product SubGroups'}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
              />
              
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
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default ProductSubGroup;