import React, { useEffect, useState } from "react";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { RiUserReceived2Fill, RiAlignItemBottomFill } from "react-icons/ri";
import { AiOutlinePartition } from "react-icons/ai";
import { TbReorder } from "react-icons/tb";
import { Link } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

// Papier Mache card mapping with colors
const papierMacheCards = [
  {
    title: "Papier Mache Orders",
    link: "/papierMacheOrders",
    countKey: "papierMacheOrders",
    icon: <SiHomeassistantcommunitystore className="w-10 h-10" />,
    levelUp: true,
    color: "from-amber-700 to-amber-800",
  },
  {
    title: "Retail Papier Mache",
    link: "/papierMache/retail-client-orders",
    countKey: "RetailPapierMache",
    icon: <AiOutlinePartition className="w-10 h-10" />,
    levelUp: true,
    color: "from-orange-600 to-orange-700",
  },
  {
    title: "Wholesale Papier Mache",
    link: "/papierMache/wholesale-client-orders",
    countKey: "WholesalePapierMache",
    icon: <RiAlignItemBottomFill className="w-10 h-10" />,
    levelUp: true,
    color: "from-red-600 to-red-700",
  },
  {
    title: "Klc Papier Mache",
    link: "/klcPapierMache",
    countKey: "KlcPapierMache",
    icon: <TbReorder className="w-10 h-10" />,
    levelUp: true,
    color: "from-purple-600 to-purple-700",
  },
 
];

const PapierMache = () => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      // Replace with your actual API call
      const mockCounts = {
        papierMacheOrders: 18,
        RetailPapierMache: 9,
        WholesalePapierMache: 6,
        KlcPapierMache: 4,
      };
      setCounts(mockCounts);
    };

    fetchCounts();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Papier Mache" />

      {/* Colored Tiles - Same size as Contemporary */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {papierMacheCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${card.color} p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
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

            {/* Title */}
            <h3 className="mb-2 text-xl font-bold text-white">{card.title}</h3>

            {/* Count - Commented out to match the Contemporary style */}
            {/* {counts[card.countKey] !== undefined && (
              <p className="text-sm text-white/80">
                {counts[card.countKey]} items
              </p>
            )} */}

            {/* View Link */}
            <div className="mt-6 flex items-center text-sm font-medium text-white/90">
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

export default PapierMache;