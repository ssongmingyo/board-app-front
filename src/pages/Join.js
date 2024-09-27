import React, {useState, useCallback} from 'react';
import {Button, Container, Grid, TextField, Typography} from '@mui/material';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import { join } from '../apis/memberApis';

const Join = () => {
    const [joinForm, setJoinForm] = useState({
        username: '',
        password: '',
        passwordCheck: '',
        nickname: '',
        email: '',
        tel: ''
    });
    const [usernameChk, setUsernameChk] = useState(false);
    const [passwordValidate, setPasswordValidate] = useState(false);
    const [passwordChk, setPasswordChk] = useState(false);
    const [nicknameChk, setNicknameChk] = useState(false);

    const dispatch = useDispatch();

    const changeTextField = useCallback((e) => {
        setJoinForm({
            ...joinForm,
            [e.target.name]: e.target.value
        });

        if(e.target.name === 'username') {
            setUsernameChk(false);
            document.querySelector("#username-check-btn").removeAttribute('disabled');
            return;
        }

        if(e.target.name === 'nickname') {
            setNicknameChk(false);
            document.querySelector("#nickname-check-btn").removeAttribute('disabled');
            return;
        }

        if(e.target.name === 'password') {
            if(e.target.value === joinForm.passwordCheck) {
                setPasswordChk(true);
                document.querySelector("#password-check-success").style.display = 'block';
                document.querySelector("#password-check-fail").style.display = 'none';
            } else {
                setPasswordChk(false);
                document.querySelector("#password-check-success").style.display = 'none';
                document.querySelector("#password-check-fail").style.display = 'block';
            }
        }

        if(e.target.name === 'passwordCheck') {
            if(e.target.value === joinForm.password) {
                setPasswordChk(true);
                document.querySelector("#password-check-success").style.display = 'block';
                document.querySelector("#password-check-fail").style.display = 'none';
            } else {
                setPasswordChk(false);
                document.querySelector("#password-check-success").style.display = 'none';
                document.querySelector("#password-check-fail").style.display = 'block';
            }
        }
    }, [joinForm]);

    const usernameCheck = useCallback(async () => {
        try {
            if(joinForm.username === '') {
                alert('아이디를 입력하세요.');
                document.querySelector('#username').focus();
                return;
            }

            const response = await axios.post('http://211.188.52.164:9090/members/username-check', {
                username: joinForm.username
            });

            if(response.data.item.usernameCheckMsg === 'invalid username') {
                alert('중복된 아이디입니다. 다른 아이디로 변경해주세요.');
                document.querySelector('#username').focus();
                return;
            } else {
                if(window.confirm(`${joinForm.username}은 사용가능한 아이디입니다. 사용하시겠습니까?`)) {
                    document.querySelector('#username-check-btn').setAttribute('disabled', true);
                    setUsernameChk(true);
                    return;
                }
            }
        } catch(e) {
            console.log(e);
            alert("에러가 발생했습니다.");
        }
    }, [joinForm.username]);

    const nicknameCheck = useCallback(async () => {
        try {
            if(joinForm.nickname === '') {
                alert('닉네임을 입력하세요.');
                document.querySelector('#nickname').focus();
                return;
            }

            const response = await axios.post('http://211.188.52.164:9090/members/nickname-check', {
                nickname: joinForm.nickname
            });

            if(response.data.item.nicknameCheckMsg === 'invalid nickname') {
                alert('중복된 닉네임입니다. 다른 닉네임을 사용하세요.');
                document.querySelector('#nickname').focus();
                return;
            } else {
                if(window.confirm(`${joinForm.nickname}은 사용가능한 닉네임입니다. 사용하시겠습니까?`)) {
                    document.querySelector('#nickname-check-btn').setAttribute('disabled', true);
                    setNicknameChk(true);
                    return;
                }
            }
        } catch(e) {
            console.log(e);
            alert('에러가 발생했습니다.');
        }
    }, [joinForm.nickname]);

    const validatePassword = useCallback(() => {
        return /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*+=-]).{9,}$/.test(joinForm.password);
    }, [joinForm.password]);

    const passwordBlur = useCallback(() => {
        if(validatePassword()) {
            setPasswordValidate(true);
            document.querySelector('#password-validation').style.display = 'none';
            return;
        }

        setPasswordValidate(false);
        document.querySelector('#password-validation').style.display = 'block';
        return;
    }, [validatePassword]);

    const handleJoin = useCallback((e) => {
        e.preventDefault();

        if(!usernameChk) {
            alert('아이디 중복확인을 진행하세요.');
            return;
        }

        if(!passwordValidate) {
            alert('비밀번호는 특수문자, 숫자, 영문자 조합의 9자리 이상으로 지정하세요.');
            return;
        }

        if(!passwordChk) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        if(!nicknameChk) {
            alert('닉네임 중복확인을 진행하세요.');
            return;
        }

        dispatch(join(joinForm));
    }, [joinForm, usernameChk, passwordChk, passwordValidate, nicknameChk, dispatch]);

  return (
    <Container component='div' maxWidth='xs' style={{marginTop: '8%'}}>
        <form onSubmit={handleJoin}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography component='h1' variant='h5'>
                        회원가입
                    </Typography>
                </Grid>
                <Grid item xs={12} textAlign='right'>
                    <TextField
                        name='username'
                        variant='outlined'
                        required
                        id='username'
                        label='아이디'
                        autoFocus
                        fullWidth
                        value={joinForm.username}
                        onChange={changeTextField}
                    ></TextField>
                    <Button name='username-check-btn' id='username-check-btn' color='primary'
                            type='button'
                            onClick={usernameCheck}>
                        중복확인
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name='password'
                        variant='outlined'
                        required
                        id='password'
                        label='비밀번호'
                        fullWidth
                        type='password'
                        value={joinForm.password}
                        onChange={changeTextField}
                        onBlur={passwordBlur}
                    ></TextField>
                    <Typography
                        name='password-validation'
                        id='password-validation'
                        component='p'
                        variant='string'
                        style={{display: 'none', color: 'red'}}>
                        비밀번호는 특수문자, 영문자, 숫자 조합의 9자리 이상으로 지정하세요.        
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name='passwordCheck'
                        variant='outlined'
                        required
                        id='passwordCheck'
                        label='비밀번호 확인'
                        fullWidth
                        type='password'
                        value={joinForm.passwordCheck}
                        onChange={changeTextField}
                    ></TextField>
                    <Typography
                        name='password-check-success'
                        id='password-check-success'
                        component='p'
                        variant='string'
                        style={{display: 'none', color: 'green'}}>
                        비밀번호가 일치합니다.        
                    </Typography>
                    <Typography
                        name='password-check-fail'
                        id='password-check-fail'
                        component='p'
                        variant='string'
                        style={{display: 'none', color: 'red'}}>
                        비밀번호가 일치하지 않습니다.        
                    </Typography>
                </Grid>
                <Grid item xs={12} textAlign='right'>
                    <TextField
                        name='nickname'
                        variant='outlined'
                        required
                        id='nickname'
                        label='닉네임'
                        fullWidth
                        value={joinForm.nickname}
                        onChange={changeTextField}
                    ></TextField>
                    <Button name='nickname-check-btn' id='nickname-check-btn' color='primary'
                            onClick={nicknameCheck}>
                        중복확인
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name='email'
                        variant='outlined'
                        required
                        id='email'
                        label='이메일'
                        fullWidth
                        value={joinForm.email}
                        onChange={changeTextField}
                    ></TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name='tel'
                        variant='outlined'
                        required
                        id='tel'
                        label='전화번호'
                        fullWidth
                        value={joinForm.tel}
                        onChange={changeTextField}
                    ></TextField>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        color='primary'>
                        회원가입
                    </Button>
                </Grid>
            </Grid>
        </form>
    </Container>
  );
};

export default Join;