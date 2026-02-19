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
  UPDATE_PRODUCT_GROUP_URL, // You'll need this constant
} from '../Constants/utils';

const useproductSubGroup = () => {
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const [productSubGroup, setProductSubGroup] = useState([]);
  const [groups, setGroups] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null); // Track which group is being edited
  const [editingSubgroups, setEditingSubgroups] = useState({}); // Track subgroup edits {subgroupId: {name, isEditing}}
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

  // Start editing a group name
  const handleEditGroup = (group) => {
    setEditingGroup({
      id: group.id,
      name: group.productGroupName,
    });
  };

  // Update group name
  const handleUpdateGroup = async (groupId, newName) => {
    try {
      const response = await fetch(`${UPDATE_PRODUCT_GROUP_URL}/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productGroupName: newName }),
      });

      if (response.ok) {
        toast.success('Group updated successfully');
        setEditingGroup(null);
        getproductSubGroup(pagination.currentPage);
        getGroups();
      } else {
        const data = await response.json();
        toast.error(data.errorMessage || 'Failed to update group');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    }
  };

  // Start editing a subgroup
  const handleEditSubgroup = (subgroupId, currentName) => {
    setEditingSubgroups({
      ...editingSubgroups,
      [subgroupId]: {
        name: currentName,
        isEditing: true
      }
    });
  };

  // Update subgroup
  const handleUpdateSubgroup = async (subgroupId) => {
    const newName = editingSubgroups[subgroupId]?.name;
    
    try {
      const response = await fetch(`${UPDATE_PRODUCT_SUBGROUP_URL}/${subgroupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          productSubGroupName: newName 
        }),
      });

      if (response.ok) {
        toast.success('Subgroup updated successfully');
        // Remove from editing state
        const newEditing = { ...editingSubgroups };
        delete newEditing[subgroupId];
        setEditingSubgroups(newEditing);
        getproductSubGroup(pagination.currentPage);
      } else {
        const data = await response.json();
        toast.error(data.errorMessage || 'Failed to update subgroup');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    }
  };

  // Cancel editing
  const cancelEdit = (subgroupId) => {
    const newEditing = { ...editingSubgroups };
    delete newEditing[subgroupId];
    setEditingSubgroups(newEditing);
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
        getproductSubGroup(1);
        return { success: true };
      } else {
        toast.error(`${data.errorMessage || 'Failed to create subgroups'}`);
        return { success: false, error: data.errorMessage };
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
      return { success: false, error: error.message };
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    getproductSubGroup(newPage);
  };

  return {
    productSubGroup,
    edit,
    editingGroup,
    editingSubgroups,
    currentproductSubGroup,
    groups,
    pagination,
    handleDelete,
    handleEditGroup,
    handleUpdateGroup,
    handleEditSubgroup,
    handleUpdateSubgroup,
    cancelEdit,
    handleBulkCreate,
    handlePageChange,
  };
};

export default useproductSubGroup;