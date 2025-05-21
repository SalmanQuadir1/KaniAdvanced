import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// import { GET_Groups_URL, DELETE_Groups_URL, UPDATE_Groups_URL, ADD_Groups_URL } from "../Constants/utils";
import { ADD_Groups_URL, DELETE_Groups_URL, GET_Groups_URL, UPDATE_Groups_URL } from "../Constants/utils";
import { fetchHsnCode } from '../redux/Slice/HsnCodeSlice';
const useGroups = (gstDetails) => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const [Groups, setGroups] = useState([]);
    const [edit, setEdit] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
       
        dispatch(fetchHsnCode(token))
       
    }, []);
    const [currentGroups, setCurrentGroups] = useState({
       groupName:"",
       subGroup:[],
       natureOfGroup:"",
       under:"",
       allocatePurchaseInvoice:"",
       calculation:"",
       balanceReporting:"",
       subLedgerGroup:"",
       affectGrossProfit:"",
       gstDetails: "",
       productStatus: "",

       hsnCodes: "",
       hsnCode:{},

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
            console.log(data,"asd");
            setGroups(data.content);
            setPagination({
                totalItems: data.totalElements,
                pagUnitList: data.content,
                totalPages: data.totalPages,
                currentPage: data.number + 1,
                itemsPerPage:data.size
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Groups");
        }
    };

    const handleDelete = async (e, id) => {
        console.log(id,"del");
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
        console.log(values,"kk");
        const product={}
        if (gstDetails && gstDetails.length > 0) {
            product.slabBasedRates = gstDetails; // Add gstDetails to the product
        }
        if (values.gstratedetails === "Specify Slab Based Rates") {
            product.slabBasedRates = gstDetails; // Include slab-based rates
            delete values.hsnCode; // Remove HSN-related fields if they exist
            delete product.igst;
            delete product.cgst;
            delete product.sgst;
            delete product.gstDescription;
            delete product.hsn_Sac;
        } else if (values.gstratedetails === "useGstClassification") {
            // Include HSN classification details
            product.hsnCode = values.hsnCode;
            // product.igst = values.hsnCode?.igst;
            // product.cgst = values.hsnCode?.cgst;
            // product.sgst = values.hsnCode?.sgst;
            product.gstDescription = values.hsnCode?.productDescription;
            product.hsn_Sac = values.hsn_Sac;

            // Remove slab-based rates if they exist
            delete product.slabBasedRates;
        }
console.log(product,"jamshedpur+++++++++++++");

const finalresult = {
    ...values,  // Spread all form values
    ...(product?.slabBasedRates && { slabBasedRates: product.slabBasedRates }) // Conditionally add slabBasedRates
  };

  // Remove the product object if it exists
  delete finalresult.product; 

  console.log(finalresult);
console.log(finalresult,"jahahaha++++++++");


        try {
            const url = edit ? `${UPDATE_Groups_URL}/${currentGroups.id}` : ADD_Groups_URL;
            const method = edit ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(finalresult)
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(`Groups ${edit ? 'updated' : 'added'} successfully`);
                resetForm();
                setEdit(false);
                setCurrentGroups({
                    groupName: "",
                    subGroup:[],
                    natureOfGroup:""
                   
                });
                getGroups(pagination.currentPage); // Fetch updated Groups
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
        under
    };
};

export default useGroups;
