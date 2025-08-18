import React, { useState } from 'react';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ADD_CONTEMPORARY, ADD_CONTEMP_WOOL, ADD_CONTEM_SAREE, ADD_COTTON, ADD_KANI, ADD_PAPERMACHIE, ADD_PASHMINA_EMB, ADD_WOOL_EMB, BASE_URL } from '../../Constants/utils';
import { useSelector } from 'react-redux';

const ExcelUploadLedger = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const navigate = useNavigate();

 

    const handleSubmit = async (values) => {


        const formData = new FormData();
        formData.append('file', values.file);

        try {
            const apiEndpoints = `${BASE_URL}/ledger/upload`

            const response = await fetch(apiEndpoints, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                // `response.ok` is true for status codes in the 200–299 range

                const message = await response.json();
                const messageData = message.message
                toast.success(messageData);
            } else {
                const errorData = await response.json(); // Parse the response body as JSON
                const errorMessage = errorData.message || 'An error occurred'; // Use `message` or fallback

                toast.error(errorMessage); // Display the error message in a toast
            }



        } catch (error) {
            console.error(error.message, "errorrrrr");
            toast.error('An error occurred during upload.');
        }
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Products / Excel Upload For Bulk Add Ledger" />
            <div className="container mx-auto px-4 mb-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className="flex justify-between">
                        <h2 className="text-xl font-semibold leading-tight">Excel Upload For Bulk Add Ledger</h2>
                        <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success dark:bg-white dark:text-slate-800">
                            Excel Upload For Bulk Add Ledger
                        </p>
                    </div>
                    <div className="items-center justify-center">
                        <Formik
                            initialValues={{ file: null }}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue }) => (
                                <Form>
                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">


                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Upload Excel File
                                            </label>
                                            <input
                                                type="file"
                                                name="file"
                                                accept=".xlsx, .xls"
                                                onChange={(event) =>
                                                    setFieldValue('file', event.currentTarget.files[0])
                                                }
                                                className="block w-full text-sm text-slate-500
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-blue-50 file:text-blue-700
                                                    hover:file:bg-blue-100"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-[300px]">
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    try {
                                                        const apiEndpoints = `${BASE_URL}/ledger/downloadLedger`;

                                                        const response = await fetch(apiEndpoints, {
                                                            method: 'GET',
                                                            headers: {
                                                                Authorization: `Bearer ${token}`,
                                                            },
                                                        });

                                                        // Check if the response is not OK (e.g., 4xx or 5xx status)
                                                        if (!response.ok) {
                                                            throw new Error('Failed to download the file');
                                                        }

                                                        // Get the file blob
                                                        const blob = await response.blob();

                                                        // Create a temporary download link
                                                        const url = window.URL.createObjectURL(blob);
                                                        const link = document.createElement('a');
                                                        link.href = url;

                                                        // Set the filename for the downloaded file
                                                        link.setAttribute('download', 'LedgerSample.xlsx'); // You can customize the filename here

                                                        // Append to the document and trigger the download
                                                        document.body.appendChild(link);
                                                        link.click();

                                                        // Clean up
                                                        document.body.removeChild(link);
                                                        window.URL.revokeObjectURL(url);

                                                        // Show success toast message
                                                        toast.success('File downloaded successfully!');
                                                    } catch (error) {
                                                        console.error('Error downloading the file:', error);
                                                        toast.error('Failed to download the sample file.');
                                                    }
                                                }}
                                                className="bg-green-500 mb-4 text-white py-2 px-4 rounded hover:bg-green-600"
                                            >
                                                Download Sample File For Bulk Add Ledger
                                            </button>

                                        </div>

                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 mb-4 text-white py-2 px-4 rounded hover:bg-blue-600"
                                    >
                                        Upload File
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default ExcelUploadLedger;
