import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
//  import Flatpickr from 'react-flatpickr';
import { DELETE_ORDER_URL, DOWNLOADCSV_REPORT, DOWNLOAD_REPORT, VIEW_ALL_ORDERS, VIEW_CREATED_ORDERS, VIEW_REPORT } from "../../Constants/utils";
import ReactSelect from 'react-select';
import useorder from '../../hooks/useOrder';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import useReports from '../../hooks/useReports';




const productgrp = [
    { value: 'BrandA', label: 'Brand A' },
    { value: 'BrandB', label: 'Brand B' },
    { value: 'BrandC', label: 'Brand C' },
];


const BudgetReport = () => {
    const navigate = useNavigate()



    const [loading, setLoading] = useState(false);

    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const theme = useSelector(state => state?.persisted?.theme);

    const customStyles = createCustomStyles(theme?.mode);
    const [report, setreport] = useState()

    const { token } = currentUser;

    // console.log(productIdd,"huhuuhuuuuuuuuuuuuuuuuu");




    // const supplier = useSelector(state => state?.nonPersisted?.supplier);












    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
    });













    const handleSubmit = (values) => {
        // console.log(values,"jj");
        // Navigate to the new page with the date as state
        navigate("/report/budgetReportbyDate", { state: { date: values } });
    };













    return (
        <DefaultLayout>
            <Breadcrumb pageName="/Report/RetailWholeSaleReport" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className='flex justify-between'>
                        <h2 className="text-xl font-semibold leading-tight">Retail WholeSale Report</h2>
                        {/* <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success dark:bg-white dark:text-slate-800`}>
                            TOTAL PRODUCTS: {pagination.totalItems}
                        </p> */}
                    </div>


                    <div className='items-center justify-center'>
                        <Formik
                            onSubmit={handleSubmit}
                            initialValues={{

                                fromDate: '',
                                toDate: ''



                            }}

                        >
                            {({ setFieldValue, values, handleBlur }) => {
                                useEffect(() => {
                                    // Check if fromDate is a valid date
                                    let fromDate = new Date(values.fromDate);

                                    if (isNaN(fromDate.getTime())) {
                                        console.error('Invalid start date:', values.fromDate);
                                        return;  // Exit the effect if the start date is invalid
                                    }

                                    console.log(fromDate, 'Original start date');

                                    // Add 1 year to the fromDate
                                    fromDate.setFullYear(fromDate.getFullYear() + 1);
                                    console.log(fromDate, 'Updated start date with 1 year added');

                                    // Set fromDate and endDate
                                    setFieldValue('fromDate', values.fromDate); // Ensure the start date is set correctly
                                    setFieldValue('toDate', fromDate.toISOString().split('T')[0]); // Set the endDate to 1 year after fromDate
                                }, [values.fromDate, setFieldValue])
                                return (
                                    <Form>



                                        <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    From Date
                                                </label>
                                                <Field
                                                    name='fromDate'
                                                    type="date"
                                                    placeholder="Enter From Date"
                                                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                />
                                            </div>


                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    To Date
                                                </label>
                                                <Field
                                                readOnly
                                                    name='toDate'
                                                    type="date"
                                                    placeholder="Enter To Date"
                                                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-center">


                                            <div>

                                                <button
                                                    type="submit"
                                                    // onClick={handleSubmit}
                                                    // onClick={() => handlegenerateCsv(values)}
                                                    className="flex  mb-4 md:w-[180px] w-[220px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center  bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
                                                >
                                                    Submit
                                                </button>
                                            </div>


                                        </div>
                                    </Form>
                                )
                            }}
                        </Formik>
                    </div>






                </div>

            </div>

        </DefaultLayout>
    )
}

export default BudgetReport
