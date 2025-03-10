import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ADD_PRODUCT_URL, DELETE_PRODUCT_URL, GET_PRODUCT_URL, UPDATE_PRODUCT_URL, GET_PRODUCTID_URL, VIEW_ALL_LOCATIONS, GET_PRODUCTIDINVENTORY_URL, DELETEINVENTORY_PRODUCT_URL, VIEW_ALL_ORDER_URL, VIEW_ALL_UNITS, VIEW_ALL_PRODUCT_GROUP_URL } from '../Constants/utils';
import { fetchunit } from '../redux/Slice/UnitSlice';
import { fetchcolorGroup } from '../redux/Slice/ColorGroupSlice';
import ProductGroup, { fetchProductGroup } from '../redux/Slice/ProductGroup';
import { fetchProductCategory } from '../redux/Slice/ProductCategory';
import { fetchdesign } from '../redux/Slice/DesignSlice';
import { fetchstyle } from '../redux/Slice/StyleSlice';
import { fetchsize } from '../redux/Slice/SizeSlice';
import { fetchHsnCode } from '../redux/Slice/HsnCodeSlice';
import { fetchsupplier } from '../redux/Slice/SupplierSlice';
import { useNavigate } from 'react-router-dom';




const useProduct = ({ referenceImages, actualImages, productIdField, gstDetails }) => {

    console.log(gstDetails, "umerhumainnkhal");


    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const [Product, setProduct] = useState([]);
    const [edit, setEdit] = useState(false);
    const [productId, setproductId] = useState([])
    const [inventoryproductId, setinventoryproductId] = useState([])
    const [errorMessage, seterrorMessage] = useState('')
    const [productGroup, setproductGroup] = useState([])
    const [colorGroup, setcolorGroup] = useState([])
    const [productCategory, setproductCategory] = useState([])
    const [productList, setproductList] = useState([])
    const [units, setunits] = useState([])
    const [Location, setLocation] = useState([])

    const [productmrp, setproductmrp] = useState([])
    const [currentProduct, setCurrentProduct] = useState({
        productGroup: {},

        colors: {
            // Default value
        },
        productCategory: {

        },
        design: {

        },
        hsnCode: {},

        colorName: "",
        styles: {

        },
        sizes: {

        },

        barcode: "",
        // images: [ 
        //     {
        //         id: 0,
        //         referenceImage: "",
        //         actualImage: "",
        //         product: "" 
        //     }
        // ],      
        productDescription: "",
        supplier: [],
        supplierCode: {},
        warpColors: "",
        weftColors: "",
        warpYarn: "",
        batch: "",
        weftYarn: "",
        weave: "",
        finishedWeight: "",
        materialWeight: "",


        gstDetails: "",
        productStatus: "",

        hsnCodes: "",

        hsn_Sac: "",

        gstDescription: "",

        taxationType: "",

        gstRate: "",

        typeOfSupply: "",

        pixAndReed: "",
        cost: 0,
        dyeingCost: 0,
        baseColour: "",


        embroideryColors: "",
        fabricWeave: "",
        fabricCode: "",


        fabricCost: 0,


        embroideryCost: 0,
        totalCost: 0,
        retailMrp: 0,


        kaniColors: "",
        mrp: 0,
        wholesalePrice: 0,
        productDescription: "",
        patternColor: "",
        usdPrice: 0,
        euroPrice: 0,
        gbpPrice: 0,
        rmbPrice: 0,
        unit: {},
        gstDetails: "",
        slabBasedRates: [],

    });
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProductGroup(token))
        dispatch(fetchcolorGroup(token))
        dispatch(fetchProductCategory(token))
        dispatch(fetchdesign(token))
        dispatch(fetchstyle(token))
        dispatch(fetchunit(token))
        dispatch(fetchsize(token))
        dispatch(fetchHsnCode(token))
        dispatch(fetchsupplier(token))
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






    const getProduct = async (page, filters = {}) => {
        console.log("iam here");
        console.log(filters, "filllllllll");
        try {
            const response = await fetch(`${GET_PRODUCT_URL}?page=${page || 1}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(filters)
            });
            const data = await response.json();
            console.log(data, "pr datatata")

            setProduct(data?.content);
            setPagination({
                totalItems: data?.totalElements,
                data: data?.content,
                totalPages: data?.totalPages,
                currentPage: data?.number + 1,
                itemsPerPage: data.size
            });
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch Product");
        }
    };


   



    const getProductId = async () => {
        console.log("iam here");
        try {
            const response = await fetch(`${GET_PRODUCTID_URL}/processProductIds`, {
                method: "GET",
                headers: {
                    // "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data, "pr datatata")

            setproductId(data);

        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Product");
        }
    };
    const getInventoryProductId = async () => {
        console.log("iam here");
        try {
            const response = await fetch(`${GET_PRODUCTIDINVENTORY_URL}`, {
                method: "GET",
                headers: {
                    // "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data, "pr datatata")

            setinventoryproductId(data);

        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Product");
        }
    };


    const getProductGroup = async () => {
        console.log("iam here");
        try {
            const response = await fetch(`${VIEW_ALL_PRODUCT_GROUP_URL}`, {
                method: "GET",
                headers: {
                    // "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data, "pr datatata")

            setinventoryproductId(data);

        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Product");
        }
    };



    const getUnits = async () => {
        console.log("iam here");
        try {
            const response = await fetch(`${VIEW_ALL_UNITS}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data, "logining unittt")

            setunits(data);

        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Product");
        }
    };

    const getLocation = async () => {
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

            setLocation(data);

        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Product");
        }
    };



    const getProductList = async () => {
        console.log("iam here");
        try {
            const response = await fetch(`${GET_PRODUCTID_URL}/all-products`, {
                method: "GET",
                headers: {
                    // "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data, "pr datatata")

            setproductList(data);

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
    const handleInventoryDelete = async (e, id) => {
        e.preventDefault();
        try {
            const response = await fetch(`${DELETEINVENTORY_PRODUCT_URL}${id}`, {
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
                    navigate("/inventory/viewProductInventory")
                }
            } else {
                toast.error(`${data?.message}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    };

    const handleUpdate = (e, item) => {
        console.log(item, "jjhh");

        e.preventDefault();
        if (item && item.id) {
            navigate(`/product/updateProduct/${item.id}`);
        } else {
            console.error("Item or its ID is missing");
        }
    };


    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log("Form values:", values); // Debugging purposes

        const formData = new FormData();

        try {
            // Prepare the product object without images
            const product = {
                ...values,
                productId: productIdField // Add productId directly while spreading
            };
            delete product.images; // Remove images from the product object

            // product.productId = productIdField;

            // Append the product details as JSON
            if (gstDetails && gstDetails.length > 0) {
                product.slabBasedRates = gstDetails; // Add gstDetails to the product
            }
            if (values.gstratedetails === "specifySlabBasedRates") {
                product.slabBasedRates = gstDetails; // Include slab-based rates
                delete product.hsnCode; // Remove HSN-related fields if they exist
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

            // Append the updated product to formData
            formData.append("product", JSON.stringify(product));
            console.log(referenceImages,"reffferrreffefefefefefefefffffffffffff=================");

            Array.from(referenceImages).forEach((file) => formData.append('referenceImages', file)); // Add files
            Array.from(actualImages).forEach((file) => formData.append('actualImages', file));




            // Debugging: Check FormData contents
            if (process.env.NODE_ENV === "development") {
                for (let pair of formData.entries()) {
                    console.log(pair[0], pair[1]);
                }
            }
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value, "heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
            }

            console.log(formData, "formmmmmmmmmmmmmmmmmmmmmmmmmmmmm");

            // Submit the form data
            const url = edit ? `${UPDATE_PRODUCT_URL}/${currentProduct.id}` : ADD_PRODUCT_URL;
            const method = edit ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    //    "Content-Type":"multipart/form-data",

                    // "Content-Type":"multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                    // "Content-Type":"multipart/form-data",
                },

                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setTimeout(() => {
                    toast.success(`Product ${edit ? "updated" : "added"} successfully`);
                }, 1000);

                // Reset the form and states
                resetForm();
                setReferenceImages([]); // Reset reference images
                setActualImages([]); // Reset actual images
                window.location.reload();  // Reset form fields
                setEdit(false); // Reset edit state
                getProduct(pagination.currentPage || 1); // Refresh product list
            } else {

                seterrorMessage(data)
                toast.error(data.message || "An error occurred while saving the product.");
            }
        } catch (error) {

            // toast.error("An error occurred. Please try again.");
        } finally {
            setSubmitting(false); // Stop the form submission spinner
        }
    };



    // const handleUpdateSubmit = async (values, { setSubmitting }) => {
    //     console.log(values, "Submitted values:");

    //     // Ensure `id` exists
    //     if (!values?.id) {
    //         console.error("ID is missing. Cannot update product.");
    //         toast.error("Product ID is required for updating.");
    //         return;
    //     }

    //     try {
    //         const product = { 
    //             ...values, 
    //             // Add or modify any fields needed by the API
    //         };

    //         const url = `${UPDATE_PRODUCT_URL}/${values.id}`;
    //         console.log("Update URL:", url);

    //         const response = await fetch(url, {
    //             method: "PUT",
    //             headers: {
    //                 "Content-Type": "application/json", // Set correct content type
    //                 "Authorization": `Bearer ${token}`, // Include token if required
    //             },
    //             body: JSON.stringify(product), // Send raw JSON
    //         });

    //         const data = await response.json();

    //         if (response.ok) {
    //             console.log(data, "Update response:");
    //             toast.success("Product updated successfully");
    //             navigate('/inventory/viewMaterialInventory');
    //         } else {
    //             console.error("Update failed:", data.errorMessage);
    //             toast.error(data.errorMessage || "An error occurred while updating the product.");
    //         }
    //     } catch (error) {
    //         console.error("Error during update:", error);
    //         toast.error("An error occurred while updating the product.");
    //     } finally {
    //         if (setSubmitting) setSubmitting(false); // Stop any loading spinner
    //     }
    // };









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
        // handleUpdateSubmit,
        handlePageChange,
        seloptions,
        getProduct,
        productId,
        getProductId,
        getProductList,
        productList,
        getLocation,
        Location,
        errorMessage,
        getInventoryProductId,
        inventoryproductId,
        handleInventoryDelete,
        getUnits,
        units

    };
};

export default useProduct;