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

const Home = () => {
    const [unitCount, setUnitCount] = useState([]);
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { user, token } = currentUser;
    const role = user?.authorities?.map(auth => auth.authority) || [];


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
            { title: "Reports", link: "/product/viewProducts", countKey: "products", icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
            { title: "Retail/WholeSale Reports", link: "/order/searchproforma", countKey: "proforma", icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
            { title: "Total Orders", link: "/Order/ViewOrder", countKey: "orders", icon: <SiHomeassistantcommunitystore className="w-10 h-10" />, levelDown: true },

            { title: "Upload Excel", link: "/order/created", countKey: "ordersWithCreated", icon: <AiOutlinePartition className="w-10 h-10" />, levelUp: true },
            { title: "Financial Reports", link: "/inventory/viewProductInventory", countKey: "inventory", icon: <SiHomeassistantcommunitystore className="w-10 h-10" />, levelDown: true },



            {
                title: "Customer Report",
                countKey: "ordersWithCreatedAccepted",
                icon: <RiProgress1Line className="w-10 h-10" />,
                levelUp: true,
                isDownload: true // Added a flag to indicate it's a download button
            },
            { title: "Monthly Orders", link: "/order/partiallyApproved", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },
            { title: "Product Report", link: "/report/product", countKey: "approvedOrders", icon: <GrCompliance className="w-10 h-10" />, levelUp: true },


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

        ]
    };

    // Get all cards user should see based on roles
    const cardsToShow = role.flatMap(roleName => roleBasedCards[roleName] || []);

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Dashboard" />
            <div className="grid grid-cols-1 gap-3 my-1 md:grid-cols-4 md:gap-3 xl:grid-cols-4 2xl:gap-7.5">
                {cardsToShow.map((card, index) => (
                    <Link to={card.link} key={index}>
                        <div
                            key={index}
                            onClick={card.isDownload ? handleDownloadReport : null} // Apply download function only to "Customer Report"
                            className="cursor-pointer" // Make it clear it's clickable
                        >
                            <CardDataStats
                                title={card.title}
                                total={countMapping[card.countKey] || 0}
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
