import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Loader from './common/Loader/index.js';
import PageTitle from './components/PageTitle.js';
import SignIn from './pages/Authentication/SignIn.jsx';
import SignUp from './pages/Authentication/SignUp.jsx';
import Calendar from './pages/Calendar.js';
import Chart from './pages/Chart.jsx';
import Material from './components/Material/Material.jsx';
import AddProduct from './components/Products/AddProduct.jsx';
import ViewProduct from './components/Products/ViewProduct.jsx';
import ExcelUploadProduct from './components/Products/ExcelUploadProduct.jsx';


import AddBom from './components/Products/AddBom.jsx';
import AddLocationInventory from './components/Products/AddLoctionInventory.jsx';

import UpdateBom from './components/Products/UpdateBom.jsx';
import UpdateProduct from './components/Products/UpdateProduct.jsx';
import UpdateLocationInventory from './components/Products/UpdateLocationInventory.jsx';



import FormLayout from './pages/Form/FormLayout.js';
import Profile from './pages/Profile.js';
import Settings from './pages/Settings.js';
import Tables from './pages/Tables.js';
import Alerts from './pages/UiElements/Alerts.js';
import PageNotFOund from './pages/PageNotFOund.jsx';

import Buttons from './pages/UiElements/Buttons.js';
import PrivateRoute from './PrivateRoute/PrivateRoute.jsx';
import RoleBasedRoute from './PrivateRoute/RoleBasedRoute.jsx';
import Budget from './components/Configurator/Budget.jsx';

import Size from './components/Configurator/Size.jsx';
import Design from './components/Configurator/Design.jsx';
import Style from './components/Configurator/Style.jsx';
import Currency from './components/Configurator/Currency.jsx';
import Unit from './components/Configurator/Unit.jsx';
import ProductGroup from './components/Configurator/ProductGroup.jsx';
import AddColorGroup from './components/Configurator/AddColorGroup.jsx';
import AddProductCategory from './components/Configurator/AddProductCategory.jsx';
import CustomerGroup from './components/Configurator/CustomerGroup.jsx';
import OrderType from './components/Configurator/OrderType.jsx';
import HsnCode from './components/Configurator/HsnCode.jsx';
import Location from './components/Configurator/Location.jsx';
import Supplier from './components/Configurator/Supplier.jsx';

import AddSupplier from './components/Supplier/AddSupplier.jsx';
import ViewSupplier from './components/Supplier/ViewSupplier.jsx';
import UpdateSupplier from './components/Supplier/UpdateSupplier.jsx';

import MaterialPo from './components/PuchaseOrder/MaterialPo';
import ViewMaterialPo from './components/PuchaseOrder/ViewMaterialPo';
import UpdateMaterialPo from './components/PuchaseOrder/UpdateMaterialPo.jsx';

import AddOrder from './components/Order/AddOrder';
import ViewOrder from './components/Order/ViewOrder.jsx';
import UpdateOrderStatus from './components/Order/UpdateOrderStatus.jsx';
import UpdatePartiallyOrderStatus from './components/Order/UpdatePartiallyOrderStatus.jsx';
import UpdatePartiallyApprovedOrder from './components/Order/UpdatePartiallyApprovedOrder.jsx';
import UpdateOrderRecieving from './components/Order/UpdateOrderRecieving.jsx';






import IssueChalaan from './components/Order/IssueChalaan.jsx';




import UpdateOrderProduct from './components/Order/UpdateOrderProduct.jsx';




import ViewOrderCreated from './components/Order/ViewOrderCreated.jsx';

import ViewOrderPartiallyCreated from './components/Order/ViewOrderPartiallyCreated.jsx';

import ViewOrderPartiallyApproved from './components/Order/ViewOrderPartiallyApproved.jsx';

import ViewOrderExecuted from './components/Order/ViewOrderExecuted.jsx';
import ViewOrderPartiallyPending from './components/Order/ViewOrderPartiallyPending.jsx';
import ViewOrderPending from './components/Order/ViewOrderPending.jsx';

import ViewOrderClosed from './components/Order/ViewOrderClosed.jsx';

import ViewOrderPartiallyClosed from './components/Order/ViewOrderPartiallyClosed.jsx';









import UpdateOrder from './components/Order/UpdateOrder.jsx';


