import { Button, Container, Table, TableCell, TableContainer, TableHead, Paper, TableBody, TableRow, Pagination } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getBoards } from '../apis/boardApis';

const BoardListTable = () => {
    const boards = useSelector(state => state.boardSlice.boards);
    const searchCondition = useSelector(state => state.boardSlice.searchCondition);
    const searchKeyword = useSelector(state => state.boardSlice.searchKeyword);
    const page = useSelector(state => state.boardSlice.page);

    const navi = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getBoards({
            searchCondition: 'all',
            searchKeyword: '',
            page: 0
        }));
    }, []);

    const changePage = useCallback((e, v) => {
        dispatch(getBoards({
            searchCondition,
            searchKeyword,
            page: parseInt(v) - 1
        }));
    }, [searchCondition, searchKeyword]);

  return (
    <>
        <Container maxWidth='xl'>
            <TableContainer component={Paper} style={{marginTop: '3%'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>번호</TableCell>
                            <TableCell>제목</TableCell>
                            <TableCell>작성자</TableCell>
                            <TableCell>작성일</TableCell>
                            <TableCell>조회수</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {boards.content && boards.content.map((board, index) => 
                            <TableRow key={index}> 
                                <TableCell>{board.id}</TableCell>
                                <TableCell>
                                    <Link to={`/board/${board.id}`}>{board.title}</Link>
                                </TableCell>
                                <TableCell>{board.nickname}</TableCell>
                                <TableCell>{board.regdate.substring(0, board.regdate.indexOf('T'))}</TableCell>
                                <TableCell>{board.cnt}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
        <Container maxWidth='xl'
                   style={{marginTop: '1%', display: 'flex', justifyContent: 'right'}}>
            <Button type='button' color='primary' onClick={() => navi('/post')}>글 등록</Button>
        </Container>
        <Container maxWidth='xl'
                   style={{marginTop: '1%', marginBottom: '1%', 
                   display: 'flex', justifyContent: 'center'}}>
            {boards && <Pagination count={boards.totalPages} page={page + 1} onChange={changePage}></Pagination>}
        </Container>
    </>
  );
};

export default BoardListTable;