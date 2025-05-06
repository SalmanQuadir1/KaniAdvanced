import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import { ErrorMessage, Field, FieldArray, Form, Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import useColorMode from '../../../hooks/useColorMode';
import ReactSelect from 'react-select';
import { IoMdAdd } from "react-icons/io";

import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import useGroups from '../../../hooks/useGroups';
import ViewTable from './ViewTable';
import Pagination from '../../Pagination/Pagination';
const Groups = () => {
    const {
        Groups,
        edit,
        currentGroups,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
    } = useGroups();





    console.log(Groups, "locaaaaaaaaaaaaaaaaa");




    return (
        <DefaultLayout>
            <Breadcrumb pageName={edit ? "Configurator/Update Groups" : "Configurator/Create Groups"} />
            <div>
                <Formik
                    initialValues={currentGroups}
                    enableReinitialize={true}

                    // validate={values => {
                    //     const errors = {};
                    //     if (!values.address) {
                    //         errors.address = 'Required';
                    //     }
                    //     if (values.address === " ") {
                    //         errors.address = "address Should not Be Empty"
                    //     }
                    //     if (!values.city) {
                    //         errors.city = 'Required';
                    //     }
                    //     if (values.city === " ") {
                    //         errors.city = "city Should not Be Empty"
                    //     }
                    //     if (!values.state) {
                    //         errors.state = 'Required';
                    //     }
                    //     if (values.state === " ") {
                    //         errors.state = "state Should not Be Empty"
                    //     }
                    //     if (!values.gstin) {
                    //         errors.gstin = 'Field is Required';
                    //     }
                    //     if (values.gstin === " ") {
                    //         errors.gstin = "gstin Should not Be Empty"
                    //     }
                    //     if (!values.pinCode) {
                    //         errors.pinCode = 'Field is Required';
                    //     }
                    //     if (values.pinCode === " ") {
                    //         errors.pinCode = "pinCode Should not Be Empty"
                    //     }
                    //     if (!values.GroupsId) {
                    //         errors.GroupsId = 'GroupsId is Required';
                    //     }
                    //     if (values.GroupsId === " ") {
                    //         errors.GroupsId = "GroupsId Should not Be Empty"
                    //     }
                    //     if (!values.GroupsName) {
                    //         errors.GroupsName = 'GroupsName is Required';
                    //     }
                    //     if (values.GroupsName === " ") {
                    //         errors.GroupsName = "GroupsName Should not Be Empty"
                    //     }

                    //     return errors;
                    // }}
                    onSubmit={handleSubmit}
                >

                    {({ isSubmitting }) => (
                      <Form>
                      <div className="flex flex-col gap-9">
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                              {edit ? "Update Groups" : "Create Groups"}
                            </h3>
                          </div>
                    
                          <div className="p-6.5">
                            <div className="mb-4.5 flex flex-wrap gap-6">
                              <div className="flex-2 min-w-[270px]">
                                <label className="mb-2.5 block text-black dark:text-white">Group</label>
                                <Field
                                  type="text"
                                  name="address"
                                  placeholder="Enter Address"
                                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                />
                                <ErrorMessage name="address" component="div" className="text-red-500" />
                              </div>
                            </div>
                    
                            {/* --- Subgroups FieldArray --- */}
                            <div className="mb-6">
                              <label className="mb-2.5 block text-black dark:text-white">Subgroups</label>
                              <FieldArray name="subgroups">
                                {({ push, remove, form }) => (
                                  <div className="space-y-4">
                                    {form.values.subgroups && form.values.subgroups.length > 0 ? (
                                      form.values.subgroups.map((_, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                          <Field
                                            name={`subgroups[${index}]`}
                                            placeholder={`Subgroup ${index + 1}`}
                                            className="flex-1 rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-sm text-gray-500">No subgroups added.</p>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => push('')}
                                      className="mt-2 text-sm text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                                    >
                                      + Add Subgroup
                                    </button>
                                  </div>
                                )}
                              </FieldArray>
                            </div>
                    
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
                        {!edit && (
                          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="border-b border-stroke py-4 px-2 dark:border-strokedark">
                              <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                <ViewTable
                                  units={Groups}
                                  pagination={pagination}
                                  totalItems={pagination.totalItems}
                                  title={'Groups'}
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
        </DefaultLayout >
    )
}

export default Groups
