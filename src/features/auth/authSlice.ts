import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: any | null;
    token: string | null;
}

const getUserFromStorage = () => {
    try {
        const user = sessionStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Error parsing user from sessionStorage:', error);
        sessionStorage.removeItem('user');
        return null;
    }
};

const getTokenFromStorage = () => {
    const token = sessionStorage.getItem('token');
    return token !== 'undefined' && token !== 'null' ? token : null;
};

const initialState: AuthState = {
    user: getUserFromStorage(),
    token: getTokenFromStorage(),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            { payload: { user, access_token } }: PayloadAction<{ user: any; access_token: string }>
        ) => {
            state.user = user;
            state.token = access_token;
            sessionStorage.setItem('token', access_token);
            sessionStorage.setItem('user', JSON.stringify(user));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

// Selector functions to access auth state (using any to avoid circular dependency with store.ts)
export const selectCurrentUser = (state: any) => state.auth.user;
export const selectCurrentToken = (state: any) => state.auth.token;
