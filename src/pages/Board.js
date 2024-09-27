import React, {useCallback, useEffect, useState} from 'react';
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Board = () => {
    const [board, setBoard] = useState(null);

    const {id} = useParams();

    const loginMemberId = useSelector(state => state.memberSlice.id);

    const navi = useNavigate();

    let uploadFiles = [];
    let changeFiles = [];
    let originFiles = [];

    const findById = useCallback(async () => {
        try {
            const response = await axios.get(`http://211.188.52.164:9090/boards/${id}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`
                }
            });

            setBoard(() => response.data.item);
        } catch(e) {
            alert('에러가 발생했습니다.');
        }
    }, [id]);

    useEffect(() => {
        findById();
    }, []);
    
    const deleteById = useCallback(async () => {
        try {
            const resonse = await axios.delete(`http://211.188.52.164:9090/boards/${id}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`
                }
            });

            if(resonse.data.statusCode === 204) {
                alert('정상적으로 삭제되었습니다.');
                navi('/board-list');
            }
        } catch(e) {
            alert('에러가 발생했습니다.');
        }
    }, [id, navi]);

    const changeTextField = useCallback((e) => {
        setBoard(() => ({
            ...board,
            [e.target.name]: e.target.value
        }));
    }, [board]);

    useEffect(() => {
        if(board != null) {
            board.boardFileDtoList.forEach(boardFile => {
                const boardFileObj = {
                    id: boardFile.id,
                    board_id: boardFile.board_id,
                    filename: boardFile.filename,
                    filestatus: 'N'
                };

                originFiles.push(boardFileObj);
            });
        }
    }, [board]);

    const openChangeFileInput = (fileId) => {
        document.querySelector(`#changeFile${fileId}`).click();
    }

    const changeFile = (e, fileId) => {
        const fileList = Array.prototype.slice.call(e.target.files);

        changeFiles.push(fileList[0]);

        originFiles = originFiles.map(originFile => 
            originFile.id == fileId
            ? {
                ...originFile,
                filestatus: 'U',
                newfilename: fileList[0].name
            }
            : originFile
        );

        const reader = new FileReader();

        reader.onload = (ev) => {
            const img = document.querySelector(`#img${fileId}`);

            const p = document.querySelector(`#filename${fileId}`);

            if(fileList[0].name.toLowerCase().match(/(.*?)\.(jpg|png|jpeg|gif|svg|bmp)$/)) {
                img.src = ev.target.result;
            } else {
                img.src = '/images/defaultFileImg.png';
            }

            p.textContent = fileList[0].name;
        }

        reader.readAsDataURL(fileList[0]);
    }

    const deleteImg = (e, fileId) => {
        originFiles = originFiles.map(originFile => 
            originFile.id == fileId
            ? {
                ...originFile,
                filestatus: 'D'
            }
            : originFile
        );

        e.target.parentElement.remove();
    }

    const openAddFileInput = () => {
        document.querySelector(`#uploadFiles`).click();
    }

    // 미리보기 처리
    const imageLoader = (file) => {
        let reader = new FileReader();

        reader.onload = (e) => {
            let img = document.createElement('img');
            img.setAttribute('width', '150px');
            img.setAttribute('height', '80px');
            img.setAttribute('style', 'z-index: none;');

            if(file.name.toLowerCase().match(/(.*?)\.(jpg|png|jpeg|gif|svg|bmp)$/)) {
                img.src = e.target.result;
            } else {
                // 프로젝트 내에 src와 public 폴더가 존재하는데
                // 정적파일들을 src폴더나 public 폴더에 둘 다 위치를 시킬 수 있는데
                // 가져오는 방식이 다르다.
                // src 폴더에 정적 파일을 위치시켰을 경우에는 import 구문으로 파일을 가져와야한다.
                // public 폴더에 정적 파일을 위치시켰을 경우에는 문자열로 경로를 지정할 수 있다.
                // public 폴더에 위치
                img.src = '/images/defaultFileImg.png';
                // src 폴더에 위치
                // img.src = defaultFileImg;
            }

            document.querySelector('#preview').appendChild(makeDiv(img, file));
        }

        reader.readAsDataURL(file);
    }

    const makeDiv = (img, file) => {
        let div = document.createElement('div');

        div.setAttribute('style', 'display: inline-block; position: relative;' + 
            ' width: 150px; height: 120px; margin: 5px; border: 1px solid #00f; z-index: 1;'
        );

        let btn = document.createElement('input');
        btn.setAttribute('type', 'button');
        btn.setAttribute('value', 'x');
        btn.setAttribute('deleteFile', file.name);
        btn.setAttribute('style', 'width: 30px; height: 30px; position: absolute;' +
            ' right: 0; bottom: 0; z-index: 999; background-color: rgba(255, 255, 255, 0.1);' +
            ' color: #f00'
        );

        btn.onclick = (e) => {
            const ele = e.target;

            const deleteFile = ele.getAttribute('deleteFile');

            for(let i = 0; i < uploadFiles.length; i++) {
                if(deleteFile === uploadFiles[i].name) {
                    uploadFiles.splice(i, 1);
                }
            }

            let dataTransfer = new DataTransfer();

            for(let i in uploadFiles) {
                const file = uploadFiles[i];
                dataTransfer.items.add(file);
            }

            document.querySelector("#uploadFiles").files = dataTransfer.files;

            const parentDiv = ele.parentNode;
            parentDiv.remove();
        }

        let filenameP = document.createElement('p');
        filenameP.setAttribute('style', 'display: inline-block; font-size: 8px;');
        filenameP.textContent = file.name;

        div.appendChild(img);
        div.appendChild(btn);
        div.appendChild(filenameP);

        return div;
    }

    const addFiles = (e) => {
        const fileList = Array.prototype.slice.call(e.target.files);

        fileList.forEach(file => {
            imageLoader(file);
            uploadFiles.push(file);
        });
    }

    const modify = useCallback(async (formData) => {
        try {
            const response = await axios.patch('http://211.188.52.164:9090/boards', formData, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`
                }
            });

            if(response.data && response.data.statusCode === 200) {
                alert("정상적으로 수정되었습니다.");
                // uploadFiles = [];
                // changeFiles = [];
                // originFiles = [];
                // setBoard(response.data.item);
                window.location.reload();
            }
        } catch(e) {
            alert('에러가 발생했습니다.');
        }
    }, []);

    const handleModify = useCallback((e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const formDataObj = {};

        formData.forEach((value, key) => formDataObj[key] = value);

        formDataObj['regdate'] = formDataObj.regdate + 'T00:00:00';
        formDataObj['moddate'] = formDataObj.moddate + 'T00:00:00';
        
        const sendFormData = new FormData();

        sendFormData.append("boardDto", new Blob([JSON.stringify(formDataObj)], {
            type: 'application/json'
        }));

        // const uploadFileList = document.querySelector('#uploadFiles').files;

        // for(let i = 0; i < uploadFileList.length; i++) {
        //     uploadFiles.push(uploadFileList[i]);
        // }

        Array.from(uploadFiles).forEach(file => {
            sendFormData.append('uploadFiles', file);
        });

        Array.from(changeFiles).forEach(file => {
            sendFormData.append('changeFiles', file);
        });

        sendFormData.append('originFiles', JSON.stringify(originFiles));

        modify(sendFormData);
    }, [board, uploadFiles, changeFiles, originFiles]);

  return (
    <Container maxWidth='md' style={{marginTop: '3%', textAlign: 'center'}}>
        <Grid container>
            <Grid item xs={12}>
                <Typography component='h1' variant='h5'>
                    게시글 상세
                </Typography>
            </Grid>
        </Grid>
        <form onSubmit={handleModify}>
            {board != null && <input type='hidden' name='id' id='id' value={board.id}></input>}
            <Grid container style={{marginTop: '3%', textAlign: 'center'}}>
                <Grid item
                      xs={2}
                      style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Typography component='p' variant='string'>
                            제목
                        </Typography>
                </Grid>
                <Grid item
                      xs={10}>
                    <TextField name='title'
                               id='title'
                               fullWidth
                               size='small'
                               required
                               value={board != null ? board.title : ''}
                               aria-readonly={board != null && loginMemberId != board.writer_id
                                ? 'true' : 'false'}
                               onChange={changeTextField}
                    ></TextField>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: '3%', textAlign: 'center'}}>
                <Grid item
                      xs={2}
                      style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Typography component='p' variant='string'>
                            작성자
                        </Typography>
                </Grid>
                <Grid item
                      xs={10}>
                    <TextField name='nickname'
                               id='nickname'
                               fullWidth
                               size='small'
                               required
                               aria-readonly='true'
                               value={board != null ? board.nickname : ''}
                    ></TextField>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: '3%', textAlign: 'center'}}>
                <Grid item
                      xs={2}
                      style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Typography component='p' variant='string'>
                            내용
                        </Typography>
                </Grid>
                <Grid item
                      xs={10}>
                    <TextField name='content'
                               id='content'
                               fullWidth
                               size='small'
                               required
                               multiline
                               rows={10}
                               value={board != null ? board.content : ''}
                               aria-readonly={board != null && loginMemberId != board.writer_id
                                ? 'true' : 'false'}
                               onChange={changeTextField}></TextField>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: '3%', textAlign: 'center'}}>
                <Grid item
                      xs={2}
                      style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Typography component='p' variant='string'>
                            작성일
                        </Typography>
                </Grid>
                <Grid item
                      xs={10}>
                    <TextField name='regdate'
                               id='regdate'
                               fullWidth
                               size='small'
                               aria-readonly='true'
                               value={board != null ? board.regdate.substring(0, board.regdate.indexOf('T')) : ''}></TextField>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: '3%', textAlign: 'center'}}>
                <Grid item
                      xs={2}
                      style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Typography component='p' variant='string'>
                            수정일
                        </Typography>
                </Grid>
                <Grid item
                      xs={10}>
                    <TextField name='moddate'
                               id='moddate'
                               fullWidth
                               size='small'
                               value={board != null ? board.moddate.substring(0, board.moddate.indexOf('T')) : ''}
                               aria-readonly='true'></TextField>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: '3%', textAlign: 'center'}}>
                <Grid item
                      xs={2}
                      style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Typography component='p' variant='string'>
                            조회수
                        </Typography>
                </Grid>
                <Grid item
                      xs={10}>
                    <TextField name='cnt'
                               id='cnt'
                               fullWidth
                               size='small'
                               value={board != null ? board.cnt: ''}
                               aria-readonly='true'></TextField>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: '3%', textAlign: 'center'}}>
                <Grid item
                      xs={2}
                      style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Typography component='p' variant='string'>
                            파일첨부
                        </Typography>
                </Grid>
                <Grid item
                      xs={10}>
                    <Button type='button' variant='outlined'
                            onClick={openAddFileInput}>파일 선택</Button>
                    <input type='file'
                           multiple
                           name='uploadFiles'
                           id='uploadFiles'
                           style={{display: 'none'}}
                           onChange={addFiles}></input>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: '3%', textAlign: 'center'}}>
                <Grid item
                      xs={2}
                      style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Typography component='p' variant='string'>
                            미리보기
                        </Typography>
                </Grid>
                <Grid item
                      xs={10}>
                    <Container component='div' name='preview' id='preview'>
                        {board != null && board.boardFileDtoList.map((boardFile, index) => (
                            <div key={index}
                                 style={{
                                    display: 'inline-block',
                                    position: 'relative',
                                    width: '150px',
                                    height: '120px',
                                    margin: '5px',
                                    border: '1px solid #00f',
                                    zIndex: 1
                                 }}
                            >
                                <input type='file'
                                       style={{display: 'none'}}
                                       id={`changeFile${boardFile.id}`}
                                       onChange={(e) => changeFile(e, boardFile.id)}
                                ></input>
                                <img width='150px'
                                     height='80px'
                                     style={{zIndex: 'none', cursor: 'pointer'}}
                                     className='fileImg'
                                     id={`img${boardFile.id}`}
                                     src={boardFile.filetype === 'image'
                                        ? `https://kr.object.ncloudstorage.com/bitcamp72/${boardFile.filepath}${boardFile.filename}`
                                        : '/images/defaultFileImg.png'
                                     }
                                     onClick={() => openChangeFileInput(boardFile.id)}
                                ></img>
                                <input type='button'
                                       className='delete-btn'
                                       value='x'
                                       style={{
                                        width: '30px',
                                        height: '30px',
                                        position: 'absolute',
                                        right: 0,
                                        bottom: 0,
                                        zIndex: 999,
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        color: '#f00'
                                       }}
                                       onClick={(e) => deleteImg(e, boardFile.id)}
                                ></input>
                                <p style={{
                                        display: 'inline-block',
                                        fontSize: '8px'
                                    }}
                                   id={`filename${boardFile.id}`}
                                >{boardFile.fileoriginname}</p>
                            </div>
                        ))}
                    </Container>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: '3%', textAlign: 'center'}}>
                <Grid item
                      xs={12}
                      style={
                        board != null && loginMemberId === board.writer_id
                        ? {display: 'block'}
                        : {display: 'none'}
                      }>
                        <Button type='submit' variant='contained'>수정</Button>
                        <Button type='button' variant='contained' style={{marginLeft: '2%'}}
                                onClick={deleteById}>삭제</Button>
                </Grid>
            </Grid>
        </form>
    </Container>
  );
};

export default Board;