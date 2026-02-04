import React, { useEffect, useRef, useState } from 'react'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import DefaultLayout from '../../layout/DefaultLayout'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ReactSelect from 'react-select';
import flatpickr from 'flatpickr';
import { useSelector } from 'react-redux';
import useBudget from '../../hooks/useBudget';
import { customStyles as createCustomStyles } from '../../Constants/utils';

const Budget = () => {
    const productGroup = useSelector(state => state?.persisted?.productGroup);
    const orderType = useSelector(state => state?.persisted?.orderType);
    const theme = useSelector(state => state?.persisted?.theme);
    const [productOptions, setproductOptions] = useState([])
    const [orderOptions, setorderOptions] = useState([])
    
    const {
        edit,
        currentBudget,
        handleSubmit,
    } = useBudget();

    const customStyles = createCustomStyles(theme?.mode);

    useEffect(() => {
        if (productGroup.data) {
            const formattedOptions = productGroup.data.map(product => ({
                value: product.id,
                label: product.productGroupName,
                productObject: product,
            }));
            setproductOptions(formattedOptions);
        }
    }, [productGroup.data]);
    
    useEffect(() => {
        if (orderType.data) {
            const formattedorderOptions = orderType?.data?.map(order => ({
                value: order?.id,
                label: order?.orderTypeName,
                orderObject: order,
            }));
            setorderOptions(formattedorderOptions);
        }
    }, [orderType.data]);

    const validationSchema = Yup.object().shape({
        productGroup: Yup.object()
            .shape({
                id: Yup.string().required('Product Group is required'),
            })
            .nullable()
            .required('Product Group is required'),
        
        orderType: Yup.object()
            .shape({
                id: Yup.string().required('Order Type is required'),
            })
            .nullable()
            .required('Order Type is required'),
        
        currentBudget: Yup.number()
            .required('Current Budget is required')
            .min(0, 'Current Budget cannot be negative')
            .typeError('Current Budget must be a number'),
        
 
        

        
 
    });

    return (
        <DefaultLayout>
            <Breadcrumb pageName={edit ? "Configurator/Update Budget" : "Configurator/Add Budget"} />
            <div>
                <Formik
                    initialValues={currentBudget}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, setFieldValue, isSubmitting }) => {

                        useEffect(() => {
                            // Check if startDate exists and is valid
                            if (values.startDate) {
                                const startDate = new Date(values.startDate);
                                
                                // Check if the date is valid
                                if (isNaN(startDate.getTime())) {
                                    console.error('Invalid start date:', values.startDate);
                                    return;
                                }
                                
                                // Add 1 year to the startDate
                                const endDate = new Date(startDate);
                                endDate.setFullYear(endDate.getFullYear() + 1);
                                
                                // Format dates to YYYY-MM-DD
                                const formattedStartDate = startDate.toISOString().split('T')[0];
                                const formattedEndDate = endDate.toISOString().split('T')[0];
                                
                                // Update form values
                                setFieldValue('startDate', formattedStartDate);
                                setFieldValue('toDate', formattedEndDate);
                            }
                        }, [values.startDate, setFieldValue]);

                        // Check if form is valid for button disable
                        const isFormValid = () => {
                            return !errors.productGroup && 
                                   !errors.orderType && 
                                   !errors.currentBudget && 
                                   !errors.startDate &&
                                   values.productGroup?.id &&
                                   values.orderType?.id &&
                                   values.currentBudget &&
                                   values.startDate;
                        };

                        return (
                            <Form>
                                <div className="flex flex-col gap-9">
                                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                            <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                                {edit ? "UPDATE BUDGET" : "ADD BUDGET"} 
                                            </h3>
                                        </div>

                                        <div className="p-6.5">
                                            <div className="mb-4.5 flex flex-wrap gap-6">
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Product Group <span className="text-red-500 ml-1">*</span>
                                                    </label>
                                                    <ReactSelect
                                                        name="productGroup"
                                                        styles={customStyles}
                                                        value={productOptions?.find(option => option.value === values?.productGroup?.id) || null}
                                                        onChange={(option) => setFieldValue('productGroup', option ? option.productObject : null)}
                                                        options={productOptions}
                                                        className="bg-white dark:bg-form-Field"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select productGroup"
                                                    />
                                                    <ErrorMessage name="productGroup" component="div" className="text-red-600 text-sm mt-1" />
                                                </div>

                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Order Type <span className="text-red-500 ml-1">*</span>
                                                    </label>
                                                    <ReactSelect
                                                        styles={customStyles}
                                                        name="orderType"
                                                        value={orderOptions?.find(option => option?.value === values?.orderType?.id) || null}
                                                        onChange={(option) => setFieldValue('orderType', option ? option.orderObject : null)}
                                                        options={orderOptions}
                                                        className="bg-white dark:bg-form-Field"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Order Type"
                                                    />
                                                    <ErrorMessage name="orderType" component="div" className="text-red-600 text-sm mt-1" />
                                                </div>
                                            </div>

                                            <div className="mb-4.5 flex flex-wrap gap-6">
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Current Budget <span className="text-red-500 ml-1">*</span>
                                                    </label>
                                                    <Field
                                                        name='currentBudget'
                                                        type="number"
                                                        placeholder="Enter current Budget"
                                                        className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary ${
                                                            errors.currentBudget && touched.currentBudget ? 'border-red-500' : ''
                                                        }`}
                                                    />
                                                    <ErrorMessage name="currentBudget" component="div" className="text-red-600 text-sm mt-1" />
                                                </div>
                                                
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Start Date <span className="text-red-500 ml-1">*</span>
                                                    </label>
                                                    <Field
                                                        name='startDate'
                                                        type="date"
                                                        placeholder="Enter Start Date"
                                                        className={`form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary ${
                                                            errors.startDate && touched.startDate ? 'border-red-500' : ''
                                                        }`}
                                                    />
                                                    <ErrorMessage name="startDate" component="div" className="text-red-600 text-sm mt-1" />
                                                </div>
                                            </div>

                                            <div className="mb-4.5 flex flex-wrap gap-6">
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        To Date
                                                    </label>
                                                    <Field
                                                        disabled
                                                        name='toDate'
                                                        type="date"
                                                        placeholder="Enter To Date"
                                                        className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>
                                                
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Revised Budget
                                                    </label>
                                                    <Field
                                                        name='revisedBudget'
                                                        type="number"
                                                        placeholder="Enter Revised Budget"
                                                        className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary ${
                                                            errors.revisedBudget && touched.revisedBudget ? 'border-red-500' : ''
                                                        }`}
                                                    />
                                                    <ErrorMessage name="revisedBudget" component="div" className="text-red-600 text-sm mt-1" />
                                                </div>
                                            </div>

                                            <div className="mb-4.5 flex flex-wrap gap-6">
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Revised Date
                                                    </label>
                                                    <Field
                                                        name='revisedDate'
                                                        type="date"
                                                        placeholder="Enter Revised Date"
                                                        className={`form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary ${
                                                            errors.revisedDate && touched.revisedDate ? 'border-red-500' : ''
                                                        }`}
                                                    />
                                                    <ErrorMessage name="revisedDate" component="div" className="text-red-600 text-sm mt-1" />
                                                </div>
                                            </div>

                                            <div className="flex justify-center mt-4 items-center">
                                                <button 
                                                    type="submit" 
                                                    className={`flex md:w-[240px] w-[220px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center font-medium md:text-sm text-gray hover:bg-opacity-90 transition-colors ${
                                                        isFormValid() && !isSubmitting
                                                            ? 'bg-primary hover:bg-blue-700'
                                                            : 'bg-primary cursor-not-allowed'
                                                    }`}
                                                    disabled={!isFormValid() || isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <span className="flex items-center">
                                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Processing...
                                                        </span>
                                                    ) : (
                                                        edit ? "UPDATE BUDGET" : "ADD BUDGET"
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </DefaultLayout>
    )
}

export default Budget;