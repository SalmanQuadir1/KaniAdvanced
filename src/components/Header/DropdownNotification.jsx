


import { useState, useEffect, useRef } from 'react';
import {
  FaBell,
  FaClock,
  FaChevronRight,
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import {
  NOTIF,
  NOTIF_,
  NOTIF_COUNT,
} from '../../Constants/utils';

const DropdownNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [markingAsRead, setMarkingAsRead] = useState(null);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  const { currentUser } = useSelector(
    (state) => state?.persisted?.user
  );

  const { token } = currentUser;

  // =========================================================
  // FETCH WITH AUTH
  // =========================================================
  const fetchWithAuth = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',

      ...(token && {
        Authorization: `Bearer ${token}`,
      }),

      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  };

  // =========================================================
  // FORMAT NOTIFICATION
  // =========================================================
  const formatNotificationMessage = (message) => {
    if (!message) return null;

    const productMatch = message.match(/\(([^)]+)\)/);
    const productName = productMatch
      ? productMatch[1]
      : '';

   const supplierMatch = message.match(
  /Supplier:\s*(.*?)(?=\s*\(|$)/
);

const supplierName = supplierMatch
  ? supplierMatch[1].trim()
  : '';

    const daysMatch = message.match(
      /is\s+(\d+)\s+day\(s\)\s+late/
    );

    const lateDays = daysMatch
      ? daysMatch[1]
      : '';

    const expectedMatch = message.match(
      /Expected:\s+([^\s]+)/
    );

    const expectedDate = expectedMatch
      ? expectedMatch[1]
      : '';

    return (
      <div className="mt-1">

        {/* =================================================
            PRODUCT ROW
        ================================================= */}
        {productName && (
          <div className="flex items-center gap-1 min-w-0">

         

            <span
              className="
                text-[10px]
                font-semibold
                text-gray-700
                dark:text-gray-200
                truncate
              "
            >
              {productName}
            </span>

          </div>
        )}

        {/* =================================================
            SUPPLIER + STATUS + EXPECTED
            ONE ROW
        ================================================= */}
        <div
          className="
            flex
            items-center
            gap-x-3
          mt-[-8px]

            text-[9px]

            whitespace-nowrap
            overflow-hidden
          "
        >

          {/* Supplier */}
          {supplierName && (
             <div
    className="
    
      flex
      items-center
      gap-1
      min-w-0
       text-[10px]
       text-uppercase
                font-semibold
                text-gray-700
                dark:text-gray-200
               
    "
  >
    {/* <span
      className="
        text-[9px]
        text-gray-400
        dark:text-gray-500
        flex-shrink-0
          flex
      items-center
      gap-1
      min-w-0
       text-[10px]
       text-uppercase
                font-semibold
                text-gray-700
                dark:text-gray-200
                truncate
      "
    >
      Supplier:
    </span> */}

            <span
  className="
    text-[11px]
    font-bold
    text-blue-700
    dark:text-blue-300
    truncate
    max-w-[170px]
  "
  title={supplierName}
>
  {supplierName}
</span>
            </div>
          )}

          {/* Status */}
        

          {/* Expected */}
          {expectedDate && (
            <div
              className="
                flex
                items-center
                gap-1
                flex-shrink-0
                  flex
      items-center
      gap-1
      min-w-0
       text-[10px]
       text-uppercase
                font-semibold
                text-gray-700
                dark:text-gray-200
                truncate
              "
            >
              <span
                className="
                  text-gray-400
                  dark:text-gray-500
                "
              >
                Expected:
              </span>

              <span
                className="
                  flex
      items-center
      gap-1
      min-w-0
       text-[10px]
       text-uppercase
                font-semibold
                text-gray-700
                dark:text-gray-200
                truncate
                "
              >
                {expectedDate}
              </span>
            </div>
          )}
            {lateDays && (
            <div
              className="
            
                  flex
      items-center
      gap-1
      min-w-0
       text-[10px]
       text-uppercase
                font-semibold
                text-gray-700
                dark:text-gray-200
                truncate
              "
            >
              {/* <span
                className="
                  text-gray-400
                  dark:text-gray-500
                "
              >
                Status:
              </span> */}

              <span
                className="
                  font-bold
                  text-red-500
                  dark:text-red-400
                "
              >
                {lateDays}d late
              </span>
            </div>
          )}

        </div>
      </div>
    );
  };

  // =========================================================
  // CLOSE ON OUTSIDE CLICK
  // =========================================================
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;

      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      ) {
        return;
      }

      setDropdownOpen(false);
    };

    document.addEventListener(
      'click',
      clickHandler
    );

    return () => {
      document.removeEventListener(
        'click',
        clickHandler
      );
    };
  }, [dropdownOpen]);

  // =========================================================
  // CLOSE ON ESCAPE
  // =========================================================
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (
        !dropdownOpen ||
        keyCode !== 27
      ) {
        return;
      }

      setDropdownOpen(false);
    };

    document.addEventListener(
      'keydown',
      keyHandler
    );

    return () => {
      document.removeEventListener(
        'keydown',
        keyHandler
      );
    };
  }, [dropdownOpen]);

  // =========================================================
  // FETCH UNREAD COUNT
  // =========================================================
  const fetchUnreadCount = async () => {
    try {
      const data = await fetchWithAuth(
        `${NOTIF_COUNT}`
      );

      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error(
        'Error fetching unread count:',
        error
      );
    }
  };

  // =========================================================
  // FETCH NOTIFICATIONS
  // =========================================================
  const fetchNotifications = async () => {
    setLoading(true);

    try {
      const data = await fetchWithAuth(
        `${NOTIF_}`
      );

      const unreadNotifications =
        Array.isArray(data)
          ? data.filter(
              (notif) => !notif.read
            )
          : [];

      setNotifications(
        unreadNotifications
      );
    } catch (error) {
      console.error(
        'Error fetching notifications:',
        error
      );

      toast.error(
        'Failed to load notifications'
      );

      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // MARK AS READ
  // =========================================================
  const markAsRead = async (id) => {
    setMarkingAsRead(id);

    try {
      await fetchWithAuth(
        `${NOTIF}/${id}/read`,
        {
          method: 'PUT',
        }
      );

      setNotifications((prev) =>
        prev.filter(
          (notif) => notif.id !== id
        )
      );

      setUnreadCount((prev) =>
        Math.max(0, prev - 1)
      );

      // toast.success(
      //   'Notification marked as read'
      // );
    } catch (error) {
      console.error(
        'Error marking notification as read:',
        error
      );

      toast.error(
        'Failed to mark as read'
      );
    } finally {
      setMarkingAsRead(null);
    }
  };

  // =========================================================
  // INITIAL FETCH
  // =========================================================
  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(
      fetchUnreadCount,
      30000
    );

    return () =>
      clearInterval(interval);
  }, []);

  // =========================================================
  // FETCH WHEN OPEN
  // =========================================================
  useEffect(() => {
    if (dropdownOpen) {
      fetchNotifications();
    }
  }, [dropdownOpen]);

  return (
    <li className="relative">

      {/* =====================================================
          NOTIFICATION BELL
      ====================================================== */}
      <button
        ref={trigger}
        onClick={() =>
          setDropdownOpen(!dropdownOpen)
        }
        className="
          relative
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full

          bg-gradient-to-br
          from-gray-50
          to-gray-100

          dark:from-meta-4
          dark:to-meta-3

          border-2
          border-gray-200
          dark:border-gray-700

          hover:border-primary
          dark:hover:border-primary-light

          shadow-sm
          hover:shadow-md

          transition-all
          duration-300

          group
        "
      >
        <FaBell
          className="
            text-sm

            text-gray-600
            dark:text-gray-300

            group-hover:text-primary
            dark:group-hover:text-primary-light

            transition-colors
            duration-300
          "
        />

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -top-0.5
              -right-0.5

              flex
              h-5
              w-5
              items-center
              justify-center

              rounded-full

              bg-gradient-to-br
              from-red-500
              to-red-600

              text-[10px]
              font-bold
              text-white

              shadow-lg
              shadow-red-500/25

              animate-pulse

              ring-2
              ring-white
              dark:ring-gray-800
            "
          >
            {unreadCount > 99
              ? '99+'
              : unreadCount}
          </span>
        )}
      </button>

      {/* =====================================================
          DROPDOWN
      ====================================================== */}
      <div
        ref={dropdown}
        className={`
          absolute
          right-0
          mt-2.5

          w-[450px]

          rounded-2xl

          border
          border-blue-100/80
          dark:border-blue-900/50

          bg-white/95
          dark:bg-boxdark/95

          backdrop-blur-xl

          shadow-2xl
          shadow-blue-900/10
          dark:shadow-black/30

          overflow-hidden

          transition-all
          duration-300

          ${
            dropdownOpen
              ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }
        `}
        style={{
          maxHeight: '470px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >

     
        <div
          className="
            flex-shrink-0

            flex
            items-center
            justify-between

            px-4
            py-2.5

            border-b
            border-blue-100
            dark:border-blue-900/40

            bg-gradient-to-r
            from-blue-100/70
            via-white
            to-blue-50/60

            dark:from-blue-950/70
            dark:via-gray-800
            dark:to-blue-950/40
          "
        >

          <div className="flex items-center gap-2">

            <div
              className="
                h-2
                w-2
                rounded-full

                bg-blue-500

                shadow-sm
                shadow-blue-400

                animate-pulse
              "
            />

            <h4
              className="
                text-xs
                font-bold
                tracking-wider
                uppercase

                text-blue-800
                dark:text-blue-200
              "
            >
              Delayed Orders
            </h4>

          </div>

          {/* {unreadCount > 0 && (
            <span
              className="
                rounded-full

                px-2
                py-0.5

                text-[9px]
                font-bold

                bg-blue-600
                text-white

                shadow-sm
              "
            >
              {unreadCount} new
            </span>
          )} */}

        </div>

        {/* ===================================================
            NOTIFICATION LIST
        ==================================================== */}
        <div
          className="
            flex-1
            overflow-y-auto

            min-h-[60px]
            max-h-[215px]

            custom-scrollbar

            bg-gradient-to-b
            from-blue-50/30
            via-white
            to-blue-50/20

            dark:from-blue-950/20
            dark:via-gray-900
            dark:to-blue-950/10
          "
          style={{
            scrollBehavior: 'smooth',
            overscrollBehavior: 'contain',
          }}
        >

          {/* =================================================
              LOADING
          ================================================== */}
          {loading ? (
            <div
              className="
                flex
                h-32
                items-center
                justify-center
              "
            >
              <div className="relative">

                <div
                  className="
                    h-7
                    w-7
                    rounded-full

                    border-4
                    border-blue-100
                    dark:border-gray-700
                  "
                />

                <div
                  className="
                    absolute
                    top-0
                    left-0

                    h-7
                    w-7
                    rounded-full

                    border-4
                    border-transparent

                    border-t-blue-500

                    animate-spin
                  "
                />

              </div>
            </div>

          ) : notifications.length === 0 ? (

            /* ===============================================
               EMPTY
            ================================================ */
            <div
              className="
                flex
                flex-col
                items-center
                justify-center

                h-32

                text-center
                px-6
              "
            >
              <div className="relative mb-1">

                <div
                  className="
                    text-3xl
                    opacity-70
                  "
                >
                  🔔
                </div>

                <div
                  className="
                    absolute
                    -bottom-1
                    -right-1

                    h-2
                    w-2

                    rounded-full
                    bg-green-500

                    ring-2
                    ring-white
                  "
                />

              </div>

              <p
                className="
                  text-xs
                  font-semibold

                  text-gray-600
                  dark:text-gray-300
                "
              >
                All caught up!
              </p>

              <p
                className="
                  mt-0.5

                  text-[10px]

                  text-gray-400
                  dark:text-gray-500
                "
              >
                No pending delayed orders
              </p>

            </div>

          ) : (

            /* ===============================================
               CELLS
            ================================================ */
            <div className="py-1">

              {notifications.map(
                (notification, index) => (

                  <div
                    key={notification.id}
                    className={`
                      group

                      mx-2
                      my-1.5

                      flex
                      items-start
                      gap-2

                      rounded-lg

                      border

                      px-3
                      py-2

                      bg-gradient-to-r
                      from-blue-50
                      via-white
                      to-blue-50/40

                      border-blue-100

                      shadow-sm

                      hover:from-blue-100/70
                      hover:via-white
                      hover:to-blue-50

                      hover:border-blue-200
                      hover:shadow-md

                      transition-all
                      duration-200

                      dark:from-blue-950/40
                      dark:via-gray-800/80
                      dark:to-blue-900/20

                      dark:border-blue-900/50

                      dark:hover:from-blue-900/50
                      dark:hover:via-gray-800
                      dark:hover:to-blue-900/30

                      dark:hover:border-blue-800

                      ${
                        index === 0
                          ? `
                            ring-1
                            ring-blue-200/70
                            dark:ring-blue-800/50
                          `
                          : ''
                      }
                    `}
                  >

                    {/* =====================================
                        STATUS DOT
                    ====================================== */}
                    <div
                      className="
                        flex-shrink-0
                        pt-1.5
                      "
                    >
                      <span
                        className={`
                          block

                          h-2
                          w-2

                          rounded-full

                          ring-2
                          ring-white
                          dark:ring-gray-800

                          ${
                            index === 0
                              ? `
                                bg-red-500
                                animate-pulse
                              `
                              : `
                                bg-blue-500
                              `
                          }
                        `}
                      />
                    </div>

                    {/* =====================================
                        MAIN CONTENT
                    ====================================== */}
                    <div
                      className="
                        flex-1
                        min-w-0
                      "
                    >

                      {/* ===================================
                          TOP ROW
                      ==================================== */}
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-2
                        "
                      >

                        {/* ORDER + NEW */}
                        <div
                          className="
                            flex
                            items-center
                            gap-1.5

                            min-w-0
                          "
                        >

                          <h5
                            className="
                              text-[11px]
                              font-bold

                              text-gray-800
                              dark:text-white

                              truncate
                            "
                          >
                            Order #{notification.orderNo}
                          </h5>

                          {index === 0 && (
                            <span
                              className="
                                flex-shrink-0

                                rounded-full

                                bg-red-100
                                dark:bg-red-900/30

                                px-1.5
                                py-0.5

                                text-[8px]
                                font-bold

                                text-red-600
                                dark:text-red-400
                              "
                            >
                              NEW
                            </span>
                          )}

                        </div>

                        {/* TIME */}
                        <div
                          className="
                            flex-shrink-0

                            flex
                            items-center
                            gap-1

                            text-[10px]

                            text-blue-400
                            dark:text-blue-300
                            font-semibold
                          "
                        >
                          <FaClock
                            className="text-[8px]"
                          />

                          <span>
                            {formatDistanceToNow(
                              new Date(
                                notification.createdAt
                              ),
                              {
                                addSuffix: true,
                              }
                            )}
                          </span>

                        </div>

                      </div>

                      {/* ===================================
                          PRODUCT + DETAILS
                      ==================================== */}
                      {formatNotificationMessage(
                        notification.message
                      )}

                    </div>

                    {/* =====================================
                        MARK AS READ
                    ====================================== */}
                    {!notification.read && (
                      <button
                        onClick={() =>
                          markAsRead(
                            notification.id
                          )
                        }
                        disabled={
                          markingAsRead ===
                          notification.id
                        }
                        className="
                          flex-shrink-0

                          h-6
                          px-2

                          flex
                          items-center
                          justify-center

                          rounded-md

                          text-[9px]
                          font-semibold

                          whitespace-nowrap

                          text-blue-600

                          bg-blue-50

                          border
                          border-blue-200

                          hover:bg-blue-600
                          hover:text-white
                          hover:border-blue-600

                          dark:text-blue-300
                          dark:bg-blue-950/40
                          dark:border-blue-800

                          dark:hover:bg-blue-500
                          dark:hover:text-white

                          transition-all
                          duration-200

                          disabled:opacity-50
                          disabled:cursor-not-allowed
                        "
                        title="Mark as read"
                      >

                        {markingAsRead ===
                        notification.id ? (
                          <span
                            className="
                              flex
                              items-center
                              gap-1
                            "
                          >

                            <span
                              className="
                                h-2.5
                                w-2.5

                                animate-spin

                                rounded-full

                                border-2
                                border-blue-500
                                border-t-transparent
                              "
                            />

                            Marking...
                          </span>
                        ) : (
                          'Mark as Read'
                        )}

                      </button>
                    )}

                  </div>
                )
              )}

            </div>
          )}

        </div>

        {/* ===================================================
            FOOTER
        ==================================================== */}
        {notifications.length > 0 && (
          <div
            className="
              flex-shrink-0

              border-t
              border-blue-100
              dark:border-blue-900/40

              bg-gradient-to-r
              from-blue-50
              via-white
              to-blue-50

              dark:from-blue-950/40
              dark:via-gray-800
              dark:to-blue-950/30

              px-4
              py-1.5
            "
          >

            <button
              onClick={() =>
                setDropdownOpen(false)
              }
              className="
                w-full

                flex
                items-center
                justify-center

                gap-1.5

                text-center

                text-[10px]
                font-semibold

                text-blue-500
                hover:text-blue-700

                dark:text-blue-300
                dark:hover:text-blue-200

                transition-colors
                duration-200

                group
              "
            >

              <span>
                View all notifications
              </span>

              <FaChevronRight
                className="
                  text-[8px]

                  group-hover:translate-x-0.5

                  transition-transform
                  duration-200
                "
              />

            </button>

          </div>
        )}

      </div>

      {/* =====================================================
          SCROLLBAR
      ====================================================== */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #93c5fd;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3b82f6;
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #93c5fd transparent;
        }
      `}</style>

    </li>
  );
};

export default DropdownNotification;

