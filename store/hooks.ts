import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Direct selectors for state slices
export const useUsersList = () => useAppSelector(state => state.users);
export const useCurrentUser = () => useAppSelector(state => state.session || null);
export const useLeaveSummary = () => useAppSelector(state => state.leaveSummary);
export const useRecentRequests = () => useAppSelector(state => state.recentRequests);

// Example session selectors (if you have a session slice)
export const useSessionState = () => useAppSelector(state => (state as any).session);
export const useIsAuthenticated = () => !!useCurrentUser(); 