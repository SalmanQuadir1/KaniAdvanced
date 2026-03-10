import React, { useEffect, useState } from "react";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { RiAlignItemBottomFill } from "react-icons/ri";
import { AiOutlinePartition } from "react-icons/ai";
import { TbReorder } from "react-icons/tb";
import { Link } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

// Cotton card mapping (simple cards - no colors)
const cottonCards = [
  // {
  //   title: "Cotton Section",
  //   link: "/cotton",
  //   countKey: "cottonOrders",
  //   icon: <SiHomeassistantcommunitystore className="w-10 h-10" />,
  //   levelUp: true,
  // },
  {
    title: "Cotton Orders",
    link: "/cottonOrders",
    countKey: "cottonOrders",
    icon: <SiHomeassistantcommunitystore className="w-10 h-10" />,
    levelUp: true,
  },
  {
    title: "Retail Cotton",
    link: "/cotton/retail-client-orders",
    countKey: "RetailCotton",
    icon: <AiOutlinePartition className="w-10 h-10" />,
    levelUp: true,
  },
  {
    title: "Wholesale Cotton",
    link: "/cotton/wholesale-client-orders",
    countKey: "WholesaleCotton",
    icon: <RiAlignItemBottomFill className="w-10 h-10" />,
    levelUp: true,
  },
  {
    title: "KLC Cotton",
    link: "/cotton-klc-orders",
    countKey: "KlcCotton",
    icon: <TbReorder className="w-10 h-10" />,
    levelUp: true,
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

      {/* Simple Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cottonCards.map((card, index) => {
          // Check if this is the current page (Cotton Section)
          const isCurrentPage = card.title === "Cotton Section";
          
          if (isCurrentPage) {
            // For current page, use a div with NO link (not clickable)
            return (
              <div
                key={index}
                className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark cursor-default ring-2 ring-primary ring-offset-2"
              >
                <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4 mb-4">
                  {card.icon}
                </div>
                {/* <h4 className="text-title-md font-bold text-black dark:text-white">
                  {counts[card.countKey] || 0}
                </h4> */}
                <span className="text-sm font-medium">{card.title}</span>
              </div>
            );
          } else {
            // For other pages, use Link for navigation (clickable)
            return (
              <Link
                key={index}
                to={card.link}
                className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark cursor-pointer transition-transform hover:scale-105 block"
              >
                <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4 mb-4">
                  {card.icon}
                </div>
                {/* <h4 className="text-title-md font-bold text-black dark:text-white">
                  {counts[card.countKey] || 0}
                </h4> */}
                <span className="text-sm font-medium">{card.title}</span>
              </Link>
            );
          }
        })}
      </div>
    </DefaultLayout>
  );
};

export default Cotton;