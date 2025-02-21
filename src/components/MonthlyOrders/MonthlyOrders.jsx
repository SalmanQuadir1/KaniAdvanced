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
                const fetchedEvents = data.map((order) => {
                    return {
                        id: order.id,
                        title: order.customer ? `${order.orderNo} ${order.customer.name}` : order.orderNo,
                        start: new Date(order.orderDate),
                        end: new Date(order.orderDate),
                        url: `/Order/updateorder/${order.id}`,
                        description: order.status,
                        color: '#B5651D',
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
                        />
                    </div>

                    {/* Right side - List View */}
                    <div className="col-md-3">
                        <h4>Upcoming Orders</h4>
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
