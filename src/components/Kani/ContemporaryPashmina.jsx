import React, { useEffect, useState } from "react";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { RiUserReceived2Fill, RiAlignItemBottomFill } from "react-icons/ri";
import { AiOutlinePartition } from "react-icons/ai";
import { TbReorder } from "react-icons/tb";
import { Link } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

// Contemporary Pashmina card mapping with colors
const contemporaryModeCards = [
  {
    title: "Contemporary Orders",
    link: "/contemporaryOrders",
    countKey: "contemporaryOrders",
    icon: <SiHomeassistantcommunitystore className="w-10 h-10" />,
    levelUp: true,
    color: "from-teal-500 to-teal-600",
  },
  {
    title: "Retail Contemporary",
    link: "/contemporary/retail-client-orders",
    countKey: "RetailContemporary",
    icon: <AiOutlinePartition className="w-10 h-10" />,
    levelUp: true,
    color: "from-indigo-500 to-indigo-600",
  },
  {
    title: "Wholesale Contemporary",
    link: "/WholesaleContemporary",
    countKey: "WholesaleContemporary",
    icon: <RiAlignItemBottomFill className="w-10 h-10" />,
    levelUp: true,
    color: "from-amber-500 to-amber-600",
  },
  {
    title: "Designer Collection",
    link: "/designerContemporary",
    countKey: "DesignerContemporary",
    icon: <TbReorder className="w-10 h-10" />,
    levelUp: true,
    color: "from-rose-500 to-rose-600",
  },
  {
    title: "Boutique Orders",
    link: "/boutiqueContemporary",
    countKey: "BoutiqueContemporary",
    icon: <RiUserReceived2Fill className="w-10 h-10" />,
    levelUp: false,
    color: "from-cyan-500 to-cyan-600",
  },
];

const ContemporaryPashmina = () => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      // Replace with your actual API call
      const mockCounts = {
        contemporaryOrders: 25,
        RetailContemporary: 12,
        WholesaleContemporary: 8,
        DesignerContemporary: 15,
        BoutiqueContemporary: 7,
      };
      setCounts(mockCounts);
    };

    fetchCounts();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Contemporary Pashmina" />

      {/* Colored Tiles */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {contemporaryModeCards.map((card, index) => (
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

            {/* Count - Uncomment if you want to display counts */}
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

export default ContemporaryPashmina;