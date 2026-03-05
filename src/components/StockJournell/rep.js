import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ReactSelect from 'react-select';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import useStockJournel from '../../hooks/useStockJournel';
import { useSelector } from 'react-redux';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import useorder from '../../hooks/useOrder';

const AddStockJournell = () => {
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
    stockJournals: rows
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

  const onSubmit = (values) => {
    // Format the data as needed before submission
    const formattedValues = values.stockJournals.map(journal => ({
      productId: journal.productId,
      location: journal.location,
      quantity: journal.quantity,
      transferQuantity: journal.transferQuantity,
      destinationLocation: journal.destinationLocation
    }));
    console.log(formattedValues,"jjjjjjjj");
    
    handleSubmit(formattedValues); // Your existing submission handler
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName={"Stock Journal / Add Stock Journal"} />
      <div>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="flex flex-wrap justify-center gap-9">
                {/* ... other JSX ... */}
                <div className="flex flex-wrap gap-6 justify-center w-full">
                  <div className="flex-1 min-w-[300px] border border-stroke p-6.5 rounded-sm shadow-default bg-white dark:border-strokedark dark:bg-boxdark">
                    <div className="flex justify-end">
                      <button type="button" onClick={addRow}>Add New</button>
                    </div>
                    {values.stockJournals.map((row, index) => (
                      <div key={row.id} className="flex gap-6 mb-4">
                        <div className="flex-2 min-w-[150px]">
                          <label className="mb-2.5 block text-black dark:text-white">Product</label>
                          <Field
                            as="select"
                            name={`stockJournals.${index}.productId`}
                            className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                          >
                            <option value="">Select Product</option>
                            {prodIdOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage 
                            name={`stockJournals.${index}.productId`} 
                            component="div" 
                            className="text-red-600 text-sm" 
                          />
                        </div>

                        {/* Repeat similar structure for other fields */}
                        <div className="flex-2 min-w-[150px]">
                          <label className="mb-2.5 block text-black dark:text-white">Location</label>
                          <Field
                            as="select"
                            name={`stockJournals.${index}.location`}
                            className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                          >
                            <option value="">Select Location</option>
                            {selectedLocation.map(location => (
                              <option key={location.value} value={location.value}>
                                {location.label}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage 
                            name={`stockJournals.${index}.location`} 
                            component="div" 
                            className="text-red-600 text-sm" 
                          />
                        </div>

                        {/* Quantity field */}
                        <div className="flex-2 min-w-[150px]">
                          <label className="mb-2.5 block text-black dark:text-white">Quantity</label>
                          <Field
                            type="number"
                            name={`stockJournals.${index}.quantity`}
                            className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                          />
                          <ErrorMessage 
                            name={`stockJournals.${index}.quantity`} 
                            component="div" 
                            className="text-red-600 text-sm" 
                          />
                        </div>

                        {/* Transfer Quantity field */}
                        <div className="flex-2 min-w-[150px]">
                          <label className="mb-2.5 block text-black dark:text-white">Transfer Quantity</label>
                          <Field
                            type="number"
                            name={`stockJournals.${index}.transferQuantity`}
                            className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                          />
                          <ErrorMessage 
                            name={`stockJournals.${index}.transferQuantity`} 
                            component="div" 
                            className="text-red-600 text-sm" 
                          />
                        </div>

                        {/* Destination Location field */}
                        <div className="flex-2 min-w-[150px]">
                          <label className="mb-2.5 block text-black dark:text-white">Destination</label>
                          <Field
                            as="select"
                            name={`stockJournals.${index}.destinationLocation`}
                            className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                          >
                            <option value="">Select Destination</option>
                            {selectedLocation.map(location => (
                              <option key={location.value} value={location.value}>
                                {location.label}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage 
                            name={`stockJournals.${index}.destinationLocation`} 
                            component="div" 
                            className="text-red-600 text-sm" 
                          />
                        </div>

                        {values.stockJournals.length > 1 && (
                          <div className="flex items-center justify-center mt-2">
                            <button 
                              type="button" 
                              onClick={() => removeRow(row.id)}
                              className="text-red-500"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="flex justify-center mt-4 sm:ml-[300px] ml-[150px] items-center">
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
