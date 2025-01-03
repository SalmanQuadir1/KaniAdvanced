import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ADD_HSNCODE_URL, GET_HSNCODE_URL, UPDATE_HSNCODE_URL, DELETE_HSNCODE_URL } from "../Constants/utils";

const useHsnCode = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
     const { token } = currentUser;
    const [HsnCode, setHsnCode] = useState([]);
    const [edit, setEdit] = useState(false);
    const [currentHsnCode, setCurrentHsnCode] = useState({ hsnCodeName: '',igst:"",cgst:"",sgst:"",productDescription:"" });
    
    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage:0
        

    });

    useEffect(() => {
        getHsnCode(pagination.currentPage);
    }, []);

    const getHsnCode = async (page) => {
        try {
            const response = await fetch(`${GET_HSNCODE_URL}?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            setHsnCode(data.content);
            setPagination({
                totalItems: data.totalElements,
                data: data.content,
                totalPages: data.totalPages,
                currentPage: data.number + 1,
                itemsPerPage:data.size
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch HsnCode");
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            const response = await fetch(`${DELETE_HSNCODE_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success(`HsnCode Deleted successfully`);

                // Check if the current page becomes empty
                const isCurrentPageEmpty = HsnCode.length === 1;

                if (isCurrentPageEmpty && pagination.currentPage > 1) {
                    const previousPage = pagination.currentPage - 1;
                    handlePageChange(previousPage);
                } else {
                    getHsnCode(pagination.currentPage);
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
        setCurrentHsnCode(item);
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log(values,"jj");
        try {
            const url = edit ? `${UPDATE_HSNCODE_URL}/${currentHsnCode.id}` : ADD_HSNCODE_URL;
            const method = edit ? 'PUT' : 'POST';
    
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Ensure token is included
                },
                body: JSON.stringify(values),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                toast.success(`HsnCode ${edit ? 'updated' : 'added'} successfully`);
                resetForm();
                setEdit(false);
                setCurrentHsnCode({ HsnCodeName: '' });
                getHsnCode(pagination.currentPage); // Fetch updated HsnCode
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
        getHsnCode(newPage); // API is 0-indexed for pages
    };

    return {
        HsnCode,
        edit,
        currentHsnCode,
        pagination,
         handleDelete,
         handleUpdate,
        handleSubmit,
        handlePageChange,
    };
};

export default useHsnCode;
