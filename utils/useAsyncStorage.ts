import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';

export function useAsyncStorage<T = any>(key: string) {
    // Get data from AsyncStorage
    const getData = useCallback(async (): Promise<T | null> => {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error('Error reading value', e);
            return null;
        }
    }, [key]);

    // Save data to AsyncStorage
    const setData = useCallback(async (value: T) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            console.error('Error saving value', e);
        }
    }, [key]);

    // Delete data from AsyncStorage
    const deleteData = useCallback(async () => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            console.error('Error deleting value', e);
        }
    }, [key]);

    return { getData, setData, deleteData };
} 