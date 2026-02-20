import React, { useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import useproductSubGroup from '../../hooks/useproductSubGroup';
import Pagination from '../Pagination/Pagination';
import { toast } from 'react-toastify';

const ProductSubGroup = () => {
  const {
    productSubGroup,
    editingGroup,
    editingSubgroups,
    pagination,
    groups,
    handleDelete,
    handleEditGroup,
    handleUpdateGroup,
    handleEditSubgroup,
    handleUpdateSubgroup,
    cancelEdit,
    handleBulkCreate,
    handlePageChange,
  } = useproductSubGroup();

  // State for dynamic subgroup fields
  const [subgroupFields, setSubgroupFields] = useState(['']);

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

      <div>
        {/* Bulk Creation Form */}
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
                            </div>
                            {subgroupFields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSubgroupField(index)}
                                className="px-3 py-2 bg-danger text-white rounded hover:bg-red-700 transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 mt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex md:w-[230px] w-[190px] md:h-[37px] h-[47px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                      >
                        {isSubmitting ? 'Creating...' : `Create ${subgroupFields.filter(f => f.trim() !== '').length} SubGroup(s)`}
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
        <div className="p-6 bg-white dark:bg-slate-800 rounded-sm border border-stroke dark:border-strokedark shadow-default mt-10">
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
                  productSubGroup.map((group, groupIndex) => (
                    <React.Fragment key={group.id}>
                      {/* Group Row */}
                      <tr className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {groupIndex + 1}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {editingGroup?.id === group.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editingGroup.name}
                                onChange={(e) => setEditingGroup({...editingGroup, name: e.target.value})}
                                className="px-2 py-1 border rounded dark:bg-slate-700 dark:text-white"
                                autoFocus
                              />
                              <button
                                onClick={() => handleUpdateGroup(group.id, editingGroup.name)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setEditingGroup(null)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                              {group?.productGroupName}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {group?.subgroups?.map((subgroup) => (
                              <div key={subgroup.id} className="flex items-center gap-2">
                                {editingSubgroups[subgroup.id]?.isEditing ? (
                                  <>
                                    <input
                                      type="text"
                                      value={editingSubgroups[subgroup.id].name}
                                      onChange={(e) => setEditingSubgroups({
                                        ...editingSubgroups,
                                        [subgroup.id]: { ...editingSubgroups[subgroup.id], name: e.target.value }
                                      })}
                                      className="px-2 py-1 text-sm border rounded dark:bg-slate-700 dark:text-white"
                                      autoFocus
                                    />
                                    <button
                                      onClick={() => handleUpdateSubgroup(subgroup.id)}
                                      className="text-green-600 hover:text-green-900"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => cancelEdit(subgroup.id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                                      {subgroup.productSubGroupName}
                                    </span>
                                    <button
                                      onClick={() => handleEditSubgroup(subgroup.id, subgroup.productSubGroupName)}
                                      className="text-blue-600 hover:text-blue-900 ml-1"
                                      title="Edit subgroup"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={(e) => handleDelete(e, subgroup.id)}
                                      className="text-red-600 hover:text-red-900"
                                      title="Delete subgroup"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEditGroup(group)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              title="Edit group"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
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
      </div>
    </DefaultLayout>
  );
};

export default ProductSubGroup;