import AddCustomer from './components/Customer/AddCustomer';
import ViewCustomer from './components/Customer/ViewCustomer';
import UpdateCustomer from './components/Customer/UpdateCustomer';
import CreateMaterialInventory from './components/Inventory/CreateMaterialInventory.jsx';
import ViewMaterialInventory from './components/Inventory/ViewMaterialInventory.jsx';
import UpdateInventoryMaterial from './components/Inventory/UpdateInventoryMaterial.jsx';



//productInventory


import AddProductInventory from './components/ProductsInventory/AddProductInventory.jsx';
import ViewProductsInventory from './components/ProductsInventory/ViewProductsInventory.jsx';
import UpdateInventory from './components/ProductsInventory/UpdateInventory.jsx';



import AddStockJournel from './components/StockJournel/AddStockJournel.jsx';
import ViewStockJournel from './components/StockJournel/ViewStockJournel.jsx';

// import UpdateProduct from './components/Products/UpdateProduct';

import UpdateStockJournal from './components/StockJournel/UpdateStockJournal.jsx';
import { signoutSuccess } from './redux/Slice/UserSlice';

// import useInactivity from './hooks/useInactivity';


import 'react-toastify/dist/ReactToastify.css';

import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

function App() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Logout function
  const handleLogout = () => {
    dispatch(signoutSuccess());
    navigate('/auth/signin');
    toast.success('Logout:Session Expired ');
  };

  // useInactivity(5 * 60 * 1000, handleLogout);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin " />
              <SignIn />
            </>
          }
        />

        <Route element={<PrivateRoute />}>
          <Route
            path="/auth/signup"
            element={
              <>
                <PageTitle title="AddUser " />
                <SignUp />
              </>
            }
          />
          <Route
            path="/chart"
            element={
              <>
                <PageTitle title="Kani Homepage" />
                <Chart />
              </>
            }
          />
          <Route
            path="/"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN", "ROLE_APPROVER"]}></RoleBasedRoute>
                <PageTitle title="Dashboard" />
                <Chart />
              </>
            }
          />


          <Route
            path="/calendar"
            element={
              <>
                <PageTitle title="Calendar " />
                <Calendar />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <PageTitle title="Profile " />
                <Profile />
              </>
            }
          />
          {/* Order */}

          <Route
            path="/Order/addOrder"
            element={
              <>
                <PageTitle title="Add Order" />
                <AddOrder />
              </>
            }
          />
          <Route
            path="/Order/viewOrder"
            element={
              <>
                <PageTitle title="View Order " />
                <ViewOrder />
              </>
            }
          />

          <Route
            path="/Order/updateorderCreated/:id"
            element={
              <>
                <PageTitle title="Update Order Status" />
                <UpdateOrderStatus />
              </>
            }
          />

          <Route
            path="/Order/updateorderPartiallyCreated/:id"
            element={
              <>
                <PageTitle title="Update Order Status" />
                <UpdatePartiallyOrderStatus />
              </>
            }
          />





          <Route
            path="/Order/updateorderPartiallyCreated/:id"
            element={
              <>
                <PageTitle title="Update Order Status" />
                <UpdatePartiallyOrderStatus />
              </>
            }
          />


          <Route
            path="/Order/updatepartiallyApproved/:id"
            element={
              <>
                <PageTitle title="Update Order Status" />
                <UpdatePartiallyApprovedOrder />
              </>
            }
          />

          <Route
            path="/order/updateorderproduct/:id"
            element={
              <>
                <PageTitle title="Update Order" />
                <UpdateOrderRecieving />
              </>
            }
          />








          <Route
            path="/order/modifyproductafterexecution/:id"
            element={
              <>
                <PageTitle title="Update Order Status" />
                <IssueChalaan />
              </>
            }
          />



          <Route
            path="/order/modifyorderproduct/:id"
            element={
              <>
                <PageTitle title="Update Order Product " />
                <UpdateOrderProduct />
              </>
            }
          />

          <Route
            path="/Order/created"
            element={
              <>
                <PageTitle title="View Order Created " />
                <ViewOrderCreated />
              </>
            }
          />



          <Route
            path="/order/partiallyexecuted"
            element={
              <>
                <PageTitle title="View Order Created " />
                <ViewOrderPartiallyCreated />
              </>
            }
          />

          <Route
            path="/order/partiallyApproved"
            element={
              <>
                <PageTitle title="View Order Partially Approved " />
                <ViewOrderPartiallyApproved />
              </>
            }
          />



          <Route
            path="/orderlist/Executed"
            element={
              <>
                <PageTitle title="View Order Executed" />
                <ViewOrderExecuted />
              </>
            }
          />

