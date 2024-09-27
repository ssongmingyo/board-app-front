import React, { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    alert("안녕하세요.");
  }, []);

  return (
    <div>게시판 홈</div>
  );
};

export default Home;