import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import { ErrorMessage, Field, FieldArray, Form, Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import useColorMode from '../../hooks/useColorMode';
import ReactSelect from 'react-select';
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import useGroups from '../../hooks/useGroups';
import ViewTable from './ViewTable';
import Pagination from '../Pagination/Pagination';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import { useSelector } from 'react-redux';
import useLedger from '../../hooks/useLedger';
const CreateLedger = () => {
    const {
        Ledger,
        edit,
        currentGroups,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
        nature,
        invoice,
        under
    } = useLedger();
    const theme = useSelector(state => state?.persisted?.theme);

    const customStyles = createCustomStyles(theme?.mode);


  




    return (
        <DefaultLayout>
            <Breadcrumb pageName={edit ? "Configurator/Update Groups" : "Configurator/Create Groups"} />
            <div>
                <Formik
                    initialValues={currentGroups}
                    enableReinitialize={true}

                    validate={values => {
                        const errors = {};
                        if (!values.groupName) {
                            errors.groupName = 'Required';
                        }


                        return errors;
                    }}
                    onSubmit={handleSubmit}
                >

                    {({ isSubmitting, setFieldValue, values }) => (
                        <Form>
                            <div className="flex flex-col gap-9">
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                        <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                            {edit ? "Update Groups" : "Create Groups"}
                                        </h3>
                                    </div>

                                    <div className="flex flex-col  p-6.5">
                                        <div className="mb-4.5 flex flex-col gap-6">
                                            <div className='flex flex-row gap-4'>
                                                <div className="flex-1 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Group</label>
                                                    <Field
                                                        type="text"
                                                        name="groupName"
                                                        placeholder="Enter Group Name"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                    />
                                                    <ErrorMessage name="groupName" component="div" className="text-red-500" />
                                                </div>

                                                <div className="flex-1 min-w-[250px] z-20 bg-transparent dark:bg-form-Field">
                                                    <label className="mb-2.5 block text-black dark:text-white">Under</label>
                                                    <ReactSelect
                                                        name="under"
                                                        value={under?.find(option => option?.value === values?.under) || null}
                                                        onChange={(option) => setFieldValue('under', option ? option.value : null)}
                                                        options={under}
                                                        styles={customStyles}
                                                        className="bg-white dark:bg-form-Field w-full"
                                                        classNamePrefix="react-select"
                                                        placeholder="Under"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-[300px] z-20 bg-transparent dark:bg-form-Field">
                                                    <label className="mb-2.5 block text-black dark:text-white">Nature Of Group</label>
                                                    <ReactSelect
                                                        name="natureOfGroup"
                                                        value={nature?.find(option => option?.value === values?.natureOfGroup) || null}
                                                        onChange={(option) => setFieldValue('natureOfGroup', option ? option.value : null)}
                                                        options={nature}
                                                        styles={customStyles}
                                                        className="bg-white dark:bg-form-Field w-full"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Units"
                                                    />
                                                </div>
                                            </div>
                                          


                                            <div className="flex gap-4 items-center mb-4.5">
                                                <label className="text-black dark:text-white w-[280px]">
                                                    Method To Allocate When Used in Purchase Invoice
                                                </label>
                                                <div className="flex-1 min-w-[300px] z-50 relative">
                                                    <ReactSelect
                                                        name="allocatePurchaseInvoice"
                                                        value={invoice.find(option => option.value === values?.allocatePurchaseInvoice) || null}
                                                        onChange={(option) => setFieldValue('allocatePurchaseInvoice', option ? option?.value : '')}
                                                        options={invoice}
                                                        styles={customStyles}
                                                        className="bg-white dark:bg-form-Field"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Method"
                                                    />
                                                </div>
                                            </div>







                                        </div>

                                        {/* --- subGroup FieldArray --- */}
                                   

                                        <div className="flex justify-center mt-4 items-center">
                                            <button
                                                type="submit"
                                                className="flex md:w-[120px] w-[170px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
                                            >
                                                {edit ? "Update Groups" : "Create Groups"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* View Table */}
                              
                            </div>
                        </Form>

                    )}


                </Formik>

            </div>
        </DefaultLayout >
    )
}

export default CreateLedger
