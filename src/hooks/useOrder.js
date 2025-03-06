import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { GET_PRODUCTIDD_URL, VIEW_ALL_ORDERTYPE ,VIEW_ALL_ORDERS,VIEW_ALL_CUSTOMER, ADD_ORDER_URL, VIEW_ORDERNO, VIEW_ALL_SUPPLIER_URL, VIEW_ALL_PRODID, GET_PRODUCTIDDD_URL, } from "../Constants/utils";
import { useNavigate } from 'react-router-dom';
import { fetchorder } from '../redux/Slice/OrderNo';
// import { GET_PRODUCTIDD_URL, VIEW_ALL_CUSTOMER, VIEW_ALL_ORDERTYPE } from "../Constants/utils";

const useorder = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const [orderTypee, setorderType] = useState([]);
    const [orderNo, setorderNo] = useState([])
    const [Order, setOrder] = useState([]);
    const [customer, setcustomer] = useState([])
    const [productIdd, setproductIdd] = useState([])
    const [supplier, setSupplier] = useState([])

    const [orderProduct, setorderProduct] = useState([])
    const [edit, setEdit] = useState(false);
    const [currentorderType, setCurrentorderType] = useState({
        orderTypeName:"",
    });
    const [productId, setproductId] = useState([])
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 0
    });

    useEffect(() => {
        getorderType(pagination.currentPage);
    }, [currentorderType]);

