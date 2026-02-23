import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import useproductSubGroup from '../../hooks/useproductSubGroup';
import Pagination from '../Pagination/Pagination';
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
    
    // Store the entire group object including its ID
    setSelectedGroupForEdit({
      ...group,
      id: group.id || group.productGroupId // Ensure we have an ID
    });
    
    // Extract subgroup names
    if (group?.subgroups) {
      const names = group.subgroups.map(sg => sg.productSubGroupName || '');
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
  };

  useEffect(() => {
    if (currentproductSubGroup && !selectedGroupForEdit) {
      console.log('Current product subgroup from hook:', currentproductSubGroup);
      
      if (currentproductSubGroup?.subgroups) {
        const names = currentproductSubGroup.subgroups.map(
          (sg) => sg.productSubGroupName || ''
        );
        setSubgroupFields(names.length ? names : ['']);
        setIsEditMode(true);
        setSelectedGroupForEdit({
          ...currentproductSubGroup,
          id: currentproductSubGroup.id || currentproductSubGroup.productGroupId
        });
      }
    }
  }, [currentproductSubGroup]);

  const addSubgroupField = () => {
    setSubgroupFields([...subgroupFields, '']);
  };

 const removeSubgroupField = (index) => {
  if (subgroupFields.length > 1) {
    // Remove from subgroupFields (UI input fields)
    const newFields = [...subgroupFields];
    newFields.splice(index, 1);
    setSubgroupFields(newFields);
    
    // CRITICAL: Also remove from selectedGroupForEdit.subgroups
    // This ensures the ID is not sent in the update
    if (selectedGroupForEdit && selectedGroupForEdit.subgroups) {
      const updatedSubgroups = [...selectedGroupForEdit.subgroups];
      updatedSubgroups.splice(index, 1); // Remove the subgroup at this index
      
      setSelectedGroupForEdit({
        ...selectedGroupForEdit,
        subgroups: updatedSubgroups // This now has only IDs 4 and 7
      });
      
      console.log('Removed subgroup at index', index);
      console.log('Remaining subgroups:', updatedSubgroups);
      console.log('Remaining IDs:', updatedSubgroups.map(sg => sg.id)); // Should show [4, 7]
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
      // Get original IDs from when we started editing
      const originalIds = selectedGroupForEdit.subgroups?.map(sg => sg.id) || [];
      
      // Get current IDs from the UI (after removals)
      const currentIds = subgroupFields
        .map((_, index) => originalIds[index])
        .filter(id => id !== undefined);
      
      console.log('Original IDs:', originalIds); // [4, 7, 8]
      console.log('Current IDs:', currentIds);   // [4, 7]
      
      // Find which IDs were removed
      const removedIds = originalIds.filter(id => !currentIds.includes(id));
      console.log('Removed IDs to delete:', removedIds); // [8]
      
      // STEP 1: Delete the removed subgroups first
      if (removedIds.length > 0) {
        for (const id of removedIds) {
          console.log(`Deleting removed subgroup ID: ${id}`);
          await fetch(`${DELETE_PRODUCT_SUBGROUP_URL}${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
        }
      }
      
      // STEP 2: Now update the remaining subgroups
      const updateData = {
        groupId: values.groupId,
        subgroups: validSubgroups,
        subgroupIds: currentIds // Only [4, 7]
      };
      
      console.log('Updating with data:', updateData);
      
      const groupIdToUpdate = selectedGroupForEdit.id || selectedGroupForEdit.productGroupId;
      
      result = await handleBulkUpdate(groupIdToUpdate, updateData);
    } else {
      // CREATE MODE
      result = await handleBulkCreate(values.groupId, validSubgroups);
    }

    if (result && result.success) {
      resetForm();
      resetSubgroupFields();
      toast.success(isEditMode ? 'Updated successfully!' : 'Created successfully!');
      
      if (handlePageChange) {
        await handlePageChange(pagination?.currentPage || 1);
      }
    }
  } catch (error) {
    console.error('Submit error:', error);
    toast.error('An error occurred. Please try again.');
  } finally {
    setIsSubmitting(false);
    setSubmitting(false);
  }
};

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Configurator/Product SubGroups" />

      <Formik
        enableReinitialize
        initialValues={{
          groupId: selectedGroupForEdit?.productGroupId || 
                   currentproductSubGroup?.productGroupId || '',
        }}
        onSubmit={handleBulkSubmit}
      >
        {({ values, isSubmitting: formikSubmitting, resetForm }) => (
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
                      onChange={(e) =>
                        updateSubgroupField(index, e.target.value)
                      }
                      placeholder={`SubGroup Name ${index + 1}`}
                      className="w-full rounded border-[1.5px] border-stroke py-3 px-5 focus:border-primary"
                    />

                    {/* {subgroupFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSubgroupField(index)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    )} */}
                  </div>
                ))}
              </div>

              {/* BUTTONS */}
              <div className="flex gap-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting || formikSubmitting}
                  className={`px-6 py-2 rounded text-white font-medium transition-colors ${
                    isEditMode 
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
        )}
      </Formik>

      {/* TABLE */}
      <div className="p-6 bg-white rounded-sm border shadow-default mt-10">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 font-semibold">#</th>
              <th className="p-3 font-semibold">Group Name</th>
              <th className="p-3 font-semibold">SubGroups</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {productSubGroup?.map((group, index) => (
              <tr key={group.id || index} className="border-b hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>

                <td className="p-3 font-medium">{group.productGroupName}</td>

                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {group.subgroups?.map((sg) => (
                      <span 
                        key={sg.id} 
                        className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                      >
                        {sg.productSubGroupName}
                      </span>
                    ))}
                    {(!group.subgroups || group.subgroups.length === 0) && (
                      <span className="text-gray-400 italic">No subgroups</span>
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
                    onClick={(e) => handleDelete(e, group.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pagination?.totalPages > 1 && (
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