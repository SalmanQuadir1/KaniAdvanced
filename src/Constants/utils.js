export const BASE_URL = 'http://localhost:8081';
export const SIGNIN_URL = `${BASE_URL}/api/v1/auth/signin`;

//Unit Url's
export const ADD_UNIT_URL = `${BASE_URL}/unit/addUnit`;
export const GET_UNIT_URL = `${BASE_URL}/unit/search`;
export const UPDATE_UNIT_URL = `${BASE_URL}/unit/updateUnit`;
export const VIEW_ALL_UNITS = `${BASE_URL}/unit/viewAll`;
export const DELETE_UNIT_URL = `${BASE_URL}/unit/deleteUnit/`;
//BOM

export const ADDBOM=`${BASE_URL}/bom`
export const VIEWBOM=`${BASE_URL}/bom`
export const UPDATEBOM=`${BASE_URL}/bom/update`
//Location Url's
export const ADD_LOCATION_URL = `${BASE_URL}/location/add`;
export const GET_LOCATION_URL = `${BASE_URL}/location/all`;
export const UPDATE_LOCATION_URL = `${BASE_URL}/location/update`;
export const VIEW_ALL_LOCATIONS = `${BASE_URL}/location/viewAll`;
export const DELETE_LOCATION_URL = `${BASE_URL}/location/delete/`;



// add location inventory

export const ADD_LOCATIONINVENTORY_URL = `${BASE_URL}/productInventory`;

export const GET_INVENTORYLOCATION = `${BASE_URL}/productInventory/getByProduct`;
export const DELETEINVENTORY_PRODUCT_URL = `${BASE_URL}/productInventory/delete/`;

export const GETDESCRIPTIONS = `${BASE_URL}/products/all-products`;

//inventory

export const GET_INVENTORY = `${BASE_URL}/productInventory/search`;




// Supplier Urls's
export const ADD_SUPPLIER_URL = `${BASE_URL}/supplier/addSupplier`;
export const GET_SUPPLIER_URL = `${BASE_URL}/supplier/viewAll`;
export const VIEW_ALL_SUPPLIER_URL = `${BASE_URL}/supplier/getAll`;
export const GET_SUPPLIER_ID_URL = `${BASE_URL}/supplier/getSupplier`;
export const UPDATE_SUPPLIER_URL = `${BASE_URL}/supplier/updateSupplier`;
export const DELETE_SUPPLIER_URL = `${BASE_URL}/supplier/deleteSupplier/`;


//Material Url's
export const ADD_MATERIAL_URL = `${BASE_URL}/material/add`;
export const GET_MATERIAL_URL = `${BASE_URL}/material/getAll`;
export const VIEW_ALL_MATERIAL_URL = `${BASE_URL}/material/viewAll`;
export const UPDATE_MATERIAL_URL = `${BASE_URL}/material/update`;
export const DELETE_MATERIAL_URL = `${BASE_URL}/material/delete/`;

// material po

export const ADD_MATERIALPO_URL = `${BASE_URL}/purchaseOrder`;
export const GET_MATERIALPO_BY_ID_URL = `${BASE_URL}/purchaseOrder`;
export const GET_MATERIALPO_URL = `${BASE_URL}/purchaseOrder/search`;
export const UPDATE_MATERIALPO_URL = `${BASE_URL}/purchaseOrder/updatePurchase`;
export const DELETE_MATERIALPO_URL = `${BASE_URL}/purchaseOrder/`;

//signup

export const SIGNUPURL = `${BASE_URL}/api/v1/auth/signup`;
export const ROLESURL = `${BASE_URL}/user/roles`;

//color url's
export const ADD_COLOR_URL = `${BASE_URL}/colors`
export const DELETE_COLOR_URL = `${BASE_URL}/colors`
export const UPDATE_COLOR_URL = `${BASE_URL}/colors`
export const GET_COLOR_URL = `${BASE_URL}/colors`
export const GET_COLORAll_URL = `${BASE_URL}/colors/viewAll`

//create Inventory Material
export const ADD_INVENTORY_URL = `${BASE_URL}/inventory`
export const GET_INVENTORY_URL = `${BASE_URL}/inventory/search`
export const UPDATE_INVENTORY_URL = `${BASE_URL}/inventory`
export const GET_INVENTORYBYID_URL = `${BASE_URL}/inventory`
export const DELETE_INVENTORY_URL = `${BASE_URL}/inventory`



//stock journel url
export const ADD_STOCKJOURNEL_URL = `${BASE_URL}/stockjournal`

export const GET_STOCK_URL = `${BASE_URL}/stockjournal/search`
export const GET_STOCKBYID_URL = `${BASE_URL}/stockjournal`
export const UPDATE_STOCK_URL = `${BASE_URL}/stockjournal`
export const DELETE_STOCK_URL = `${BASE_URL}/stockjournal/delete`



