import {createSlice} from '@reduxjs/toolkit';
import { join, login, logout } from '../apis/memberApis';

const memberSlice = createSlice({
    name: 'members',
    initialState: {
        isLogin: false,
        id: 0,
        username: '',
        nickname: ''
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(join.fulfilled, (state, action) => {
            alert(`${action.payload.username}님 가입 축하드립니다.`);
            // Hooks는 함수형 컴포넌트에서만 사용가능하기 때문에
            // Hooks를 사용못하는 파일에서는 javascript의 기본 기능을 사용한다.
            window.location.href = '/login';
            return state;
        });
        builder.addCase(join.rejected, (state, action) => {
            alert('에러가 발생했습니다.');
            return state;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            alert(`${action.payload.username}님 환영합니다.`);
            sessionStorage.setItem('ACCESS_TOKEN', action.payload.token);

            return {
                ...state,
                isLogin: true,
                id: action.payload.id,
                username: action.payload.username,
                nickname: action.payload.nickname,
            };
        });
        builder.addCase(login.rejected, (state, action) => {
            if(action.payload.response.data.statusMessage === 'username not exist') {
                alert("존재하지 않는 아이디입니다.");
                return state;
            }

            if(action.payload.response.data.statusMessage === 'wrong password') {
                alert("잘못된 비밀번호입니다.");
                return state;
            }

            return state;
        });
        builder.addCase(logout.fulfilled, (state, action) => {
            alert("로그아웃 완료.");
            sessionStorage.removeItem("ACCESS_TOKEN");
            
            return {
                ...state,
                isLogin: false,
                id: 0,
                username: '',
            }
        });
        builder.addCase(logout.rejected, (state, action) => {
            alert("에러가 발생했습니다.");
            return state;
        });
    }
});

export default memberSlice.reducer;