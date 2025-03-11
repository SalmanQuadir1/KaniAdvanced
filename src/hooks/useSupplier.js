import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { GET_SUPPLIER_URL, DELETE_SUPPLIER_URL, GET_SUPPLIER_ID_URL, UPDATE_SUPPLIER_URL, ADD_SUPPLIER_URL } from "../Constants/utils";
import { useNavigate } from 'react-router-dom';

const useSupplier = () => {
    const navigate = useNavigate();
    const [rows, setRows] = useState([{ id: Date.now(), selectedOption1: null, selectedOption2: null, selectedOption3: [], numOfLooms: 0 }]);
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const [Supplier, setSupplier] = useState([]);
    const [edit, setEdit] = useState(false);
    
    const [currentSupplier, setCurrentSupplier] = useState({
        name: "",
        phoneNumber: "",
        supplierType: "",
        supplierCode: "",
        address: "",
        bankName: "",
        accountNo: "",
        ifscCode: "",
        emailId: ""
    });

    const seloptions = [
        { value: 'PRODUCT', label: 'PRODUCT' },
        { value: 'MATERIAL', label: 'MATERIAL' },
    ];

    const groups = [
        { value: 'Contemporary Pashmina', label: 'Contemporary Pashmina' },
        { value: 'Pashmina Embroidery', label: 'Pashmina Embroidery' },
        { value: 'Kani', label: 'Kani' },
        { value: 'Contemporary Wool', label: 'Contemporary Wool' },
        { value: 'Wool Embroidery', label: 'Wool Embroidery' },
        { value: 'Papier Mache', label: 'Papier Mache' },
        { value: 'Cotton', label: 'Cotton' },
        { value: 'Papier Mache', label: 'Papier Mache' }
    ];

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 0
    });

    useEffect(() => {
        getSupplier(pagination?.currentPage || 1);
    }, []);

    const getSupplier = async (page) => {
        try {
          
            const response = await fetch(
              `${GET_SUPPLIER_URL}?page=${page || 1}`,
              {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            const data = await response.json();
            console.log(data, 'heyyyyy');
           
           
            setSupplier(data.content);
            setPagination({
              totalItems: data?.totalElements,
              data: data?.content,
              totalPages: data?.totalPages,
              currentPage: data?.number + 1,
              itemsPerPage: data?.size,
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Supplier");
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            const response = await fetch(`${DELETE_SUPPLIER_URL}${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(`Supplier Deleted Successfully `);

                // Check if the current page becomes empty
                const isCurrentPageEmpty = Supplier.length === 1;

                if (isCurrentPageEmpty && pagination.currentPage > 1) {
                    const previousPage = pagination.currentPage - 1;
                    handlePageChange(previousPage);
                } else {
                    getSupplier(pagination.currentPage);
                }
            } else {
                toast.error(`${data.errorMessage}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    };

    const GetSupplierById = async (id) => {
        try {
            const response = await fetch(`${GET_SUPPLIER_ID_URL}/${id}`, {
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
                setCurrentSupplier(data);
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

    const handleUpdate = (e, item) => {
        console.log(item, "on update");
        e.preventDefault();
        setEdit(true);
        if (item && item.id) {
            navigate(`/supplier/updateSupplier/${item.id}`);
        } else {
            console.error("Item or its ID is missing");
        }
    };

    const handleSubmit = (values, rows) => {
        const formData = {
            ...values,
            supplierType: values?.supplierType?.value,
            groupTypes: rows?.map(row => ({
                groupTypeName: row?.selectedOption1.value,
                noOfLooms: row?.numOfLooms,
                workers: row?.selectedOption3.map(worker => ({ workerCode: worker.value }))
            }))
        };
        console.log(JSON.stringify(formData, null, 2));
        // Here you can submit the formData to your API
        setSubmitting(false);
    };

    const handleUpdateSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const url = `${UPDATE_SUPPLIER_URL}/${values.id}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(values)
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(`Supplier updated successfully`);
                // Refresh the supplier list to ensure pagination is updated
                getSupplier(pagination.currentPage);
                navigate('/supplier/view');
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
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        getSupplier(newPage); // API is 0-indexed for pages
    };

    return {
        Supplier,
        edit,
        currentSupplier,
        GetSupplierById,
        pagination,
        getSupplier,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
        seloptions,
        groups,
        handleUpdateSubmit
    };
};

export default useSupplier;