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
        designName: "",
        designCode: "",
        productGroup: {}
    });

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 0
    });

    // Fetch data when page changes
    useEffect(() => {
        if (pagination.currentPage > 0) {
            getDesign(pagination.currentPage);
        }
    }, [pagination.currentPage]);

    const getDesign = async (page) => {
        try {
            if (page < 1) {
                console.error("Invalid page number:", page);
                return;
            }
            
            const apiPage = Math.max(0, page ); // Fixed: subtract 1 for 0-indexed API
            console.log("Fetching page:", page, "API page:", apiPage);
            
            const response = await fetch(`${GET_DESIGN_URL}?page=${apiPage}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            console.log("API Response:", data);
            
            // Transform the data to include productGroup object
            const transformedContent = data?.content?.map(item => ({
                ...item,
                productGroup: item.productGroupId ? {
                    id: item.productGroupId,
                    productGroupName: item.productGroupName
                } : {}
            }));
            
            setDesign(transformedContent || []);
            setPagination({
                totalItems: data.totalElements,
                data: transformedContent || [],
                pagUnitList: transformedContent || [],
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
        console.log(item, "hey");
        
        // Transform the flat data into the expected format
        const transformedItem = {
            ...item,
            productGroup: item.productGroupId ? {
                id: item.productGroupId,
                productGroupName: item.productGroupName
            } : {}
        };
        
        setCurrentDesign(transformedItem);
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log(values, "logg");
        
        // Prepare the data for API - send full productGroup object for both add and update
        const apiValues = {
            designName: values.designName,
            designCode: values.designCode,
            productGroup: values.productGroup // Send full productGroup object for both operations
        };
        
        // Add id only for update
        if (edit && currentDesign.id) {
            apiValues.id = currentDesign.id;
        }
        
        try {
            const url = edit ? `${UPDATE_DESIGN_URL}/update/${currentDesign.id}` : ADD_DESIGN_URL;
            const method = edit ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(apiValues)
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(`Design ${edit ? 'updated' : 'added'} successfully`);
                resetForm();
                setEdit(false);
                setCurrentDesign({
                    designName: "",
                    designCode: "",
                    productGroup: {}
                });
                
                if (edit) {
                    // Stay on current page for update
                    getDesign(pagination.currentPage);
                } else {
                    // Go to first page for new item
                    setPagination(prev => ({ ...prev, currentPage: 1 }));
                    getDesign(1);
                }
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
        console.log("Page changing to:", newPage);
        const safePage = Math.max(1, newPage);
        setPagination((prev) => ({ ...prev, currentPage: safePage }));
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