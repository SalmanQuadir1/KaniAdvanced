import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { GET_WEAVE_URL, DELETE_WEAVE_URL, UPDATE_WEAVE_URL, ADD_WEAVE_URL, VIEW_ALL_WEAVEPAGINATION } from "../Constants/utils";

const useWeave = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const [Weave, setWeave] = useState([]);
    const [edit, setEdit] = useState(false);
    const [currentWeave, setCurrentWeave] = useState({
        weaveName: "",
    });

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 0
    });

    useEffect(() => {
        getWeave(pagination.currentPage);
    }, [currentWeave]);

    const getWeave = async (page) => {
        try {
            const response = await fetch(`${VIEW_ALL_WEAVEPAGINATION}?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            setWeave(data?.content);
            setPagination({
                totalItems: data.totalElements,
                pagUnitList: data.content,
                totalPages: data.totalPages,
                currentPage: data.number + 1,
                itemsPerPage: data.size
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Weave");
        }
    };

    const handleDelete = async (id) => {
      
        try {
            const response = await fetch(`${DELETE_WEAVE_URL}delete/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(`Weave Deleted Successfully !!`);

                // Check if the current page becomes empty
                const isCurrentPageEmpty = Weave.length === 1;

                if (isCurrentPageEmpty && pagination.currentPage > 1) {
                    const previousPage = pagination.currentPage - 1;
                    handlePageChange(previousPage);
                } else {
                    getWeave(pagination.currentPage);
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
        setCurrentWeave(item);
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log(values, "logg");
        try {
            const url = edit ? `${UPDATE_WEAVE_URL}/${currentWeave.id}` : ADD_WEAVE_URL;
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
                toast.success(`Weave ${edit ? 'updated' : 'added'} successfully`);
                resetForm();
                setEdit(false);
                setCurrentWeave({
                    WeaveName: ""
                });
                // getWeave(pagination.currentPage); // Fetch updated Weave
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
        getWeave(newPage); // API is 0-indexed for pages
    };

    return {
        Weave,
        edit,
        currentWeave,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
    };
};

export default useWeave;
