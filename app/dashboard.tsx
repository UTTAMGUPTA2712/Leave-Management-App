import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { resetLeaveSummary } from '../features/leaveSummary/leaveSummary.slice';
import { resetRecentRequests } from '../features/recentRequests/recentRequests.slice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const Dashboard: React.FC = React.memo(() => {
    const dispatch = useAppDispatch();
    const leaveSummary = useAppSelector(state => state.leaveSummary);
    const recentRequests = useAppSelector(state => state.recentRequests);

    // Example: Delete all data
    const deleteAllData = useCallback(async () => {
        dispatch(resetLeaveSummary());
        dispatch(resetRecentRequests());
    }, [dispatch]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Welcome to Your Dashboard</Text>
            <TouchableOpacity style={styles.resetButton} onPress={deleteAllData}>
                <Text style={styles.resetButtonText}>Reset Data</Text>
            </TouchableOpacity>
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
});

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
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    summaryList: {
        backgroundColor: '#f7f7f7',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
    },
    summaryItem: {
        fontSize: 16,
        marginBottom: 4,
        color: '#444',
    },
    summaryValue: {
        fontWeight: 'bold',
        color: '#1565c0',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#e0e0e0',
        borderRadius: 6,
        padding: 8,
        marginBottom: 4,
    },
    headerCell: {
        fontWeight: 'bold',
        color: '#333',
    },
    tableRow: {
        flexDirection: 'row',
        backgroundColor: '#f7f7f7',
        borderRadius: 6,
        padding: 8,
        marginBottom: 2,
    },
    tableCell: {
        flex: 1,
        fontSize: 15,
        color: '#444',
    },
});

export default Dashboard;
