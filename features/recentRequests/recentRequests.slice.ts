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
        updateRecentRequest(state, action: PayloadAction<RecentRequest>) {
            const idx = state.findIndex(req => req.id === action.payload.id);
            if (idx !== -1) {
                state[idx] = action.payload;
            }
        },
    },
});

export const { setRecentRequests, addRecentRequest, resetRecentRequests, updateRecentRequest } = recentRequestsSlice.actions;
export default recentRequestsSlice.reducer; 