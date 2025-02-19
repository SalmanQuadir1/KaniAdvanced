import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import axios from 'axios';
import { format } from 'date-fns';
import moment from 'moment';  // Import moment correctly

import 'react-big-calendar/lib/css/react-big-calendar.css';  // Big calendar styles
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';

const MonthlyOrders = () => {
    const [events, setEvents] = useState([]);
    const [contextPath, setContextPath] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date());

    // Localizer setup (using moment.js)
    const localizer = momentLocalizer(moment);  // Use moment localizer

    useEffect(() => {
        // Set context path (you can set it dynamically if needed)
        setContextPath(window.location.pathname.split("/")[1]);

        // Fetch initial events
        fetchEventsForMonth(currentDate);
    }, [currentDate]);

    const fetchEventsForMonth = (date) => {
        // Format date to fetch events for the current month
        const monthStr = format(date, 'yyyy-MM');

        axios.get(`/order/getMonthlyOrders/${monthStr}`)
            .then((response) => {
                // Assuming backend returns an array of orders, map them to match calendar format
                const fetchedEvents = response.data.map((order) => {
                    return {
                        id: order.id,
                        title: order.customer ? `${order.orderNo} ${order.customer.name}` : order.orderNo,
                        start: new Date(order.shippingDate),  // Assuming shippingDate is in a valid format
                        end: new Date(order.shippingDate),    // Adjust the end date if needed
                        url: `/order/update?id=${order.id}`,
                        description: order.status,  // Custom field to display order status or other info
                        color: '#B5651D',  // Color coding can be dynamic based on order status
                    };
                });

                setEvents(fetchedEvents);  // Set events to state
            })
            .catch(error => console.error('Error fetching events:', error));
    };

    // Handle date changes (switching months or navigating)
    const handleDateChange = (date) => {
        setCurrentDate(date);  // Update the current date when the user navigates on the calendar
        fetchEventsForMonth(date);  // Fetch events for the new month/year
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Order/Create Order" />
            <div>

                <div className="container">

                    <div className="row">
                        <div className="col-md-12">
                            <div class="float-right">
                                Created: <span class="dot dot-grey"></span> |
                                Executed: <span class="dot dot-dblue"></span> |
                                PartiallyExecuted: <span class="dot dot-blue"></span> |
                                Approved: <span class="dot dot-dpink"></span> |
                                PartiallyApproved: <span class="dot dot-pink"></span> |
                                Pending: <span class="dot dot-dpurple"></span> 
                                PartiallyPending: <span class="dot dot-purple"></span> 
                                Closed: <span class="dot dot-green"></span> 
                                PartiallyClosed: <span class="dot dot-dgreen"></span> |
                                ForcedClosure: <span class="dot dot-yellow"></span> |
                                Rejected: <span class="dot dot-orange"></span> |
                                NeedModification: <span class="dot dot-black"></span> 
                                Cancelled: <span class="dot dot-red"></span>
                            </div>

                            <h3>Monthly Orders</h3>


                            {/* Calendar View */}
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: 500 }}
                                views={['month', 'week', 'day', 'agenda']}
                                onNavigate={handleDateChange}  // Handle calendar navigation
                                onSelectEvent={(event) => window.location.href = event.url}  // Navigate to event details
                            />

                            {/* List View - displaying events */}
                            <div className="mt-5">
                                <h4>Upcoming Orders</h4>
                                <ul className="list-group">
                                    {events.map((event) => (
                                        <li key={event.id} className="list-group-item">
                                            <strong>{event.title}</strong><br />
                                            <small>{format(event.start, 'MM/dd/yyyy')}</small><br />
                                            <p>{event.description}</p>
                                            <a href={event.url} className="btn btn-primary btn-sm">View Details</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </DefaultLayout>
    );
};

export default MonthlyOrders;
