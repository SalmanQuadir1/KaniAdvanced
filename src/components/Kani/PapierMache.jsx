import React, { useEffect, useState } from "react";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { RiUserReceived2Fill, RiAlignItemBottomFill } from "react-icons/ri";
import { AiOutlinePartition } from "react-icons/ai";
import { TbReorder } from "react-icons/tb";
import { Link } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

// Papier Mache card mapping (simple cards - no colors)
const papierMacheCards = [
  // {
  //   title: "Papier Mache Section",
  //   link: "/papierMache",
  //   countKey: "papierMacheOrders",
  //   icon: <SiHomeassistantcommunitystore className="w-10 h-10" />,
  //   levelUp: true,
  // },
  {
    title: "Papier Mache Orders",
    link: "/papierMacheOrders",
    countKey: "papierMacheOrders",
    icon: <SiHomeassistantcommunitystore className="w-10 h-10" />,
    levelUp: true,
  },
  {
    title: "Retail Papier Mache",
    link: "/papierMache/retail-client-orders",
    countKey: "RetailPapierMache",
    icon: <AiOutlinePartition className="w-10 h-10" />,
    levelUp: true,
  },
  {
    title: "Wholesale Papier Mache",
    link: "/papierMache/wholesale-client-orders",
    countKey: "WholesalePapierMache",
    icon: <RiAlignItemBottomFill className="w-10 h-10" />,
    levelUp: true,
  },
  {
    title: "Klc Papier Mache",
    link: "/klcPapierMache",
    countKey: "KlcPapierMache",
    icon: <TbReorder className="w-10 h-10" />,
    levelUp: true,
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

      {/* Simple Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {papierMacheCards.map((card, index) => {
          // Check if this is the current page (Papier Mache Section)
          const isCurrentPage = card.title === "Papier Mache Section";
          
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

export default PapierMache;