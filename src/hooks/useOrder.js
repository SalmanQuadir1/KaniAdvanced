import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { GET_PRODUCTIDD_URL, VIEW_ALL_CUSTOMER, VIEW_ALL_ORDERTYPE } from "../Constants/utils";

const useorder = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const [orderTypee, setorderType] = useState([]);
    const [customer, setcustomer] = useState([])
    const [edit, setEdit] = useState(false);
    const [currentorderType, setCurrentorderType] = useState({
        orderTypeName:"",
    });
    const [productId, setproductId] = useState([])

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

    const handleUpdate = (e, item) => {
        e.preventDefault();
        setEdit(true);
console.log(item,"hey");
        setCurrentorderType(item);
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log(values, "logg");
        try {
            const url = edit ? `${UPDATE_ORDERTYPE_URL}/${currentorderType.id}` : ADD_ORDERTYPE_URL;
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
                toast.success(`orderType ${edit ? 'updated' : 'added'} successfully`);
                resetForm();
                setEdit(false);
                setCurrentorderType({
                    orderTypeName: ""
                });
                // getorderType(pagination.currentPage); // Fetch updated orderType
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

    const handlePageChange = (newPage) => {

        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        getorderType(newPage); // API is 0-indexed for pages
    };

    return {
        orderTypee,
        edit,
        currentorderType,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
        getorderType,
        productId,
        getprodId,
        getCustomer,
        customer
    };
};

export default useorder;
