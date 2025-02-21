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

    // Fetch events based on the selected month
    useEffect(() => {
        fetchEventsForMonth(currentDate);
    }, [currentDate]);

    // Fetch events for the selected month from the backend
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
                // Map the fetched events into the correct format for react-big-calendar
                const fetchedEvents = data.map((order) => {
                    return {
                        id: order.id,
                        title: order.customer ? `${order.orderNo} ${order.customer.name}` : order.orderNo,
                        start: new Date(order.orderDate),  // Assuming orderDate is in a valid format
                        end: new Date(order.orderDate),    // Adjust the end date if needed
                        url: `/Order/updateorder/${order.id}`,
                        description: order.status,
                        color: '#B5651D',  // You can change the color based on the order status
                    };
                });

                setEvents(fetchedEvents); // Set the events to state
            })
            .catch((error) => {
                console.error('Error fetching events:', error);
            });
    };

    // Handle date changes when user navigates the calendar
    const handleDateChange = (date) => {
        setCurrentDate(date);
        fetchEventsForMonth(date);
    };

    // Custom styles and content for agenda events
    const eventStyleGetter = (event) => {
        const style = {
            backgroundColor: event.color || '#B5651D',  // Custom background color
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white',
            border: 'none',
            display: 'block',
        };
        return {
            style: style,
        };
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Order/Create Order" />
            <div className="container">
                <div className="row">
                    <div className="col-md-9">
                        <h3>Monthly Orders</h3>
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 500 }}
                            views={['month', 'agenda']}  // Show month and agenda views
                            onNavigate={handleDateChange}  // Handle calendar navigation
                            onSelectEvent={(event) => window.location.href = event.url}  // Navigate to event details
                            eventPropGetter={eventStyleGetter}  // Custom styles for agenda events
                        />
                    </div>

                    {/* Right side - List View */}
                    <div className="col-md-3">
                        <h4>List Of Orders</h4>
                        <div className="mt-5">
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
        </DefaultLayout>
    );
};

export default MonthlyOrders;
