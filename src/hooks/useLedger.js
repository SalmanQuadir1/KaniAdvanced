import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// import { GET_Ledger_URL, DELETE_Ledger_URL, UPDATE_Ledger_URL, ADD_Ledger_URL } from "../Constants/utils";
import { ADD_Ledger_URL, DELETE_Ledger_URL, GET_Ledger_URL, UPDATE_Ledger_URL } from "../Constants/utils";
const useLedger = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const [Ledger, setLedger] = useState([]);
    const [edit, setEdit] = useState(false);
    const [currentLedger, setCurrentLedger] = useState({
       groupName:"",
       subGroup:[],
       natureOfGroup:"",
       under:"",
       allocatePurchaseInvoice:"",
       calculation:"",
       balanceReporting:"",
       subLedgerGroup:"",
       affectGrossProfit:""
    });

    const nature = [
        { value: '', label: 'Select' },
        { value: 'Income', label: 'Income' },
        { value: 'Liabilities', label: 'Liabilities' },
        { value: 'Assets', label: 'Assets' },
        { value: 'Expenses', label: 'Expenses' },
 
    ]
    const under = [
        { value: '', label: 'Select' },
        { value: 'Primary', label: 'Primary' },
        { value: 'CapitalAccount', label: 'Capital Account' },
      
 
    ]
    const invoice = [
        { value: '', label: 'Select' },
        { value: 'NotApplicable', label: 'NotApplicable' },
        { value: 'AppropriatebyQTY', label: 'AppropriatebyQTY' },
        { value: 'AppropriatebyValue', label: 'AppropriatebyValue' },
      ];
      

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage:0
    });

    useEffect(() => {
        getLedger(pagination.currentPage);
    }, []);

    const getLedger = async (page) => {
        try {
            const response = await fetch(`${GET_Ledger_URL}?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data,"asd");
            setLedger(data.content);
            setPagination({
                totalItems: data.totalElements,
                pagUnitList: data.content,
                totalPages: data.totalPages,
                currentPage: data.number + 1,
                itemsPerPage:data.size
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Ledger");
        }
    };

    const handleDelete = async (e, id) => {
        console.log(id,"del");
        e.preventDefault();
        try {
            const response = await fetch(`${DELETE_Ledger_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            // const data = await response.json();
            if (response.ok) {
                toast.success(`Ledger Deleted Successfully !!`);

                // Check if the current page becomes empty
                const isCurrentPageEmpty = Ledger.length === 1;

                if (isCurrentPageEmpty && pagination.currentPage > 1) {
                    const previousPage = pagination.currentPage - 1;
                    handlePageChange(previousPage);
                } else {
                    getLedger(pagination.currentPage);
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
        setCurrentLedger(item);
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log(values,"kk");
        try {
            const url = edit ? `${UPDATE_Ledger_URL}/${currentLedger.id}` : ADD_Ledger_URL;
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
                toast.success(`Ledger ${edit ? 'updated' : 'added'} successfully`);
                resetForm();
                setEdit(false);
                setCurrentLedger({
                    groupName: "",
                    subGroup:[],
                    natureOfGroup:""
                   
                });
                getLedger(pagination.currentPage); // Fetch updated Ledger
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
        getLedger(newPage); // API is 0-indexed for pages
    };

    return {
        Ledger,
        edit,
        currentLedger,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
        nature,
        invoice,
        under
    };
};

export default useLedger;