useEffect(() => {
        
        dispatch(fetchorder(token))
    }, []);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log(values,"valuuuueee");
      
        try {
            const url =`${ADD_ORDER_URL}` ;
            const method =  "POST";

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
                toast.success(`Order Added successfully`);
                navigate("/Order/ViewOrder") 
                resetForm();
               
                // getSize(pagination.currentPage); // Fetch updated Size
            } else {
                toast.error(`${data.errorMessage}`);
            }
        } catch (error) {
            console.error(error, response);
            toast.error("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };



    const getorderType = async (page) => {
        try {
            const response = await fetch(`${VIEW_ALL_ORDERTYPE}?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data,"dataaaaaa");
            setorderType(data);
            setPagination({
                totalItems: data.totalElements,
                pagUnitList: data.content,
                totalPages: data.totalPages,
                currentPage: data.number + 1,
                itemsPerPage: data.size
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch orderType");
        }
    };

    const getorderNumber = async (page) => {
        try {
            const response = await fetch(`${VIEW_ORDERNO}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data,"dataaaaaa");
            setorderNo(data);
          
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch order Number");
        }
    };

  
    const getprodId = async () => {
        try {
            const response = await fetch(`${GET_PRODUCTIDD_URL}/all-productsIds`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data,"dataaaaaassss");
            setproductId(data);
          
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch orderType");
        }
    };
   


    const getOrderProduct = async () => {
        try {
            const response = await fetch(`${GET_PRODUCTIDD_URL}/all-productsIds`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data,"dataaaaaassss");
            setproductId(data);
          
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch orderType");
        }
    };
      



    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            const response = await fetch(`${DELETE_ORDERTYPE_URL}${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(`orderType Deleted Successfully !!`);

                // Check if the current page becomes empty
                const isCurrentPageEmpty = orderType.length === 1;

                if (isCurrentPageEmpty && pagination.currentPage > 1) {
                    const previousPage = pagination.currentPage - 1;
                    handlePageChange(previousPage);
                } else {
                    getorderType(pagination.currentPage);
                }
            } else {
                toast.error(`${data.errorMessage}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    };

//     const handleUpdate = (e, item) => {
//         e.preventDefault();
//         setEdit(true);
// console.log(item,"hey");s
//         setCurrentorderType(item);
//     };

const handleUpdate = (e, item) => {
    e.preventDefault();
    console.log("Item passed to handleUpdate:", item);

    const uniqueId = item.id || item.orderNo || item.productId;

    if (uniqueId) {
        console.log("Navigating to:", `/Order/updateorder/${uniqueId}`);
        navigate(`/Order/updateorder/${uniqueId}`);
    } else {
        console.error("Item or its unique identifier is missing");
        toast.error("Unable to update: Item or ID is missing.");
    }
};




    // const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    //     console.log(values, "logg");
    //     try {
    //         const url = edit ? `${UPDATE_ORDERTYPE_URL}/${currentorderType.id}` : ADD_ORDERTYPE_URL;
    //         const method = edit ? "PUT" : "POST";

    //         const response = await fetch(url, {
    //             method: method,
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${token}`
    //             },
    //             body: JSON.stringify(values)
    //         });

    //         const data = await response.json();
    //         if (response.ok) {
    //             toast.success(`orderType ${edit ? 'updated' : 'added'} successfully`);
    //             resetForm();
    //             setEdit(false);
    //             setCurrentorderType({
    //                 orderTypeName: ""
    //             });
    //             // getorderType(pagination.currentPage); // Fetch updated orderType
    //         } else {
    //             toast.error(`${data.errorMessage}`);
    //         }
    //     } catch (error) {
    //         console.error(error, response);
    //         toast.error("An error occurred");
    //     } finally {
    //         setSubmitting(false);
    //     }
    // };


    //  const getOrder = async (page, filters = {}) => {
    //         console.log("Viewwwww");
    //         console.log(filters,"filllllllll");
    //         try {
    //             const response = await fetch(`${ VIEW_ALL_ORDERS}?page=${page||1}`, {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     "Authorization": `Bearer ${token}`
    //                 },
    //                 body: JSON.stringify(filters)
    //             });
    //             const data = await response.json();
    //             console.log(data,"pr datatata")
    
    //             setOrder(data?.content);
    //             setPagination({
    //                 totalItems: data?.totalElements,
    //                 data: data?.content,
    //                 totalPages: data?.totalPages,
    //                 currentPage: data?.number + 1,
    //                 itemsPerPage: data.size
    //             });
    //         } catch (error) {
    //             console.log(error);
    //             toast.error("Failed to fetch Order");
    //         }
    //     };
       
    const getOrder = async (page, filters = {}) => {
        console.log("Fetching orders for page", page); // Log the page number being requested
    
        try {
            const response = await fetch(`${VIEW_ALL_ORDERS}?page=${page || 1}`, {
                method: "POST", // GET method
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body:{
                    
                }
            });
    
            const textResponse = await response.text(); // Get the raw text response
            console.log("Raw Response Text:", textResponse); // Log raw response before parsing
    
            // Try parsing the response only if it's valid JSON
            try {
                const data = JSON.parse(textResponse); // Try parsing as JSON
                console.log("Parsed Response:", data);
    
                if (data?.content) {
                    setOrder(data.content); // Update orders state
                } else {
                    console.log("No orders found in the response");
                    setOrder([]); // Set an empty state
                }
    
                // Update pagination state
                setPagination({
                    totalItems: data?.totalElements || 0,
                    data: data?.content || [],
                    totalPages: data?.totalPages || 0,
                    currentPage: data?.number + 1 || 1,
                    itemsPerPage: data?.size || 0,
                });
            } catch (parseError) {
                console.error("Error parsing response as JSON:", parseError);
                toast.error("Invalid response format.");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to fetch orders");
            setOrder([]); // Reset to an empty state in case of an error
        }
    };


    const getSupplier = async (page) => {
        try {
            const response = await fetch(`${VIEW_ALL_SUPPLIER_URL}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data,"dataaaaaa");
            setSupplier(data);
          
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch order Number");
        }
    };
   
    const getCustomer = async (page) => {
        try {
            const response = await fetch(`${VIEW_ALL_CUSTOMER}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data,"dataaaaaa");
            setcustomer(data);
            setPagination({
                totalItems: data.totalElements,
                pagUnitList: data.content,
                totalPages: data.totalPages,
                currentPage: data.number + 1,
                itemsPerPage: data.size
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch orderType");
        }
    };
  


    const getProdId = async (page) => {
        try {
            
            const response = await fetch(`${GET_PRODUCTIDDD_URL}/viewCreatedProductId`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data,"dataaaaaa");
            setproductIdd(data);
            setPagination({
                totalItems: data.totalElements,
                pagUnitList: data.content,
                totalPages: data.totalPages,
                currentPage: data.number + 1,
                itemsPerPage: data.size
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch orderType");
        }
    };




    
    const handlePageChange = (newPage) => {
        console.log("Page change requested:", newPage);
    
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        getOrder(newPage); // Correct function name and 1-indexed for user interaction
    };
    

    return {
        Order,
        orderTypee,
        edit,
        currentorderType,
        pagination,
        getOrder,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
        getorderType,
        productId,
        getprodId,
        getCustomer,
        customer,
        getorderNumber,
        orderNo,
        getSupplier,
        supplier,
        getProdId,
        productIdd
    };
};

export default useorder;
