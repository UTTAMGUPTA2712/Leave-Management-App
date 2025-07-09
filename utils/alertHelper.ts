import { Alert, Platform } from 'react-native';

interface AlertOptions {
    title?: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    showCancel?: boolean;
}

// Global state for custom alert
let customAlertState: {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    showCancel: boolean;
} = {
    visible: false,
    title: '',
    message: '',
    onConfirm: () => { },
    showCancel: false,
};

let setCustomAlertState: React.Dispatch<React.SetStateAction<typeof customAlertState>> | null = null;

export const setCustomAlertStateSetter = (setter: React.Dispatch<React.SetStateAction<typeof customAlertState>>) => {
    setCustomAlertState = setter;
};

export const showAlert = ({ title = 'Alert', message, onConfirm, onCancel, showCancel = false }: AlertOptions) => {
    if (Platform.OS === 'web') {
        // Use custom alert for web
        if (setCustomAlertState) {
            setCustomAlertState({
                visible: true,
                title,
                message,
                onConfirm: () => {
                    setCustomAlertState && setCustomAlertState({ ...customAlertState, visible: false });
                    onConfirm?.();
                },
                onCancel: onCancel ? () => {
                    setCustomAlertState && setCustomAlertState({ ...customAlertState, visible: false });
                    onCancel();
                } : undefined,
                showCancel,
            });
        }
    } else {
        // Use native Alert for mobile
        if (showCancel) {
            Alert.alert(
                title,
                message,
                [
                    { text: 'Cancel', onPress: onCancel, style: 'cancel' },
                    { text: 'OK', onPress: onConfirm },
                ]
            );
        } else {
            Alert.alert(title, message, [{ text: 'OK', onPress: onConfirm }]);
        }
    }
};

export const getCustomAlertState = () => customAlertState; 