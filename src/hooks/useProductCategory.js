import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { GET_PRODUCTCATEGORY_URL, DELETE_PRODUCTCATEGORY_URL, UPDATE_PRODUCTCATEGORY_URL, ADD_PRODUCTCATEGORY_URL } from "../Constants/utils";

const useproductCategory = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const [productCategory, setproductCategory] = useState([]);
    const [edit, setEdit] = useState(false);
    const [currentproductCategory, setCurrentproductCategory] = useState({
        productCategoryName: "",
    });

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 0
    });

    useEffect(() => {
        getproductCategory(pagination.currentPage);
    }, [currentproductCategory]);

    const getproductCategory = async (page) => {
        try {
            const response = await fetch(`${GET_PRODUCTCATEGORY_URL}?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            setproductCategory(data?.content);
            setPagination({
                totalItems: data.totalElements,
                pagUnitList: data.content,
                totalPages: data.totalPages,
                currentPage: data.number + 1,
                itemsPerPage: data.size
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch productCategory");
        }
    };

    const handleDelete = async (id) => {
      
        try {
            const response = await fetch(`${DELETE_PRODUCTCATEGORY_URL}${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(`productCategory Deleted Successfully !!`);

                // Check if the current page becomes empty
                const isCurrentPageEmpty = productCategory.length === 1;

                if (isCurrentPageEmpty && pagination.currentPage > 1) {
                    const previousPage = pagination.currentPage - 1;
                    handlePageChange(previousPage);
                } else {
                    getproductCategory(pagination.currentPage);
                }
            } else {
                toast.error(`${data.errorMessage}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    };

    const handleUpdate = (item) => {
      
        setEdit(true);
        console.log(item, "hey");
        setCurrentproductCategory(item);
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log(values, "logg");
        try {
            const url = edit ? `${UPDATE_PRODUCTCATEGORY_URL}/${currentproductCategory.id}` : ADD_PRODUCTCATEGORY_URL;
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
                toast.success(`productCategory ${edit ? 'updated' : 'added'} successfully`);
                resetForm();
                setEdit(false);
                setCurrentproductCategory({
                    productCategoryName: ""
                });
                // getproductCategory(pagination.currentPage); // Fetch updated productCategory
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
        getproductCategory(newPage); // API is 0-indexed for pages
    };

    return {
        productCategory,
        edit,
        currentproductCategory,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
    };
};

export default useproductCategory;
