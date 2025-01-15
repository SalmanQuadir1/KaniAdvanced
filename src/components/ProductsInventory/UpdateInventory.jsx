import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import ReactSelect from 'react-select';
import { useSelector } from 'react-redux';
import { ADDBOM, ADD_LOCATIONINVENTORY_URL, GET_PRODUCTInventory_URL, UPDATE_PRODUCTInventory_URL, customStyles as createCustomStyles } from '../../Constants/utils';
import useProduct from '../../hooks/useProduct';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


const UpdateInventory = () => {

    const navigate = useNavigate()


    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const { id } = useParams()

    const referenceImages = "";
    const actualImages = "";
    const productIdField = "";
    const [locationInventory, setlocationInventory] = useState()

    const { getLocation, Location } = useProduct({ referenceImages, actualImages, productIdField });

    const [rows, setRows] = useState([{ id: Date.now(), location: null, openingBalance: null,
        purchase: null,
        sale: null,
        branchTransferInwards: null,
        branchTransferOutwards: null,
        inProgressOrders:null }]);
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
                    selectedOption3: inven.quantity// Default value if empty
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
        // Prepare the locationInventory data
        const locationInventoryData = rows.map(row => ({
            location: { id: row.location?.value }, // Extract the id from the selected location
            openingBalance: row.openingBalance || 0, // Ensure a default value if empty
            closingBalance: row.closingBalance || 0,
            inProgressOrders: row.inProgressOrders || 0,
            branchTransferInwards: row.branchTransferInwards || 0,
            branchTransferOutwards: row.branchTransferOutwards || 0,
            purchase: row.purchase || 0,
            sale: row.sale || 0,
        }));
    
        console.log("Prepared locationInventory data:", locationInventoryData);
    
        try {
            console.log("Submitting form...");
            const url = `${UPDATE_PRODUCTInventory_URL}/${id}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ locationInventory: locationInventoryData }), // Send the array
            });
    
            const data = await response.json();
            console.log("Response data:", data);
    
            if (response.ok) {
                toast.success("inventory Updated successfully");
                navigate("/inventory/viewProductInventory");
            } else {
                seterrorMessage(data.errorMessage || "Please fill all the fields");
                toast.error(data.errorMessage || "An error occurred while adding inventory");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("An error occurred while submitting the form");
        } finally {
            setSubmitting(false);
        }
    };
    
    return (
        <DefaultLayout>
            <Breadcrumb pageName="PRODUCT /UPDATE INVENTORY" />
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
                                            UPDATE INVENTORY
                                        </h3>
                                    </div>
                                    <div className="p-6.5">
                                        <div className="mb-4.5 flex flex-wrap gap-6">



                                        </div>


                                        <>


                                            <div className='text-center flex justify-between'>
                                                <h2 className='text-sm md:text-2xl'>UPDATE INVENTORY</h2>

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
                                                UPDATE INVENTORY
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

export default UpdateInventory
