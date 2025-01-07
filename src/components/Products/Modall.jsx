import React, { useEffect, useState } from 'react';
import { Field, ErrorMessage, Formik, Form } from 'formik';
import ReactSelect from 'react-select';
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import { useDispatch, useSelector } from 'react-redux';
import { GET_IMAGE } from '../../Constants/utils';
import { useNavigate, useNavigation } from 'react-router-dom';

const Modall = ({ isOpen, setIsModalOpen, onRequestClose, onSubmit, prodIdd, width = "400px", height = "auto", GET_PRODUCTBYID_URL }) => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const [rows, setRows] = useState([{ id: Date.now(), greaterthan: 0, upto: "", type: "", rate: "" }]);
    const navigate = useNavigate();
    const [products, setproducts] = useState([])

    const theme = useSelector(state => state?.persisted?.theme);

    const productgrp = [
        { value: 'Embroidery', label: 'Embroidery' },
        { value: 'Dyeing', label: 'Dyeing' },
        { value: 'Plain Order', label: 'Plain Order' },
    ];

    const customStyles = createCustomStyles(theme?.mode);
    const unitsOption = [
        { value: 'pcs', label: 'pcs' },
        { value: 'Mtrs', label: 'Mtrs' },

    ];


    const addRow = () => {
        setRows([...rows, { id: Date.now(), greaterthan: 0, upto: "", type: "", rate: ""  }]);
    };


    const deleteRow = (index) => {
        setRows(rows.filter((_, rowIndex) => rowIndex !== index));
    };

    //  


    // console.log(products, "umer shah");






    const handleBackdropClick = () => {
        // setIsModalOpen(false)
        onRequestClose();
    };

    const handleSubmit = (values) => {
        console.log(values,"jaijai");
        onSubmit(rows);
        onRequestClose();

        // You can now send this data to your API
    };
