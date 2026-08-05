import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import CardDataStats from '../components/CardDataStats';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Count,
  DOWNLOADCUSTOMER_REPORT,
  DOWNLOADPRODUCTRE_REPORT,
} from '../Constants/utils';

// Import Icons
import { LuScale, LuPanelLeftClose } from 'react-icons/lu';
import { SiHomeassistantcommunitystore } from 'react-icons/si';
import { AiOutlinePartition, AiOutlineClose } from 'react-icons/ai';
import {
  RiProgress1Line,
  RiProgress8Fill,
  RiUserReceived2Fill,
  RiAlignItemBottomFill,
} from 'react-icons/ri';
import { FcApproval, FcCancel } from 'react-icons/fc';
import { GrCompliance, GrUpdate } from 'react-icons/gr';
import {
  MdRepartition,
  MdOutlinePendingActions,
  MdOutlinePending,
  MdRecommend,
  MdEditSquare,
} from 'react-icons/md';
import { PiGearFineFill } from 'react-icons/pi';
import { CiCalendarDate } from 'react-icons/ci';
import { VscDiffModified } from 'react-icons/vsc';
import { toast } from 'react-toastify';
import { TbReorder } from 'react-icons/tb';
import { GiWool } from 'react-icons/gi';
import { GiRolledCloth } from 'react-icons/gi';
import { GiCottonFlower } from 'react-icons/gi';
import { GiBandageRoll } from 'react-icons/gi';
import { GiScrollUnfurled } from 'react-icons/gi';
import { FaDropbox } from 'react-icons/fa';
import { FaBook } from 'react-icons/fa6';

