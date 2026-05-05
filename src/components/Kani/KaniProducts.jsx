import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import axios from 'axios';
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import CardDataStats from "../../components/CardDataStats";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { GiScrollUnfurled } from "react-icons/gi";
import { GiBandageRoll } from "react-icons/gi";
import { TbReorder } from 'react-icons/tb';
import { GiCottonFlower } from "react-icons/gi";
import { GiWool } from "react-icons/gi";
import { GiRolledCloth } from "react-icons/gi";
import { FaDropbox } from "react-icons/fa";
import { VIEW_ALL_PRODUCT_SUBGROUP_URL } from "../../Constants/utils";

const KaniProducts = () => {
  const { currentUser } = useSelector((state) => state?.persisted?.user || {});
  const [productGroups, setProductGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Icon mapping for different product types
  const getIconForProduct = (productName) => {
    const name = productName?.toLowerCase() || "";
    if (name.includes("kani")) return <SiHomeassistantcommunitystore className="w-10 h-10" />;
    if (name.includes("pashmina")) return <GiScrollUnfurled className="w-10 h-10" />;
    if (name.includes("contemporary pashmina")) return <GiBandageRoll className="w-10 h-11" />;
    if (name.includes("papier")) return <TbReorder className="w-10 h-10" />;
    if (name.includes("wool embroidery")) return <GiWool className="w-10 h-10" />;
    if (name.includes("contemporary wool")) return <GiRolledCloth className="w-10 h-10" />;
    if (name.includes("cotton")) return <GiCottonFlower className="w-10 h-10" />;
    if (name.includes("saree")) return <FaDropbox className="w-10 h-10" />;
    return <FaDropbox className="w-10 h-10" />;
  };

  // Fetch product groups from API
  useEffect(() => {
    const fetchProductGroups = async () => {
      try {
        setLoading(true);
        const response = await axios.get(VIEW_ALL_PRODUCT_SUBGROUP_URL, {
          headers: {
            'Authorization': `Bearer ${currentUser?.token}`
          }
        });
        
        const products = response.data;
        
        // Transform API data to card format - ONLY THIS PART CHANGED
        const cards = products.map((product, index) => ({
          title: product.name || product.productGroupName || product.title,
          link: `/ProductGroupDetails/${product.id}?name=${encodeURIComponent(product.name || product.productGroupName)}`,
          icon: getIconForProduct(product.name || product.productGroupName),
          levelUp: true,
          id: product.id
        }));
        
        setProductGroups(cards);
      } catch (error) {
        console.error("Error fetching product groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductGroups();
  }, [currentUser]);

  if (loading) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Kani Orders" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Kani Orders" />

      {/* Dynamic Tiles from API */}
      <div className="mb-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-y-8 2xl:gap-4">
          {productGroups.map((card, index) => (
            <Link to={card.link} key={card.id || index} className="flex-col">
              <div className="cursor-pointer transition-transform hover:scale-105">
                <CardDataStats
                  title={card.title}
                  levelUp={card.levelUp}
                >
                  {card.icon}
                </CardDataStats>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default KaniProducts;