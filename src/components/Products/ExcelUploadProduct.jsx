import React, { useState } from 'react';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ADD_CONTEMPORARY } from '../../Constants/utils';
import { useSelector } from 'react-redux';

const ExcelUploadProduct = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('');
    const categories = [
        { label: 'Contemporary', value: 'contemporary', sampleFile: '/samples/contemporary.xlsx' },
        { label: 'Pashmina', value: 'pashmina', sampleFile: '/samples/pashmina.xlsx' },
        { label: 'Kani', value: 'kani', sampleFile: '/samples/kani.xlsx' },
        { label: 'Cotton', value: 'cotton', sampleFile: '/samples/cotton.xlsx' },
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
                pashmina: '/api/upload/pashmina',
                kani: '/api/upload/kani',
                cotton: '/api/upload/cotton',
            };

            const response = await fetch(apiEndpoints[selectedCategory], {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                toast.success('File uploaded successfully!');
            } else {
                toast.error('Failed to upload the file.');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred during upload.');
        }
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Products / Excel Upload For Add Product" />
            <div className="container mx-auto px-4 mb-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className="flex justify-between">
                        <h2 className="text-xl font-semibold leading-tight">Excel Upload For Add Product</h2>
                        <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success dark:bg-white dark:text-slate-800">
                            Excel Upload For Add Product
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
                                                Select Category
                                            </label>
                                            {categories.map((category) => (
                                                <div key={category.value} className="mb-2 flex items-center">
                                                    <input
                                                        type="radio"
                                                        id={category.value}
                                                        name="category"
                                                        value={category.value}
                                                        checked={selectedCategory === category.value}
                                                        onChange={(e) =>
                                                            setSelectedCategory(e.target.value)
                                                        }
                                                        className="mr-2"
                                                    />
                                                    <label
                                                        htmlFor={category.value}
                                                        className="text-black dark:text-white"
                                                    >
                                                        {category.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        {selectedCategory && (
                                            <>
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
                                                        onClick={() =>
                                                            window.open(
                                                                categories.find(
                                                                    (cat) => cat.value === selectedCategory
                                                                )?.sampleFile,
                                                                '_blank'
                                                            )
                                                        }
                                                        className="bg-green-500 mb-4 text-white py-2 px-4 rounded hover:bg-green-600"
                                                    >
                                                        Download Sample File
                                                    </button>
                                                </div>
                                            </>
                                        )}
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

export default ExcelUploadProduct;
