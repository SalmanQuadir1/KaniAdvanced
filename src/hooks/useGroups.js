import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// import { GET_Groups_URL, DELETE_Groups_URL, UPDATE_Groups_URL, ADD_Groups_URL } from "../Constants/utils";
import { ADD_Groups_URL } from "../Constants/utils";
const useGroups = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const [Groups, setGroups] = useState([]);
    const [edit, setEdit] = useState(false);
    const [currentGroups, setCurrentGroups] = useState({
       group:"",
       subGroups:[]
    });

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage:0
    });

    useEffect(() => {
        getGroups(pagination.currentPage);
    }, []);

    const getGroups = async (page) => {
        // try {
        //     const response = await fetch(`${GET_Groups_URL}?page=${page}`, {
        //         method: "GET",
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Authorization": `Bearer ${token}`
        //         }
        //     });
        //     const data = await response.json();
        //     setGroups(data.content);
        //     setPagination({
        //         totalItems: data.totalElements,
        //         pagUnitList: data.content,
        //         totalPages: data.totalPages,
        //         currentPage: data.number + 1,
        //         itemsPerPage:data.size
        //     });
        // } catch (error) {
        //     console.error(error);
        //     toast.error("Failed to fetch Groups");
        // }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        // try {
        //     const response = await fetch(`${DELETE_Groups_URL}${id}`, {
        //         method: 'DELETE',
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Authorization": `Bearer ${token}`
        //         }
        //     });

        //     const data = await response.json();
        //     if (response.ok) {
        //         toast.success(`Groups Deleted Successfully !!`);

        //         // Check if the current page becomes empty
        //         const isCurrentPageEmpty = Groups.length === 1;

        //         if (isCurrentPageEmpty && pagination.currentPage > 1) {
        //             const previousPage = pagination.currentPage - 1;
        //             handlePageChange(previousPage);
        //         } else {
        //             getGroups(pagination.currentPage);
        //         }
        //     } else {
        //         toast.error(`${data.errorMessage}`);
        //     }
        // } catch (error) {
        //     console.error(error);
        //     toast.error("An error occurred");
        // }
    };

    const handleUpdate = (e, item) => {
        e.preventDefault();
        setEdit(true);
        setCurrentGroups(item);
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        // try {
        //     const url = edit ? `${UPDATE_Groups_URL}/${currentGroups.id}` : ADD_Groups_URL;
        //     const method = edit ? "PUT" : "POST";

        //     const response = await fetch(url, {
        //         method: method,
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Authorization": `Bearer ${token}`
        //         },
        //         body: JSON.stringify(values)
        //     });

        //     const data = await response.json();
        //     if (response.ok) {
        //         toast.success(`Groups ${edit ? 'updated' : 'added'} successfully`);
        //         resetForm();
        //         setEdit(false);
        //         setCurrentGroups({
        //             address: "",
        //             city: "",
        //             state: "",
        //             gstin: "",
        //             pinCode: "",
        //         });
        //         getGroups(pagination.currentPage); // Fetch updated Groups
        //     } else {
        //         toast.error(`${data.errorMessage}`);
        //     }
        // } catch (error) {
        //     console.error(error, response);
        //     toast.error("An error occurred");
        // } finally {
        //     setSubmitting(false);
        // }
    };

    const handlePageChange = (newPage) => {

        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        getGroups(newPage); // API is 0-indexed for pages
    };

    return {
        Groups,
        edit,
        currentGroups,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
    };
};

export default useGroups;