//product group 
export const ADD_PRODUCT_GROUP_URL = `${BASE_URL}/productgroup`;
export const GET_PRODUCT_GROUP_URL = `${BASE_URL}/productgroup`;

export const UPDATE_PRODUCT_GROUP_URL = `${BASE_URL}/productgroup`;
export const VIEW_ALL_PRODUCT_GROUP_URL = `${BASE_URL}/productgroup/viewAll`;
export const DELETE_PRODUCT_GROUP_URL = `${BASE_URL}/productgroup/`;

//Currency
export const ADD_CURRENCY_URL = `${BASE_URL}/currency`;
export const GET_CURRENCY_URL = `${BASE_URL}/currency`;
export const UPDATE_CURRENCY_URL = `${BASE_URL}/currency`;
export const VIEW_ALL_CURRENCY = `${BASE_URL}/currency/viewAll`;
export const DELETE_CURRENCY_URL = `${BASE_URL}/currency/`;

//Size
export const ADD_SIZE_URL = `${BASE_URL}/sizes`;
export const GET_SIZE_URL = `${BASE_URL}/sizes`;
export const UPDATE_SIZE_URL = `${BASE_URL}/sizes`;
export const VIEW_ALL_SIZE = `${BASE_URL}/sizes/viewAll`;
export const DELETE_SIZE_URL = `${BASE_URL}/sizes/`;

//Design
export const ADD_DESIGN_URL = `${BASE_URL}/design`;
export const GET_DESIGN_URL = `${BASE_URL}/design`;
export const UPDATE_DESIGN_URL = `${BASE_URL}/design`;
export const VIEW_ALL_DESIGN = `${BASE_URL}/design/viewAll`;
export const DELETE_DESIGN_URL = `${BASE_URL}/design/`;

//pRODUCT CATEGORY
export const ADD_PRODUCTCATEGORY_URL = `${BASE_URL}/product-category`;
export const GET_PRODUCTCATEGORY_URL = `${BASE_URL}/product-category`;
export const UPDATE_PRODUCTCATEGORY_URL = `${BASE_URL}/product-category`;
export const VIEW_ALL_PRODUCTCATEGORY = `${BASE_URL}/product-category/viewAll`;
export const DELETE_PRODUCTCATEGORY_URL = `${BASE_URL}/product-category/`;

//CUSTOMER GROUP
export const ADD_CUSTOMERGROUP_URL = `${BASE_URL}/customer-group`;
export const GET_CUSTOMERGROUP_URL = `${BASE_URL}/customer-group`;
export const UPDATE_CUSTOMERGROUP_URL = `${BASE_URL}/customer-group`;
export const GET_CUSTOMER_ID_URL = `${BASE_URL}/customer`;
export const VIEW_ALL_CUSTOMERGROUP = `${BASE_URL}/customer-group`;
export const DELETE_CUSTOMERGROUP_URL = `${BASE_URL}/customer-group/`;

//STYLE
export const ADD_STYLE_URL = `${BASE_URL}/styles`;
export const GET_STYLE_URL = `${BASE_URL}/styles`;
export const UPDATE_STYLE_URL = `${BASE_URL}/styles`;
export const VIEW_ALL_STYLE = `${BASE_URL}/styles/viewAll`;
export const DELETE_STYLE_URL = `${BASE_URL}/styles/`;


//STYLE
export const ADD_ORDERTYPE_URL = `${BASE_URL}/orderType`;
export const GET_ORDERTYPE_URL = `${BASE_URL}/orderType`;
export const UPDATE_ORDERTYPE_URL = `${BASE_URL}/orderType`;
export const VIEW_ALL_ORDERTYPE = `${BASE_URL}/orderType/viewAll`;
export const DELETE_ORDERTYPE_URL = `${BASE_URL}/orderType/`;



//BUDGET
export const ADD_BUDGET_URL = `${BASE_URL}/budget`;
export const GET_BUDGET_URL = `${BASE_URL}/budget`;
export const UPDATE_BUDGET_URL = `${BASE_URL}/budget`;
export const VIEW_ALL_BUDGET = `${BASE_URL}/budget/viewAll`;
export const DELETE_BUDGET_URL = `${BASE_URL}/budget/`;


//BUDGET
export const ADD_CUSTOMER_URL = `${BASE_URL}/customer`;
export const GET_CUSTOMER_URL = `${BASE_URL}/customer`;

export const UPDATE_CUSTOMER_URL = `${BASE_URL}/customer`;
export const VIEW_ALL_CUSTOMER = `${BASE_URL}/customer/viewAll`;


export const DOWNLOAD_REPORT = `${BASE_URL}/report/searchReport`;
export const DOWNLOADPRODUCT_REPORT = `${BASE_URL}/report/downloadProductCsv`;

