import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

import DefaultLayout from '../layout/DefaultLayout';
import CardDataStats from '../components/CardDataStats';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchunit } from '../redux/Slice/UnitSlice';
import { LuScale } from "react-icons/lu";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { GiMaterialsScience } from "react-icons/gi";
import { IoJournalOutline } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { RiAlignItemBottomFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { Count } from '../Constants/utils';
const ApproverDashboard = () => {

  const [unitCount, setunitCount] = useState(0)
  // const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;




  useEffect(() => {


    const count = async () => {

      try {

        const response = await fetch(Count, {
          method: "GET",
          headers: {
            "content-type": "Application/json",
            "Authorization": `Bearer ${token}`
          }
        })

        const count = await response.json();

        setunitCount(count)

      } catch (error) {
        console.log(error);

      }

    }

    count();

  }, []);


  console.log(unitCount, "heyyyy");


  // Check if units.data is an array and has length, or default to 0
  const countMapping = {};
  unitCount && unitCount?.forEach(item => {
    countMapping[item.tableName] = item.count;
  });



  return (
    <DefaultLayout>

      <h3 className="text-2xl text-center dark:text-white font-extrabold">DASHBOARD</h3>
      <div className="grid grid-cols-1 gap-3 my-4 md:grid-cols-4 md:gap-3 xl:grid-cols-4 2xl:gap-7.5">
        <Link to={"/product/viewProducts"}>
          <CardDataStats
            title="Products"
            total={countMapping['products'] || 0}


            // rate="0.43%"
            levelUp
          >
            <RiAlignItemBottomFill className='w-13 h-10' />
          </CardDataStats>
        </Link>

        <Link to={"/inventory/viewProductInventory"}>
          <CardDataStats
            title="Inventory"
            total={countMapping['inventory'] || 0}


            // rate="0.43%"
            levelDown
          >
            <SiHomeassistantcommunitystore className='w-10 h-10' />

          </CardDataStats>
        </Link>



        <Link to={"/configurator/addunit"}>
          <CardDataStats
            title="Units"
            total={countMapping['unit'] || 0}


            // rate="0.43%"
            levelUp
          >
            <LuScale className='w-10 h-10' />
          </CardDataStats>
        </Link>



        <Link to={"/material/viewPurchase"}>
          <CardDataStats
            title="Purchase"
            total={countMapping['purchaseOrder'] || 0}


            // rate="0.43%"
            levelUp
          >
            <BiPurchaseTagAlt className='w-10 h-10' />

          </CardDataStats>
        </Link>
        <Link to={"/material/addmaterial"}>
          <CardDataStats
            title="Material"
            total={countMapping['material'] || 0}


            // rate="0.43%"
            levelUp
          >
            <GiMaterialsScience className='w-10 h-10' />

          </CardDataStats>

        </Link>







      </div>
    </DefaultLayout>
  );
};

export default ApproverDashboard;
