import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    showCancel?: boolean;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    showCancel = false,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
        >
            <View style={styles.overlay}>
                <View style={styles.alertContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.buttonContainer}>
                        {showCancel && (
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
                            <Text style={styles.confirmButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        margin: 20,
        minWidth: 300,
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#22223b',
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        color: '#4a4e69',
        lineHeight: 22,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        minWidth: 60,
        alignItems: 'center',
    },
    confirmButton: {
        backgroundColor: '#22223b',
    },
    cancelButton: {
        backgroundColor: '#e0e0e0',
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: 'bold',
    },
});

export default CustomAlert; 