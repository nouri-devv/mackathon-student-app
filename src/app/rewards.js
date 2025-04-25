import React from 'react';

const Rewards = () => {
    // Mock data for reward points and event history
    const totalPoints = 120; // Total reward points accrued
    const eventHistory = [
        { event: 'Math Workshop', points: 20 },
        { event: 'Science Fair', points: 30 },
        { event: 'Community Service', points: 50 },
        { event: 'Art Competition', points: 20 },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1>Rewards</h1>
            <div style={{ marginBottom: '20px' }}>
                <h2>Total Reward Points: {totalPoints}</h2>
            </div>
            <div>
                <h3>Event History</h3>
                <ul>
                    {eventHistory.map((event, index) => (
                        <li key={index}>
                            {event.event}: {event.points} points
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Rewards;