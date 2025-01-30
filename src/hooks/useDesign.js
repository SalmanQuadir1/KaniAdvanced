import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { GET_DESIGN_URL, DELETE_DESIGN_URL, UPDATE_DESIGN_URL, ADD_DESIGN_URL } from "../Constants/utils";

const useDesign = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const [Design, setDesign] = useState([]);
    const [edit, setEdit] = useState(false);
    const [currentDesign, setCurrentDesign] = useState({
        designName:"",
    });

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 0
    });

    useEffect(() => {
        getDesign(pagination.currentPage);
    }, [currentDesign]);

    const getDesign = async (page) => {
        
        try {
            const response = await fetch(`${GET_DESIGN_URL}?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            setDesign(data?.content);
            setPagination({
                totalItems: data.totalElements,
                pagUnitList: data.content,
                totalPages: data.totalPages,
                currentPage: data.number + 1,
                itemsPerPage: data.size
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Design");
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            const response = await fetch(`${DELETE_DESIGN_URL}${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(`Design Deleted Successfully !!`);

                // Check if the current page becomes empty
                const isCurrentPageEmpty = Design.length === 1;

                if (isCurrentPageEmpty && pagination.currentPage > 1) {
                    const previousPage = pagination.currentPage - 1;
                    handlePageChange(previousPage);
                } else {
                    getDesign(pagination.currentPage);
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
        setCurrentDesign(item);
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log(values, "logg");
        try {
            const url = edit ? `${UPDATE_DESIGN_URL}/${currentDesign.id}` : ADD_DESIGN_URL;
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
                toast.success(`Design ${edit ? 'updated' : 'added'} successfully`);
                resetForm();
                setEdit(false);
                setCurrentDesign({
                    DesignName: ""
                });
                // getDesign(pagination.currentPage); // Fetch updated Design
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
        getDesign(newPage); // API is 0-indexed for pages
    };

    return {
        Design,
        edit,
        currentDesign,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
    };
};

export default useDesign;
