import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// import { GET_Groups_URL, DELETE_Groups_URL, UPDATE_Groups_URL, ADD_Groups_URL } from "../Constants/utils";
import { ADD_Groups_URL, DELETE_Groups_URL, GET_Groups_URL, UPDATE_Groups_URL } from "../Constants/utils";
import { fetchHsnCode } from '../redux/Slice/HsnCodeSlice';
const useGroups = (gstDetails,setgstDetails) => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const [Groups, setGroups] = useState([]);
    const [edit, setEdit] = useState(false);
    const dispatch = useDispatch();
    const [accountGroups, setaccountGroups] = useState([])

    useEffect(() => {

        dispatch(fetchHsnCode(token))

    }, []);
    const [currentGroups, setCurrentGroups] = useState({
        groupName: "",
        subGroup: [],
        natureOfGroup: "",
        under: {},
        allocatePurchaseInvoice: "",
        calculation: "",
        balanceReporting: "",
        subLedgerGroup: "",
        affectGrossProfit: "",
        gstDetails: "",
        productStatus: "",
        gstratedetails: "",

        hsnCodes: "",
        hsnCode: {},

        hsn_Sac: "",

        gstDescription: "",

        taxationType: "",

        gstRate: "",

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
        { value: 'BankAccounts', label: 'Bank Accounts' },
        { value: 'BankOCCAc', label: 'Bank OCC Ac' },
        { value: 'BankODAc', label: 'Bank OD A/c' },
        { value: 'BranchDrasons', label: 'Branch / Dras ons.' },
        { value: 'CashInHand', label: 'Cash-in-Hand' },
        { value: 'CurrentAssets', label: 'Current Assets' },
        { value: 'CurrentLiabilities', label: 'Current Liabilities' },
        { value: 'DepositsAsset', label: 'Deposits (Asset)' },
        { value: 'DirectExpenses', label: 'Direct Expenses' },
        { value: 'DirectIncomes', label: 'Direct Incomes' },
        { value: 'DutiesTaxes', label: 'Duties & Taxes' },
        { value: 'ExpensesDirect', label: 'Expenses (Direct)' },
        { value: 'ExpensesIndirect', label: 'Expenses (Indirect)' },
        { value: 'FixedAssets', label: 'Fixed Assets' },
        { value: 'IncomeDirect', label: 'Income (Direct)' },
        { value: 'IncomeIndirect', label: 'Income (Indirect)' },
        { value: 'IndirectExpenses', label: 'Indirect Expenses' },
        { value: 'IndirectIncomes', label: 'Indirect Incomes' },
        { value: 'Investments', label: 'Investments' },
        { value: 'LoansAdvancesAsset', label: 'Loans & Advances (Asset)' },
        { value: 'LoansLiability', label: 'Loans (Liability)' },
        { value: 'MiscExpensesAsset', label: 'Misc. Expenses (Asset)' },
        { value: 'Provisions', label: 'Provisions' },
        { value: 'PurchaseAccounts', label: 'Purchase Accounts' },
        { value: 'ReserveSurplus', label: 'Reserve & Surplus' },
        { value: 'RetainedEarnings', label: 'Retained Earnings' },
        { value: 'SalesAccounts', label: 'Sales Accounts' },
        { value: 'SecuredLoans', label: 'Secured Loans' },
        { value: 'StockInHand', label: 'Stock in Hand' },
        { value: 'SundryCreditors', label: 'Sundry Creditors' },
        { value: 'SundryDebtors', label: 'Sundry Debtors' }
    ];
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
        itemsPerPage: 0
    });

    useEffect(() => {
        getGroups(pagination.currentPage);
    }, []);

    const getGroups = async (page) => {
        try {
            const response = await fetch(`${GET_Groups_URL}?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data, "asd");
            const filteredGroups = data.content.map(group => {
                const {  allocatePurchaseInvoice, ...rest } = group;
                return rest;
            });

            setGroups(filteredGroups);
            setPagination({
                totalItems: data.totalElements,
                pagUnitList: data.content,
                totalPages: data.totalPages,
                currentPage: data.number + 1,
                itemsPerPage: data.size
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Groups");
        }
    };

   

    const handleDelete = async (e, id) => {
        console.log(id, "del");
        e.preventDefault();
        try {
            const response = await fetch(`${DELETE_Groups_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            // const data = await response.json();
            if (response.ok) {
                toast.success(`Groups Deleted Successfully !!`);

                // Check if the current page becomes empty
                const isCurrentPageEmpty = Groups.length === 1;

                if (isCurrentPageEmpty && pagination.currentPage > 1) {
                    const previousPage = pagination.currentPage - 1;
                    handlePageChange(previousPage);
                } else {
                    getGroups(pagination.currentPage);
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
        setCurrentGroups(item);
    };






   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log(values, "form values");
    
    // Prepare the payload
    let payload = {
        groupName: values.groupName,
        natureOfGroup: values.natureOfGroup,
        allocatePurchaseInvoice: values.allocatePurchaseInvoice,
        gstDetails: values.gstDetails,
        gstratedetails: values.gstratedetails,
    };

    // Handle Under group - extract ID properly
    if (values.under && typeof values.under === 'object') {
        payload.under = { id: values.under.id }; // Send only the ID, not the whole object
    }

    // Handle GST slab based rates
    if (values.gstratedetails === "Specify Slab Based Rates" && gstDetails && gstDetails.length > 0) {
        payload.slabBasedRates = gstDetails.map(({ id, ...rest }) => ({
            ...rest
        }));
    }
    
    // Handle HSN classification
    else if (values.gstratedetails === "Use GST Classification " && values.gstDetails === "Applicable") {
        if (values.hsnCode) {
            payload.hsnCodeId = values.hsnCode.id; // Send only the ID
            payload.hsn_Sac = values.hsn_Sac;
            payload.gstDescription = values.gstDescription || values.hsnCode?.productDescription;
        }
    }

    // For update, include the ID
    if (edit && currentGroups?.id) {
        payload.id = currentGroups.id;
    }

    console.log(payload, "final payload");

    try {
        const url = edit ? `${UPDATE_Groups_URL}/${currentGroups.id}` : ADD_Groups_URL;
        const method = edit ? "PUT" : "POST";

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (response.ok) {
            toast.success(`Groups ${edit ? 'updated' : 'added'} successfully`);
            
            // Reset form to initial state
            resetForm();
            
            // Clear GST details state
            setgstDetails([]);
            
            // Reset currentGroups to empty state
            setCurrentGroups({
                groupName: "",
                under: null,
                natureOfGroup: "",
                allocatePurchaseInvoice: "",
                gstDetails: "",
                gstratedetails: "",
                hsnCode: null,
                hsn_Sac: "",
                gstDescription: "",
                slabBasedRates: []
            });
            
            // Turn off edit mode
            setEdit(false);
            
            // Refresh the groups list
            getGroups(pagination.currentPage);
            
        } else {
            toast.error(data.errorMessage || `Failed to ${edit ? 'update' : 'add'} group`);
        }
    } catch (error) {
        console.error("Submission error:", error);
        toast.error("An error occurred while processing your request");
    } finally {
        setSubmitting(false);
    }
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
        nature,
        invoice,
        under,
        setCurrentGroups,
        setEdit
    };
};

export default useGroups;
