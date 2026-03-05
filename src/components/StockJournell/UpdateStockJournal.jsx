import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ReactSelect from 'react-select';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import useStockJournel from '../../hooks/useStockJournel';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GET_STOCK_URL, GET_STOCKBYID_URL, UPDATE_STOCK_URL } from '../../Constants/utils';
import { customStyles as createCustomStyles } from '../../Constants/utils';

const UpdateStockJournal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const units = useSelector(state => state?.nonPersisted?.unit);
  const theme = useSelector(state => state?.persisted?.theme);
  const material = useSelector(state => state?.nonPersisted?.material);
  const location = useSelector(state => state?.nonPersisted?.location);
  const [initialStatus, setInitialStatus] = useState('');


  const { typeValues, handleUpdateSubmit } = useStockJournel();


  
  const stockId = id;
  const [stockJournal, setStockJournal] = useState(null);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [filteredSourceMaterials, setFilteredSourceMaterials] = useState([]);
  const [filteredDestinationMaterials, setFilteredDestinationMaterials] = useState([]);
  const [selectedSourceType, setSelectedSourceType] = useState(null);
  const [selectedDestinationType, setSelectedDestinationType] = useState(null);
  const [journalStatus, setJournalStatus] = useState([]);
  const [approvalStatus, setApprovalStatus] = useState('Approved'); // or 'Rejected'

  const { currentUser } = useSelector((state) => state?.persisted?.user);

  const { token } = currentUser;

  console.log(stockId, "stockkkkkkkkkkkkk");
  useEffect(() => {
    if (material?.data) {
      const formattedOptions = material.data.map(material => ({
        value: material.id,
        label: material.description,
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

  useEffect(() => {
    const fetchStockJournal = async () => {

      try {
        const response = await fetch(`${GET_STOCKBYID_URL}/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch stock journal data');
        }

        const data = await response.json();
        console.log('Fetched Stock Journal Data:', data);
        setStockJournal(data);
      } catch (error) {
        console.error('Error fetching stock journal:', error);
        toast.error('Failed to fetch stock journal data');
      }
    };

    fetchStockJournal();
  }, [id, token]);

// console.log(stockJournal.journalStatus,"heyyyyyyyy");


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
  const journalStatusOptions = [
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'Created', label: 'Created' }

  ];

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
  useEffect(() => {
    setInitialStatus(stockJournal?.journalStatus)
   
  }, [stockJournal?.journalStatus])
  

  const FormFieldsLeft = ({ values, setFieldValue }) => (
    <div className="flex-1 min-w-[300px] border border-stroke p-6.5 rounded-sm shadow-default bg-white dark:border-strokedark dark:bg-boxdark">
      <h1 className='text-center text-white text-2xl mb-6 font-bold'>Source</h1>
      <div className="mb-4.5 flex flex-wrap gap-6">
        {/* <div className="flex-1 min-w-[300px]">
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
        </div> */}
        <div className="flex-1 min-w-[300px]">
          <label className="mb-3 block text-black">Source Type</label>
          <ReactSelect
            name="sourceType"
            options={typeValues}
            styles={customStyles}

            // value={values.sourceType}
            value={typeValues.find(option => option.value === values.sourceMaterial.materialType)}
            // onChange={(value) => {
            //   setFieldValue('sourceType', value);
            //   setSelectedSourceType(value);
            //   setFieldValue('sourceMaterialId', null); // Reset material if type changes
            // }}
            onChange={(option) => setFieldValue('sourceMaterial', option)}
            isDisabled={true}
          />
          <ErrorMessage name="sourceType" component="div" className="text-danger" />
        </div>


        <div className="flex-1 min-w-[300px]">
          <label className="mb-2.5 block text-black dark:text-white">Material</label>
          <ReactSelect
            name="sourceMaterial"
            value={sourceOptions.find(option => option.value === values.sourceMaterial.id)}
            options={filteredSourceMaterials}
            onChange={(option) => setFieldValue('sourceMaterial', option)}
            isDisabled={true}
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
            value={locationOptions.find(option => option.value === values.sourceLocation.id)}
            // value={values.sourceLocation}
            onChange={(option) => setFieldValue('sourceLocation', option)}
            isDisabled={true}
            styles={customStyles}
            className="bg-white dark:bg-form-input"
            classNamePrefix="react-select"
            placeholder="Select Source Location"
          />
          <ErrorMessage name="sourceLocation" component="div" className="text-red-600 text-sm" />
        </div>
        {/* <div className="flex-1 min-w-[300px]">
          <label className="mb-2.5 block text-black dark:text-white">Quantity</label>
          <Field
            type="number"
            name="sourceQuantity"
            placeholder="Enter Source Quantity"
            readOnly
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          <ErrorMessage name="sourceQuantity" component="div" className="text-red-600 text-sm" />
        </div> */}
        <div className="flex-1 min-w-[300px]">
          <label className="mb-2.5 block text-black dark:text-white">Quantity</label>
          <Field
            type="number"
            name="sourceQuantity"
            placeholder="Enter Source Quantity"
            readOnly={values.journalStatus === 'Approved'}
            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition ${values.journalStatus === 'Approved' ? 'cursor-not-allowed bg-gray-100' : 'focus:border-primary active:border-primary'
              } disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
          />
          <ErrorMessage name="sourceQuantity" component="div" className="text-red-600 text-sm" />
        </div>


        <div className="flex-1 min-w-[300px]">
          <label className="mb-2.5 block text-black dark:text-white">Price</label>
          <Field
            type="number"
            name="sourcePrice"
            placeholder="Enter Source Price"
            readOnly={values.journalStatus === 'Approved'}
            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition ${values.journalStatus === 'Approved' ? 'cursor-not-allowed bg-gray-100' : 'focus:border-primary active:border-primary'
              } disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}

            //className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            onChange={(e) => {
              setFieldValue('sourcePrice', e.target.value);
              setFieldValue('destinationPrice', parseFloat(e.target.value) + parseFloat(values.additionalCharges || 0));
            }}
          />
          <ErrorMessage name="sourcePrice" component="div" className="text-red-600 text-sm" />
        </div>
        <div className="flex-1 min-w-[300px]">
          <label className="block text-sm font-medium text-gray-700">Journal Status</label>
          {/* <input
          type="text"
          name="journalStatus"
          value={values.journalStatus}
          onChange={(e) => setFieldValue('journalStatus', e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        /> */}
          <ReactSelect
            name="journalStatus"
            options={journalStatusOptions}
            value={journalStatusOptions.find(option => option.value === values.journalStatus)}
            onChange={(option) => setFieldValue('journalStatus', option.value)}
            styles={customStyles}
            className="bg-white dark:bg-form-input"
            classNamePrefix="react-select"
             isDisabled={initialStatus == "Approved"}
            placeholder="Select Journal Status"
          />
          <ErrorMessage name="journalStatus" component="div" className="text-red-600 text-sm" />
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
            // value={values.destinationType}
            value={typeValues.find(option => option.value === values.destinationMaterial.materialType)}
            // onChange={(option) => handleDestinationTypeChange(option, setFieldValue)}
            // onChange={(value) => {
            //   setFieldValue('destinationType', value);
            //   setSelectedDestinationType(value);
            //   setFieldValue('destinationMaterialId', null); // Reset material if type changes
            // }}
            onChange={(option) => setFieldValue('destinationMaterial', option)}
            isDisabled={true}

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
            value={destinationOptions.find(option => option.value === values.destinationMaterial.id)}
            onChange={(option) => setFieldValue('destinationMaterial', option)}
            isDisabled={true}
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
            value={locationOptions.find(option => option.value === values.destinationLocation.id)}
            onChange={(option) => setFieldValue('destinationLocation', option)}
            isDisabled={true}
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
            readOnly={values.journalStatus === 'Approved'}
            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition ${values.journalStatus === 'Approved' ? 'cursor-not-allowed bg-gray-100' : 'focus:border-primary active:border-primary'
              } disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}

            placeholder="Enter destination Quantity"
           
          />
          <ErrorMessage name="destinationQuantity" component="div" className="text-red-600 text-sm" />
        </div>
        <div className="flex-1 min-w-[300px]">
          <label className="mb-2.5 block text-black dark:text-white">Price</label>
          <Field
            type="number"
            name="destinationPrice"
            placeholder="Enter Destination Price"

            //className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            readOnly={values.journalStatus === 'Approved'}
            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition ${values.journalStatus === 'Approved' ? 'cursor-not-allowed bg-gray-100' : 'focus:border-primary active:border-primary'
              } disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
          />
          <ErrorMessage name="destinationPrice" component="div" className="text-red-600 text-sm" />
        </div>
        <div className="flex-1 min-w-[300px]">
          <label className="mb-2.5 block text-black dark:text-white">Additional Charges</label>
          <Field
            type="number"
            name="additionalCharges"
            placeholder="Enter Additional Price"
            readOnly={values.journalStatus === 'Approved'}
            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition ${values.journalStatus === 'Approved' ? 'cursor-not-allowed bg-gray-100' : 'focus:border-primary active:border-primary'
              } disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}

           
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

  const onSubmit = async (values) => {
    console.log("i am clicked");
    console.log(values, "from frontttt");

    const formattedValues = {
      stockId: stockId,
      sourceMaterial: { id: values.sourceMaterial.id },
      sourceLocation: { id: values?.sourceLocation?.value },
      sourceQuantity: values.sourceQuantity,
      sourcePrice: values.sourcePrice,
      destinationMaterial: { id: values.destinationMaterial.id },
      destinationLocation: { id: values.destinationLocation.id },
      destinationQuantity: values.destinationQuantity,
      destinationPrice: parseFloat(values.sourcePrice) + parseFloat(values.additionalCharges),
      additionalCharges: values.additionalCharges,
      journalStatus: values.journalStatus,
    };
    handleUpdateSubmit(formattedValues);

    // try {
    //   const response = await fetch(`${UPDATE_STOCK_URL}/${id}`, {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${token}`
    //     },
    //     body: JSON.stringify(formattedValues)
    //   });

    //   if (!response.ok) {
    //     const errorData = await response.json(); // Optionally parse error response if available
    //     throw new Error(`Failed to update stock journal: ${errorData.message}`);
    //   }

    //   const data = await response.json();
    //   toast.success('Stock journal updated successfully');
    //   navigate(`/stock-journal/${id}`);
    // } catch (error) {
    //   console.error('Error updating stock journal:', error);
    //   toast.error('Failed to update stock journal');
    // } finally {
    //   setSubmitting(false); // Ensure form is not stuck in submitting state
    // }
  };


  if (!stockJournal) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName={"Stock Journal / Update Stock Journal"} />
        <div>Loading...</div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName={"Stock Journal / Update Stock Journal"} />
      <div>
        <Formik
          initialValues={stockJournal}
          enableReinitialize={false}

          onSubmit={onSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <div className="flex flex-wrap gap-9">
                <div className="flex-1">
                  <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                    Update Stock Journal
                  </h3>
                </div>
                <div className="flex flex-wrap gap-6">
                  <FormFieldsLeft values={values} setFieldValue={setFieldValue} />
                  <FormFieldsRight values={values} setFieldValue={setFieldValue} />
                </div>
                <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-4"
                  disabled={isSubmitting}
                >
                  Update Stock Journal
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </DefaultLayout>
  );
};

export default UpdateStockJournal;
