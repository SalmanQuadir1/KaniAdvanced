import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import { ErrorMessage, Field, Form, Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import useColorMode from '../../hooks/useColorMode';
import ReactSelect from 'react-select';

import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import useProduct from '../../hooks/useProduct';
import { useSelector } from 'react-redux';

import { customStyles as createCustomStyles } from '../../Constants/utils';
const AddProduct = () => {

    const [productGroupOption, setproductGroupOption] = useState([])
    const [colorGroupOptions, setcolorGroupOptions] = useState([])
    const [productCategoryOptions, setproductCategoryOptions] = useState([])
    const [designOptions, setdesignOptions] = useState([])
    const [styleOptions, setstyleOptions] = useState([])
    const [sizeOptions, setsizeOptions] = useState([])
    const [hsnOptions, sethsnOptions] = useState([])
    const [supplierNameOptions, setsupplierNameOptions] = useState([])
    const [supplierCodeOptions, setsupplierCodeOptions] = useState([])








    const productGroup = useSelector(state => state?.nonPersisted?.productGroup);
    const colorGroup = useSelector(state => state?.nonPersisted?.color);
    const productCategory = useSelector(state => state?.nonPersisted?.productCategory);
    const design = useSelector(state => state?.nonPersisted?.design);
    const style = useSelector(state => state?.nonPersisted?.style);
    const size = useSelector(state => state?.nonPersisted?.size);
    const hsn = useSelector(state => state?.nonPersisted?.hsn);
    const supplier = useSelector(state => state?.nonPersisted?.supplier);
    const theme = useSelector(state => state?.persisted?.theme);

    console.log(supplier, "proo");


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
        if (productCategory.data) {
            const formattedOptions = productCategory.data.map(prodCat => ({
                value: prodCat.id,
                label: prodCat?.productCategoryName,
                productCategoryObject: prodCat,
            }));
            setproductCategoryOptions(formattedOptions);
        }
    }, [productCategory.data]);

    useEffect(() => {
        if (design.data) {
            const formattedOptions = design.data.map(design => ({
                value: design.id,
                label: design?.designName,
                designObject: design,
            }));
            setdesignOptions(formattedOptions);
        }
    }, [design.data]);
    useEffect(() => {
        if (style.data) {
            const formattedOptions = style.data.map(style => ({
                value: style.id,
                label: style?.stylesName,
                styleObject: style,
            }));
            setstyleOptions(formattedOptions);
        }
    }, [style.data]);
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
        if (hsn.data) {
            const formattedOptions = hsn.data.map(hsn => ({
                value: hsn.id,
                label: hsn?.hsnCodeName,
                hsnObject: hsn,
            }));
            sethsnOptions(formattedOptions);
        }
    }, [hsn.data]);
    useEffect(() => {
        if (supplier.data) {
            const formattedOptions = supplier.data.map(supp => ({
                value: supp.id,
                label: supp?.name,
                supplierNameObject: supp,
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


    const changeTextColor = () => {
        setIsOptionSelected(true);
    };

    const {
        Product,
        edit,
        currentProduct,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
        seloptions
    } = useProduct();

    console.log(designOptions, colorGroupOptions, "hyebro");
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Products / AddProducts" />
            <div>
                <Formik
                    initialValues={currentProduct}

                    // validate={values => {
                    //     const errors = {};
                    //     if (!values.name) {
                    //         errors.name = 'Required';
                    //     }

                    //     return errors;
                    // }}
                    onSubmit={handleSubmit}
                >

                    {({ setFieldValue, values }) => (
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
                                                <label className="mb-2.5 block text-black dark:text-white"> Product Group </label>
                                                <div className="  bg-white dark:bg-form-Field">
                                                    <ReactSelect
                                                        name="productGroup"
                                                        value={productGroupOption?.find(option => option.value === values.productGroup?.id) || null}
                                                        onChange={(option) => setFieldValue('productGroup', option ? option.productGroupObject : null)}
                                                        options={productGroupOption}
                                                        styles={customStyles} // Pass custom styles here
                                                        className="bg-white dark:bg-form-Field"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Product Group"
                                                    />
                                                    {/* <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                                        <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <g opacity="0.8">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill=""></path>
                                                            </g>
                                                        </svg>
                                                    </span> */}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Color Group </label>
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
                                                    {/* <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                                        <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <g opacity="0.8">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill=""></path>
                                                            </g>
                                                        </svg>
                                                    </span> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Product Category </label>
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
                                                    {/* <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                                        <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <g opacity="0.8">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill=""></path>
                                                            </g>
                                                        </svg>
                                                    </span> */}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> HSN Code</label>
                                                <ReactSelect
                                                    name="hsnCodeName"
                                                    value={hsnOptions?.find(option => option.value === values.hsn?.id) || null}
                                                    onChange={(option) => setFieldValue('hsnCode', option ? option.hsnObject : null)}
                                                    options={hsnOptions}
                                                    styles={customStyles} // Pass custom styles here
                                                    className="bg-white dark:bg-form-Field"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select Hsn Code"
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Design Name </label>
                                                <div className="relative z-20 bg-transparent dark:bg-form-Field">
                                                    <ReactSelect
                                                        name="design"
                                                        value={designOptions?.find(option => option.value === values.design?.id) || null}
                                                        onChange={(option) => setFieldValue('design', option ? option.designObject : null)}
                                                        options={designOptions}
                                                        styles={customStyles} // Pass custom styles here
                                                        className="bg-white dark:bg-form-Field"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Design"
                                                    />
                                                    {/* <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                                        <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <g opacity="0.8">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill=""></path>
                                                            </g>
                                                        </svg>
                                                    </span> */}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Color Name</label>
                                                <Field
                                                    name='colorName'
                                                    type="text"
                                                    placeholder="Enter your first name"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Style </label>
                                                <div className="relative z-20 bg-transparent dark:bg-form-Field">
                                                    <ReactSelect
                                                        name="styles"
                                                        value={styleOptions?.find(option => option.value === values.styles?.id) || null}
                                                        onChange={(option) => setFieldValue('styles', option ? option.styleObject : null)}
                                                        options={styleOptions}
                                                        styles={customStyles} // Pass custom styles here
                                                        className="bg-white dark:bg-form-Field"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Style"
                                                    />

                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Size(in cms) </label>
                                                <div className="relative z-20 bg-transparent dark:bg-form-Field">
                                                    <ReactSelect
                                                        name="sizes"
                                                        value={sizeOptions?.find(option => option.value === values.sizes?.id) || null}
                                                        onChange={(option) => setFieldValue('sizes', option ? option.sizeObject : null)}
                                                        options={sizeOptions}
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
                                                    placeholder="Enter your first name"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Barcode</label>
                                                <Field
                                                    name='barcode'
                                                    type="text"
                                                    placeholder="Enter your last name"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                        </div>


                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Reference Image <span className="text-meta-1">*</span>
                                                </label>
                                                <div className="relative w-full ">
                                                    <Field
                                                        name='refrenceImage'
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        className="absolute inset-0 z-50 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                    <div className="flex flex-col items-center justify-center space-y-3 border-[1.5px]  border-stroke bg-transparent py-3 px-5 rounded text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary">
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


                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Actual Images <span className="text-meta-1">*</span>
                                                </label>
                                                <div className="relative w-full">
                                                    <Field
                                                        name='actualImage'
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        className="absolute inset-0 z-50 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                    <div className="flex flex-col items-center justify-center space-y-3 border-[1.5px] border-stroke bg-transparent py-3 px-5 rounded text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary">
                                                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
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

                                        </div>
                                        <div className="mb-6">
                                            <label className="mb-2.5 block text-black dark:text-white"> Product Description </label>
                                            <textarea
                                                name='productDescription'
                                                rows={6}
                                                placeholder="Type your message"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                            ></textarea>
                                        </div>
                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white"> Supplier</label>
                                            <div className=" z-20 bg-transparent dark:bg-form-Field">
                                                <ReactSelect
                                                    name="supplier"
                                                    value={supplierNameOptions?.find(option => option.value === values.name?.id) || null}
                                                    onChange={(option) => setFieldValue('supplier', option ? option.supplierNameObject : null)}
                                                    options={supplierNameOptions}
                                                    styles={customStyles} // Pass custom styles here
                                                    className="bg-white dark:bg-form-Field"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select supplier Name"
                                                />
                                                {/* <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                                    <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g opacity="0.8">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill=""></path>
                                                        </g>
                                                    </svg>
                                                </span> */}
                                            </div>
                                        </div>








                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white"> Supplier Code </label>
                                            <div className=" bg-transparent dark:bg-form-Field">


                                                <ReactSelect
                                                    name="supplierCode"
                                                    value={supplierCodeOptions?.find(option => option.value === values.supplierCode?.id) || null}
                                                    onChange={(option) => setFieldValue('supplierCode', option ? option.supplierCodeObject : null)}
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
                    )}


                </Formik>

            </div>
        </DefaultLayout>
    )
}

export default AddProduct
