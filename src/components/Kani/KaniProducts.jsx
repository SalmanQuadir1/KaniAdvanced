import React from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import CardDataStats from "../../components/CardDataStats";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { AiOutlinePartition } from "react-icons/ai";
import { RiUserReceived2Fill, RiAlignItemBottomFill } from "react-icons/ri";
import { TbReorder } from 'react-icons/tb';

const KaniProducts = () => {
  const { currentUser } = useSelector((state) => state?.persisted?.user || {});

  // Kani-based card mapping
  const kaniModeCards = [
    {
    title: "Kani Orders",
    link: "/kaniOrders",
    countKey: "kaniOrders",
    icon: <SiHomeassistantcommunitystore className="w-10 h-10" />,
    levelUp: true,
  },
 {
    title: "Client Orders",
    link: "/ClientOrders",
    countKey: "ClientOrders",
    icon: <RiUserReceived2Fill className="w-10 h-10" />,
    levelUp: true,
  },
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

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Kani Orders" />

      {/* Kani Mode Tiles Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 px-2">
          Kani Dashboard Navigation
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:gap-4">
          {kaniModeCards.map((card, index) => {
            // Check if this is the current page (Kani Orders)
            const isCurrentPage = card.title === "";
            
            if (isCurrentPage) {
              // For current page, use a div with NO link (not clickable)
              return (
                <div 
                  key={index} 
                  className="flex-col cursor-default ring-2 ring-primary ring-offset-2"
                >
                  <CardDataStats
                    title={card.title}
                    levelUp={card.levelUp}
                  >
                    {card.icon}
                  </CardDataStats>
                </div>
              );
            } else {
              // For other pages, use Link for navigation (clickable)
              return (
                <Link to={card.link} key={index} className="flex-col">
                  <div className="cursor-pointer transition-transform hover:scale-105">
                    <CardDataStats
                      title={card.title}
                      levelUp={card.levelUp}
                    >
                      {card.icon}
                    </CardDataStats>
                  </div>
                </Link>
              );
            }
          })}
        </div>
      </div>

      {/* Optional: Simple message */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg">Welcome to Kani Dashboard</p>
          <p className="text-sm mt-2">Click on any tile above to navigate to different order sections</p>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default KaniProducts;