export const DOWNLOADCUSTOMER_REPORT = `${BASE_URL}/report/downloadCustomerCsv`;

export const DOWNLOADINPROGRESSORDERS_REPORT = `${BASE_URL}/report/downloadInProgressPdf`;
export const DOWNLOADPENDINGFINNCIALORDERS_REPORT = `${BASE_URL}/report/downloadPendingPdf`;




export const DOWNLOADCSV_REPORT = `${BASE_URL}/report/downloadCsv`;
export const DOWNLOADPENDINGPDFBYDATE_REPORT = `${BASE_URL}/report/downloadPendingPdf`;
export const DOWNLOADINPROGRESSBYDATE_REPORT = `${BASE_URL}/report/downloadInProgressPdf`;





export const DELETE_CUSTOMER_URL = `${BASE_URL}/customer/`;


//PRODUCT
export const ADD_PRODUCT_URL = `${BASE_URL}/products/add-product`;
export const GET_PRODUCTSID_URL = `${BASE_URL}/products/processProductIds`;

export const GET_PRODUCT_URL = `${BASE_URL}/products/search`;


export const GET_PRODUCTBYID_URL = `${BASE_URL}/products`;
export const UPDATE_PRODUCT_URL = `${BASE_URL}/products/update-product`;
export const VIEW_ALL_PRODUCT = `${BASE_URL}/products/viewAll`;
export const DELETE_PRODUCT_URL = `${BASE_URL}/products/`;
export const GET_PRODUCTID_URL = `${BASE_URL}/products`;

export const GET_PRODUCTIDD_URL = `${BASE_URL}/products`;


export const GET_PRODUCTIDDD_URL = `${BASE_URL}/order`;

//ORDER
export const VIEW_ALL_ORDERS = `${BASE_URL}/order/search`;
   
export const VIEW_CREATED_ORDERS = `${BASE_URL}/order/searchCreated`; 
export const EDIT_CREATED_ORDERS = `${BASE_URL}/order/searchCreatedEditOrder`; 



export const VIEW_ALLACCEPTED_ORDERS = `${BASE_URL}/order/searchAccepted`;  

export const VIEW_PARTIALLYAPPROVED_ORDERS = `${BASE_URL}/order/searchApprovedAndAccepted`;

export const VIEW_APPROVED_ORDERS = `${BASE_URL}/order/searchApproved`; 

export const VIEW_CANCELLED_ORDERS = `${BASE_URL}/order/searchCancel`; 
export const VIEW_REPORT = `${BASE_URL}/report/search`; 

export const VIEW_ORDERSHIPPING_ORDERS = `${BASE_URL}/order/searchShippingDate`; 


export const VIEW_NEEDMODIFICATION_ORDERS = `${BASE_URL}/order/searchModification`; 
export const VIEW_RECIEVEDQUANTITY_ORDERS = `${BASE_URL}/order/searchEditReceivedQty`; 

export const VIEW_PARTIALLYCLOSED_ORDERS = `${BASE_URL}/order/searchPartiallyClosed`; 


export const VIEW_PARTIALLYCREATED_ORDERS = `${BASE_URL}/order/searchCreatedAndAccepted`; 

export const VIEW_CLOSED_ORDERS = `${BASE_URL}/order/searchClosed`; 

export const VIEW_CHALLAN_ORDERS = `${BASE_URL}/order/searchUpdateChallan`; 
export const VIEW_EXPECTEDDATE_ORDERS = `${BASE_URL}/order/searchSupplierData`; 
export const VIEW_RECIEVINGQTY_ORDERS = `${BASE_URL}/order/searchSupplierReceiving`; 



export const VIEW_PENDING_ORDERS = `${BASE_URL}/order/searchPending`; 
export const VIEW_REJECTED_ORDERS = `${BASE_URL}/order/searchRejected`; 



export const VIEW_PARTIALLYPENDING_ORDERS = `${BASE_URL}/order/searchPendingPartially`; 
export const VIEW_FORCEDCLOSURE_ORDERS = `${BASE_URL}/order/searchForcedClosure`; 
export const UPDATE_ORDERCREATED_ALL= `${BASE_URL}/order/updateOrderProductsAccepted`; 
export const UPDATE_CANCELLEDORDER_ALL= `${BASE_URL}/order/updateOrderProductsCancelled`; 

export const UPDATE_ORDERCREATEDDATE= `${BASE_URL}/order/updateShipDate`; 

export const UPDATE_ORDERPRODUCT_ALL= `${BASE_URL}/order/orderProducts`; 
export const VIEW_ORDERPRODUCT_ALL= `${BASE_URL}/order/orderProduct`; 
export const UPDATE_ISSUECHALLAN= `${BASE_URL}/order/orderProductsIssue`; 

