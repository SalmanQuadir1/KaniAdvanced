import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Loader from './common/Loader/index.js';
import PageTitle from './components/PageTitle.js';
import SignIn from './pages/Authentication/SignIn.jsx';
import SignUp from './pages/Authentication/SignUp.jsx';
import Calendar from './pages/Calendar.js';
import Chart from './pages/Chart.jsx';
import Home from './pages/Home.jsx';
import FinancialReportDashboard from './pages/FinancialReportDashboard.jsx';
import GeneralFinancialReportDashboard from './pages/GeneralFinancialReportDashboard.jsx';
import Groups from './components/Accounts/Config/Groups.jsx';

import Daybook from './components/Accounts/Config/Daybook.jsx';

import OrderVoucherView from './components/Accounts/Config/OrderVoucherView.jsx';

import AddLut from './components/Accounts/Config/AddLut.jsx';
import PaymentSummary from './components/Accounts/Config/PaymentSummary.jsx';

import Voucher from './components/Accounts/Vouchers/Voucher.jsx';
import CreateVoucher from './components/Accounts/Vouchers/CreateVoucher.jsx';


import CreateVoucherPurchase from './components/Accounts/Vouchers/CreateVoucherPurchase.jsx';
import VoucherEntriesView from './components/Accounts/Vouchers/VoucherEntriesView.jsx';

import VoucherEntriesViewPayment from './components/Accounts/Vouchers/VoucherEntriesViewPayment.jsx';

import PrintEntryPayment from './components/Accounts/Vouchers/PrintEntryPayment.jsx';

import PrintPaymentVoucher from './components/Accounts/Vouchers/PrintPaymentVoucher.jsx';
import PrintPosEntryPayment from './components/Accounts/Vouchers/PrintPosEntryPayment.jsx';
import ViewVoucher from './components/Accounts/Vouchers/ViewVoucher.jsx';

import KaniOrders from './components/Kani/KaniOrders.jsx';
import FilterSupplier from './components/Kani/FilterSupplier.jsx';
import SupplierOrder from './components/Kani/SupplierOrder.jsx';
import KaniClientOrders from './components/Kani/KaniClientOrders.jsx';
import RetailClientOrders from './components/Kani/RetailClientOrders.jsx';

import CreateLedger from './components/Ledger/CreateLedger.jsx';
import UpdateCustomerLedger from './components/Ledger/UpdateCustomerLedger.jsx';

import UpdateLedger from './components/Ledger/UpdateLedger.jsx';
import UpdateLedgerr from './components/Ledger/UpdateLedgerr.jsx';
import Material from './components/Material/Material.jsx';
import AddProduct from './components/Products/AddProduct.jsx';
import ViewProduct from './components/Products/ViewProduct.jsx';

import ExcelUploadProduct from './components/Products/ExcelUploadProduct.jsx';
import ExcelUploadBulkInventory from './components/Products/ExcelUploadBulkInventory.jsx';

import UpdateKani from './components/Kani/UpdateKani.jsx';



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
import Budget from './components/Budget/Budget.jsx';
import ViewBudget from './components/Budget/ViewBudget.jsx';
import BudgetReport from './components/Budget/BudgetReport.jsx';

import BudgetReportView from './components/Budget/BudgetReportView.jsx';

import UpdateBudget from './components/Budget/UpdateBudget.jsx';


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
import ViewLedger from './components/Supplier/SupplierLedger/ViewLedger.jsx';
import ViewSuppLedger from './components/Supplier/SupplierLedger/ViewSuppLedger.jsx';

import AddBulkSupplier from './components/Supplier/AddBulkSupplier.jsx';

import ViewSupplier from './components/Supplier/ViewSupplier.jsx';
import UpdateSupplier from './components/Supplier/UpdateSupplier.jsx';

import MaterialPo from './components/PuchaseOrder/MaterialPo';
import ViewMaterialPo from './components/PuchaseOrder/ViewMaterialPo';
import UpdateMaterialPo from './components/PuchaseOrder/UpdateMaterialPo.jsx';

import AddOrder from './components/Order/AddOrder';

import Reports from './components/Reports/Reports.jsx';
import ProductReport from './components/Reports/ProductReport.jsx';

import RetailWholeSaleReport from './components/Reports/RetailWholesaleReport.jsx';
import FinanceReportByDate from './components/Reports/FinanceReportByDate.jsx';


