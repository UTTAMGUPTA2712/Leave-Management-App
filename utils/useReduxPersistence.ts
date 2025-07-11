import { useCallback, useEffect } from 'react';
import { setLeaveSummary } from '../features/leaveSummary/leaveSummary.slice';
import { setRecentRequests } from '../features/recentRequests/recentRequests.slice';
import { signin } from '../features/session/session.slice';
import { setUsers } from '../features/users/users.slice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { STORAGE_KEYS } from './storageKeys';
import { useAsyncStorage } from './useAsyncStorage';

export const useReduxPersistence = () => {
    const dispatch = useAppDispatch();
    const session = useAppSelector(state => state.session);
    const users = useAppSelector(state => state.users);
    const leaveSummary = useAppSelector(state => state.leaveSummary);
    const recentRequests = useAppSelector(state => state.recentRequests);

    // Use existing AsyncStorage hooks
    const { getData: getSession, setData: setSessionData } = useAsyncStorage(STORAGE_KEYS.SESSION);
    const { getData: getUsers, setData: setUsersData } = useAsyncStorage(STORAGE_KEYS.USERS);
    const { getData: getLeaveSummary, setData: setLeaveSummaryData } = useAsyncStorage(STORAGE_KEYS.LEAVE_SUMMARY);
    const { getData: getRecentRequests, setData: setRecentRequestsData } = useAsyncStorage(STORAGE_KEYS.RECENT_REQUESTS);

    // Load data on app start
    useEffect(() => {
        const loadPersistedData = async () => {
            try {
                // Load session data
                const savedSession = await getSession();
                if (savedSession && savedSession.user) {
                    dispatch(signin(savedSession.user));
                }

                // Load users data
                const savedUsers = await getUsers();
                if (savedUsers) {
                    dispatch(setUsers(savedUsers));
                }

                // Load leave summary
                const savedLeaveSummary = await getLeaveSummary();
                if (savedLeaveSummary) {
                    dispatch(setLeaveSummary(savedLeaveSummary));
                }

                // Load recent requests
                const savedRecentRequests = await getRecentRequests();
                if (savedRecentRequests) {
                    dispatch(setRecentRequests(savedRecentRequests));
                }
            } catch (error) {
                console.warn('Error loading persisted data:', error);
            }
        };

        loadPersistedData();
    }, [dispatch, getSession, getUsers, getLeaveSummary, getRecentRequests]);

    // Save data when state changes
    const saveData = useCallback(async () => {
        try {
            await setSessionData(session);
            await setUsersData(users);
            await setLeaveSummaryData(leaveSummary);
            await setRecentRequestsData(recentRequests);
        } catch (error) {
            console.warn('Error saving data:', error);
        }
    }, [session, users, leaveSummary, recentRequests, setSessionData, setUsersData, setLeaveSummaryData, setRecentRequestsData]);

    useEffect(() => {
        saveData();
    }, [saveData]);

    return null; // This hook doesn't return anything, it just handles persistence
}; 