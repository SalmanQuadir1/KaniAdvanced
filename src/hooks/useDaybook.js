import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// import { GET_DayBook_URL, DELETE_DayBook_URL, UPDATE_DayBook_URL, ADD_DayBook_URL } from "../../Constants/utils";
import { fetchProductGroup } from '../redux/Slice/ProductGroup';
import { fetchOrderType } from '../redux/Slice/OrderTypeSlice';
import { useNavigate } from 'react-router-dom';

const useDayBook = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const [DayBook, setDayBook] = useState([]);
    const [edit, setEdit] = useState(false);
    const [currentDayBook, setCurrentDayBook] = useState({ currentDayBook: '', productGroup: {}, orderType: {}, startDate: '', toDate: "", revisedDayBook: "", revisedDate: "" });
    const navigate = useNavigate()
    const dispatch = useDispatch();


    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 0
    });

    useEffect(() => {
        getDayBook(pagination.currentPage);
    }, [currentDayBook]);

    // const getDayBook = async (page) => {
    //     try {
    //         const response = await fetch(`${GET_DayBook_URL}?page=${page}`, {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${token}`
    //             }
    //         });
    //         const data = await response.json();
    //         // console.log(data,"from url");
    //         setDayBook(data?.content);
    //         setPagination({
    //             totalItems: data.totalElements,
    //             pagUnitList: data.content,
    //             totalPages: data.totalPages,
    //             currentPage: data.number + 1,
    //             itemsPerPage: data.size
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("Failed to fetch DayBook");
    //     }
    // };

    // const handleDelete = async (e, id) => {
    //     e.preventDefault();
    //     try {
    //         const response = await fetch(`${DELETE_DayBook_URL}${id}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${token}`
    //             }
    //         });

    //         const data = await response.json();
    //         if (response.ok) {
    //             toast.success(`DayBook Deleted Successfully !!`);

    //             // Check if the current page becomes empty
    //             const isCurrentPageEmpty = DayBook.length === 1;

    //             if (isCurrentPageEmpty && pagination.currentPage > 1) {
    //                 const previousPage = pagination.currentPage - 1;
    //                 handlePageChange(previousPage);
    //             } else {
    //                 getDayBook(pagination.currentPage);
    //             }
    //         } else {
    //             toast.error(`${data.errorMessage}`);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("An error occurred");
    //     }
    // };

    // const handleUpdate = (e, item) => {
    //     e.preventDefault();
    //     setEdit(true);
    //     console.log(item, "hey");
    //     setCurrentDayBook(item);
    // };

    // const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    //     console.log(values, "i am here");
    //     try {


    //         const url = edit ? `${UPDATE_DayBook_URL}/${currentDayBook.id}` : ADD_DayBook_URL;
    //         const method = edit ? "PUT" : "POST";

    //         const response = await fetch(url, {
    //             method: method,
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${token}`
    //             },
    //             body: JSON.stringify(values)
    //         });

    //         const data = await response.json();
    //         if (response.ok) {
    //             toast.success(`DayBook ${edit ? 'updated' : 'added'} successfully`);
    //             resetForm();
    //             setEdit(false);
    //             setCurrentDayBook({
    //                 currentDayBook: '',
    //                 productGroup: {},
    //                 orderType: {},
    //                 startDate: '',
    //                 toDate: '',
    //                 revisedDayBook: '',
    //                 revisedDate: ''
    //             });
    //             // Optionally, refresh the DayBook list here
    //             // getDayBook(pagination.currentPage);
    //         } else {
    //             toast.error(`${data.message}`);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("An error occurred");
    //     } finally {
    //         setSubmitting(false);
    //     }
    // };

    // const handleUpdateSubmit = async (values, idd, { setSubmitting, resetForm }) => {

    //     try {


    //         const url = `${UPDATE_DayBook_URL}/${idd}`;
    //         const method = "PUT";

    //         const response = await fetch(url, {
    //             method: method,
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${token}`
    //             },
    //             body: JSON.stringify(values)
    //         });

    //         const data = await response.json();
    //         if (response.ok) {
    //             toast.success(`DayBook  updated  successfully`);
    //             navigate("/DayBook/viewDayBook")


    //         } else {
    //             toast.error(`${data.message}`);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("An error occurred");
    //     } finally {
    //         setSubmitting(false);
    //     }
    // };


    const handlePageChange = (newPage) => {

        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        getDayBook(newPage); // API is 0-indexed for pages
    };

    return {
        DayBook,
        edit,
        currentDayBook,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
        handleUpdateSubmit
    };
};

export default useDayBook;
