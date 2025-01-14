import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import { ErrorMessage, Field, Form, Formik, useFormik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import useColorMode from '../../hooks/useColorMode';
import ReactSelect from 'react-select';

import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import useProduct from '../../hooks/useProduct';
import { useSelector } from 'react-redux';
import Modall from "./Modall.jsx"
import { customStyles as createCustomStyles } from '../../Constants/utils';
const AddProduct = () => {

    const [productGroupOption, setproductGroupOption] = useState([])
    const [colorGroupOptions, setcolorGroupOptions] = useState([])
    const [unitOptions, setunitOptions] = useState([])
    const [productCategoryOptions, setproductCategoryOptions] = useState([])
    const [designOptions, setdesignOptions] = useState([])
    const [styleOptions, setstyleOptions] = useState([])
    const [sizeOptions, setsizeOptions] = useState([])
    const [hsnOptions, sethsnOptions] = useState([])

    const [gstDetailModal, setgstDetailModal] = useState(false)
    const [supplierNameOptions, setsupplierNameOptions] = useState([])
    const [supplierCodeOptions, setsupplierCodeOptions] = useState([])

    const [referenceImages, setrefImage] = useState({})
    const [actualImages, setactualImage] = useState({})

    const [gstDetails, setgstDetails] = useState([])

    const [vaaluee, setvaaluee] = useState({})













    const productGroup = useSelector(state => state?.persisted?.productGroup);
    const colorGroup = useSelector(state => state?.persisted?.color);
    const unitGroup = useSelector(state => state?.persisted?.unit);
    const productCategory = useSelector(state => state?.persisted?.productCategory);
    const design = useSelector(state => state?.persisted?.design);
    const style = useSelector(state => state?.persisted?.style);
    const size = useSelector(state => state?.persisted?.size);
    const hsnCode = useSelector(state => state?.persisted?.hsn);
    const supplier = useSelector(state => state?.nonPersisted?.supplier);
    const theme = useSelector(state => state?.persisted?.theme);







    const [previews, setPreviews] = useState([]);
    const [previewsActual, setPreviewsActual] = useState([]);


    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files);
        const newPreviews = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
            referenceImage: file,  // Or actualImage depending on the logic
            actualImage: file,     // Or referenceImage depending on the logic
        }));
        await setrefImage(files || "")

        setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    };


    const handleFileChangeActual = async (event) => {
        const files = Array.from(event.target.files);

        const newPreviewsActual = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
            referenceImage: file,  // Or actualImage depending on the logic
            actualImage: file,     // Or referenceImage depending on the logic
        }));
        setPreviewsActual((prevPreviewsActual) => [...prevPreviewsActual, ...newPreviewsActual]);
        await setactualImage(files || "")

    };


    useEffect(() => {
        return () => {
            previews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previews]);








    const handleRemoveImage = (indexToRemove) => {
        setPreviews((prevPreviews) => {
            const updatedPreviews = [...prevPreviews];
            // Revoke the object URL to release memory
            URL.revokeObjectURL(updatedPreviews[indexToRemove].url);
            updatedPreviews.splice(indexToRemove, 1);
            return updatedPreviews;
        });
    };
    const handleRemoveActual = (indexToRemove) => {
        setPreviewsActual((prevPreviewsActual) => {
            const updatedPreviewsActual = [...prevPreviewsActual];
            // Revoke the object URL to release memory
            URL.revokeObjectURL(updatedPreviewsActual[indexToRemove].url);
            updatedPreviewsActual.splice(indexToRemove, 1);
            return updatedPreviewsActual;
        });
    };



    useEffect(() => {
        if (productGroup.data) {
            const formattedOptions = productGroup.data.map(product => ({
                value: product.id,
                label: product.productGroupName,
                productGroupObject: product,
            }));
            setproductGroupOption(formattedOptions);
        }
    }, [productGroup.data]);



    useEffect(() => {
        if (colorGroup.data) {
            const formattedOptions = colorGroup?.data.map(colorGroup => ({
                value: colorGroup.id,
                label: colorGroup?.colorName,
                colorGroupObject: colorGroup,
            }));
            setcolorGroupOptions(formattedOptions);
        }
    }, [colorGroup.data]);


    useEffect(() => {

    }, [])




    console.log(vaaluee, "huhu");
    useEffect(() => {
        if (productCategory.data) {
            const formattedOptions = productCategory.data.map(prodCat => ({
                value: prodCat.id,
                label: prodCat?.productCategoryName,
                productCategoryObject: prodCat,
            }));
            setproductCategoryOptions(formattedOptions);
        }
    }, [productCategory]);

    useEffect(() => {
        if (design.data) {
            const formattedOptions = design.data.map(design => ({
                value: design.id,
                label: design?.designName,
                designObject: design,
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
            }));
            setsizeOptions(formattedOptions);
        }
    }, [size.data]);

    useEffect(() => {
        if (hsnCode.data) {
            const formattedOptions = hsnCode.data.map(hsn => ({
                value: hsn.id,
                label: hsn?.hsnCodeName,
                hsnObject: hsn,
            }));
            sethsnOptions(formattedOptions);
        }
    }, [hsnCode]);
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
    useEffect(() => {
        if (supplier.data) {
            const formattedOptions = supplier.data.map(supp => ({
                value: supp.id,
                label: supp?.supplierCode,
                supplierCodeObject: supp,
                suplieridd: { id: supp.id }
            }));
            setsupplierCodeOptions(formattedOptions);
        }
    }, [supplier.data]);



    const customStyles = createCustomStyles(theme?.mode);

    const [formData, setformData] = useState({

    })
    const [selectedOption, setSelectedOption] = useState('');
    const [isOptionSelected, setIsOptionSelected] = useState(false);


    const weaveremb = [
        { value: 'BrandA', label: 'Brand A' },
        { value: 'BrandB', label: 'Brand B' },
        { value: 'BrandC', label: 'Brand C' }
    ];
    const productgrp = [
        { value: 'BrandA', label: 'Brand A' },
        { value: 'BrandB', label: 'Brand B' },
        { value: 'BrandC', label: 'Brand C' }
    ];
    const colorgrp = [
        { value: 'BrandA', label: 'Brand A' },
        { value: 'BrandB', label: 'Brand B' },
        { value: 'BrandC', label: 'Brand C' }
    ];


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





    const changeTextColor = () => {
        setIsOptionSelected(true); console.log(productGroup, 'productGroup');
        console.log(colorGroup, 'colorGroup');
        console.log(productCategory, 'productCategory');
        console.log(design, 'design');
        console.log(style, 'style');
        console.log(size, 'size');
        console.log(hsnCode, 'hsnCode');
        console.log(supplier, 'supplier');
        console.log(theme, 'theme');
    };

    const [productIdField, setproductIdField] = useState("")
    const {
        Product,
        edit,
        currentProduct,

        getUnits,
        units,

        handleSubmit,

    } = useProduct({ referenceImages, actualImages, productIdField, gstDetails });





    useEffect(() => {
        updateProductId()




    }, [vaaluee])



    useEffect(() => {
        getUnits();
    }, []); // Runs only once when the component mounts

    useEffect(() => {
        if (units) {
            const formattedunitOptions = units.map(unitGroup => ({
                value: unitGroup?.id,
                label: unitGroup?.name,
                unitGroupObject: unitGroup,
            }));
            setunitOptions(formattedunitOptions); // Update the state only when `units` changes
        }
    }, [units]); // Runs whenever `units` is updated

    const updateProductId = () => {




        const designValue = vaaluee.design ? vaaluee.design.designName : 'select Design';
        const colorNameValue = vaaluee?.colorName || 'select Color';

        const styleValue = vaaluee?.styles?.stylesName || 'select Style';
        const sizeValue = vaaluee?.sizes?.sizeName || 'select Size';

        // Concatenate the selected values for the productId
        const productId = `${designValue} ${colorNameValue} ${styleValue} ${sizeValue}`;

        // Set the productId field value

        setproductIdField(productId);




        // Trim to remove any excess spaces
    };

    const handlerateDetails = (option, setFieldValue) => {
        console.log(option, "optoooon");
        setFieldValue('gstratedetails', option.value);
        if (option.value === "specifySlabBasedRates") {

            setgstDetailModal(true)
        }

    }


    const handleModalSubmit = (values) => {

        console.log(values, "ggjio");
        setgstDetails(values)

    }



    return (
        <DefaultLayout>
            <Breadcrumb pageName="Products / AddProducts" />
            <div>
                <Formik
                    initialValues={currentProduct}


                    validate={values => {

                        const errors = {};

                        // if (!values.barcode || values.barcode === " ") {
                        //     errors.barcode = 'bar code Cannot Be Null';
                        // }


                        if (values) {


                            setvaaluee(values)
                            // setFieldValue('productId', productIdField);
                        }
                        return errors;





                    }}

                    onSubmit={handleSubmit}
                >

                    {({ setFieldValue, values }) => {


                        useEffect(() => {
                            const fabricCost = parseFloat(values.fabricCost) || 0;
                            const embroideryCost = parseFloat(values.embroideryCost) || 0

                            const totalCost = fabricCost + embroideryCost
                            setFieldValue("totalCost", totalCost.toFixed(2))

                        }, [values.fabricCost, values.embroideryCost])


                        // We call updateProductId every time Formik's `values` change
                        // Trigger when values change (e.g., size, color, etc.)

                        return (
                            <Form>


                                <div className="flex flex-col gap-9">
                                    {/* <!-- Contact Form --> */}
                                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                            <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                                Add Product
                                            </h3>
                                        </div>

                                        <div className="p-6.5">
                                            <div className="mb-4.5 flex flex-wrap gap-6">
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Product Group <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                    <div className="bg-white dark:bg-form-Field">
                                                        <ReactSelect
                                                            name="productGroup"
                                                            value={productGroupOption?.find(option => option.value === values.productGroup?.id) || null}
                                                            onChange={(option) => setFieldValue('productGroup', option ? option.productGroupObject : null)}
                                                            options={productGroupOption}
                                                            styles={customStyles}
                                                            className="bg-white dark:bg-form-Field"
                                                            classNamePrefix="react-select"
                                                            placeholder="Select Product Group"
                                                        />
                                                    </div>

                                                </div>


                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white"> Color Group <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                    <div className=" z-20 bg-transparent dark:bg-form-Field">
                                                        <ReactSelect
                                                            name="colors"
                                                            value={colorGroupOptions?.find(option => option.value === values.colors?.id) || null}
                                                            onChange={(option) => setFieldValue('colors', option ? option.colorGroupObject : null)}
                                                            options={colorGroupOptions}
                                                            styles={customStyles} // Pass custom styles here
                                                            className="bg-white dark:bg-form-Field"
                                                            classNamePrefix="react-select"
                                                            placeholder="Select Color Group"
                                                        />

                                                    </div>
                                                </div>
                                            </div>





                                            <div className="mb-4.5 flex flex-wrap gap-6">
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white"> Product Category <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                    <div className=" z-20 bg-transparent dark:bg-form-Field">
                                                        <ReactSelect
                                                            name="productCategory"
                                                            value={productCategoryOptions?.find(option => option.value === values.productCategory?.id) || null}
                                                            onChange={(option) => setFieldValue('productCategory', option ? option.productCategoryObject : null)}
                                                            options={productCategoryOptions}
                                                            styles={customStyles} // Pass custom styles here
                                                            className="bg-white dark:bg-form-Field"
                                                            classNamePrefix="react-select"
                                                            placeholder="Select Product Category"
                                                        />


                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2 block text-black dark:text-white"> Product Status</label>
                                                    <Field
                                                        name='productStatus'
                                                        type="text"
                                                        placeholder="Enter Product Status"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 mt-[6px] px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                    />
                                                    <ErrorMessage name="productStatus" component="div" className="text-red-500" />

                                                </div>

                                            </div>



                                            <div className="mb-4.5 flex flex-wrap gap-6">
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white"> Design Name <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span> </label>
                                                    <div className=" z-20 bg-transparent dark:bg-form-Field">
                                                        <ReactSelect
                                                            name="design"
                                                            value={designOptions?.find(option => option.value === values.design?.id) || null}
                                                            onChange={(option) => {
                                                                setFieldValue('design', option ? option.designObject : null)
                                                                updateProductId();

                                                            }


                                                            }
                                                            options={designOptions}
                                                            styles={customStyles} // Pass custom styles here
                                                            className="bg-white dark:bg-form-Field"
                                                            classNamePrefix="react-select"
                                                            placeholder="Select Design"
                                                        />

                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white"> Color Name <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                    <Field
                                                        name='colorName'
                                                        type="text"
                                                        onChange={e => {
                                                            setFieldValue('colorName', e.target.value);
                                                            updateProductId();
                                                        }}
                                                        placeholder="Enter your first name"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>
                                            </div>





                                            <div className="mb-4.5 flex flex-wrap gap-6">
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white"> Style <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                    <div className="relative z-20 bg-transparent dark:bg-form-Field">
                                                        <ReactSelect
                                                            name="styles"
                                                            value={styleOptions?.find(option => option.value === values.styles?.id) || null}
                                                            onChange={(option) => {
                                                                setFieldValue('styles', option ? option.styleObject : null)
                                                                updateProductId();
                                                            }}
                                                            options={styleOptions}
                                                            styles={{
                                                                ...customStyles,
                                                                menuPortal: (base) => ({
                                                                    ...base,
                                                                    zIndex: 9999,  // Set high z-index to make sure the dropdown appears above other components
                                                                }),
                                                            }} // Pass custom styles here
                                                            className="bg-white dark:bg-form-Field"
                                                            classNamePrefix="react-select"
                                                            placeholder="Select Style"
                                                        />

                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white"> Size (in cm) <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                    <div className="relative z-20 bg-transparent dark:bg-form-Field">
                                                        <ReactSelect
                                                            name="sizes"
                                                            value={sizeOptions?.find(option => option.value === values.sizes?.id) || null}
                                                            onChange={(option) => {
                                                                setFieldValue('sizes', option ? option.sizeObject : null)
                                                                updateProductId();
                                                            }}
                                                            options={sizeOptions}
                                                            styles={{
                                                                ...customStyles,
                                                                menuPortal: (base) => ({
                                                                    ...base,
                                                                    zIndex: 9999,  // Set high z-index to make sure the dropdown appears above other components
                                                                }),
                                                            }}
                                                            // styles={customStyles} // Pass custom styles here
                                                            className="bg-white dark:bg-form-Field"
                                                            classNamePrefix="react-select"
                                                            placeholder="Select Size"
                                                        />

                                                    </div>
                                                </div>
                                            </div>



                                            <div className="mb-4.5 flex flex-wrap gap-6">
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white"> Product Id </label>
                                                    <Field
                                                        name='productId'
                                                        type="text"
                                                        // value={values.productId || ''}
                                                        // onChange={setFieldValue('productId', productIdField)}
                                                        value={productIdField}
                                                        readonly
                                                        placeholder="Enter Product Id"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                    />
                                                    {/* <input type='hidden ' value={productIdField} name='productId'  /> */}
                                                </div>

                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white"> Barcode</label>
                                                    <Field
                                                        name='barcode'
                                                        type="text"
                                                        placeholder="Enter Barcode"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                    />
                                                    <ErrorMessage name="barcode" component="div" className="text-red-500" />

                                                </div>
                                            </div>




                                            {/* 
                                            <div className="mb-4.5 flex flex-wrap gap-6">
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white"> Batch</label>
                                                    <Field
                                                        name='batch'
                                                        type="text"
                                                        placeholder="Enter Batch"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>

                                            </div> */}


                                            <div className="mb-4.5 flex flex-wrap gap-6">
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white"> Finished Weight </label>
                                                    <Field
                                                        name='finishedWeight'
                                                        type="number"
                                                        placeholder="Enter Finished Weight"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white"> Material Weight</label>
                                                    <Field
                                                        name='materialWeight'
                                                        type="number"
                                                        placeholder="Enter material Weight"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>
                                            </div>










































































                                            {values.productGroup?.productGroupName === "Contemporary Pashmina" && (
                                                <>
                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">
                                                                Warp Colors
                                                            </label>
                                                            <Field
                                                                name="warpColors"
                                                                type="text"
                                                                placeholder="Enter Warp Colors"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">
                                                                Weft Colors
                                                            </label>
                                                            <Field
                                                                name="weftColors"
                                                                type="text"
                                                                placeholder="Enter Weft Colors"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>




                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Wave </label>
                                                            <Field
                                                                name='weave'
                                                                type="text"
                                                                placeholder="Enter Wave"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Warp Yarn</label>
                                                            <Field
                                                                name='warpYarn'
                                                                type="text"
                                                                placeholder="Enter Warp Yarn"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Weft Yarn</label>
                                                            <Field
                                                                name='weftYarn'
                                                                type="text"
                                                                placeholder="Enter Weft Yarn"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>


                                                    <div className="mb-4.5 flex flex-wrap gap-6">

                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Pic & Read</label>
                                                            <Field
                                                                name='pixAndReed'
                                                                type="text"
                                                                placeholder="Enter Pic & Read"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>

                                                        {/* <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Units </label>
                                                            <Field
                                                                name='units'
                                                                type="number"
                                                                placeholder="Enter Units"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div> */}
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Units <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                            <div className=" z-20 bg-transparent dark:bg-form-Field">
                                                                <ReactSelect
                                                                    name="unit"
                                                                    value={unitOptions?.find(option => option.value === values.unit?.id) || null}
                                                                    onChange={(option) => setFieldValue('unit', option ? option.unitGroupObject : null)}
                                                                    options={unitOptions}
                                                                    styles={customStyles} // Pass custom styles here
                                                                    className="bg-white dark:bg-form-Field"
                                                                    classNamePrefix="react-select"
                                                                    placeholder="Select Color Group"
                                                                />

                                                            </div>
                                                        </div>
                                                    </div>



                                                    <h1 className='text-center text-xl mt-[50px] mb-[50px]'>Costing</h1>


                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Cost Price </label>
                                                            <Field
                                                                name='cost'
                                                                type="text"
                                                                placeholder="Enter Cost Price "
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        {/* <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> MRP</label>
                                                            <Field
                                                                name='mrp'
                                                                type="text"
                                                                placeholder="Enter MRP"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div> */}
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Dyeing Cost </label>
                                                            <Field
                                                                name='dyeingCost'
                                                                type="text"
                                                                placeholder="Enter Dyeing Cost"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>


                                                    <h1 className='text-center text-xl mt-[50px] mb-[50px]'>Pricing</h1>
                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Retail Mrp</label>
                                                            <Field
                                                                name='retailMrp'
                                                                type="number"
                                                                placeholder="Enter Retail Mrp"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> WS INR</label>
                                                            <Field
                                                                name='wholesalePrice'
                                                                type="text"
                                                                placeholder="Enter Wholesale Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">WS USD </label>
                                                            <Field
                                                                name='usdPrice'
                                                                type="text"
                                                                placeholder="Enter USD Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>

                                                    </div>


                                                    <div className="mb-4.5 flex flex-wrap gap-6">
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
                                                            <label className="mb-2.5 block text-black dark:text-white">WS GBP </label>
                                                            <Field
                                                                name='gbpPrice'
                                                                type="text"
                                                                placeholder="Enter GBP Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">WS RMB </label>
                                                            <Field
                                                                name='rmbPrice'
                                                                type="text"
                                                                placeholder="Enter RMB Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            )}







                                            {/* Conditionally render the fields based on the selected product group */}
                                            {values.productGroup?.productGroupName === "Pashmina Embroidery" && (

                                                <>
                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">Base Color</label>
                                                            <Field
                                                                name="baseColour"
                                                                type="text"
                                                                placeholder="Enter Base Color"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">Embroidery Colors</label>
                                                            <Field
                                                                name="embroideryColors"
                                                                type="text"
                                                                placeholder="Enter Embroidery Colors"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>





                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Fabric Wave </label>
                                                            <Field
                                                                name='fabricWeave'
                                                                type="text"
                                                                placeholder="Enter Fabric Wave"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Fabric Code</label>
                                                            <Field
                                                                name='fabricCode'
                                                                type="text"
                                                                placeholder="Enter Fabric Code"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>


                                                    <div className="mb-4.5 flex flex-wrap gap-6">

                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Units <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                            <div className=" z-20 bg-transparent dark:bg-form-Field">
                                                                <ReactSelect
                                                                    name="unit"
                                                                    value={unitOptions?.find(option => option.value === values.unit?.id) || null}
                                                                    onChange={(option) => setFieldValue('unit', option ? option.unitGroupObject : null)}
                                                                    options={unitOptions}
                                                                    styles={customStyles} // Pass custom styles here
                                                                    className="bg-white dark:bg-form-Field"
                                                                    classNamePrefix="react-select"
                                                                    placeholder="Select Units"
                                                                />

                                                            </div>
                                                        </div>
                                                    </div>



                                                    <h1 className='text-center text-xl mt-[40px] mb-[40px] font-semibold'>Costing </h1>




                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Fabric Cost </label>
                                                            <Field
                                                                name='fabricCost'
                                                                type="text"
                                                                placeholder="Enter Fabric Cost"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Embroidery Cost</label>
                                                            <Field
                                                                name='embroideryCost'


                                                                type="text"
                                                                placeholder="Enter Embroidery Cost"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>


                                                    <div className="mb-4.5 flex flex-wrap gap-6">

                                                        {(values.productGroup?.productGroupName === "Pashmina Embroidery" || values.productGroup?.productGroupName === "Wool Embroidery") && (
                                                            <div className="flex-1 min-w-[300px]">
                                                                <label className="mb-2.5 block text-black dark:text-white"> Total Cost </label>
                                                                <Field
                                                                    name='totalCost'
                                                                    type="text"
                                                                    placeholder="Enter Total Cost"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                />
                                                            </div>

                                                        )}


                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> MRP</label>
                                                            <Field
                                                                name='mrp'
                                                                type="text"
                                                                placeholder="Enter MRP"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>









                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Dyeing Cost </label>
                                                            <Field
                                                                name='dyeingCost'
                                                                type="text"
                                                                placeholder="Enter Dyeing Cost"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>

                                                    </div>












                                                    <h1 className='text-center text-xl mt-[40px] mb-[40px] font-semibold'>Pricing </h1>


                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Retail Mrp</label>
                                                            <Field
                                                                name='retailMrp'
                                                                type="text"
                                                                placeholder="Enter Retail Mrp"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> WS INR</label>
                                                            <Field
                                                                name='wholesalePrice'
                                                                type="text"
                                                                placeholder="Enter Wholesale Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>

                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">WS USD </label>
                                                            <Field
                                                                name='usdPrice'
                                                                type="text"
                                                                placeholder="Enter USD Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>

                                                    </div>


                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">WS Euro</label>
                                                            <Field
                                                                name='euroPrice'
                                                                type="text"
                                                                placeholder="Enter Euro Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">WS GBP </label>
                                                            <Field
                                                                name='gbpPrice'
                                                                type="text"
                                                                placeholder="Enter GBP Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">WS RMB </label>
                                                            <Field
                                                                name='rmbPrice'
                                                                type="text"
                                                                placeholder="Enter RMB Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>




                                                </>
                                            )}


                                            {/* Kani */}
                                            {values.productGroup?.productGroupName === "Kani" && (
                                                <>
                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Base Color </label>
                                                            <Field
                                                                name='baseColour'
                                                                type="text"
                                                                placeholder="Enter  Base Color"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Kani Colors</label>
                                                            <Field
                                                                name='kaniColors'
                                                                type="text"
                                                                placeholder="Enter Kani Colors"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        {/* <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Weight(gms) </label>
                                                        <Field
                                                            name='weight'
                                                            type="text"
                                                            placeholder="Enter your first name"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div> */}
                                                        {/* <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Units</label>
                                                            <Field
                                                                name='units'
                                                                type="number"
                                                                placeholder="Enter Units"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div> */}

                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Units <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                            <div className=" z-20 bg-transparent dark:bg-form-Field">
                                                                <ReactSelect
                                                                    name="unit"
                                                                    value={unitOptions?.find(option => option.value === values.unit?.id) || null}
                                                                    onChange={(option) => setFieldValue('unit', option ? option.unitGroupObject : null)}
                                                                    options={unitOptions}
                                                                    styles={customStyles} // Pass custom styles here
                                                                    className="bg-white dark:bg-form-Field"
                                                                    classNamePrefix="react-select"
                                                                    placeholder="Select Units"
                                                                />

                                                            </div>
                                                        </div>

                                                    </div>







                                                    <h1 className='text-center text-xl mt-[40px] mb-[40px] font-semibold'>Costing </h1>

                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Cost Price </label>
                                                            <Field
                                                                name='cost'
                                                                type="text"
                                                                placeholder="Enter Cost Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> MRP</label>
                                                            <Field
                                                                name='mrp'
                                                                type="text"
                                                                placeholder="Enter MRP"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Dyeing Cost </label>
                                                            <Field
                                                                name='dyeingCost'
                                                                type="text"
                                                                placeholder="Enter  Dyeing Cost"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mb-4.5   gap-6">











                                                        <h1 className='text-center text-xl mt-[40px] mb-[40px] font-semibold'>Pricing </h1>


                                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                                            <div className="flex-2 min-w-[250px]">
                                                                <label className="mb-2.5 block text-black dark:text-white"> Retail Mrp</label>
                                                                <Field
                                                                    name='retailMrp'
                                                                    type="text"
                                                                    placeholder="Enter Retail Mrp"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                />
                                                            </div>
                                                            <div className="flex-2 min-w-[250px]">
                                                                <label className="mb-2.5 block text-black dark:text-white"> WS INR</label>
                                                                <Field
                                                                    name='wholesalePrice'
                                                                    type="text"
                                                                    placeholder="Enter Wholesale Price"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                />
                                                            </div>

                                                            <div className="flex-2 min-w-[250px]">
                                                                <label className="mb-2.5 block text-black dark:text-white">WS USD </label>
                                                                <Field
                                                                    name='usdPrice'
                                                                    type="text"
                                                                    placeholder="Enter USD Price"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                />
                                                            </div>

                                                        </div>


                                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                                            <div className="flex-2 min-w-[250px]">
                                                                <label className="mb-2.5 block text-black dark:text-white">WS Euro</label>
                                                                <Field
                                                                    name='euroPrice'
                                                                    type="text"
                                                                    placeholder="Enter Euro Price"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                />
                                                            </div>
                                                            <div className="flex-2 min-w-[250px]">
                                                                <label className="mb-2.5 block text-black dark:text-white">WS GBP </label>
                                                                <Field
                                                                    name='gbpPrice'
                                                                    type="text"
                                                                    placeholder="Enter GBP Price"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                />
                                                            </div>
                                                            <div className="flex-2 min-w-[250px]">
                                                                <label className="mb-2.5 block text-black dark:text-white">WS RMB </label>
                                                                <Field
                                                                    name='rmbPrice'
                                                                    type="text"
                                                                    placeholder="Enter RMB Price"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {/* Contemporary Wool */}





                                            {values.productGroup?.productGroupName === "Contemporary Wool" && (
                                                <>
                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Warp Colors </label>
                                                            <Field
                                                                name='warpColors'
                                                                type="text"
                                                                placeholder="Enter Warp Colors"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Weft Colors</label>
                                                            <Field
                                                                name='weftColors'
                                                                type="text"
                                                                placeholder="Enter Weft Colors"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Wave </label>
                                                            <Field
                                                                name='weave'
                                                                type="text"
                                                                placeholder="Enter Wave"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Warp Yarn</label>
                                                            <Field
                                                                name='warpYarn'
                                                                type="text"
                                                                placeholder="Enter Warp Yarn"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Weft Yarn</label>
                                                            <Field
                                                                name='weftYarn'
                                                                type="text"
                                                                placeholder="Enter Weft Yarn"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>


                                                    <div className="mb-4.5 flex flex-wrap gap-6">


                                                        {/* <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Weight(gms)</label>
                                                        <Field
                                                            name='weight'
                                                            type="text"
                                                            placeholder="Enter your last name"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div> */}
                                                        {/* <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Units </label>
                                                            <Field
                                                                name='units'
                                                                type="number"
                                                                placeholder="Enter Units"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div> */}

                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Units <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                            <div className=" z-20 bg-transparent dark:bg-form-Field">
                                                                <ReactSelect
                                                                    name="unit"
                                                                    value={unitOptions?.find(option => option.value === values.unit?.id) || null}
                                                                    onChange={(option) => setFieldValue('unit', option ? option.unitGroupObject : null)}
                                                                    options={unitOptions}
                                                                    styles={customStyles} // Pass custom styles here
                                                                    className="bg-white dark:bg-form-Field"
                                                                    classNamePrefix="react-select"
                                                                    placeholder="Select Units"
                                                                />

                                                            </div>
                                                        </div>
                                                    </div>

                                                    <h1 className='text-center text-xl mt-[40px] mb-[40px] font-semibold'>Costing </h1>





                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Cost Price </label>
                                                            <Field
                                                                name='cost'
                                                                type="text"
                                                                placeholder="Enter Cost Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> MRP</label>
                                                            <Field
                                                                name='mrp'
                                                                type="text"
                                                                placeholder="Enter MRP"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Dyeing Cost </label>
                                                            <Field
                                                                name='dyeingCost'
                                                                type="text"
                                                                placeholder="Enter Dyeing Cost "
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>


                                                    <div className="mb-4.5 flex flex-wrap gap-6">




                                                    </div>

                                                    <h1 className='text-center text-xl mt-[40px] mb-[40px] font-semibold'>Pricing </h1>


                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Retail Mrp</label>
                                                            <Field
                                                                name='retailMrp'
                                                                type="text"
                                                                placeholder="Enter Retail Mrp"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> WS INR</label>
                                                            <Field
                                                                name='wholesalePrice'
                                                                type="text"
                                                                placeholder="Enter Wholesale Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>

                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">WS USD </label>
                                                            <Field
                                                                name='usdPrice'
                                                                type="text"
                                                                placeholder="Enter USD Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>

                                                    </div>


                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">WS Euro</label>
                                                            <Field
                                                                name='euroPrice'
                                                                type="text"
                                                                placeholder="Enter Euro Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">WS GBP </label>
                                                            <Field
                                                                name='gbpPrice'
                                                                type="text"
                                                                placeholder="Enter GBP Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">WS RMB </label>
                                                            <Field
                                                                name='rmbPrice'
                                                                type="text"
                                                                placeholder="Enter RMB Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>


                                                </>
                                            )}

                                            {/* Wool Embroidery */}

                                            {values.productGroup?.productGroupName === "Wool Embroidery" && (

                                                <>
                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">Base Color</label>
                                                            <Field
                                                                name="baseColour"
                                                                type="text"
                                                                placeholder="Enter Base Color"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">Embroidery Colors</label>
                                                            <Field
                                                                name="embroideryColors"
                                                                type="text"
                                                                placeholder="Enter Embroidery Colors"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>





                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Fabric Wave </label>
                                                            <Field
                                                                name='fabricWeave'
                                                                type="text"
                                                                placeholder="Enter Fabric Wave"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Fabric Code</label>
                                                            <Field
                                                                name='fabricCode'
                                                                type="text"
                                                                placeholder="Enter Fabric Code "
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>


                                                    <div className="mb-4.5 flex flex-wrap gap-6">


                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Units <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                            <div className=" z-20 bg-transparent dark:bg-form-Field">
                                                                <ReactSelect
                                                                    name="unit"
                                                                    value={unitOptions?.find(option => option.value === values.unit?.id) || null}
                                                                    onChange={(option) => setFieldValue('unit', option ? option.unitGroupObject : null)}
                                                                    options={unitOptions}
                                                                    styles={customStyles} // Pass custom styles here
                                                                    className="bg-white dark:bg-form-Field"
                                                                    classNamePrefix="react-select"
                                                                    placeholder="Select Units"
                                                                />

                                                            </div>
                                                        </div>
                                                    </div>


                                                    <h1 className='text-center text-xl mt-[40px] mb-[40px] font-semibold'>Costing </h1>


                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Fabric Cost </label>
                                                            <Field
                                                                name='fabricCost'
                                                                type="text"
                                                                placeholder="Enter Fabric Cost"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Embroidery Cost</label>
                                                            <Field
                                                                name='embroideryCost'


                                                                type="text"
                                                                placeholder="Enter Embroidery Cost"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>



                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Total Cost </label>
                                                            <Field
                                                                name='totalCost'
                                                                type="text"
                                                                placeholder="Enter Total Cost"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>






                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> MRP</label>
                                                            <Field
                                                                name='mrp'
                                                                type="text"
                                                                placeholder="Enter MRP"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>

                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Dyeing Cost </label>
                                                            <Field
                                                                name='dyeingCost'
                                                                type="text"
                                                                placeholder="Enter Dyeing Cost"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>





                                                    <h1 className='text-center text-xl mt-[40px] mb-[40px] font-semibold'>Pricing </h1>


                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Retail Mrp</label>
                                                            <Field
                                                                name='retailMrp'
                                                                type="text"
                                                                placeholder="Enter Retail Mrp"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> WS INR</label>
                                                            <Field
                                                                name='wholesalePrice'
                                                                type="text"
                                                                placeholder="Enter Wholesale Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>

                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">WS USD </label>
                                                            <Field
                                                                name='usdPrice'
                                                                type="text"
                                                                placeholder="Enter USD Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>

                                                    </div>


                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">WS Euro</label>
                                                            <Field
                                                                name='euroPrice'
                                                                type="text"
                                                                placeholder="Enter Euro Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">WS GBP </label>
                                                            <Field
                                                                name='gbpPrice'
                                                                type="text"
                                                                placeholder="Enter GBP Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">WS RMB </label>
                                                            <Field
                                                                name='rmbPrice'
                                                                type="text"
                                                                placeholder="Enter RMB Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            )}



                                            {/* Papier Machie */}

                                            {values.productGroup?.productGroupName === "Papier Machie" && (

                                                <>

                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">Base Color</label>
                                                            <Field
                                                                name="baseColour"
                                                                type="text"
                                                                placeholder="Enter Base Color"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">Pattern Color</label>
                                                            <Field
                                                                name="patternColor"
                                                                type="text"
                                                                placeholder="Enter Pattern Color"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>















                                                    <div className="mb-4.5 flex flex-wrap gap-6">

                                                        {/* <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Units</label>
                                                            <Field
                                                                name='units'
                                                                type="number"
                                                                placeholder="Enter Units"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div> */}

                                                        <div className="flex-1 min-w-[300px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Units <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                            <div className=" z-20 bg-transparent dark:bg-form-Field">
                                                                <ReactSelect
                                                                    name="unit"
                                                                    value={unitOptions?.find(option => option.value === values.unit?.id) || null}
                                                                    onChange={(option) => setFieldValue('unit', option ? option.unitGroupObject : null)}
                                                                    options={unitOptions}
                                                                    styles={customStyles} // Pass custom styles here
                                                                    className="bg-white dark:bg-form-Field"
                                                                    classNamePrefix="react-select"
                                                                    placeholder="Select Units"
                                                                />

                                                            </div>
                                                        </div>
                                                    </div>

                                                    <h1 className='text-center text-xl mt-[40px] mb-[40px] font-semibold'>Costing </h1>
                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Cost Price </label>
                                                            <Field
                                                                name='cost'
                                                                type="text"
                                                                placeholder="Enter Cost Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> MRP</label>
                                                            <Field
                                                                name='mrp'
                                                                type="text"
                                                                placeholder="Enter MRP"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Dyeing Cost </label>
                                                            <Field
                                                                name='dyeingCost'
                                                                type="text"
                                                                placeholder="Enter Dyeing Cost"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>






                                                    <h1 className='text-center text-xl mt-[40px] mb-[40px] font-semibold'>Pricing </h1>


                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> Retail Mrp</label>
                                                            <Field
                                                                name='retailMrp'
                                                                type="text"
                                                                placeholder="Enter Retail Mrp"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white"> WS INR</label>
                                                            <Field
                                                                name='wholesalePrice'
                                                                type="text"
                                                                placeholder="Enter Wholesale Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>

                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">WS USD </label>
                                                            <Field
                                                                name='usdPrice'
                                                                type="text"
                                                                placeholder="Enter USD Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>

                                                    </div>


                                                    <div className="mb-4.5 flex flex-wrap gap-6">
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">WS Euro</label>
                                                            <Field
                                                                name='euroPrice'
                                                                type="text"
                                                                placeholder="Enter Euro Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">WS GBP </label>
                                                            <Field
                                                                name='gbpPrice'
                                                                type="text"
                                                                placeholder="Enter GBP Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="flex-2 min-w-[250px]">
                                                            <label className="mb-2.5 block text-black dark:text-white">WS RMB </label>
                                                            <Field
                                                                name='rmbPrice'
                                                                type="text"
                                                                placeholder="Enter RMB Price"
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>


                                                </>
                                            )}




                                            <h1 className='text-center text-xl mt-[40px] mb-[40px] font-semibold'>Statutory Details</h1>


                                            <div className="flex flex-wrap gap-4">
                                                {/* GST DETAILS Section */}
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
                                                        />
                                                    </div>
                                                </div>

                                                {/* GST RATE DETAILS Section (Conditional) */}
                                                {values.gstDetails === "Applicable" && (
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


                                            <div className="mb-4.5  gap-6">
                                                {/* GST DETAILS Select */}

                                                {/* Conditional Fields based on gstDetails */}
                                               

                                                    <>

                                                        <div className="mb-4.5 mt-6">
                                                            {/* Conditional Rendering: GST Details or HSN Code Section */}
                                                            {/* {gstDetails && gstDetails.length > 0 ? ( */}
                                                            {values.gstratedetails === "specifySlabBasedRates"  ? (

                                                                // Render GST Details Section
                                                                <div className="flex flex-wrap gap-6">
                                                                    {gstDetails.map((gst, index) => (
                                                                        <div key={index} className="mb-4.5 flex flex-wrap gap-6">
                                                                            <div className="flex-2 min-w-[100px]">
                                                                                <label className="mb-2.5 block text-black dark:text-white">Greater Than</label>
                                                                                <Field
                                                                                    name={`gstDetails[${index}].greaterThan`}
                                                                                    type="text"
                                                                                    value={gst.greaterThan}
                                                                                    placeholder="Enter GBP Price"
                                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                />
                                                                            </div>
                                                                            <div className="flex-2 min-w-[100px]">
                                                                                <label className="mb-2.5 block text-black dark:text-white">Upto</label>
                                                                                <Field
                                                                                    name={`gstDetails[${index}].upTo`}
                                                                                    type="text"
                                                                                    value={gst.upTo}
                                                                                    placeholder="Upto"
                                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                />
                                                                            </div>
                                                                            <div className="flex-2 min-w-[100px]">
                                                                                <label className="mb-2.5 block text-black dark:text-white">Type</label>
                                                                                <Field
                                                                                    name={`gstDetails[${index}].type`}
                                                                                    type="text"
                                                                                    value={gst.type}
                                                                                    placeholder="Type"
                                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                />
                                                                            </div>
                                                                            <div className="flex-2 min-w-[100px]">
                                                                                <label className="mb-2.5 block text-black dark:text-white">Rate</label>
                                                                                <Field
                                                                                    name={`gstDetails[${index}].gstRate`}
                                                                                    type="text"
                                                                                    value={gst.gstRate}
                                                                                    placeholder="Rate"
                                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : values.gstratedetails === "useGstClassification" ?  (
                                                                // Render HSN Code and Related Fields Section
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
                                                                            value={vaaluee?.hsnCode?.igst}
                                                                            disabled
                                                                            placeholder="Enter IGST Name"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:disabled:bg-slate-600 dark:text-white dark:focus:border-primary"
                                                                        />
                                                                        <ErrorMessage name="igst" component="div" className="text-red-500" />
                                                                    </div>
                                                                    <div className="flex-2 min-w-[250px]">
                                                                        <label className="mb-2.5 block text-black dark:text-white">CGST (%)</label>
                                                                        <Field
                                                                            type="number"
                                                                            value={vaaluee?.hsnCode?.cgst}
                                                                            disabled
                                                                            placeholder="Enter CGST Name"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:disabled:bg-slate-600 dark:text-white dark:focus:border-primary"
                                                                        />
                                                                        <ErrorMessage name="cgst" component="div" className="text-red-500" />
                                                                    </div>
                                                                    <div className="flex-2 min-w-[250px]">
                                                                        <label className="mb-2.5 block text-black dark:text-white">SGST (%)</label>
                                                                        <Field
                                                                            type="number"
                                                                            value={vaaluee?.hsnCode?.sgst}
                                                                            disabled
                                                                            placeholder="Enter SGST Name"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:disabled:bg-slate-600 dark:text-white dark:focus:border-primary"
                                                                        />
                                                                        <ErrorMessage name="sgst" component="div" className="text-red-500" />
                                                                    </div>
                                                                    <div className="flex-2 min-w-[250px]">
                                                                        <label className="mb-2.5 block text-black dark:text-white">GST Description</label>
                                                                        <Field
                                                                            name="gstDescription"
                                                                            value={vaaluee?.hsnCode?.productDescription}
                                                                            type="text"
                                                                            placeholder="Enter GST Description"
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
                                                            ):null}
                                                        </div>



















                                                        <h1 className='text-center text-xl mt-[40px] mb-[40px] font-semibold '>GST Rate & Related Details </h1>
                                                        <div className="mb-4.5 flex flex-wrap gap-6">






                                                            {/* Taxation Type Field */}
                                                            <div className="flex-2 min-w-[250px]">
                                                                <label className="mb-2.5 block text-black dark:text-white">Taxation Type</label>
                                                                <Field
                                                                    name="taxationType"
                                                                    type="text"
                                                                    placeholder="Enter Taxation Type"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                />
                                                            </div>

                                                            {/* GST Rate Field */}


                                                            {/* Type of Supply Field */}
                                                            <div className="flex-2 min-w-[250px]">
                                                                <label className="mb-2.5 block text-black dark:text-white">Type of Supply</label>


                                                                <ReactSelect

                                                                    name="typeOfSupply"
                                                                    options={supplyType}
                                                                    value={supplyType.find(option => option.value === values.typeOfSupply)}
                                                                    onChange={(option) => setFieldValue("typeOfSupply", option?.value)}
                                                                    styles={customStyles}

                                                                    placeholder="Enter Type of Supply"

                                                                />

                                                            </div>
                                                        </div>
                                                    </>
                                           
                                            </div>













                                            <h1 className='text-center text-xl mt-[40px] mb-[40px] font-semibold'>Images</h1>

                                            <div className="mb-4.5 flex flex-wrap gap-6">
                                                <div className="flex flex-col space-y-4">
                                                    {/* Upload Field */}
                                                    <div className="flex-1 max-w-[370px] md:min-w-[400px] md:max-w-[600px]">
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
                                                                <p className="mt-1.5">PNG, JPG or GIF(Less Than 5 mb)</p>
                                                                <p>(max, 800 X 800px)</p>
                                                            </div>
                                                        </div>
                                                    </div>


                                                    {previews.length > 0 && (
                                                        <div className="mt-4">
                                                            <label className="mb-2.5 block text-black dark:text-white">
                                                                Image Previews
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
                                                    <div className="max-w-[370px] md:min-w-[400px] md:max-w-[600px]">
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
                                                                <p className="mt-1.5"> PNG, JPG or GIF(Less Than 5 mb)</p>
                                                                <p>(max, 800 X 800px)</p>
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
                                                                                onClick={() => handleRemoveActual(index)}
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
                                            <div className="mb-6">
                                                <label className="mb-2.5 block text-black dark:text-white"> Product Description </label>
                                                <Field
                                                    name='productDescription'
                                                    component="textarea"
                                                    rows={6}
                                                    placeholder="Type your message"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                            <div className="mb-4.5 flex flex-wrap gap-6">
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white"> Supplier <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                    <div className=" z-20 bg-transparent dark:bg-form-Field">
                                                        <ReactSelect
                                                            isMulti // Enable multi-selection
                                                            name="supplier"
                                                            value={
                                                                supplierNameOptions?.filter(option =>
                                                                    values.supplier?.some(selected => selected.id === option.value)
                                                                ) || [] // Map selected suppliers to ReactSelect's value
                                                            }
                                                            onChange={(selectedOptions) => {
                                                                setFieldValue(
                                                                    'supplier',
                                                                    selectedOptions?.map(option => ({
                                                                        id: option.value,
                                                                        // Include name or other relevant fields
                                                                    })) || [] // Handle empty selection
                                                                );
                                                            }}
                                                            options={supplierNameOptions}
                                                            styles={customStyles} // Pass custom styles here
                                                            className="bg-white dark:bg-form-Field"
                                                            classNamePrefix="react-select"
                                                            placeholder="Select Supplier Name"
                                                        />


                                                    </div>
                                                </div>

                                            </div>








                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Supplier Code <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                <div className=" bg-transparent dark:bg-form-Field">


                                                    <ReactSelect
                                                        name="supplierCode"
                                                        value={supplierCodeOptions?.find(option => option.value === values.supplierCode?.id) || null}
                                                        onChange={(option) => setFieldValue('supplierCode', option ? option?.suplieridd : null)}
                                                        options={supplierCodeOptions}
                                                        styles={customStyles} // Pass custom styles here
                                                        className="bg-white dark:bg-form-Field"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select supplier Code"
                                                    />



                                                </div>

                                            </div>












                                            <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-4">
                                                Add Product
                                            </button>
                                        </div>


                                    </div>
                                </div>
                            </Form>
                        )
                    }}


                </Formik>

            </div>
            <Modall
                setIsModalOpen={setgstDetailModal}
                isOpen={gstDetailModal}
                onRequestClose={() => setgstDetailModal(false)}
                //   prodIdd={}
                //   GET_PRODUCTBYID_URL={GET_PRODUCTBYID_URL}
                onSubmit={handleModalSubmit}
                width="70%"
                height="80%"
                style={{ marginLeft: '70px', marginRight: '0' }}  // Add this line
            />
        </DefaultLayout>
    )
}

export default AddProduct
