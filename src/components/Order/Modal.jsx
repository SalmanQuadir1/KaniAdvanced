import React, { useEffect, useState } from 'react';
import { Field, ErrorMessage, Formik, Form } from 'formik';
import ReactSelect from 'react-select';

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
      console.log(data,'dataaaaaaaaak');
      



      setproducts(data);
     

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch Product");
    }
  };

  // console.log(products, "umer shah");






  const handleBackdropClick = () => {
    // setIsModalOpen(false)
    onRequestClose();
  };

  const handleSubmit = (values) => {
    onSubmit(values);
  
    // You can now send this data to your API
  };


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
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-slate-500 text-center text-xl dark:text-black">
                Product Detail
              </h3>
            </div>
            <Formik
              initialValues={{
                id: products.id || '',
                productId: products.productId || '',
                barCode: products?.barcode || '',
                orderCatagory: products.orderCatagory || '',
                weight: products.finishedWeight || '',
                units: products.units||'',
                colorGroup: products?.colors?.colorName || '',
                warpColors: products.warpColors || '',
                weftColors: products.weftColors || '',
                weave: products.weave || '',
                warpYarn: products.warpYarn || '',
                weftYarn: products.weftYarn || '',
                pixAndReed: products.pixAndReed || '',
                deying: '',
                cost: products.cost || '',
                mrp: products.mrp || '',
                wPrice: products.wholesalePrice || '',
              }}
              enableReinitialize={true}
              validate={values => {
                const errors = {};

                if (!values.orderCatagory) {

                  errors.orderCatagory = 'Order Category is required';
                }
                // if (!values.units) {
                //   errors.units = 'unit is required';
                // }
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {

                handleSubmit(values);
                setSubmitting(false); // Stop Formik loader
              }}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form>
                  <div>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1 min-w-[300px] mt-2">
                        <label className="mb-1 block text-black dark:text-[rgb(200,200,200)]">Order Category</label>
                        <ReactSelect
                          name="orderCatagory"
                          value={productgrp.find(option => option.value === values.orderCatagory)}
                          onChange={(option) => setFieldValue('orderCatagory', option.value)}
                          styles={customStyles}
                          options={productgrp}
                          className="bg-white  dark:bg-form-input"
                          classNamePrefix="react-select"
                          placeholder="Select"
                        />
                        <ErrorMessage name="orderCatagory" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="productId" className="mb-3">Product ID</label>
                        <Field
                          type="text"
                          value={products?.productId}
                          disabled
                          id="productId"
                          name="productId"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="productId" component="div" className="text-red-600 text-sm" />
                      </div>


                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="barCode" className="mb-2">BarCode</label>
                        <Field
                          type="text"
                          id="barCode"
                          value={products?.barcode}
                          disabled
                          name="barCode"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="barCode" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label className="mb-1 block text-black dark:text-[rgb(200,200,200)]">Color Group</label>
                        <Field
                          type="text"
                          id="barCode"
                          value={products?.colors?.colorName}
                          disabled
                          name="colorGroup"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="colorGroup" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label className="mb-2.5 block text-black dark:text-[rgb(200,200,200)]">Product Group</label>
                        <Field
                          type="text"
                          id="barCode"
                          value={products?.productGroup?.productGroupName}
                          disabled
                          name="productGroup"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="productGroup" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label className="mb-2.5 block text-black dark:text-[rgb(200,200,200)]">Product Category</label>
                        <Field
                          type="text"
                          id="barCode"
                          value={products?.productCategory?.productCategoryName}
                          disabled
                          name="productCategory"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="productCatagory" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label className=" block text-black dark:text-[rgb(200,200,200)]">Design Name</label>
                        <Field
                          type="text"
                          id="barCode"
                          value={products?.design?.designName}
                          disabled
                          name="designName"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="designName" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="hsnCode" className="mb-2">HSN Code</label>
                        <Field
                          type="text"
                          id="hsnCode"
                          value={products?.hsnCode?.hsnCodeName}
                          disabled
                          name="hsnCode"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="hsnCode" component="div" className="text-red-600 text-sm" />
                      </div>


                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="colorName" className="mb-2">Color Name</label>
                        <Field
                          type="text"
                          disabled
                          id="colorName"
                          value={products?.colorName}
                          name="colorName"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="colorName" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label className="mb-1 block text-black dark:text-[rgb(200,200,200)]">Style</label>
                        <Field
                          type="text"
                          id="style"
                          value={products?.styles?.stylesName}
                          disabled
                          name="style"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="style" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label className="mb-2.5 block text-black dark:text-[rgb(200,200,200)]">Size (in cms)</label>
                        <Field
                          type="text"
                          id="size"
                          value={products?.sizes?.sizeName}
                          disabled
                          name="size"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="size" component="div" className="text-red-600 text-sm" />
                      </div>






                      <div className="flex-1 min-w-[300px] mt-4">
                        <label className="mb-2.5 block text-black dark:text-[rgb(200,200,200)]">Units</label>
                        <Field
                          type="text"
                          // as="select" // Use 'as' to render a select element
                          id="units"
                          name="units"
                          disabled
                          value={products?.unit?.name}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                          {/* <option value="" label="Select a unit" />
                          {unitsOption?.map((unit) => (
                            <option key={unit.value} value={unit.value}>
                              {unit.label}
                            </option>
                          ))} */}
                        </Field>
                        <ErrorMessage name="units" component="div" className="text-red-600 text-sm" />
                      </div>

                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="hsnCode" className="mb-2">Weight(gms)</label>
                        <Field
                          type="text"
                          disabled
                          id="weight"
                          value={products?.finishedWeight}
                          name="weight"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="weight" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="hsnCode" className="mb-2">Warp Colors</label>
                        <Field
                          type="text"
                          id="warp"
                          disabled
                          value={products?.warpColors}
                          name="warp"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="warp" component="div" className="text-red-600 text-sm" />
                      </div>



                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="hsnCode" className="mb-2">Weft Colors</label>
                        <Field
                          type="text"
                          id="weft"
                          disabled
                          value={products?.weftColors}
                          name="weft"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="weft" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="hsnCode" className="mb-2">Weave</label>
                        <Field
                          type="text"
                          id="weave"
                          disabled
                          value={products?.weave}
                          name="weave"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="weave" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="hsnCode" className="mb-2">Warp Yarn</label>
                        <Field
                          type="text"
                          id="WarpYarn"
                          disabled
                          value={products?.warpYarn}
                          name="WarpYarn"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="WarpYarn" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="hsnCode" className="mb-2">Weft Yarn</label>
                        <Field
                          type="text"
                          id="WeftYarn"
                          disabled
                          value={products?.weftYarn}
                          name="WeftYarn"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="WeftYarn" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="hsnCode" className="mb-2">Pic & Read</label>
                        <Field
                          type="text"
                          id="pic"
                          disabled

                          value={products?.pixAndReed}

                          name="pic"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="pic" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="hsnCode" className="mb-2">Deying Cost</label>
                        <Field
                          type="text"
                          id="deying"
                          name="deying"
                          disabled
                          value={products?.dyeingCost}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="deying" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="hsnCode" className="mb-2"> Cost</label>
                        <Field
                          disabled
                          type="text"
                          id="cost"
                          value={products?.cost}
                          name="cost"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="cost" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="hsnCode" className="mb-2"> MRP</label>
                        <Field
                          disabled
                          type="text"
                          id="mrp"
                          value={products?.mrp}
                          name="mro"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="mrp" component="div" className="text-red-600 text-sm" />
                      </div>








                      <div className="flex-1  min-w-[300px] mt-4">
                        <label htmlFor="hsnCode" className="mb-2"> Wholesale Price</label>
                        <Field
                          type="text"
                          disabled
                          id="wPrice"
                          name="wPrice"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="wPrice" component="div" className="text-red-600 text-sm" />
                      </div>












                    </div>


                    <label>Reference Images</label>
                    <div className="flex mt-5 gap-3 ">

                      <div className=" flex-1 p-4 border-2 border-dashed rounded-md bg-gray-50 dark:bg-black dark:border-strokedark flex flex-row">
                        {/* Grid Layout */}
                        <div className="flex flex-col grid-cols-3 ">

                          <div className="flex flex-row gap-4 ">

                            {/* Image Preview */}
                            {products?.images?.map((ref) => (
                              <>
                                {
                                  ref.referenceImage != null &&

                                  <img
                                    className="h-20 w-20 border-1 dark:border-slate-400 transition-transform duration-500 ease-in-out transform group-hover:scale-[2] group-hover:shadow-2xl"
                                    crossOrigin="use-credentials"
                                    src={`${GET_IMAGE}/products/getimages/${ref.referenceImage}`}
                                    alt="Product Image"
                                  />
                                }
                              </>
                            ))}
                            {/* Cancel Button */}
                            {/* <button
                              type="Submit" // Not a native form submission button
                              className="px-4 py-2 bg-blue-500 text-white rounded"
                            // Formik's submission process is triggered here
                            >
                              Submit
                            </button> */}
                          </div>

                        </div>
                      </div>











                      <div className=" flex-1 p-4 border-2 border-dashed rounded-md bg-gray-50 dark:bg-black dark:border-strokedark flex flex-row">

                        {/* Grid Layout */}
                        <div className="flex flex-col grid-cols-3">

                          <div className="flex flex-row gap-4 ">
                            {/* Image Preview */}
                            {products?.images?.map((ref) => (
                              <>
                                {
                                  ref.actualImage != null &&

                                  <img
                                    className="h-20 w-20  transition-transform duration-500 ease-in-out transform group-hover:scale-[2] group-hover:shadow-2xl"
                                    crossOrigin="use-credentials"
                                    src={`${GET_IMAGE}/products/getimages/${ref.actualImage}`}
                                    alt="Product Image"
                                  />
                                }
                              </>
                            ))}
                            {/* Cancel Button */}


                          </div>

                        </div>
                      </div>






                    </div>


                    <div className="mb-6">
                      <label className="mb-2.5 block text-black dark:text-white mt-7">Supplier</label>
                      <ReactSelect
                        isMulti // Allow multiple selections
                        name="supplier"
                        value={
                          products?.supplier?.map((supplier) => ({
                            value: supplier.id,
                            label: supplier.name,
                          })) || []
                        }
                        isDisabled // Make the select field read-only
                        options={products?.supplier?.map((supplier) => ({
                          value: supplier.id,
                          label: supplier.name,
                        })) || []}
                        placeholder="Select Supplier"
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: "rgba(226, 232, 240)", // Example for light bg
                            borderColor: "#CBD5E1", // Stroke color
                            color: "black",
                            cursor: "not-allowed",
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: "black",
                          }),
                          multiValue: (base) => ({
                            ...base,
                            backgroundColor: "#CBD5E1",
                          }),
                        }}
                        classNamePrefix="react-select"
                        className="w-full rounded border-[1.5px] bg-slate-200 py-2 px-5 text-black dark:text-white transition dark:bg-black dark:border-form-strokedark"
                      />

                    </div>

                    <div className="mb-6">
                      <label className="mb-2.5 block text-black dark:text-white mt-7">Supplier Code</label>
                      <Field

                        disabled
                        styles={customStyles}
                        value={products?.supplierCode?.supplierCode}
                        name="weiverCode"
                        placeholder="Type your message"
                        className="w-full dark:bg-black bg-slate-200 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:text-white active:border-primary disabled:cursor-default dark:border-form-strokedark  dark:text-black dark:focus:border-primary"
                      />
                    </div>


                    <div className="flex justify-end mt-6">
                      <button
                        // onSubmit={(e) => console.log("heyyyyy")}
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Add'}
                      </button>
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
