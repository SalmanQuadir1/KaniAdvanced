import React, { useEffect, useState } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ReactSelect from 'react-select';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import useStockJournel from '../hooks/useStockJournel';
import { useSelector } from 'react-redux';
import { customStyles as createCustomStyles } from './utils';

const AddStockJournel = () => {
  const units = useSelector(state => state?.nonPersisted?.unit);
  const theme = useSelector(state => state?.persisted?.theme);
  const material = useSelector(state => state?.nonPersisted?.material);
  const location = useSelector(state => state?.nonPersisted?.location);

  const [sourceOptions, setSourceOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [filteredSourceMaterials, setFilteredSourceMaterials] = useState([]);
  const [filteredDestinationMaterials, setFilteredDestinationMaterials] = useState([]);
  const [selectedSourceType, setSelectedSourceType] = useState(null);
  const [selectedDestinationType, setSelectedDestinationType] = useState(null);

  useEffect(() => {
    if (material?.data) {
      const formattedOptions = material.data.map(material => ({
        value: material.id,
        label: material.name,
        unitObject: material,
      }));
      setSourceOptions(formattedOptions);
      setDestinationOptions(formattedOptions);
    }
  }, [material?.data]);

  useEffect(() => {
    if (location?.data) {
      const formattedOptions = location.data.map(location => ({
        value: location.id,
        label: location.address,
        unitObject: location,
      }));
      setLocationOptions(formattedOptions);
    }
  }, [location?.data]);

  useEffect(() => {
    if (selectedSourceType && material?.data) {
      const filtered = material.data.filter(mat => mat.materialType === selectedSourceType.value);
      const formattedFilteredMaterials = filtered.map(material => ({
        value: material.id,
        label: material.description,
        unitObject: material,
      }));
      setFilteredSourceMaterials(formattedFilteredMaterials);
    } else {
      setFilteredSourceMaterials([]);
    }
  }, [selectedSourceType, material?.data]);

  useEffect(() => {
    if (selectedDestinationType && material?.data) {
      const filtered = material.data.filter(mat => mat.materialType === selectedDestinationType.value);
      const formattedFilteredMaterials = filtered.map(material => ({
        value: material.id,
        label: material.description,
        unitObject: material,
      }));
      setFilteredDestinationMaterials(formattedFilteredMaterials);
    } else {
      setFilteredDestinationMaterials([]);
    }
  }, [selectedDestinationType, material?.data]);

  const { currentstockJournel, handleSubmit, typeValues } = useStockJournel();

  const validationSchema = Yup.object({
    sourceType: Yup.object().nullable().required('Field is required'),
    sourceMaterial: Yup.object().nullable().required('Field is required'),
    sourceLocation: Yup.object().nullable().required('Field is required'),
    sourceQuantity: Yup.number().required('Field is required'),
    sourcePrice: Yup.number().required('Field is required'),
    destinationType: Yup.object().nullable().required('Field is required'),
    destinationMaterial: Yup.object().nullable().required('Field is required'),
    destinationLocation: Yup.object().nullable().required('Field is required'),
    destinationQuantity: Yup.number().required('Field is required'),
    destinationPrice: Yup.number().required('Field is required'),
    additionalCharges: Yup.number().required('Field is required'),
  });

  const customStyles = createCustomStyles(theme?.mode);

  const handleSourceTypeChange = (option, setFieldValue) => {
    setSelectedSourceType(option);
    setFieldValue('sourceType', option);
    setFieldValue('sourceMaterial', null);
  };

  const handleDestinationTypeChange = (option, setFieldValue) => {
    setSelectedDestinationType(option);
    setFieldValue('destinationType', option);
    setFieldValue('destinationMaterial', null);
  };

  const FormFieldsLeft = ({ values, setFieldValue }) => (
    <div className="flex-1 min-w-[300px] border border-stroke p-6.5 rounded-sm shadow-default bg-white dark:border-strokedark dark:bg-boxdark">
      <h1 className='text-center text-white text-2xl mb-6 font-bold'>Source</h1>
      <div className="mb-4.5 flex flex-wrap gap-6">
        <div className="flex-1 min-w-[300px]">
          <label className="mb-2.5 block text-black dark:text-white"> Source Type</label>
          <ReactSelect
            name="sourceType"
            options={typeValues}
            value={values.sourceType}
            onChange={(option) => handleSourceTypeChange(option, setFieldValue)}
            styles={customStyles}
            className="bg-white dark:bg-form-input"
            classNamePrefix="react-select"
            placeholder="Select Material Type"
          />
          <ErrorMessage name="sourceType" component="div" className="text-red-600 text-sm" />
        </div>
        <div className="flex-1 min-w-[300px]">
          <label className="mb-2.5 block text-black dark:text-white">Material</label>
          <ReactSelect
            name="sourceMaterial"
            options={filteredSourceMaterials}
            value={values.sourceMaterial}
            onChange={(option) => setFieldValue('sourceMaterial', option)}
            styles={customStyles}
            className="bg-white dark:bg-form-input"
            classNamePrefix="react-select"
            placeholder="Select Material"
          />
          <ErrorMessage name="sourceMaterial" component="div" className="text-red-600 text-sm" />
        </div>
        <div className="flex-1 min-w-[300px]">
          <label className="mb-2.5 block text-black dark:text-white">Location</label>
          <ReactSelect
            name="sourceLocation"
            options={locationOptions}
            value={values.sourceLocation}
            onChange={(option) => setFieldValue('sourceLocation', option)}
            styles={customStyles}
            className="bg-white dark:bg-form-input"
            classNamePrefix="react-select"
            placeholder="Select Source Location"
          />
          <ErrorMessage name="sourceLocation" component="div" className="text-red-600 text-sm" />
        </div>
        <div className="flex-1 min-w-[300px]">
          <label className="mb-2.5 block text-black dark:text-white">Quantity</label>
          <Field
            type="number"
            name="sourceQuantity"
            placeholder="Enter Source Quantity"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          <ErrorMessage name="sourceQuantity" component="div" className="text-red-600 text-sm" />
        </div>
        <div className="flex-1 min-w-[300px]">
          <label className="mb-2.5 block text-black dark:text-white">Price</label>
          <Field
            type="number"
            name="sourcePrice"
            placeholder="Enter Source Price"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            onChange={(e) => {
              setFieldValue('sourcePrice', e.target.value);
              setFieldValue('destinationPrice', parseFloat(e.target.value) + parseFloat(values.additionalCharges || 0));
            }}
          />
          <ErrorMessage name="sourcePrice" component="div" className="text-red-600 text-sm" />
        </div>
      </div>
    </div>
  );

  const FormFieldsRight = ({ values, setFieldValue }) => (
    <div className="flex-1 min-w-[300px] border border-stroke p-6.5 rounded-sm shadow-default bg-white dark:border-strokedark dark:bg-boxdark">
      <h1 className='text-center text-white text-2xl mb-6 font-bold'>Destination</h1>
      <div className="mb-4.5 flex flex-wrap gap-6">
        <div className="flex-1 min-w-[300px]">
          <label className="mb-2.5 block text-black dark:text-white"> Destination Type</label>
          <ReactSelect
            name="destinationType"
            options={typeValues}
            value={values.destinationType}
            onChange={(option) => handleDestinationTypeChange(option, setFieldValue)}
            styles={customStyles}
            className="bg-white dark:bg-form-input"
            classNamePrefix="react-select"
            placeholder="Select Material Type"
          />
          <ErrorMessage name="destinationType" component="div" className="text-red-600 text-sm" />
        </div>
        <div className="flex-1 min-w-[300px]">
          <label className="mb-2.5 block text-black dark:text-white">Material</label>
          <ReactSelect
            name="destinationMaterial"
            options={filteredDestinationMaterials}
            value={values.destinationMaterial}
            onChange={(option) => setFieldValue('destinationMaterial', option)}
            styles={customStyles}
            className="bg-white dark:bg-form-input"
            classNamePrefix="react-select"
            placeholder="Select Material"
          />
          <ErrorMessage name="destinationMaterial" component="div" className="text-red-600 text-sm" />
        </div>
        <div className="flex-1 min-w-[300px]">
          <label className="mb-2.5 block text-black dark:text-white">Location</label>
          <ReactSelect
            name="destinationLocation"
            options={locationOptions}
            value={values.destinationLocation}
            onChange={(option) => setFieldValue('destinationLocation', option)}
            styles={customStyles}
            className="bg-white dark:bg-form-input"
            classNamePrefix="react-select"
            placeholder="Select Location"
          />
          <ErrorMessage name="destinationLocation" component="div" className="text-red-600 text-sm" />
        </div>
        <div className="flex-1 min-w-[300px]">
          <label className="mb-2.5 block text-black dark:text-white">Quantity</label>
          <Field
            type="number"
            name="destinationQuantity"
            placeholder="Enter destination Quantity"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          <ErrorMessage name="destinationQuantity" component="div" className="text-red-600 text-sm" />
        </div>
        <div className="flex-1 min-w-[300px]">
          <label className="mb-2.5 block text-black dark:text-white">Price</label>
          <Field
            type="number"
            name="destinationPrice"
            placeholder="Enter Destination Price"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            readOnly
          />
          <ErrorMessage name="destinationPrice" component="div" className="text-red-600 text-sm" />
        </div>
        <div className="flex-1 min-w-[300px]">
          <label className="mb-2.5 block text-black dark:text-white">Additional Charges</label>
          <Field
            type="number"
            name="additionalCharges"
            placeholder="Enter Additional Price"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            onChange={(e) => {
              setFieldValue('additionalCharges', e.target.value);
              setFieldValue('destinationPrice', parseFloat(values.sourcePrice || 0) + parseFloat(e.target.value));
            }}
          />
          <ErrorMessage name="additionalCharges" component="div" className="text-red-600 text-sm" />
        </div>
      </div>
    </div>
  );

  const onSubmit = (values) => {
    const formattedValues = {
      sourceMaterial: { id: values.sourceMaterial.value },
      sourceLocation: { id: values.sourceLocation.value },
      sourceQuantity: values.sourceQuantity,
      sourcePrice: values.sourcePrice,
      destinationMaterial: { id: values.destinationMaterial.value },
      destinationLocation: { id: values.destinationLocation.value },
      destinationQuantity: values.destinationQuantity,
      destinationPrice: parseFloat(values.sourcePrice) + parseFloat(values.additionalCharges),
      additionalCharges: values.additionalCharges,
    };
    handleSubmit(formattedValues);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName={"Stock Journal / Add Stock Journal"} />
      <div>
        <Formik
          initialValues={currentstockJournel}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <div className="flex flex-wrap gap-9">
                <div className="flex-1">
                  <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                    Add Stock Journal
                  </h3>
                </div>
                <div className="flex flex-wrap gap-6">
                  <FormFieldsLeft values={values} setFieldValue={setFieldValue} />
                  <FormFieldsRight values={values} setFieldValue={setFieldValue} />
                </div>
                <div className="flex justify-center mt-4 sm:ml-[300px] ml-[150px] items-center">
                <button type="submit" className="flex w-[300px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-4">
                  Add Stock Journal
                </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </DefaultLayout>
  );
};

export default AddStockJournel;
