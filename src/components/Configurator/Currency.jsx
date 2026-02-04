import React from 'react'
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import ViewTable from './ViewTable';
import useCurrency from '../../hooks/useCurrency';
import Pagination from '../Pagination/Pagination';


const Currency = () => {

    const {
        Currency,
        edit,
        currentCurrency,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
    } = useCurrency();



    return (
        <DefaultLayout>
            <Breadcrumb pageName="Configurator/Add Currency" />
            <div>

                <Formik
                    initialValues={currentCurrency}
                    enableReinitialize={true} // Add this line
                    validate={values => {
                        const errors = {};
                        if (!values.currencyName) {
                            errors.currencyName = 'Required';
                        }
                        return errors;
                    }}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="flex flex-col gap-9">
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                        <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                            {edit ? "UPDATE CURRENCY" : "ADD CURRENCY"}
                                        </h3>
                                    </div>
                                    <div className="p-6.5 flex flex-col">
                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Currency Name <span className="text-red-500 ml-1">*</span></label>
                                                <Field
                                                    type="text"
                                                    name="currencyName"
                                                    placeholder="Enter  curency Name"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-800 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="currencyName" component="div" className="text-red-500" />
                                            </div>
                                        </div>
                                        <div className="flex justify-center mt-4 items-center">
                                        <button type="submit" className="flex md:w-[230px] w-[190px] md:h-[37px] h-[47px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-4">
                                            {edit ? "UPDATE CURRENCY" : "CREATE CURRENCY"}
                                        </button>

                                        </div>
                                    </div>
                                </div>
                                {!edit && (
                                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                        <div className="border-b border-stroke py-4 px-2 dark:border-strokedark">
                                            <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                                <ViewTable
                                                    units={Currency}
                                                    pagination={pagination}
                                                    totalItems={pagination.totalItems}
                                                    title={'Currency'}
                                                    handleDelete={handleDelete}
                                                    handleUpdate={handleUpdate}
                                                />
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

export default Currency