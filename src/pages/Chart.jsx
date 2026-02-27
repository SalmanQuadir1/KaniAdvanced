import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import CardDataStats from '../components/CardDataStats';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Count } from '../Constants/utils';

// Import Icons
import { LuScale, LuPanelLeftClose } from "react-icons/lu";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { AiOutlinePartition, AiOutlineClose } from "react-icons/ai";
import { RiProgress1Line, RiProgress8Fill, RiUserReceived2Fill, RiAlignItemBottomFill } from "react-icons/ri";
import { FcApproval, FcCancel } from "react-icons/fc";
import { GrCompliance, GrUpdate } from "react-icons/gr";
import { MdRepartition, MdOutlinePendingActions, MdOutlinePending, MdRecommend, MdEditSquare } from "react-icons/md";
import { PiGearFineFill } from "react-icons/pi";
import { CiCalendarDate } from "react-icons/ci";
import { VscDiffModified } from "react-icons/vsc";
import { FaBook } from "react-icons/fa6";
import { TbReorder } from "react-icons/tb";

const Chart = () => {
  const [unitCount, setUnitCount] = useState([]);
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { user, token } = currentUser;
  const role = user?.authorities?.map(auth => auth.authority) || [];
  const appMode = useSelector((state) => state?.persisted?.appMode);

  const { mode } = appMode
  console.log(mode, "kk");

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(Count, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        setUnitCount(data || []);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, [token]);

  // Convert unitCount array to an object for quick lookup
  const countMapping = unitCount.reduce((acc, item) => {
    acc[item.tableName] = item.count;
    return acc;
  }, {});

  // Kani-based card mapping
const kaniModeCards = [
  {
    title: "Kani Section",
    link: "/kaniSection",
    countKey: "kaniOrders",
    icon: <SiHomeassistantcommunitystore className="w-10 h-10" />,
    levelUp: true,
    isGradient: true,
  },
  
  {
    title: "Pashmina Embroidery",
    link: "/pashminaEmbroidery",
    countKey: "pashminaEmbroidery",
    icon: <AiOutlinePartition className="w-10 h-10" />,
    levelUp: true,
    isGradient: true,
    gradientColor: "from-purple-500 to-purple-600", // Add this line for purple
  },
  {
    title: "Contemporary Pashmina",
    link: "/contemporaryPashmina",
    countKey: "contemporaryPashmina",
    icon: <RiAlignItemBottomFill className="w-10 h-11" />,
    levelUp: true,
    isGradient: true,
    gradientColor: "from-green-500 to-green-600", 
  },
  {
    title: "Papier Mache",
    link: "/papierMache",
    countKey: "papierMache",
    icon: <TbReorder className="w-10 h-10" />,
    levelUp: true,
    isGradient: true,
    gradientColor: "from-red-500 to-red-600", 
  },
  // {
  //   title: "Client Orders",
  //   link: "/ClientOrders",
  //   countKey: "ClientOrders",
  //   icon: <RiUserReceived2Fill className="w-10 h-10" />,
  //   levelUp: true,
  // },
  {
    title: "Retail Client Orders",
    link: "/RetailClientOrders",
    countKey: "RetailClientOrders",
    icon:  <AiOutlinePartition className="w-10 h-10" />,
    levelUp: true,
  },
   {
    title: "Wholesale Client Orders",
    link: "/WholesaleClientOrders",
    countKey: "WholesaleClientOrders",
    icon:  <RiAlignItemBottomFill className="w-10 h-10" />,
    levelUp: true,
  },
  {
    title: "Klc Orders",
    link: "/KlcOrders",
    countKey: "KlcOrders",
    icon:  <TbReorder className="w-10 h-10" />,
    levelUp: true,
  },
  
 
];


  // Role-based card mapping
  const accountsModeCards = [
    { title: "Accounts Dashboard", link: "/accounts/dashboard", countKey: "accountsData", icon: <LuScale className="w-10 h-10" />, levelUp: true },
    { title: "Billing Info", link: "/accounts/billing", countKey: "billing", icon: <MdRepartition className="w-10 h-10" />, levelDown: true },
    { title: "Invoices", link: "/accounts/invoices", countKey: "invoices", icon: <MdOutlinePending className="w-10 h-10" />, levelUp: true },
    { title: "Day Book", link: "/configurator/dayBook", countKey: "invoices", icon: <FaBook className="w-10 h-10" />, levelUp: true },
    { title: "Ledger Summary Balances", link: "/configurator/ledgersummary", countKey: "invoices", icon: <FaBook className="w-10 h-10" />, levelUp: true },
    { title: "Orders With Vouchers", link: "/configurator/OrderVoucher", countKey: "invoices", icon: <TbReorder className="w-10 h-10" />, levelUp: true },
  ];
  const roleBasedCards = {
    ROLE_ADMIN: [
      // { title: "Products", link: "/product/viewProducts", countKey: "products", icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
      { title: "Total Orders", link: "/Order/ViewOrder", countKey: "orders", icon: <SiHomeassistantcommunitystore className="w-10 h-10" />, levelDown: true },
      { title: "Proforma", link: "/order/searchproforma", icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
      { title: "Orders Pending For Production Approval", link: "/order/created", countKey: "ordersWithCreated", icon: <AiOutlinePartition className="w-10 h-10" />, levelUp: true },
      { title: "Partially Approved By Production Orders", link: "/order/partiallyexecuted", countKey: "ordersWithCreatedAccepted", icon: <RiProgress1Line className="w-10 h-10" />, levelUp: true },
      { title: "Approved By Production Orders", link: "/orderlist/Executed", countKey: "ordersWithOnlyAccepted", icon: <FcApproval className="w-10 h-10" />, levelUp: true },
      { title: "In Progress Orders", link: "/order/Approved", countKey: "approvedOrders", icon: <GrCompliance className="w-10 h-10" />, levelUp: true },
      { title: "Partially In Progress Orders", link: "/order/partiallyApproved", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },
      
      
      { title: "Completed Orders", link: "/orderlist/Closed", countKey: "ordersWithOnlyClosed", icon: <MdRecommend className="w-10 h-10" />, levelUp: true },
      { title: "Partially Closed Orders", link: "/orderlist/PartiallyClosed", countKey: "ordersWithOnlyPartiallyClosed", icon: <MdRepartition className="w-10 h-10" />, levelUp: true },
      { title: "Update Challan No And Date", link: "/orderlist/UpdateChallan", countKey: "ordersWithApprovedChallan", icon: <PiGearFineFill className="w-10 h-10" />, levelUp: true },
      { title: "Pending Orders", link: "/orderlist/Pending", countKey: "ordersWithOnlyPending", icon: <MdOutlinePendingActions className="w-10 h-10" />, levelUp: true },
      { title: "Partially Pending Orders", link: "/orderlist/PartiallyPending", countKey: "ordersWithAtLeastOnePending", icon: <MdOutlinePending className="w-10 h-10" />, levelUp: true },
      { title: "Forced Closed Orders", link: "/orderlist/ForcedClosure", countKey: "ordersWithForcedClosure", icon: <LuPanelLeftClose className="w-10 h-10" />, levelUp: true },
      { title: "Rejected By Production Orders", link: "/orderlist/RejectedOrders", countKey: "ordersWithRejected", icon: <AiOutlineClose className="w-10 h-10" />, levelUp: true },
      { title: "Supplier Date Updation Orders", link: "/order/supplierExpectdateUpdate", countKey: "approvedSupplierOrdersCount", icon: <CiCalendarDate className="w-10 h-10" />, levelUp: true },
      { title: "Supplier Receiving Orders", link: "/order/supplierRecievingOrders", countKey: "ordersWithSupplierReceiving", icon: <RiUserReceived2Fill className="w-10 h-10" />, levelUp: true },
      { title: "Production Modification Orders", link: "/order/needModification", countKey: "ordersNeedModification", icon: <VscDiffModified className="w-10 h-10" />, levelUp: true },
      { title: "Cancelled Orders", link: "/order/Cancelled", countKey: "ordersCancelled", icon: <FcCancel className="w-10 h-10" />, levelUp: true },
      { title: "Edit Received Quantity", link: "/order/recievedQuantity", countKey: "ordersWithPendingProducts", icon: <MdEditSquare className="w-10 h-10" />, levelUp: true },
      { title: "Update Shipping Date", link: "/order/updateShippingDate", countKey: "ordersWithShippingDate", icon: <GrUpdate className="w-10 h-10" />, levelUp: true },
      { title: "Monthly Orders", link: "/Order/monthlyorders", icon: <SiHomeassistantcommunitystore className="w-10 h-10" />, levelDown: true }
    ],
    ROLE_QUALITYCONTROL: [
      // { title: "Products", link: "/product/viewProducts", countKey: "products", icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },{ title: "Approved By Production Orders", link: "/orderlist/Executed", countKey: "ordersWithOnlyAccepted", icon: <FcApproval className="w-10 h-10" />, levelUp: true },
      { title: "Completed Orders", link: "/orderlist/Closed", countKey: "ordersWithOnlyClosed", icon: <MdRecommend className="w-10 h-10" />, levelUp: true },
      
    ],

    ROLE_EXECUTOR: [
      { title: "Total Orders", link: "/Order/ViewOrder", countKey: "orders", icon: <SiHomeassistantcommunitystore className="w-10 h-10" />, levelDown: true },
      { title: "Orders Pending For Production Approval", link: "/order/created", countKey: "ordersWithCreated", icon: <AiOutlinePartition className="w-10 h-10" />, levelUp: true },
      { title: "Approved By Production Orders", link: "/orderlist/Executed", countKey: "ordersWithOnlyAccepted", icon: <FcApproval className="w-10 h-10" />, levelUp: true },
      { title: "Partially Approved By Production Orders", link: "/order/partiallyexecuted", countKey: "ordersWithCreatedAccepted", icon: <RiProgress1Line className="w-10 h-10" />, levelUp: true },
      { title: "Partially In Progress Orders", link: "/order/partiallyApproved", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },
      { title: "Partially Completed Orders", link: "/orderlist/PartiallyClosed", countKey: "ordersWithOnlyPartiallyClosed", icon: <MdRepartition className="w-10 h-10" />, levelUp: true },
      { title: "Partially Pending Orders", link: "/orderlist/PartiallyPending", countKey: "ordersWithAtLeastOnePending", icon: <MdOutlinePending className="w-10 h-10" />, levelUp: true },
      { title: "Rejected By Production Orders", link: "/orderlist/RejectedOrders", countKey: "ordersWithRejected", icon: <AiOutlineClose className="w-10 h-10" />, levelUp: true },
      { title: "Production Modification Orders", link: "/order/needModification", countKey: "ordersNeedModification", icon: <VscDiffModified className="w-10 h-10" />, levelUp: true },
      { title: "Cancelled Orders", link: "/order/Cancelled", countKey: "ordersCancelled", icon: <FcCancel className="w-10 h-10" />, levelUp: true },



    ],

    ROLE_ADMIN_DLI: [
      { title: "Total Orders", link: "/Order/ViewOrder", countKey: "orders", icon: <SiHomeassistantcommunitystore className="w-10 h-10" />, levelDown: true },
      { title: "Proforma", link: "/order/searchproforma", countKey: "proforma", icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
      { title: "Orders Pending For Production Approval", link: "/order/created", countKey: "ordersWithCreated", icon: <AiOutlinePartition className="w-10 h-10" />, levelUp: true },
      { title: "Partially Approved By Production Orders", link: "/order/partiallyexecuted", countKey: "ordersWithCreatedAccepted", icon: <RiProgress1Line className="w-10 h-10" />, levelUp: true },
      { title: "In Progress Orders", link: "/order/Approved", countKey: "approvedOrders", icon: <GrCompliance className="w-10 h-10" />, levelUp: true },
      { title: "Partially In Progress Orders", link: "/order/partiallyApproved", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },
      { title: "Partially Completed Orders", link: "/orderlist/PartiallyClosed", countKey: "ordersWithOnlyPartiallyClosed", icon: <MdRepartition className="w-10 h-10" />, levelUp: true },
      { title: "Partially Pending Orders", link: "/orderlist/PartiallyPending", countKey: "ordersWithAtLeastOnePending", icon: <MdOutlinePending className="w-10 h-10" />, levelUp: true },
      { title: "Supplier Receiving Orders", link: "/order/supplierRecievingOrders", countKey: "ordersWithSupplierReceiving", icon: <RiUserReceived2Fill className="w-10 h-10" />, levelUp: true },

      { title: "Production Modification Orders", link: "/order/needModification", countKey: "ordersNeedModification", icon: <VscDiffModified className="w-10 h-10" />, levelUp: true },
      { title: "Update Shipping Date", link: "/order/updateShippingDate", countKey: "ordersWithShippingDate", icon: <GrUpdate className="w-10 h-10" />, levelUp: true },

    ],
    
    ROLE_ADMIN_SXR: [
      { title: "Total Orders", link: "/Order/ViewOrder", countKey: "orders", icon: <SiHomeassistantcommunitystore className="w-10 h-10" />, levelDown: true },
      { title: "Approved By Production Orders", link: "/orderlist/Executed", countKey: "ordersWithOnlyAccepted", icon: <FcApproval className="w-10 h-10" />, levelUp: true },
      { title: "Partially Approved By Production Orders", link: "/order/partiallyexecuted", countKey: "ordersWithCreatedAccepted", icon: <RiProgress1Line className="w-10 h-10" />, levelUp: true },
      { title: "Update Challan No And Date", link: "/orderlist/UpdateChallan", countKey: "ordersWithApprovedChallan", icon: <PiGearFineFill className="w-10 h-10" />, levelUp: true },
      { title: "In Progress Orders", link: "/order/Approved", countKey: "approvedOrders", icon: <GrCompliance className="w-10 h-10" />, levelUp: true },
      { title: "Partially In Progress Orders", link: "/order/partiallyApproved", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },
      { title: "Completed Orders", link: "/orderlist/Closed", countKey: "ordersWithOnlyClosed", icon: <MdRecommend className="w-10 h-10" />, levelUp: true },
      { title: "Partially Completed Orders", link: "/orderlist/PartiallyClosed", countKey: "ordersWithOnlyPartiallyClosed", icon: <MdRepartition className="w-10 h-10" />, levelUp: true },
      { title: "Pending Orders", link: "/orderlist/Pending", countKey: "ordersWithOnlyPending", icon: <MdOutlinePendingActions className="w-10 h-10" />, levelUp: true },
      { title: "Partially Pending Orders", link: "/orderlist/PartiallyPending", countKey: "ordersWithAtLeastOnePending", icon: <MdOutlinePending className="w-10 h-10" />, levelUp: true },
      { title: "Forced Closed Orders", link: "/orderlist/ForcedClosure", countKey: "ordersWithForcedClosure", icon: <LuPanelLeftClose className="w-10 h-10" />, levelUp: true },
      { title: "Supplier Date Updation Orders", link: "/order/supplierExpectdateUpdate", countKey: "approvedSupplierOrdersCount", icon: <CiCalendarDate className="w-10 h-10" />, levelUp: true },
      { title: "Supplier Receiving Orders", link: "/order/supplierRecievingOrders", countKey: "ordersWithSupplierReceiving", icon: <RiUserReceived2Fill className="w-10 h-10" />, levelUp: true },

    ],
    ROLE_VERIFIER: [
           
      { title: "Verifiy Product Transfer", link: "/stockJournal/verify", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },

  ],
  };

  // Get all cards user should see based on roles
  const cardsToShow = (() => {
    if (mode === "production") {
      return role.flatMap(roleName => roleBasedCards[roleName] || []);
    }
  
    if (mode === "accounts" && role.includes("ROLE_ADMIN")) {
      return accountsModeCards;
    }
    // 🔹 Kani Dashboard
  if (mode === "kani") {
    return kaniModeCards;
  }
  
    return [];
  })();

  return (
    // <DefaultLayout>
    //   <Breadcrumb pageName="Dashboard" />
    //   <div className="grid grid-cols-1  gap-3 my-1 md:grid-cols-4 md:gap-3 xl:grid-cols-4 2xl:gap-7.5">
    //     {cardsToShow.map((card, index) => (
    //       <Link to={card.link} key={index}>
    //         <CardDataStats
    //           title={card.title}
    //           total={countMapping[card.countKey] }
    //           levelUp={card.levelUp}
    //           levelDown={card.levelDown}
    //         >
    //           {card.icon}
    //         </CardDataStats>
    //       </Link>
    //     ))}
    //   </div>
    // </DefaultLayout>

<DefaultLayout>
      <Breadcrumb pageName="Dashboard" />
      <div className="grid grid-cols-1 gap-3 my-1 md:grid-cols-4 md:gap-3 xl:grid-cols-4 2xl:gap-7.5">
        {cardsToShow.map((card, index) => (
          <Link to={card.link} key={index}>
{card.isGradient ? (
  // Gradient styled card with fixed height and consistent layout
  <div className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${card.gradientColor || 'from-blue-500 to-blue-600'} p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-48 flex flex-col`}>
    <div className="absolute right-0 top-0 -mt-4 -mr-4 h-20 w-20 rounded-full bg-white/10 blur-2xl"></div>
    {card.levelUp && (
      <span className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
        Level Up
      </span>
    )}
    <div className="mb-4 text-white/90">{card.icon}</div>
    
    {/* Title with fixed height for 2 lines */}
    <h3 className="text-xl font-bold text-white min-h-[56px] leading-tight">
      {card.title}
    </h3>
    
    {/* Count with fixed margin */}
    {card.countKey && countMapping[card.countKey] !== undefined && (
      <p className="text-sm text-white/80 mt-2">{countMapping[card.countKey]} items</p>
    )}
    
    {/* View link always at bottom */}
    <div className="mt-auto flex items-center text-sm font-medium text-white/90 pt-4">
      View
      <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
) : (
  // Regular CardDataStats for all other cards
  <CardDataStats
    title={card.title}
    total={countMapping[card.countKey]}
    levelUp={card.levelUp}
    levelDown={card.levelDown}
  >
    {card.icon}
  </CardDataStats>
)}
          </Link>
        ))}
      </div>
    </DefaultLayout>
    
  );
};

export default Chart;
