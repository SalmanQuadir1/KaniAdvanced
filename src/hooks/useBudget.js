import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { GET_BUDGET_URL, DELETE_BUDGET_URL, UPDATE_BUDGET_URL, ADD_BUDGET_URL } from "../Constants/utils";
import { fetchProductGroup } from '../redux/Slice/ProductGroup';
import { fetchOrderType } from '../redux/Slice/OrderTypeSlice';

const useBudget = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const [Budget, setBudget] = useState([]);
    const [edit, setEdit] = useState(false);
    const [currentBudget, setCurrentBudget] = useState({ currentBudget: '', productGroup: {}, orderType: {}, startDate: '', toDate: "", revisedBudget: "", revisedDate: "" });

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProductGroup(token))
        dispatch(fetchOrderType(token))
    }, []);

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 0
    });

    useEffect(() => {
        getBudget(pagination.currentPage);
    }, [currentBudget]);

    const getBudget = async (page) => {
        try {
            const response = await fetch(`${GET_BUDGET_URL}?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            // console.log(data,"from url");
            setBudget(data?.content);
            setPagination({
                totalItems: data.totalElements,
                pagUnitList: data.content,
                totalPages: data.totalPages,
                currentPage: data.number + 1,
                itemsPerPage: data.size
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Budget");
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            const response = await fetch(`${DELETE_BUDGET_URL}${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(`Budget Deleted Successfully !!`);

                // Check if the current page becomes empty
                const isCurrentPageEmpty = Budget.length === 1;

                if (isCurrentPageEmpty && pagination.currentPage > 1) {
                    const previousPage = pagination.currentPage - 1;
                    handlePageChange(previousPage);
                } else {
                    getBudget(pagination.currentPage);
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
        setCurrentBudget(item);
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log(values, "i am here");
        try {


            const url = edit ? `${UPDATE_BUDGET_URL}/${currentBudget.id}` : ADD_BUDGET_URL;
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
                toast.success(`Budget ${edit ? 'updated' : 'added'} successfully`);
                resetForm();
                setEdit(false);
                setCurrentBudget({
                    currentBudget: '',
                    productGroup: {},
                    orderType: {},
                    startDate: '',
                    toDate: '',
                    revisedBudget: '',
                    revisedDate: ''
                });
                // Optionally, refresh the budget list here
                // getBudget(pagination.currentPage);
            } else {
                toast.error(`${data.message}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };


    const handlePageChange = (newPage) => {

        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        getBudget(newPage); // API is 0-indexed for pages
    };

    return {
        Budget,
        edit,
        currentBudget,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
    };
};

export default useBudget;
