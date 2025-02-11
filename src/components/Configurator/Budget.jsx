import React, { useEffect, useRef, useState } from 'react'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import DefaultLayout from '../../layout/DefaultLayout'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ReactSelect from 'react-select';
import flatpickr from 'flatpickr';
import { useSelector } from 'react-redux';
import useBudget from '../../hooks/useBudget';
import ViewTable from './ViewTable';
import Pagination from '../Pagination/Pagination';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import BudgetTable from "./BudgetTable"

const Budget = () => {



    const productGroup = useSelector(state => state?.persisted?.productGroup);
    const orderType = useSelector(state => state?.persisted?.orderType);
    const theme = useSelector(state => state?.persisted?.theme);
    const [productOptions, setproductOptions] = useState([])
    const [orderOptions, setorderOptions] = useState([])
    const [dateSelected, setDateSelected] = useState('');

    const {
        Budget,
        edit,
        currentBudget,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
        seloptions
    } = useBudget();

    
    console.log(productGroup, orderType, "heyproooo");
    


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
   


    const flatpickrRef = useRef(null);
    useEffect(() => {
        if (flatpickrRef.current) {
            flatpickr(flatpickrRef.current, {
                mode: 'single',
                static: true,
                monthSelectorType: 'static',
                dateFormat: 'Y-m-d\\TH:i:S.Z',
                prevArrow: '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
                nextArrow: '<svg className="fill-current" width="7" height="11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
                onChange: (selectedDates, dateStr) => {
                    setDateSelected(dateStr.split('T')[0]);
                },
            });
        }
    }, [flatpickrRef.current]);
    console.log(Budget, "jhhhh");
    const validationSchema = Yup.object({
        productGroup: Yup.object({
            id: Yup.string().required('Field is Empty'),
            name: Yup.string().required('Field is Empty')
        }).required('Field is Empty').nullable(),
        // colors: Yup.object({
        //     id: Yup.string().required('Field is Empty'),
        //     name: Yup.string().required('Field is Empty')
        // }).required('Field is Empty').nullable(),
        // description: Yup.string().required('Field is Empty'),
        // grade: Yup.string().required('Field is Empty'),
        // materialType: Yup.object().required('Field is Empty').nullable(),
    });
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Configurator/Add Budget" />
            <div>

                <Formik
                    initialValues={currentBudget}
                    enableReinitialize={true}
                    // validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, values }) => (

                        <Form>
                            <div className="flex flex-col gap-9">
                                {/* <!-- Contact Form --> */}
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                        <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                            Add Budget
                                        </h3>
                                    </div>

                                    <div className="p-6.5">
                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white">  </label>

                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Product Group</label>
                                                    <ReactSelect
                                                        name="productGroup"
                                                        styles={customStyles}
                                                        value={productOptions?.find(option => option.value === values?.productGroup?.id) || null}
                                                        onChange={(option) => setFieldValue('productGroup', option ? option.productObject : null)} // Keep the whole object here
                                                        options={productOptions}
                                                        className="bg-white dark:bg-form-Field"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select productGroup"
                                                    />
                                                    <ErrorMessage name="productGroup" component="div" className="text-red-600 text-sm" />

                                                    <ErrorMessage name="productGroup" component="div" className="text-red-600 text-sm" />
                                                </div>


                                            </div>



                                            <div className="flex-1 min-w-[300px] mt-2">

                                                <div className="relative z-20 bg-transparent dark:bg-form-Field">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">Order Type</label>
                                                        <ReactSelect
                                                            styles={customStyles}
                                                            name="orderType"
                                                            value={orderOptions?.find(option => option?.value === values?.orderType?.id) || null}
                                                            onChange={(option) => setFieldValue('orderType', option ? option.orderObject : null)} // Keep the whole object here
                                                            options={orderOptions}
                                                            className="bg-white dark:bg-form-Field"
                                                            classNamePrefix="react-select"
                                                            placeholder="Select Order Type"
                                                        />
                                                        <ErrorMessage name="orderType" component="div" className="text-red-600 text-sm" />

                                                        <ErrorMessage name="unit.id" component="div" className="text-red-600 text-sm" />
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Current Budget</label>
                                                <Field
                                                    name='currentBudget'
                                                    type="number"
                                                    placeholder="Enter current Budget"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Start Date</label>
                                                {/* <input
                                                    placeholder='Select  Date'
                                                    type="text"
                                                    name='startDate'
                                                    ref={flatpickrRef}
                                                    value={dateSelected}
                                                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                /> */}
                                                <Field
                                                    name='startDate'
                                                    type="date"
                                                    placeholder="Enter Start Date"
                                                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4.5 flex flex-wrap gap-6">

                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> To Date</label>
                                                <Field
                                                    name='toDate'
                                                    type="date"
                                                    placeholder="Enter To Date"
                                                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Revised Budget</label>
                                                <Field
                                                    name='revisedBudget'
                                                    type="number"
                                                    placeholder="Enter Revised Budget"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Revised Date</label>
                                                <Field
                                                    name='revisedDate'
                                                    type="date"
                                                    placeholder="Enter RevisedDate"
                                                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                />
                                            </div>

                                        </div>


                                        <div className="flex justify-center mt-4 items-center">
                                            <button type="submit" className="flex md:w-[240px] w-[220px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center  bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90">
                                                ADD BUDGET
                                            </button>
                                        </div>
                                    </div>


                                </div>
                                {!edit && (
                                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                        <div className="border-b border-stroke py-4 px-2 dark:border-strokedark">
                                            <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                                <BudgetTable data={Budget} totalItems={pagination.totalItems} title={'Budget'} handleDelete={handleDelete} handleUpdate={handleUpdate} pagination={pagination} />
                                                <Pagination
                                                    totalPages={pagination?.totalPages}
                                                    currentPage={pagination?.currentPage}
                                                    handlePageChange={handlePageChange}
                                                />
                                            </h3>
                                        </div>
                                    </div>
                                )}



                            </div>

                        </Form>
                    )}
                </Formik>
            </div>

        </DefaultLayout>
    )
}

export default Budget
