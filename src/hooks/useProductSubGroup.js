import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  UPDATE_PRODUCT_SUBGROUP_URL,
  ADD_PRODUCT_SUBGROUP_URL,
  ADD_PRODUCT_SUBGROUPS_BULK_URL,
  DELETE_PRODUCT_SUBGROUP_URL,
  GET_PRODUCT_SUBGROUP_URL,
  GET_GROUPS_URL,
} from '../Constants/utils';

const useproductSubGroup = () => {
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const [productSubGroup, setProductSubGroup] = useState([]);
  const [groups, setGroups] = useState([]);
  const [edit, setEdit] = useState(false);
  const [currentproductSubGroup, setCurrentproductSubGroup] = useState({
    productSubGroupName: '',
    groupId: null,
  });

  const [pagination, setPagination] = useState({
    totalItems: 0,
    data: [],
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 0,
  });

  useEffect(() => {
    getproductSubGroup(pagination.currentPage);
    getGroups();
  }, []);

  const getGroups = async () => {
    try {
      const response = await fetch(GET_GROUPS_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setGroups(data?.content || data || []);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      toast.error('Failed to load groups');
    }
  };

  const getproductSubGroup = async (page) => {
    try {
      const response = await fetch(`${GET_PRODUCT_SUBGROUP_URL}?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProductSubGroup(data?.content || []);
      setPagination({
        totalItems: data.totalElements || 0,
        data: data.content || [],
        totalPages: data.totalPages || 1,
        currentPage: data.number + 1 || 1,
        itemsPerPage: data.size || 10,
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch subgroups');
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      const response = await fetch(`${DELETE_PRODUCT_SUBGROUP_URL}${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`SubGroup Deleted Successfully!`);
        getproductSubGroup(pagination.currentPage);
      } else {
        toast.error(`${data.errorMessage || 'Failed to delete'}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    }
  };

  // FIXED: This now sets the group for editing (not a single subgroup)
  const handleUpdate = (group) => {
    console.log(group, "Setting group for editing");
    setEdit(true);
    setCurrentproductSubGroup(group);
  };

  // NEW: Bulk update function
 const handleBulkUpdate = async (groupId, data) => {
  console.log('Bulk updating with data:', data);
  
  try {
    const updatePromises = [];
    const existingSubgroups = data.subgroupIds || [];
    
    // Update each existing subgroup individually
    existingSubgroups.forEach((id, index) => {
      if (index < data.subgroups.length) {
        console.log(`Updating subgroup ID ${id} with name: ${data.subgroups[index]}`);
        
        const updateUrl = `${UPDATE_PRODUCT_SUBGROUP_URL}/${id}`;
        console.log('Update URL:', updateUrl);
        
        // The backend expects the full DTO with ID inside the subgroups array
        const payload = {
          productGroupId: Number(data.groupId),
          subgroups: [
            {
              id: id,  // ID inside the subgroups array, not at top level
              productSubGroupName: data.subgroups[index]
            }
          ]
        };
        
        console.log('Update payload:', payload);
        
        const updatePromise = fetch(updateUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }).then(async response => {
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Update failed for ID ${id}:`, response.status, errorText);
            throw new Error(errorText || `Failed to update subgroup ${id}`);
          }
          return response.json();
        });
        
        updatePromises.push(updatePromise);
      }
    });
    
    // Create new subgroups if there are more fields than existing subgroups
    if (data.subgroups.length > existingSubgroups.length) {
      const newSubgroups = data.subgroups.slice(existingSubgroups.length);
      
      if (newSubgroups.length > 0) {
        console.log('Creating new subgroups:', newSubgroups);
        
        const createPromise = fetch(ADD_PRODUCT_SUBGROUPS_BULK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productGroupId: Number(data.groupId),
            subgroups: newSubgroups.map(name => ({ 
              productSubGroupName: name 
            }))
          }),
        }).then(async response => {
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Bulk create failed:', response.status, errorText);
            throw new Error(errorText || 'Failed to create new subgroups');
          }
          return response.json();
        });
        
        updatePromises.push(createPromise);
      }
    }
    
    // Wait for all operations to complete
    if (updatePromises.length > 0) {
      const results = await Promise.allSettled(updatePromises);
      
      // Check results
      const failed = results.filter(r => r.status === 'rejected');
      if (failed.length > 0) {
        console.error('Some operations failed:', failed);
        toast.warning(`${failed.length} operation(s) failed.`);
        return { success: false, failedCount: failed.length };
      }
    }
    
    toast.success('Subgroups updated successfully!');
    
    // Refresh the data
    await getproductSubGroup(pagination.currentPage);
    
    setEdit(false);
    setCurrentproductSubGroup({
      productSubGroupName: '',
      groupId: null,
    });
    
    return { success: true };
    
  } catch (error) {
    console.error('Bulk update error:', error);
    toast.error('An error occurred during update');
    return { success: false, message: error.message };
  }
};

  const handleBulkCreate = async (groupId, subgroups) => {
    try {
      const response = await fetch(ADD_PRODUCT_SUBGROUPS_BULK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productGroupId: Number(groupId),
          subgroups: subgroups.map(name => ({ productSubGroupName: name }))
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`${subgroups.length} SubGroup(s) created successfully!`);
        await getproductSubGroup(1);
        return { success: true };
      } else {
        toast.error(data.errorMessage || 'Failed to create subgroups');
        return { success: false, message: data.errorMessage };
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
      return { success: false, message: error.message };
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log(values, "Submitting form");

    try {
      const url = edit
        ? `${UPDATE_PRODUCT_SUBGROUP_URL}/${currentproductSubGroup.id}`
        : ADD_PRODUCT_SUBGROUP_URL;
      const method = edit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(
          `SubGroup ${edit ? 'updated' : 'added'} successfully`,
        );
        resetForm();
        setEdit(false);
        setCurrentproductSubGroup({
          productSubGroupName: '',
          groupId: '',
        });
        await getproductSubGroup(pagination.currentPage);
        return { success: true };
      } else {
        toast.error(data.errorMessage || 'Operation failed');
        return { success: false, message: data.errorMessage };
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
      return { success: false, message: error.message };
    } finally {
      setSubmitting(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    getproductSubGroup(newPage);
  };

  return {
    productSubGroup,
    edit,
    currentproductSubGroup,
    groups,
    pagination,
    handleDelete,
    handleUpdate,
    handleSubmit,
    handleBulkCreate,
    handleBulkUpdate, // Add this
    handlePageChange,
  };
};

export default useproductSubGroup;