import React from "react";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { RiAlignItemBottomFill } from "react-icons/ri";
import { AiOutlinePartition } from "react-icons/ai";
import { TbReorder } from "react-icons/tb";
import { Link } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

// Card mapping for Contemporary Wool
const contemporaryWoolCards = [
  {
    title: "Contemporary Wool Orders",
    link: "/contemporaryWoolOrders",
    icon: <SiHomeassistantcommunitystore className="w-10 h-10" />,
    color: "from-blue-600 to-blue-700",
  },
  {
    title: "Retail Client Orders",
    link: "/RetailContWoolOrders",
    icon: <AiOutlinePartition className="w-10 h-10" />,
    color: "from-green-600 to-green-700",
  },
  {
    title: "Wholesale Client Orders",
    link: "/ContWoolWholesaleOrders",
    icon: <RiAlignItemBottomFill className="w-10 h-10" />,
    color: "from-yellow-600 to-yellow-700",
  },
  {
    title: "KLC Orders",
    link: "/ContWoolKlcOrders",
    icon: <TbReorder className="w-10 h-10" />,
    color: "from-red-600 to-red-700",
  },
];

const ContemporaryWool = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Contemporary Wool" />

      {/* SAME GRID + SAME CARD SIZE */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {contemporaryWoolCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${card.color} p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-48 flex flex-col`}
          >
            {/* Glow background */}
            <div className="absolute right-0 top-0 -mt-4 -mr-4 h-20 w-20 rounded-full bg-white/10 blur-2xl"></div>

            {/* Icon */}
            <div className="mb-4 text-white/90">{card.icon}</div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white min-h-[56px] leading-tight">
              {card.title}
            </h3>

            {/* View */}
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

export default ContemporaryWool;