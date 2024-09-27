import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

// createAsyncThunk로 만들어진 비동기 통신 함수는
// action creator 함수이다.
// {type: 'members/join', payload: response.data.item or error 객체}
// dispatch(join)을 하면 slice에 작성한 extraReducers의 리듀서 함수가 동작하게 된다.
export const join = createAsyncThunk(
    'members/join',
    async (member, thunkApi) => {
        try {
            const response = await axios.post('http://211.188.52.164:9090/members/join', member);

            return response.data.item;
        } catch(e) {
            return thunkApi.rejectWithValue(e);
        }
    }
);

export const login = createAsyncThunk(
    'members/login',
    async (member, thunkApi) => {
        try {
            const response = await axios.post('http://211.188.52.164:9090/members/login', member);

            return response.data.item;
        } catch(e) {
            return thunkApi.rejectWithValue(e);
        }
    }
);

export const logout = createAsyncThunk(
    'members/logout',
    async (_, thunkApi) => {
        try {
            const response = await axios.get(
                `http://211.188.52.164:9090/members/logout`,
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`
                    }
                }
            );

            return response.data.item;
        } catch(e) {
            return thunkApi.rejectWithValue(e);
        }
    }
);