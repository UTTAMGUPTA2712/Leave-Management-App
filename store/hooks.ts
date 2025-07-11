import { createSelector } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Optimized selectors
export const useSessionState = () => useAppSelector(state => state.session);
export const useUsersState = () => useAppSelector(state => state.users);
export const useLeaveSummaryState = () => useAppSelector(state => state.leaveSummary);
export const useRecentRequestsState = () => useAppSelector(state => state.recentRequests);

// Memoized selectors for better performance
export const useIsAuthenticated = () => useAppSelector(
    createSelector(
        [(state: RootState) => state.session],
        (session) => session.isAuthenticated && session.user !== null
    )
);

export const useCurrentUser = () => useAppSelector(
    createSelector(
        [(state: RootState) => state.session],
        (session) => session.user
    )
);

export const useUsersList = () => useAppSelector(
    createSelector(
        [(state: RootState) => state.users],
        (users) => users
    )
); 