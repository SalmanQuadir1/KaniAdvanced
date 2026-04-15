import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Pagination from '../Pagination/Pagination';
import useColors from '../../hooks/useColor';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const AddColorGroup = () => {
    const {
        colors,
        edit,
        currentColor,
        pagination,
        handlePageChange,
        handleSubmit,
        handleUpdate,
        handleDelete,
        getColors,
    } = useColors();

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredColors, setFilteredColors] = useState([]);

    // Filter colors based on search term
    useEffect(() => {
        if (searchTerm) {
            const filtered = colors.filter(color => 
                color.colorName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredColors(filtered);
        } else {
            setFilteredColors(colors);
        }
    }, [searchTerm, colors]);

    // Render table rows
    const renderTableRows = () => {
        if (!filteredColors || filteredColors.length === 0) {
            return (
                <tr>
                    <td colSpan="3" className="px-5 py-10 text-center text-gray-500 dark:text-gray-400">
                        No Design groups found
                    </td>
                </tr>
            );
        }

        const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

        return filteredColors.map((item, index) => (
            <tr 
                key={item.id} 
                className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-200"
            >
                <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm text-center">
                    {startingSerialNumber + index}
                </td>
                <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white">
                    {item.colorName || '-'}
                </td>
                <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={(e) => handleUpdate(e, item)}
                            className="text-teal-500 hover:text-teal-700 transition-colors duration-200"
                            title="Edit Design Group"
                        >
                            <FiEdit size={18} />
                        </button>
                        <button
                            onClick={(e) => handleDelete(e, item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                            title="Delete Design Group"
                        >
                            <FiTrash2 size={18} />
                        </button>
                    </div>
                </td>
            </tr>
        ));
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName={edit ? "Configurator/Update Design Group" : "Configurator/Add Design Group"} />
            <div className="container mx-auto px-4 sm:px-8">
                {/* Form Section */}
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-8">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                            {edit ? 'Update Design Group' : 'Add New Design Group'}
                        </h3>
                    </div>
                    <div className="p-6.5">
                        <Formik
                            initialValues={currentColor}
                            enableReinitialize={true}
                            validate={values => {
                                const errors = {};
                                if (!values.colorName) {
                                    errors.colorName = 'Design group name is required';
                                }
                                return errors;
                            }}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="mb-4.5">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Design Group Name <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <Field
                                            type="text"
                                            name="colorName"
                                            placeholder="Enter Design Group Name "
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                        />
                                        <ErrorMessage name="colorName" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <div className="flex justify-center mt-6">
                                        <button 
                                            type="submit" 
                                            className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-primary text-white font-medium hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    {edit ? 'Updating...' : 'Creating...'}
                                                </>
                                            ) : (
                                                edit ? 'Update Design Group' : 'Create Design Group'
                                            )}
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>

                {/* View Section - Only show when not in edit mode */}
                {!edit && (
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium text-slate-500 text-xl dark:text-white">
                                    Design Group List
                                </h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search design groups..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 pl-10 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white"
                                    />
                                   
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full gap-3 p-2">
                                <thead className="bg-gray-50 dark:bg-slate-700">
                                    <tr>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-center w-20">
                                            S.No
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            Design Group Name
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-center w-24">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTableRows()}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        {pagination.totalPages > 0 && (
                            <div className="py-4 px-6 border-t border-gray-200 dark:border-gray-700">
                                <Pagination 
                                    totalPages={pagination.totalPages}
                                    currentPage={pagination.currentPage}
                                    handlePageChange={handlePageChange}
                                />
                            </div>
                        )}
                        
                        {/* Total count info */}
                        {filteredColors.length > 0 && (
                            <div className="py-3 px-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                                Showing {filteredColors.length} of {pagination.totalItems} total Design groups
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default AddColorGroup;