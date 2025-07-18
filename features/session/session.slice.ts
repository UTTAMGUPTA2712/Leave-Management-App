import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../users/users.slice';

interface SessionState {
    email: string;
    avatar: string | null | undefined;
    name: string | undefined;
    phone: string;
    address: string;
    user: User | null;
    isAuthenticated: boolean;
}

const initialState: SessionState = {
    user: null,
    isAuthenticated: false,
    email: '',
    avatar: undefined,
    name: undefined,
    phone: '',
    address: ''
};

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        signin(state, action: PayloadAction<User>) {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        signout(state) {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const { signin, signout } = sessionSlice.actions;
export default sessionSlice.reducer; 