import ViewPerforma from './components/Order/ViewPerforma';

import DownloadPerformaws from './components/Order/DownloadPerformaws';

import DownloadPerformare from './components/Order/DownloadPerformare';

import ViewOrder from './components/Order/ViewOrder.jsx';

import EditOrderCreated from './components/Order/EditOrderCreated.jsx';

import UpdateOrderStatus from './components/Order/UpdateOrderStatus.jsx';
import OrderProforma from './components/Order/Proforma/OrderProforma.jsx';
import UpdateOrderProforma from './components/Order/Proforma/UpdateOrderProforma.jsx';
import UpdateRetailProforma from './components/Order/Proforma/UpdateRetailProforma.jsx';
import RetailOrderProforma from './components/Order/Proforma/RetailOrderProforma.jsx';



import UpdatePartiallyOrderStatus from './components/Order/UpdatePartiallyOrderStatus.jsx';
import UpdatePartiallyApprovedOrder from './components/Order/UpdatePartiallyApprovedOrder.jsx';
import UpdatePartiallyPending from './components/Order/UpdatePartiallyPending.jsx';
import UpdateOrderCancelled from './components/Order/UpdateOrderCancelled.jsx';

import UpdatePartiallyClosed from './components/Order/UpdatePartiallyClosed.jsx';

import UpdateOrderRecieving from './components/Order/UpdateOrderRecieving.jsx';
import UpdateForcedClosure from './components/Order/UpdateForcedClosure.jsx';
import UpdateChallan from './components/Order/UpdateChallan.jsx';
import UpdateExpectedSupplierDate from './components/Order/UpdateExpectedSupplierDate.jsx';

// import UpdateSupplierRecievingOrders from './components/Order/UpdateSupplierRecievingOrders.jsx';

import ViewExpectedDateOrder from './components/Order/ViewExpectedDateOrder.jsx';

import ViewSupplierRecievingOrders from './components/Order/ViewSupplierRecievingOrders.jsx';
import ViewOrderShippingDate from './components/Order/ViewOrderShippingDate.jsx';

import ViewNeedModification from './components/Order/ViewNeedModification.jsx';

import ViewOrderCancelled from './components/Order/ViewOrderCancelled.jsx';



import IssueChalaan from './components/Order/IssueChalaan.jsx';




import UpdateOrderProduct from './components/Order/UpdateOrderProduct.jsx';
import ViewProductByOrderId from './components/Order/ViewProductByOrderId.jsx';

import ViewOrderForcedClosure from './components/Order/ViewOrderForcedClosure.jsx';
import ViewRecievedQuantity from './components/Order/ViewRecievedQuantity.jsx';


import MonthlyOrders from './components/MonthlyOrders/MonthlyOrders.jsx'


import ViewOrderCreated from './components/Order/ViewOrderCreated.jsx';
import ViewOrderApproved from './components/Order/ViewOrderApproved.jsx';

import PendingForBill from './components/Order/PendingForBill.jsx';
import UpdatePendingForBill from './components/Order/UpdatePendingForBill.jsx';



import ViewChallan from './components/Order/ViewChallan.jsx';

import ViewOrderRejected from './components/Order/ViewOrderRejected.jsx';



import ViewOrderPartiallyCreated from './components/Order/ViewOrderPartiallyCreated.jsx';

import ViewOrderPartiallyApproved from './components/Order/ViewOrderPartiallyApproved.jsx';

import ViewOrderExecuted from './components/Order/ViewOrderExecuted.jsx';
import UpdateOrderAccepted from './components/Order/UpdateOrderAccepted.jsx';
import UpdateOrderPending from './components/Order/UpdateOrderPending.jsx';

import UpdateClosedOrder from './components/Order/UpdateClosedOrder.jsx';

import ViewOrderPartiallyPending from './components/Order/ViewOrderPartiallyPending.jsx';
import ViewOrderPending from './components/Order/ViewOrderPending.jsx';

import ViewOrderClosed from './components/Order/ViewOrderClosed.jsx';

import ViewOrderPartiallyClosed from './components/Order/ViewOrderPartiallyClosed.jsx';









import UpdateOrder from './components/Order/UpdateOrder.jsx';
import UpdateOrderShippingDate from './components/Order/UpdateOrderShippingDate.jsx';

