import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useCallback, useState } from 'react';
import { Button, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { resetLeaveSummary } from '../features/leaveSummary/leaveSummary.slice';
import { addRecentRequest, resetRecentRequests, updateRecentRequest } from '../features/recentRequests/recentRequests.slice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const Dashboard: React.FC = React.memo(() => {
    const dispatch = useAppDispatch();
    const leaveSummary = useAppSelector(state => state.leaveSummary);
    const recentRequests = useAppSelector(state => state.recentRequests);

    // Modal and form state
    const [modalVisible, setModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    // Remove status from form state and validation
    const [form, setForm] = useState({ id: 0, date: '', type: '' });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [errors, setErrors] = useState<{ date?: string, type?: string }>({});

    const openAddModal = () => {
        setForm({ id: 0, date: '', type: '' });
        setIsEdit(false);
        setModalVisible(true);
    };

    const openEditModal = (req: any) => {
        setForm({ id: req.id, date: req.date, type: req.type });
        setIsEdit(true);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setForm({ id: 0, date: '', type: '' });
        setIsEdit(false);
    };

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: field === 'id' ? Number(value) : value }));
    };

    const validate = () => {
        const newErrors: { date?: string, type?: string } = {};
        if (!form.date) newErrors.date = 'Date is required';
        if (!form.type.trim()) newErrors.type = 'Type is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (Platform.OS === 'android') {
            if (event.type === 'set' && selectedDate) {
                setForm(prev => ({ ...prev, date: selectedDate.toISOString().split('T')[0] }));
            }
        } else if (selectedDate) {
            setForm(prev => ({ ...prev, date: selectedDate.toISOString().split('T')[0] }));
        }
    };

    const handleSubmit = () => {
        if (!validate()) return;
        if (isEdit) {
            // Keep the original status when editing
            const original = recentRequests.find(r => r.id === form.id);
            dispatch(updateRecentRequest({ ...form, status: original ? original.status : 'Pending' }));
        } else {
            const id = form.id || Date.now();
            dispatch(addRecentRequest({ ...form, id, status: 'Pending' }));
        }
        closeModal();
    };

    const handleApprove = (req: any) => {
        dispatch(updateRecentRequest({ ...req, status: 'Approved' }));
    };

    // Example: Delete all data
    const deleteAllData = useCallback(async () => {
        dispatch(resetLeaveSummary());
        dispatch(resetRecentRequests());
    }, [dispatch]);

    // Compute leave summary from recentRequests
    const total = recentRequests.length;
    const taken = recentRequests.filter(r => r.status === 'Approved').length;
    const remaining = recentRequests.filter(r => r.status === 'Pending').length;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Welcome to Your Dashboard</Text>
            <TouchableOpacity style={styles.resetButton} onPress={deleteAllData}>
                <Text style={styles.resetButtonText}>Reset Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.resetButton, { backgroundColor: '#1565c0', marginBottom: 10 }]} onPress={openAddModal}>
                <Text style={styles.resetButtonText}>Add Leave</Text>
            </TouchableOpacity>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Leave Summary</Text>
                <View style={styles.summaryList}>
                    <Text style={styles.summaryItem}>Total Leaves: <Text style={styles.summaryValue}>{total}</Text></Text>
                    <Text style={styles.summaryItem}>Leaves Taken: <Text style={styles.summaryValue}>{taken}</Text></Text>
                    <Text style={styles.summaryItem}>Leaves Remaining: <Text style={styles.summaryValue}>{remaining}</Text></Text>
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Leave Requests</Text>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableCell, styles.headerCell]}>Date</Text>
                    <Text style={[styles.tableCell, styles.headerCell]}>Type</Text>
                    <Text style={[styles.tableCell, styles.headerCell]}>Status</Text>
                    <Text style={[styles.tableCell, styles.headerCell]}>Edit</Text>
                    <Text style={[styles.tableCell, styles.headerCell]}>Approve</Text>
                </View>
                {recentRequests.map((req) => (
                    <View key={req.id} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{req.date}</Text>
                        <Text style={styles.tableCell}>{req.type}</Text>
                        <Text style={styles.tableCell}>{req.status}</Text>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => openEditModal(req)}>
                            <Text style={{ color: '#1565c0', fontWeight: 'bold' }}>Edit</Text>
                        </TouchableOpacity>
                        {req.status === 'Pending' ? (
                            <TouchableOpacity style={{ flex: 1 }} onPress={() => handleApprove(req)}>
                                <Text style={{ color: '#27ae60', fontWeight: 'bold' }}>Approve</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={{ flex: 1 }} />
                        )}
                    </View>
                ))}
            </View>
            {/* Modal for Add/Edit */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeModal}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 12, width: '85%' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>{isEdit ? 'Edit Leave' : 'Add Leave'}</Text>
                        {/* Date Picker Button (mobile) or TextInput (web) */}
                        {Platform.OS !== 'web' ? (
                            <>
                                <TouchableOpacity
                                    onPress={() => setShowDatePicker(true)}
                                    style={{ borderWidth: 1, borderColor: errors.date ? '#e74c3c' : '#ccc', borderRadius: 6, marginBottom: 12, padding: 12, backgroundColor: '#fafafa' }}
                                >
                                    <Text style={{ color: form.date ? '#222' : '#888' }}>{form.date ? `Date: ${form.date}` : 'Select Date'}</Text>
                                </TouchableOpacity>
                                {errors.date && <Text style={{ color: '#e74c3c', marginBottom: 8 }}>{errors.date}</Text>}
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={form.date ? new Date(form.date) : new Date()}
                                        mode="date"
                                        // Force spinner to avoid material date picker error in Expo Go
                                        display={Platform.OS === 'android' ? 'spinner' : 'default'}
                                        onChange={handleDateChange}
                                    />
                                )}
                            </>
                        ) : (
                            <>
                                {/* Use native HTML date input for web */}
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={e => handleChange('date', e.target.value)}
                                    style={{ borderWidth: 1, borderColor: errors.date ? '#e74c3c' : '#ccc', borderRadius: 6, marginBottom: 12, padding: 8, width: '100%' }}
                                />
                                {errors.date && <Text style={{ color: '#e74c3c', marginBottom: 8 }}>{errors.date}</Text>}
                            </>
                        )}
                        {/* Type Input */}
                        <TextInput
                            placeholder="Type (e.g. Sick, Casual)"
                            value={form.type}
                            onChangeText={text => handleChange('type', text)}
                            style={{ borderWidth: 1, borderColor: errors.type ? '#e74c3c' : '#ccc', borderRadius: 6, marginBottom: 12, padding: 8 }}
                        />
                        {errors.type && <Text style={{ color: '#e74c3c', marginBottom: 8 }}>{errors.type}</Text>}
                        {/* Remove Status Input */}
                        {/* Only Date and Type fields remain */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button title="Cancel" onPress={closeModal} color="#888" />
                            <Button title={isEdit ? 'Update' : 'Add'} onPress={handleSubmit} color="#1565c0" />
                        </View>
                    </View>
                </View>
            </Modal>
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
