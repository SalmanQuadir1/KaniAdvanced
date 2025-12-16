import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { ErrorMessage, Field, Form, Formik, useFormik } from 'formik';
import ReactSelect from 'react-select';
import * as Yup from 'yup';
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import useCustomer from '../../hooks/useCustomer';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { UPDATE_CUSTOMER_URL } from "../../Constants/utils";
import { toast } from 'react-toastify';

const UpdateCustomer = () => {


  const customerGroup = useSelector(
    (state) => state?.nonPersisted?.customerGroup,
  );
  const navigate = useNavigate();
  const [customerGroupList, setCustomerGroupList] = useState([]);
  const { seloptions, groups, GetCustomerById, currentCustomer } =
    useCustomer();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [CustomerType, setCustomerType] = useState();
  const theme = useSelector((state) => state?.persisted?.theme);
  const customStyles = createCustomStyles(theme?.mode);
  const workerSelectStyles = {
    ...customStyles,
    control: (provided) => ({
      ...provided,
      ...customStyles.control,
      backgroundColor: customStyles.control.backgroundColor,

      maxHeight: '90px',

      overflow: 'auto',
      marginLeft: '10px',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999, // Ensure dropdown is above other elements
    }),
  };

  useEffect(() => {
    if (customerGroup.data) {
      const formattedOptions = customerGroup.data.content.map((customer) => ({
        value: customer.id,
        label: customer.customerGroupName,
        customerObject: customer,
      }));
      setCustomerGroupList(formattedOptions);
    }
  }, [customerGroup.data]);

  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const CustomerData = await GetCustomerById(id);



      if (CustomerData) {
        setInitialValues({
          customerName: CustomerData.customerName,
          customerGroup: CustomerData.customerGroup,
          countryName: CustomerData.countryName,
          city: CustomerData.city,
          contactNumber: CustomerData.contactNumber,
          billTo: CustomerData.billTo,
          email: CustomerData.email,
          reference: CustomerData.reference,
          billingAddress: CustomerData.billingAddress,
          shippingAddress: CustomerData.shippingAddress,
          gstin_vatno: CustomerData.gstin_vatno,
          iecNumber: CustomerData.iecNumber,
          instaId: CustomerData.instaId,
          discount: CustomerData.discount,
          retailLocation: CustomerData.retailLocation,
          website: CustomerData.website,
          social: CustomerData.social,
          event: CustomerData.event,
          eventType: CustomerData.eventType,

        });

        // Initialize the rows state with readonly property for fetched data

      }
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addRow = () => {
    const newRow = {
      id: Date.now(),
      selectedOption1: null,
      selectedOption3: [],
      numOfLooms: 0,
      readonly: false,
    };
    setRows([...rows, newRow]);
  };
  const deleteRow = (index) => {
    setRows(rows.filter((_, rowIndex) => rowIndex !== index));
  };

  const handleUpdateSubmit = async (values) => {
    console.log(values, "athandlesubmit");
    const formData = {
      ...values,
      // CustomerType: values.CustomerType?.value,
      // groupTypes: rows?.map((row) => ({
      //   groupTypeName: row?.selectedOption1?.value,
      //   noOfLooms: row?.numOfLooms,
      //   workers: row?.selectedOption3?.map((worker) => ({
      //     workerCode: worker.value,
      //   })),
      // })),
    };

    try {
      const url = `${UPDATE_CUSTOMER_URL}/${id}`; // Adjust the URL if needed
      const method = 'PUT'; // Use PUT method for updating

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Customer updated successfully`);
        navigate('/customer/viewCustomer');
      } else {
        toast.error(`${data.errorMessage}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  // const generateWorkerOptions = (groupName, CustomerCode, numOfLooms = 1) => {
  //   const workerOptions = [];
  //   for (let i = 1; i <= numOfLooms; i++) {
  //     const label = `${groupName
  //       .slice(0, 3)
  //       .toUpperCase()}-${CustomerCode.slice(0, 5)}-${String(i).padStart(
  //         3,
  //         '0',
  //       )}`;
  //     workerOptions.push({ value: label, label });
  //   }
  //   return workerOptions;
  // };
  const formik = useFormik({

    initialValues: {
      customerName: '',
      customerGroup: '',
      countryName: '',
      city: '',
      contactNumber: '',
      billTo: '',
      email: '',
      reference: '',
      billingAddress: '',
      shippingAddress: '',
      gstin_vatno: '',
      iecNumber: '',
      instaId: '',
      discount: '',
      retailLocation: '',
      website: '',
      social: '',
      event: '',
      eventType: '',
    },

    validationSchema: Yup.object({
      customerName: Yup.string().required('Required'),
      customerGroup: Yup.object({
        id: Yup.string().required('Group ID is required'),
        customerGroupName: Yup.string().required('Group Name is required'),
      }).required('Customer Group is required'),
      //   customerGroup: Yup.string().required('Required'),
      countryName: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      contactNumber: Yup.string().required('Required'),
      billTo: Yup.string().optional(),
      email: Yup.string().required('Required'),
      reference: Yup.string().optional(),
      billingAddress: Yup.string().required('Required'),
      shippingAddress: Yup.string().required('Required'),
      gstin_vatno: Yup.string().optional(),
      iecNumber: Yup.string().optional(),
      instaId: Yup.string().optional(),
      discount: Yup.string().optional(),
    }),
    onSubmit: (values) => {
      if (values) {
        console.log(values, "juju");
        handleSubmit(values);
      }
    },
  });

console.log(initialValues,"ghsons");

  if (!initialValues) {
    return <div>Loading...</div>;
  }
  const handleRadioChange = (event) => {
    formik.setFieldValue('retailLocation', event.target.value);
  };
  const handleRadioChangeWebsite = (event) => {
    formik.setFieldValue('website', event.target.value);
  };
  const handleRadioChangeSocial = (event) => {
    formik.setFieldValue('social', event.target.value);
  };
  const handleRadioChangeEvent = (event) => {
    formik.setFieldValue('event', event.target.value);
  };
  const handleRadioChangeEventType = (event) => {
    formik.setFieldValue('eventType', event.target.value);
  };

  const handleChange = (e) => {
    console.log("Field changed", e.target.name, e.target.value);
    formik.handleChange(e);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Customer / Update Customer" />
      <div>
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                Update Customer
              </h3>
            </div>

            <Formik
              enableReinitialize={true}  // Enable reinitialization of form values when initialValues change
              initialValues={initialValues || {
                customerName: '',
                customerGroup: '',
                countryName: '',
                city: '',
                contactNumber: '',
                billTo: '',
                email: '',
                reference: '',
                billingAddress: '',
                shippingAddress: '',
                gstin_vatno: '',
                iecNumber: '',
                instaId: '',
                discount: '',
                retailLocation: '',
                website: '',
                social: '',
                event: '',
                eventType: '',
              }}
              validationSchema={Yup.object({
                customerName: Yup.string().required('Required'),
                customerGroup: Yup.object({
                  id: Yup.string().required('Group ID is required'),
                  customerGroupName: Yup.string().required('Group Name is required'),
                }).required('Customer Group is required'),
                countryName: Yup.string().required('Required'),
                city: Yup.string().required('Required'),
                contactNumber: Yup.string().required('Required'),
                billTo: Yup.string().required('Required'),
                email: Yup.string().required('Required'),
                reference: Yup.string().required('Required'),
                billingAddress: Yup.string().required('Required'),
                shippingAddress: Yup.string().required('Required'),
                gstin_vatno: Yup.string().required('Required'),
                iecNumber: Yup.string().required('Required'),
                instaId: Yup.string().required('Required'),
                discount: Yup.string().required('Required'),
              })}
              onSubmit={(values) => {
                if (values) {
                  console.log(values, "heyyy");
                  handleUpdateSubmit(values);
                }
              }}
            >
              {(formik) => (
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                  <div className="p-6.5">
                    <div className="mb-4.5 flex flex-wrap gap-6">
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Customer Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="customerName"
                          placeholder="customerName"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.customerName}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {formik.touched.customerName &&
                          formik.errors.customerName ? (
                          <div className="text-red-600 text-sm">
                            {formik.errors.customerName}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Customer Group <span className="text-red-600">*</span>
                        </label>
                        <ReactSelect
                          name="customerGroup"
                          value={
                            customerGroupList?.find(
                              (option) =>
                                option.value === formik.values.customerGroup?.id,
                            ) || null
                          }
                          onChange={(option) =>
                            formik.setFieldValue(
                              'customerGroup',
                              option ? option.customerObject : null,
                            )
                          } // Keep the whole object here
                          options={customerGroupList}
                          onBlur={formik.handleBlur}
                          styles={customStyles}
                          className="bg-white dark:bg-form-input"
                          classNamePrefix="react-select"
                          placeholder="select"
                        />
                        {formik.touched.customerGroup &&
                          formik.errors.customerGroup ? (
                          <div className="text-red-600 text-sm">
                            {formik.errors.customerGroup}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="mb-4.5 flex flex-wrap gap-6">
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Country <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="countryName"
                          placeholder="countryName Name"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}

                          value={formik.values.countryName}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {formik.touched.countryName && formik.errors.countryName ? (
                          <div className="text-red-600 text-sm">
                            {formik.errors.countryName}
                          </div>
                        ) : null}
                      </div>






                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          City <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          placeholder="City Name"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.city}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {formik.touched.city && formik.errors.city ? (
                          <div className="text-red-600 text-sm">
                            {formik.errors.city}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-wrap gap-6">
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Contact Number <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="contactNumber"
                          placeholder="Contact Number"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.contactNumber}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {formik.touched.contactNumber &&
                          formik.errors.contactNumber ? (
                          <div className="text-red-600 text-sm">
                            {formik.errors.contactNumber}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Bill To
                        </label>
                        <input
                          type="text"
                          name="billTo"
                          placeholder="Billing To"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.billTo}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {formik.touched.billTo && formik.errors.billTo ? (
                          <div className="text-red-600 text-sm">
                            {formik.errors.billTo}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-wrap gap-6">
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Email id <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="email"
                          placeholder="Email id"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.email}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {formik.touched.email && formik.errors.email ? (
                          <div className="text-red-600 text-sm">
                            {formik.errors.email}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Reference
                        </label>
                        <input
                          type="text"
                          name="reference"
                          placeholder="Reference"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.reference}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {formik.touched.reference && formik.errors.reference ? (
                          <div className="text-red-600 text-sm">
                            {formik.errors.reference}
                          </div>
                        ) : null}
                      </div>
                    </div>






                    <div className="mb-4.5 flex flex-wrap gap-6">
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Billing Address <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="billingAddress"
                          placeholder="Billing Address"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.billingAddress}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {formik.touched.billingAddress &&
                          formik.errors.billingAddress ? (
                          <div className="text-red-600 text-sm">
                            {formik.errors.billingAddress}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Shipping Address <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="shippingAddress"
                          placeholder="ShippingAddress"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.shippingAddress}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {formik.touched.shippingAddress &&
                          formik.errors.shippingAddress ? (
                          <div className="text-red-600 text-sm">
                            {formik.errors.shippingAddress}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-wrap gap-6">
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          GSTIN/VAT No
                        </label>
                        <input
                          type="text"
                          name="gstin_vatno"
                          placeholder="GstIN/VAT No"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.gstin_vatno}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {formik.touched.gstin_vatno && formik.errors.gstin_vatno ? (
                          <div className="text-red-600 text-sm">
                            {formik.errors.gstin_vatno}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          IEC No
                        </label>
                        <input
                          type="text"
                          name="iecNumber"
                          placeholder="IEC No"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.iecNumber}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {formik.touched.iecNo && formik.errors.iecNumber ? (
                          <div className="text-red-600 text-sm">
                            {formik.errors.iecNumber}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-wrap gap-6">
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          INSTA Id
                        </label>
                        <input
                          type="text"
                          name="instaId"
                          placeholder="INSTA Id"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.instaId}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {formik.touched.instaId && formik.errors.instaId ? (
                          <div className="text-red-600 text-sm">
                            {formik.errors.instaId}
                          </div>
                        ) : null}
                      </div>
                    </div>

                     <div className="mb-4.5 flex flex-wrap gap-6">
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Discount Offered(%){' '}
                        </label>
                        <input
                          type="text"
                          name="discount"
                          placeholder="Discount Offered(%)"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.discount}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {formik.touched.discount &&
                          formik.errors.discount ? (
                          <div className="text-red-600 text-sm">
                            {formik.errors.discount}
                          </div>
                        ) : null}
                      </div>
                    </div>


                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                      <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                        CUSTOMER INTERACTION
                      </h3>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-6">

  {/* Retail Location */}
  <div className="space-y-2">
    <p>Retail Location</p>
    <label className="flex items-center">
      <input
        type="radio"
        name="retailLocation"
        value="SRX"
        checked={formik.values.retailLocation === 'SRX'}
        onChange={formik.handleChange}
      />
      <span className="ml-1">SRX</span>
    </label>
    <label className="flex items-center">
      <input
        type="radio"
        name="retailLocation"
        value="Delhi"
        checked={formik.values.retailLocation === 'Delhi'}
        onChange={formik.handleChange}
      />
      <span className="ml-1">Delhi</span>
    </label>
    <label className="flex items-center">
      <input
        type="radio"
        name="retailLocation"
        value="SXR and Delhi"
        checked={formik.values.retailLocation === 'SXR and Delhi'}
        onChange={formik.handleChange}
      />
      <span className="ml-1">SXR and Delhi</span>
    </label>
  </div>

  {/* Website */}
  <div className="space-y-2">
    <p>Website</p>
    <label className="flex items-center">
      <input
        type="radio"
        name="website"
        value="Subscribed"
        checked={formik.values.website === 'Subscribed'}
        onChange={formik.handleChange}
      />
      <span className="ml-1">Subscribed</span>
    </label>
    <label className="flex items-center">
      <input
        type="radio"
        name="website"
        value="Subscribed/Purchased"
        checked={formik.values.website === 'Subscribed/Purchased'}
        onChange={formik.handleChange}
      />
      <span className="ml-1">Subscribed/Purchased</span>
    </label>
  </div>

  {/* Social */}
  <div className="space-y-2">
    <p>Social</p>
    <label className="flex items-center">
      <input
        type="radio"
        name="social"
        value="Interaction"
        checked={formik.values.social === 'Interaction'}
        onChange={formik.handleChange}
      />
      <span className="ml-1">Interaction</span>
    </label>
    <label className="flex items-center">
      <input
        type="radio"
        name="social"
        value="Purchased"
        checked={formik.values.social === 'Purchased'}
        onChange={formik.handleChange}
      />
      <span className="ml-1">Purchased</span>
    </label>
  </div>

  {/* Event */}
  <div className="space-y-2">
    <p>Event</p>
    <label className="flex items-center">
      <input
        type="radio"
        name="event"
        value="Domestic"
        checked={formik.values.event === 'Domestic'}
        onChange={formik.handleChange}
      />
      <span className="ml-1">Domestic</span>
    </label>
    <label className="flex items-center">
      <input
        type="radio"
        name="event"
        value="International"
        checked={formik.values.event === 'International'}
        onChange={formik.handleChange}
      />
      <span className="ml-1">International</span>
    </label>
  </div>

  {/* Event Type */}
  <div className="space-y-2">
    <p>Event Type</p>
    <label className="flex items-center">
      <input
        type="radio"
        name="eventType"
        value="Interaction"
        checked={formik.values.eventType === 'Interaction'}
        onChange={formik.handleChange}
      />
      <span className="ml-1">Interaction</span>
    </label>
    <label className="flex items-center">
      <input
        type="radio"
        name="eventType"
        value="Purchased"
        checked={formik.values.eventType === 'Purchased'}
        onChange={formik.handleChange}
      />
      <span className="ml-1">Purchased</span>
    </label>
  </div>

</div>

                   










                    {/* <button
                      type="submit"
                      className="flex  float-end mb-4 justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-4"
                    >
                      Update Customer
                    </button> */}

                    <div className="flex justify-center mt-4 mb-4 pt-6 border-t border-gray-300">
  <button
    type="submit"
    className="flex justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
  >
    Update Customer
  </button>
</div>

                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UpdateCustomer;