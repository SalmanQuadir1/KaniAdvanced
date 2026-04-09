import React, { useEffect, useRef, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { ErrorMessage, Field, Formik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_IMAGE, GET_PRODUCTBYID_URL, GET_PRODUCTS_URL, VIEW_ORDERPRODUCT_ALL, GET_PRODUCT_GROUP_SUBGROUP_URL } from '../../Constants/utils';
import { useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import useProduct from '../../hooks/useProduct';
import { toast } from 'react-toastify';




const UpdateKaniProducts = () => {


    const productIdField = "";

    const [product, setProduct] = useState(null);

    const [productSuppliers, setproductSuppliers] = useState([])
    // To store fetched product data
    const [colorGroupOptions, setColorGroupOptions] = useState([]); // Color group options for ReactSelect
    const [isLoading, setIsLoading] = useState(true); // Loader state
    const theme = useSelector(state => state?.persisted?.theme);
    const customStyles = createCustomStyles(theme?.mode);
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const [unitOptions, setunitOptions] = useState([])
    const colorGroup = useSelector(state => state?.persisted?.color);
    const design = useSelector(state => state?.persisted?.design); const [designOptions, setdesignOptions] = useState([])
    const [styleOptions, setstyleOptions] = useState([])
    const [sizeOptions, setsizeOptions] = useState([])
    const style = useSelector(state => state?.persisted?.style);
    const size = useSelector(state => state?.persisted?.size);
    const [productCategoryOptions, setproductCategoryOptions] = useState([]);
    const [hsnOptions, sethsnOptions] = useState([]);
    const productCategory = useSelector(state => state?.persisted?.productCategory);
    const hsnCode = useSelector(state => state?.persisted?.hsn);
    const [supplierNameOptions, setsupplierNameOptions] = useState([])
    // const [supplierCodeOptions, setsupplierCodeOptions] = useState([])
    const supplier = useSelector(state => state?.nonPersisted?.supplier);
    const [productGroupOption, setproductGroupOption] = useState([])
    const [gstDetailModal, setgstDetailModal] = useState(false)
    const productGroup = useSelector(state => state?.persisted?.productGroup);
    const [vaaluee, setvaaluee] = useState({})

    const [subGroupOptions, setsubGroupOptions] = useState([]);
    const [weaveOptions, setweaveOptions] = useState([]);
    const [loomsOptions, setLoomsOptions] = useState([]);
     

    const {  getWeave,getUnits, units,
        weave } = useProduct({ });
    


    const [referenceImages, setrefImage] = useState({})
    const [actualImages, setactualImage] = useState({})
    const navigate = useNavigate(); // Initialize navigate


    const [previews, setPreviews] = useState([]);
    const [previewsActual, setPreviewsActual] = useState([]);
    const [gstDetails, setgstDetails] = useState([])

    const { token } = currentUser;
    const { id } = useParams();
    const productId = id;

    // Runs only once when the component mounts
    


   const handleUpdateSubmit = async (values, { setSubmitting }) => {
    console.log("Product ID from useParams:", id);
    console.log("Product ID from values:", values.id);
    console.log(values, "Submitted values:");

    // Create FormData instance
    const formData = new FormData();

    // Use the correct ID - from values or from useParams
    const productIdToUpdate = values.id || id;
    console.log("Product ID to update:", productIdToUpdate);

    if (!productIdToUpdate) {
        toast.error("Product ID is required for update");
        setSubmitting(false);
        return;
    }

    // Map the necessary fields to create the product object
    console.log(values, "Values in submit handler");
    const product = {
        // Don't include the ID in the product object - it's in the URL
        productGroup: { id: values.productGroup?.id || 0 },
        colors: { id: values.colors?.id || 0 },
        productCategory: { id: values.productCategory?.id || 0 },
        design: { id: values.design?.id || 0 },
        colorName: values.colorName || "",
        styles: { id: values.styles?.id || 0 },
        sizes: { id: values.sizes?.id || 0 },
        productId: values.productId || "",
        colorWeave: values.colorWeave || "",
        barcode: values.barcode || "",
        productDescription: values.productDescription || "",
       supplier: Array.isArray(values.supplier) && values.supplier.length > 0
    ? values.supplier.map((supp) => ({ 
        id: supp?.supplier?.id || supp?.id || 0  // Check nested supplier object first
      }))
    : [],
        // supplierCode: { id: values.supplierCode?.id || 0 },
        warpColors: values.warpColors || "",
        weftColors: values.weftColors || "",
        warpYarn: values.warpYarn || "",
        weftYarn: values.weftYarn || "",
        weave: values.weave || "",
        finishedWeight: values.finishedWeight || 0,
        materialWeight: values.materialWeight || 0,
        pixAndReed: values.pixAndReed || "",
        cost: values.cost || "",
        dyeingCost: values.dyeingCost || "",
        baseColour: values.baseColour || "",
        embroideryColors: values.embroideryColors || "",
        fabricWeave: values.fabricWeave || "",
        fabricCode: values.fabricCode || "",
        fabricCost: values.fabricCost || 0,
        embroideryCost: values.embroideryCost || 0,
        totalCost: values.totalCost || 0,
        kaniColors: values.kaniColors || "",
        mrp: values.mrp || "",
        wholesalePrice: values.wholesalePrice || "",
        description: values.productDescription || "",
        patternColor: values.patternColor || "",
        usdPrice: values.usdPrice || "",
        euroPrice: values.euroPrice || "",
        gbpPrice: values.gbpPrice || "",
        rmbPrice: values.rmbPrice || "",
        productStatus: values.productStatus || "",
        gstDetails: values.gstDetails || "",
        hsnCodes: values.hsnCodes || "",
        hsn_Sac: values.hsn_Sac || "",
        gstDescription: values.gstDescription || "",
        taxationType: values.taxationType || "",
        gstRate: values.gstRate || 0,
        typeOfSupply: values.typeOfSupply || "",
        unit: values.unit ? { id: values.unit?.id || 0 } : null
    };

    // Handle GST details based on selection
    if (values.gstratedetails === "Specify Slab Based Rates") {
        product.slabBasedRates = values.slabBasedRates || [];
        // Don't include hsnCode for slab-based rates
    } else if (values.gstratedetails === "useGstClassification" && values.hsnCode?.id) {
        product.hsnCode = { 
            id: values.hsnCode.id,
            hsnCodeName: values.hsnCode.hsnCodeName || "",
            sgst: values.hsnCode.sgst || 0,
            igst: values.hsnCode.igst || 0,
            cgst: values.hsnCode.cgst || 0
        };
    }

    console.log('Product data to send:', product);

    // Append product data as JSON
    formData.append("product", JSON.stringify(product, (key, value) => {
        // Remove null, undefined, empty strings
        if (value === null || value === undefined || value === "") {
            return undefined;
        }
        if (Array.isArray(value) && value.length === 0) {
            return undefined;
        }
        return value;
    }));
    
    // Add reference images
    if (referenceImages && referenceImages.length > 0) {
        Array.from(referenceImages).forEach((file) => {
            if (file instanceof File) {
                formData.append('referenceImages', file);
            }
        });
    }
    
    // Add actual images
    if (actualImages && actualImages.length > 0) {
        Array.from(actualImages).forEach((file) => {
            if (file instanceof File) {
                formData.append('actualImages', file);
            }
        });
    }

    // Log the FormData content (for debugging)
    console.log("FormData content:");
    for (let [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name}` : value);
    }

    try {
        // Use the correct product ID
        const url = `${GET_PRODUCTS_URL}/${productIdToUpdate}`;
        console.log("Update URL:", url);

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: formData,
        });

        // Read response as text first
        const responseText = await response.text();
        console.log("Raw response text:", responseText);
        
        let data;
        try {
            data = JSON.parse(responseText);
        } catch {
            data = responseText;
        }

        if (response.ok) {
            console.log("Update response:", data);
            toast.success("Product updated successfully");
        } else {
            console.error("Update failed. Status:", response.status, response.statusText);
            console.error("Response data:", data);
            
            let errorMessage = "Error updating product";
            if (typeof data === 'string') {
                errorMessage = data;
            } else if (data?.message) {
                errorMessage = data.message;
            } else if (data?.error) {
                errorMessage = data.error;
            }
            
            toast.error(errorMessage);
        }
    } catch (error) {
        console.error("Error during update:", error);
        toast.error(`Error: ${error.message}`);
    } finally {
        if (setSubmitting) setSubmitting(false);
    }
};
    const getProductById = async () => {
        try {
            const response = await fetch(`${VIEW_ORDERPRODUCT_ALL}/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch product');
            }

            const data = await response.json();

            console.log(data, "giu");
            setProduct(data?.products);
            setproductSuppliers(data?.productSuppliers) // Store fetched product
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setIsLoading(false); // Stop loader
        }
    };
    console.log(product, 'hloooooo')


    const handleRemoveImage = (indexToRemove) => {
        setPreviews((prevPreviews) => {
            const updatedPreviews = [...prevPreviews];
            // Revoke the object URL to release memory
            URL.revokeObjectURL(updatedPreviews[indexToRemove].url);
            updatedPreviews.splice(indexToRemove, 1);
            return updatedPreviews;
        });
    };


     const handleRemoveImageActual = (indexToRemove) => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            images: prevProduct.images.filter((_, index) => index !== indexToRemove),
        }));
    };
    

     const handleRemoveImagePreview = (imageId) => {
        setProduct((prevProduct) => {
            if (!prevProduct?.images) return prevProduct;
    
            return {
                ...prevProduct,
                images: prevProduct.images.filter((img) => img.referenceImage !== imageId),
            };
        });
    };


     const handleFileChange = async (event) => {
        const files = Array.from(event.target.files);
        if (!files.length) return;

        // Create preview objects for new files
        const newPreviews = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
            isNew: true // Flag to identify new uploads
        }));

        // Update previews state (only for UI display)
        setPreviews((prev) => [...prev, ...newPreviews]);

        // Convert existing product.images to the same format as new files
        const existingImagesAsFiles = product?.images.map(img => {
            const fileName = img?.referenceImage;
            
            // If you can determine the type and size, populate it here. For example:
            // const fileExtension = fileName.split('.').pop();
            const fileExtension = fileName
            const fileType = `image/${fileExtension}`; // Use the extension to determine the type
            const fileSize = 0; // Set to a known size (or fetch it if possible)
            
            // Simulate a file object for existing images
            return new File([], fileName, {
              type: fileType,
              size: fileSize,
            });
          }) || [];

        // Update referenceImages state (combining existing and new)
        setrefImage((prev) => [
            ...existingImagesAsFiles, // Keep existing images first
            ...files
        ]);
    };
    
    console.log(referenceImages, "jumbooooooooo");


    const handleFileChangeActual = (event) => {
  const files = Array.from(event.target.files);

  const newPreviewsActual = files.map((file) => ({
    file,
    url: URL.createObjectURL(file),
  }));

  setPreviewsActual((prev) =>
    Array.isArray(prev) ? [...prev, ...newPreviewsActual] : [...newPreviewsActual]
  );

  setactualImage((prev) =>
    Array.isArray(prev) ? [...prev, ...files] : [...files]
  );
};


    // Fetch data when component mounts
    useEffect(() => {
        getProductById();
    }, [id]);

    // Prepare color group options
    useEffect(() => {
        if (colorGroup.data) {
            const formattedOptions = colorGroup.data.map((color) => ({
                value: color.id,
                label: color.colorName,
                colorGroupObject: color,
                color: { id: color.id }
            }));
            setColorGroupOptions(formattedOptions);
        }
    }, [colorGroup]);
    useEffect(() => {
        if (productCategory.data) {
            const formattedOptions = productCategory.data.map(prodCat => ({
                value: prodCat.id,
                label: prodCat?.productCategoryName,
                productCategoryObject: prodCat,
                productCategoryid: { id: prodCat.id },

            }));
            setproductCategoryOptions(formattedOptions);
        }
    }, [productCategory]);
    useEffect(() => {
        if (hsnCode.data) {
            const formattedOptions = hsnCode.data.map(hsn => ({
                value: hsn.id,
                label: hsn?.hsnCodeName,
                hsnObject: hsn,
                hsnCode: { id: hsn.id }
            }));
            sethsnOptions(formattedOptions);
        }
    }, [hsnCode]);
    useEffect(() => {
        if (design.data) {
            const formattedOptions = design.data.map(design => ({
                value: design.id,
                label: design?.designName,
                designObject: design,
                designid: { id: design.id }
            }));
            setdesignOptions(formattedOptions);
        }
    }, [design]);
    useEffect(() => {
        if (style.data) {
            const formattedOptions = style.data.map(style => ({
                value: style.id,
                label: style?.stylesName,
                styleObject: style,
                styleid: { id: style.id }
            }));
            setstyleOptions(formattedOptions);
        }
    }, [style]);
    useEffect(() => {
        if (size.data) {
            const formattedOptions = size.data.map(size => ({
                value: size.id,
                label: size?.sizeName,
                sizeObject: size,
                sizeid: { id: size.id }
            }));
            setsizeOptions(formattedOptions);
        }
    }, [size]);

    useEffect(() => {
        if (supplier.data) {
            const formattedOptions = supplier.data.map(supp => ({
                value: supp.id,
                label: supp?.name,
                supplierNameObject: supp,
                suplierid: { id: supp.id }
            }));
            setsupplierNameOptions(formattedOptions);
        }
    }, [supplier.data]);
    // useEffect(() => {
    //     if (supplier.data) {
    //         const formattedOptions = supplier.data.map(supp => ({
    //             value: supp.id,
    //             label: supp?.supplierCode,
    //             supplierCodeObject: supp,
    //             suplieridd: { id: supp.id }
    //         }));
    //         setsupplierCodeOptions(formattedOptions);
    //     }
    // }, [supplier.data]);

    
    // useEffect(() => {
    //     if (supplier.data) {
    //         const formattedOptions = supplier.data.map(supp => ({
    //             value: supp.id,
    //             label: supp?.supplierCode,
    //             supplierCodeObject: supp,
    //             suplieridd: { id: supp.id }
    //         }));
    //         setsupplierCodeOptions(formattedOptions);
    //     }
    // }, [supplier.data]);
    const formikRef = useRef(null);


    useEffect(() => {
        if (productGroup?.data && Array.isArray(productGroup.data)) {
            const formattedOptions = productGroup.data.map(product => ({
                value: product.id,
                label: product.productGroupName,
                productGroupObject: product,
            }));
            setproductGroupOption(formattedOptions);
        } else {
            setproductGroupOption([]); // Clear options if data is unavailable
        }
    }, [productGroup]);



      useEffect(() => {
            const { id: idd } = product?.productGroup || {};
            if (productGroup?.data && Array.isArray(productGroup.data)) {
                const formattedOptions = productGroup.data.map(product => ({
                    value: product.id,
                    label: product.productGroupName,
                    productGroupObject: product,
                }));
                setproductGroupOption(formattedOptions);
            } else {
                setproductGroupOption([]);
            }
    
            const getSubGroup = async () => {
                try {
                    const response = await fetch(`${GET_PRODUCT_GROUP_SUBGROUP_URL}/${idd}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    const subgroupOptions = data && data.map(subgroup => ({
                        value: subgroup.id,
                        label: subgroup.productSubGroupName,
                        subGroupObject: subgroup,
                    }));
                    setsubGroupOptions(subgroupOptions);
                } catch (error) {
                    console.error(error);
                }
            };
    
            getSubGroup();
        }, [product?.productGroup]);




         useEffect(() => {
                getWeave()
            }, [])
        
        
            useEffect(() => {
                if (weave) {
                    const formattedweaveOptions = weave.map(unitGroup => ({
                        value: unitGroup?.id,
                        label: unitGroup?.weaveName,
                        weaveGroupObject: unitGroup,
                    }));
                    setweaveOptions(formattedweaveOptions); // Update the state only when `units` changes
                }
            }, [weave]);



 useEffect(() => {
        getUnits();
    }, []);

             useEffect(() => {
                    if (units) {
                        const formattedunitOptions = units.map(unitGroup => ({
                            value: unitGroup?.id,
                            label: unitGroup?.name,
                            unitGroupObject: unitGroup,
                        }));
                        setunitOptions(formattedunitOptions);
                    }
                }, [units]);

    const gstOptions = [

        { value: 'Applicable', label: 'Applicable' },
        { value: 'NotApplicable', label: 'NotApplicable' },

    ]
    const supplyType = [

        { value: 'Goods', label: 'Goods' },
        { value: 'Service', label: 'Service' },
        { value: 'capital Goods', label: 'capital Goods' },
    ]

    const gstdetails = [

        { value: 'specifySlabBasedRates', label: 'Specify Slab Based Rates' },
        { value: 'useGstClassification', label: 'Use Gst Classification' },

    ]



    // Show loader until product data is fetched
    if (isLoading) {
        return <div>Loading...</div>;
    }



  const updateLoomsOptions = (selectedSuppliers, setFieldValue, currentValues) => {
        if (!selectedSuppliers || selectedSuppliers.length === 0) {
            setLoomsOptions([]);
            if (setFieldValue) setFieldValue('looms', []);
            return;
        }

        const allWorkerOptions = [];

        selectedSuppliers.forEach(supplier => {
            const groupTypes = supplier.supplierNameObject?.groupTypes || [];

            groupTypes.forEach(groupType => {
                const workers = groupType.workers || [];
                workers.forEach(worker => {
                    allWorkerOptions.push({
                        value: worker.workerCode,
                        label: `${worker.workerCode} - ${worker.workerName || ''} (${supplier.label} - ${groupType.groupTypeName})`,
                        supplierId: supplier.value,
                        groupTypeId: groupType.id,
                        workerData: worker
                    });
                });
            });
        });

        const uniqueOptions = Array.from(
            new Map(allWorkerOptions.map(item => [item.value, item])).values()
        );

        setLoomsOptions(uniqueOptions);

        if (currentValues?.looms && setFieldValue) {
            const validLooms = currentValues.looms.filter(loomValue =>
                uniqueOptions.some(opt => opt.value === loomValue)
            );
            if (validLooms.length !== currentValues.looms.length) {
                setFieldValue('looms', validLooms);
            }
        }
    };




    const handlerateDetails = (option, setFieldValue) => {
        console.log(option, "optoooon");
        setFieldValue('gstratedetails', option.value);
        if (option.value === "specifySlabBasedRates") {

            setgstDetailModal(true)
        }

    }

    console.log(product, "brocode");
    console.log(productGroupOption, "codeeeee");


    const handleModalSubmit = (newValues) => {
        console.log(newValues, "Submitted GST Rates");

        // Retrieve the current slabBasedRates from Formik
        const currentValues = formikRef.current.values.slabBasedRates || [];

        // Merge current values with only the truly new rows
        const updatedValues = [...currentValues, ...newValues.filter(row => !currentValues.some(existing => existing.id === row.id))];

        // Update Formik's field value with the deduplicated array
        formikRef.current.setFieldValue('slabBasedRates', updatedValues);

        setgstDetailModal(false); // Close the modal
    };



    console.log(productSuppliers, "prodyuuuuuuuuuuuuuuuuuuuuuuct");

    


    return (
        <DefaultLayout>
            <Breadcrumb pageName="Products / ViewProduct" />
            <div>
                <Formik
                    innerRef={formikRef}
                    enableReinitialize // Update initial values when product data changes
                    initialValues={{
                        ...product,
                        // id: product?.id || "",
                        productGroup: product?.productGroup,
                        colors: product?.colors || { id: 0 },
                        // colors: product?.colors?.id || '',

                        productCategory: product?.productCategory || { id: 0 },
                        hsnCode: product?.hsnCode || { id: 0 },
                        design: product?.design || { id: 0 },
                        styles: product?.styles || { id: 0 },
                        sizes: product?.sizes || { id: 1, sizeName: "3l" },
                        gstDetails: product?.gstDetails || [],
                        hsnCodes: product?.hsnCodes || '',
                        hsn_Sac: product?.hsn_Sac || '',
                        gstDescription: product?.gstDescription || '',
                        taxationType: product?.taxationType || '',
                        gstRate: product?.gstRate || '',
                        typeOfSupply: product?.typeOfSupply || '',
                        productId: product?.productId || '',
                        colorName: product?.colorName || '',
                        barcode: product?.barcode || '',
                        finishedWeight: product?.finishedWeight || '',
                        materialWeight: product?.materialWeight || '',
                        warpColors: product?.warpColors || '',
                        weftColors: product?.weftColors || '',
                        weave: product?.weave || '',
                        warpYarn: product?.warpYarn || '',
                        weftYarn: product?.weftYarn || '',
                        gstratedetails: product?.gstratedetails || '',
                        pixAndReed: product?.pixAndReed || '',
                        // units: product?.units || '',
                        cost: product?.cost || '',
                        mrp: product?.mrp || '',
                        dyeingCost: product?.dyeingCost || '',
                        wholesalePrice: product?.wholesalePrice || '',
                        usdPrice: product?.usdPrice || '',
                        euroPrice: product?.euroPrice || '',
                        gbpPrice: product?.gbpPrice || '',
                        rmbPrice: product?.rmbPrice || '',
                        productDescription: product?.productDescription || '',
                        baseColour: product?.baseColour || '',
                        kaniColors: product?.kaniColors || '',
                        fabricWeave: product?.fabricWeave || '',
                        fabricCode: product?.fabricCode || '',
                        fabricCost: product?.fabricCost || '',
                        productStatus: product?.productStatus || '',
                        supplier: productSuppliers,
                        // supplierCode: product?.supplierCode || { id: 0 },
                        embroideryCost: product?.embroideryCost || '',
                        totalCost: product?.totalCost || '',
                        slabBasedRates: product?.slabBasedRates || [],
                        unit: product.unit || { id: 0 },
                        // supplierCode: product.supplierCode || { id: 0 }

                        // igst :vaaluee?.hsnCode?.igst ??product?.hsnCode?.igst ??  '',
                        // cgst :vaaluee?.hsnCode?.cgst ?? product?.hsnCode?.cgst ?? '',
                        // sgst :vaaluee?.hsnCode?.sgst ??product?.hsnCode?.sgst ??  '',
                        // productDescriptionn : vaaluee?.hsnCode?.productDescription ?? product?.hsnCode?.productDescription ??''








                    }}
                    validate={values => {

                        const errors = {};

                        if (values) {


                            setvaaluee(values)
                            // setFieldValue('productId', productIdField);
                        }
                        return errors;


                    }}
                // onSubmit={(values) => {
                //     console.log('Submitted values:', values);
                //     // Add API call for updating the product here
                // }}
                // onSubmit={onSubmit}
                 onSubmit={handleUpdateSubmit}
                >
                    {({ setFieldValue, values }) => (
                        
                        <form>
                            <div className="flex flex-col gap-9">
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                        <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                            Update Supplier Product
                                        </h3>
                                    </div>
                                    <div className="p-6.5">
                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                                {/* Product Group Field */}
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Product Group <span className='text-red-700 text-xl'> *</span>
                                                    </label>
                                                    <div className="bg-white dark:bg-form-Field">
                                                        <ReactSelect
                                                            name="productGroup"
                                                            value={productGroupOption?.find(option => option.value === values?.productGroup?.id) || null}
                                                            onChange={(option) => setFieldValue('productGroup', option ? option.productGroupObject : null)}
                                                            options={productGroupOption}
                                                            styles={customStyles}
                                                            className="bg-white dark:bg-form-Field"
                                                            classNamePrefix="react-select"
                                                            placeholder="Select Product Group"
                                                            isDisabled={true}  // This makes it readonly
                                                        />
                                                    </div>
                                                </div>

                                                {/* Sub Group Field */}
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Sub Group <span className='text-red-700 text-xl'> *</span>
                                                    </label>
                                                    <div className="bg-white dark:bg-form-Field">
                                                        <ReactSelect
                                                            name="subGroup"
                                                            value={subGroupOptions?.find(option => option.value === values?.subGroup?.id) || null}
                                                            onChange={(option) => setFieldValue('subGroup', option ? { id: option.subGroupObject.id } : null)}
                                                            options={subGroupOptions}
                                                            styles={customStyles}
                                                            className="bg-white dark:bg-form-Field"
                                                            classNamePrefix="react-select"
                                                            placeholder="Select Sub Group"
                                                            isDisabled={true}  // This makes it readonly
                                                        />
                                                    </div>
                                                </div>

                                                {/* Color Group Field */}
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Color Group <span className='text-red-700 text-xl'> *</span>
                                                    </label>
                                                    <div className="z-20 bg-transparent dark:bg-form-field">
                                                        <ReactSelect
                                                            name="colors"
                                                            value={colorGroupOptions.find(option => option.value === values.colors?.id) || null}
                                                            onChange={(option) => setFieldValue('colors', option ? option.color : null)}
                                                            options={colorGroupOptions}
                                                            styles={customStyles}
                                                            className="bg-white dark:bg-form-field"
                                                            classNamePrefix="react-select"
                                                            placeholder="Select Color Group"
                                                            isDisabled={true}  // This makes it readonly
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            

                                              {/* Second Row */}
                                                 <div className="mb-4.5 flex flex-wrap gap-6">
                                                                                           
                                            
                                                     {/* Design Name */}
                                                     <div className="flex-1 min-w-[300px]">
                                                         <label className="mb-2.5 block text-black dark:text-white">
                                                             Design Name <span className='text-red-700 text-xl'> *</span>
                                                         </label>
                                                         <div className="z-20 bg-transparent dark:bg-form-Field">
                                                             <ReactSelect
                                                                 name="design"
                                                                 value={designOptions?.find(option => option.value === values.design?.id) || null}
                                                                 onChange={(option) => {
                                                                     setFieldValue('design', option ? option.designObject : null);
                                                                     // Automatically set design code when design is selected
                                                                     if (option && option.designCode) {
                                                                         setFieldValue('designCode', option.designCode);
                                                                     } else {
                                                                         setFieldValue('designCode', '');
                                                                     }
                                                                     // ProductId will be updated by the useEffect above
                                                                 }}
                                                                 options={designOptions}
                                                                 styles={customStyles}
                                                                 className="bg-white dark:bg-form-Field"
                                                                 classNamePrefix="react-select"
                                                                 placeholder="Select Design"
                                                                 isDisabled={true}
                                                            />
                                                         </div>
                                                     </div>
                                            
                                                     <div className="flex-1 min-w-[300px]">
                                                                                                <label className="mb-2 block text-black dark:text-white">Design Code</label>
                                                                                                <Field
                                                                                                    name='designCode'
                                                                                                    type="text"
                                                                                                    placeholder="Enter Design Code"
                                                                                                    onChange={(e) => {
                                                                                                        setFieldValue('designCode', e.target.value);
                                                                                                    }}
                                                                                                    readOnly
                                                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 mt-[6px] px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                                />
                                                                                                <ErrorMessage name="designCode" component="div" className="text-red-500" />
                                                     </div>
                                            
                                                                                            <div className="flex-1 min-w-[300px]">
                                                                                                <label className="mb-2.5 block text-black dark:text-white">
                                                                                                    Color Name <span className='text-red-700 text-xl'> *</span>
                                                                                                </label>
                                                                                                <Field
                                                                                                    name='colorName'
                                                                                                    type="text"
                                                                                                    placeholder="Enter Color name"
                                                                                                    readOnly
                                                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                                />
                                                                                            </div>
                                            
                                                                                            {/* Color Name */}
                                            
                                                                                        </div>


                                                                                     {/* Design Code and Color Code */}
                                            <div className="mb-4.5 flex flex-wrap gap-6">



                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2 block text-black dark:text-white">Color Code</label>
                                                    <Field
                                                        name='colorCode'
                                                        type="text"
                                                        placeholder="Enter Color Code"
                                                        readOnly
                                                        onChange={(e) => {
                                                            setFieldValue('colorCode', e.target.value);
                                                        }}
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 mt-[6px] px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                    />
                                                    <ErrorMessage name="colorCode" component="div" className="text-red-500" />
                                                </div>

                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Style <span className='text-red-700 text-xl'> *</span>
                                                    </label>
                                                    <div className="relative z-20 bg-transparent dark:bg-form-Field">
                                                        <ReactSelect
                                                            name="styles"
                                                            value={styleOptions?.find(option => option.value === values.styles?.id) || null}
                                                            onChange={(option) => setFieldValue('styles', option ? option.styleObject : null)}
                                                            options={styleOptions}
                                                            styles={{
                                                                ...customStyles,
                                                                menuPortal: (base) => ({
                                                                    ...base,
                                                                    zIndex: 9999,
                                                                }),
                                                            }}
                                                            className="bg-white dark:bg-form-Field"
                                                            classNamePrefix="react-select"
                                                            placeholder="Select Style"
                                                            isDisabled={true}

                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Size(in cms) <span className='text-red-700 text-xl'> *</span>
                                                    </label>
                                                    <div className="relative z-20 bg-transparent dark:bg-form-Field">
                                                        <ReactSelect
                                                            name="sizes"
                                                            value={sizeOptions?.find(option => option.value === values.sizes?.id) || null}
                                                            onChange={(option) => {
                                                                setFieldValue('sizes', option ? option.sizeObject : null);
                                                                // Automatically set size code when size is selected
                                                                if (option && option.sizeCode) {
                                                                    setFieldValue('sizeCode', option.sizeCode);
                                                                } else {
                                                                    setFieldValue('sizeCode', '');
                                                                }
                                                            }}
                                                            options={sizeOptions}
                                                            styles={{
                                                                ...customStyles,
                                                                menuPortal: (base) => ({
                                                                    ...base,
                                                                    zIndex: 9999,
                                                                }),
                                                            }}
                                                            className="bg-white dark:bg-form-Field"
                                                            classNamePrefix="react-select"
                                                            placeholder="Select Size"
                                                        // isDisabled={true}
                                                        />
                                                    </div>
                                                </div>
                                            </div>


    {/* Product ID and Barcode */}
                                            <div className="mb-4.5 flex flex-wrap gap-6">

                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2 block text-black dark:text-white">Size Code</label>
                                                        <Field
                                                            name='sizeCode'
                                                            type="text"
                                                            placeholder="Enter Size Code"
                                                            readOnly
                                                            onChange={(e) => {
                                                                setFieldValue('sizeCode', e.target.value);
                                                            }}
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 mt-[6px] px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                        <ErrorMessage name="sizeCode" component="div" className="text-red-500" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Product Id</label>
                                                    <Field
                                                        name='productId'
                                                        type="text"
                                                        placeholder="Enter Product id"
                                                        value={values.productId}
                                                        readOnly
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Barcode</label>
                                                    <Field
                                                        name='barcode'
                                                        type="text"
                                                        placeholder="Barcode will auto-generate"
                                                        readOnly
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>
                                            </div>


                                              {/* Weight Fields */}
                                            <div className="mb-4.5 flex flex-wrap gap-6">
                                                <div className="flex-1 min-w-[300px] mt-[-10px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Product Status <span className='text-red-700 text-xl'> *</span></label>
                                                    <div className="z-20 bg-transparent dark:bg-form-Field">
                                                        <ReactSelect
                                                            name="productCategory"
                                                            value={productCategoryOptions?.find(option => option.value === values.productCategory?.id) || null}
                                                            onChange={(option) => setFieldValue('productCategory', option ? option.productCategoryObject : null)}
                                                            options={productCategoryOptions}
                                                            styles={customStyles}
                                                            className="bg-white dark:bg-form-Field"
                                                            classNamePrefix="react-select"
                                                            placeholder="Select Product Status"
                                                            isDisabled={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Finished Weight</label>
                                                    <Field
                                                        name='finishedWeight'
                                                        type="number"
                                                        placeholder="Enter Finished Weight"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        readOnly
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Material Weight</label>
                                                    <Field
                                                        name='materialWeight'
                                                        type="number"
                                                        placeholder="Enter Material Weight"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        readOnly
                                                   />
                                                </div>
                                            </div>



                                            
                                            {/* Color/Weave Fields */}
                                                                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                                                                            <div className="flex-1 min-w-[300px]">
                                                                                                <label className="mb-2.5 block text-black dark:text-white">Warp / Base Color</label>
                                                                                                <Field
                                                                                                    name="warpColors"
                                                                                                    type="text"
                                                                                                    placeholder="Enter Warp / Base Color"
                                                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                                                                    readOnly
                                                                                                />
                                                                                            </div>
                                                                                            <div className="flex-1 min-w-[300px]">
                                                                                                <label className="mb-2.5 block text-black dark:text-white">Weft / Emb / Kani Color</label>
                                                                                                <Field
                                                                                                    name="weftColors"
                                                                                                    type="text"
                                                                                                    placeholder="Enter Weft / Emb / Kani Color"
                                                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                                                                    readOnly
                                                                                                />
                                                                                            </div>
                                                                                        </div>



                                                                                          <div className="mb-4.5 flex flex-wrap gap-6">
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white"> Weave <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                    <div className=" z-20 bg-transparent dark:bg-form-Field">
                                                        <ReactSelect
                                                            name="weave"
                                                            value={weaveOptions?.find(option => option.value === values.weave?.id) || null}
                                                            onChange={(option) => setFieldValue('weave', option ? { id: option.value } : null)}
                                                            options={weaveOptions}
                                                            styles={customStyles} // Pass custom styles here
                                                            className="bg-white dark:bg-form-Field"
                                                            classNamePrefix="react-select"
                                                            placeholder="Select Weave"
                                                            isDisabled={true}
                                                        />
                                                    </div>


                                                </div>
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Warp Yarn</label>
                                                    <Field
                                                        name='warpYarn'
                                                        type="text"
                                                        placeholder="Enter Warp Yarn"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Weft Yarn</label>
                                                    <Field
                                                        name='weftYarn'
                                                        type="text"
                                                        placeholder="Enter Weft Yarn"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        readOnly
                                                    />
                                                </div>
                                            </div>


                                              <div className="mb-4.5 flex flex-wrap gap-6">
                                                                                            <div className="flex-1 min-w-[300px]">
                                                                                                <label className="mb-2.5 block text-black dark:text-white">Pic & Read</label>
                                                                                                <Field
                                                                                                    name='pixAndReed'
                                                                                                    type="text"
                                                                                                    placeholder="Enter Pic & Read"
                                                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                                    readOnly
                                                                                                />
                                                                                            </div>
                                                                                            <div className="flex-1 min-w-[300px]">
                                                                                                <label className="mb-2.5 block text-black dark:text-white">Units <span className='text-red-700 text-xl'> *</span></label>
                                                                                                <div className="z-20 bg-transparent dark:bg-form-Field">
                                                                                                    <ReactSelect
                                                                                                        name="unit"
                                                                                                        value={unitOptions?.find(option => option.value === values.unit?.id) || null}
                                                                                                        onChange={(option) => setFieldValue('unit', option ? option.unitGroupObject : null)}
                                                                                                        options={unitOptions}
                                                                                                        styles={customStyles}
                                                                                                        className="bg-white dark:bg-form-Field"
                                                                                                        classNamePrefix="react-select"
                                                                                                        placeholder="Select Units"
                                                                                                        isDisabled={true}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>


                                                                                         {/* Costing Section */}
                                            <h1 className='text-center text-xl mt-[50px] mb-[50px] font-semibold'>Costing</h1>

                                                                 <div className="mb-4.5 flex flex-wrap gap-6">
                                                                     <div className="flex-2 min-w-[250px]">
                                                                         <label className="mb-2.5 block text-black dark:text-white">Cost Price</label>
                                                                         <Field
                                                                             name='cost'
                                                                             type="text"
                                                                             placeholder="Enter Cost Price"
                                                                              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                         />
                                                                     </div>
                                                                     <div className="flex-2 min-w-[250px]">
                                                                         <label className="mb-2.5 block text-black dark:text-white">Dyeing Cost</label>
                                                                         <Field
                                                                             name='dyeingCost'
                                                                             type="text"
                                                                             placeholder="Enter Dyeing Cost"
                                                                             className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                             readOnly
                                                                         />
                                                                     </div>
                                                                 </div>


                                                                                    {/* Pricing Section */}
                                                                            <h1 className='text-center text-xl mt-[50px] mb-[50px] font-semibold'>Pricing</h1>
                                                                                                                        
                                                                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                                                                                <div className="flex-2 min-w-[250px]">
                                                                                                    <label className="mb-2.5 block text-black dark:text-white">Retail Mrp</label>
                                                                                                    <Field
                                                                                                        name='retailMrp'
                                                                                                    type="text"
                                                                                                        placeholder="Enter Retail Mrp"
                                                                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                                        readOnly
                                                                                                    />
                                                                                                </div>
                                                                                                                                                    <div className="flex-2 min-w-[250px]">
                                                                                                <label className="mb-2.5 block text-black dark:text-white">WS INR</label>
                                                                                            <Field
                                                                                                name='wholesalePrice'
                                                                                                type="text"
                                                                                                placeholder="Enter Wholesale Price"
                                                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                                readOnly
                                                                                            />
                                                                                        </div>
                                                                                        <div className="flex-2 min-w-[250px]">
                                                                                            <label className="mb-2.5 block text-black dark:text-white">WS USD</label>
                                                                                            <Field
                                                                                                    name='usdPrice'
                                                                                                    type="text"
                                                                                                    placeholder="Enter USD Price"
                                                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                                    readOnly
                                                                                                />
                                                                                            </div>
                                                                                            </div>
                                                                                                                                    
                                                                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                                                                            <div className="flex-2 min-w-[250px]">
                                                                                                <label className="mb-2.5 block text-black dark:text-white">WS EURO</label>
                                                                                                <Field
                                                                                                    name='euroPrice'
                                                                                                    type="text"
                                                                                                    placeholder="Enter EURO Price"
                                                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                                />
                                                                                            </div>
                                                                                            <div className="flex-2 min-w-[250px]">
                                                                                                <label className="mb-2.5 block text-black dark:text-white">WS GBP</label>
                                                                                                <Field
                                                                                                    name='gbpPrice'
                                                                                                    type="text"
                                                                                                    placeholder="Enter GBP Price"
                                                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                                    readOnly
                                                                                                />
                                                                                            </div>
                                                                                        <div className="flex-2 min-w-[250px]">
                                                                                            <label className="mb-2.5 block text-black dark:text-white">WS RMB</label>
                                                                                                <Field
                                                                                                name='rmbPrice'
                                                                                                type="text"
                                                                                                    placeholder="Enter RMB Price"
                                                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                                    readOnly
                                                                                                />
                                                                                            </div>
                                                                                        </div>


                                                                                        {/* Product Description */}
                                                                                                <div className="mb-6">
                                                                                                    <label className="mb-2.5 block text-black dark:text-white">Product Description</label>
                                                                                                    <Field
                                                                                                        name='productDescription'
                                                                                                        as="textarea"
                                                                                                        rows={6}
                                                                                                        placeholder="Type your message"
                                                                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                                        readOnly
                                                                                                    />
                                                                                                </div>
                                                                                                                                                                                
                                                                                                {/* Statutory Details */}
                                                                                                <h1 className='text-center text-xl mt-[40px] mb-[40px] font-semibold'>Statutory Details</h1>
                                                    
                                                                                                <div className="flex flex-wrap gap-4">
                                                                                                    <div className="flex-1 min-w-[250px]">
                                                                                                        <label className="mb-2.5 block text-black dark:text-white">GST DETAILS</label>
                                                                                                        <div className="z-20 bg-transparent dark:bg-form-Field">
                                                                                                            <ReactSelect
                                                                                                                name="gstDetails"
                                                                                                                options={gstOptions}
                                                                                                                value={gstOptions.find((option) => option.value === values.gstDetails)}
                                                                                                                onChange={(option) => setFieldValue("gstDetails", option?.value)}
                                                                                                                styles={customStyles}
                                                                                                                className="bg-white dark:bg-form-Field"
                                                                                                                classNamePrefix="react-select"
                                                                                                                placeholder="Select GST details"
                                                                                                                isDisabled={true}
                                                                                                            />
                                                                                                        </div>
                                                                                                    </div>
                                                    
                                                                                                    {(values.gstDetails === "Applicable") && (
                                                                                                        <div className="flex-1 min-w-[250px]">
                                                                                                            <label className="mb-2.5 block text-black dark:text-white">GST RATE DETAILS</label>
                                                                                                            <ReactSelect
                                                                                                                name="gstratedetails"
                                                                                                                options={gstdetails}
                                                                                                                value={gstdetails.find((option) => option.value === values.gstratedetails)}
                                                                                                                onChange={(option) => handlerateDetails(option, setFieldValue)}
                                                                                                                styles={customStyles}
                                                                                                                classNamePrefix="react-select"
                                                                                                                placeholder="Enter GST Rate Details"
                                                                                                                
                                                                                                            />
                                                                                                        </div>
                                                                                                    )}
                                                                                                </div>
                                                                                                    
                                                                                            <div className="mb-4.5 gap-6">
                                                                                                <div className="mb-4.5 mt-6">
                                                                                                    {values.gstratedetails === "Use GST Classification" ? (
                                                                                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                                                                                            <div className="flex-2 min-w-[250px]">
                                                                                                                <label className="mb-2.5 block text-black dark:text-white">
                                                                                                                    HSN Code <span className="text-red-700 text-xl">*</span>
                                                                                                                </label>
                                                                                                                <ReactSelect
                                                                                                                    name="hsnCode"
                                                                                                                    value={hsnOptions?.find((option) => option.value === values.hsnCode?.id) || null}
                                                                                                                    onChange={(option) => setFieldValue("hsnCode", option ? option.hsnObject : null)}
                                                                                                                    options={hsnOptions}
                                                                                                                    styles={customStyles}
                                                                                                                    className="bg-white dark:bg-form-Field"
                                                                                                                    classNamePrefix="react-select"
                                                                                                                    placeholder="Select HSN Code"
                                                                                                                />
                                                                                                            </div>
                                                                                        <div className="flex-2 min-w-[250px]">
                                                                                            <label className="mb-2.5 block text-black dark:text-white">IGST (%)</label>
                                                                                            <Field
                                                                                                type="number"
                                                                                                value={values.hsnCode?.igst || ''}
                                                                                                disabled
                                                                                                placeholder="IGST"
                                                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:disabled:bg-slate-600 dark:text-white dark:focus:border-primary"
                                                                                            />
                                                                                        </div>
                                                                                        <div className="flex-2 min-w-[250px]">
                                                                                            <label className="mb-2.5 block text-black dark:text-white">CGST (%)</label>
                                                                                            <Field
                                                                                                type="number"
                                                                                                value={values.hsnCode?.cgst || ''}
                                                                                                disabled
                                                                                                placeholder="CGST"
                                                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:disabled:bg-slate-600 dark:text-white dark:focus:border-primary"
                                                                                            />
                                                                                        </div>
                                                                                        <div className="flex-2 min-w-[250px]">
                                                                                            <label className="mb-2.5 block text-black dark:text-white">SGST (%)</label>
                                                                                            <Field
                                                                                                type="number"
                                                                                                value={values.hsnCode?.sgst || ''}
                                                                                                disabled
                                                                                                placeholder="SGST"
                                                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:disabled:bg-slate-600 dark:text-white dark:focus:border-primary"
                                                                                            />
                                                                                        </div>
                                                                                        <div className="flex-2 min-w-[250px]">
                                                                                            <label className="mb-2.5 block text-black dark:text-white">GST Description</label>
                                                                                            <Field
                                                                                                name="gstDescription"
                                                                                                value={values.hsnCode?.productDescription || ''}
                                                                                                type="text"
                                                                                                placeholder="GST Description"
                                                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                            />
                                                                                        </div>
                                                                                        <div className="flex-2 min-w-[250px]">
                                                                                            <label className="mb-2.5 block text-black dark:text-white">HSN/SAC</label>
                                                                                            <Field
                                                                                                name="hsn_Sac"
                                                                                                type="text"
                                                                                                placeholder="Enter HSN/SAC"
                                                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                ) : null}
                                                                            </div>
                                                                                                    
                                                                        <h1 className='text-center text-xl mt-[40px] mb-[40px] font-semibold'>GST Rate & Related Details</h1>
                                                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                                                            <div className="flex-2 min-w-[250px]">
                                                                                <label className="mb-2.5 block text-black dark:text-white">Taxation Type</label>
                                                                                <Field
                                                                                    name="taxationType"
                                                                                    type="text"
                                                                                    placeholder="Enter Taxation Type"
                                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                    readOnly
                                                                                />
                                                                            </div>
                        
                                                                            <div className="flex-2 min-w-[250px]">
                                                                                <label className="mb-2.5 block text-black dark:text-white">Type of Supply</label>
                                                                                <ReactSelect
                                                                                    name="typeOfSupply"
                                                                                    options={supplyType}
                                                                                    value={supplyType.find(option => option.value === values.typeOfSupply)}
                                                                                    onChange={(option) => setFieldValue("typeOfSupply", option?.value)}
                                                                                    styles={customStyles}
                                                                                    placeholder="Enter Type of Supply"
                                                                                    isDisabled={true}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                                                    



                                
                                        {/* <div className="mb-6">
                                            <label className="mb-2.5 block text-black dark:text-white"> Product Description </label>
                                            <textarea
                                                name='productDescription'
                                                rows={6}
                                                placeholder="Type your message"
                                                value={values.productDescription}
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                            ></textarea>
                                        </div> */}



                                                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                                                  <div className="flex flex-col space-y-4">
                                                                                      {/* Upload Field */}
                                                                                      <div className="flex-1 min-w-[400px] max-w-[600px]">
                                                                                          <label className="mb-2.5 block text-black dark:text-white">
                                                                                              Reference Image <span className="text-meta-1">*</span>
                                                                                          </label>
                                                                                          <div className="relative w-full">
                                                                                              <Field
                                                                                                  name="refrenceImage"
                                                                                                  type="file"
                                                                                                  //multiple={false}
                                                                                                  multiple // Allow multiple files
                                                                                                  accept="image/*"
                                                                                                  onChange={handleFileChange}
                                                                                                  className="absolute inset-0 z-50 w-full h-full opacity-0 cursor-pointer"
                                                                                              />
                                      
                                                                                              <div className="flex flex-col items-center justify-center space-y-3 border-[1.5px] border-stroke bg-transparent py-3 px-5 rounded text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary">
                                                                                                  <span className="flex h-10 w-10 items-center justify-center rounded-full border p-3 border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                                                                                                      <svg
                                                                                                          width="16"
                                                                                                          height="16"
                                                                                                          viewBox="0 0 16 16"
                                                                                                          fill="none"
                                                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                                                      >
                                                                                                          <path
                                                                                                              fillRule="evenodd"
                                                                                                              clipRule="evenodd"
                                                                                                              d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                                                                                              fill="#3C50E0"
                                                                                                          />
                                                                                                          <path
                                                                                                              fillRule="evenodd"
                                                                                                              clipRule="evenodd"
                                                                                                              d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                                                                                              fill="#3C50E0"
                                                                                                          />
                                                                                                          <path
                                                                                                              fillRule="evenodd"
                                                                                                              clipRule="evenodd"
                                                                                                              d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                                                                                              fill="#3C50E0"
                                                                                                          />
                                                                                                      </svg>
                                                                                                  </span>
                                                                                                  <p>
                                                                                                      <span className="text-primary">Click to upload</span> or drag and drop
                                                                                                  </p>
                                                                                                  <p className="mt-1.5"> PNG, JPG or GIF(Less Than 5 mb)</p>
                                                                                                  <p>(max, 800 X 800px)</p>
                                                                                              </div>
                                                                                          </div>
                                                                                      </div>
                                      
                                      
                                      
                                      
                                      
                                                                                      <div className="mt-4">
                                      
                                      
                                                                                          <label className="mb-2.5 block text-black dark:text-white">
                                                                                              Image Previews
                                                                                          </label>
                                      
                                      
                                                                                          <div className="p-4 border-2 border-dashed rounded-md bg-gray-50 dark:bg-boxdark dark:border-strokedark flex flex-row">
                                          {/* Grid Layout */}
                                          <div className="flex flex-col grid-cols-3">
                                              <div className="flex flex-row gap-4">
                                                  {/* Image Preview */}
                                                  {product?.images
                                          .filter((ref) => ref.referenceImage && !ref.actualImage) // Exclude images that have actualImage
                                          .map((ref, index) => (
                                              <div key={index} className="relative group">
                                                  <img
                                                      className="h-20 w-20 transition-transform duration-500 ease-in-out transform group-hover:scale-[1] group-hover:shadow-2xl"
                                                      crossOrigin="use-credentials"
                                                      src={`${GET_IMAGE}/products/getimages/${ref.referenceImage}`}
                                                      alt="Reference Image"
                                                  />
                                                  {/* Remove Button */}
                                                  <button
                                                      type="button"
                                                      onClick={() => handleRemoveImagePreview(ref.referenceImage)}
                                                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                  >
                                                      &times;
                                                  </button>
                                              </div>
                                          ))}
                                      
                                              </div>
                                          </div>
                                      </div>
                                      
                                      
                                      
                                      
                                      
                                      
                                                                                      </div>
                                      
                                      
                                      
                                      
                                                                                      {previews.length > 0 && (
                                                                                          <div className="mt-4">
                                                                                              <label className="mb-2.5 block text-black dark:text-white">
                                                                                                  New Image Previews
                                                                                              </label>
                                                                                              {/* Box Wrapper */}
                                                                                              <div className="p-4 border-2 border-dashed rounded-md bg-gray-50 dark:bg-boxdark dark:border-strokedark">
                                                                                                  {/* Grid Layout */}
                                                                                                  <div className="grid grid-cols-3 gap-4">
                                                                                                      {previews.map((preview, index) => (
                                                                                                          <div key={index} className="relative group">
                                                                                                              {/* Image Preview */}
                                                                                                              <img
                                                                                                                  src={preview.url}
                                                                                                                  alt={`Preview ${index + 1}`}
                                                                                                                  className="h-20 border rounded object-cover min-w-[100px] max-w-[100px] transition-transform duration-200 hover:scale-110"
                                                                                                              />
                                                                                                              {/* Cancel Button */}
                                                                                                              <button
                                                                                                                  onClick={() => handleRemoveImage(index)}
                                                                                                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                                              >
                                                                                                                  &times;
                                                                                                              </button>
                                                                                                          </div>
                                                                                                      ))}
                                                                                                  </div>
                                                                                              </div>
                                                                                          </div>
                                                                                      )}
                                      
                                      
                                      
                                                                                  </div>
                                      
                                                                                  <div className="flex-1 min-w-[300px]">
                                                                                      {/* Upload Field */}
                                                                                      <div className="flex-1 min-w-[400px] max-w-[600px]">
                                                                                          <label className="mb-2.5 block text-black dark:text-white">
                                                                                              Actual Image <span className="text-meta-1">*</span>
                                                                                          </label>
                                                                                          <div className="relative w-full">
                                                                                              <Field
                                                                                                  name="actualImage"
                                                                                                  type="file"
                                                                                                  //multiple={false}
                                                                                                  multiple // Allow multiple files
                                                                                                  accept="image/*"
                                                                                                  onChange={handleFileChangeActual}
                                                                                                  className="absolute inset-0 z-50 w-full h-full opacity-0 cursor-pointer"
                                                                                              />
                                                                                              <div className="flex flex-col items-center justify-center space-y-3 border-[1.5px] border-stroke bg-transparent py-3 px-5 rounded text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary">
                                                                                                  <span className="flex h-10 w-10 items-center justify-center rounded-full border p-3 border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                                                                                                      <svg
                                                                                                          width="16"
                                                                                                          height="16"
                                                                                                          viewBox="0 0 16 16"
                                                                                                          fill="none"
                                                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                                                      >
                                                                                                          <path
                                                                                                              fillRule="evenodd"
                                                                                                              clipRule="evenodd"
                                                                                                              d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                                                                                              fill="#3C50E0"
                                                                                                          />
                                                                                                          <path
                                                                                                              fillRule="evenodd"
                                                                                                              clipRule="evenodd"
                                                                                                              d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                                                                                              fill="#3C50E0"
                                                                                                          />
                                                                                                          <path
                                                                                                              fillRule="evenodd"
                                                                                                              clipRule="evenodd"
                                                                                                              d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                                                                                              fill="#3C50E0"
                                                                                                          />
                                                                                                      </svg>
                                                                                                  </span>
                                                                                                  <p>
                                                                                                      <span className="text-primary">Click to upload</span> or drag and drop
                                                                                                  </p>
                                                                                                  <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                                                                                                  <p>(max, 800 X 800px)</p>
                                                                                              </div>
                                                                                          </div>
                                                                                      </div>
                                      
                                      
                                                                                      <div className="mt-4">
                                      
                                      
                                                                                          <label className="mb-2.5 block text-black dark:text-white">
                                                                                              Image Previews
                                                                                          </label>
                                      
                                      
                                                                                          <div className="p-4 border-2 border-dashed rounded-md bg-gray-50 dark:bg-boxdark dark:border-strokedark flex flex-row">
                                          {/* Grid Layout */}
                                          <div className="flex flex-col grid-cols-3">
                                              <div className="flex flex-row gap-4">
                                                  {/* Image Preview */}
                                                  {product?.images.map((ref, index) => (
                                                      ref.actualImage && (
                                                          <div key={index} className="relative group">
                                                              <img
                                                                  className="h-20 w-20 transition-transform duration-500 ease-in-out transform group-hover:scale-[1] group-hover:shadow-2xl"
                                                                  crossOrigin="use-credentials"
                                                                  src={`${GET_IMAGE}/products/getimages/${ref.actualImage}`}
                                                                  alt="Product Image"
                                                              />
                                                              {/* Remove Button */}
                                                              <button
                                                                  type="button"
                                                                  onClick={() => handleRemoveImageActual(index)}
                                                                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                              >
                                                                  &times;
                                                              </button>
                                                          </div>
                                                      )
                                                  ))}
                                              </div>
                                          </div>
                                      </div>
                                      
                                      
                                      
                                      
                                      
                                                                                      </div>
                                      
                                      
                                                                                      {previewsActual.length > 0 && (
                                                                                          <div className="mt-4">
                                                                                              <label className="mb-2.5 block text-black dark:text-white">
                                                                                                  Image Previews
                                                                                              </label>
                                                                                              {/* Box Wrapper */}
                                                                                              <div className="p-4 border-2 border-dashed rounded-md bg-gray-50 dark:bg-boxdark dark:border-strokedark">
                                                                                                  {/* Grid Layout */}
                                                                                                  <div className="grid grid-cols-3 gap-4">
                                                                                                      {previewsActual.map((previewActual, index) => (
                                                                                                          <div key={index} className="relative group">
                                                                                                              {/* Image Preview */}
                                                                                                              <img
                                                                                                                  src={previewActual.url}
                                                                                                                  alt={`Preview ${index + 1}`}
                                                                                                                  className="h-20 border rounded object-cover min-w-[100px] max-w-[100px] transition-transform duration-200 hover:scale-110"
                                                                                                              />
                                                                                                              {/* Cancel Button */}
                                                                                                              <button
                                                                                                                  // onClick={() => handleRemoveActual(index)}
                                                                                                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                                              >
                                                                                                                  &times;
                                                                                                              </button>
                                                                                                          </div>
                                                                                                      ))}
                                                                                                  </div>
                                                                                              </div>
                                                                                          </div>
                                                                                      )}
                                      
                                      
                                      
                                                                                  </div>
                                      
                                      
                                      
                                      
                                                                              </div>
                                      

                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                            {/* Container for Supplier and Product Status */}
                                            <div className="flex flex-1 flex-col md:flex-row gap-6">
                                                {/* Supplier Field */}
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Supplier
                                                        <span className="text-red-700 text-xl mt-[40px] justify-center items-center"> *</span>
                                                    </label>
                                                    <div className="z-20 bg-transparent dark:bg-form-Field">
                                                        <ReactSelect
                                                            isDisabled={true}
                                                            isMulti
                                                            name="supplier"
                                                            value={values?.supplier?.map((supp) => ({
                                                                value: supp.supplier.id, // Correct value mapping
                                                                label: supp.supplier.name, // Display supplier name
                                                            }))}
                                                            styles={customStyles}
                                                            className="pointer-events-none bg-gray-100 dark:bg-gray-800 cursor-default"
                                                            classNamePrefix="react-select"
                                                            placeholder="Select Supplier Name"
                                                        />

                                                    </div>

                                                </div>

                                                {/* Product Status Field */}
                                                {/* <div className="flex-1 min-w-[300px]">
            <label className="mb-2.5 block text-black dark:text-white">Product Status</label>
            <Field
                name="productStatus"
                type="text"
                placeholder="Enter Product Status"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
            />
        </div> */}
                                              <div className="flex-1 min-w-[300px]">
    <label className="mb-2.5 block text-black dark:text-white">
        No Of Looms <span className='text-red-700 text-xl'> *</span>
    </label>
    <div className="bg-transparent dark:bg-form-Field">
        <ReactSelect
            name="looms"
            isMulti
            value={loomsOptions?.filter(option =>
                values.looms?.includes(option.value)
            ) || []}
            onChange={(selectedOptions) => {
                setFieldValue(
                    'looms',
                    selectedOptions?.map(option => option.value) || []
                );
            }}
            options={loomsOptions}
            styles={customStyles}
            className="bg-white dark:bg-form-Field"
            classNamePrefix="react-select"
            placeholder={values.looms && values.looms.length > 0 ? values.looms.join(', ') : "Select Workers/Looms"}
            isDisabled={true}
        />
    </div>
</div>
                                            </div>
                                        </div>




 


<div className="mb-4.5 flex flex-wrap gap-6">


     {/* <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white"> Supplier Code <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                            <div className=" bg-transparent dark:bg-form-Field">


                                                <ReactSelect
                                                    name="supplierCode"
                                                    value={
                                                        values?.supplierCode
                                                            ? { value: values.supplierCode.supplierCode, label: values.supplierCode.supplierCode }
                                                            : null
                                                    }
                                                   
                                                   
                                                    isDisabled={true}
                                                    styles={customStyles} // Pass custom styles here
                                                    className="bg-white dark:bg-form-Field"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select supplier Code"
                                                />



                                            </div>
                                            
                                        </div> */}

                                                                                            {/* Color Way Field */}
                                                    <div className="flex-1 min-w-[200px]">
                                                         <label className="mb-2.5 block text-black dark:text-white">
                                                        Color Way
                                                        </label>
                                                        <Field
                                                       
                                                        name='colorWeave'
                                                        type="text"
                                                        placeholder="Enter Color Weave"
                                                        value={values.colorWeave}
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
</div>
                                       
                                        

<div className="flex justify-center mt-4"> {/* Centering the button */}
                                            <button
                                                type="button" // Ensures the button does not trigger the form submission
                                                onClick={(e) => handleUpdateSubmit(values, e)}
                                                className="w-1/3 px-6 py-2 text-white bg-primary rounded-lg shadow hover:bg-primary-dark focus:outline-none" // Increased width
                                            >
                                                Update
                                            </button>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>

        </DefaultLayout>
    );
};

export default UpdateKaniProducts;
