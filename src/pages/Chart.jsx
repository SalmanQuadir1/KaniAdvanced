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
const Chart = () => {

  const [unitCount, setunitCount] = useState(0)
  // const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state?.persisted?.user);

  const { user } = currentUser;

  const { token } = currentUser;
  const role = user?.authorities[0].authority







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

        {(role === "ROLE_ADMIN") && (
          <>
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
            <Link to={"/order/created"}>
              <CardDataStats
                title="Orders Pending For Production Approval"
                total={countMapping['ordersWithCreated'] || 0}


                // rate="0.43%"
                levelUp
              >
                <RiAlignItemBottomFill className='w-10 h-10' />
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

            <Link to={"/order/partiallyexecuted"}>
              <CardDataStats
                title="Partially Approved By Production Orders"
                total={countMapping['ordersWithCreatedAccepted'] || 0}


                // rate="0.43%"
                levelUp
              >
                <RiAlignItemBottomFill className='w-10 h-10' />
              </CardDataStats>
            </Link>
            <Link to={"/order/partiallyApproved"}>
              <CardDataStats
                title="Partially In Progress Orders"
                total={countMapping['ordersWithApprovedOrForcedClosure'] || 0}


                // rate="0.43%"
                levelUp
              >
                <RiAlignItemBottomFill className='w-10 h-10' />
              </CardDataStats>
            </Link>


            <Link to={"/order/Approved"}>
              <CardDataStats
                title="In Progress Orders"
                total={countMapping['ordersWithApprovedOrForcedClosure'] || 0}


                // rate="0.43%"
                levelUp
              >
                <RiAlignItemBottomFill className='w-10 h-10' />
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

            <Link to={"/orderlist/Executed"}>
              <CardDataStats
                title="Approved By Production Orders"
                total={countMapping['ordersWithOnlyAccepted'] || 0}


                // rate="0.43%"
                levelUp
              >
                <LuScale className='w-10 h-10' />
              </CardDataStats>
            </Link>

            <Link to={"/orderlist/Closed"}>
              <CardDataStats
                title="Completed Orders"
                total={countMapping['ordersWithOnlyClosed'] || 0}


                // rate="0.43%"
                levelUp
              >
                <LuScale className='w-10 h-10' />
              </CardDataStats>
            </Link>

            <Link to={"/orderlist/PartiallyClosed"}>
              <CardDataStats
                title="Partially Completed Orders"
                total={countMapping['ordersWithOnlyPartiallyClosed'] || 0}


                // rate="0.43%"
                levelUp
              >
                <LuScale className='w-10 h-10' />
              </CardDataStats>
            </Link>




            <Link to={"/orderlist/UpdateChallan"}>
              <CardDataStats
                title="Update Challan No And Date"
                total={countMapping['ordersWithOnlyPartiallyClosed'] || 0}


                // rate="0.43%"
                levelUp
              >
                <LuScale className='w-10 h-10' />
              </CardDataStats>
            </Link>

            <Link to={"/orderlist/Pending"}>
              <CardDataStats
                title="Pending Orders"
                total={countMapping['ordersWithOnlyPending'] || 0}


                // rate="0.43%"
                levelUp
              >
                <LuScale className='w-10 h-10' />
              </CardDataStats>
            </Link>

            <Link to={"/orderlist/PartiallyPending"}>
              <CardDataStats
                title="Partially Pending Orders"
                total={countMapping['ordersWithAtLeastOnePending'] || 0}


                // rate="0.43%"
                levelUp
              >
                <LuScale className='w-10 h-10' />
              </CardDataStats>
            </Link>



            <Link to={"/orderlist/ForcedClosure"}>
              <CardDataStats
                title="Forced Closed Orders"
                total={countMapping['ordersWithForcedClosure'] || 0}


                // rate="0.43%"
                levelUp
              >
                <LuScale className='w-10 h-10' />
              </CardDataStats>
            </Link>


            <Link to={"/orderlist/RejectedOrders"}>
              <CardDataStats
                title="Rejected By Production Orders"
                total={countMapping['ordersWithForcedClosure'] || 0}


                // rate="0.43%"
                levelUp
              >
                <LuScale className='w-10 h-10' />
              </CardDataStats>
            </Link>

            
            <Link to={"/order/supplierExpectdateUpdate"}>
              <CardDataStats
                title="Supplier Date Updation Orders"
                total={countMapping['ordersWithForcedClosure'] || 0}


                // rate="0.43%"
                levelUp
              >
                <LuScale className='w-10 h-10' />
              </CardDataStats>
            </Link>



            <Link to={"/order/supplierRecievingOrders"}>
              <CardDataStats
                title="Supplier Recieving Orders"
                total={countMapping['ordersWithForcedClosure'] || 0}


                // rate="0.43%"
                levelUp
              >
                <LuScale className='w-10 h-10' />
              </CardDataStats>
            </Link>




            <Link to={"/order/needModification"}>
              <CardDataStats
                title="Production Modification Orders"
                total={countMapping['ordersWithForcedClosure'] || 0}


                // rate="0.43%"
                levelUp
              >
                <LuScale className='w-10 h-10' />
              </CardDataStats>
            </Link>

            <Link to={"/order/Cancelled"}>
              <CardDataStats
                title="Cancelled Orders"
                total={countMapping['ordersWithForcedClosure'] || 0}


                // rate="0.43%"
                levelUp
              >
                <LuScale className='w-10 h-10' />
              </CardDataStats>
            </Link>


            
            <Link to={"/order/recievedQuantity"}>
              <CardDataStats
                title="Edit Recieved Quantity"
                total={countMapping['ordersWithForcedClosure'] || 0}


                // rate="0.43%"
                levelUp
              >
                <LuScale className='w-10 h-10' />
              </CardDataStats>
            </Link>


            <Link to={"/order/updateShippingDate"}>
              <CardDataStats
                title="Update Shipping Date"
                total={countMapping['ordersWithForcedClosure'] || 0}


                // rate="0.43%"
                levelUp
              >
                <LuScale className='w-10 h-10' />
              </CardDataStats>
            </Link>















            <Link to={"/configurator/location"}>
              <CardDataStats title="Locations" total={countMapping['location'] || 0} levelUp>
                <IoLocationOutline className='w-10 h-10' />

              </CardDataStats>
            </Link>

            <Link to={"/auth/signup"}>
              <CardDataStats title="Total Users" total={countMapping['user'] || 0} levelDown>
                <FaRegUserCircle className='w-10 h-10' />

              </CardDataStats>
            </Link>

            <Link to={"/Order/ViewOrder"}>
              <CardDataStats title="Total Orders" total={countMapping['orders'] || 0} levelDown>
                <SiHomeassistantcommunitystore className='w-10 h-10' />

              </CardDataStats>
            </Link>

          </>

        )}

        {/* {(role === "ROLE_APPROVER") && (
          <>
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
















          </>

        )} */}
      </div>
    </DefaultLayout>
  );
};

export default Chart;
