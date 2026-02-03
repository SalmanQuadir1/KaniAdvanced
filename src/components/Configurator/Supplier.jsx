import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import { ErrorMessage, Field, Form, Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import useColorMode from '../../hooks/useColorMode';
import ReactSelect from 'react-select';
import { IoMdAdd } from "react-icons/io";

import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import useSupplier from '../../hooks/useSupplier';
import ViewTable from './ViewTable';
import Pagination from '../Pagination/Pagination';
const Supplier = () => {
    const {
        Supplier,
        edit,
        currentSupplier,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
    } = useSupplier();










    return (
        <DefaultLayout>
            <Breadcrumb pageName={edit ? "Configurator/Update Supplier" : "Configurator/Create Supplier"} />
            <div>
                <Formik
                    initialValues={currentSupplier}
                    enableReinitialize={true}

                    validate={values => {
                        const errors = {};
                        if (!values.name) {
                            errors.name = 'Required';
                        }
                        if (values.name === " ") {
                            errors.name = "name Should not Be Empty"
                        }
                        if (!values.phoneNumber) {
                            errors.phoneNumber = 'Required';
                        }
                        if (values.phoneNumber === " ") {
                            errors.phoneNumber = "phoneNumber Should not Be Empty"
                        }
                        if (!values.supplierCode) {
                            errors.supplierCode = 'Required';
                        }
                        if (values.supplierCode === " ") {
                            errors.supplierCode = "supplierCode Should not Be Empty"
                        }
                        if (!values.address) {
                            errors.address = 'Field is Required';
                        }
                        if (values.address === " ") {
                            errors.address = "address Should not Be Empty"
                        }
                        if (!values.bankName) {
                            errors.bankName = 'Field is Required';
                        }
                        if (values.bankName === " ") {
                            errors.bankName = "bankName Should not Be Empty"
                        }
                        if (!values.accountNo) {
                            errors.accountNo = 'Field is Required';
                        }
                        if (values.accountNo === " ") {
                            errors.accountNo = "accountNo Should not Be Empty"
                        }
                        if (!values.ifscCode) {
                            errors.ifscCode = 'Field is Required';
                        }
                        if (values.ifscCode === " ") {
                            errors.ifscCode = "ifscCode Should not Be Empty"
                        }
                        if (!values.emailId) {
                            errors.emailId = 'Field is Required';
                        }
                        if (values.emailId === " ") {
                            errors.emailId = "email Id Should not Be Empty"
                        }

                        return errors;
                    }}
                    onSubmit={handleSubmit}
                >

                    {({ isSubmitting }) => (
                        <Form>

                            <div className="flex flex-col gap-9">
                                {/* <!-- Contact Form --> */}
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                        <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                            {edit ? "Update Supplier" : "Create Supplier"}
                                        </h3>
                                    </div>




                                    <div className="p-6.5">



                                        <div className="mb-4.5 flex flex-wrap gap-6">

                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Name <span className="text-red-500 ml-1">*</span></label>
                                                <Field
                                                    type="text"
                                                    name="name"
                                                    placeholder="Enter Name"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="name" component="div" className="text-red-500" />

                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Phone <span className="text-red-500 ml-1">*</span></label>
                                                <Field
                                                    type="Number"
                                                    name="phoneNumber"
                                                    placeholder="Enter Phone Number"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="phoneNumber" component="div" className="text-red-500" />

                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Email <span className="text-red-500 ml-1">*</span></label>
                                                <Field
                                                    type="email"
                                                    name="emailId"
                                                    placeholder="Enter Email "
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="emailId" component="div" className="text-red-500" />

                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Supplier Code <span className="text-red-500 ml-1">*</span></label>
                                                <Field
                                                    type="String"
                                                    name="supplierCode"
                                                    placeholder="Enter Supplier Code"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="supplierCode" component="div" className="text-red-500" />

                                            </div>

                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Address <span className="text-red-500 ml-1">*</span></label>
                                                <Field
                                                    type="text"
                                                    name="address"
                                                    placeholder="Enter Address"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="address" component="div" className="text-red-500" />

                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Bank Name</label>
                                                <Field
                                                    type="text"
                                                    name="bankName"
                                                    placeholder="Enter Bank Name"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="bankName" component="div" className="text-red-500" />

                                            </div>


                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Account Number <span className="text-red-500 ml-1">*</span></label>
                                                <Field
                                                    type="text"
                                                    name="accountNo"
                                                    placeholder="Enter Account Number"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="accountNo" component="div" className="text-red-500" />

                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Ifsc Code</label>
                                                <Field
                                                    type="text"
                                                    name="ifscCode"
                                                    placeholder="Enter Ifsc Code"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="ifscCode" component="div" className="text-red-500" />

                                            </div>
                                        </div>








                                        <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-4">
                                            {edit ? "Update Supplier" : "Create Supplier"}
                                        </button>
                                    </div>





                                </div>
                                {!edit && (
                                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                            <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                                <ViewTable units={Supplier.map(s => ({
                                                    id: s.id,
                                                    name: s.name,
                                                    phoneNumber: s.phoneNumber,
                                                    supplierCode: s.supplierCode,
                                                    address: s.address,
                                                    bankName: s.bankName,
                                                    accountNo: s.accountNo,
                                                    ifscCode: s.ifscCode,
                                                    emailId: s.emailId,


                                                    // Only include the first three columns here
                                                }))} totalItems={pagination.totalItems} title={'Supplier'} handleDelete={handleDelete} handleUpdate={handleUpdate} />
                                                <Pagination
                                                    totalPages={pagination.totalPages}
                                                    currentPage={pagination.currentPage}
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

export default Supplier
