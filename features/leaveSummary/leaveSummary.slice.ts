import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LeaveSummary {
    total: number;
    taken: number;
    remaining: number;
}

const initialState: LeaveSummary = {
    total: 30,
    taken: 12,
    remaining: 18,
};

const leaveSummarySlice = createSlice({
    name: 'leaveSummary',
    initialState,
    reducers: {
        setLeaveSummary(state, action: PayloadAction<LeaveSummary>) {
            return action.payload;
        },
        resetLeaveSummary() {
            return initialState;
        },
    },
});

export const { setLeaveSummary, resetLeaveSummary } = leaveSummarySlice.actions;
export default leaveSummarySlice.reducer; 