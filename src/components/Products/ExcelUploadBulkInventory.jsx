import React, { useState } from 'react';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ADD_CONTEMPORARY, ADD_CONTEMP_WOOL, ADD_CONTEM_SAREE, ADD_COTTON, ADD_KANI, ADD_PAPERMACHIE, ADD_PASHMINA_EMB, ADD_WOOL_EMB, BASE_URL } from '../../Constants/utils';
import { useSelector } from 'react-redux';

const ExcelUploadBulkInventory = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('');
    const categories = [
        { label: 'Contemporary Pashmina', value: 'contemporary', sampleFile: '/products/downloadCp' },
        { label: 'Pashmina Embroidery', value: 'pashmina', sampleFile: '/samples/pashmina.xlsx' },
        { label: 'Kani', value: 'Kani', sampleFile: '/products/downloadCp' },
        { label: 'Wool Embroidery', value: 'woolemb', sampleFile: '/samples/pashmina.xlsx' },

        { label: 'Paper Machie', value: 'papermachie', sampleFile: '/products/downloadCp' },
        { label: 'Cotton', value: 'cotton', sampleFile: '/samples/pashmina.xlsx' },


        { label: 'Contemporary Saree', value: 'saree', sampleFile: '/samples/kani.xlsx' },
        { label: 'Contemporary Wool', value: 'contempwool', sampleFile: '/samples/cotton.xlsx' },
    ];

    const handleSubmit = async (values) => {
        if (!selectedCategory) {
            toast.error('Please select a category');
            return;
        }

        const formData = new FormData();
        formData.append('file', values.file);

        try {
            const apiEndpoints = {
                contemporary: ADD_CONTEMPORARY,
                pashmina: ADD_PASHMINA_EMB,
                kani: ADD_KANI,

                woolemb:ADD_WOOL_EMB,
                papermachie:ADD_PAPERMACHIE,
                cotton:ADD_COTTON,
                saree:ADD_CONTEM_SAREE,
                contempwool:ADD_CONTEMP_WOOL,
            
            };

            const response = await fetch(apiEndpoints[selectedCategory], {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) { 
                // `response.ok` is true for status codes in the 200–299 range

                const message = await response.json();
                const messageData=message.message
                toast.success(messageData);
            } else {
                const errorData = await response.json(); // Parse the response body as JSON
                const errorMessage = errorData.message || 'An error occurred'; // Use `message` or fallback
              
                toast.error(errorMessage); // Display the error message in a toast
            }

         
          
        } catch (error) {
            console.error(error.message,"errorrrrr");
            toast.error('An error occurred during upload.');
        }
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Products / Excel Upload For Add Product" />
            <div className="container mx-auto px-4 mb-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className="flex justify-between">
                        <h2 className="text-xl font-semibold leading-tight">Excel Upload For Bulk Inventory Upload</h2>
                        <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success dark:bg-white dark:text-slate-800">
                            Excel Upload For Bulk Inventory Upload
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
                                                                const apiEndpoints = {
                                                                    contemporary: `${BASE_URL}/products/downloadCp`,
                                                                    pashmina: `${BASE_URL}/uploadExcel/downloadPe`,
                                                                    kani: `${BASE_URL}/uploadExcel/downloadKani`,
                                                                    woolemb:`${BASE_URL}/uploadExcel/downloadWe`,
                                                                    papermachie:`${BASE_URL}/uploadExcel/downloadPaper`,
                                                                    cotton:`${BASE_URL}/uploadExcel/downloadCotton`,
                                                                    saree:`${BASE_URL}/uploadExcel/downloadSaree`,
                                                                    contempwool:`${BASE_URL}/uploadExcel/downloadContempWool`,






                                                                    
                                                                };

                                                                const endpoint = apiEndpoints[selectedCategory];

                                                                const response = await fetch(endpoint, {
                                                                    method: 'GET',
                                                                    headers: {
                                                                        Authorization: `Bearer ${token}`,
                                                                    },
                                                                });

                                                                if (!response.ok) {
                                                                    throw new Error('Failed to download the file');
                                                                }

                                                                // Get the file blob
                                                                const blob = await response.blob();

                                                                // Create a temporary download link
                                                                const url = window.URL.createObjectURL(blob);
                                                                const link = document.createElement('a');
                                                                link.href = url;
                                                                link.setAttribute(
                                                                    'download',
                                                                    `${selectedCategory}.xlsx` // Filename for the downloaded file
                                                                );

                                                                // Append to the document and trigger the download
                                                                document.body.appendChild(link);
                                                                link.click();

                                                                // Clean up
                                                                link.parentNode.removeChild(link);
                                                                window.URL.revokeObjectURL(url);
                                                            } catch (error) {
                                                                console.error('Error downloading the file:', error);
                                                                toast.error('Failed to download the sample file.');
                                                            }
                                                        }}
                                                        className="bg-green-500 mb-4 text-white py-2 px-4 rounded hover:bg-green-600"
                                                    >
                                                        Download Sample File
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

export default ExcelUploadBulkInventory;
