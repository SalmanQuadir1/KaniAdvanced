import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  UPDATE_PRODUCT_SUBGROUP_URL,
  ADD_PRODUCT_SUBGROUP_URL,
  ADD_PRODUCT_SUBGROUPS_BULK_URL, // NEW: Bulk endpoint
  DELETE_PRODUCT_SUBGROUP_URL,
  GET_PRODUCT_SUBGROUP_URL,
  GET_GROUPS_URL, // NEW: Add this constant
} from '../Constants/utils';

const useproductSubGroup = () => {
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const [productSubGroup, setProductSubGroup] = useState([]);
  const [groups, setGroups] = useState([]); // NEW: Groups state
  const [edit, setEdit] = useState(false);
  const [currentproductSubGroup, setCurrentproductSubGroup] = useState({
    productSubGroupName: '',
    groupId: null, // NEW: Add groupId
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
    getGroups(); // NEW: Fetch groups
  }, []);

  // NEW: Function to fetch groups
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

 const handleUpdate = (e, item) => {
    e.preventDefault();
    setEdit(true);
    setCurrentproductSubGroup({
      id: item.id, // ADD THIS: Store the subgroup ID
      productSubGroupName: item.productSubGroupName,
      groupId: item.group?.id || item.groupId,
    });
  };

  // NEW: Bulk create function
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

  // Existing single create/update function
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {

    console.log(values, "lklklk");



    // try {
    //   const url = edit
    //     ? `${UPDATE_PRODUCT_SUBGROUP_URL}/${currentproductSubGroup.id}`
    //     : ADD_PRODUCT_SUBGROUP_URL;
    //   const method = edit ? 'PUT' : 'POST';

    //   const response = await fetch(url, {
    //     method: method,
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${token}`,
    //     },
    //     body: JSON.stringify(values),
    //   });

    //   const data = await response.json();
    //   if (response.ok) {
    //     toast.success(
    //       `SubGroup ${edit ? 'updated' : 'added'} successfully`,
    //     );
    //     resetForm();
    //     setEdit(false);
    //     setCurrentproductSubGroup({
    //       productSubGroupName: '',
    //       groupId: '',
    //     });
    //     getproductSubGroup(pagination.currentPage);
    //   } else {
    //     toast.error(`${data.errorMessage}`);
    //   }
    // } catch (error) {
    //   console.error(error);
    //   toast.error('An error occurred');
    // } finally {
    //   setSubmitting(false);
    // }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    getproductSubGroup(newPage);
  };

  return {
    productSubGroup,
    edit,
    currentproductSubGroup,
    groups, // NEW: Return groups
    pagination,
    handleDelete,
    handleUpdate,
    handleSubmit,
    handleBulkCreate, // NEW: Return bulk create function
    handlePageChange,
  };
};

export default useproductSubGroup;