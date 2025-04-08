import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import { Field, Formik } from 'formik'
import { Form } from 'formik'
import { toast } from 'react-toastify';

import ReactSelect from 'react-select';
import { GET_GODOWN,GET_PRODUCTID_URL, customStyles as createCustomStyles } from '../../Constants/utils';
import { useSelector } from 'react-redux'
import Pagination from '../Pagination/Pagination'
import useProduct from '../../hooks/useProduct'

const Godown = () => {
  const theme = useSelector(state => state?.persisted?.theme);
   const { currentUser } = useSelector((state) => state?.persisted?.user);
   
  const { token } = currentUser;
  const customStyles = createCustomStyles(theme?.mode);
  const [inventory, setinventory] = useState([])
  const [invenn, setinvenn] = useState([])
//   const formattedProductId = productId.map(id => ({
//     label: id,
//     value: id
// }));
   const [prodIdOptions, setprodIdOptions] = useState([])
   const [isLoading, setisLoading] = useState(false)
   const [productIdOptions, setProductIdOptions] = useState([]);

   const getProductId = async () => {
    try {
      const response = await fetch(`${GET_PRODUCTID_URL}/processProductIds`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      const data = await response.json();
      console.log("Product data:", data);

      // Format for React Select
      const formatted = data.map(item => ({
        label: item ,
        value: item,
      }));

      // Add "View All Products" as default option
      setProductIdOptions([{ label: 'View All Products', value: null }, ...formatted]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch Product");
    }
  };

  useEffect(() => {
    getProductId();
  }, []);
   

   const [pagination, setPagination] = useState({
       totalItems: 0,
       data: [],
       totalPages: 0,
       currentPage: 1,
   });
  


   const ViewGodown = async (page, filters = {}) => {
    try {
      const response = await fetch(`${GET_GODOWN}?page=${page || 1}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(filters)
      });
  
      const data = await response.json();
      console.log("🚀 FULL RESPONSE FROM BACKEND:", data);
  
      // try this:
      const godownList = data?.content || data; // fallback if no .content
      setinvenn(godownList);
      setinventory(godownList);
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
  
   console.log(invenn,"aaaaaaaa");
   useEffect(() => {
    ViewGodown()
   }, [])

   const handleSubmit = (values) => {
    const filters = {};
  
    if (values.productId !== null && values.productId !== '') {
      filters.productId = values.productId;
    }
  
    // Reset to page 1 when applying new filters
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    ViewGodown(1, filters);
  };
  
  const handlePageChange = (newPage) => {
    console.log("Page change requested:", newPage);

    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    ViewGodown(newPage); // Correct function name and 1-indexed for user interaction
};

   

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
                        {item.productId}
                    </p>
                </td>
                

                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                    {item.location?.address}
                    </p>
                </td>
               
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {item.closingBalance}
                    </p>
                </td>
                
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    {/* <p className="flex text-gray-900 whitespace-no-wrap">
                        <FiEdit size={17} className='text-teal-500 hover:text-teal-700 mx-2' onClick={(e) => handleUpdate(item.id)} title='Edit Inventory' />  |
                        <FiTrash2 size={17} className='text-red-500 hover:text-red-700 mx-2' onClick={(e) => handleInventoryDelete(e, item?.id)} title='Delete Inventory ' />
                    </p> */}
                </td>
            </tr>
        ));
    };

  console.log(productIdOptions,"jjkkjjk");
  

  return (
    <DefaultLayout>
       <Breadcrumb pageName=" Godown/ View  Godown" />
       <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
       <div className="pt-5">
       <div className='flex justify-between'>
                        <h2 className="text-xl font-semibold leading-tight">View Godown</h2>
                        {/* <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success dark:bg-white dark:text-slate-800`}>
                            Total PO: {pagination.totalItems}
                        </p> */}
                    </div>

                    <div className='items-center justify-center'>
                        <Formik
                            initialValues={{
                                //ProductId: '',
                                productId: '',
                               
                            }}
                            
                            // onSubmit={handleSubmit}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, values }) => (
                                <Form>
                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                                        {/* <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Product Id</label>
                                            <Field
                                                name="ProductId"
                                                component={ReactSelect}
                                                styles={customStyles}
                                                //options={[{ label: 'View All Products', value: null }, ...formattedProductId]}
                                                // styles={customStyles}
                                                placeholder="Select Product Id"
                                                //value={formattedProductId.find(option => option.value === values.ProductId)}
                                                onChange={option => setFieldValue('ProductId', option ? option.value : '')}
                                            />
                                        </div> */}

{/* <div className="flex-1 min-w-[300px]">
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
                                        </div> */}
                                         <div className="flex-1 min-w-[300px]">
      <label className="mb-2.5 block text-black dark:text-white">Product Id</label>
      <Field
        name="productId"
        component={ReactSelect}
        options={productIdOptions}
        styles={customStyles}
        placeholder="Select Product Id"
        //value={productIdOptions.find(option => option.value === values.ProductId) || null}
        value={productIdOptions.find(option => option.value === values.productId) || null}
        onChange={option => setFieldValue('productId', option ? option.value : null)}
        isClearable
      />
    </div>
                                       
                                    </div>
                                    
                                    <div className="flex justify-center">
                                        <button
                                            type="submit"
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold h-12 w-[150px] rounded-lg"
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
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product Id</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th> 
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Closing Balance (Sale+Transfer)</th>
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
  )
}

export default Godown
