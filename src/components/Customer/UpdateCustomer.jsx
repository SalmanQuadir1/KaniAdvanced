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
  
  // Options for dropdowns
  const clientCategoryOptions = [
    { value: 'PREMIUM', label: 'Premium' },
    { value: 'STANDARD', label: 'Standard' },
    { value: 'BASIC', label: 'Basic' },
    { value: 'VIP', label: 'VIP' },
  ];

 const customerOriginOptions=[
    { value: 'International', label: 'International' },
    { value: 'Domestic', label: 'Domestic' },
  ,
  ]

  const registrationTypeOptions = [
    { value: 'INDIVIDUAL', label: 'Individual' },
    { value: 'BUSINESS', label: 'Business' },
    { value: 'GOVERNMENT', label: 'Government' },
    { value: 'NON_PROFIT', label: 'Non-Profit' },
  ];

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
      zIndex: 9999,
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
          shippingState: CustomerData.shippingState,
          // New fields
          customerId: CustomerData.customerId || CustomerData.contactNumber,
          clientCategory: CustomerData.clientCategory || '',
          referalId: CustomerData.referalId || '',
          customerOrigin: CustomerData.customerOrigin || '',
          registrationType: CustomerData.registrationType || '',
        });
      }
    };

    fetchData();
  }, [id]);

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
    };

    try {
      const url = `${UPDATE_CUSTOMER_URL}/${id}`;
      const method = 'PUT';

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
    }
  };

  if (!initialValues) {
    return <div>Loading...</div>;
  }

    const stateOption = [
    { value: '01', label: 'Jammu & Kashmir' },
    { value: '02', label: 'Himachal Pradesh' },
    { value: '03', label: 'Punjab' },
    { value: '04', label: 'Chandigarh' },
    { value: '05', label: 'Uttarakhand' },
    { value: '06', label: 'Haryana' },
    { value: '07', label: 'Delhi' },
    { value: '08', label: 'Rajasthan' },
    { value: '09', label: 'Uttar Pradesh' },
    { value: '10', label: 'Bihar' },
    { value: '11', label: 'Sikkim' },
    { value: '12', label: 'Arunachal Pradesh' },
    { value: '13', label: 'Nagaland' },
    { value: '14', label: 'Manipur' },
    { value: '15', label: 'Mizoram' },
    { value: '16', label: 'Tripura' },
    { value: '17', label: 'Meghalaya' },
    { value: '18', label: 'Assam' },
    { value: '19', label: 'West Bengal' },
    { value: '20', label: 'Jharkhand' },
    { value: '21', label: 'Odisha' },
    { value: '22', label: 'Chhattisgarh' },
    { value: '23', label: 'Madhya Pradesh' },
    { value: '24', label: 'Gujarat' },
    { value: '25', label: 'Daman & Diu' },
    { value: '26', label: 'Dadra & Nagar Haveli' },
    { value: '27', label: 'Maharashtra' },
    { value: '28', label: 'Andhra Pradesh' },
    { value: '29', label: 'Karnataka' },
    { value: '30', label: 'Goa' },
    { value: '31', label: 'Lakshadweep' },
    { value: '32', label: 'Kerala' },
    { value: '33', label: 'Tamil Nadu' },
    { value: '34', label: 'Puducherry' },
    { value: '35', label: 'Andaman & Nicobar Islands' },
    { value: '36', label: 'Telangana' },
    { value: '37', label: 'Andhra Pradesh (New)' },
    { value: '38', label: 'Ladakh' }
  ];

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
              enableReinitialize={true}
              initialValues={initialValues}
              validationSchema={Yup.object({
                customerName: Yup.string().required('Required'),
                customerGroup: Yup.object({
                  id: Yup.string().required('Group ID is required'),
                  customerGroupName: Yup.string().required('Group Name is required'),
                }).required('Customer Group is required'),
                countryName: Yup.string().required('Required'),
                city: Yup.string().required('Required'),
                contactNumber: Yup.string().required('Required'),
                email: Yup.string().email('Invalid email').required('Required'),
                billingAddress: Yup.string().required('Required'),
                shippingAddress: Yup.string().required('Required'),
                // New fields validation
                clientCategory: Yup.string().optional(),
                referalId: Yup.string().optional(),
                customerOrigin: Yup.string().optional(),
                registrationType: Yup.string().optional(),
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
                    {/* Existing Fields */}
                    <div className="mb-4.5 flex flex-wrap gap-6">
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Customer Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="customerName"
                          placeholder="Customer Name"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.customerName}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {formik.touched.customerName && formik.errors.customerName && (
                          <div className="text-red-600 text-sm">
                            {formik.errors.customerName}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Customer ID
                        </label>
                        <input
                          type="text"
                          name="customerId"
                          placeholder="Customer ID"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.customerId}
                          disabled
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-gray-800"
                        />
                      </div>
                    </div>

                    <div className="mb-4.5 flex flex-wrap gap-6">
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
                          }
                          options={customerGroupList}
                          onBlur={formik.handleBlur}
                          styles={customStyles}
                          className="bg-white dark:bg-form-input"
                          classNamePrefix="react-select"
                          placeholder="Select Customer Group"
                        />
                        {formik.touched.customerGroup && formik.errors.customerGroup && (
                          <div className="text-red-600 text-sm">
                            {formik.errors.customerGroup}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Client Category
                        </label>
                        <ReactSelect
                          name="clientCategory"
                          value={clientCategoryOptions.find(
                            option => option.value === formik.values.clientCategory
                          )}
                          onChange={(option) =>
                            formik.setFieldValue('clientCategory', option?.value || '')
                          }
                          options={clientCategoryOptions}
                          onBlur={formik.handleBlur}
                          styles={customStyles}
                          className="bg-white dark:bg-form-input"
                          classNamePrefix="react-select"
                          placeholder="Select Client Category"
                          isClearable
                        />
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
                          placeholder="Country Name"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.countryName}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {formik.touched.countryName && formik.errors.countryName && (
                          <div className="text-red-600 text-sm">
                            {formik.errors.countryName}
                          </div>
                        )}
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
                        {formik.touched.city && formik.errors.city && (
                          <div className="text-red-600 text-sm">
                            {formik.errors.city}
                          </div>
                        )}
                      </div>

                        <div className="flex-1 min-w-[300px]">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Shipping State <span className="text-red-600">*</span>
                    </label>
                    <ReactSelect
                      name="shippingState"
                      styles={customStyles}
                      value={stateOption.find(option => option.value === formik.values.shippingState) || null}

                      onChange={(option) =>
                        formik.setFieldValue(
                          'shippingState',
                          option ? option.value : null,
                        )
                      }
                      onBlur={() => formik.setFieldTouched('shippingState', true)}
                      options={stateOption}
                      className="bg-white dark:bg-form-input"
                      classNamePrefix="react-select"
                      placeholder="Select Shipping State"
                    />
                    {formik.touched.shippingState && formik.errors.shippingState && (
                      renderError(formik.errors.shippingState)
                    )}
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
                        {formik.touched.contactNumber && formik.errors.contactNumber && (
                          <div className="text-red-600 text-sm">
                            {formik.errors.contactNumber}
                          </div>
                        )}
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
                      </div>
                    </div>

                    <div className="mb-4.5 flex flex-wrap gap-6">
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Email id <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email id"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.email}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {formik.touched.email && formik.errors.email && (
                          <div className="text-red-600 text-sm">
                            {formik.errors.email}
                          </div>
                        )}
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
                      </div>
                    </div>

                    <div className="mb-4.5 flex flex-wrap gap-6">
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Referral ID
                        </label>
                        <input
                          type="text"
                          name="referalId"
                          placeholder="Referral ID"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.referalId}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Customer Origin
                        </label>
                        <ReactSelect
                          name="customerOrigin"
                          value={customerOriginOptions.find(
                            option => option?.value === formik?.values.customerOrigin
                          )}
                          onChange={(option) =>
                            formik.setFieldValue('customerOrigin', option?.value || '')
                          }
                          options={customerOriginOptions}
                          onBlur={formik.handleBlur}
                          styles={customStyles}
                          className="bg-white dark:bg-form-input"
                          classNamePrefix="react-select"
                          placeholder="Select Customer Origin"
                          isClearable
                        />
                      </div>
                    </div>

                    <div className="mb-4.5 flex flex-wrap gap-6">
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Billing Address <span className="text-red-600">*</span>
                        </label>
                        <textarea
                          name="billingAddress"
                          placeholder="Billing Address"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.billingAddress}
                          rows="3"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {formik.touched.billingAddress && formik.errors.billingAddress && (
                          <div className="text-red-600 text-sm">
                            {formik.errors.billingAddress}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Shipping Address <span className="text-red-600">*</span>
                        </label>
                        <textarea
                          name="shippingAddress"
                          placeholder="Shipping Address"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.shippingAddress}
                          rows="3"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {formik.touched.shippingAddress && formik.errors.shippingAddress && (
                          <div className="text-red-600 text-sm">
                            {formik.errors.shippingAddress}
                          </div>
                        )}
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
                          placeholder="GSTIN/VAT No"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.gstin_vatno}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
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
                      </div>

                         <div className="flex-1 min-w-[300px]">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Registration Type <span className="text-red-600"></span>
                    </label>
                    <input
                      type="text"
                      name="registrationType"
                      placeholder="Registration Type"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.registrationType}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {formik.touched.registrationType && formik.errors.registrationType && (
                      renderError(formik.errors.registrationType)
                    )}
                  </div>
                    </div>

                    <div className="mb-4.5 flex flex-wrap gap-6">
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Discount Offered(%)
                        </label>
                        <input
                          type="number"
                          name="discount"
                          placeholder="Discount Offered(%)"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.discount}
                          min="0"
                          max="100"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Customer Interaction Section */}
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                      <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                        CUSTOMER INTERACTION
                      </h3>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-6">
                      {/* Retail Location */}
                      <div className="space-y-2">
                        <p className="font-medium">Retail Location</p>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="retailLocation"
                            value="SRX"
                            checked={formik.values.retailLocation === 'SRX'}
                            onChange={formik.handleChange}
                            className="mr-2"
                          />
                          <span>SRX</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="retailLocation"
                            value="Delhi"
                            checked={formik.values.retailLocation === 'Delhi'}
                            onChange={formik.handleChange}
                            className="mr-2"
                          />
                          <span>Delhi</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="retailLocation"
                            value="SXR and Delhi"
                            checked={formik.values.retailLocation === 'SXR and Delhi'}
                            onChange={formik.handleChange}
                            className="mr-2"
                          />
                          <span>SXR and Delhi</span>
                        </label>
                      </div>

                      {/* Website */}
                      <div className="space-y-2">
                        <p className="font-medium">Website</p>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="website"
                            value="Subscribed"
                            checked={formik.values.website === 'Subscribed'}
                            onChange={formik.handleChange}
                            className="mr-2"
                          />
                          <span>Subscribed</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="website"
                            value="Subscribed/Purchased"
                            checked={formik.values.website === 'Subscribed/Purchased'}
                            onChange={formik.handleChange}
                            className="mr-2"
                          />
                          <span>Subscribed/Purchased</span>
                        </label>
                      </div>

                      {/* Social */}
                      <div className="space-y-2">
                        <p className="font-medium">Social</p>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="social"
                            value="Interaction"
                            checked={formik.values.social === 'Interaction'}
                            onChange={formik.handleChange}
                            className="mr-2"
                          />
                          <span>Interaction</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="social"
                            value="Purchased"
                            checked={formik.values.social === 'Purchased'}
                            onChange={formik.handleChange}
                            className="mr-2"
                          />
                          <span>Purchased</span>
                        </label>
                      </div>

                      {/* Event */}
                      <div className="space-y-2">
                        <p className="font-medium">Event</p>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="event"
                            value="Domestic"
                            checked={formik.values.event === 'Domestic'}
                            onChange={formik.handleChange}
                            className="mr-2"
                          />
                          <span>Domestic</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="event"
                            value="International"
                            checked={formik.values.event === 'International'}
                            onChange={formik.handleChange}
                            className="mr-2"
                          />
                          <span>International</span>
                        </label>
                      </div>

                      {/* Event Type */}
                      <div className="space-y-2">
                        <p className="font-medium">Event Type</p>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="eventType"
                            value="Interaction"
                            checked={formik.values.eventType === 'Interaction'}
                            onChange={formik.handleChange}
                            className="mr-2"
                          />
                          <span>Interaction</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="eventType"
                            value="Purchased"
                            checked={formik.values.eventType === 'Purchased'}
                            onChange={formik.handleChange}
                            className="mr-2"
                          />
                          <span>Purchased</span>
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-4 mb-4 pt-6 border-t border-gray-300">
                      <button
                        type="submit"
                        className="flex justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 min-w-[200px]"
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