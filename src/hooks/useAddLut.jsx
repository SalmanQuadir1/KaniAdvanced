import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// import { GET_Lut_URL, DELETE_Lut_URL, UPDATE_Lut_URL, ADD_Lut_URL } from "../Constants/utils";
import { ADD_Lut_URL, DELETE_Lut_URL, GET_LutBYID, GET_Lut_URL, UPDATELut_URL } from "../Constants/utils";
import { fetchHsnCode } from '../redux/Slice/HsnCodeSlice';
import { useNavigate } from 'react-router-dom';
const useAddLut = (numberingDetails) => {

    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const [Luts, setLut] = useState([]);
    const [lutNumbers, setlutNumbers] = useState([])

    const [edit, setEdit] = useState(false);
    const dispatch = useDispatch();

const navigate= useNavigate()
    const [currentAddLut, setcurrentAddLut] = useState({


        lutNumber: "",
        fromDate: "",
        toDate: "",


    });







    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 10,
        totalItems: 0
    });

    const getLut = async (page = 1) => {
        setLoading(true);
        try {
            const response = await fetch(`${GET_Lut_URL}?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            // Check if response is OK (status 200-299)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Handle empty response
            const text = await response.text();
            if (!text) {
                throw new Error("Empty response from server");
            }

            const data = JSON.parse(text);
            console.log("Luts data:", data);

            // Update state with pagination info if available
            setLut(data || []);
            setPagination(prev => ({
                ...prev,
                currentPage: data.number + 1 || 1,
                totalPages: data.totalPages || 1,
                totalItems: data.totalElements || 0
            }));

        } catch (error) {
            console.error("Fetch error:", error);
            toast.error(error.message || "Failed to fetch Luts");
            setLut([]); // Reset to empty array on error
        } finally {
            setLoading(false);
        }
    };

    // Usage with pagination






    const GetLutById = async (id) => {
        console.log("heere");
        try {
            const response = await fetch(`${GET_LutBYID}/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const data = await response.json();
            console.log(data + "xsdfghjkl")
            if (response.ok) {
                console.log("get Material data", data);
                setLut(data);
                return data; // Return the fetched data
            } else {
                toast.error(`${data.errorMessage}`);
                return null;
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
            return null;
        }
    };

    const handleDelete = async (e, id) => {
        console.log(id, "del");
        e.preventDefault();
        try {
            const response = await fetch(`${DELETE_Lut_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            // const data = await response.json();
            if (response.ok) {
                toast.success(`Lut Deleted Successfully !!`);

                // Check if the current page becomes empty
                const isCurrentPageEmpty = Lut.length === 1;

                if (isCurrentPageEmpty && pagination.currentPage > 1) {
                    const previousPage = pagination.currentPage - 1;
                    handlePageChange(previousPage);
                } else {
                    getLut(pagination.currentPage);
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
        setcurrentAddLut(item);
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {


        console.log(values, "at sumbit");




        try {
            const url = ADD_Lut_URL;
            const method = "POST";

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
              
                edit?
                toast.success(`Lut Updated successfully`):
                 toast.success(`Lut added successfully`)
                 setcurrentAddLut ({


        lutNumber: "",
        fromDate: "",
        toDate: "",


    });


                 setEdit(false);
                 getLut()
                
                ;
                // Fetch updated Lut
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









    const handleCreateLut = async (values) => {

        // const formData={...values,...numberingDetails}

        console.log(values, "Lutcreate");

        try {
            const url = ADD_LutEntry_URL;
            const method = "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(values)
            });

            //  const data = await response.json();
            let data;
            try {
                // Try to parse JSON safely
                data = await response.json();
            } catch {
                console.log(data, "catccccccch");
                data = { errorMessage: response.errorMessage };
            }
            if (response.ok) {
                toast.success(`Lut Entry added successfully`);
                // Fetch updated Lut
            } else {
                console.log("i am in error else ");
                toast.error(`${data.errorMessage}`);
            }
        } catch (error) {
            console.error(error, response);
            console.log("i am in error catch ");
            toast.error("An error occurred");
        } finally {
            console.log("i am in Finally ");
            setSubmitting(false);
        }
    };

    const handlePageChange = (newPage) => {

        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        getLut(newPage); // API is 0-indexed for pages
    };

    return {
        Luts,
        edit,
        currentAddLut,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,

        GetLutById,
        getLut,

        handleCreateLut
    };
};

export default useAddLut;
