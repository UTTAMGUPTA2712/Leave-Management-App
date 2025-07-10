import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
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
        leaveSummaryStorage.getData().then((data) => {
            if (data) setLeaveSummary(data);
        });
        recentRequestsStorage.getData().then((data) => {
            if (data) setRecentRequests(data);
        });
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Welcome to Your Dashboard</Text>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Leave Summary</Text>
                <View style={styles.summaryList}>
                    <Text style={styles.summaryItem}>Total Leaves: <Text style={styles.summaryValue}>{leaveSummary.total}</Text></Text>
                    <Text style={styles.summaryItem}>Leaves Taken: <Text style={styles.summaryValue}>{leaveSummary.taken}</Text></Text>
                    <Text style={styles.summaryItem}>Leaves Remaining: <Text style={styles.summaryValue}>{leaveSummary.remaining}</Text></Text>
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Leave Requests</Text>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableCell, styles.headerCell]}>Date</Text>
                    <Text style={[styles.tableCell, styles.headerCell]}>Type</Text>
                    <Text style={[styles.tableCell, styles.headerCell]}>Status</Text>
                </View>
                {recentRequests.map((req) => (
                    <View key={req.id} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{req.date}</Text>
                        <Text style={styles.tableCell}>{req.type}</Text>
                        <Text style={styles.tableCell}>{req.status}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#222',
        textAlign: 'center',
    },
    resetButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 20,
        marginBottom: 20,
    },
    resetButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    section: {
        width: '100%',
        marginBottom: 32,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#007AFF',
    },
    summaryList: {
        width: '90%',
        backgroundColor: '#f7f7f7',
        borderRadius: 10,
        padding: 16,
        marginBottom: 8,
    },
    summaryItem: {
        fontSize: 16,
        marginBottom: 6,
        color: '#444',
    },
    summaryValue: {
        fontWeight: 'bold',
        color: '#222',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#c9ada7',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    headerCell: {
        fontWeight: 'bold',
        color: '#fff',
    },
    tableRow: {
        flexDirection: 'row',
        backgroundColor: '#f7f7f7',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingVertical: 8,
        paddingHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tableCell: {
        flex: 1,
        fontSize: 15,
        color: '#444',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Dashboard;
