import React, { useState, useEffect } from 'react';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import useInventory from '../../hooks/useInventory';
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import { GET_INVENTORY, customStyles as createCustomStyles } from '../../Constants/utils';
import { Field, Form, Formik } from 'formik';
import useProduct from '../../hooks/useProduct';
import { toast } from 'react-toastify';
import { useNavigate, useNavigation } from 'react-router-dom';


const ViewProductsInventory = () => {

    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    // const location = useSelector(state => state?.nonPersisted?.location);
    // const description = useSelector(state => state?.nonPersisted?.material);
    const theme = useSelector(state => state?.persisted?.theme);
const navigate = useNavigate()

    const [locationValue, setLocationValue] = useState(null);
    const [descriptionValue, setDescriptionValue] = useState(null);
    const customStyles = createCustomStyles(theme?.mode);

    useEffect(() => {


     
    }, [])
    const referenceImages = [];
    const actualImages = [];

    // const { inventoryMaterial, ViewInventory, handleDelete, handleUpdate, handlePageChange, pagination } = useInventoryMaterial
    const {  inventoryproductId,handleInventoryDelete, getInventoryProductId  ,getLocation,Location } = useProduct({ referenceImages, actualImages });
const [invenn, setinvenn] = useState([])
    const [inventory, setinventory] = useState([])


const [pagination, setPagination] = useState({
    totalItems: 0,
    data: [],
    totalPages: 0,
    currentPage: 1,
});


useEffect(() => {
    getLocation(),
    getInventoryProductId();
}, []);


console.log(Location,inventoryproductId,"proooooooooo");

const formattedProductId = inventoryproductId.map(id => ({
    label: id,
    value: id
}));
const formattedLocation = Location.map(id => ({
    label: id.address,
    value: id.address
}));
const ViewInventory = async (page, filters = {}) => {
    console.log("iam here");
    console.log(filters,"filllllllll");
    try {
        const response = await fetch(`${GET_INVENTORY}?page=${page||1}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(filters)
        });
        const data = await response.json();
        console.log(data,"pr datatata")
        setinvenn(data.content)

        setinventory(data.content);
        setPagination({
            totalItems: data?.totalElements,
            data: data?.content,
            totalPages: data?.totalPages,
            currentPage: data?.number + 1,
            itemsPerPage: data.size
        });
    } catch (error) {
        console.log(error);
        toast.error("Failed to fetch Product");
    }
};
console.log(invenn,"umershahk");

useEffect(() => {
 ViewInventory()
}, [])



const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    ViewInventory(newPage); // API is 0-indexed for pages
};

const handleUpdate=(id)=>{
    console.log(id,"kikikiki");
    navigate(`/inventory/updateInventory/${id}`)

}



    // const [locationSel, setLocationSel] = useState([]);
    // const [descriptionSel, setDescriptionSel] = useState([]);

    // useEffect(() => {
    //     if (location?.data) {
    //         setLocationSel(formatOptions(location.data, 'address', 'id', 'locationObject'));
    //     }
    //     if (description?.data) {
    //         setDescriptionSel(formatOptions(description.data, 'description', 'id', 'materialObject'));
    //     }
    // }, [location, description]);

    // const customStyles = createCustomStyles(theme?.mode);

    // const formatOptions = (data, labelKey, valueKey, objectKey, placeholder) => {
    //     return [{ label: "Select" , value: ''}]
    //         .concat(data ? data.map(item => ({
    //             value: item[labelKey],
    //             label: item[labelKey],
    //             [objectKey]: item
    //         })) : []);
    // };


   

    // const handleSearchChange = () => {
    //     // Get the selected values
    //     const locationLabel = locationValue ? locationValue.value : null;
    //     const descriptionLabel = descriptionValue ? descriptionValue.value : null;
        
    //     console.log(locationLabel,"hey");
    //     // Call ViewInventory with the selected values, or no filter if both are null
    //     ViewInventory(1, locationLabel, descriptionLabel);
    // };

    // const renderTableRows = () => {
    //     if (!inventory ) {
    //         return (
    //             <tr className='bg-white dark:bg-slate-700 dark:text-white'>
    //                 <td colSpan="6" className="px-5 py-5 border-b border-gray-200 text-sm">
    //                     <p className="text-gray-900 whitespace-no-wrap text-center">No Data Found</p>
    //                 </td>
    //             </tr>
    //         );
    //     }

    //     // const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;
    //     const startingSerialNumber = 0

    //     console.log(pagination,"pagg");

    //    console.log(startingSerialNumber,"starrrrr");
    //    console.log(inventory,"umer shah");

    const renderTableRows = () => {
        if (!inventory || inventory.length === 0) {
            return (
                <tr className="bg-white dark:bg-slate-700 dark:text-white">
                    <td colSpan="12" className="px-5 py-5 border-b border-gray-200 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap text-center">No Data Found</p>
                    </td>
                </tr>
            );
        }
    
        const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage;
    console.log(inventory,"imvennnnnnnnnnnnnnnnnnnnnnnnnnnn");
        
        
      return    inventory?.map((item, index) => (
            <tr key={index} className='bg-white dark:bg-slate-700 dark:text-white'>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {startingSerialNumber + index+1}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {item.productDescription}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {item.productId}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {item.location.address}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {item.openingBalance}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {item.purchase}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {item.sale}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {item.branchTransferInwards}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {item.branchTransferOutwards}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {item.closingBalance}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {item.inProgressOrders}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="flex text-gray-900 whitespace-no-wrap">
                        <FiEdit size={17} className='text-teal-500 hover:text-teal-700 mx-2' onClick={(e) => handleUpdate(item.id)} title='Edit Inventory' />  |
                        <FiTrash2 size={17} className='text-red-500 hover:text-red-700 mx-2' onClick={(e) => handleInventoryDelete(e, item?.id)} title='Delete Inventory ' />
                    </p>
                </td>
            </tr>
        ));
    };
    const handleSubmit = (values) => {
        const filters = {
            productId: values.ProductId || undefined,
            address:values.address||undefined
        };
        ViewInventory(pagination.currentPage, filters);
    };


    return (
        <DefaultLayout>
            <Breadcrumb pageName=" Inventory/ View  Inventory" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                     <div className='flex flex-row items-center justify-between w-full'>
                        <h2 className="text-xl text-slate-500 font-semibold w-full flex items-center justify-between">
                            <span>View INVENTORY</span>
                            <span className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/20 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800/30 text-sm font-semibold text-blue-700 dark:text-blue-300 ml-4">
                                COUNT: {pagination.totalItems}
                            </span>
                        </h2>
                    </div>
                    <div className='items-center justify-center'>
                        <Formik
                            initialValues={{
                                ProductId: '',
                                address:""
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
                                                styles={customStyles}
                                                options={[{ label: 'View All Products', value: null }, ...formattedProductId]}
                                                // styles={customStyles}
                                                placeholder="Select Product Id"
                                                value={formattedProductId.find(option => option.value === values.ProductId)}
                                                onChange={option => setFieldValue('ProductId', option ? option.value : '')}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Location</label>
                                            <Field
                                                name="address"
                                                component={ReactSelect}
                                                options={[{ label: 'View All Locations', value: null }, ...formattedLocation]}
                                                styles={customStyles}
                                                placeholder="Select Location"
                                                value={formattedLocation.find(option => option.value === values.Location)}
                                                onChange={option => setFieldValue('address', option ? option.value : '')}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-center">
                                        <button
                                            type="submit"
                                            className="bg-primary hover:bg-blue-600 text-white font-bold h-10 w-[150px] rounded-lg"
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
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SNO</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product Desc.</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product Id</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Opening Balance</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Purchase</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sale</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Branch Transfer Inward</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Branch Transfer Outward</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Closing Balance (Sale+Transfer)</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">In Progress Orders</th>

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

export default ViewProductsInventory;
