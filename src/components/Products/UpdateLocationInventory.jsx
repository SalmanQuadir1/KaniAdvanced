import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import ReactSelect from 'react-select';
import { useSelector } from 'react-redux';
import { ADDBOM, ADD_LOCATIONINVENTORY_URL, GET_PRODUCTInventory_URL, customStyles as createCustomStyles } from '../../Constants/utils';
import useProduct from '../../hooks/useProduct';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


const UpdateLocationInventory = () => {

    const navigate = useNavigate()


    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const { id } = useParams()

    const referenceImages = "";
    const actualImages = "";
    const productIdField = "";
    const [locationInventory, setlocationInventory] = useState()

    const { getLocation, Location } = useProduct({ referenceImages, actualImages, productIdField });

    const [rows, setRows] = useState([{ id: Date.now(), selectedOption1: null, selectedOption2: "", selectedOption3: "", numOfLooms: 0 }]);
    const theme = useSelector(state => state?.persisted?.theme);
    const customStyles = createCustomStyles(theme?.mode);

    const getLocationInventory = async () => {
        try {
            const response = await fetch(`${GET_PRODUCTInventory_URL}/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data, "datasssddddd");
            setlocationInventory(data);

            // Initialize rows with productMaterials from BOM if available
            if (data) {
                const initialRows = data?.map(inven => ({
                    id: Date.now(),
                    location: {
                        label: inven.location?.address,
                        value: inven.location?.id
                    },
                    openingBalance: inven.openingBalance , // Default value if empty
                    closingBalance: inven.closingBalance ,
                    inProgressOrders: inven.inProgressOrders ,
                    branchTransferInwards: inven.branchTransferInwards  ,// Default value if empty
                    branchTransferOutwards: inven.branchTransferOutwards ,// Default value if empty
                    purchase: inven.purchase  ,// Default value if empty
                    sale: inven.sale , // Default value if empty
                    selectedOption3: inven.quantity  // Default value if empty
                }));
                setRows(initialRows);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch BOM");
        }
    };
    useEffect(() => {
        getLocationInventory()

    }, [])

    console.log(rows,"heyserrrr");









    const [errorMessage, seterrorMessage] = useState("")




    useEffect(() => {
        getLocation()
    }, [])


    const addRow = () => {
        setRows([...rows, { id: Date.now(), location: null, openingBalance: null,
        purchase: null,
        sale: null,
        branchTransferInwards: null,
        branchTransferOutwards: null,
        inProgressOrders:null
    }]);
    };


    const deleteRow = (index) => {
        setRows(rows.filter((_, rowIndex) => rowIndex !== index));
    };





    const handleSubmit = async (values, { setSubmitting }) => {
        const formData = {


            locationInventory: rows.map(row => ({
                location: { id: row.selectedOption1?.value },
                openingBalance: row.selectedOption2
            }))
        }


        console.log((formData)); // Log the formData for debugging

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
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Product /ADD PRODUCT INVENTORY" />
            <div>
                <Formik
                    initialValues={{

                    }}
                   
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, values }) => (
                        <Form>
                            <div className="flex flex-col gap-9">
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                        <h3 className="md:font-medium text-slate-500 text-center text-md md:text-xl dark:text-white">
                                            UPDATE PRODUCT INVENTORY
                                        </h3>
                                    </div>
                                    <div className="p-6.5">
                                        <div className="mb-4.5 flex flex-wrap gap-6">



                                        </div>


                                        <>


                                            <div className='text-center flex justify-between'>
                                                <h2 className='text-sm md:text-2xl'>UPDATE PRODUCT INVENTORY</h2>

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
                                                <div className=" overflow-x-scroll min-w-full shadow-md rounded-lg">
                                                    <table className="overflow-x-scroll table-fixed w-full">
                                                        <thead>
                                                            <tr className='px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                                                <th className="md:px-5 md:py-3 px-2 py-1border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[130px] md:w-[150px]" >LOCATION <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></th>
                                                                <th className="md:px-5 md:py-3 px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[90px] md:w-[130px]">OPENING BALANCE <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></th>
                                                                <th className="md:px-5 md:py-3 px-2 py-1border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[130px] md:w-[130px]">branch Transfer Inwards <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></th>
                                                                <th className="md:px-5 md:py-3 px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[90px] md:w-[130px]">branch Transfer Outwards <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></th>
                                                                <th className="md:px-5 md:py-3 px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[90px] md:w-[120px]">closing Balance <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></th>
                                                                <th className="md:px-5 md:py-3 px-1 py-1 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[90px] md:w-[120px]"> in Progress Orders</th>
                                                                <th className="md:px-5 md:py-3 px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[90px] md:w-[120px]">purchase <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></th>

                                                                <th className="md:px-5 md:py-3 px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[90px] md:w-[120px]">sale <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></th>
                                                                <th className="md:px-5 md:py-3 px-1 py-1 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[90px] md:w-[120px]">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {rows.map((row, index) => (
                                                                <tr key={row.id}>
                                                                    <td className="px-2 py-2 border-b">
                                                                        <ReactSelect
                                                                            name='location'
                                                                            value={row.location}
                                                                            onChange={(option) => {
                                                                                const newRows = [...rows];
                                                                                newRows[index].location = option;
                                                                                setRows(newRows);
                                                                            }}
                                                                            classNamePrefix="react-select"
                                                                            options={Location.map(location => ({
                                                                                label: location.address,
                                                                                value: location.id
                                                                            }))}
                                                                            // options={productList.productDescription}
                                                                            placeholder="Location List"
                                                                            styles={customStyles}
                                                                        />
                                                                        <ErrorMessage name="group" component="div" className="text-red-500" />
                                                                    </td>
                                                                    <td className="px-2 py-2 border-b">
                                                                        <Field
                                                                            type="number"
                                                                            name={`rows[${index}].openingBalance`}
                                                                            value={row.openingBalance}
                                                                            placeholder="Enter opening Balance"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                            onChange={(e) => {
                                                                                const newRows = [...rows];
                                                                                const balance = parseInt(e.target.value, 10);
                                                                                newRows[index].openingBalance = balance;
                                                                                // newRows[index].selectedOption2 = generateWorkerOptions(
                                                                                //     newRows[index].selectedOption2.label || '',
                                                                                //     values.supplierCode,
                                                                                //     numOfLooms
                                                                                // );
                                                                                setRows(newRows);
                                                                            }}
                                                                        />

                                                                        {
                                                                            errorMessage.openingBalance && <h5 className="text-red-500">{errorMessage.openingBalance}</h5>
                                                                        }
                                                                    </td>
                                                                    <td className="px-2 py-2 border-b">
                                                                        <Field
                                                                            type="number"
                                                                            name={`rows[${index}].branchTransferInwards`}
                                                                            value={row.branchTransferInwards}
                                                                            placeholder="Enter opening Balance"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                            onChange={(e) => {
                                                                                const newRows = [...rows];
                                                                                const balance = parseInt(e.target.value, 10);
                                                                                newRows[index].branchTransferInwards = balance;
                                                                                // newRows[index].selectedOption2 = generateWorkerOptions(
                                                                                //     newRows[index].selectedOption2.label || '',
                                                                                //     values.supplierCode,
                                                                                //     numOfLooms
                                                                                // );
                                                                                setRows(newRows);
                                                                            }}
                                                                        />

                                                                        {
                                                                            errorMessage.openingBalance && <h5 className="text-red-500">{errorMessage.openingBalance}</h5>
                                                                        }
                                                                    </td>
                                                                    <td className="px-2 py-2 border-b">
                                                                        <Field
                                                                            type="number"
                                                                            name={`rows[${index}].branchTransferOutwards`}
                                                                            value={row.branchTransferOutwards}
                                                                            placeholder="Enter opening Balance"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                            onChange={(e) => {
                                                                                const newRows = [...rows];
                                                                                const balance = parseInt(e.target.value, 10);
                                                                                newRows[index].branchTransferOutwards = balance;
                                                                                // newRows[index].selectedOption2 = generateWorkerOptions(
                                                                                //     newRows[index].selectedOption2.label || '',
                                                                                //     values.supplierCode,
                                                                                //     numOfLooms
                                                                                // );
                                                                                setRows(newRows);
                                                                            }}
                                                                        />

                                                                        {
                                                                            errorMessage.openingBalance && <h5 className="text-red-500">{errorMessage.openingBalance}</h5>
                                                                        }
                                                                    </td>
                                                                    <td className="px-2 py-2 border-b">
                                                                        <Field
                                                                            type="number"
                                                                            name={`rows[${index}].closingBalance`}
                                                                            value={row.closingBalance}
                                                                            placeholder="Enter opening Balance"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                            onChange={(e) => {
                                                                                const newRows = [...rows];
                                                                                const balance = parseInt(e.target.value, 10);
                                                                                newRows[index].closingBalance = balance;
                                                                                // newRows[index].selectedOption2 = generateWorkerOptions(
                                                                                //     newRows[index].selectedOption2.label || '',
                                                                                //     values.supplierCode,
                                                                                //     numOfLooms
                                                                                // );
                                                                                setRows(newRows);
                                                                            }}
                                                                        />

                                                                        {
                                                                            errorMessage.openingBalance && <h5 className="text-red-500">{errorMessage.openingBalance}</h5>
                                                                        }
                                                                    </td>
                                                                    <td className="px-2 py-2 border-b">
                                                                        <Field
                                                                            type="number"
                                                                            name={`rows[${index}].inProgressOrders`}
                                                                            value={row.inProgressOrders}
                                                                            placeholder="Enter in Progress Orders"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                            onChange={(e) => {
                                                                                const newRows = [...rows];
                                                                                const balance = parseInt(e.target.value, 10);
                                                                                newRows[index].inProgressOrders = balance;
                                                                                // newRows[index].selectedOption2 = generateWorkerOptions(
                                                                                //     newRows[index].selectedOption2.label || '',
                                                                                //     values.supplierCode,
                                                                                //     numOfLooms
                                                                                // );
                                                                                setRows(newRows);
                                                                            }}
                                                                        />

                                                                        {
                                                                            errorMessage.openingBalance && <h5 className="text-red-500">{errorMessage.openingBalance}</h5>
                                                                        }
                                                                    </td>
                                                                    <td className="px-2 py-2 border-b">
                                                                        <Field
                                                                            type="number"
                                                                            name={`rows[${index}].purchase`}
                                                                            value={row.purchase}
                                                                            placeholder="Enter purchase"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                            onChange={(e) => {
                                                                                const newRows = [...rows];
                                                                                const balance = parseInt(e.target.value, 10);
                                                                                newRows[index].purchase = balance;
                                                                                // newRows[index].selectedOption2 = generateWorkerOptions(
                                                                                //     newRows[index].selectedOption2.label || '',
                                                                                //     values.supplierCode,
                                                                                //     numOfLooms
                                                                                // );
                                                                                setRows(newRows);
                                                                            }}
                                                                        />

                                                                        {
                                                                            errorMessage.openingBalance && <h5 className="text-red-500">{errorMessage.openingBalance}</h5>
                                                                        }
                                                                    </td>
                                                                    <td className="px-2 py-2 border-b">
                                                                        <Field
                                                                            type="number"
                                                                            name={`rows[${index}].sale`}
                                                                            value={row.sale}
                                                                            placeholder="Enter sale"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                            onChange={(e) => {
                                                                                const newRows = [...rows];
                                                                                const balance = parseInt(e.target.value, 10);
                                                                                newRows[index].sale = balance;
                                                                                // newRows[index].selectedOption2 = generateWorkerOptions(
                                                                                //     newRows[index].selectedOption2.label || '',
                                                                                //     values.supplierCode,
                                                                                //     numOfLooms
                                                                                // );
                                                                                setRows(newRows);
                                                                            }}
                                                                        />

                                                                        {
                                                                            errorMessage.openingBalance && <h5 className="text-red-500">{errorMessage.openingBalance}</h5>
                                                                        }
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

export default UpdateLocationInventory
