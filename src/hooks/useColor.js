import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  ADD_COLOR_URL,
  GET_COLOR_URL,
  UPDATE_COLOR_URL,
  DELETE_COLOR_URL,
} from '../Constants/utils';

const useColors = () => {
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const [colors, setColors] = useState([]);
  const [edit, setEdit] = useState(false);
  const [currentColor, setCurrentColor] = useState({ colorName: '' });

  const [pagination, setPagination] = useState({
    totalItems: 0,
    data: [],
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 0,
  });

  useEffect(() => {
    getColors(pagination.currentPage);
  }, []);

  const getColors = async (page) => {
    try {
      const response = await fetch(`${GET_COLOR_URL}?page=${page-1}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setColors(data.content);
      setPagination({
        totalItems: data.totalElements,
        data: data.content,
        totalPages: data.totalPages,
        currentPage: data.number + 1,
        itemsPerPage: data.size,
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch Colors');
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      const response = await fetch(`${DELETE_COLOR_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success(`Color Deleted successfully`);

        // Check if the current page becomes empty
        const isCurrentPageEmpty = colors.length === 1;

        if (isCurrentPageEmpty && pagination.currentPage > 1) {
          const previousPage = pagination.currentPage - 1;
          handlePageChange(previousPage);
        } else {
          getColors(pagination.currentPage);
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
    console.log(item,"kkkkkkkkkkk");
    
    e.preventDefault();
    setEdit(true);
    setCurrentColor(item);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log(values, 'sdcsdcdscsd');

    try {
      const url = edit ? UPDATE_COLOR_URL : ADD_COLOR_URL;
      const method = edit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Ensure token is included
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Design Group ${edit ? 'updated' : 'added'} successfully`);
        resetForm();
        setSubmitting(false);
        edit? navigation.navigate('/configurator/addDesigngroup') :
        setCurrentColor({ colorName: '' });
        getColors(pagination.currentPage); // Fetch updated colors
      } else {
        toast.error(data.errorMessage);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    getColors(newPage); // API is 0-indexed for pages
  };

  return {
    colors,
    edit,
    currentColor,
    pagination,
    handleDelete,
    handleUpdate,
    handleSubmit,
    handlePageChange,
  };
};

export default useColors;
