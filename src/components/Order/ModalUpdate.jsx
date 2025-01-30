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
    
    const navigate = useNavigate();
    const [products, setproducts] = useState([])
    const [rows, setRows] = useState([{  productId: products?.productId}]);                                                           
  
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


    // const addRow = () => {
    //     setRows([...rows, { id: Date.now(), greaterThan: 0, upTo: "", productId: products?.productId }]);
    // };


    const deleteRow = (index) => {
        setRows(rows.filter((_, rowIndex) => rowIndex !== index));
    };
     




    const handleBackdropClick = () => {
        // setIsModalOpen(false)
        onRequestClose();
    };

    const handleSubmit = (values) => {
        console.log(values, "jaijai");
        onSubmit(rows);
        onRequestClose();

        // You can now send this data to your API
    };
    console.log(rows, 'rrrrrrr');


    useEffect(() => {
      setRows([{ productId: products?.productId }]);
    }, [products]);


     useEffect(() => {
    getProduct()

  }, [prodIdd]);
  const getProduct = async () => {

    try {
      const response = await fetch(`${GET_PRODUCTBYID_URL}/${prodIdd}`, {
        method: "GET",
        headers: {
          // "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();



      setproducts(data);
      console.log(data,"datsaaaaa");

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch Product");
    }
  };

  // console.log(products, "umer shah");

  


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
                            initialValues={{ rows }}
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
                                                    Product Detail 
                                                </h3>
                                            </div>
                                            <div className="p-6.5">
                                                <div className="mb-4.5 flex flex-wrap gap-6">



                                                </div>


                                                <>


                                                   
                                                    {/* <div className="overflow-x-scroll md:overflow-x-visible  md:overflow-y-visible -mx-4 sm:-mx-8 px-4 sm:px-8 py-4"> */}
                                                    <div className="  shadow-md rounded-lg  mt-3 overflow-scroll">
                                                    <table className="min-w-full leading-normal overflow-auto">
                                                                <thead>
                                                                   
                                                                    {/* Subheadings */}
                                                                    <tr className="px-5 py-3 bg-gray-200 dark:bg-slate-600 dark:text-white">
                                                                        <th
                                                                            className="md:px-5 md:py-3 px-2 py-1 border-b-2 border-gray-200 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                                                        >
                                                                            Order Catagory
                                                                        </th>

                                                                        <th
                                                                            className="md:px-5 md:py-3 px-2 py-1 border-b-2 border-gray-200 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                                                        >
                                                                            Product Id
                                                                        </th>


                                                                        <th
                                                                            className="md:px-5 md:py-3 px-2 py-1 border-b-2 border-gray-200 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                                                        >
                                                                           BarCode
                                                                        </th>
                                                                        <th
                                                                            className="md:px-5 md:py-3 px-2 py-1 border-b-2 border-gray-200 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                                                        >
                                                                           Color Group
                                                                        </th>
                                                                   
                                                                       
                                                                          
                                                                    </tr>
                                                                </thead>

                                                                <tbody>
                                                                    {rows.map((row, index) => (
                                                                        <tr key={row.id}>
                                                                           
                                                                           
                                                                            <td className="px-2 py-2 border-b">
                                                                                {/* 
                                                                                <Field
                                                                                    type="text"
                                                                                    name={`rows[${index}].type`}
                                                                                    placeholder="Type"
                                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                                    onChange={(e) => {
                                                                                        const newRows = [...rows];
                                                                                        const balance = (e.target.value);
                                                                                        setFieldValue(`rows[${index}].type`, balance);
                                                                                        newRows[index].type = balance;
                                                                                        // newRows[index].selectedOption2 = generateWorkerOptions(
                                                                                        //     newRows[index].selectedOption2.label || '',
                                                                                        //     values.supplierCode,
                                                                                        //     numOfLooms
                                                                                        // );
                                                                                        setRows(newRows);
                                                                                    }}
                                                                                /> */}

                                                                                <ReactSelect
                                                                                    name={`rows[${index}].orderCatagory`}
                                                                                    options={productgrp}
                                                                                    // onChange={(option) => setFieldValue("gstDetails", option?.value)}
                                                                                    onChange={(option) => {
                                                                                        const newRows = [...rows];
                                                                                        const balance = (option?.value);
                                                                                        setFieldValue(`rows[${index}].orderCatagory`, balance);
                                                                                        newRows[index].orderCatagory = balance;
                                                                                        // newRows[index].selectedOption2 = generateWorkerOptions(
                                                                                        //     newRows[index].selectedOption2.label || '',
                                                                                        //     values.supplierCode,
                                                                                        //     numOfLooms
                                                                                        // );
                                                                                        setRows(newRows);
                                                                                    }}
                                                                                    styles={customStyles}
                                                                                    className="md:w-[200px] bg-white dark:bg-form-Field"
                                                                                    classNamePrefix="react-select"
                                                                                    // placeholder="Select GST details"
                                                                                />
                                                                                <ErrorMessage name="group" component="div" className="text-red-500" />
                                                                            </td>
                                                                            
                                                                            <td className="px-2 py-2 border-b">
                                                                            <Field
                                                             type="text"
                                                             value={products?.productId}
                                                             disabled
                                                             id="productId"
                                                             name="productId"
                                                             className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                           />
                                                                                   <ErrorMessage name="group" component="div" className="text-red-500" />
                                                                               </td>

                                                                               <td className="px-2 py-2 border-b">
                                                                            <Field
                                                             type="text"
                                                             value={products?.barcode}
                                                             disabled
                                                             id="productId"
                                                             name="productId"
                                                             className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                                                    {/* </div> */}
                                                </>

                                                <div className="flex justify-center mt-4 items-center">
                                                <button
                        onSubmit={(e) => console.log("heyyyyy")}
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Add'}
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