<Route
            path="/orderlist/PartiallyPending"
            element={
              <>
                <PageTitle title="View Order Executed" />
                <ViewOrderPartiallyPending/>
              </>
            }
          />



<Route
            path="/orderlist/Pending"
            element={
              <>
                <PageTitle title="View Order Executed" />
                <ViewOrderPending/>
              </>
            }
          />

<Route
            path="/orderlist/PartiallyClosed"
            element={
              <>
                <PageTitle title="View Order Executed" />
                <ViewOrderPartiallyClosed/>
              </>
            }
          />

<Route
            path="/orderlist/Closed"
            element={
              <>
                <PageTitle title="View Order Executed" />
                <ViewOrderClosed/>
              </>
            }
          />





          {/*  Products realted routes  */}

          <Route
            path="/product/addProduct"
            element={
              <>
                <PageTitle title="Add Product" />
                <AddProduct />
              </>
            }
          />
          <Route
            path="/product/addExcelProduct"
            element={
              <>
                <PageTitle title="Excel Upload Product" />
                <ExcelUploadProduct />
              </>
            }
          />
          <Route
            path="/product/viewProducts"
            element={
              <>
                <PageTitle title="View Product" />
                <ViewProduct />
              </>
            }
          />
          <Route
            path="/product/updateProduct/:id"
            element={
              <>
                <PageTitle title="View Product" />
                <UpdateProduct />
              </>
            }
          />

          <Route
            path="/product/updateInventory/:id"
            element={
              <>
                <PageTitle title="View Product" />
                <UpdateLocationInventory />
              </>
            }
          />

          <Route
            path="/order/updateOrder/:id"
            element={
              <>
                <PageTitle title="View Order" />
                <UpdateOrder />
              </>
            }
          />

          <Route
            path="/product/addBom/:id"
            element={
              <>
                <PageTitle title="View B.O.M" />
                <AddBom />
              </>
            }
          />
          <Route
            path="/product/addInventoryLocation/:id"
            element={
              <>
                <PageTitle title="Add Location Inventory" />
                <AddLocationInventory />
              </>
            }
          />
          <Route
            path="/product/updateBom/:id"
            element={
              <>
                <PageTitle title="View B.O.M" />
                <UpdateBom />
              </>
            }
          />
          <Route
            path="/product/updateProduct/:id"
            element={
              <>
                <PageTitle title="Update Product" />
                <UpdateProduct />
              </>
            }
          />

          <Route
            path="/material/addMaterial"
            element={
              <>
                <PageTitle title="Add Material" />
                <Material />
              </>
            }
          />
          <Route
            path="/forms/form-layout"
            element={
              <>
                <PageTitle title="Form Layout " />
                <FormLayout />
              </>
            }
          />
          <Route
            path="/tables"
            element={
              <>
                <PageTitle title="Tables " />
                <Tables />
              </>
            }
          />
          <Route
            path="/settings"
            element={
              <>
                <PageTitle title="Settings " />
                <Settings />
              </>
            }
          />

          <Route
            path="/ui/alerts"
            element={
              <>
                <PageTitle title="Alerts" />
                <Alerts />
              </>
            }
          />
          <Route
            path="/ui/buttons"
            element={
              <>
                <PageTitle title="Buttons " />
                <Buttons />
              </>
            }
          />

          <Route
            path="/auth/signup"
            element={
              <>
                <PageTitle title="Signup" />
                <SignUp />
              </>
            }
          />

          {/* configurator */}
          <Route
            path="/configurator/addbudget"
            element={
              <>
                <PageTitle title="Budget" />
                <Budget />
              </>
            }
          />
          <Route
            path="/configurator/addSize"
            element={
              <>
                <PageTitle title="Size" />
                <Size />
              </>
            }
          />
          <Route
            path="/configurator/adddesign"
            element={
              <>
                <PageTitle title="Size" />
                <Design />
              </>
            }
          />
          <Route
            path="/configurator/suplier"
            element={
              <>
                <PageTitle title="Size" />
                <Supplier />
              </>
            }
          />
          <Route
            path="/configurator/addStyle"
            element={
              <>
                <PageTitle title="Style" />
                <Style />
              </>
            }
          />
          <Route
            path="/configurator/addCurrency"
            element={
              <>
                <PageTitle title="Currency" />
                <Currency />
              </>
            }
          />
          <Route
            path="/configurator/addunit"
            element={
              <>
                <PageTitle title="Unit" />
                <Unit />
              </>
            }
          />
          <Route
            path="/configurator/addproductgroup"
            element={
              <>
                <PageTitle title="Add Product Group" />
                <ProductGroup />
              </>
            }
          />
          <Route
            path="/configurator/addcolorgroup"
            element={
              <>
                <PageTitle title="Add Color Group" />
                <AddColorGroup />
              </>
            }
          />
          <Route
            path="/configurator/addproductcategory"
            element={
              <>
                <PageTitle title="Add Product Category" />
                <AddProductCategory />
              </>
            }
          />
          <Route
            path="/configurator/addcustomergroup"
            element={
              <>
                <PageTitle title="Add Customer Group" />
                <CustomerGroup />
              </>
            }
          />

          <Route
            path="/configurator/addordertype"
            element={
              <>
                <PageTitle title="Add Order Type" />
                <OrderType />
              </>
            }
          />
          <Route
            path="/configurator/addgstclassification"
            element={
              <>
                <PageTitle title="Add Gst Classification" />
                <HsnCode />
              </>
            }
          />

          {/* seperate routes */}

          <Route
            path="/supplier/add"
            element={
              <>
                <PageTitle title="Add Supplier" />
                <AddSupplier />
              </>
            }
          />

          <Route
            path="/supplier/view"
            element={
              <>
                <PageTitle title="View Supplier" />
                <ViewSupplier />
              </>
            }
          />

          <Route
            path="/customer/addCustomer"
            element={
              <>
                <PageTitle title="Add Customer" />
                <AddCustomer />
              </>
            }
          />
          <Route
            path="/customer/viewCustomer"
            element={
              <>
                <PageTitle title="View Customer" />
                <ViewCustomer />
              </>
            }
          />
          <Route
            path="/customer/updateCustomer/:id"
            element={
              <>
                <PageTitle title="Update Customer" />
                <UpdateCustomer />
              </>
            }
          />
          <Route
            path="/configurator/location"
            element={
              <>
                <PageTitle title="Add Customer Group" />
                <Location />
              </>
            }
          />
          <Route
            path="/configurator/addunit"
            element={
              <>
                <PageTitle title="Add Customer Group" />
                <Unit />
              </>
            }
          />

          {/* purchase orders */}
          <Route
            path="/material/addPurchase"
            element={
              <>
                <PageTitle title="Add Purchase" />
                <MaterialPo />
              </>
            }
          />
          <Route
            path="/material/viewPurchase"
            element={
              <>
                <PageTitle title="View Purchase" />
                <ViewMaterialPo />
              </>
            }
          />
          <Route
            path="/material/updatematerialPo/:id"
            element={
              <>
                <PageTitle title="Update Material PO" />
                <UpdateMaterialPo />
              </>
            }
          />
          <Route
            path="/supplier/updateSupplier/:id"
            element={
              <>
                <PageTitle title="Update Supplier" />
                <UpdateSupplier />
              </>
            }
          />
          <Route
            path="/inventory/addMaterialInventory"
            element={
              <>
                <PageTitle title="Inventory" />
                <CreateMaterialInventory />
              </>
            }
          />

          <Route
            path="/inventory/viewMaterialInventory"
            element={
              <>
                <PageTitle title="Inventory" />
                <ViewMaterialInventory />
              </>
            }
          />





          <Route
            path="/inventory/addProductInventory"
            element={
              <>
                <PageTitle title="Inventory" />
                <AddProductInventory />
              </>
            }
          />

          <Route
            path="/inventory/updateInventory/:id"
            element={
              <>
                <PageTitle title="Update Inventory" />
                <UpdateInventory />
              </>
            }
          />

          <Route
            path="/inventory/viewProductInventory"
            element={
              <>
                <PageTitle title="Inventory" />
                <ViewProductsInventory />
              </>
            }
          />
          <Route
            path="/stockjournal/add"
            element={
              <>
                <PageTitle title="Add Stock Journal" />
                <AddStockJournel />
              </>
            }
          />

          <Route
            path="/stockjournal/view"
            element={
              <>
                <PageTitle title="View Stock Journal" />
                <ViewStockJournel />
              </>
            }
          />

          <Route
            path="/inventory/updateInventoryMaterial/:id"
            element={
              <>
                <PageTitle title="Update Inventory " />
                <UpdateInventoryMaterial />
              </>
            }
          />

          <Route
            path="/stockjournel/updateStockJournal/:id"
            element={
              <>
                <PageTitle title="Update Stock Journal" />
                <UpdateStockJournal />
              </>
            }
          />
          <Route path="*" element={<PageNotFOund />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
