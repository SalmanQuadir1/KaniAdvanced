import React from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import CardDataStats from "../../components/CardDataStats";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { GiScrollUnfurled } from "react-icons/gi";
import { AiOutlinePartition } from "react-icons/ai";
import { RiUserReceived2Fill, RiAlignItemBottomFill } from "react-icons/ri";
import { GiBandageRoll } from "react-icons/gi";
import { TbReorder } from 'react-icons/tb';
import { GiCottonFlower } from "react-icons/gi";
import { GiWool } from "react-icons/gi";
import { GiRolledCloth } from "react-icons/gi";
import { FaDropbox } from "react-icons/fa";

const KaniProducts = () => {
  const { currentUser } = useSelector((state) => state?.persisted?.user || {});

  // Kani-based card mapping
  const kaniModeCards = [
     {
    title: "Kani Section",
    link: "/kaniSection",
    countKey: "kaniOrders",
    icon: <SiHomeassistantcommunitystore className="w-10 h-10" />,
    levelUp: true,
    isGradient: true,
  },

  {
      title: "Pashmina Embroidery",
      link: "/pashminaEmbroidery",
      countKey: "pashminaEmbroidery",
      icon: <GiScrollUnfurled className="w-10 h-10" />,
      levelUp: true,
      isGradient: true,
      gradientColor: "from-purple-500 to-purple-600",
    },

    {
        title: "Contemporary Pashmina",
        link: "/contemporaryPashmina",
        countKey: "contemporaryPashmina",
        icon: <GiBandageRoll  className="w-10 h-11" />,
        levelUp: true,
        isGradient: true,
        gradientColor: "from-green-500 to-green-600", 
      },
       {
        title: "Papier Mache",
        link: "/papierMache",
        countKey: "papierMache",
        icon: <TbReorder className="w-10 h-10" />,
        levelUp: true,
        isGradient: true,
        gradientColor: "from-red-500 to-red-600", 
      },
       {
        title: "Wool Embroidery",
        link: "/woolEmbroidery",
        countKey: "woolEmbroidery",
        icon: <GiWool  className="w-10 h-10" />,
        levelUp: true,
        isGradient: true,
        gradientColor: "from-amber-700 to-amber-800", 
      },
      {
        title: "Contemporary Wool",
        link: "/contemporaryWool",
        countKey: "contemporaryWool",
        icon: <GiRolledCloth  className="w-10 h-10" />,
        levelUp: true,
        isGradient: true,
        gradientColor: "from-orange-600 to-orange-700", 
      },
      {
        title: "Cotton",
        link: "/cotton",
        countKey: "cotton",
        icon: <GiCottonFlower  className="w-10 h-10" />,
        levelUp: true,
        isGradient: true,
        gradientColor: "from-yellow-600 to-yellow-700", 
      },
       {
        title: "Contemporary Saree",
        link: "/contemporarySaree",
        countKey: "contemporarySaree",
        icon: <FaDropbox   className="w-10 h-10" />,
        levelUp: true,
        isGradient: true,
        gradientColor: "from-teal-500 to-teal-600", 
      },
  
  ];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Kani Orders" />

      {/* Kani Mode Tiles Section */}
      <div className="mb-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-y-8 2xl:gap-4">
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
    </DefaultLayout>
  );
};

export default KaniProducts;