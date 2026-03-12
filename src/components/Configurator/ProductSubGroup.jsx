import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import useproductSubGroup from '../../hooks/useproductSubGroup';
import Pagination from '../Pagination/Pagination';
import { toast } from 'react-toastify';
import { DELETE_PRODUCT_SUBGROUPP_URL } from '../../Constants/utils';
import { useSelector } from 'react-redux';

const ProductSubGroup = () => {
const [deletedSubgroupIds, setDeletedSubgroupIds] = useState([]);
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const {
    productSubGroup,
    edit,
    currentproductSubGroup,
    pagination,
    groups,
    handleDelete,
    handleUpdate,
    handleBulkCreate,
    handleBulkUpdate,
    handlePageChange,
  } = useproductSubGroup();

  const [subgroupFields, setSubgroupFields] = useState(['']);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGroupForEdit, setSelectedGroupForEdit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateClick = (group) => {
    console.log('Original group data:', group);

    // Store the group object with proper ID mapping
    setSelectedGroupForEdit({
      ...group,
      id: group.id, // This is the correct ID field
      productGroupId: group.id, // Also set this for backward compatibility
      productGroupName: group.productGroupName
    });

    // Extract subgroup names from subGroups array
    if (group?.subGroups && Array.isArray(group.subGroups)) {
      const names = group.subGroups.map(sg => sg.productSubGroupName || '');
      console.log('Setting subgroup fields:', names);
      setSubgroupFields(names.length ? names : ['']);
      setIsEditMode(true);
    }

    // Call the original handleUpdate if needed
    if (handleUpdate) {
      handleUpdate(group);
    }
  };

const handleCancelUpdate = () => {
  setSelectedGroupForEdit(null);
  setSubgroupFields(['']);
  setIsEditMode(false);
  setDeletedSubgroupIds([]); // Reset deleted IDs
};

  useEffect(() => {
    if (currentproductSubGroup && !selectedGroupForEdit) {
      console.log('Current product subgroup from hook:', currentproductSubGroup);

      if (currentproductSubGroup?.subGroups) {
        const names = currentproductSubGroup.subGroups.map(
          (sg) => sg.productSubGroupName || ''
        );
        setSubgroupFields(names.length ? names : ['']);
        setIsEditMode(true);
        setSelectedGroupForEdit({
          ...currentproductSubGroup,
          id: currentproductSubGroup.id || currentproductSubGroup.productGroupId,
          productGroupId: currentproductSubGroup.id || currentproductSubGroup.productGroupId
        });
      }
    }
  }, [currentproductSubGroup]);

  const addSubgroupField = () => {
    setSubgroupFields([...subgroupFields, '']);
  };

  const removeSubgroupField = (index) => {
  if (subgroupFields.length > 1) {
    // Get the subgroup ID if it exists (for existing subgroups)
    const subgroupId = selectedGroupForEdit?.subGroups?.[index]?.id;
    
    // If this is an existing subgroup (has an ID), mark it for deletion
    if (subgroupId) {
      // Store deleted IDs in state to handle later
      setDeletedSubgroupIds(prev => [...prev, subgroupId]);
    }

    // Remove from subgroupFields (UI input fields)
    const newFields = [...subgroupFields];
    newFields.splice(index, 1);
    setSubgroupFields(newFields);

    // CRITICAL: Also remove from selectedGroupForEdit.subGroups
    // This ensures the ID is not sent in the update
    if (selectedGroupForEdit && selectedGroupForEdit.subGroups) {
      const updatedSubgroups = [...selectedGroupForEdit.subGroups];
      updatedSubgroups.splice(index, 1); // Remove the subgroup at this index

      setSelectedGroupForEdit({
        ...selectedGroupForEdit,
        subGroups: updatedSubgroups // Use subGroups with capital G
      });

      console.log('Removed subgroup at index', index);
      console.log('Remaining subgroups:', updatedSubgroups);
      console.log('Remaining IDs:', updatedSubgroups.map(sg => sg.id));
    }
  }
};

  const updateSubgroupField = (index, value) => {
    const newFields = [...subgroupFields];
    newFields[index] = value;
    setSubgroupFields(newFields);
  };

 const resetSubgroupFields = () => {
  setSubgroupFields(['']);
  setIsEditMode(false);
  setSelectedGroupForEdit(null);
  setDeletedSubgroupIds([]); // Reset deleted IDs
};

 const handleBulkSubmit = async (values, { setSubmitting, resetForm }) => {
  const validSubgroups = subgroupFields
    .map((field) => field.trim())
    .filter((name) => name !== '');

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

  setIsSubmitting(true);

  try {
    let result;

    if (isEditMode && selectedGroupForEdit) {
      // Get the original subgroups
      const originalSubgroups = selectedGroupForEdit.subGroups || [];
      
      // Get IDs of subgroups to keep (those that still have input fields)
      const currentIds = [];
      const subgroupsToUpdate = [];
      
      // Loop through current input fields
      subgroupFields.forEach((field, index) => {
        if (field.trim() !== '') {
          // Check if this position originally had a subgroup with an ID
          if (originalSubgroups[index] && originalSubgroups[index].id) {
            const originalId = originalSubgroups[index].id;
            // Only include if it hasn't been deleted
            if (!deletedSubgroupIds.includes(originalId)) {
              currentIds.push(originalId);
              subgroupsToUpdate.push({
                id: originalId,
                name: field.trim()
              });
            }
          } else {
            // This is a new subgroup (no ID)
            subgroupsToUpdate.push({
              name: field.trim()
            });
          }
        }
      });

      // Combine manually deleted IDs with those removed by field deletion
      const originalIds = originalSubgroups.map(sg => sg.id).filter(id => id);
      const removedIds = [...new Set([...deletedSubgroupIds, ...originalIds.filter(id => !currentIds.includes(id))])];

      console.log('Original IDs:', originalIds);
      console.log('Keeping IDs:', currentIds);
      console.log('Removing IDs:', removedIds);

      // STEP 1: Delete removed subgroups
      if (removedIds.length > 0) {
        for (const id of removedIds) {
          console.log(`Deleting removed subgroup ID: ${id}`);
          const deleteResponse = await fetch(`${DELETE_PRODUCT_SUBGROUPP_URL}${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (!deleteResponse.ok) {
            throw new Error(`Failed to delete subgroup ${id}`);
          }
        }
      }

      // STEP 2: Update/Create subgroups
      const updateData = {
        groupId: values.groupId,
        subgroups: subgroupsToUpdate.map(sg => sg.name),
        ...(subgroupsToUpdate.some(sg => sg.id) && {
          subgroupIds: subgroupsToUpdate.filter(sg => sg.id).map(sg => sg.id)
        })
      };

      console.log('Update data being sent:', updateData);

      const groupIdToUpdate = selectedGroupForEdit.id || selectedGroupForEdit.productGroupId;
      result = await handleBulkUpdate(groupIdToUpdate, updateData);
      
    } else {
      // CREATE MODE
      result = await handleBulkCreate(values.groupId, validSubgroups);
    }

    if (result && result.success) {
      resetForm();
      resetSubgroupFields();
      setDeletedSubgroupIds([]); // Reset deleted IDs
      toast.success(isEditMode ? 'SubGroups Updated Successfully' : 'Created successfully!');

      if (handlePageChange) {
        await handlePageChange(pagination?.currentPage || 1);
      }
    } else {
      toast.error(result?.message || 'Operation failed');
    }
  } catch (error) {
    console.error('Submit error:', error);
    toast.error(error.message || 'An error occurred. Please try again.');
  } finally {
    setIsSubmitting(false);
    setSubmitting(false);
  }
};

  console.log(productSubGroup, "000");

  const handleDeleteSubgroup = async (subgroupId) => {
    // Show confirmation dialog

    try {
      // You can show a loading state here if needed

      // Make API call to delete subgroup
      const response = await fetch(`${DELETE_PRODUCT_SUBGROUPP_URL}${subgroupId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add any auth headers if needed
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        // Remove the subgroup from the UI
        // You'll need to update your state here
        // For example, if you have a setGroups function:

        // setGroups(prevGroups => 
        //   prevGroups.map(group => ({
        //     ...group,
        //     subgroups: group.subgroups.filter(sg => sg.id !== subgroupId)
        //   }))
        // );

        // Show success message (optional)
        toast.success('Subgroup deleted successfully');
        window.location.reload()
      } else {
        // Handle error
        alert('Failed to delete subgroup');
      }
    } catch (error) {
      console.error('Error deleting subgroup:', error);
      alert('An error occurred while deleting');
    }

  };


  return (
    <DefaultLayout>
      <Breadcrumb pageName="Configurator/Product SubGroups" />

      <Formik
        enableReinitialize
        initialValues={{
          groupId: selectedGroupForEdit?.productGroupId ||
            selectedGroupForEdit?.id || // This will catch the id from your data
            currentproductSubGroup?.productGroupId ||
            currentproductSubGroup?.id || '',
        }}
        onSubmit={handleBulkSubmit}
      >
        {({ values, isSubmitting: formikSubmitting, resetForm, setFieldValue }) => {
          // Use React.useEffect to update the field when selectedGroupForEdit changes
          React.useEffect(() => {
            if (selectedGroupForEdit) {
              // Get the ID from either productGroupId or id field
              const groupId = selectedGroupForEdit.productGroupId || selectedGroupForEdit.id;
              if (groupId && groupId !== values.groupId) {
                console.log('Setting groupId to:', groupId);
                setFieldValue('groupId', groupId);
              }
            }
          }, [selectedGroupForEdit, setFieldValue, values.groupId]);

          return (
            <Form>


              <div className="rounded-sm border border-stroke bg-white shadow-default p-6.5">
                {/* EDIT MODE INDICATOR */}
                {isEditMode && selectedGroupForEdit && (
                  <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded flex justify-between items-center">
                    <div>
                      <span className="font-semibold">Edit Mode:</span> Updating subgroups for{' '}
                      <span className="font-bold">{selectedGroupForEdit.productGroupName}</span>
                      {selectedGroupForEdit.subgroups && (
                        <span className="ml-2 text-sm">
                          ({selectedGroupForEdit.subgroups.length} existing subgroups)
                        </span>
                      )}
                      <span className="ml-2 text-sm text-blue-600">
                        (You can change the group if needed)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCancelUpdate}
                      className="text-sm underline hover:text-blue-900"
                    >
                      Cancel Update
                    </button>
                  </div>
                )}

                {/* GROUP DROPDOWN */}
                <div className="mb-6">
                  <label className="mb-2.5 block text-black">
                    Select Group <span className="text-danger">*</span>
                  </label>

                  <Field
                    as="select"
                    name="groupId"
                    className="w-full rounded border-[1.5px] border-stroke py-3 px-5 focus:border-primary"
                  >
                    <option value="">Select a Group</option>

                    {groups?.map((group) => (
                      <option
                        key={group.id}
                        value={group.id}
                      >
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

                {/* SUBGROUP INPUTS */}
                <div className="mb-6">
                  <div className="flex justify-between mb-3">
                    <label className="block text-black">
                      SubGroup Names <span className="text-danger">*</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({subgroupFields.filter(f => f.trim() !== '').length} entered)
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={addSubgroupField}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                    >
                      + Add Field
                    </button>
                  </div>

                  {subgroupFields.map((field, index) => (
                    <div key={index} className="flex gap-3 mb-2">
                      <input
                        type="text"
                        value={field}
                        onChange={(e) => updateSubgroupField(index, e.target.value)}
                        placeholder={`SubGroup Name ${index + 1}`}
                        className="w-full rounded border-[1.5px] border-stroke py-3 px-5 focus:border-primary"
                      />

                      {/* Show delete button for all fields when in edit mode or when there are multiple fields */}
                      {(isEditMode || subgroupFields.length > 1) && (
                        <button
                          type="button"
                          onClick={() => removeSubgroupField(index)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors whitespace-nowrap"
                          title="Delete this subgroup"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}

                </div>

                {/* BUTTONS */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || formikSubmitting}
                    className={`px-6 py-2 rounded text-white font-medium transition-colors ${isEditMode
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isSubmitting || formikSubmitting
                      ? 'Saving...'
                      : isEditMode
                        ? 'Update SubGroups'
                        : 'Save SubGroups'
                    }
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      handleCancelUpdate();
                    }}
                    className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>

      {/* TABLE */}
      <div className="p-6 bg-white rounded-sm border shadow-default mt-10">
        <table className="min-w-full leading-normal">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 font-semibold">#</th>
              <th className="p-3 font-semibold">Group Name</th>
              <th className="p-3 font-semibold">SubGroups</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {productSubGroup?.length > 0 ? (
              productSubGroup.map((group, index) => (
                <tr key={group.id || index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>

                  <td className="p-3 font-medium">{group.productGroupName}</td>

                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      {group?.subGroups?.map((sg) => (
                        <span
                          key={sg.id}
                          className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs group hover:bg-red-100 hover:text-red-800 transition-all duration-200"
                        >
                          {sg.productSubGroupName}
                          <button
                            onClick={() => handleDeleteSubgroup(sg.id)}
                            className="ml-1 focus:outline-none opacity-60 group-hover:opacity-100 transition-opacity"
                            title="Delete subgroup"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </span>
                      ))}
                      {(!group.subgroups) && (
                        <span className="text-gray-400 italic">-</span>
                      )}
                    </div>
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => handleUpdateClick(group)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors mr-2"
                    >
                      Update
                    </button>
                    {/* <button 
            onClick={(e) => handleDelete(group.productGroupId)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button> */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    {/* Empty State Icon */}
                    <svg
                      className="w-16 h-16 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>

                    {/* Message */}
                    <p className="text-xl font-medium text-gray-500">
                      No Product Groups Found
                    </p>



                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {pagination?.totalPages > 0 && (
          <Pagination
            totalPages={pagination.totalPages}
            currentPage={pagination.currentPage}
            handlePageChange={handlePageChange}
          />
        )}
      </div>
    </DefaultLayout>
  );
};

export default ProductSubGroup;