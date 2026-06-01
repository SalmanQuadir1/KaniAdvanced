import React, { useEffect, useState } from 'react';
import { Field, ErrorMessage, Formik, Form } from 'formik';
import ReactSelect from 'react-select';

import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { GET_IMAGE } from '../../Constants/utils';
import { useNavigate, useNavigation } from 'react-router-dom';
import useorder from '../../hooks/useOrder';

const ModalUpdate = ({ isOpen, onRequestClose, onSubmit, prodIdd, width = "400px", height = "auto", GET_PRODUCTBYID_URL }) => {
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const navigate = useNavigate();
  const [products, setproducts] = useState([])
  const [prodIdOptions, setprodIdOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { productId, getprodId } = useorder();

  const productgrp = [
    { value: 'Embroidery', label: 'Embroidery' },
    { value: 'Dyeing', label: 'Dyeing' },
    { value: 'Plain Order', label: 'Plain Order' },
  ];

  const unitsOption = [
    { value: 'pcs', label: 'pcs' },
    { value: 'Mtrs', label: 'Mtrs' },
  ];

  // Fetch product IDs for source product dropdown
  useEffect(() => {
    const fetchProdId = async () => {
      setIsLoading(true);
      await getprodId();
      setIsLoading(false);
    };
    fetchProdId();
  }, []);

  // Format product options when productId changes
  useEffect(() => {
    if (productId) {
      const formattedProdIdOptions = productId?.map(prodId => ({
        value: prodId.id,
        label: prodId?.productId,
        prodIdObject: prodId,
        prodId: prodId.id
      }));
      setprodIdOptions(formattedProdIdOptions);
    }
  }, [productId]);

  useEffect(() => {
    getProduct()
  }, [prodIdd]);

  const getProduct = async () => {
    try {
      const response = await fetch(`${GET_PRODUCTBYID_URL}/${prodIdd}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      setproducts(data);
      console.log(data, "datsaaaaa");
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch Product");
    }
  };

  const handleBackdropClick = () => {
    onRequestClose();
  };

  const handleSubmit = (values) => {
    onSubmit(values);
    console.log(values, "vall");
  };

  console.log(products, "heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 mt-11 z-50"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white p-8 rounded-lg shadow-lg relative overflow-y-auto"
            style={{
              width,
              height,
              position: 'absolute',
              right: '50px',
              top: '50px',
              transform: 'none'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-0 right-0 m-3 text-gray-600 hover:text-gray-800"
              onClick={onRequestClose}
              aria-label="Close modal"
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
                sourceProductId: products.sourceProductId || null,
                barCode: products?.barcode || '',
                orderCatagory: products.orderCatagory || '',
                weight: products.finishedWeight || '',
                units: products?.unit?.name || '',
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
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
              }}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form>
                  <div>
                    <div className="flex flex-wrap gap-4">
                      {/* Order Category Field */}
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label className="mb-1 block text-black dark:text-[rgb(200,200,200)]">Order Category</label>
                        <ReactSelect
                          name="orderCatagory"
                          value={productgrp.find(option => option.value === values.orderCatagory)}
                          onChange={(option) => setFieldValue('orderCatagory', option.value)}
                          options={productgrp}
                          className="bg-white dark:bg-form-input"
                          classNamePrefix="react-select"
                          placeholder="Select"
                        />
                        <ErrorMessage name="orderCatagory" component="div" className="text-red-600 text-sm" />
                      </div>

                      {/* Source Product Field - Conditional for Dyeing/Embroidery */}
                      {(values.orderCatagory?.toLowerCase() === 'dyeing' || values.orderCatagory?.toLowerCase() === 'embroidery') && (
                        <div className="flex-1 min-w-[300px] mt-4">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Source Product <span className="text-red-500 ml-1">*</span>
                          </label>
                          <ReactSelect
                            name="sourceProductId"
                            value={prodIdOptions?.find(option => option.prodIdObject?.id === values.sourceProductId?.id) || null}
                            onChange={(option) => setFieldValue("sourceProductId", option?.prodIdObject || null)}
                            options={prodIdOptions}
                            isLoading={isLoading}
                            className="bg-white dark:bg-form-Field"
                            classNamePrefix="react-select"
                            placeholder={isLoading ? 'Loading Products...' : 'Select Source Product'}
                            isClearable
                          />
                          <ErrorMessage name="sourceProductId" component="div" className="text-red-600 text-sm" />
                        </div>
                      )}

                      {/* Product ID Field */}
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

                      {/* BarCode Field */}
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

                      {/* Color Group Field */}
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

                      {/* Product Group Field */}
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

                      {/* Product Category Field */}
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

                      {/* Design Name Field */}
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

                      {/* HSN Code Field */}
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

                      {/* Color Name Field */}
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="colorName" className="mb-2">Color Name</label>
                        <Field
                          type="text"
                          id="colorName"
                          value={products?.colorName}
                          name="colorName"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="colorName" component="div" className="text-red-600 text-sm" />
                      </div>

                      {/* Style Field */}
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

                      {/* Size Field */}
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

                      {/* Units Field */}
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label className="mb-2.5 block text-black dark:text-[rgb(200,200,200)]">Units</label>
                        <Field
                          type="text"
                          id="units"
                          name="units"
                          disabled
                          value={products?.unit?.name}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="units" component="div" className="text-red-600 text-sm" />
                      </div>

                      {/* Weight Field */}
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

                      {/* Warp Colors Field */}
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

                      {/* Weft Colors Field */}
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="hsnCode" className="mb-2">Weft Colors</label>
                        <Field
                          type="text"
                          id="weft"
                          value={products?.weftColors}
                          name="weft"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="weft" component="div" className="text-red-600 text-sm" />
                      </div>

                      {/* Weave Field */}
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="hsnCode" className="mb-2">Weave</label>
                        <Field
                          type="text"
                          id="weave"
                          value={products?.weave}
                          name="weave"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="weave" component="div" className="text-red-600 text-sm" />
                      </div>

                      {/* Warp Yarn Field */}
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="hsnCode" className="mb-2">Warp Yarn</label>
                        <Field
                          type="text"
                          id="WarpYarn"
                          value={products?.warpYarn}
                          name="WarpYarn"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="WarpYarn" component="div" className="text-red-600 text-sm" />
                      </div>

                      {/* Weft Yarn Field */}
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="hsnCode" className="mb-2">Weft Yarn</label>
                        <Field
                          type="text"
                          id="WeftYarn"
                          value={products?.weftYarn}
                          name="WeftYarn"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="WeftYarn" component="div" className="text-red-600 text-sm" />
                      </div>

                      {/* Pic & Read Field */}
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="hsnCode" className="mb-2">Pic & Read</label>
                        <Field
                          type="text"
                          id="pic"
                          value={products?.pixAndReed}
                          name="pic"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="pic" component="div" className="text-red-600 text-sm" />
                      </div>

                      {/* Deying Cost Field */}
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="hsnCode" className="mb-2">Deying Cost</label>
                        <Field
                          type="text"
                          id="deying"
                          name="deying"
                          value={products?.dyeingCost}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="deying" component="div" className="text-red-600 text-sm" />
                      </div>

                      {/* Cost Field */}
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="hsnCode" className="mb-2">Cost</label>
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

                      {/* MRP Field */}
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="hsnCode" className="mb-2">MRP</label>
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

                      {/* Wholesale Price Field */}
                      <div className="flex-1 min-w-[300px] mt-4">
                        <label htmlFor="hsnCode" className="mb-2">Wholesale Price</label>
                        <Field
                          type="text"
                          disabled
                          id="wPrice"
                          name="wPrice"
                          value={products?.wholesalePrice}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage name="wPrice" component="div" className="text-red-600 text-sm" />
                      </div>
                    </div>

                    {/* Images Section */}
                    <div className="flex mt-5 gap-3">
                      <div className="flex-1 p-4 border-2 border-dashed rounded-md bg-gray-50 dark:bg-boxdark dark:border-strokedark flex flex-row">
                        <div className="flex flex-col grid-cols-3">
                          <div className="flex flex-row gap-4">
                            {products?.images?.map((ref, index) => (
                              <React.Fragment key={index}>
                                {ref.referenceImage != null && (
                                  <img
                                    className="h-20 w-20 transition-transform duration-500 ease-in-out transform group-hover:scale-[2] group-hover:shadow-2xl"
                                    crossOrigin="use-credentials"
                                    src={`${GET_IMAGE}/products/getimages/${ref.referenceImage}`}
                                    alt="Product Image"
                                  />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 p-4 border-2 border-dashed rounded-md bg-gray-50 dark:bg-boxdark dark:border-strokedark flex flex-row">
                        <div className="flex flex-col grid-cols-3">
                          <div className="flex flex-row gap-4">
                            {products?.images?.map((ref, index) => (
                              <React.Fragment key={index}>
                                {ref.actualImage != null && (
                                  <img
                                    className="h-20 w-20 transition-transform duration-500 ease-in-out transform group-hover:scale-[2] group-hover:shadow-2xl"
                                    crossOrigin="use-credentials"
                                    src={`${GET_IMAGE}/products/getimages/${ref.actualImage}`}
                                    alt="Product Image"
                                  />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Weaver/Embroider Field */}
                    <div className="mb-6">
                      <label className="mb-2.5 block text-black dark:text-black mt-7">Weaver/Embroider</label>
                      <Field
                        name="weiver"
                        value={products?.supplier?.name}
                        disabled
                        placeholder="Type your message"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-black dark:focus:border-primary"
                      />
                    </div>

                    {/* Weaver Code Field */}
                    <div className="mb-6">
                      <label className="mb-2.5 block text-black dark:text-black mt-7">Weaver Code</label>
                      <Field
                        disabled
                        value={products?.supplierCode?.supplierCode}
                        name="weiverCode"
                        placeholder="Type your message"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-black dark:focus:border-primary"
                      />
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
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

export default ModalUpdate;