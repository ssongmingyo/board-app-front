import { createSlice } from "@reduxjs/toolkit";
import { getBoards, post } from "../apis/boardApis";

const boardSlice = createSlice({
    name: 'boards',
    initialState: {
        boards: [],
        searchCondition: 'all',
        searchKeyword: '',
    },
    reducers: {
        change_searchCondition: (state, action) => ({
            ...state,
            searchCondition: action.payload
        }),
        change_searchKeyword: (state, action) => ({
            ...state,
            searchKeyword: action.payload
        })
    },
    extraReducers: (builder) => {
        builder.addCase(post.fulfilled, (state, action) => {
            alert('정상적으로 등록되었습니다.');

            return {
                ...state,
                boards: action.payload.pageItems,
                searchCondition: 'all',
                searchKeyword: '',
                page: 0
            }
        });
        builder.addCase(post.rejected, (state, action) => {
            alert('에러가 발생했습니다.');
            console.log(action.payload);
            return state;
        });
        builder.addCase(getBoards.fulfilled, (state, action) => ({
            ...state,
            boards: action.payload.pageItems,
            searchCondition: action.payload.item.searchCondition,
            searchKeyword: action.payload.item.searchKeyword,
            page: action.payload.pageItems.pageable.pageNumber
        }));
        builder.addCase(getBoards.rejected, (state, action) => {
            alert('에러가 발생했습니다.');
            return state;
        });
    }
});

export const {change_searchCondition, change_searchKeyword} = boardSlice.actions;

export default boardSlice.reducer;