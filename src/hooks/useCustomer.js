import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { GET_CUSTOMER_URL, DELETE_CUSTOMER_URL, UPDATE_CUSTOMER_URL, ADD_CUSTOMER_URL, GET_CUSTOMER_ID_URL, GET_CUSTOMERR_URL } from "../Constants/utils";
import { fetchCustomerGroup } from '../redux/Slice/CustomerGroupSlice';
import { useNavigate } from 'react-router-dom';


const useCustomer = () => {
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const [Customer, setCustomer] = useState([]);
  const [Customerr, setCustomerr] = useState([]);
  const [edit, setEdit] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState({ currentCustomer: '', productGroup: {}, orderType: {}, startDate: '', toDate: "", revisedCustomer: "", revisedDate: "" });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCustomerGroup(token));
  }, []);

  const [pagination, setPagination] = useState({
    totalItems: 0,
    data: [],
    totalPages: 0,
    currentPage: 0,
    itemsPerPage: 0
  });



  const getCustomerr = async (page) => {
    try {
      const response = await fetch(`${GET_CUSTOMER_URL}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      // console.log(data,"from url");
      setCustomerr(data?.content);
      setPagination({
        totalItems: data.totalElements,
        pagUnitList: data.content,
        totalPages: data.totalPages,
        currentPage: data.number + 1,
        itemsPerPage: data.size,
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch Customer');
    }
  };

  const getCustomer = async (page = 0, filters = {}) => {
    console.log("iam here");
    console.log(filters, "filllllllll");
    try {
      const response = await fetch(`${GET_CUSTOMERR_URL}?page=${page}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(filters)
      });
      const data = await response.json();
      console.log(data, "pr datatata")

      setCustomer(data?.content);
      setPagination({
        totalItems: data?.totalElements,
        data: data?.content,
        totalPages: data?.totalPages,
        currentPage: data?.number + 1,
        itemsPerPage: data.size
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch Product");
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      const response = await fetch(`${DELETE_CUSTOMER_URL}${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Customer Deleted Successfully !!`);

        // Check if the current page has only one item (the one we're deleting)
        // and it's not the first page
        const currentPageData = pagination.data || [];
        const currentPage = pagination.currentPage;

        if (currentPageData.length === 1 && currentPage > 1) {
          // If this was the last item on the page and not first page,
          // go to previous page
          getCustomer(currentPage - 2); // Subtract 2 because API is 0-indexed and we want previous page
        } else {
          // Otherwise, stay on current page and refresh
          getCustomer(pagination.currentPage - 1);
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
    if (item && item.id) {
      navigate(`/customer/updateCustomer/${item.id}`);
    } else {
      console.error("Item or its ID is missing");
    }
  };

  const GetCustomerById = async (id) => {
    try {
      const response = await fetch(`${GET_CUSTOMER_ID_URL}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      const data = await response.json();
      console.log(data + "xsdfghjkl")
      if (response.ok) {
     
        setCurrentCustomer(data);
        return data; // Return the fetched data
      } else {
        toast.error(`${data.errorMessage}`);
        return null;
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
      return null;
    }
  };

  const handleSubmit = async (values) => {
    console.log(values, 'i am here');

    const payload = {
      ...values,
      // At first creation, set customerId to contactNumber
      customerId: values.contactNumber, // 👈 This sends customerId as contactNumber
    };

    console.log(payload, "222222222222");

    try {


      const url = edit
        ? `${UPDATE_CUSTOMER_URL}/${currentCustomer.id}`
        : ADD_CUSTOMER_URL;
      const method = edit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Customer ${edit ? 'updated' : 'added'} successfully`);
        navigate("/customer/viewCustomer")
        //resetForm();
        setEdit(false);
        setCurrentCustomer({
          currentCustomer: '',
          productGroup: {},
          orderType: {},
          startDate: '',
          toDate: '',
          revisedCustomer: '',
          revisedDate: '',
        });
        // Optionally, refresh the Customer list here
        // getCustomer(pagination.currentPage);
      } else {
        toast.error(`${data.errorMessage}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    } finally {
      console.log('Completed');
      // setSubmitting(false);
    }
  };


  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    getCustomer(newPage - 1); // Subtract 1 because API is 0-indexed
  };

  return {
    Customer,
    getCustomer,
    getCustomerr,
    Customerr,
    edit,
    currentCustomer,
    pagination,
    handleDelete,
    handleUpdate,
    handleSubmit,
    handlePageChange,
    GetCustomerById
  };
};

export default useCustomer;
