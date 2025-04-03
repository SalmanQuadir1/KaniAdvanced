import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import { ErrorMessage, Field, Form, Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import useColorMode from '../../hooks/useColorMode';
import ReactSelect from 'react-select';
import { IoMdAdd } from "react-icons/io";

import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import useLocation from '../../hooks/useLocation';
import ViewTable from './ViewTable';
import Pagination from '../Pagination/Pagination';
const Location = () => {
    const {
        location,
        edit,
        currentLocation,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
    } = useLocation();





    console.log(location, "locaaaaaaaaaaaaaaaaa");




    return (
        <DefaultLayout>
            <Breadcrumb pageName={edit ? "Configurator/Update Location" : "Configurator/Create Location"} />
            <div>
                <Formik
                    initialValues={currentLocation}
                    enableReinitialize={true}

                    validate={values => {
                        const errors = {};
                        if (!values.address) {
                            errors.address = 'Required';
                        }
                        if (values.address === " ") {
                            errors.address = "address Should not Be Empty"
                        }
                        if (!values.city) {
                            errors.city = 'Required';
                        }
                        if (values.city === " ") {
                            errors.city = "city Should not Be Empty"
                        }
                        if (!values.state) {
                            errors.state = 'Required';
                        }
                        if (values.state === " ") {
                            errors.state = "state Should not Be Empty"
                        }
                        if (!values.gstin) {
                            errors.gstin = 'Field is Required';
                        }
                        if (values.gstin === " ") {
                            errors.gstin = "gstin Should not Be Empty"
                        }
                        if (!values.pinCode) {
                            errors.pinCode = 'Field is Required';
                        }
                        if (values.pinCode === " ") {
                            errors.pinCode = "pinCode Should not Be Empty"
                        }
                        if (!values.locationId) {
                            errors.locationId = 'locationId is Required';
                        }
                        if (values.locationId === " ") {
                            errors.locationId = "locationId Should not Be Empty"
                        }
                        if (!values.locationName) {
                            errors.locationName = 'locationName is Required';
                        }
                        if (values.locationName === " ") {
                            errors.locationName = "locationName Should not Be Empty"
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
                                            {edit ? "Update Location" : "Create Location"}
                                        </h3>
                                    </div>




                                    <div className="p-6.5">



                                        <div className="mb-4.5 flex flex-wrap gap-6">

                                            <div className="flex-2 min-w-[270px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Address</label>
                                                <Field
                                                    type="text"
                                                    name="address"
                                                    placeholder="Enter Address"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="address" component="div" className="text-red-500" />

                                            </div>
                                            <div className="flex-2 min-w-[270px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Location Id</label>
                                                <Field
                                                    type="text"
                                                    name="locationId"
                                                    placeholder="Enter Location Id"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="locationId" component="div" className="text-red-500" />

                                            </div>
                                            <div className="flex-2 min-w-[270px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Location Name</label>
                                                <Field
                                                    type="text"
                                                    name="locationName"
                                                    placeholder="Enter Location Name"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="locationName" component="div" className="text-red-500" />

                                            </div>



                                        </div>


                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                            <div className="flex-2 min-w-[270px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> City</label>
                                                <Field
                                                    type="text"
                                                    name="city"
                                                    placeholder="Enter City"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="city" component="div" className="text-red-500" />

                                            </div>

                                            <div className="flex-2 min-w-[270px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> State</label>
                                                <Field
                                                    type="text"
                                                    name="state"
                                                    placeholder="Enter State"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="state" component="div" className="text-red-500" />

                                            </div>


                                            <div className="flex-2 min-w-[270px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Gstin</label>
                                                <Field
                                                    type="text"
                                                    name="gstin"
                                                    placeholder="Enter GSTIN "
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="gstin" component="div" className="text-red-500" />

                                            </div>
                                        </div>



                                        <div className="mb-4.5 flex flex-wrap gap-6 md:w-[420px]">

                                            <div className="flex-2 min-w-[270px] ">
                                                <label className="mb-2.5 block text-black dark:text-white"> Pincode</label>
                                                <Field
                                                    type="number"
                                                    name="pinCode"
                                                    placeholder="Enter Pincode"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="pinCode" component="div" className="text-red-500" />

                                            </div>



                                        </div>

                                        <div className="flex justify-center mt-4 items-center">
                                            <button type="submit" className="flex md:w-[120px] w-[170px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center  bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90">
                                                {edit ? "Update Location" : "Create Location"}
                                            </button>
                                        </div>
                                    </div>





                                </div>
                                {!edit && (
                                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                        <div className="border-b border-stroke py-4 px-2 dark:border-strokedark">
                                            <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                                <ViewTable units={location} pagination={pagination} totalItems={pagination.totalItems} title={'Location'} handleDelete={handleDelete} handleUpdate={handleUpdate} />
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
        </DefaultLayout >
    )
}

export default Location
