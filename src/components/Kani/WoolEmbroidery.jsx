import React, { useEffect, useState } from "react";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { RiUserReceived2Fill, RiAlignItemBottomFill } from "react-icons/ri";
import { AiOutlinePartition } from "react-icons/ai";
import { TbReorder } from "react-icons/tb";
import { Link } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

// Wool Embroidery card mapping with colors
const woolEmbroideryCards = [
  {
    title: "Wool Embroidery Orders",
    link: "/woolEmbroideryOrders",
    countKey: "woolEmbroideryOrders",
    icon: <SiHomeassistantcommunitystore className="w-10 h-10" />,
    levelUp: true,
    color: "from-purple-600 to-purple-700",
  },
  {
    title: "Retail Client Orders",
    link: "/wool-retail-orders",
    countKey: "RetailClientOrders",
    icon: <AiOutlinePartition className="w-10 h-10" />,
    levelUp: true,
    color: "from-amber-700 to-amber-800",
  },
  {
    title: "Wholesale Client Orders",
    link: "/wool-wholesale-orders",
    countKey: "WholesaleClientOrders",
    icon: <RiAlignItemBottomFill className="w-10 h-10" />,
    levelUp: true,
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "Klc Orders",
    link: "/wool-klc-orders",
    countKey: "KlcOrders",
    icon: <TbReorder className="w-10 h-10" />,
    levelUp: true,
    color: "from-red-500 to-red-600",
  },
 
];

const WoolEmbroidery = () => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      // Replace with your actual API call
      const mockCounts = {
        woolEmbroideryOrders: 18,
        RetailClientOrders: 12,
        WholesaleClientOrders: 8,
        KlcOrders: 15,
        pashminaEmbroidery: 22,
      };
      setCounts(mockCounts);
    };

    fetchCounts();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Wool Embroidery" />

      {/* Colored Tiles */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {woolEmbroideryCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${card.color} p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-48 flex flex-col`}
          >
            {/* Background Pattern */}
            <div className="absolute right-0 top-0 -mt-4 -mr-4 h-20 w-20 rounded-full bg-white/10 blur-2xl"></div>
            
            {/* Level Up Badge */}
            {card.levelUp && (
              <span className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                Level Up
              </span>
            )}

            {/* Icon */}
            <div className="mb-4 text-white/90">{card.icon}</div>

            {/* Title with fixed height for 2 lines */}
            <h3 className="text-xl font-bold text-white min-h-[56px] leading-tight">
              {card.title}
            </h3>

            {/* Count */}
            {/* {counts[card.countKey] !== undefined && (
              <p className="text-sm text-white/80 mt-2">
                {counts[card.countKey]} items
              </p>
            )} */}

            {/* View Link - pushed to bottom */}
            <div className="mt-auto flex items-center text-sm font-medium text-white/90 pt-4">
              View
              <svg
                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </DefaultLayout>
  );
};

export default WoolEmbroidery;