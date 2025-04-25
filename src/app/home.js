import React from 'react';

const Home = () => {
    const upcomingEvents = [
        { id: 1, title: 'Math Workshop', date: '2023-10-15' },
        { id: 2, title: 'Science Fair', date: '2023-10-20' },
        { id: 3, title: 'Art Exhibition', date: '2023-10-25' },
    ];

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar */}
            <div style={{ width: '20%', backgroundColor: '#f4f4f4', padding: '20px' }}>
                <h3>Navigation</h3>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    <li><a href="#home" style={{ textDecoration: 'none', color: '#333' }}>Home</a></li>
                    <li><a href="#events" style={{ textDecoration: 'none', color: '#333' }}>Events</a></li>
                    <li><a href="#rewards" style={{ textDecoration: 'none', color: '#333' }}>Rewards</a></li>
                    <li><a href="#profile" style={{ textDecoration: 'none', color: '#333' }}>Profile</a></li>
                </ul>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '20px' }}>
                <h1>Welcome, Student!</h1>
                <p>Here are your upcoming events:</p>
                <ul>
                    {upcomingEvents.map(event => (
                        <li key={event.id}>
                            <strong>{event.title}</strong> - {event.date}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Home;