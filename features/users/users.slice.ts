import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
    name: string;
    email: string;
    password: string;
    avatar?: string | null;
    phone?: string;
    address?: string;
}

const initialState: User[] = [];

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers(state, action: PayloadAction<User[]>) {
            return action.payload;
        },
        addUser(state, action: PayloadAction<User>) {
            state.push(action.payload);
        },
        updateUser(state, action: PayloadAction<User>) {
            const idx = state.findIndex(u => u.email === action.payload.email);
            if (idx !== -1) state[idx] = action.payload;
        },
        removeUser(state, action: PayloadAction<string>) {
            return state.filter(u => u.email !== action.payload);
        },
    },
});

export const { setUsers, addUser, updateUser, removeUser } = usersSlice.actions;
export default usersSlice.reducer; 