const Home = () => {
  const [unitCount, setUnitCount] = useState([]);
  const [isDownloadingAllGroups, setIsDownloadingAllGroups] = useState(false);
  const [isDownloadingCustomer, setIsDownloadingCustomer] = useState(false); // 🔹 ADD THIS

  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { user, token } = currentUser;
  const role = user?.authorities?.map((auth) => auth.authority) || [];
  const appMode = useSelector((state) => state?.persisted?.appMode);

  const { mode } = appMode;
  console.log(mode, 'kk');

  // 🔹 Spinner Overlay Component
  const SpinnerOverlay = () => (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
      <div className="bg-white/90 p-4 rounded-lg shadow-lg flex flex-col items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="text-sm font-medium text-gray-700 mt-2">Downloading...</p>
      </div>
    </div>
  );

  const handleDownloadAllGroupsProductReport = async () => {
    setIsDownloadingAllGroups(true);
    try {
      const response = await fetch(`${DOWNLOADPRODUCTRE_REPORT}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download report');
      }

      const blob = await response.blob();

      const disposition = response.headers.get('Content-Disposition');

      let filename = 'AllGroupsProductReport.xlsx';

      if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(/filename="?(.+?)"?$/);
        if (match) {
          filename = match[1];
        }
      }

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to download report');
    } finally {
      setIsDownloadingAllGroups(false);
    }
  };

  const handleDownloadReport = async () => {
    setIsDownloadingCustomer(true); // 🔹 ADD THIS
    try {
      const response = await fetch(`${DOWNLOADCUSTOMER_REPORT}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to download report');
      }

      const blob = await response.blob();

      const disposition = response.headers.get('Content-Disposition');
      let filename = 'Customer.csv';
      if (disposition && disposition.includes('attachment')) {
        const match = disposition.match(/filename="(.+)"/);
        if (match && match[1]) {
          filename = match[1];
        }
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while downloading the report');
    } finally {
      setIsDownloadingCustomer(false); // 🔹 ADD THIS
    }
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(Count, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUnitCount(data || []);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, [token]);

  // Convert unitCount array to an object for quick lookup
  const countMapping = unitCount.reduce((acc, item) => {
    acc[item.tableName] = item.count;
    return acc;
  }, {});

  // Role-based card mapping
  const roleBasedCards = {
    ROLE_ADMIN: [
      {
        title: 'Production Dashboard',
        link: '/kaniProducts',
        icon: <SiHomeassistantcommunitystore className="w-10 h-10" />,
        levelUp: true,
      },
      {
        title: 'Reports',
        link: '/Reports',
        icon: <RiAlignItemBottomFill className="w-10 h-10" />,
        levelUp: true,
      },
      {
        title: 'Retail/WholeSale Reports',
        link: '/report/wsRetailReport',
        countKey: 'proforma',
        icon: <RiAlignItemBottomFill className="w-10 h-10" />,
        levelUp: true,
      },
      {
        title: 'Orders',
        link: '/chart',
        countKey: 'orders',
        icon: <SiHomeassistantcommunitystore className="w-10 h-10" />,
        levelDown: true,
      },
      {
        title: 'Upload Excel',
        link: '/product/addExcelProduct',
        countKey: '',
        icon: <AiOutlinePartition className="w-10 h-10" />,
        levelUp: true,
      },
      {
        title: 'Financial Reports',
        link: '/report/freports',
        countKey: '',
        icon: <SiHomeassistantcommunitystore className="w-10 h-10" />,
        levelDown: true,
      },
      {
        title: 'Customer Report',
        countKey: '',
        icon: <RiProgress1Line className="w-10 h-10" />,
        levelUp: true,
        isDownload: true,
      },
      {
        title: 'Monthly Order Calender',
        link: '/Order/monthlyorders',
        countKey: '',
        icon: <RiProgress8Fill className="w-10 h-10" />,
        levelUp: true,
      },
      {
        title: 'Product Report',
        link: '/report/product',
        countKey: '',
        icon: <GrCompliance className="w-10 h-10" />,
        levelUp: true,
      },
      {
        title: "All Groups Product Report",
        countKey: "",
        icon: <GrCompliance className="w-10 h-10" />,
        levelUp: true,
        isDownload: true,
        isAllGroupsDownload: true,
      },
      {
        title: 'Verify Product Transfer',
        link: '/stockJournal/verify',
        countKey: 'verifyStockJournals',
        icon: <RiProgress8Fill className="w-10 h-10" />,
        levelUp: true,
      },
      // {
      //   title: 'Pending for Bill',
      //   link: '/Recieved/pendingForBill',
      //   countKey: 'orderBillStatusAllowed',
      //   icon: <RiProgress8Fill className="w-10 h-10" />,
      //   levelUp: true,
      // },
    ],
    ROLE_EXECUTOR: [
      {
        title: 'Reports',
        link: '/Reports',
        icon: <RiAlignItemBottomFill className="w-10 h-10" />,
        levelUp: true,
      },
      {
        title: 'Retail/WholeSale Reports',
        link: '/report/wsRetailReport',
        countKey: 'proforma',
        icon: <RiAlignItemBottomFill className="w-10 h-10" />,
        levelUp: true,
      },
      {
        title: 'Orders',
        link: '/chart',
        countKey: 'orders',
        icon: <SiHomeassistantcommunitystore className="w-10 h-10" />,
        levelDown: true,
      },
      {
        title: 'Monthly Order Calender',
        link: '/Order/monthlyorders',
        countKey: 'ordersWithApprovedOrForcedClosure',
        icon: <RiProgress8Fill className="w-10 h-10" />,
        levelUp: true,
      },
    ],
    ROLE_ADMIN_DLI: [
      {
        title: 'Reports',
        link: '/Reports',
        icon: <RiAlignItemBottomFill className="w-10 h-10" />,
        levelUp: true,
      },
      {
        title: 'Retail/WholeSale Reports',
        link: '/report/wsRetailReport',
        countKey: 'proforma',
        icon: <RiAlignItemBottomFill className="w-10 h-10" />,
        levelUp: true,
      },
      {
        title: 'Orders',
        link: '/chart',
        countKey: 'orders',
        icon: <SiHomeassistantcommunitystore className="w-10 h-10" />,
        levelDown: true,
      },
      {
        title: 'Upload Excel',
        link: '/product/addExcelProduct',
        countKey: 'ordersWithCreated',
        icon: <AiOutlinePartition className="w-10 h-10" />,
        levelUp: true,
      },
      {
        title: 'Monthly Order Calender',
        link: '/Order/monthlyorders',
        countKey: 'ordersWithApprovedOrForcedClosure',
        icon: <RiProgress8Fill className="w-10 h-10" />,
        levelUp: true,
      },
    ],
    ROLE_QUALITYCONTROL: [
      {
        title: 'Monthly Order Calender',
        link: '/Order/monthlyorders',
        countKey: 'ordersWithApprovedOrForcedClosure',
        icon: <RiProgress8Fill className="w-10 h-10" />,
        levelUp: true,
      },
    ],
    ROLE_VERIFIER: [
      {
        title: 'Verify Product Transfer',
        link: '/stockJournal/verify',
        countKey: 'verifyStockJournals',
        icon: <RiProgress8Fill className="w-10 h-10" />,
        levelUp: true,
      },
    ],
    ROLE_FINANCE: [
      // {
      //   title: 'Pending for Bill',
      //   link: '/Recieved/pendingForBill',
      //   countKey: 'orderBillStatusAllowed',
      //   icon: <RiProgress8Fill className="w-10 h-10" />,
      //   levelUp: true,
      // },
    ],
    ROLE_ADMIN_SXR: [
      {
        title: 'Reports',
        link: '/Reports',
        icon: <RiAlignItemBottomFill className="w-10 h-10" />,
        levelUp: true,
      },
      {
        title: 'Retail/WholeSale Reports',
        link: '/report/wsRetailReport',
        countKey: 'proforma',
        icon: <RiAlignItemBottomFill className="w-10 h-10" />,
        levelUp: true,
      },
      {
        title: 'Orders',
        link: '/chart',
        countKey: 'orders',
        icon: <SiHomeassistantcommunitystore className="w-10 h-10" />,
        levelDown: true,
      },
      {
        title: 'Monthly Order Calender',
        link: '/Order/monthlyorders',
        countKey: 'ordersWithApprovedOrForcedClosure',
        icon: <RiProgress8Fill className="w-10 h-10" />,
        levelUp: true,
      },
    ],
    ROLE_USER: [
      {
        title: 'Reports',
        link: '/Reports',
        icon: <RiAlignItemBottomFill className="w-10 h-10" />,
        levelUp: true,
      },
      {
        title: 'Retail/WholeSale Reports',
        link: '/report/wsRetailReport',
        countKey: 'proforma',
        icon: <RiAlignItemBottomFill className="w-10 h-10" />,
        levelUp: true,
      },
    ],
  };

  // Kani-based card mapping
  const kaniModeCards = [
    {
      title: 'Kani Section',
      link: '/kaniSection',
      countKey: 'kaniOrders',
      icon: <SiHomeassistantcommunitystore className="w-10 h-10" />,
      levelUp: true,
      isGradient: true,
    },
    {
      title: 'Pashmina Embroidery',
      link: '/pashminaEmbroidery',
      countKey: 'pashminaEmbroidery',
      icon: <GiScrollUnfurled className="w-10 h-10" />,
      levelUp: true,
      isGradient: true,
      gradientColor: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Contemporary Pashmina',
      link: '/contemporaryPashmina',
      countKey: 'contemporaryPashmina',
      icon: <GiBandageRoll className="w-10 h-11" />,
      levelUp: true,
      isGradient: true,
      gradientColor: 'from-green-500 to-green-600',
    },
    {
      title: 'Papier Mache',
      link: '/papierMache',
      countKey: 'papierMache',
      icon: <TbReorder className="w-10 h-10" />,
      levelUp: true,
      isGradient: true,
      gradientColor: 'from-red-500 to-red-600',
    },
    {
      title: 'Wool Embroidery',
      link: '/woolEmbroidery',
      countKey: 'woolEmbroidery',
      icon: <GiWool className="w-10 h-10" />,
      levelUp: true,
      isGradient: true,
      gradientColor: 'from-amber-700 to-amber-800',
    },
    {
      title: 'Contemporary Wool',
      link: '/contemporaryWool',
      countKey: 'contemporaryWool',
      icon: <GiRolledCloth className="w-10 h-10" />,
      levelUp: true,
      isGradient: true,
      gradientColor: 'from-orange-600 to-orange-700',
    },
    {
      title: 'Cotton',
      link: '/cotton',
      countKey: 'cotton',
      icon: <GiCottonFlower className="w-10 h-10" />,
      levelUp: true,
      isGradient: true,
      gradientColor: 'from-yellow-600 to-yellow-700',
    },
    {
      title: 'Contemporary Saree',
      link: '/contemporarySaree',
      countKey: 'contemporarySaree',
      icon: <FaDropbox className="w-10 h-10" />,
      levelUp: true,
      isGradient: true,
      gradientColor: 'from-teal-500 to-teal-600',
    },
  ];

  // Accounts mode cards
  // const accountsModeCards = [
  //   {
  //     title: 'Pending for Bill',
  //     link: '/Recieved/pendingForBill',
  //     countKey: 'orderBillStatusAllowed',
  //     icon: <RiProgress8Fill className="w-10 h-10" />,
  //     levelUp: true,
  //   },
  // ];

  
  const accountsModeCards = [
    {
      title: 'Day Book',
      link: '/configurator/dayBook',
      countKey: '',
      icon: <FaBook className="w-10 h-10" />,
      levelUp: true,
    },
  ];

  // Get all cards user should see based on roles
  const cardsToShow = (() => {
    if (mode === 'production') {
      return role.flatMap((roleName) => roleBasedCards[roleName] || []);
    }
    if (mode === 'accounts' && role.includes('ROLE_ADMIN')) {
      return accountsModeCards;
    }
    if (mode === 'kani') {
      return kaniModeCards;
    }
    return [];
  })();

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Home" />
      <div className="grid grid-cols-1 gap-3 my-1 md:grid-cols-4 md:gap-3 xl:grid-cols-5 2xl:gap-4 rounded-lg">
        {cardsToShow.map((card, index) => {
          // ✅ MOVE THESE INSIDE THE MAP - card is available here!
          const isAllGroupsDownloading = card.isAllGroupsDownload && isDownloadingAllGroups;
          const isCustomerDownloading = card.isDownload && !card.isAllGroupsDownload && isDownloadingCustomer;
          const isDownloading = isAllGroupsDownloading || isCustomerDownloading;

          return card.isDownload ? (
            <div
              key={index}
              onClick={
                isDownloading
                  ? undefined
                  : card.isAllGroupsDownload
                  ? handleDownloadAllGroupsProductReport
                  : handleDownloadReport
              }
              className={`cursor-pointer flex-col mt-4 rounded-lg relative ${
                isDownloading ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
              }`}
            >
              {isDownloading && <SpinnerOverlay />}
              {card.isGradient ? (
                <div
                  className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${
                    card.gradientColor || 'from-blue-500 to-blue-600'
                  } p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-48 flex flex-col rounded-lg ${
                    isDownloading ? 'hover:transform-none' : ''
                  }`}
                >
                  <div className="absolute right-0 top-0 -mt-4 -mr-4 h-20 w-20 rounded-full bg-white/10 blur-2xl"></div>
                  {card.levelUp && (
                    <span className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      Level Up
                    </span>
                  )}
                  <div className="mb-4 text-white/90">{card.icon}</div>
                  <h3 className="text-xl font-bold text-white min-h-[56px] leading-tight">
                    {card.title}
                  </h3>
                  {card.countKey && countMapping[card.countKey] !== undefined && (
                    <p className="text-sm text-white/80 mt-2">
                      {countMapping[card.countKey]} items
                    </p>
                  )}
                  <div className="mt-auto flex items-center text-sm font-medium text-white/90 pt-4">
                    {isDownloading ? 'Downloading...' : 'Download'}
                    {!isDownloading && (
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
                    )}
                  </div>
                </div>
              ) : (
                <CardDataStats
                  title={card.title}
                  total={card.countKey ? countMapping[card.countKey] : undefined}
                  levelUp={card.levelUp}
                  levelDown={card.levelDown}
                >
                  {card.icon}
                </CardDataStats>
              )}
            </div>
          ) : (
            <Link to={card.link} key={index}>
              <div className="cursor-pointer flex-col mt-4">
                {card.isGradient ? (
                  <div
                    className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${
                      card.gradientColor || 'from-blue-500 to-blue-600'
                    } p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
                  >
                    <div className="absolute right-0 top-0 -mt-4 -mr-4 h-20 w-20 rounded-full bg-white/10 blur-2xl"></div>
                    {card.levelUp && (
                      <span className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                        Level Up
                      </span>
                    )}
                    <div className="mb-4 text-white/90">{card.icon}</div>
                    <h3 className="mb-2 text-xl font-bold text-white">
                      {card.title}
                    </h3>
                    {card.countKey && countMapping[card.countKey] !== undefined && (
                      <p className="text-sm text-white/80">
                        {countMapping[card.countKey]} items
                      </p>
                    )}
                    <div className="mt-6 flex items-center text-sm font-medium text-white/90">
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
                  </div>
                ) : (
                  <CardDataStats
                    title={card.title}
                    total={card.countKey ? countMapping[card.countKey] : undefined}
                    levelUp={card.levelUp}
                    levelDown={card.levelDown}
                  >
                    {card.icon}
                  </CardDataStats>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </DefaultLayout>
  );
};

export default Home;