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
import { FaTrash, FaPlus, FaExchangeAlt } from 'react-icons/fa';
import { MdContentCopy } from 'react-icons/md';

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
      await getprodId();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (Location) {
      const formattedOptions = Location.map(location => ({
        value: location?.id,
        label: `${location?.state} (${location.address})`,
        LocationObject: location,
        LocationId: { id: location.id },
      }));
      setSelectedLocation(formattedOptions);
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
  }]);

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

  const duplicateRow = (index) => {
    const rowToDuplicate = rows[index];
    setRows([...rows, {
      id: Date.now(),
      productId: rowToDuplicate.productId,
      location: rowToDuplicate.location,
      quantity: rowToDuplicate.quantity,
      transferQuantity: rowToDuplicate.transferQuantity,
      destinationLocation: rowToDuplicate.destinationLocation
    }]);
  };

  const removeRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    } else {
      toast.error("At least one row is required");
    }
  };

  const { currentstockJournel, handleSubmit, typeValues } = useStockJournel();

  // Create initialValues that preserves voucherNo
  const getInitialValues = () => ({
    voucherNo: "",
    stockJournals: rows.map(row => ({
      productId: row.productId,
      location: row.location,
      quantity: row.quantity,
      transferQuantity: row.transferQuantity,
      destinationLocation: row.destinationLocation
    }))
  });

  const [initialValues, setInitialValues] = useState(getInitialValues());

  // Update initialValues when rows change but preserve voucherNo
  useEffect(() => {
    setInitialValues(prev => ({
      voucherNo: prev.voucherNo, // Keep existing voucherNo
      stockJournals: rows.map(row => ({
        productId: row.productId,
        location: row.location,
        quantity: row.quantity,
        transferQuantity: row.transferQuantity,
        destinationLocation: row.destinationLocation
      }))
    }));
  }, [rows]);

  const validationSchema = Yup.object({
    voucherNo: Yup.string().required('Voucher Number is required'),
    stockJournals: Yup.array().of(
      Yup.object().shape({
        productId: Yup.object().required('Product is required'),
        location: Yup.object().required('Source Location is required'),
        quantity: Yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
        transferQuantity: Yup.number()
          .required('Transfer quantity is required')
          .min(1, 'Transfer quantity must be at least 1'),

        destinationLocation: Yup.object().required('Destination Location is required')
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
        setFieldValue(`stockJournals.${index}.quantity`, data.closingBalance);
        const updatedRows = [...rows];
        updatedRows[index].quantity = data.closingBalance;
        setRows(updatedRows);
      } else {
        toast.error(data.errorMessage || "Failed to fetch quantity");
      }
    } catch (error) {
      console.error("Error fetching quantity:", error);
      toast.error("An error occurred while fetching quantity");
    }
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    const formattedValues = rows.map((row, index) => ({
      product: { id: values.stockJournals[index]?.productId?.value },
      sourceLocation: { id: values.stockJournals[index]?.location?.value },
      transferQty: Number(values.stockJournals[index]?.transferQuantity),
      destinationLocation: { id: values.stockJournals[index]?.destinationLocation?.value }
    }));

    const formValues = {
      voucherNo: values?.voucherNo,
      transferProducts: formattedValues
    };

    try {
      const url = `${ADD_STOCKJOURNEL_URL}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formValues)
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Stock Journal created successfully`);
        // Reset form with empty rows but keep voucherNo if needed
        setRows([{
          id: Date.now(),
          productId: "",
          location: "",
          quantity: "",
          transferQuantity: "",
          destinationLocation: ""
        }]);
        resetForm({
          voucherNo: "",
          stockJournals: [{
            productId: "",
            location: "",
            quantity: "",
            transferQuantity: "",
            destinationLocation: ""
          }]
        });
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

  const getFilteredLocations = (index, currentProductId, allRows, allLocations) => {
    if (!currentProductId) return allLocations;

    const usedPairs = allRows
      .filter((_, i) => i !== index)
      .map(row => ({
        productId: row.productId?.value,
        locationId: row.location?.value
      }));

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
      <div className="p-4">
        <Formik
          initialValues={initialValues}
          enableReinitialize={false}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form>
              {/* Header Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-800/30 p-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary rounded-xl shadow">
                      <FaExchangeAlt className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-transparent bg-primary bg-clip-text">
                        Create Stock Journal
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Transfer products between locations
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-auto">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Voucher Number *
                    </label>
                    <div className="relative">
                      <Field
                        name="voucherNo"
                        type="text"
                        placeholder="Enter voucher number"
                        className="w-full md:w-64 pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/50 focus:outline-none transition-all"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <span className="text-gray-400">#</span>
                      </div>
                    </div>
                    <ErrorMessage name="voucherNo" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>
              </div>

              {/* Table Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Transfer Items
                      </h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium">
                        {rows.length} items
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={addRow}
                      className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow hover:shadow-lg"
                    >
                      <FaPlus className="w-4 h-4" />
                      Add Row
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                        <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Source Location
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Available Qty
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Transfer Qty
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Destination
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {rows.map((row, index) => {
                        const currentProductId = values.stockJournals[index]?.productId?.value;
                        const filteredLocations = getFilteredLocations(
                          index,
                          currentProductId,
                          rows,
                          selectedLocation
                        );

                        return (
                          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                            {/* Product Column */}
                            <td className="py-4 px-6">
                              <div className="w-48">
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

                                    const filteredLocs = getFilteredLocations(index, productId, rows, selectedLocation);
                                    if (locationId && !filteredLocs.some(loc => loc.value === locationId)) {
                                      setFieldValue(`stockJournals.${index}.location`, null);
                                      updatedRows[index].location = null;
                                      setRows(updatedRows);
                                    }
                                  }}
                                  options={prodIdOptions}
                                  styles={{
                                    ...customStyles,
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                    menu: (base) => ({ ...base, zIndex: 9999 }),
                                    container: (base) => ({ ...base, zIndex: 1 }),
                                    control: (base) => ({ ...base, zIndex: 1 }),
                                  }}
                                  menuPortalTarget={document.body}
                                  menuPosition="fixed"
                                  placeholder="Select product"
                                  isClearable
                                />
                                <ErrorMessage
                                  name={`stockJournals.${index}.productId`}
                                  component="div"
                                  className="text-red-500 text-xs mt-1"
                                />
                              </div>
                            </td>

                            {/* Source Location Column */}
                            <td className="py-4 px-6">
                              <div className="w-48">
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
                                  styles={{
                                    ...customStyles,
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                    menu: (base) => ({ ...base, zIndex: 9999 }),
                                    container: (base) => ({ ...base, zIndex: 1 }),
                                    control: (base) => ({ ...base, zIndex: 1 }),
                                  }}
                                  menuPortalTarget={document.body}
                                  menuPosition="fixed"
                                  placeholder="Select source"
                                  isClearable
                                  isOptionDisabled={(option) => {
                                    return rows.some((r, i) =>
                                      i !== index &&
                                      r.productId?.value === currentProductId &&
                                      r.location?.value === option.value
                                    );
                                  }}
                                />
                                <ErrorMessage
                                  name={`stockJournals.${index}.location`}
                                  component="div"
                                  className="text-red-500 text-xs mt-1"
                                />
                              </div>
                            </td>

                            {/* Available Quantity Column */}
                            <td className="py-4 px-6">
                              <div className="w-32">
                                <Field
                                  name={`stockJournals.${index}.quantity`}
                                  type="number"
                                  readOnly
                                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-center font-medium"
                                />
                              </div>
                            </td>

                            {/* Transfer Quantity Column */}
                            <td className="py-4 px-6">
                              <div className="w-32">
                                <div className="relative">
                                  <Field
                                    name={`stockJournals.${index}.transferQuantity`}
                                    type="number"
                                    min="1"
                                    placeholder="0"
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/50 focus:outline-none"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      // Update Formik state
                                      setFieldValue(`stockJournals.${index}.transferQuantity`, value);
                                      // Update local rows state
                                      const updatedRows = [...rows];
                                      updatedRows[index].transferQuantity = value;
                                      setRows(updatedRows);
                                    }}
                                    value={values.stockJournals[index]?.transferQuantity || ""}
                                  />
                                  {values.stockJournals[index]?.quantity > 0 && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      Max: {values.stockJournals[index]?.quantity || 0}
                                    </div>
                                  )}
                                </div>
                                <ErrorMessage
                                  name={`stockJournals.${index}.transferQuantity`}
                                  component="div"
                                  className="text-red-500 text-xs mt-1"
                                />

                              </div>
                            </td>

                            {/* Destination Column */}
                            <td className="py-4 px-6">
                              <div className="w-48">
                                <ReactSelect
                                  name={`stockJournals.${index}.destinationLocation`}
                                  value={selectedLocation.find(option =>
                                    option.value === values.stockJournals[index]?.destinationLocation?.value ||
                                    option.value === values.stockJournals[index]?.destinationLocation
                                  )}
                                  onChange={(option) => {
                                    setFieldValue(`stockJournals.${index}.destinationLocation`, option);
                                    const updatedRows = [...rows];
                                    updatedRows[index].destinationLocation = option;
                                    setRows(updatedRows);
                                  }}
                                  options={selectedLocation}
                                  styles={{
                                    ...customStyles,
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                    menu: (base) => ({ ...base, zIndex: 9999 }),
                                    container: (base) => ({ ...base, zIndex: 1 }),
                                    control: (base) => ({ ...base, zIndex: 1 }),
                                  }}
                                  menuPortalTarget={document.body}
                                  menuPosition="fixed"
                                  placeholder="Select destination"
                                  isClearable
                                />
                                <ErrorMessage
                                  name={`stockJournals.${index}.destinationLocation`}
                                  component="div"
                                  className="text-red-500 text-xs mt-1"
                                />
                              </div>
                            </td>

                            {/* Actions Column */}
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => duplicateRow(index)}
                                  className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                  title="Duplicate row"
                                >
                                  <MdContentCopy className="w-4 h-4" />
                                </button>
                                {rows.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeRow(row.id)}
                                    className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                    title="Delete row"
                                  >
                                    <FaTrash className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total transfer quantity: {rows.reduce((sum, row, index) =>
                        sum + (Number(values.stockJournals[index]?.transferQuantity) || 0), 0
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={addRow}
                        className="px-4 py-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      >
                        + Add Another Item
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          'Create Stock Journal'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Validation Summary */}
              {Object.keys(values.stockJournals || {}).some(index =>
                values.stockJournals[index]?.transferQuantity > values.stockJournals[index]?.quantity
              ) && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="font-medium">Warning:</span>
                      <span>Some transfer quantities exceed available stock</span>
                    </div>
                  </div>
                )}
            </Form>
          )}
        </Formik>
      </div>
    </DefaultLayout>
  );
};

export default AddStockJournell;