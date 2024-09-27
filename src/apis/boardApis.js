import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const post = createAsyncThunk(
    'boards/post',
    async (formData, thunkApi) => {
        try {
            const response = await axios.post('http://211.188.52.164:9090/boards', formData, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            return response.data;
        } catch(e) {
            return thunkApi.rejectWithValue(e);
        }
    }
);

export const getBoards = createAsyncThunk(
    'boards/getBoards',
    async(searchObj, thunkApi) => {
        try {
            const response = await axios.get('http://211.188.52.164:9090/boards',  {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`
                },
                params: {
                    searchCondition: searchObj.searchCondition,
                    searchKeyword: searchObj.searchKeyword,
                    page: searchObj.page
                }
            });

            return response.data;
        } catch(e) {
            return thunkApi.rejectWithValue(e);
        }
    }
);