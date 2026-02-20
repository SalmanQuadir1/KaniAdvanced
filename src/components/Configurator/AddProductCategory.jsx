import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Pagination from '../Pagination/Pagination';
import useproductCategory from '../../hooks/useProductCategory';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const AddProductCategory = () => {
    const {
        productCategory,
        edit,
        currentproductCategory,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
    } = useproductCategory();
    
    console.log(productCategory,"555555555");
    
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Configurator/Add Product Category" />
            <div>
                <Formik
                    initialValues={currentproductCategory}
                    enableReinitialize={true}
                    validate={values => {
                        const errors = {};
                        if (!values.productCategoryName) {
                            errors.productCategoryName = 'Required';
                        }
                        return errors;
                    }}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue }) => (
                        <Form>
                            <div className="flex flex-col gap-9">
                                {/* Form fields */}
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                        <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                            {edit ? "UPDATE PRODUCT STATUS" : "ADD PRODUCT STATUS"}
                                        </h3>
                                    </div>
                                    <div className="p-6.5">
                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Product Status <span className="text-red-500 ml-1">*</span> </label>
                                                <Field
                                                    type="text"
                                                    name="productCategoryName"
                                                    placeholder="Enter product Status"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="productCategoryName" component="div" className="text-red-500" />
                                            </div>
                                        </div>
                                        <div className="flex justify-center mt-4 items-center">
                                            <button type="submit" className="flex md:w-[250px] w-[250px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center bg-primary md:p-2.5 font-medium md:text-sm text-white hover:bg-opacity-90">
                                                {edit ? "UPDATE PRODUCT STATUS" : "CREATE PRODUCT STATUS"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Table Section */}
                                {!edit && (
                                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                        <div className="py-6 px-4 md:px-6 xl:px-7.5">
                                            <h4 className="text-xl font-semibold text-black dark:text-white">
                                                Product Statuses ({pagination.totalItems})
                                            </h4>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="min-w-full leading-normal">
                                                <thead>
                                                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                                      
                                                        <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                                                            Product Status
                                                        </th>
                                                       
                                                        <th className="py-4 px-4 font-medium text-black dark:text-white">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {productCategory && productCategory.length > 0 ? (
                                                        productCategory.map((category, index) => (
                                                            <tr key={category.id || index}>
                                                               
                                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                                    <p className="text-black dark:text-white">
                                                                        {category.productCategoryName}
                                                                    </p>
                                                                </td>
                                                               
                                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                                    <div className="flex items-center space-x-3.5">
                                                                        <button
                                                                            className="hover:text-primary"
                                                                            onClick={() => {
                                                                                handleUpdate(category); // Pass the entire category object
                                                                            }}
                                                                            title="Edit"
                                                                        >
                                                                            <FiEdit className="text-primary" size={18} />
                                                                        </button>
                                                                        <button
                                                                            className="hover:text-danger"
                                                                            onClick={() => {
                                                                                
                                                                                    handleDelete(category?.id);
                                                                             
                                                                            }}
                                                                            title="Delete"
                                                                        >
                                                                            <FiTrash2 className="text-danger" size={18} />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4" className="text-center py-10 text-black dark:text-white">
                                                                No product categories found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination */}
                                        <div className="py-4 px-4">
                                            <Pagination
                                                totalPages={pagination.totalPages}
                                                currentPage={pagination.currentPage}
                                                handlePageChange={handlePageChange}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </DefaultLayout>
    );
};

export default AddProductCategory;