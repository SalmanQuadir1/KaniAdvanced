import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import ReactSelect from 'react-select';
import { useSelector } from 'react-redux';
import { ADDBOM, UPDATEBOM, VIEWBOM, customStyles as createCustomStyles } from '../../Constants/utils';
import useProduct from '../../hooks/useProduct';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const UpdateBom = () => {
    const [Bom, setBom] = useState([]);
    const [rows, setRows] = useState([{ id: Date.now(), selectedOption1: null, selectedOption2: "", selectedOption3: "" }]);

    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const { id } = useParams();

    const referenceImages = "";
    const actualImages = "";
    const productIdField = "";

    const { getProductList, productList } = useProduct({ referenceImages, actualImages, productIdField });

    const theme = useSelector(state => state?.persisted?.theme);
    const customStyles = createCustomStyles(theme?.mode);

    const getBom = async () => {
        try {
            const response = await fetch(`${VIEWBOM}/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            setBom(data);
            
            // Initialize rows with productMaterials from BOM if available
            if (data?.productMaterials) {
                const initialRows = data.productMaterials.map(material => ({
                    id: Date.now(),
                    selectedOption1: {
                        label: material.products?.productDescription,
                        value: material.products?.id
                    },
                    selectedOption2: material.unitOfMeasurement || "", // Default value if empty
                    selectedOption3: material.quantity || "" // Default value if empty
                }));
                setRows(initialRows);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch BOM");
        }
    };

    useEffect(() => {
        getProductList();
        getBom();
    }, []);


    console.log(productList,"productlistttttttt");
    const addRow = () => {
        setRows([...rows, { id: Date.now(), selectedOption1: null, selectedOption2: "", selectedOption3: "" }]);
    };

    const deleteRow = (index) => {
        setRows(rows.filter((_, rowIndex) => rowIndex !== index));
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        const formData = {
            productMaterials: rows.map(row => ({
                products: { id: row.selectedOption1?.value },
                unitOfMeasurement: row.selectedOption2,
                quantity: row.selectedOption3
            }))
        };

        try {
            const url = `${UPDATEBOM}/${id}`;
            const method = "PUT";
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("BOM updated successfully");
                navigate("/product/viewProducts");
            } else {
                toast.error(`${data.errorMessage}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Product / UPDATE BILL OF MATERIAL" />
            <div>
                <Formik
                    initialValues={{}}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, values }) => (
                        <Form>
                            <div className="flex flex-col gap-9">
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                        <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                            UPDATE BILL OF MATERIAL
                                        </h3>
                                    </div>
                                    <div className="p-6.5">
                                        <div className="mb-4.5 flex flex-wrap gap-6" />

                                        <div className="text-center flex justify-between">
                                            <h2 className="text-2xl">UPDATE BILL OF MATERIAL</h2>
                                            <div className="text-end">
                                                <button
                                                    type="button"
                                                    onClick={addRow}
                                                    className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                                >
                                                    <IoMdAdd className="mr-2" size={20} />
                                                    Add Row
                                                </button>
                                            </div>
                                        </div>

                                        <div className="overflow-x-scroll md:overflow-x-visible md:overflow-y-visible -mx-4 sm:-mx-8 px-4 sm:px-8 py-4">
                                            <div className="min-w-full shadow-md rounded-lg">
                                                <table className="table-fixed w-full">
                                                    <thead>
                                                        <tr className='px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" style={{ minWidth: '250px' }}>PRODUCT LIST</th>
                                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">UNIT OF MEASURE</th>
                                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">QUANTITY</th>
                                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {rows.map((row, index) => (
                                                            <tr key={row.id}>
                                                                <td className="px-2 py-2 border-b">
                                                                    <ReactSelect
                                                                        name={`rows[${index}].selectedOption1`}
                                                                        value={row.selectedOption1}
                                                                        onChange={(option) => {
                                                                            const newRows = [...rows];
                                                                            newRows[index].selectedOption1 = option;
                                                                            setRows(newRows);
                                                                        }}
                                                                        classNamePrefix="react-select"
                                                                        options={productList?.map(product => ({
                                                                            label: product?.productId,
                                                                            value: product.id
                                                                        }))}
                                                                        placeholder="Product List"
                                                                        styles={customStyles}
                                                                    />
                                                                    <ErrorMessage name="group" component="div" className="text-red-500" />
                                                                </td>
                                                                <td className="px-2 py-2 border-b">
                                                                    <Field
                                                                        type="text"
                                                                        name={`rows[${index}].selectedOption2`}
                                                                        placeholder="Enter Unit Of Measure"
                                                                        value={row.selectedOption2} // Ensure that the value is properly set
                                                                        onChange={e => {
                                                                            const newRows = [...rows];
                                                                            newRows[index].selectedOption2 = e.target.value;
                                                                            setRows(newRows);
                                                                        }}
                                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                    />
                                                                </td>
                                                                <td className="px-2 py-2 border-b">
                                                                    <Field
                                                                        type="number"
                                                                        name={`rows[${index}].selectedOption3`}
                                                                        placeholder="Enter Quantity"
                                                                        value={row.selectedOption3} // Ensure that the value is properly set
                                                                        onChange={e => {
                                                                            const newRows = [...rows];
                                                                            newRows[index].selectedOption3 = e.target.value;
                                                                            setRows(newRows);
                                                                        }}
                                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                    />
                                                                </td>
                                                                <td className="px-2 py-2 border-b">
                                                                    {rows.length > 1 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => deleteRow(index)}
                                                                            className="text-red-600"
                                                                        >
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

                                        <div className="flex justify-center mt-4 items-center">
                                            <button type="submit" className="flex w-[300px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-4">
                                                Update BILL OF MATERIAL
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </DefaultLayout>
    );
};

export default UpdateBom;
