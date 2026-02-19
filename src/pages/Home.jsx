import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import CardDataStats from '../components/CardDataStats';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Count, DOWNLOADCUSTOMER_REPORT } from '../Constants/utils';

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
import { toast } from 'react-toastify';
import { TbReorder } from 'react-icons/tb';

const Home = () => {
    const [unitCount, setUnitCount] = useState([]);
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { user, token } = currentUser;
    const role = user?.authorities?.map(auth => auth.authority) || [];
    const appMode = useSelector((state) => state?.persisted?.appMode);

    const { mode } = appMode
    console.log(mode, "kk");

    const handleDownloadReport = async () => {


        try {
            const response = await fetch(`${DOWNLOADCUSTOMER_REPORT}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                // body: JSON.stringify(filters), // Convert body to JSON string
            });

            if (!response.ok) {
                const errorText = await response.text(); // Get error response as text
                throw new Error(errorText || "Failed to download report");
            }

            const blob = await response.blob(); // Get the binary PDF file

            const disposition = response.headers.get("Content-Disposition");
            let filename = "Customer.csv"; // Default filename
            if (disposition && disposition.includes("attachment")) {
                const match = disposition.match(/filename="(.+)"/);
                if (match && match[1]) {
                    filename = match[1];
                }
            }
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename); // Use the filename from the header

            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Report downloaded successfully");
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while downloading the report");
        }
    };



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



    // Role-based card mapping
    const roleBasedCards = {
        ROLE_ADMIN: [
            { title: "Reports", link: "/Reports",  icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
            { title: "Retail/WholeSale Reports", link: "/report/wsRetailReport", countKey: "proforma", icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
            { title: "Orders", link: "/chart", countKey: "orders", icon: <SiHomeassistantcommunitystore className="w-10 h-10" />, levelDown: true },

            { title: "Upload Excel", link: "/product/addExcelProduct", countKey: "ordersWithCreated", icon: <AiOutlinePartition className="w-10 h-10" />, levelUp: true },
            { title: "Financial Reports", link: "/report/freports", countKey: "inventory", icon: <SiHomeassistantcommunitystore className="w-10 h-10" />, levelDown: true },



            {
                title: "Customer Report",
                countKey: "ordersWithCreatedAccepted",
                icon: <RiProgress1Line className="w-10 h-10" />,
                levelUp: true,
                isDownload: true // Added a flag to indicate it's a download button
            },
            { title: "Monthly Order Calender", link: "/Order/monthlyorders", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },
            { title: "Product Report", link: "/report/product", countKey: "approvedOrders", icon: <GrCompliance className="w-10 h-10" />, levelUp: true },
            { title: "Verifiy Product Transfer", link: "/stockJournal/verify", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },
            { title: "Pending for Bill", link: "/Recieved/pendingForBill", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },
            { title: "Stock Journal Accept", link: "/StockJournal/get", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },
        ],
        ROLE_EXECUTOR: [
            { title: "Reports", link: "/Reports",  icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
            { title: "Retail/WholeSale Reports", link: "/report/wsRetailReport", countKey: "proforma", icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
            { title: "Orders", link: "/chart", countKey: "orders", icon: <SiHomeassistantcommunitystore className="w-10 h-10" />, levelDown: true },
           
            { title: "Monthly Order Calender", link: "/Order/monthlyorders", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },



        ],

        ROLE_ADMIN_DLI: [
            { title: "Reports", link: "/Reports",  icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
            { title: "Retail/WholeSale Reports", link: "/report/wsRetailReport", countKey: "proforma", icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
            { title: "Orders", link: "/chart", countKey: "orders", icon: <SiHomeassistantcommunitystore className="w-10 h-10" />, levelDown: true },
            { title: "Upload Excel", link: "/product/addExcelProduct", countKey: "ordersWithCreated", icon: <AiOutlinePartition className="w-10 h-10" />, levelUp: true },
            { title: "Monthly Order Calender", link: "/Order/monthlyorders", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },

        ],
        ROLE_QUALITYCONTROL: [
           
            { title: "Monthly Order Calender", link: "/Order/monthlyorders", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },

        ],
        ROLE_VERIFIER: [
           
            { title: "Verifiy Product Transfer", link: "/stockJournal/verify", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },

        ],
        ROLE_FINANCE: [
           
            { title: "Pending for Bill", link: "/Recieved/pendingForBill", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },

        ],
        

        ROLE_ADMIN_SXR: [
            { title: "Reports", link: "/Reports",  icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
            { title: "Retail/WholeSale Reports", link: "/report/wsRetailReport", countKey: "proforma", icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
            { title: "Orders", link: "/chart", countKey: "orders", icon: <SiHomeassistantcommunitystore className="w-10 h-10" />, levelDown: true },
           
            { title: "Monthly Order Calender", link: "/Order/monthlyorders", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },
        ],
        ROLE_USER: [
            { title: "Reports", link: "/Reports",  icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
            { title: "Retail/WholeSale Reports", link: "/report/wsRetailReport", countKey: "proforma", icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
            
        ],

    };


     // Kani-based card mapping
const kaniModeCards = [
  {
    title: "Kani Orders",
    link: "/kaniOrders",
    countKey: "kaniOrders",
    icon: <SiHomeassistantcommunitystore className="w-10 h-10" />,
    levelUp: true,
  },
//  {
//     title: "Client Orders",
//     link: "/ClientOrders",
//     countKey: "ClientOrders",
//     icon: <RiUserReceived2Fill className="w-10 h-10" />,
//     levelUp: true,
//   },
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


    //acounts
    const accountsModeCards = [
        { title: "Accounts Dashboard", link: "/accounts/dashboard", countKey: "accountsData", icon: <LuScale className="w-10 h-10" />, levelUp: true },
        { title: "Pending for Bill", link: "/Recieved/pendingForBill", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },
        { title: "Billing Info", link: "/accounts/billing", countKey: "billing", icon: <MdRepartition className="w-10 h-10" />, levelDown: true },
        { title: "Invoices", link: "/accounts/invoices", countKey: "invoices", icon: <MdOutlinePending className="w-10 h-10" />, levelUp: true },
      ];

    // Get all cards user should see based on roles
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
        <DefaultLayout>
            <Breadcrumb pageName="Home" />
            <div className="grid grid-cols-1 gap-3 my-1 md:grid-cols-4 md:gap-3 xl:grid-cols-4 2xl:gap-7.5 ">
                {cardsToShow.map((card, index) => (
                    <Link to={card.link} key={index}>
                        <div
                            key={index}
                            onClick={card.isDownload ? handleDownloadReport : null} // Apply download function only to "Customer Report"
                            className="cursor-pointer  flex-col mt-4 " // Make it clear it's clickable
                        >
                            <CardDataStats
                                title={card.title}
                              
                                levelUp={card.levelUp}
                                levelDown={card.levelDown}
                            >
                                {card.icon}
                            </CardDataStats>
                        </div>
                    </Link>
                ))}
            </div>
        </DefaultLayout>
    );
};

export default Home;
