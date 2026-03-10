import React, { useEffect, useState } from "react";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { RiUserReceived2Fill, RiAlignItemBottomFill } from "react-icons/ri";
import { AiOutlinePartition } from "react-icons/ai";
import { TbReorder } from "react-icons/tb";
import { Link } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

// Contemporary Saree card mapping (simple cards - no colors)
const contemporarySareeCards = [
  // {
  //   title: "Contemporary Saree Section",
  //   link: "/contemporarySaree",
  //   countKey: "contemporarySareeOrders",
  //   icon: <SiHomeassistantcommunitystore className="w-10 h-10" />,
  //   levelUp: true,
  // },
  {
    title: "Contemporary Saree Orders",
    link: "/contemporarySareeOrders",
    countKey: "contemporarySareeOrders",
    icon: <SiHomeassistantcommunitystore className="w-10 h-10" />,
    levelUp: true,
  },
  {
    title: "Retail Saree",
    link: "/sareeRetail",
    countKey: "RetailSaree",
    icon: <AiOutlinePartition className="w-10 h-10" />,
    levelUp: true,
  },
  {
    title: "Wholesale Saree",
    link: "/sareeWholesale",
    countKey: "WholesaleSaree",
    icon: <RiAlignItemBottomFill className="w-10 h-10" />,
    levelUp: true,
  },
  {
    title: "Klc Saree Orders",
    link: "/sareeKlc",
    countKey: "sareeKlc",
    icon: <TbReorder className="w-10 h-10" />,
    levelUp: true,
  },
];

const ContemporarySaree = () => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      // Replace with your actual API call
      const mockCounts = {
        contemporarySareeOrders: 18,
        RetailSaree: 9,
        WholesaleSaree: 6,
        sareeKlc: 12,
      };
      setCounts(mockCounts);
    };

    fetchCounts();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Contemporary Saree" />

      {/* Simple Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {contemporarySareeCards.map((card, index) => {
          // Check if this is the current page (Contemporary Saree Section)
          const isCurrentPage = card.title === "Contemporary Saree Section";
          
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

export default ContemporarySaree;