export const UPDATE_CHALLAN= `${BASE_URL}/order/challan`; 
export const UPDATE_EXPECTEDDATE= `${BASE_URL}/order/updateOrderProductExpectDate`; 
export const UPDATE_ORDERRECIEVED= `${BASE_URL}/order/orderProductRecievDetail`; 











export const VIEW_ALL_PRODID = `${BASE_URL}/order/viewCreatedProductId`;
export const VIEW_ALL_ORDERSCREATED = `${BASE_URL}/order/search`;

export const VIEW_ORDER_PRODUCT = `${BASE_URL}/order/orderProduct`;



export const DELETE_ORDER_URL = `${BASE_URL}/order/delete`;
export const VIEW_ALL_ORDER_URL = `${BASE_URL}/order/viewAll`;
export const ADD_ORDER_URL = `${BASE_URL}/order/add`;
export const VIEW_ORDERNO = `${BASE_URL}/order/viewOrderNo`;


export const GET_ORDERBYID_URL = `${BASE_URL}/order/get`;
export const UPDATE_ORDER_URL = `${BASE_URL}/order/update`;


export const GET_PRODUCTIDINVENTORY_URL = `${BASE_URL}/products/inventoryProductIds`;
export const GET_PRODUCTInventory_URL = `${BASE_URL}/productInventory/getByProduct`;
export const UPDATE_PRODUCTInventory_URL = `${BASE_URL}/productInventory/update`;

export const UPDATE_PRODUCTInventoryy_URL = `${BASE_URL}/productInventory/updateLocation`;




export const ADD_CONTEMPORARY = `${BASE_URL}/products/upload-excel`;
export const ADD_PASHMINA_EMB = `${BASE_URL}/uploadExcel/peshmina`;
export const ADD_WOOL_EMB = `${BASE_URL}/uploadExcel/wool`;
export const ADD_KANI = `${BASE_URL}/uploadExcel/kani`;
export const ADD_PAPERMACHIE = `${BASE_URL}/uploadExcel/paper`;
export const ADD_COTTON = `${BASE_URL}/uploadExcel/cotton`;
export const ADD_CONTEM_SAREE = `${BASE_URL}/uploadExcel/saree`;
export const ADD_CONTEMP_WOOL = `${BASE_URL}/uploadExcel/contempWool`;


//PRODUCT
export const ADD_HSNCODE_URL = `${BASE_URL}/hsncode`;
export const GET_HSNCODE_URL = `${BASE_URL}/hsncode`;
export const UPDATE_HSNCODE_URL = `${BASE_URL}/hsncode`;
export const VIEW_ALL_HSNCODE = `${BASE_URL}/hsncode/viewAll`;
export const DELETE_HSNCODE_URL = `${BASE_URL}/hsncode`;



//dahsboard

//images

export const GET_IMAGE = `${BASE_URL}`;

export const Count = `${BASE_URL}/api/dashboard`

export const options = {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: false,
    newestOnTop: false,
    closeOnClick: true,
    rtl: false,
    theme: 'dark',
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true
};

//React-select customStyles function


export const customStyles = (theme) => ({
    control: (provided, state) => ({
        ...provided,
        minHeight: '50px',
        fontSize: '16px',
        backgroundColor: theme === 'dark' ? '#1D2A39' : '#fff',
        color: theme === 'dark' ? '#fff' : '#000',
        border: `1.5px solid ${theme === 'dark' ? '#3D4D60' : '#E5E5E5'}`, // Border color based on theme
        borderRadius: '4px', // Assuming the same rounded border
        boxShadow: 'none', // Remove any default box shadow
        '&:hover': {
            borderColor: state.isFocused ? '#3B82F6' : theme === 'dark' ? '#3D4D60' : '#E5E5E5', // Hover border color
        },
        '&:focus': {
            borderColor: state.isFocused ? '#3B82F6' : theme === 'dark' ? '#3D4D60' : '#E5E5E5', // Focus border color
        },
        '&:active': {
            borderColor: state.isFocused ? '#3B82F6' : theme === 'dark' ? '#3D4D60' : '#E5E5E5', // Active border color
        },
    }),
    valueContainer: (provided) => ({
        ...provided,
        padding: '10px 10px',
        // zIndex: 9999,

    }),
    input: (provided) => ({
        ...provided,
        fontSize: '16px',
        color: theme === 'dark' ? '#fff' : '#000',
    }),
    singleValue: (provided) => ({
        ...provided,
        fontSize: '16px',
        color: theme === 'dark' ? '#fff' : '#000',
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: theme === 'dark' ? '#1D2A39' : '#fff',
        zIndex: 99999,
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? (theme === 'dark' ? '#000' : '#f0f0f0') : 'transparent',
        color: state.isFocused ? (theme === 'dark' ? '#fff' : '#000') : (theme === 'dark' ? '#fff' : '#000'),
    }),
});