console.log(rows,'umershahhhhh');

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 mt-11 z-50  dark:bg-graydark"
                    onClick={handleBackdropClick}
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        className="bg-white p-8 rounded-lg shadow-lg relative overflow-y-auto  dark:bg-boxdark"
                        style={{
                            width,
                            height,
                            position: 'absolute',
                            right: '50px',
                            top: '50px',
                            transform: 'none'
                        }}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                    >
                        <button

                            className="absolute text-2xl top-0 right-0 m-3 text-gray-600 hover:text-gray-800 dark:text-red-600"
                            onClick={handleBackdropClick}

                        >
                            &times;
                        </button>
                      
                        <Formik
                            initialValues={{

                            }}
                            enableReinitialize={true}
                            //   validate={values => {
                            //     const errors = {};

                            //     if (!values.orderCatagory) {

                            //       errors.orderCatagory = 'Order Category is required';
                            //     }
                            //     // if (!values.units) {
                            //     //   errors.units = 'unit is required';
                            //     // }
                            //     return errors;
                            //   }}
                            onSubmit={(values, { setSubmitting }) => {
                                console.log(values, "umershah");

                                handleSubmit(values);
                                setSubmitting(false); // Stop Formik loader
                            }}
                        >
                            {({ isSubmitting, values, setFieldValue }) => (
                                <Form>
                                    <div className="flex flex-col gap-9">
                                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                                <h3 className="md:font-medium text-slate-500 text-center text-md md:text-xl dark:text-white">
                                                    Slab Based Tax Rate Details
                                                </h3>
                                            </div>
                                            <div className="p-6.5">
                                                <div className="mb-4.5 flex flex-wrap gap-6">



                                                </div>


                                                <>


                                                    <div className='text-center flex justify-between'>
                                                        <h2 className='text-sm md:text-2xl'> Slab Based Tax Rate Details</h2>

                                                        <div className='text-end'>
                                                            <button
                                                                type="button"
                                                                onClick={addRow}
                                                                className="flex items-center px-1 md:px-4 py-1 md:py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                                            >
                                                                <IoMdAdd className="mr-2" size={20} />
                                                                Add Row
                                                            </button>

                                                        </div>
                                                    </div>
                                                    <div className="overflow-x-scroll md:overflow-x-visible  md:overflow-y-visible -mx-4 sm:-mx-8 px-4 sm:px-8 py-4">
                                                        <div className="min-w-full shadow-md rounded-lg">
                                                            <table className="table-fixed w-full">
                                                            <thead>
    {/* Main Headings */}
    <tr className="px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white">
        <th
            className="md:px-5 md:py-3 px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[130px] md:w-[300px]"
            colSpan="2"
            style={{ minWidth: "250px" }}
        >
            Slab-Wise Item Rate <span className="text-red-700 text-xl mt-[40px] justify-center items-center"> *</span>
        </th>
        <th
            className="md:px-5 md:py-3 px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[90px] md:w-[150px]"
        >
            Taxability <span className="text-red-700 text-xl mt-[40px] justify-center items-center"> *</span>
        </th>
        <th
            className="md:px-5 md:py-3 px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[90px] md:w-[150px]"
        >
            GST <span className="text-red-700 text-xl mt-[40px] justify-center items-center"> *</span>
        </th>
        <th
            className="md:px-5 md:py-3 px-1 py-1 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
        >
            Action
        </th>
    </tr>
    {/* Subheadings */}
    <tr className="px-5 py-3 bg-gray-200 dark:bg-slate-600 dark:text-white">
        <th
            className="md:px-5 md:py-3 px-2 py-1 border-b-2 border-gray-200 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
        >
            Greater Than
        </th>
        <th
            className="md:px-5 md:py-3 px-2 py-1 border-b-2 border-gray-200 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
        >
            Upto
        </th>
        <th
            className="md:px-5 md:py-3 px-2 py-1 border-b-2 border-gray-200 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
        >
            Type
        </th>
        <th
            className="md:px-5 md:py-3 px-2 py-1 border-b-2 border-gray-200 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
        >
            Rate
        </th>
        <th
            className="md:px-5 md:py-3 px-2 py-1 border-b-2 border-gray-200 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
        >
            {/* Placeholder for alignment */}
        </th>
    </tr>
</thead>

                                                                <tbody>
                                                                    {rows.map((row, index) => (
                                                                        <tr key={row.id}>
                                                                            <td className="px-2 py-2 border-b">
                                                                                <Field
                                                                                    type="number"
                                                                                    name={`rows[${index}].greaterthan`}
                                                                                    placeholder="Greater Than"
                                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                                    onChange={(e) => {
                                                                                        const newRows = [...rows];
                                                                                        const balance = parseInt(e.target.value, 10);
                                                                                        newRows[index].greaterthan = balance;
                                                                                        // newRows[index].selectedOption2 = generateWorkerOptions(
                                                                                        //     newRows[index].selectedOption2.label || '',
                                                                                        //     values.supplierCode,
                                                                                        //     numOfLooms
                                                                                        // );
                                                                                        setRows(newRows);
                                                                                    }}
                                                                                />
                                                                                <ErrorMessage name="group" component="div" className="text-red-500" />
                                                                            </td>
                                                                            <td className="px-2 py-2 border-b">
                                                                                <Field
                                                                                    type="number"
                                                                                    name={`rows[${index}].upto`}
                                                                                    placeholder="Upto"
                                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                                    onChange={(e) => {
                                                                                        const newRows = [...rows];
                                                                                        const balance = parseInt(e.target.value, 10);
                                                                                        newRows[index].upto = balance;
                                                                                        // newRows[index].selectedOption2 = generateWorkerOptions(
                                                                                        //     newRows[index].selectedOption2.label || '',
                                                                                        //     values.supplierCode,
                                                                                        //     numOfLooms
                                                                                        // );
                                                                                        setRows(newRows);
                                                                                    }}
                                                                                />

                                                                                {

                                                                                }
                                                                            </td>
                                                                            <td className="px-2 py-2 border-b">
                                                                                <Field
                                                                                    type="text"
                                                                                    name={`rows[${index}].type`}
                                                                                    placeholder="Type"
                                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                                    onChange={(e) => {
                                                                                        const newRows = [...rows];
                                                                                        const balance = (e.target.value);
                                                                                        newRows[index].type = balance;
                                                                                        // newRows[index].selectedOption2 = generateWorkerOptions(
                                                                                        //     newRows[index].selectedOption2.label || '',
                                                                                        //     values.supplierCode,
                                                                                        //     numOfLooms
                                                                                        // );
                                                                                        setRows(newRows);
                                                                                    }}
                                                                                />
                                                                                <ErrorMessage name="group" component="div" className="text-red-500" />
                                                                            </td>
                                                                            <td className="px-2 py-2 border-b">
                                                                                <Field
                                                                                    type="text"
                                                                                    name={`rows[${index}].rate`}
                                                                                    placeholder="Enter Rate"
                                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                                    onChange={(e) => {
                                                                                        const newRows = [...rows];
                                                                                        const balance = e.target.value;
                                                                                        newRows[index].rate = balance;
                                                                                        // newRows[index].selectedOption2 = generateWorkerOptions(
                                                                                        //     newRows[index].selectedOption2.label || '',
                                                                                        //     values.supplierCode,
                                                                                        //     numOfLooms
                                                                                        // );
                                                                                        setRows(newRows);
                                                                                    }}
                                                                                />
                                                                                <ErrorMessage name="group" component="div" className="text-red-500" />
                                                                            </td>

                                                                            <td className="px-2 py-2 border-b">
                                                                                {rows.length > 1 && (
                                                                                    <button type='button' onClick={() => deleteRow(index)}>
                                                                                        <IoMdTrash size={24} />
                                                                                    </button>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </>

                                                <div className="flex justify-center mt-4 items-center">
                                                    <button type="submit" className="flex md:w-[300px] w-[220px]  justify-center rounded bg-primary p-3 font-medium text-sm text-gray hover:bg-opacity-90 mt-4">
                                                        Add Slab Based Tax Rate
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Form>



                            )}
                        </Formik>
                    </div>
                </div>
            )}
        </>
    );
};

export default Modall;
