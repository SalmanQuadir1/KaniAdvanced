import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { GET_SIZE_URL, DELETE_SIZE_URL, UPDATE_SIZE_URL, ADD_SIZE_URL } from "../Constants/utils";

const useSize = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const [Size, setSize] = useState([]);
    const [edit, setEdit] = useState(false);
    const [currentSize, setCurrentSize] = useState({
        sizeName:"",
        sizeCode:"",
    });

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 0
    });

    useEffect(() => {
        getSize(pagination.currentPage);
    }, [currentSize]);

    const getSize = async (page) => {
        
        try {
            const response = await fetch(`${GET_SIZE_URL}?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            setSize(data?.content);
            setPagination({
                totalItems: data.totalElements,
                pagUnitList: data.content,
                totalPages: data.totalPages,
                currentPage: data.number + 1,
                itemsPerPage: data.size
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Size");
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            const response = await fetch(`${DELETE_SIZE_URL}${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(`Size Deleted Successfully !!`);

                // Check if the current page becomes empty
                const isCurrentPageEmpty = Size.length === 1;

                if (isCurrentPageEmpty && pagination.currentPage > 1) {
                    const previousPage = pagination.currentPage - 1;
                    handlePageChange(previousPage);
                } else {
                    getSize(pagination.currentPage);
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
      

        setCurrentSize(item);
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log(values, "logg");
        try {
            const url = edit ? `${UPDATE_SIZE_URL}/${currentSize.id}` : ADD_SIZE_URL;
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
                toast.success(`Size ${edit ? 'updated' : 'added'} successfully`);
                resetForm();
                setEdit(false);
                setCurrentSize({
                    SizeName: ""
                });
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

    const handlePageChange = (newPage) => {

        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        getSize(newPage); // API is 0-indexed for pages
    };

    return {
        Size,
        edit,
        currentSize,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
    };
};

export default useSize;
