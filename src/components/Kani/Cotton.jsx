import React, { useEffect, useState } from "react";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { RiAlignItemBottomFill } from "react-icons/ri";
import { AiOutlinePartition } from "react-icons/ai";
import { TbReorder } from "react-icons/tb";
import { Link } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

// Cotton card mapping
const cottonCards = [
  {
    title: "Cotton Orders",
    link: "/cottonOrders",
    icon: <SiHomeassistantcommunitystore className="w-10 h-10" />,
    color: "from-pink-500 to-pink-600",
  },
  {
    title: "Retail Cotton",
    link: "/cotton/retail-client-orders",
    icon: <AiOutlinePartition className="w-10 h-10" />,
    color: "from-green-500 to-green-600",
  },
  {
    title: "Wholesale Cotton",
    link: "/cotton/wholesale-client-orders",
    icon: <RiAlignItemBottomFill className="w-10 h-10" />,
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "KLC Cotton",
    link: "/cotton-klc-orders",
    icon: <TbReorder className="w-10 h-10" />,
    color: "from-blue-500 to-blue-600",
  },
];

const Cotton = () => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      const mockCounts = {
        cottonOrders: 20,
        RetailCotton: 10,
        WholesaleCotton: 6,
        KlcCotton: 12,
      };
      setCounts(mockCounts);
    };

    fetchCounts();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Cotton" />

      {/* SAME GRID + SAME CARD SIZE */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cottonCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${card.color} p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-48 flex flex-col`}
          >
            {/* Glow Background */}
            <div className="absolute right-0 top-0 -mt-4 -mr-4 h-20 w-20 rounded-full bg-white/10 blur-2xl"></div>

            {/* Icon */}
            <div className="mb-4 text-white/90">{card.icon}</div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white min-h-[56px] leading-tight">
              {card.title}
            </h3>

            {/* View Button */}
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

export default Cotton;