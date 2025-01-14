import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import ReactSelect from 'react-select';
import { useSelector } from 'react-redux';
import { ADDBOM, ADD_LOCATIONINVENTORY_URL, GET_PRODUCTBYID_URL, customStyles as createCustomStyles } from '../../Constants/utils';
import useProduct from '../../hooks/useProduct';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


const AddLocationInventory = () => {

    const navigate = useNavigate()


    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const { id } = useParams()
    const [productMrp, setproductMrp] = useState("")

    const referenceImages ="";
    const actualImages = "";
    const productIdField = "";

    const { getLocation, Location, } = useProduct({ referenceImages, actualImages, productIdField });
console.log(productMrp,"productmrp");
    const [rows, setRows] = useState([{ id: Date.now(), selectedOption1: null, selectedOption2: "", rate: productMrp || 0, value: null, selectedOption3: "", numOfLooms: 0 }]);
    const theme = useSelector(state => state?.persisted?.theme);
    const customStyles = createCustomStyles(theme?.mode);
    const [errorMessage, seterrorMessage] = useState("")


    const getProductMrp = async (page) => {
     
        try {
            const response = await fetch(`${GET_PRODUCTBYID_URL}/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
             
            });
            const data = await response.json();
            console.log(data, "pr datatata")

            setproductMrp(data?.mrp)
          
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch Product");
        }
    };

    useEffect(() => {
        getLocation()
        getProductMrp()
    }, [])


    const addRow = () => {
        setRows([...rows, { id: Date.now(), selectedOption1: null, selectedOption2: null, rate: productMrp, value: null }]);
    };


    const deleteRow = (index) => {
        setRows(rows.filter((_, rowIndex) => rowIndex !== index));
    };





    const handleSubmit = async (values, { setSubmitting }) => {
        const formData = {


            locationInventory: rows.map(row => ({
                location: { id: row.selectedOption1?.value },
                openingBalance: row.selectedOption2,
                rate: row.rate,
                value: row.value
            }))
        }


        console.log(formData, "juiiiiii"); // Log the formData for debugging

        try {
            console.log("Submitting form...");
            const url = `${ADD_LOCATIONINVENTORY_URL}/${id}`;
            console.log(url, "jammuu");
            const method = "POST";
            // Ensure token is fetched correctly

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData) // Stringify the formData
            });

            const data = await response.json();
            console.log(data, "Response data"); // Log the response data for debugging

            if (response.ok) {

                toast.success(`Location added successfully`);
                navigate("/product/viewProducts")
                // Call resetForm and setCurrentSupplier with proper state updates
            } else {
                seterrorMessage(data)
                console.log(data.errorMessage, "data");
                toast.error(data.errorMessage || "Please Fill All The Fields");

            }
        } catch (error) {
            console.error(error); // Log the error for debugging
            toast.error("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (productMrp) {
            setRows((prevRows) => prevRows.map((row) => ({ ...row, rate: productMrp })));
        }
    }, [productMrp]);
    
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Product /ADD PRODUCT INVENTORY" />
            <div>
                <Formik
                    initialValues={{

                    }}
                    // validate={values => {
                    //     const errors = {};
                    //     if (!values.name) {
                    //         errors.name = 'Required';
                    //     }
                    //     if (!values.phoneNumber) {
                    //         errors.phoneNumber = 'Required';
                    //     }
                    //     if (values.phoneNumber < 10) {
                    //         errors.phoneNumber = 'Phone Number Must Be Greater than 10 digit';
                    //     }
                    //     if (!values.supplierCode) {
                    //         errors.supplierCode = 'Required';
                    //     }
                    //     if (!values.address) {
                    //         errors.address = 'Required';
                    //     }
                    //     if (!values.bankName) {
                    //         errors.bankName = 'Required';
                    //     }
                    //     if (!values.accountNo) {
                    //         errors.accountNo = 'Required';

                    //     }


                    //     if (values.accountNo < 10) {
                    //         errors.accountNo = 'Required';
                    //     }
                    //     if (!values.ifscCode) {
                    //         errors.ifscCode = 'Required';
                    //     }

                    //     if (!values.emailId) {
                    //         errors.emailId = 'Required';
                    //     }
                    //     return errors;
                    // }}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, values }) => (
                        <Form>
                            <div className="flex flex-col gap-9">
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                        <h3 className="md:font-medium text-slate-500 text-center text-md md:text-xl dark:text-white">
                                            Add PRODUCT INVENTORY
                                        </h3>
                                    </div>
                                    <div className="p-6.5">
                                        <div className="mb-4.5 flex flex-wrap gap-6">



                                        </div>


                                        <>


                                            <div className='text-center flex justify-between'>
                                                <h2 className='text-sm md:text-2xl'>ADD PRODUCT INVENTORY</h2>

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
                                                            <tr className='px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                                                <th className="md:px-5 md:py-3 px-2 py-1border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[130px] md:w-[200px]" style={{ minWidth: '250px' }}>LOCATION <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></th>
                                                                <th className="md:px-5 md:py-3 px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[90px] md:w-[200px]">OPENING BALANCE <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></th>
                                                                <th className="md:px-5 md:py-3 px-2 py-1border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[130px] md:w-[200px]" >Rate <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></th>
                                                                <th className="md:px-5 md:py-3 px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[90px] md:w-[200px]">Value <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></th>
                                                                <th className="md:px-5 md:py-3 px-1 py-1 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {rows.map((row, index) => (
                                                                <tr key={row.id}>
                                                                    <td className="px-2 py-2 border-b">
                                                                        <ReactSelect
                                                                            name="location"
                                                                            value={row.selectedOption1}
                                                                            onChange={(option) => {
                                                                                const newRows = [...rows];
                                                                                newRows[index].selectedOption1 = option;
                                                                                setRows(newRows);
                                                                            }}
                                                                            classNamePrefix="react-select"
                                                                            options={Location.map(location => ({
                                                                                label: location.address,
                                                                                value: location.id
                                                                            }))}
                                                                            placeholder="Location List"
                                                                            styles={customStyles}
                                                                        />
                                                                    </td>
                                                                    <td className="px-2 py-2 border-b">
                                                                        <Field
                                                                            type="number"
                                                                            name={`rows[${index}].selectedOption2`}
                                                                            placeholder="Enter Opening Balance"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                            onChange={(e) => {
                                                                                const newRows = [...rows];
                                                                                const balance = parseFloat(e.target.value) || 0;
                                                                                newRows[index].selectedOption2 = balance;
                                                                                newRows[index].value = balance * (newRows[index].rate || 0); // Update value
                                                                                setRows(newRows);
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td className="px-2 py-2 border-b">
                                                                        <Field
                                                                            type="number"
                                                                            name={`rows[${index}].rate`}
                                                                            value={row.rate||""}
                                                                            placeholder="Enter Rate"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                            onChange={(e) => {
                                                                                const newRows = [...rows];
                                                                                const rate = parseFloat(e.target.value) || 0;
                                                                                newRows[index].rate = rate;
                                                                                newRows[index].value = rate * (newRows[index].selectedOption2 || 0); // Update value
                                                                                setRows(newRows);
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td className="px-2 py-2 border-b">
                                                                        <Field
                                                                            type="number"
                                                                            name={`rows[${index}].value`}
                                                                            placeholder="Value"
                                                                            value={row.value || 0} // Display calculated value
                                                                            disabled
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-gray-500 outline-none transition dark:border-form-strokedark dark:bg-slate-700 dark:text-white"
                                                                        />
                                                                    </td>
                                                                    <td className="px-2 py-2 border-b">
                                                                        {rows.length > 1 && (
                                                                            <button type="button" onClick={() => deleteRow(index)}>
                                                                                <IoMdTrash size={24} />
                                                                            </button>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            {/* Total Row */}
                                                            <tr>
                                                                <td className="px-2 py-2 border-t font-bold text-black dark:text-white" colSpan={3}>
                                                                    Total Values
                                                                </td>
                                                                <td className="px-2 py-2 border-t font-bold text-black dark:text-white">
                                                                    {rows.reduce((total, row) => total + (row.value || 0), 0).toFixed(2)}
                                                                </td>
                                                                <td className="px-2 py-2 border-t"></td>
                                                            </tr>
                                                        </tbody>

                                                    </table>
                                                </div>
                                            </div>
                                        </>

                                        <div className="flex justify-center mt-4 items-center">
                                            <button type="submit" className="flex md:w-[300px] w-[220px]  justify-center rounded bg-primary p-3 font-medium text-sm text-gray hover:bg-opacity-90 mt-4">
                                                Add PRODUCT INVENTORY
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
    )
}

export default AddLocationInventory
