import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { format } from 'date-fns';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { BASE_URL } from '../../Constants/utils';
import { useSelector } from 'react-redux';

const MonthlyOrders = () => {
    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;

    const localizer = momentLocalizer(moment);

    // Map the status to colors using underscores
    const statusColorMapping = {
        Created: '#808080', // grey
        accepted: '#1E90FF', // dark blue
        Partially_Accepted:'#00BFFF', // blue
        Approved: '#FF1493', // dark pink
        Partially_Approved: '#FF69B4', // pink
        Pending: '#8A2BE2', // dark purple
        Partially_Pending: '#9370DB', // purple
        Closed: '#228B22', // green
        Partially_Closed: '#006400', // dark green
        ForcedClosure: '#FFD700', // yellow
        Rejected: '#FF4500', // orange
        NeedModification: '#000000', // black
        Cancelled: '#FF0000', // red
    };

    useEffect(() => {
        fetchEventsForMonth(currentDate);
    }, [currentDate]);

    const fetchEventsForMonth = (date) => {
        const monthStr = format(date, 'MMMMyyyy');  // 'MMMM' gives the full month name, 'yyyy' gives the year
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
                console.log(data,"kkkkkk");
                const fetchedEvents = data.map((order) => {
                    // Normalize the status name by replacing spaces with underscores
                    const normalizedStatus = order?.status
                    const color = statusColorMapping[normalizedStatus] || '#B5651D';  // Default to a fallback color if status is not mapped

                    return {
                        id: order.id,
                        title: order.customer ? `${order.orderNo} ${order.customer.name}` : order.orderNo,
                        start: new Date(order.orderDate),
                        end: new Date(order.orderDate),
                        url: `/Order/updateorder/${order.id}`,
                        description: order.status,
                        color: color,  // Dynamically set color based on status
                    };
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
                            style={{ height: 500 }}
                            views={['month', 'agenda']}
                            onNavigate={handleDateChange}
                            onSelectEvent={(event) => window.location.href = event.url}
                            eventPropGetter={(event) => ({
                                style: {
                                    backgroundColor: event.color,
                                    borderRadius: '0px',
                                    opacity: 0.8,
                                    color: 'white',
                                    border: 'none',
                                }
                            })}
                        />
                    </div>

                    {/* Right side - List View */}
                    <div className="col-md-3">
                        <h4 className='font-semibold text-center mt-4'>List Of Monthly  Orders</h4>
                        <div className="mt-5">
                            <ul className="list-group">
                                {events.map((event) => (
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
            </div>
        </DefaultLayout>
    );
};

export default MonthlyOrders;
