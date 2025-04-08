import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ReactSelect from 'react-select';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import useStockJournel from '../../hooks/useStockJournel';
import { useSelector } from 'react-redux';
import { ADD_STOCKJOURNEL_URL, GET_QUANTITY, customStyles as createCustomStyles } from '../../Constants/utils';
import useorder from '../../hooks/useOrder';
import { toast } from 'react-toastify';

const AddStockJournell = () => {
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const units = useSelector(state => state?.nonPersisted?.unit);

  const [isLoading, setIsLoading] = useState(false);
  const [prodIdOptions, setProdIdOptions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const theme = useSelector(state => state?.persisted?.theme);
  const customStyles = createCustomStyles(theme?.mode);
  const { getprodId, productId, getLocation, Location } = useorder();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Set loading to true when data starts loading
      await getprodId();
      setIsLoading(false);
      // Set loading to false once data is loaded
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (Location) {
      const formattedOptions = Location.map(location => ({
        value: location?.id,
        label: `${location?.state}(${location.address})`,
        LocationObject: location,
        LocationId: { id: location.id },
      }));
      setSelectedLocation(formattedOptions); // Set Location when page loads
    }
  }, [Location]);

  useEffect(() => {
    getLocation();
  }, []);

  const [rows, setRows] = useState([{
    id: Date.now(),
    productId: "",
    location: "",
    quantity: "",
    transferQuantity: "",
    destinationLocation: ""
  }]); // Initial row, can be customized

  const addRow = () => {
    setRows([...rows, {
      id: Date.now(),
      productId: "",
      location: "",
      quantity: "",
      transferQuantity: "",
      destinationLocation: ""
    }]);
  };

  const removeRow = (id) => {
    setRows(rows.filter(row => row.id !== id)); // Remove row by ID
  };

  const { currentstockJournel, handleSubmit, typeValues } = useStockJournel();
  const initialValues = {
    voucherNo: "",
    stockJournals: rows.map(row => ({
      productId: row.productId,
      location: row.location,
      quantity: row.quantity,
      transferQuantity: row.transferQuantity,
      destinationLocation: row.destinationLocation
    }))
  };

  const validationSchema = Yup.object({
    stockJournals: Yup.array().of(
      Yup.object().shape({
        productId: Yup.string().required('Product is required'),
        location: Yup.string().required('Location is required'),
        quantity: Yup.number().required('Quantity is required'),
        transferQuantity: Yup.number().required('Transfer quantity is required'),
        destinationLocation: Yup.string().required('Destination is required')
      })
    )
  });


  useEffect(() => {
    if (productId) {
      const formattedProdIdOptions = productId?.map(prodId => ({
        value: prodId.id,
        label: prodId?.productId,
        prodIdObject: prodId,
        prodId: prodId.id,
      }));
      setProdIdOptions(formattedProdIdOptions);
    }
  }, [productId]);
  const fetchQuantityForRow = async (index, productId, locationId, setFieldValue) => {
    if (!productId || !locationId) return;
    console.log("quantity====", productId, locationId);

    try {
      const response = await fetch(GET_QUANTITY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: productId,
          locationId: locationId
        })
      });

      const data = await response.json();
      if (response.ok) {
        setFieldValue(`stockJournals.${index}.quantity`, data.closingBalance
        );

        const updatedRows = [...rows];
        updatedRows[index].quantity = data.closingBalance
          ;
        setRows(updatedRows);
      } else {
        toast.error(data.errorMessage || "Failed to fetch quantity");
      }
    } catch (error) {
      console.error("Error fetching quantity:", error);
      toast.error("An error occurred while fetching quantity");
    }
  };

  const onSubmit = async (values) => {
    // Map through the rows to get the complete data including IDs
    const formattedValues = rows.map((row, index) => ({
      // id: row.id, // Include the row ID
      product: { id: values.stockJournals[index]?.productId?.value || values.stockJournals[index]?.productId },
      sourceLocation: { id: values.stockJournals[index]?.location?.value || values.stockJournals[index]?.location },
      transferQty: values.stockJournals[index]?.transferQuantity, 
      inventoryQty: Number(values.stockJournals[index]?.quantity), // this quanity is inventory quantity
      destinationLocation: { id: values.stockJournals[index]?.destinationLocation?.value || values.stockJournals[index]?.destinationLocation }
    }));

    const formValues = {
      voucherNo: values.voucherNo,
      transferProducts: formattedValues
    }
    try {
      const url = `${ADD_STOCKJOURNEL_URL}`;
      const method = "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formValues)
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Product Transfered successfully`);
       
        resetForm();

        // getSize(pagination.currentPage); // Fetch updated Size
      } else {
        toast.error(`${data.errorMessage}`);
      }
    } catch (error) {
      console.error(error, response);
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }

    console.log(formValues, "jjhhjjhh"); // Verify the output
    handleSubmit(formattedValues);
  };
  const getFilteredLocations = (index, currentProductId, allRows, allLocations) => {
    if (!currentProductId) return allLocations;

    // Get all product-location pairs from other rows
    const usedPairs = allRows
      .filter((_, i) => i !== index)
      .map(row => ({
        productId: row.productId?.value,
        locationId: row.location?.value
      }));

    // Filter out locations that are already paired with this product in other rows
    return allLocations.filter(location =>
      !usedPairs.some(pair =>
        pair.productId === currentProductId &&
        pair.locationId === location.value
      )
    );
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName={"Stock Journal / Add Stock Journal"} />
      <div>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          // validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ setFieldValue, values }) => (
            // useEffect(() => {
            //   const getQuantity = async () => {

            //     try {
            //         const url =  GET_QUANTITY;
            //         const method ="POST";

            //         const response = await fetch(url, {
            //             method: method,
            //             headers: {
            //                 "Content-Type": "application/json",
            //                 "Authorization": `Bearer ${token}`
            //             },
            //             body: JSON.stringify(values)
            //         });

            //         const data = await response.json();
            //         if (response.ok) {

            //             // getStyle(pagination.currentPage); // Fetch updated Style
            //         } else {
            //             toast.error(`${data.errorMessage}`);
            //         }
            //     } catch (error) {
            //         console.error(error, response);
            //         toast.error("An error occurred");
            //     } finally {
            //         setSubmitting(false);
            //     }
            // };


            // }, [])

            <Form>
              <div className="flex flex-wrap justify-center gap-9">


                <div className="flex flex-wrap gap-6 justify-center w-full">

                  <div className="flex-1 min-w-[300px] border border-stroke p-6.5 rounded-sm shadow-default bg-white dark:border-strokedark dark:bg-boxdark">
                    <div className="flex-1">
                      <h3 className=" text-slate-500 text-center text-2xl font-semibold dark:text-white">
                        Add Stock Journal
                      </h3>
                    </div>
                    <div className="flex justify-end">
                      <button type='button' className=" bg-red-700 justify-end text-white rounded-md text-sm w-20 h-8" onClick={addRow}>Add New</button>
                    </div>
                    <div className="flex flex-col items-center justify-center mb-3">  {/* Added flex-col and centered */}
                      <label className="mb-2.5 block text-black dark:text-white text-center">Voucher Number</label>  {/* Added text-center */}
                      <div className="flex justify-center w-full">  {/* Wrapper div for centering the input */}
                        <Field
                          name="voucherNo"
                          type="number"
                          placeholder="Voucher Number"
                          className="bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary w-[200px]"  // Removed justify-center and items-center
                        />
                      </div>
                      <ErrorMessage name='voucherNo' component="div" className="text-red-600 text-sm text-center" />  {/* Added text-center */}
                    </div>
                    {rows.map((row, index) => {
                      const currentProductId = values.stockJournals[index]?.productId?.value;
                      const filteredLocations = getFilteredLocations(
                        index,
                        currentProductId,
                        rows,
                        selectedLocation
                      );

                      return (
                        <div key={row.id} className="flex gap-6 mb-4">
                          <div className="flex-2 min-w-[140px]">
                            <label className="mb-2.5 block text-black dark:text-white">Product</label>
                            <ReactSelect
                              name={`stockJournals.${index}.productId`}
                              value={prodIdOptions.find(option =>
                                option.value === values.stockJournals[index]?.productId?.value ||
                                option.value === values.stockJournals[index]?.productId
                              )}
                              onChange={(option) => {
                                const productId = option?.value;
                                setFieldValue(`stockJournals.${index}.productId`, option);
                                const updatedRows = [...rows];
                                updatedRows[index].productId = option;
                                setRows(updatedRows);

                                const locationId = values.stockJournals[index]?.location?.value;
                                if (productId && locationId) {
                                  fetchQuantityForRow(index, productId, locationId, setFieldValue);
                                }

                                // Clear location if it becomes invalid for the new product
                                const filteredLocs = getFilteredLocations(index, productId, rows, selectedLocation);
                                if (locationId && !filteredLocs.some(loc => loc.value === locationId)) {
                                  setFieldValue(`stockJournals.${index}.location`, null);
                                  updatedRows[index].location = null;
                                  setRows(updatedRows);
                                }
                              }}
                              options={prodIdOptions}
                              styles={customStyles}
                              placeholder="Product"
                              isClearable
                            />
                            <ErrorMessage name={`productId-${index}`} component="div" className="text-red-600 text-sm" />
                          </div>

                          <div className="flex-2 min-w-[140px]">
                            <label className="mb-2.5 block text-black dark:text-white">Source Location</label>
                            <ReactSelect
                              name={`stockJournals.${index}.location`}
                              value={selectedLocation.find(option =>
                                option.value === values.stockJournals[index]?.location?.value ||
                                option.value === values.stockJournals[index]?.location
                              )}
                              onChange={(option) => {
                                const locationId = option?.value;
                                setFieldValue(`stockJournals.${index}.location`, option);
                                const updatedRows = [...rows];
                                updatedRows[index].location = option;
                                setRows(updatedRows);

                                const productId = values.stockJournals[index]?.productId?.value;
                                if (productId && locationId) {
                                  fetchQuantityForRow(index, productId, locationId, setFieldValue);
                                }
                              }}
                              options={filteredLocations}
                              styles={customStyles}
                              placeholder="Source"
                              isClearable
                              isOptionDisabled={(option) => {
                                // Disable if this product-location pair exists in other rows
                                return rows.some((r, i) =>
                                  i !== index &&
                                  r.productId?.value === currentProductId &&
                                  r.location?.value === option.value
                                );
                              }}
                            />
                            <ErrorMessage name={`location-${index}`} component="div" className="text-red-600 text-sm" />
                          </div>

                          <div className="flex-2 min-w-[140px]">
                            <label className="mb-2.5 block text-black dark:text-white">Quantity</label>
                            <Field
                              name={`stockJournals.${index}.quantity`}
                              type="number"
                              placeholder="Will auto-fill"
                              className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                              readOnly // Make it read-only since it's auto-filled
                            />
                            <ErrorMessage name={`quantity-${index}`} component="div" className="text-red-600 text-sm" />
                          </div>

                          <div className="flex-2 min-w-[140px]">
                            <label className="mb-2.5 block text-black dark:text-white">Transfer quantity</label>
                            <Field
                              name={`stockJournals.${index}.transferQuantity`}
                              type="number"
                              placeholder="Transfer Quantity"
                              className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                              onChange={(e) => {
                                // Update local rows state
                                const updatedRows = [...rows];
                                updatedRows[index].transferQuantity = e.target.value;
                                setRows(updatedRows);
                              }}
                            />
                            <ErrorMessage name={`transferQuantity-${index}`} component="div" className="text-red-600 text-sm" />
                          </div>

                          <div className="flex-2 min-w-[140px]">
                            <label className="mb-2.5 block text-black dark:text-white">Dest. Location</label>
                            <ReactSelect
                              name={`stockJournals.${index}.destinationLocation`}
                              value={selectedLocation.find(option =>
                                option.value === values.stockJournals[index]?.destinationLocation?.value ||
                                option.value === values.stockJournals[index]?.destinationLocation
                              )}
                              onChange={(option) => {
                                setFieldValue(`stockJournals.${index}.destinationLocation`, option);
                                // Update local rows state
                                const updatedRows = [...rows];
                                updatedRows[index].destinationLocation = option;
                                setRows(updatedRows);
                              }}
                              options={selectedLocation}
                              styles={customStyles}
                              placeholder="Destination"
                              isClearable
                            />
                            <ErrorMessage name={`locationDestination-${index}`} component="div" className="text-red-600 text-sm" />
                          </div>

                          {/* Delete Button for each row, conditionally render based on index */}
                          {index !== 0 && (
                            <div className="flex items-center justify-center mt-2">
                              <button type="button" onClick={() => removeRow(row?.id)} className="text-red-500">
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                    <div className="flex justify-center mt-4   items-center">
                      <button type="submit" className="flex w-[300px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-4">
                        Add Stock Journal
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


export default AddStockJournell;
