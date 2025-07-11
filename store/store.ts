import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import leaveSummaryReducer from '../features/leaveSummary/leaveSummary.slice';
import recentRequestsReducer from '../features/recentRequests/recentRequests.slice';
import sessionReducer from '../features/session/session.slice';
import usersReducer from '../features/users/users.slice';

const rootReducer = combineReducers({
    session: sessionReducer,
    users: usersReducer,
    leaveSummary: leaveSummaryReducer,
    recentRequests: recentRequestsReducer,
    // Add your feature reducers here
});

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['session', 'users', 'leaveSummary', 'recentRequests'],
    // Add these options for better React Native compatibility
    timeout: 10000,
    debug: __DEV__, // Only enable debug in development
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'persist/PERSIST',
                    'persist/REHYDRATE',
                    'persist/PAUSE',
                    'persist/PURGE',
                    'persist/REGISTER',
                    'persist/FLUSH'
                ],
                ignoredPaths: ['persist'],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 