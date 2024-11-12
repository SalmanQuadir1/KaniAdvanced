import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ADD_PRODUCT_URL, DELETE_PRODUCT_URL, GET_PRODUCT_URL, UPDATE_PRODUCT_URL } from '../Constants/utils';
import { fetchunit } from '../redux/Slice/UnitSlice';
import { fetchcolorGroup } from '../redux/Slice/ColorGroupSlice';
import ProductGroup, { fetchProductGroup } from '../redux/Slice/ProductGroup';
import { fetchProductCategory } from '../redux/Slice/ProductCategory';
import { fetchdesign } from '../redux/Slice/DesignSlice';
import { fetchstyle } from '../redux/Slice/StyleSlice';
import { fetchsize } from '../redux/Slice/SizeSlice';

const useProduct = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const [Product, setProduct] = useState([]);
    const [edit, setEdit] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({productGroup:{},
    
      colors: {
       
      },
      productCategory: {
    
      },
      design: {
       
      },
      hsnCode: "",
      colorName: "",
      styles: {
       
      },
      sizes: {
      
      },
      productId: 0,
      barcode: "",
      refrenceImage: "",
      actualImage: "",
      productDescription: ""
    });
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProductGroup(token))
        dispatch(fetchcolorGroup(token))
        dispatch(fetchProductCategory(token))
        dispatch(fetchdesign(token))
        dispatch(fetchstyle(token))
        dispatch(fetchsize(token))
    }, []);

    const seloptions = [
        { value: 'RAW', label: 'RAW' },
        { value: 'SEMIFINISHED', label: 'SEMI FINISHED' },
        { value: 'FINISHED', label: 'FINISHED' }
    ];

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 0
    });

    useEffect(() => {
        getProduct(pagination.currentPage || 1);
    }, []);

    const getProduct = async (page) => {
        try {
            const response = await fetch(`${GET_PRODUCT_URL}?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data)

            setProduct(data?.content);
            setPagination({
                totalItems: data?.totalElements,
                data: data?.content,
                totalPages: data?.totalPages,
                currentPage: data?.number + 1,
                itemsPerPage: data.size
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Product");
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            const response = await fetch(`${DELETE_PRODUCT_URL}${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(`${data.message}`);

                // Check if the current page becomes empty
                const isCurrentPageEmpty = Product.length === 1;

                if (isCurrentPageEmpty && pagination.currentPage > 1) {
                    const previousPage = pagination.currentPage - 1;
                    handlePageChange(previousPage);
                } else {
                    getProduct(pagination.currentPage);
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
        setCurrentProduct({
            ...item,
            ProductType: seloptions.find(option => option.value === item.ProductType) || null
        });
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log(values,"from useproduct");

        try {
            const url = edit ? `${UPDATE_PRODUCT_URL}/${currentProduct.id}` : ADD_PRODUCT_URL;
            const method = edit ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...values,
                    ProductType: values.ProductType.value
                })
            });

            const data = await response.json();
            //  console.log(data)
            if (response.ok) {
                toast.success(`Product ${edit ? 'updated' : 'added'} successfully`);
                resetForm();
                setEdit(false);
                setCurrentProduct({ description: '', unit: { id: '', name: '' }, grade: '', ProductType: null });
                getProduct(pagination.currentPage || 1); // Fetch updated Product
            } else {
                toast.error(`${data.errorMessage}`);
            }
        } catch (error) {
            console.log(error)
            toast.error("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        getProduct(newPage);
    };

    return {
        Product,
        edit,
        currentProduct,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
        seloptions
    };
};

export default useProduct;