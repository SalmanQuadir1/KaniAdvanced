import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Pagination from '../Pagination/Pagination';
import useDesign from '../../hooks/useDesign';
import { useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import { FaEdit, FaTrash } from 'react-icons/fa';

import { customStyles as createCustomStyles } from '../../Constants/utils';

const Design = () => {
    const theme = useSelector(state => state?.persisted?.theme);
    const customStyles = createCustomStyles(theme?.mode);

    const [productGroupOption, setproductGroupOption] = useState([]);
    
    const {
        Design,
        edit,
        currentDesign,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
    } = useDesign();

    const productGroup = useSelector(state => state?.persisted?.productGroup);

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

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Configurator/Add Design" />
            <div>
                <Formik
                    initialValues={currentDesign}
                    enableReinitialize={true}
                    validate={values => {
                        const errors = {};

                        if (!values.designName) {
                            errors.designName = 'Design Name Is Required';
                        }
                        if (!values.designCode) {
                            errors.designCode = 'Design Code Is Required';
                        }
                        if (!values.productGroup) {
                            errors.productGroup = 'Product Group Is Required';
                        }
                        return errors;
                    }}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, values, setFieldValue }) => (
                        <Form>
                            <div className="flex flex-col gap-9">
                                {/* Form Section */}
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                        <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                            {edit ? "UPDATE DESIGN" : "ADD DESIGN"}
                                        </h3>
                                    </div>
                                    <div className="p-6.5">
                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Design Name <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="designName"
                                                    placeholder="Enter Design Name"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-800 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="designName" component="div" className="text-red-500" />
                                            </div>
                                            
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Design Code <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="designCode"
                                                    placeholder="Enter Design Code"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-800 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="designCode" component="div" className="text-red-500" />
                                            </div>
                                            
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Product Group <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <ReactSelect
                                                    name="productGroup"
                                                    value={
                                                        values.productGroup?.id 
                                                            ? productGroupOption.find(
                                                                option => option.value === values.productGroup.id
                                                              ) 
                                                            : null
                                                    }
                                                    onChange={(option) => {
                                                        setFieldValue(
                                                            'productGroup', 
                                                            option ? option.productGroupObject : null
                                                        );
                                                    }}
                                                    options={productGroupOption}
                                                    styles={customStyles}
                                                    className="bg-white dark:bg-form-Field"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select Product Group"
                                                />
                                                <ErrorMessage name="productGroup" component="div" className="text-red-500" />
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-center mt-4 items-center">
                                            <button 
                                                type="submit" 
                                                className="flex md:w-[230px] w-[190px] md:h-[37px] h-[47px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-4"
                                            >
                                                {edit ? "UPDATE DESIGN" : "CREATE DESIGN"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Table Section */}
                                {!edit && (
                                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                        <div className="border-b border-stroke py-4 px-2 dark:border-strokedark">
                                            <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white mb-4">
                                                Designs List
                                            </h3>
                                            
                                            {/* Table */}
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full leading-normal">
                                                    <thead>
                                                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                                            <th className="min-w-[80px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                                                S.No
                                                            </th>
                                                            <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                                                Design Name
                                                            </th>
                                                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                                                Design Code
                                                            </th>
                                                            <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                                                                Product Group
                                                            </th>
                                                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                                                Actions
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Design && Design.length > 0 ? (
                                                            Design.map((item, index) => (
                                                                <tr key={item.id || index}>
                                                                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                                        <h5 className="font-medium text-black dark:text-white">
                                                                            {(pagination.currentPage -1) * pagination.itemsPerPage + index + 1}
                                                                        </h5>
                                                                    </td>
                                                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                                        <p className="text-black dark:text-white">
                                                                            {item.designName}
                                                                        </p>
                                                                    </td>
                                                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                                        <p className="text-black dark:text-white">
                                                                            {item.designCode}
                                                                        </p>
                                                                    </td>
                                                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                                        <p className="text-black dark:text-white">
                                                                            {item?.productGroupName || 'N/A'}
                                                                        </p>
                                                                    </td>
                                                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                                        <div className="flex items-center space-x-3.5">
                                                                            <button
                                                                                className="hover:text-primary"
                                                                                onClick={(e) => handleUpdate(e, item)}
                                                                                title="Edit"
                                                                            >
                                                                                <FaEdit className="text-blue-600 hover:text-blue-800" size={18} />
                                                                            </button>
                                                                            <button
                                                                                className="hover:text-primary"
                                                                                onClick={(e) => handleDelete(e, item.id)}
                                                                                title="Delete"
                                                                            >
                                                                                <FaTrash className="text-red-600 hover:text-red-800" size={18} />
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="5" className="text-center py-8 text-black dark:text-white">
                                                                    No designs found
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Pagination */}
                                            <div className="mt-6">
                                                <Pagination
                                                    totalPages={pagination.totalPages}
                                                    currentPage={pagination.currentPage}
                                                    handlePageChange={handlePageChange}
                                                />
                                            </div>
                                            
                                            {/* Showing entries info */}
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                                                Showing {Design.length} of {pagination.totalItems} entries
                                            </div>
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
}

export default Design;