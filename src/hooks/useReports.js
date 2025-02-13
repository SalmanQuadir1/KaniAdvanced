import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { GET_BUDGET_URL, DELETE_BUDGET_URL, UPDATE_BUDGET_URL, ADD_BUDGET_URL, VIEW_ALL_SUPPLIER_URL, VIEW_ORDERNO, GET_PRODUCTSID_URL, VIEW_ALL_CUSTOMER } from "../Constants/utils";
import { fetchProductGroup } from '../redux/Slice/ProductGroup';
import { fetchOrderType } from '../redux/Slice/OrderTypeSlice';
import { fetchsupplier } from '../redux/Slice/SupplierSlice';
import OrderNo from '../redux/Slice/OrderNo';

const useReports = () => {
    const [productGroup, setproductGroup] = useState([])
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const [Supplier, setSupplier] = useState([])
    const [Customer, setCustomer] = useState([])
    const [prodId, setprodId] = useState([])
    const [orderNo, setorderNo] = useState([])
    const { token } = currentUser;
    const [Budget, setBudget] = useState([]);
    const [edit, setEdit] = useState(false);
    const [currentBudget, setCurrentBudget] = useState({ currentBudget: '', productGroup: {}, orderType: {}, startDate: '', toDate: "",revisedBudget:"",revisedDate:"" });

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProductGroup(token))
        dispatch(fetchOrderType(token))
        
     
    }, []);

    const { data } = useSelector((state) => state?.persisted?.productGroup);

    const orderType= useSelector((state) => state?.persisted?.orderType?.data);

    useEffect(() => {
   
        setproductGroup(data)
    }, [data])
    
console.log(orderType,"heyyji");

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 0
    });

    useEffect(() => {
        getBudget(pagination.currentPage);
    }, [currentBudget]);

    const getBudget = async (page) => {
        try {
            const response = await fetch(`${GET_BUDGET_URL}?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            // console.log(data,"from url");
            setBudget(data?.content);
            setPagination({
                totalItems: data.totalElements,
                pagUnitList: data.content,
                totalPages: data.totalPages,
                currentPage: data.number + 1,
                itemsPerPage: data.size
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Budget");
        }
    };





    const getSupplier = async (page) => {
        try {
          const response = await fetch(`${VIEW_ALL_SUPPLIER_URL}?page=${page||1}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          // console.log(data,"from url");
          setSupplier(data);
        
        } catch (error) {
          console.error(error);
          toast.error('Failed to fetch Customer');
        }
      };

      const getCustomer = async (page) => {
        try {
          const response = await fetch(`${VIEW_ALL_CUSTOMER}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          // console.log(data,"from url");
          setCustomer(data);
        
        } catch (error) {
          console.error(error);
          toast.error('Failed to fetch Customer');
        }
      };

      const getOrderNo = async (page) => {
        try {
          const response = await fetch(`${VIEW_ORDERNO}?page=${page||1}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          // console.log(data,"from url");
          setorderNo(data);
        
        } catch (error) {
          console.error(error);
          toast.error('Failed to fetch Customer');
        }
      };
      const getProdId = async (page) => {
        try {
          const response = await fetch(`${GET_PRODUCTSID_URL}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          // console.log(data,"from url");
          setprodId(data);
        
        } catch (error) {
          console.error(error);
          toast.error('Failed to fetch Customer');
        }
      };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            const response = await fetch(`${DELETE_BUDGET_URL}${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(`Budget Deleted Successfully !!`);

                // Check if the current page becomes empty
                const isCurrentPageEmpty = Budget.length === 1;

                if (isCurrentPageEmpty && pagination.currentPage > 1) {
                    const previousPage = pagination.currentPage - 1;
                    handlePageChange(previousPage);
                } else {
                    getBudget(pagination.currentPage);
                }
            } else {
                toast.error(`${data.errorMessage}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    };



    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log(values,"i am here");
        try {
     
    
            const url = edit ? `${UPDATE_BUDGET_URL}/${currentBudget.id}` : ADD_BUDGET_URL;
            const method = edit ? "PUT" : "POST";
    
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(values)
            });
    
            const data = await response.json();
            if (response.ok) {
                toast.success(`Budget ${edit ? 'updated' : 'added'} successfully`);
                resetForm();
                setEdit(false);
                setCurrentBudget({
                    currentBudget: '',
                    productGroup: {},
                    orderType: {},
                    startDate: '',
                    toDate: '',
                    revisedBudget: '',
                    revisedDate: ''
                });
                // Optionally, refresh the budget list here
                // getBudget(pagination.currentPage);
            } else {
                toast.error(`${data.errorMessage}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };
    

    const handlePageChange = (newPage) => {

        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        getBudget(newPage); // API is 0-indexed for pages
    };

    return {
        productGroup,
        Supplier,
        orderType,
        getSupplier,
        getOrderNo,
        getProdId,
        orderNo,
        prodId,
        getCustomer,
        Customer
    };
};

export default useReports;
