import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import leaveSummaryReducer from '../features/leaveSummary/leaveSummary.slice';
import recentRequestsReducer from '../features/recentRequests/recentRequests.slice';
import sessionReducer from '../features/session/session.slice';
import usersReducer from '../features/users/users.slice';

// Custom storage engine for React Native
const customStorage = {
    getItem: async (key: string) => {
        try {
            const value = await AsyncStorage.getItem(key);
            return value;
        } catch (error) {
            console.error('Error reading from AsyncStorage:', error);
            return null;
        }
    },
    setItem: async (key: string, value: string) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.error('Error writing to AsyncStorage:', error);
        }
    },
    removeItem: async (key: string) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from AsyncStorage:', error);
        }
    },
};

const rootReducer = combineReducers({
    session: sessionReducer,
    users: usersReducer,
    leaveSummary: leaveSummaryReducer,
    recentRequests: recentRequestsReducer,
    // Add your feature reducers here
});

// Temporarily disable persistence to isolate the issue
// const persistConfig = {
//     key: 'root',
//     storage: customStorage,
//     whitelist: ['session', 'users', 'leaveSummary', 'recentRequests'],
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: rootReducer, // Use rootReducer directly instead of persistedReducer
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                ignoredPaths: ['persist'],
            },
        }),
});

// Temporarily disable persistor
// export const persistor = persistStore(store);
export const persistor = null;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 