import AddCustomer from './components/Customer/AddCustomer';
import ExcelUploadCustomer from './components/Customer/AddCustomerBulk.jsx';
import ExcelUploadLedger from './components/Ledger/BulkLedgerUpload.jsx'

import ViewCustomer from './components/Customer/ViewCustomer';
import UpdateCustomer from './components/Customer/UpdateCustomer';
import CreateMaterialInventory from './components/Inventory/CreateMaterialInventory.jsx';
import ViewMaterialInventory from './components/Inventory/ViewMaterialInventory.jsx';
import UpdateInventoryMaterial from './components/Inventory/UpdateInventoryMaterial.jsx';



//productInventory


import AddProductInventory from './components/ProductsInventory/AddProductInventory.jsx';
import ViewProductsInventory from './components/ProductsInventory/ViewProductsInventory.jsx';
import UpdateInventory from './components/ProductsInventory/UpdateInventory.jsx';



import AddStockJournell from './components/StockJournel/AddStockJournell.jsx';
import ViewStockJournel from './components/StockJournel/ViewStockJournel.jsx';


import VerifyStockJournal from './components/StockJournel/VerifyStockJournal.jsx';
import Godown from './components/Godown/Godown.jsx'

import ViewStockJournalCreated from './components/StockJournel/ViewStockJournalCreated.jsx';

// import ViewStockJournel from './components/StockJournel/ViewStockJournel.jsx';

// import UpdateProduct from './components/Products/UpdateProduct';

import UpdateStockJournal from './components/StockJournel/UpdateStockJournal.jsx';
import { signoutSuccess } from './redux/Slice/UserSlice';

// import useInactivity from './hooks/useInactivity';

