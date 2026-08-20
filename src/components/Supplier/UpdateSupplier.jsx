import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import ReactSelect from 'react-select';
import { IoMdAdd, IoMdTrash } from 'react-icons/io';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import useSupplier from '../../hooks/useSupplier';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { UPDATE_SUPPLIER_URL } from '../../Constants/utils';
import { toast } from 'react-toastify';

const UpdateSupplier = () => {
  const navigate = useNavigate();
  const [productGroupOptions, setproductGroupOptions] = useState([]);
  const { seloptions, groups, GetSupplierById, currentSupplier } =
    useSupplier();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [supplierType, setsupplierType] = useState();
  const theme = useSelector((state) => state?.persisted?.theme);
  const customStyles = createCustomStyles(theme?.mode);

  const productGroup = useSelector((state) => state?.persisted?.productGroup);

  useEffect(() => {
    if (productGroup.data) {
      const formattedOptions = productGroup.data.map((product) => ({
        value: product.productGroupName,
        label: product.productGroupName,
        productGroupObject: product,
      }));
      setproductGroupOptions(formattedOptions);
    }
  }, [productGroup.data]);

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
    { value: '38', label: 'Ladakh' },
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
      zIndex: 9999, // Ensure dropdown is above other elements
    }),
  };

  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const supplierData = await GetSupplierById(id);

      console.log('SUPPLIER RESPONSE:', supplierData);
      console.log('PRODUCT GROUP OPTIONS:', productGroupOptions);

      if (!supplierData) return;

      setInitialValues({
        name: supplierData?.name || '',
        phoneNumber: supplierData?.phoneNumber || '',
        supplierCode: supplierData?.supplierCode || '',
        address: supplierData?.address || '',
        bankName: supplierData?.bankName || '',
        shippingState: supplierData?.shippingState || null,
        accountNo: supplierData?.accountNo || '',
        typeOfopeningBalance: supplierData?.previousOpType || '',
        previousOpType: '',
        openingBalances: supplierData?.openingBalances,
        previousOpBalance: '',
        isUsedInOrderRecieved: supplierData?.usedInOrderRecieved || false,
        ifscCode: supplierData?.ifscCode || '',
        emailId: supplierData?.emailId || '',
        supplierType:
          seloptions.find(
            (option) => option.value === supplierData.supplierType,
          ) || null,
      });

      if (supplierData?.groupTypes && productGroupOptions.length > 0) {
        setRows(
          supplierData.groupTypes.map((group) => {
            const selectedGroup = productGroupOptions.find(
              (option) => option.value === group?.groupTypeName,
            );

            return {
              selectedOption1: selectedGroup || null,

              selectedOption3:
                group?.workers?.map((worker) => ({
                  value: worker.workerCode,
                  label: worker.workerCode,
                })) || [],

              numOfLooms: group?.noOfLooms || 0,

              readonly: false,
            };
          }),
        );
      }
    };

    fetchData();
  }, [id, productGroupOptions]);

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

  const handleUpdateSubmit = async (values, { setSubmitting }) => {
    const formData = {
      ...values,
      supplierType: values.supplierType?.value,
      groupTypes: rows?.map((row) => ({
        groupTypeName: row?.selectedOption1?.value,
        noOfLooms: row?.numOfLooms,
        workers: row?.selectedOption3?.map((worker) => ({
          workerCode: worker.value,
        })),
      })),
    };


    try {
      const url = `${UPDATE_SUPPLIER_URL}/${id}`; // Adjust the URL if needed
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
        toast.success(`Supplier updated successfully`);
        navigate('/supplier/view');
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

  const generateWorkerOptions = (groupName, supplierCode, numOfLooms = 1) => {
    const workerOptions = [];
    for (let i = 1; i <= numOfLooms; i++) {
      const label = `${groupName
        .slice(0, 3)
        .toUpperCase()}-${supplierCode.slice(0, 5)}-${String(i).padStart(
        3,
        '0',
      )}`;
      workerOptions.push({ value: label, label });
    }
    return workerOptions;
  };
  const handleGroupChange = (index, option) => {
    const newRows = [...rows];
    newRows[index].selectedOption1 = option;
    newRows[index].selectedOption3 = generateWorkerOptions(
      option.label,
      initialValues.supplierCode,
      newRows[index].numOfLooms,
    );
    setRows(newRows);
  };

  const handleLoomsChange = (index, numOfLooms) => {
    const newRows = [...rows];
    newRows[index].numOfLooms = numOfLooms;
    newRows[index].selectedOption3 = generateWorkerOptions(
      newRows[index].selectedOption1?.label,
      initialValues.supplierCode,
      numOfLooms,
    );
    setRows(newRows);
  };

  if (!initialValues) {
    return <div>Loading...</div>;
  }
  console.log(rows, '456');

    const isFieldDisabled = (fieldName) => {
    // If isUsedInOrderRecieved is true, disable all fields except name and accountNo
    if (initialValues?.isUsedInOrderRecieved === true) {
      return fieldName !== 'name' && fieldName !== 'accountNo';
    }
    return false;
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Supplier / Update Supplier" />
      <div>
        <Formik
          initialValues={initialValues}
          validate={(values) => {
            console.log(values.isUsedInOrderRecieved, 'isUsedInOrderRecieved');
            
            const errors = {};
            if (!values?.name) {
              errors.name = 'Required';
            }
            if (!values?.phoneNumber) {
              errors.phoneNumber = 'Required';
            }
            if (values?.phoneNumber?.length < 10) {
              errors.phoneNumber =
                'Phone Number Must Be Greater than 10 digits';
            }
            if (!values?.supplierCode) {
              errors.supplierCode = 'Required';
            }
            if (!values?.address) {
              errors.address = 'Required';
            }
            if (!values?.bankName) {
              errors.bankName = 'Required';
            }
            if (!values?.accountNo) {
              errors.accountNo = 'Required';
            }
            if (values?.accountNo?.length < 10) {
              errors.accountNo =
                'Account Number Must Be Greater than 10 digits';
            }
            if (!values?.ifscCode) {
              errors.ifscCode = 'Required';
            }
            if (!values?.emailId) {
              errors.emailId = 'Required';
            }
            return errors;
          }}
          onSubmit={handleUpdateSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <div className="flex flex-col gap-9">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                      Update Supplier
                    </h3>
                    <h6 className="text-xs text-red-500">
                      <span className="text-red-500 ml-1">*</span> If Supplier Has Any Ledger Transactions Most Of The Fields Will Not Be Editable
                    </h6>
                  </div>
                  <div className="p-6.5">
                    
                    <div className="mb-4.5 flex flex-wrap gap-6">
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Supplier Code{' '}
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field
                        
                          type="text"
                          name="supplierCode"
                          disabled={isFieldDisabled('supplierCode')}
                          placeholder="Enter Supplier Code"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage
                          name="supplierCode"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Name <span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field
                          type="text"
                          name="name"
                          placeholder="Enter Name"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Phone Number{' '}
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field
                          type="text"
                          name="phoneNumber"
                          placeholder="Enter Phone Number"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage
                          name="phoneNumber"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-wrap gap-6"></div>
                    <div className="mb-4.5 flex flex-wrap gap-6">
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Email Id
                        </label>
                        <Field
                          type="text"
                          name="emailId"
                          placeholder="Enter Email Id"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage
                          name="emailId"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Address <span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field
                          type="text"
                          name="address"
                          placeholder="Enter Address"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage
                          name="address"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          State <span className="text-red-600">*</span>
                        </label>
                        <ReactSelect
                          name="shippingState"
                          isDisabled={isFieldDisabled('shippingState') || values.isUsedInOrderRecieved === true}
                          styles={customStyles}
                          value={
                            stateOption.find(
                              (option) => option.value === values.shippingState,
                            ) || null
                          }
                          onChange={(option) =>
                            setFieldValue(
                              'shippingState',
                              option ? option.value : null,
                            )
                          }
                          options={stateOption}
                        
                          className="bg-white dark:bg-form-input"
                          classNamePrefix="react-select"
                          placeholder="Select  State"
                        />

                        <ErrorMessage
                          name="shippingState"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-wrap gap-6">
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Bank Name <span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field
                          type="text"
                          name="bankName"
                          placeholder="Enter Bank Name"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage
                          name="bankName"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Account Number{' '}
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field
                          type="text"
                          name="accountNo"
                          placeholder="Enter Account Number"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage
                          name="accountNo"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          IFSC Code <span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field
                          type="text"
                          name="ifscCode"
                          placeholder="Enter IFSC Code"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage
                          name="ifscCode"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-wrap gap-6">
                      <div className="min-w-[320px] sm:min-w-[400px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Supplier Type
                        </label>
                        <ReactSelect
                          // isDisabled
                          styles={customStyles}
                           isDisabled={isFieldDisabled('shippingState') || values.isUsedInOrderRecieved === true}
                          options={seloptions}
                          value={values?.supplierType}
                          onChange={(option) =>
                            setFieldValue('supplierType', option)
                          }
                        />
                      </div>
                    </div>
                    <div className="mb-4.5  gap-6">
                      <div className="flex mb-4.5 gap-7   pt-4 dark:border-strokedark w-full">
                        {/* Radio Buttons for Opening Balance Type */}
                        <div className="mb-2.5 flex items-center gap-4">
                          <h4 className="font-medium text-black dark:text-white">
                            Opening Balance Type:
                          </h4>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="typeOfopeningBalance"
                              value="DEBIT"
                             disabled={isFieldDisabled('typeOfopeningBalance')}
                              checked={values.typeOfopeningBalance === 'DEBIT'}
                              onChange={(e) => {
                                setFieldValue(
                                  'typeOfopeningBalance',
                                  e.target.value,
                                );
                                setFieldValue('previousOpType', e.target.value);
                              }}
                              
                              className="h-4 w-4 border-stroke bg-transparent text-primary focus:ring-0 dark:border-form-strokedark dark:bg-slate-700"
                            />
                            <span className="text-black dark:text-white">
                              {' '}
                              (DR)
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="typeOfopeningBalance"
                              value="CREDIT"
                                disabled={isFieldDisabled('typeOfopeningBalance')}
                              checked={values.typeOfopeningBalance === 'CREDIT'}
                              onChange={(e) => {
                                setFieldValue(
                                  'typeOfopeningBalance',
                                  e.target.value,
                                );
                                setFieldValue('previousOpType', e.target.value);
                              }}
                              className="h-4 w-4 border-stroke bg-transparent text-primary focus:ring-0 dark:border-form-strokedark dark:bg-slate-700"
                            />
                            <span className="text-black dark:text-white">
                              {' '}
                              (CR)
                            </span>
                          </label>
                        </div>

                        {/* Opening Balance Input */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 min-w-[250px]">
                            <input
                              type="number"
                              name="openingBalances"
                                disabled={isFieldDisabled('openingBalances')}
                              placeholder="Opening Balance"
                              onChange={(e) => {
                                setFieldValue(
                                  'previousOpBalance',
                                  e.target.value,
                                );
                                setFieldValue(
                                  'openingBalances',
                                  e.target.value,
                                );
                              }}
                              //   onBlur={formik.handleBlur}
                              value={values.openingBalances}
                              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                            />
                          </div>
                          {/* Display "CR" if Credit is selected */}
                          {values.typeOfopeningBalance === 'CREDIT' ? (
                            <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                              Cr.
                            </span>
                          ) : (
                            <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                              Dr.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {values?.supplierType?.value === 'PRODUCT' && (
                    <div className="overflow-hidden w-[350px] sm:w-full ml-3 sm:ml-0 md:overflow-x-visible  md:overflow-y-visible  rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                      <div className=" flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark ">
                        <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                          Group Types
                        </h3>
                        <button
                          type="button"
                          onClick={addRow}
                            disabled={isFieldDisabled('typeOfopeningBalance')}
                          className="flex items-center h-12 mt-9  border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 "
                        >
                          <IoMdAdd className="mr-2" size={20} />
                          Add Row
                        </button>
                      </div>
                      <div className="overflow-x-scroll  mr-4 md:overflow-x-visible  md:overflow-y-visible -mx-4 sm:-mx-8 px-4 sm:px-8 py-4">
                        <div className="min-w-[400px] ml-3 mr-3 shadow-md rounded-lg">
                          <table className="min-w-full">
                            <thead>
                              <tr className="px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white">
                                <th
                                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                  style={{ minWidth: '250px' }}
                                >
                                  Group Type
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Number of Looms
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Workers
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {rows.map((row, index) => (
                                <tr key={index}>
                                  <td className="px-2 py-2 border-b">
                                    <ReactSelect
                                      styles={customStyles}
                                      options={productGroupOptions}
                                      value={row.selectedOption1}
                                        isDisabled={isFieldDisabled('typeOfopeningBalance')}
                                      onChange={(option) =>
                                        handleGroupChange(index, option)
                                      }
                                   
                                    />
                                  </td>
                                  <td className="px-2 py-2 border-b">
                                    <Field
                                      type="number"
                                      name={`rows[${index}].numOfLooms`}
                                        disabled={isFieldDisabled('typeOfopeningBalance')}
                                      value={row.numOfLooms}
                                      onChange={(e) =>
                                        handleLoomsChange(index, e.target.value)
                                      }
                                      // disabled={row.readonly}
                                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                    />
                                  </td>
                                  <td className="px-2 py-2 border-b">
                                    <ReactSelect
                                      className="overflow-auto"
                                      styles={workerSelectStyles}
                                      // options={
                                      //   row.selectedOption1
                                      //     ? generateWorkerOptions(
                                      //         row.selectedOption1.label,
                                      //         initialValues.supplierCode,
                                      //         row.numOfLooms,
                                      //       )
                                      //     : []
                                      // }
                                      value={row.selectedOption3}
                                      isMulti
                                      // onChange={(option) => {
                                      //   const newRows = [...rows];
                                      //   newRows[index].selectedOption3 = option;
                                      //   setRows(newRows);
                                      // }}
                                      // isDisabled={row.readonly}
                                      // components={{
                                      //   DropdownIndicator: () => null,
                                      //   ClearIndicator: () => null,
                                      // }}
                                    />
                                  </td>
                                  <td className="px-2 py-2 border-b">
                                    {!row.readonly && (
                                      <button
                                        type="button"
                                          disabled={isFieldDisabled('typeOfopeningBalance')}
                                        onClick={() => deleteRow(index)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <IoMdTrash size={20} />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-center mt-4 items-center mb-2">
                    <button
                      type="submit"
                      className="flex md:w-[230px] w-[190px] md:h-[37px] h-[47px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-4"
                    >
                      Update Supplier
                    </button>
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

export default UpdateSupplier;
