import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { format } from 'date-fns';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { BASE_URL } from '../../Constants/utils';
import { useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Custom component for rendering events in the month view
const CustomEvent = ({ event, onShowMore }) => {
    const [showMore, setShowMore] = useState(false);

    if (event.isShowMore) {
        return (
            <div
                style={{
                    backgroundColor: '#4A90D9',
                    color: 'white',
                    padding: '2px 5px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    textAlign: 'center',
                    marginTop: '2px'
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    onShowMore(event.date);
                }}
            >
                +{event.count} more
            </div>
        );
    }

    return (
        <div
            style={{
                backgroundColor: event.color || '#3174ad',
                color: 'white',
                padding: '2px 5px',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '12px',
                marginTop: '2px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }}
            onClick={() => window.location.href = event.url}
        >
            {event.title}
        </div>
    );
};

const MonthlyOrders = () => {
    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [modalEvents, setModalEvents] = useState([]);
    const [modalDate, setModalDate] = useState('');
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;

    const localizer = momentLocalizer(moment);

    // Map the status to colors using underscores
    const statusColorMapping = {
        Created: '#808080',
        accepted: '#1E90FF',
        Partially_Accepted: '#00BFFF',
        Approved: '#FF1493',
        Partially_Approved: '#FF69B4',
        Pending: '#8A2BE2',
        Partially_Pending: '#9370DB',
        Closed: '#228B22',
        Partially_Closed: '#006400',
        ForcedClosure: '#FFD700',
        Rejected: '#FF4500',
        NeedModification: '#000000',
        Cancelled: '#FF0000',
    };

    useEffect(() => {
        fetchEventsForMonth(currentDate);
    }, [currentDate]);

    const fetchEventsForMonth = (date) => {
        const monthStr = format(date, 'MMMMyyyy');
        const url = `${BASE_URL}/order/monthly/${monthStr}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                // Group orders by date
                const groupedOrders = {};
                data.forEach((order) => {
                    const dateKey = new Date(order.orderDate).toDateString();
                    if (!groupedOrders[dateKey]) {
                        groupedOrders[dateKey] = [];
                    }
                    groupedOrders[dateKey].push(order);
                });

                // Create events with show more functionality
                const fetchedEvents = [];
                const MAX_VISIBLE = 3; // Maximum visible events per day

                Object.keys(groupedOrders).forEach((dateKey) => {
                    const ordersForDate = groupedOrders[dateKey];
                    const dateObj = new Date(dateKey);

                    // Add first 3 orders
                    ordersForDate.slice(0, MAX_VISIBLE).forEach((order) => {
                        const normalizedStatus = order?.status;
                        const color = statusColorMapping[normalizedStatus] || '#B5651D';

                        fetchedEvents.push({
                            id: order.id,
                            title: order.customer ? `${order.orderNo}` : order.orderNo,
                            start: new Date(order.orderDate),
                            end: new Date(order.orderDate),
                            url: `/order/viewOrder/${order.id}`,
                            description: order.status,
                            color: color,
                            date: dateKey,
                            isShowMore: false
                        });
                    });

                    // Add "+N more" if there are more orders
                    if (ordersForDate.length > MAX_VISIBLE) {
                        fetchedEvents.push({
                            id: `showmore-${dateKey}`,
                            title: `+${ordersForDate.length - MAX_VISIBLE} more`,
                            start: new Date(dateKey),
                            end: new Date(dateKey),
                            url: '#',
                            description: 'Show more orders',
                            color: '#4A90D9',
                            date: dateKey,
                            isShowMore: true,
                            count: ordersForDate.length - MAX_VISIBLE,
                            allOrders: ordersForDate // Store all orders for this date
                        });
                    }
                });

                setEvents(fetchedEvents);
            })
            .catch((error) => {
                console.error('Error fetching events:', error);
            });
    };

    const handleDateChange = (date) => {
        setCurrentDate(date);
        fetchEventsForMonth(date);
    };

    const handleShowMore = (dateKey) => {
        // Find all orders for this date
        const allOrdersForDate = events
            .filter(event => event.date === dateKey && !event.isShowMore)
            .map(event => ({
                ...event,
                customerName: event.title.split(' ')[0] // Extract customer name if needed
            }));

        // Also get the show more event to get all orders
        const showMoreEvent = events.find(event => 
            event.isShowMore && event.date === dateKey
        );

        if (showMoreEvent && showMoreEvent.allOrders) {
            // Use the stored allOrders from the showMore event
            const allOrderDetails = showMoreEvent.allOrders.map(order => ({
                id: order.id,
                orderNo: order.orderNo,
                customerName: order.customer?.name || 'N/A',
                status: order.status,
                orderDate: order.orderDate,
                url: `/order/viewOrder/${order.id}`,
                color: statusColorMapping[order.status] || '#B5651D'
            }));

            setModalEvents(allOrderDetails);
        } else {
            // Fallback: use filtered events
            setModalEvents(allOrdersForDate);
        }

        setModalDate(dateKey);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalEvents([]);
    };

    // Prepare data for the Line Chart
    const prepareChartData = () => {
        const dailyCounts = {};
        events.forEach((event) => {
            if (!event.isShowMore) {
                const dateKey = format(event.start, 'MM/dd/yyyy');
                if (dailyCounts[dateKey]) {
                    dailyCounts[dateKey]++;
                } else {
                    dailyCounts[dateKey] = 1;
                }
            }
        });

        const labels = Object.keys(dailyCounts);
        const data = Object.values(dailyCounts);

        return {
            labels,
            datasets: [
                {
                    label: 'Orders per Day',
                    data,
                    fill: false,
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    tension: 0.1,
                },
            ],
        };
    };

    // Custom day wrapper component
    const DayWrapper = ({ children, date }) => {
        return (
            <div className="rbc-day-bg" style={{ position: 'relative' }}>
                {children}
            </div>
        );
    };

    // Custom event wrapper
    const EventWrapper = ({ event, children }) => {
        if (event.isShowMore) {
            return (
                <div onClick={() => handleShowMore(event.date)}>
                    {children}
                </div>
            );
        }
        return children;
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Order/Create Order" />
            <div className="container">
                <div className="row">
                    <div className="col-md-9">
                        <div className="float-right">
                            Created: <span className="dot" style={{ backgroundColor: '#808080' }}></span> |
                            Accepted: <span className="dot" style={{ backgroundColor: '#1E90FF' }}></span> |
                            Partially_Accepted: <span className="dot" style={{ backgroundColor: '#00BFFF' }}></span> |
                            Approved: <span className="dot" style={{ backgroundColor: '#FF1493' }}></span> |
                            Partially_Approved: <span className="dot" style={{ backgroundColor: '#FF69B4' }}></span> |
                            Pending: <span className="dot" style={{ backgroundColor: '#8A2BE2' }}></span> |
                            Partially_Pending: <span className="dot" style={{ backgroundColor: '#9370DB' }}></span> |
                            Closed: <span className="dot" style={{ backgroundColor: '#228B22' }}></span> |
                            Partially_Closed: <span className="dot" style={{ backgroundColor: '#006400' }}></span> |
                            ForcedClosure: <span className="dot" style={{ backgroundColor: '#FFD700' }}></span> |
                            Rejected: <span className="dot" style={{ backgroundColor: '#FF4500' }}></span> |
                            NeedModification: <span className="dot" style={{ backgroundColor: '#000000' }}></span> |
                            Cancelled: <span className="dot" style={{ backgroundColor: '#FF0000' }}></span>
                        </div>
                        <h3>Monthly Orders</h3>
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 1000 }}
                            views={['month', 'agenda']}
                            onNavigate={handleDateChange}
                            onSelectEvent={(event) => {
                                if (!event.isShowMore) {
                                    window.location.href = event.url;
                                }
                            }}
                            eventPropGetter={(event) => ({
                                style: {
                                    backgroundColor: event.color || '#3174ad',
                                    borderRadius: '0px',
                                    opacity: 0.8,
                                    color: 'white',
                                    border: 'none',
                                    cursor: event.isShowMore ? 'pointer' : 'pointer',
                                }
                            })}
                            components={{
                                event: (props) => (
                                    <CustomEvent 
                                        {...props} 
                                        onShowMore={handleShowMore}
                                    />
                                ),
                            }}
                        />
                    </div>

                    {/* Right side - List View */}
                    <div className="col-md-3">
                        <h4 className='font-semibold text-center mt-4'>List Of Monthly Orders</h4>
                        <div className="mt-5" style={{ maxHeight: '800px', overflowY: 'auto' }}>
                            <ul className="list-group">
                                {events
                                    .filter(event => !event.isShowMore)
                                    .map((event) => (
                                        <li key={event.id} className="list-group-item">
                                            <strong>{event.title}</strong><br />
                                            <small>{format(event.start, 'MM/dd/yyyy')}</small><br />
                                            <p>{event.description}</p>
                                            <div
                                                className="dot"
                                                style={{
                                                    backgroundColor: event.color,
                                                    display: 'inline-block',
                                                    width: '10px',
                                                    height: '10px',
                                                    borderRadius: '50%',
                                                    marginRight: '10px',
                                                }}
                                            ></div>
                                            <a href={event.url} className="btn btn-primary btn-sm">View Details</a>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Line Chart */}
                <div className="row mt-5">
                    <div className="col-md-12">
                        <h4 className="text-center text-2xl font-semibold">Orders per Day (Line Graph)</h4>
                        <Line data={prepareChartData()} options={{
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Orders per Day',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: (tooltipItem) => `Orders: ${tooltipItem.raw}`,
                                    },
                                },
                            },
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Date',
                                    },
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Cumulative Orders Count',
                                    },
                                    ticks: {
                                        stepSize: 1,
                                        beginAtZero: true,
                                        callback: function (value) {
                                            return Number.isInteger(value) ? value : null;
                                        },
                                    },
                                },
                            },
                        }} />
                    </div>
                </div>
            </div>

            {/* Modal for showing all orders on a specific date */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999
                }} onClick={closeModal}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        padding: '30px',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '80%',
                        overflowY: 'auto',
                        position: 'relative'
                    }} onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={closeModal}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: '#333'
                            }}
                        >
                            ✕
                        </button>
                        <h3 style={{ marginBottom: '20px' }}>
                            Orders for {format(new Date(modalDate), 'MMMM dd, yyyy')}
                        </h3>
                        <div>
                            {modalEvents.map((event, index) => (
                                <div
                                    key={event.id || index}
                                    style={{
                                        padding: '10px',
                                        marginBottom: '8px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '5px',
                                        borderLeft: `4px solid ${event.color || '#3174ad'}`
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong>{event.orderNo || event.title}</strong>
                                            <div style={{ fontSize: '12px', color: '#666' }}>
                                                Customer: {event.customerName || 'N/A'}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>
                                                Status: {event.status || event.description}
                                            </div>
                                        </div>
                                        <a
                                            href={event.url || `/order/viewOrder/${event.id}`}
                                            style={{
                                                backgroundColor: '#4A90D9',
                                                color: 'white',
                                                padding: '5px 10px',
                                                borderRadius: '3px',
                                                textDecoration: 'none',
                                                fontSize: '12px'
                                            }}
                                        >
                                            View
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <button
                                onClick={closeModal}
                                style={{
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 20px',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DefaultLayout>
    );
};

export default MonthlyOrders;