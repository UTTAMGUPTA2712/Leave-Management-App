import React, { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { useAsyncStorage } from '../utils/useAsyncStorage';

const defaultLeaveSummary = {
    total: 30,
    taken: 12,
    remaining: 18,
};

const defaultRecentRequests = [
    { id: 1, date: '2024-06-01', type: 'Sick Leave', status: 'Approved' },
    { id: 2, date: '2024-06-10', type: 'Casual Leave', status: 'Pending' },
    { id: 3, date: '2024-06-15', type: 'Earned Leave', status: 'Rejected' },
];

const Dashboard: React.FC = () => {
    const [leaveSummary, setLeaveSummary] = useState(defaultLeaveSummary);
    const [recentRequests, setRecentRequests] = useState(defaultRecentRequests);

    const leaveSummaryStorage = useAsyncStorage<typeof defaultLeaveSummary>(STORAGE_KEYS.LEAVE_SUMMARY);
    const recentRequestsStorage = useAsyncStorage<typeof defaultRecentRequests>(STORAGE_KEYS.RECENT_REQUESTS);

    useEffect(() => {
        // Load leave summary
        leaveSummaryStorage.getData().then((data) => {
            if (data) setLeaveSummary(data);
        });
        // Load recent requests
        recentRequestsStorage.getData().then((data) => {
            if (data) setRecentRequests(data);
        });
    }, []);

    // Example: Save leave summary
    const saveLeaveSummary = async (summary: typeof defaultLeaveSummary) => {
        setLeaveSummary(summary);
        await leaveSummaryStorage.setData(summary);
    };

    // Example: Save recent requests
    const saveRecentRequests = async (requests: typeof defaultRecentRequests) => {
        setRecentRequests(requests);
        await recentRequestsStorage.setData(requests);
    };

    // Example: Delete all data
    const deleteAllData = async () => {
        await leaveSummaryStorage.deleteData();
        await recentRequestsStorage.deleteData();
        setLeaveSummary(defaultLeaveSummary);
        setRecentRequests(defaultRecentRequests);
    };

    return (
        <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
            <h1>Welcome to Your Dashboard</h1>
            <button onClick={deleteAllData} style={{ marginBottom: 16 }}>Reset Data</button>
            <section style={{ marginBottom: 32 }}>
                <h2>Leave Summary</h2>
                <ul>
                    <li>Total Leaves: {leaveSummary.total}</li>
                    <li>Leaves Taken: {leaveSummary.taken}</li>
                    <li>Leaves Remaining: {leaveSummary.remaining}</li>
                </ul>
            </section>
            <section>
                <h2>Recent Leave Requests</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ccc', padding: 8 }}>Date</th>
                            <th style={{ border: '1px solid #ccc', padding: 8 }}>Type</th>
                            <th style={{ border: '1px solid #ccc', padding: 8 }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentRequests.map((req) => (
                            <tr key={req.id}>
                                <td style={{ border: '1px solid #ccc', padding: 8 }}>{req.date}</td>
                                <td style={{ border: '1px solid #ccc', padding: 8 }}>{req.type}</td>
                                <td style={{ border: '1px solid #ccc', padding: 8 }}>{req.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default Dashboard;