import ViewKaniProducts from './components/Kani/ViewKaniProducts.jsx';
import ViewSupplierProduct from './components/Kani/ViewSupplierProduct.jsx';
import KaniInProgress from './components/Kani/KaniInProgress.jsx';
import UpdateKaniProducts from './components/Kani/UpdateKaniProducts.jsx';

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
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN", "ROLE_VERIFIER", "ROLE_APPROVER", "ROLE_EXECUTOR", "ROLE_ADMIN_DLI", "ROLE_ADMIN_SXR", "ROLE_USER", "ROLE_QUALITYCONTROL", "ROLE_FINANCE"]}></RoleBasedRoute>
                <PageTitle title="Dashboard" />
                <Home />
              </>
            }
          />
          <Route
            path="/home"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN", "ROLE_FINANCE", 'ROLE_VERIFIER', "ROLE_USER", "ROLE_APPROVER", "ROLE_EXECUTOR", "ROLE_ADMIN_DLI", "ROLE_ADMIN_SXR", "ROLE_QUALITYCONTROL"]}></RoleBasedRoute>
                <PageTitle title="Dashboard" />
                <Home />
              </>
            }
          />
          <Route
            path="/configurator/groups"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Dashboard" />
                <Groups />
              </>
            }
          />
          {/* voucherss */}


          <Route
            path="/configurator/vouchers"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Voucher" />
                <Voucher />
              </>
            }
          />

          <Route
            path="/configurator/vouchers/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Voucher" />
                <Voucher />
              </>
            }
          />

          <Route
            path="/Voucher/update/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Edit Voucher" />
                <Voucher />
              </>
            }
          />


          <Route
            path="/configurator/dayBook"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Day Book" />
                <Daybook />
              </>
            }
          />

          <Route
            path="/configurator/ledgersummary"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Day Book" />
                <PaymentSummary />
              </>
            }
          />

          <Route
            path="/configurator/OrderVoucher"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Order Voucher" />
                <OrderVoucherView />
              </>
            }
          />

          <Route
            path="/configurator/AddLut"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Add Lut" />
                <AddLut />
              </>
            }
          />

          <Route
            path="/voucher/create/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Voucher" />
                <CreateVoucher />
              </>
            }
          />

          <Route
            path="/Purchasevoucher/create/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Voucher" />
                <CreateVoucherPurchase />
              </>
            }
          />

          <Route
            path="/voucherEntries/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Voucher Entries" />
                <VoucherEntriesView />
              </>
            }
          />

          <Route
            path="/voucherEntriesPayment/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Voucher Entries Payment" />
                <VoucherEntriesViewPayment />
              </>
            }
          />


          <Route
            path="/printentrypayment/:id/:gstRegistration"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Voucher Entries" />
                <PrintEntryPayment />
              </>
            }
          />
           <Route
            path="/printentrypayments/:id/:gstRegistration"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Voucher Entries" />
                <PrintPaymentVoucher />
              </>
            }
          />

          <Route
            path="/printentrypaymentPos/:id/:gstRegistration"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Voucher Entries" />
                <PrintPosEntryPayment />
              </>
            }
          />


          <Route
            path="/Vouchers/view"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Voucher" />
                <ViewVoucher />
              </>
            }
          />


          <Route
            path="/report/freports"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN", "ROLE_APPROVER", "ROLE_EXECUTOR", "ROLE_ADMIN_DLI", "ROLE_ADMIN_SXR"]}></RoleBasedRoute>
                <PageTitle title="Dashboard" />
                <FinancialReportDashboard />
              </>
            }
          />


          <Route
            path="/report/financial"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN", "ROLE_APPROVER", "ROLE_EXECUTOR", "ROLE_ADMIN_DLI", "ROLE_ADMIN_SXR"]}></RoleBasedRoute>
                <PageTitle title="Dashboard" />
                <GeneralFinancialReportDashboard />
              </>
            }
          />



          <Route
            path="/calendar"

            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN", "ROLE_APPROVER", "ROLE_EXECUTOR", "ROLE_ADMIN_DLI", "ROLE_ADMIN_SXR"]}></RoleBasedRoute>
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

          {/* Calenders */}
          <Route
            path="/Order/monthlyorders"
            element={
              <>
                <PageTitle title="Monthly Orders" />
                <MonthlyOrders />
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
            path="/Reports"
            element={
              <>
                <PageTitle title="Add Order" />
                <Reports />
              </>
            }
          />

          <Route
            path="/report/product"
            element={
              <>
                <PageTitle title="Add Order" />
                <ProductReport />
              </>
            }
          />

          <Route
            path="/report/wsRetailReport"
            element={
              <>
                <PageTitle title="Retail WholeSale Report" />
                <RetailWholeSaleReport />
              </>
            }
          />

          <Route
            path="/report/freportdate"
            element={
              <>
                <PageTitle title="Retail WholeSale Report" />
                <FinanceReportByDate />
              </>
            }
          />

          <Route
            path="/order/searchproforma"
            element={
              <>
                <PageTitle title="View Proforma" />
                <ViewPerforma />
              </>
            }
          />
          <Route
            path="/Order/orderPerformaws/:id"
            element={
              <>
                <PageTitle title="View Proforma" />
                <DownloadPerformaws />
              </>
            }
          />
          <Route
            path="/Order/orderPerformare/:id"
            element={
              <>
                <PageTitle title="View Proforma" />
                <DownloadPerformare />
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
            path="/Order/ViewOrderCreated"
            element={
              <>
                <PageTitle title="Edit Order " />
                <EditOrderCreated />
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
            path="/Order/generateProforma/:id"
            element={
              <>
                <PageTitle title="Create Order Proforma" />
                <OrderProforma />
              </>
            }
          />
          <Route
            path="/Order/generateRetailProforma/:id"
            element={
              <>
                <PageTitle title="Create Retail Order Proforma" />
                <RetailOrderProforma />
              </>
            }
          />

          <Route
            path="/Order/updateOrderProforma/:id"
            element={
              <>
                <PageTitle title="Create Order Proforma" />
                <UpdateOrderProforma />
              </>
            }
          />

          <Route
            path="/Order/updateRetailProforma/:id"
            element={
              <>
                <PageTitle title="Create Order Proforma" />
                <UpdateRetailProforma />
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
            path="/Order/updateorderPartiallyPending/:id"
            element={
              <>
                <PageTitle title="Update Order Status" />
                <UpdatePartiallyPending />
              </>
            }
          />

          <Route
            path="/Order/updateCancelledOrders/:id"
            element={
              <>
                <PageTitle title="Update Order Status" />
                <UpdateOrderCancelled />
              </>
            }
          />



          <Route
            path="/Order/updatepartiallyClosed/:id"
            element={
              <>
                <PageTitle title="Update Order Status" />
                <UpdatePartiallyClosed />
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
            path="/Order/updateorderForcedClosure/:id"
            element={
              <>
                <PageTitle title="Update Order Status" />
                <UpdateForcedClosure />
              </>
            }
          />

          <Route
            path="/Order/updateChallan/:id"
            element={
              <>
                <PageTitle title="Update Challan" />
                <UpdateChallan />
              </>
            }
          />

          <Route
            path="/Order/updateExpectedDate/:id"
            element={
              <>
                <PageTitle title="Update Challan" />
                <UpdateExpectedSupplierDate />
              </>
            }
          />

          <Route
            path="/order/supplierExpectdateUpdate"
            element={
              <>
                <PageTitle title="Update Expected Date " />
                <ViewExpectedDateOrder />
              </>
            }
          />

          <Route
            path="/order/supplierRecievingOrders"
            element={
              <>
                <PageTitle title="Update Expected Date " />
                <ViewSupplierRecievingOrders />
              </>
            }
          />

          <Route
            path="/order/updateShippingDate"
            element={
              <>
                <PageTitle title="Update Expected Date " />
                <ViewOrderShippingDate />
              </>
            }
          />


          <Route
            path="/order/needModification"
            element={
              <>
                <PageTitle title="Need Modification " />
                <ViewNeedModification />
              </>
            }
          />

          <Route
            path="/order/Cancelled"
            element={
              <>
                <PageTitle title="Cancelled Orders " />
                <ViewOrderCancelled />
              </>
            }
          />

          <Route
            path="/godown/viewGodown"
            element={
              <>
                <PageTitle title="Cancelled Orders " />
                <Godown />
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

          <Route path="/UpdateKani/:id" element={<UpdateKani />} />

          {/* View Kani Products route */}
          
          <Route path="/kani-products/view/:id" element={<ViewKaniProducts />} />
          <Route path="/filter-suppliers" element={<FilterSupplier />} />
          <Route
            path="/supplier-product/view/:id"
            element={<ViewSupplierProduct />}
          />
           <Route path="/supplier-order/:id" element={<SupplierOrder />} />
           <Route path="/kani-in-progress" element={<KaniInProgress />} />
           <Route
              path="/UpdateKaniProducts/:id"
              element={<UpdateKaniProducts />}
            />
             <Route path="/ClientOrders" element={<KaniClientOrders />} />
             <Route path="/RetailClientOrders" element={<RetailClientOrders />} />






          <Route
            path="/Order/updateorderExecuted/:id"
            element={
              <>
                <PageTitle title="Update Order Product " />
                <UpdateOrderAccepted />
              </>
            }
          />

          <Route
            path="/Order/updateorderPending/:id"
            element={
              <>
                <PageTitle title="Update Order Pending " />
                <UpdateOrderPending />
              </>
            }
          />

          <Route
            path="/Order/updateorderClosed/:id"
            element={
              <>
                <PageTitle title="Update Order Pending " />
                <UpdateClosedOrder />
              </>
            }
          />




          <Route
            path="/order/viewProduct/:id"
            element={
              <>
                <PageTitle title="Update Order Product " />
                <ViewProductByOrderId />
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
            path="/order/Approved"
            element={
              <>
                <PageTitle title="View Order Created " />
                <ViewOrderApproved />
              </>
            }
          />
          {/* Pending for bill */}
          <Route
            path="/Recieved/pendingForBill"
            element={
              <>
                <PageTitle title="View Order Created " />
                <PendingForBill />
              </>
            }
          />

          <Route
            path="/Order/updatependingforbill/:id"
            element={
              <>
                <PageTitle title="Update Pending For Bill " />
                <UpdatePendingForBill />
              </>
            }
          />


          <Route
            path="/orderlist/UpdateChallan"
            element={
              <>
                <PageTitle title="View Challan " />
                <ViewChallan />
              </>
            }
          />

          <Route
            path="/orderlist/RejectedOrders"
            element={
              <>
                <PageTitle title="View Challan " />
                <ViewOrderRejected />
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
            path="/orderlist/ForcedClosure"
            element={
              <>
                <PageTitle title="View Order Forced Closure " />
                <ViewOrderForcedClosure />
              </>
            }
          />

          <Route
            path="/order/recievedQuantity"
            element={
              <>
                <PageTitle title="View Recieved Quantity " />
                <ViewRecievedQuantity />
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
                <ViewOrderPartiallyPending />
              </>
            }
          />



          <Route
            path="/orderlist/Pending"
            element={
              <>
                <PageTitle title="View Order Executed" />
                <ViewOrderPending />
              </>
            }
          />

          <Route
            path="/orderlist/PartiallyClosed"
            element={
              <>
                <PageTitle title="View Order Executed" />
                <ViewOrderPartiallyClosed />
              </>
            }
          />

          <Route
            path="/orderlist/Closed"
            element={
              <>
                <PageTitle title="View Order Executed" />
                <ViewOrderClosed />
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

          {/* Excel Upload */}
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
            path="/product/addBulkInventory"
            element={
              <>
                <PageTitle title="Excel Upload Product" />
                <ExcelUploadBulkInventory />
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
            path="/UpdateKani"
            element={
              <>
                <PageTitle title="Update Kani" />
                <UpdateKani />
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
            path="/Order/updateorderShippingDate/:id"
            element={
              <>
                <PageTitle title="Update Order Shipping Date" />
                <UpdateOrderShippingDate />
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
            path="/budget/viewBudget"
            element={
              <>
                <PageTitle title="View Budget" />
                <ViewBudget />
              </>
            }
          />

          <Route
            path="/report/budgetReport"
            element={
              <>
                <PageTitle title="View Budget Report By Date" />
                <BudgetReport />
              </>
            }
          />

          <Route
            path="/report/budgetReportbyDate"
            element={
              <>
                <PageTitle title="Budget Report By Date" />
                <BudgetReportView />
              </>
            }
          />
          <Route
            path="/Budget/updateBudget/:id"
            element={
              <>
                <PageTitle title="View Budget" />
                <UpdateBudget />
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
            path="/kaniOrders"
            element={
              <>
                <PageTitle title="Size" />
                <KaniOrders />
              </>
            }
          />

          {/* Supplier Ledger */}

          <Route
            path="/Ledger/CreateLedger"
            element={
              <>
                <PageTitle title="Size" />
                <CreateLedger />
              </>
            }
          />

          <Route
            path="/ledger/view"
            element={
              <>
                <PageTitle title="Size" />
                <ViewLedger />
              </>
            }
          />
          <Route
            path="/Supplier/Viewledger"
            element={
              <>
                <PageTitle title="Size" />
                <ViewSuppLedger />
              </>
            }
          />

          <Route
            path="/ledger/AddBulk"
            element={
              <>
                <PageTitle title="Size" />
                <ExcelUploadLedger />
              </>
            }
          />
          <Route
            path="/supplier/updateLedger/:id"
            element={
              <>
                <PageTitle title="Size" />
                <UpdateLedger />
              </>
            }
          />
          <Route
            path="/Ledger/updateLedger/:id"
            element={
              <>
                <PageTitle title="Size" />
                <UpdateLedgerr />
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
            path="/supplier/addBulkSupplier"
            element={
              <>
                <PageTitle title="Add Bulk Supplier" />
                <AddBulkSupplier />
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
            path="/customer/updateLedger/:id"
            element={
              <>
                <PageTitle title="Update Customer Ledger" />
                <UpdateCustomerLedger />
              </>
            }
          />


          <Route
            path="/customer/addCustomerBulk"
            element={
              <>
                <PageTitle title="Add Customer" />
                <ExcelUploadCustomer />
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
          {/* <Route
            path="/stockJournal/AddStockJournal"
            element={
              <>
                <PageTitle title="Add Stock Journal" />
                <AddStockJournel />
              </>
            }
          /> */}

          <Route
            path="/stockJournal/AddStockJournal"
            element={
              <>
                <PageTitle title="Add Stock Journal" />
                <AddStockJournell />
              </>
            }
          />

          <Route
            path="/stockJournal/ViewStockJournal"
            element={
              <>
                <PageTitle title="Add Stock Journal" />
                <ViewStockJournel />
              </>
            }
          />

          <Route
            path="/StockJournal/verifyStockJournalCreated/:id"
            element={
              <>
                <PageTitle title="Verify Stock Journal" />
                <VerifyStockJournal />
              </>
            }
          />
          {/* <Route
            path="/stockJournal/verify"
            element={
              <>
                <PageTitle title="Verify Stock Journal" />
                <ViewStockJournel />
              </>
            }
          /> */}

          <Route
            path="/stockJournal/verify"
            element={
              <>
                <PageTitle title="Verify Stock Journal" />
                <ViewStockJournalCreated />
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
