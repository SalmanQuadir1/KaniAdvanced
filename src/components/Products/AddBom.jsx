import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import ReactSelect from 'react-select';
import { useSelector } from 'react-redux';
import { ADDBOM, customStyles as createCustomStyles } from '../../Constants/utils';
import useProduct from '../../hooks/useProduct';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


const AddBOM = () => {

    const navigate = useNavigate()


    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const { id } = useParams()

    const referenceImages = "";
    const actualImages = "";
    const productIdField = "";

    const {
        getProductList,
        productList

    } = useProduct({ referenceImages, actualImages, productIdField });
    const [errorMessage, seterrorMessage] = useState('')

    const [rows, setRows] = useState([{ id: Date.now(), selectedOption1: null, selectedOption2: "", selectedOption3: "", numOfLooms: 0 }]);
    const theme = useSelector(state => state?.persisted?.theme);
    const customStyles = createCustomStyles(theme?.mode);





    useEffect(() => {
        getProductList()
    }, [])

    console.log(productList, "puuuuu");

    const addRow = () => {
        setRows([...rows, { id: Date.now(), selectedOption1: null, selectedOption2: null, selectedOption3: [], numOfLooms: 0 }]);
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

        console.log((formData)); // Log the formData for debugging

        try {
            console.log("Submitting form...");
            const url = `${ADDBOM}/${id}`;
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

                toast.success(`BOM added successfully`);
                navigate("/product/viewProducts")
                // Call resetForm and setCurrentSupplier with proper state updates
            } else {
                seterrorMessage(data)
                console.log(data.errorMessage,"data");
                toast.error(data.errorMessage || "Please Fill All The Fields");

            }
        } catch (error) {
            console.error(error); // Log the error for debugging
            toast.error("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };
    console.log(errorMessage,"error");
    

  

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Product /Add BILL OF MATERIAL" />
            <div>
                <Formik
                    initialValues={{

                    }}
                    // validate={validate(values)}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, values }) => (
                        <Form>
                            <div className="flex flex-col gap-9">
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                        <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                            Add BILL OF MATERIAL
                                        </h3>
                                    </div>
                                    <div className="p-6.5">
                                        <div className="mb-4.5 flex flex-wrap gap-6">



                                        </div>


                                        <>


                                            <div className='text-center flex justify-between'>
                                                <h2 className=' text-sm md:text-2xl'>ADD BILL OF MATERIAL</h2>

                                                <div className='text-end'>
                                                    <button
                                                        type="button"
                                                        onClick={addRow}
                                                        className="flex items-center px-2 py-1 md:px-4 md:py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                                    >
                                                        <IoMdAdd className="mr-2" size={20} />
                                                        Add Row
                                                    </button>

                                                </div>
                                            </div>
                                            <div className="overflow-x-scroll md:overflow-x-visible  md:overflow-y-visible -mx-4 sm:-mx-8 px-4 sm:px-8 py-4">
                                                <div className="md:min-w-full min-w-[200px] shadow-md rounded-lg">
                                                    <table className="table-fixed md:w-full w-[390px]">
                                                        <thead>
                                                            <tr className='px-8 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                                                <th className="md:px-5 md:py-3 px-1 py-2 border-b-2 border-gray-200 bg-gray-100 text-left  text-[10px] md:text-md md:font-semibold text-gray-700 uppercase tracking-wider w-[100px] md:w-[300px]" style={{ minWidth: '250px' }}>PRODUCT LIST <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></th>
                                                                <th className="md:px-5 md:py-3 px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-[10px] md:text-md  font-semibold text-gray-700 uppercase tracking-wider  w-[100px] md:w-[200px] ">UNIT OF M <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></th>
                                                                <th className="md:px-5 md:py-3 px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-[10px] md:text-md font-semibold text-gray-700 uppercase tracking-wider w-[90px] md:w-[200px]">QUANTITY <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></th>
                                                                <th className="md:px-5 md:py-3 px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-[10px]  md:text-md font-semibold text-gray-700 uppercase tracking-wider md:w-[300px]">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {rows.map((row, index) => (
                                                                <tr key={row.id}>
                                                                    <td className="px-2 py-2 border-b">
                                                                        <ReactSelect
                                                                            name='product'
                                                                            value={row.selectedOption1}
                                                                            onChange={(option) => {
                                                                                const newRows = [...rows];
                                                                                newRows[index].selectedOption1 = option;
                                                                                setRows(newRows);
                                                                            }}
                                                                            classNamePrefix="react-select"
                                                                            options={productList.map(product => ({
                                                                                label: product.productDescription,
                                                                                value: product.id
                                                                            }))}
                                                                            // options={productList.productDescription}
                                                                            placeholder="Product List"
                                                                            styles={customStyles}
                                                                        />
                                                                        <ErrorMessage name="group" component="div" className="text-red-500" />
                                                                    </td>
                                                                    <td className="px-2 py-2 border-b">
                                                                        <Field
                                                                            type="text"
                                                                            name={`rows[${index}].numOfLoomss`}
                                                                            placeholder="Enter Unit Of Measure"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                            onChange={(e) => {
                                                                                const newRows = [...rows];
                                                                                const numOfLoomss = (e.target.value);
                                                                                newRows[index].selectedOption2 = numOfLoomss;
                                                                                // newRows[index].selectedOption2 = generateWorkerOptions(
                                                                                //     newRows[index].selectedOption2.label || '',
                                                                                //     values.supplierCode,
                                                                                //     numOfLooms
                                                                                // );
                                                                                setRows(newRows);
                                                                            }}
                                                                        />
                                                                        <ErrorMessage name="unit" component="div" className="text-red-500" />
                                                                        {
                                                                        errorMessage.unitOfMeasurement&&<h5 className="text-red-500">{errorMessage.unitOfMeasurement}</h5>
                                                                    }
                                                                    </td>
                                                                    <td className="px-2 py-2 border-b">
                                                                        <Field
                                                                            type="number"
                                                                            name={`rows[${index}].numOfLooms`}
                                                                            placeholder="Enter Quantity"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                            onChange={(e) => {
                                                                                const newRows = [...rows];
                                                                                const numOfLooms = parseInt(e.target.value, 10);
                                                                                newRows[index].selectedOption3 = numOfLooms;
                                                                                // newRows[index].selectedOption3 = generateWorkerOptions(
                                                                                //     newRows[index].selectedOption1?.label || '',
                                                                                //     values.supplierCode,
                                                                                //     numOfLooms
                                                                                // );
                                                                                setRows(newRows);
                                                                            }}
                                                                        />
                                                                        <ErrorMessage name="quantity" component="div" className="text-red-500" />
                                                                    {
                                                                        errorMessage.quantity&&<h5 className="text-red-500">{errorMessage.quantity}</h5>
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
                                            <button type="submit" className="flex w-[300px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-4">
                                                Add BILL OF MATERIAL
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

export default AddBOM
