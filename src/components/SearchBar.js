import { Button, Container, Grid, NativeSelect, TextField } from '@mui/material';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { change_searchCondition, change_searchKeyword } from '../slices/boardSlice';
import { getBoards } from '../apis/boardApis';

const SearchBar = () => {
    const dispatch = useDispatch();
    const searchCondition = useSelector(state => state.boardSlice.searchCondition);
    const searchKeyword = useSelector(state => state.boardSlice.searchKeyword);

    const changeSearchCondition = useCallback((e) => {
        dispatch(change_searchCondition(e.target.value));
    }, [dispatch]);

    const changeSearchKeyword = useCallback((e) => {
        dispatch(change_searchKeyword(e.target.value));
    }, [dispatch]);

    const handleSearch = useCallback((e) => {
        e.preventDefault();

        dispatch(getBoards({
            searchCondition,
            searchKeyword,
            page: 0
        }));
    }, [dispatch, searchCondition, searchKeyword]);

  return (
    <Container component='div' maxWidth='md' style={{marginTop: '3%'}}>
        <form onSubmit={handleSearch}>
            <Grid container spacing={1}>
                <Grid item md={3}>
                    <NativeSelect
                        defaultValue={searchCondition}
                        inputProps={{
                            name: 'searchCondition'
                        }}
                        fullWidth
                        onChange={changeSearchCondition}
                    >
                        <option value='all'>전체</option>
                        <option value='title'>제목</option>
                        <option value='content'>내용</option>
                        <option value='writer'>작성자</option>
                    </NativeSelect>
                </Grid>
                <Grid item md={7}>
                    <TextField
                        name='searchKeyword'
                        fullWidth
                        variant='standard'
                        value={searchKeyword}
                        onChange={changeSearchKeyword}></TextField>
                </Grid>
                <Grid item md={2}>
                    <Button type='submit'
                            color='primary'>
                        검색
                    </Button>
                </Grid>
            </Grid>
        </form>
    </Container>
  );
};

export default SearchBar;