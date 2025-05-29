import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { GET_CUSTOMER_URL, DELETE_CUSTOMER_URL, UPDATE_CUSTOMER_URL, ADD_CUSTOMER_URL,GET_CUSTOMER_ID_URL, GET_CUSTOMERR_URL } from "../Constants/utils";
import { fetchCustomerGroup } from '../redux/Slice/CustomerGroupSlice';
import { useNavigate } from 'react-router-dom';


const useCustomer = () => {
    const navigate = useNavigate()
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const [Customer, setCustomer] = useState([]);
    const [Customerr, setCustomerr ] = useState([]);
    const [edit, setEdit] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState({ currentCustomer: '', productGroup: {}, orderType: {}, startDate: '', toDate: "",revisedCustomer:"",revisedDate:"" });

    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(fetchCustomerGroup(token));
    }, []);

    const [pagination, setPagination] = useState({
      totalItems: 0,
      data: [],
      totalPages: 0,
      currentPage: 1,
      itemsPerPage: 0,
    });

    useEffect(() => {
      getCustomer(pagination.currentPage);
    }, [currentCustomer]);

    const getCustomerr = async (page) => {
      try {
        const response = await fetch(`${GET_CUSTOMER_URL}?page=${page||1}`, {
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

    const getCustomer = async (page, filters = {}) => {
      console.log("iam here");
      console.log(filters, "filllllllll");
      try {
          const response = await fetch(`${GET_CUSTOMERR_URL}?page=${page || 0}`, {
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

          // Check if the current page becomes empty
          const isCurrentPageEmpty = Customer.length === 1;

          if (isCurrentPageEmpty && pagination.currentPage > 1) {
            const previousPage = pagination.currentPage - 1;
            handlePageChange(previousPage);
          } else {
            getCustomer(pagination.currentPage);
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
                console.log("get Material data", data);
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
          body: JSON.stringify(values),
        });

        const data = await response.json();
        if (response.ok) {
          toast.success(`Customer ${edit ? 'updated' : 'added'} successfully`);
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
        getCustomer(newPage); // API is 0-indexed for pages
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
