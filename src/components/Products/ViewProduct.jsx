import React, { useState, useEffect } from 'react';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import useProduct from '../../hooks/useProduct';
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import { GET_IMAGE, GET_INVENTORYLOCATION, customStyles as createCustomStyles } from '../../Constants/utils';
import { Field, Form, Formik } from 'formik';
import { IoIosAdd } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ViewProduct = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const referenceImages = [];
    const actualImages = [];

    const theme = useSelector(state => state?.persisted?.theme);
    const { Product, handleDelete, handleUpdate, handlePageChange, pagination, getProduct, productId, getProductId, getBOMData } = useProduct({ referenceImages, actualImages });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isImagesModalOpen, setisImagesModalOpen] = useState(false)

    const [Images, setImages] = useState(null)
    const [selectedBOMData, setSelectedBOMData] = useState(null);


    const [isINVENTORYModalOpen, setIsINVENTORYModalOpen] = useState(false);
    const [selectedINVENTORYData, setSelectedINVENTORYData] = useState(null);
    const [mrp, setmrp] = useState(0)








    useEffect(() => {
        getProduct();
        getProductId();
    }, []);


    const formattedProductId = productId.map(id => ({
        label: id,
        value: id
    }));
    // console.log(Product,"lololo");
    const customStyles = createCustomStyles(theme?.mode);

    const openBOMModal = (bomData) => {


        setSelectedBOMData(bomData);
        setIsModalOpen(true);
    };

    const openImageModal = (Images) => {
        console.log("image modeel before");


        setisImagesModalOpen(true);
        console.log(isImagesModalOpen, "afterimage");
        setImages(Images);

    };
    console.log(Images, "image huuuun===============================================");


    // console.log(selectedBOMData, "jijiji");

    const closeBOMModal = () => {
        setIsModalOpen(false);
        setSelectedBOMData(null);
    };


    const openINVENTORYModal = (id) => {


        const getInventory = async () => {

            try {
                const response = await fetch(`${GET_INVENTORYLOCATION}/${id}`, {
                    method: "GET",
                    headers: {
                        // "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = await response.json();


                // setLocation(data);
                setSelectedINVENTORYData(data);


            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch Product");
            }
        };

        getInventory()
            // useEffect(() => {
            //     getInventory()
            // }, [])




            ;
        setmrp(mrp)
        setIsINVENTORYModalOpen(true);
    };


    // console.log(selectedBOMData, "jijiji");

    const closeINVENTORYModal = () => {
        setIsINVENTORYModalOpen(false);
        setSelectedINVENTORYData(null);
    };

    const renderTableRows = () => {
        if (!Product || !Product.length) {
            return (
                <tr className='bg-white dark:bg-slate-700 dark:text-white'>
                    <td colSpan="6" className="px-5 py-5 border-b border-gray-200 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap text-center">No Products Found</p>
                    </td>
                </tr>
            );
        }

        const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

        const handleUpdateBom = (id) => {
            navigate(`/product/updateBom/${id}`)


        }

        const handleUpdateInventory = (id) => {
            navigate(`/product/updateInventory/${id}`)
        }

        console.log(Product, "prooodudctcttc");


        return Product.map((item, index) => (
            <tr key={index} className='bg-white dark:bg-slate-700 dark:text-white'>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{startingSerialNumber + index}</p>
                </td>
                <td className="px-1 py-5 border-b border-gray-200 text-sm">
                    <div className="relative group">
                        <img
                            className="h-[50px] w-[50px] rounded-full transition-transform duration-500 ease-in-out transform group-hover:scale-[2] group-hover:shadow-2xl"
                            crossOrigin="use-credentials"
                            src={`${GET_IMAGE}/products/getimages/${item?.images[0]?.referenceImage}`}
                            alt="Product Image"
                        />
                    </div>
                </td>
                <td className="px-2 py-5  md:w-[50px] border-b border-gray-200 text-xs">
                    <span onClick={() => openImageModal(item?.images)} className="bg-green-100 text-green-800  font-medium me-2 px-1 py-0.5 rounded dark:bg-gray-700 text-center dark:text-green-400 border border-green-400 cursor-pointer "> VIEW IMG</span>

                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item?.productId?.substring(0, 14) + ".."}</p>

                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item.productGroup?.productGroupName.substring(0, 10) + ".."}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item.productCategory?.productCategoryName.substring(0, 5) + ".."}</p>
                </td>

                {/* BOM View Button */}
                {
                    item?.bom ?
                        <td className=" py-5 border-b border-gray-200 text-sm">
                            {/* <button
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold h-10 w-[100px] rounded-lg"
                                onClick={() => openBOMModal(item.bom)}
                            > */}
                            <div className='flex flex-col gap-2'>
                                <span onClick={() => openBOMModal(item.bom)} className="bg-green-100 text-green-800 text-[10px] font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 text-center dark:text-green-400 border border-green-400 cursor-pointer w-[100px]"> VIEW BOM</span>
                                <span onClick={() => handleUpdateBom(item?.bom?.id)} className=" bg-red-100 text-red-800 text-[10px] font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 text-center dark:text-red-400 border border-red-400 cursor-pointer w-[100px]">UPDATE BOM</span>
                            </div>

                            {/* </button> */}
                        </td>
                        :
                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                            <IoIosAdd size={30} onClick={(e) => navigate(`/product/addBom/${item.id}`)} />
                        </td>
                }



                {
                    item?.inventoryStatus ?
                        <td className=" py-5 border-b border-gray-200 text-sm">
                            {/* <button
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold h-10 w-[100px] rounded-lg"
                                onClick={() => openBOMModal(item.bom)}
                            > */}
                            <div className='flex flex-col gap-2 mx-3'>
                                <span onClick={() => openINVENTORYModal(item.id)} className="bg-green-100 text-green-800 text-[10px] font-medium me-2 text-center py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-pointer w-[110px]"> VIEW INVENTORY</span>
                                <span onClick={() => handleUpdateInventory(item?.id)} className=" bg-red-100 text-red-800 text-[10px] font-medium me-2  text-center py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400 cursor-pointer w-[110px]">UPDATE INVENTORY</span>
                            </div>

                            {/* </button> */}
                        </td>
                        :
                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                            <IoIosAdd size={30} onClick={(e) => navigate(`/product/addInventoryLocation/${item.id}`)} />
                        </td>
                }

                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="flex text-gray-900 whitespace-no-wrap">
                        <FiEdit size={17} className='text-teal-500 hover:text-teal-700 mx-2' onClick={(e) => handleUpdate(e, item)} title='Edit Product' />  |
                        <FiTrash2 size={17} className='text-red-500 hover:text-red-700 mx-2' onClick={(e) => handleDelete(e, item?.id)} title='Delete Product' />
                    </p>
                </td>
            </tr>
        ));
    };

    const handleSubmit = (values) => {
        const filters = {
            productId: values.ProductId || undefined,
        };
        getProduct(pagination.currentPage, filters);
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Products/ View Products" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className='flex justify-between'>
                        <h2 className="text-xl font-semibold leading-tight">View Products</h2>
                        <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success dark:bg-white dark:text-slate-800`}>
                            TOTAL PRODUCTS: {pagination.totalItems}
                        </p>
                    </div>

                    {/* BOM Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-95 flex justify-center items-center  z-50">
                            <div className="bg-slate-100 dark:bg-slate-500 border border-b-1 rounded p-6 shadow-lg md:ml-[100px]  w-[350px]  md:w-[700px] md:h-[400px] mt-[50px]">
                                <div className="text-right">
                                    <button color='red' onClick={closeBOMModal} className="text-red-500  text-xl  font-bold">&times;</button>
                                </div>
                                <h2 className="text-2xl text-center mb-4 font-extrabold">BOM Details</h2>
                                <div className="md:inline-block md:min-w-full overflow-scroll w-[320px] shadow-md rounded-lg md:overflow-hidden">
                                    <table className="min-w-full leading-normal">
                                        <thead>
                                            <tr className='px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" style={{ minWidth: '250px' }}>PRODUCT LIST</th>
                                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">UNIT OF MEASURE</th>
                                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">QUANTITY</th>

                                            </tr>
                                        </thead>
                                        <tbody>


                                            {selectedBOMData?.productMaterials?.map((row, index) => (
                                                <tr key={row.id}>
                                                    <td className="px-2 py-2 border-b dark:text-white">
                                                        <p>{row?.products?.productDescription}</p>

                                                    </td>
                                                    <td className="px-2 py-2 border-b dark:text-white">
                                                        {row.unitOfMeasurement}
                                                    </td>
                                                    <td className="px-2 py-2 border-b dark:text-white">
                                                        {row.quantity}

                                                    </td>
                                                    {/* <td className="px-2 py-2 border-b">
                                                        <FiTrash2 size={17} className='text-red-500 hover:text-red-700 mx-2' title='Delete BOM' />

                                                    </td> */}

                                                </tr>
                                            ))}


                                        </tbody>
                                    </table>
                                </div>

                                {/* <pre>{JSON.stringify(selectedBOMData, null, 2)}</pre> */}
                            </div>
                        </div>
                    )}

                    {isImagesModalOpen && (


                        <div className="fixed inset-0 bg-gray-500 bg-opacity-95 flex justify-center items-center z-50">
                            <div className="bg-slate-100 border border-b-1 rounded p-6 shadow-lg ml-[200px] w-[870px] h-[400px] mt-[60px] dark:bg-slate-600 overflow-auto">
                                <div className="text-right">
                                    <button onClick={() => setisImagesModalOpen(false)} className="text-red-500 text-xl font-bold">&times;</button>
                                </div>
                                <h2 className="text-2xl text-center mb-4 font-extrabold">LIST OF IMAGES</h2>

                                {/* Reference Images Section */}
                                <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden mb-4">
                                    <h1>Reference Images</h1>
                                    <div className="flex overflow-x-auto space-x-4 py-2">
                                        {
                                            Images.map((image, index) => {
                                                // Check if the referenceImage is not null or undefined before rendering
                                                if (image?.referenceImage) {
                                                    return (
                                                        <img
                                                            key={index}
                                                            className="h-[200px] w-[200px] rounded-lg transition-transform duration-500 ease-in-out transform group-hover:scale-[2] group-hover:shadow-2xl"
                                                            crossOrigin="use-credentials"
                                                            src={`${GET_IMAGE}/products/getimages/${image.referenceImage}`}
                                                            alt="Product Image"
                                                        />
                                                    );
                                                }
                                                return null; // Return null if referenceImage is null or undefined
                                            })
                                        }
                                    </div>
                                </div>

                                {/* Actual Images Section */}
                                <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden mb-4">
                                    <h1>Actual Images</h1>
                                    <div className="flex overflow-x-auto space-x-4 py-2">
                                        {
                                            Images.map((image, index) => {
                                                // Check if the actualImage is not null or undefined before rendering
                                                if (image?.actualImage) {
                                                    return (
                                                        <img
                                                            key={index}
                                                            className="h-[200px] w-[200px] rounded-lg transition-transform duration-500 ease-in-out transform group-hover:scale-[2] group-hover:shadow-2xl"
                                                            crossOrigin="use-credentials"
                                                            src={`${GET_IMAGE}/products/getimages/${image.actualImage}`}
                                                            alt="Product Image"
                                                        />
                                                    );
                                                }
                                                return null; // Return null if actualImage is null or undefined
                                            })
                                        }
                                    </div>
                                </div>

                                {/* <pre>{JSON.stringify(selectedBOMData, null, 2)}</pre> */}
                            </div>
                        </div>




                    )}


                    {/* Inventory Modal */}
                    {isINVENTORYModalOpen && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-95 flex justify-center items-center  z-50 ">
                            <div className="bg-slate-100 border border-b-1 rounded p-6 shadow-lg ml-[200px]  w-[870px] h-[400px] mt-[60px] dark:bg-slate-600">
                                <div className="text-right">
                                    <button onClick={closeINVENTORYModal} className="text-red-500 text-xl  font-bold">&times;</button>
                                </div>
                                <h2 className="text-2xl text-center mb-4 font-extrabold">INVENTORY  DETAILS</h2>
                                <div className="inline-block min-w-full shadow-md rounded-lg overflow-auto">
                                    <table className="min-w-full leading-normal overflow-auto">
                                        <thead>
                                            <tr className='px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" >LOCATION</th>
                                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">OPENING BALANCE</th>

                                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rate</th>
                                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>


                                            {selectedINVENTORYData && (
                                                <>
                                                    {selectedINVENTORYData.map((row, index) => (
                                                        <tr key={row.id}>
                                                            <td className="px-2 py-2 border-b dark:text-white">
                                                                <p>{row?.location?.address}</p>
                                                            </td>
                                                            <td className="px-2 py-2 border-b dark:text-white">
                                                                <p>{row?.openingBalance}</p>
                                                            </td>
                                                            <td className="px-2 py-2 border-b dark:text-white">
                                                                {row.rate}
                                                            </td>
                                                            <td className="px-2 py-2 border-b dark:text-white">
                                                                {row.value}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td
                                                            className="px-2 py-2 border-t font-bold text-black dark:text-white"
                                                            colSpan={3}
                                                        >
                                                            Total Values
                                                        </td>
                                                        <td className="px-2 py-2 border-t font-bold text-black dark:text-white">
                                                            {selectedINVENTORYData
                                                                .reduce((total, currentRow) => total + (currentRow.value || 0), 0)
                                                                .toFixed(2)}
                                                        </td>
                                                        <td className="px-2 py-2 border-t"></td>
                                                    </tr>
                                                </>
                                            )}



                                        </tbody>
                                    </table>
                                </div>

                                {/* <pre>{JSON.stringify(selectedBOMData, null, 2)}</pre> */}
                            </div>
                        </div>
                    )}

                    <div className='items-center justify-center'>
                        <Formik
                            initialValues={{
                                ProductId: '',
                            }}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, values }) => (
                                <Form>
                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Product Id</label>
                                            <Field
                                                name="ProductId"
                                                component={ReactSelect}
                                                options={[{ label: 'View All Products', value: null }, ...formattedProductId]}
                                                styles={customStyles}
                                                placeholder="Select Product Id"
                                                value={formattedProductId.find(option => option.value === values.ProductId)}
                                                onChange={option => setFieldValue('ProductId', option ? option.value : '')}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <button
                                            type="submit"
                                            className="flex md:w-[240px] w-[220px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center  bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
                                        >
                                            Search
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>

                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr className='bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" >SNO</th>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">IMAGE</th>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider md:w-[500px]">View Images</th>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">PRODUCT ID</th>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">PRODUCT GROUP</th>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">CATEGORY</th>
                                        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[600px] md:w-[120px]">ADD BOM </th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ">ADD INVENTORY </th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTableRows()}
                                </tbody>
                            </table>
                        </div>
                        <Pagination totalPages={pagination.totalPages} currentPage={pagination.currentPage} handlePageChange={handlePageChange} />
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default ViewProduct;
