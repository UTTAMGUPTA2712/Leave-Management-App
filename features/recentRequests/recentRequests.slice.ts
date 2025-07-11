import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RecentRequest {
    id: number;
    date: string;
    type: string;
    status: string;
}

const initialState: RecentRequest[] = [];

const recentRequestsSlice = createSlice({
    name: 'recentRequests',
    initialState,
    reducers: {
        setRecentRequests(state, action: PayloadAction<RecentRequest[]>) {
            return action.payload;
        },
        addRecentRequest(state, action: PayloadAction<RecentRequest>) {
            state.unshift(action.payload);
        },
        resetRecentRequests() {
            return [];
        },
    },
});

export const { setRecentRequests, addRecentRequest, resetRecentRequests } = recentRequestsSlice.actions;
export default recentRequestsSlice.reducer; 