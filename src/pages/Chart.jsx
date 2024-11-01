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
import { Link } from 'react-router-dom';
const Chart = () => {

  const [unitCount, setunitCount] = useState(0)
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;




  useEffect(() => {
    dispatch(fetchunit(token));
  }, [dispatch, token]);

  const units = useSelector((state) => state?.nonPersisted?.unit);



  // Check if units.data is an array and has length, or default to 0




  return (
    <DefaultLayout>
      <Breadcrumb pageName="" />
      <h3 className="text-4xl dark:text-white">Dashboard</h3>
      <div className="grid grid-cols-1 gap-4 my-10 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        <Link to={"/configurator/addunit"}>
          <CardDataStats
            title="Units"
            total={units?.data?.length || 0}


            rate="0.43%"
            levelUp
          >
            <LuScale className='w-10 h-10' />
          </CardDataStats>
        </Link>

        <Link to={"/inventory/viewMaterialInventory"}>
          <CardDataStats
            title="Inventory"
            total={ 0}


            rate="0.43%"
            levelUp
          >
            <SiHomeassistantcommunitystore className='w-10 h-10' />

          </CardDataStats>
        </Link>

        <Link to={"/material/viewPurchase"}>
          <CardDataStats
            title="Purchase"
            total={ 0}


            rate="0.43%"
            levelUp
          >
            <BiPurchaseTagAlt className='w-10 h-10' />

          </CardDataStats>
        </Link>
        <Link to={"/material/addmaterial"}>
          <CardDataStats
            title="Material"
            total={ 0}


            rate="0.43%"
            levelUp
          >
            <GiMaterialsScience className='w-10 h-10' />

          </CardDataStats>

        </Link>





        <Link to={"/stockjournal/view"}>
          <CardDataStats title="Stock Journal"  total={ 0} rate="4.35%" levelUp>

            <IoJournalOutline className='w-10 h-10' />

          </CardDataStats>
        </Link>


        <Link to={"/configurator/location"}>
          <CardDataStats title="Locations"  total={ 0} rate="2.59%" levelUp>
            <IoLocationOutline className='w-10 h-10' />

          </CardDataStats>
        </Link>

        <Link to={"/auth/signup"}>
          <CardDataStats title="Total Users"  total={ 0} rate="0.95%" levelDown>
            <FaRegUserCircle className='w-10 h-10' />

          </CardDataStats>
        </Link>
      </div>
    </DefaultLayout>
  );
};

export default Chart;
