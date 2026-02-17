import { useState, useEffect, useCallback } from 'react'; // Add useCallback
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  UPDATE_PRODUCT_GROUP_URL,
  ADD_PRODUCT_GROUP_URL,
  DELETE_PRODUCT_GROUP_URL,
  GET_PRODUCT_GROUP_URL,
} from '../Constants/utils';

const useproductGroup = () => {
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const [productGroup, setproductGroup] = useState([]);
  const [edit, setEdit] = useState(false);
  const [currentproductGroup, setCurrentproductGroup] = useState({
    productGroupName: '',
  });

  const [pagination, setPagination] = useState({
    totalItems: 0,
    data: [],
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 0,
  });

  // Fix 1: Change the useEffect dependency
  useEffect(() => {
    getproductGroup(pagination.currentPage);
  }, [pagination.currentPage]); // Changed from currentproductGroup to pagination.currentPage

  const getproductGroup = async (page) => {
    try {
      const response = await fetch(`${GET_PRODUCT_GROUP_URL}?page=${page }`, { // Fix: subtract 1 for zero-indexed API
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data, "55555555555555555");
      
      setproductGroup(data?.content);
      setPagination({
        totalItems: data.totalElements,
        data: data.content,
        totalPages: data.totalPages,
        currentPage: data.number + 1,
        itemsPerPage: data.size,
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch productGroup');
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      const response = await fetch(`${DELETE_PRODUCT_GROUP_URL}${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Product_Group Deleted Successfully !!`);

        // Check if the current page becomes empty
        const isCurrentPageEmpty = productGroup.length === 1;

        if (isCurrentPageEmpty && pagination.currentPage > 1) {
          const previousPage = pagination.currentPage - 1;
          handlePageChange(previousPage);
        } else {
          getproductGroup(pagination.currentPage);
        }
      } else {
        toast.error(`${data.errorMessage}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    }
  };

  const handleUpdate = (e, item) => {
    e.preventDefault();
    setEdit(true);
    setCurrentproductGroup(item);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log(values, 'logg');
    try {
      const url = edit
        ? `${UPDATE_PRODUCT_GROUP_URL}/${currentproductGroup.id}`
        : ADD_PRODUCT_GROUP_URL;
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
          `productGroup ${edit ? 'updated' : 'added'} successfully`,
        );
        resetForm();
        setEdit(false);
        setCurrentproductGroup({
          productGroupName: '',
        });
        // Fetch the current page after successful operation
        getproductGroup(pagination.currentPage);
      } else {
        toast.error(`${data.errorMessage}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePageChange = (newPage) => {
    // Fix 2: Ensure newPage is a number and valid
    if (newPage && newPage !== pagination.currentPage) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
      // The useEffect will automatically call getproductGroup due to pagination.currentPage dependency
    }
  };

  return {
    productGroup,
    edit,
    currentproductGroup,
    pagination,
    handleDelete,
    handleUpdate,
    handleSubmit,
    handlePageChange,
  };
};

export default useproductGroup;