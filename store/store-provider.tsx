import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    // If persistor is null (persistence disabled), render without PersistGate
    if (!persistor) {
        return (
            <Provider store={store}>
                {children}
            </Provider>
        );
    }

    return (
        <Provider store={store}>
            <PersistGate
                loading={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#1565c0" />
                    </View>
                }
                persistor={persistor}
            >
                {children}
            </PersistGate>
        </Provider>
    );
}; 