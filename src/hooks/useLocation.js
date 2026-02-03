import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { GET_LOCATION_URL, DELETE_LOCATION_URL, UPDATE_LOCATION_URL, ADD_LOCATION_URL, VIEW_ALL_LOCATIONS } from "../Constants/utils";

const useLocation = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const [location, setLocation] = useState([]);
    const [Locations, setLocations] = useState([])
    const [edit, setEdit] = useState(false);
    const [currentLocation, setCurrentLocation] = useState({
        address: "",
        locationId: "",
        locationName: "",
        city: "",
        state: "",
        gstin: "",
        pinCode: "",
    });

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 0
    });

    useEffect(() => {
        getLocation(pagination.currentPage);
    }, []);

    const getLocation = async (page) => {
        try {
            const response = await fetch(`${GET_LOCATION_URL}?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            setLocation(data.content.map(item => {
                const { locationId, ...rest } = item;
                return rest;
            }));
            setPagination({
                totalItems: data.totalElements,
                pagUnitList: data.content,
                totalPages: data.totalPages,
                currentPage: data.number + 1,
                itemsPerPage: data.size
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Location");
        }
    };
    const getAllLocation = async () => {
        console.log("iam here");
        try {
            const response = await fetch(`${VIEW_ALL_LOCATIONS}`, {
                method: "GET",
                headers: {
                    // "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data, "pr datatata")

            setLocations(data);

        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Product");
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            const response = await fetch(`${DELETE_LOCATION_URL}${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(`Location Deleted Successfully !!`);

                // Check if the current page becomes empty
                const isCurrentPageEmpty = location.length === 1;

                if (isCurrentPageEmpty && pagination.currentPage > 1) {
                    const previousPage = pagination.currentPage - 1;
                    handlePageChange(previousPage);
                } else {
                    getLocation(pagination.currentPage);
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
        setCurrentLocation(item);
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const url = edit ? `${UPDATE_LOCATION_URL}/${currentLocation.id}` : ADD_LOCATION_URL;
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
                toast.success(`Location ${edit ? 'updated' : 'added'} successfully`);
                resetForm();
                setEdit(false);
                setCurrentLocation({
                    address: "",
                    city: "",
                    state: "",
                    gstin: "",
                    pinCode: "",
                });
                getLocation(pagination.currentPage); // Fetch updated Location
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
        getLocation(newPage); // API is 0-indexed for pages
    };

    return {
        location,
        edit,
        currentLocation,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
        getAllLocation,
        Locations
    };
};

export default useLocation;
