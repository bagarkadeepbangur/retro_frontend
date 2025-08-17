import React, { useEffect, useState } from "react";
import API from "../api/axios";
import BoardForm from "./BoardForm";
import BoardView from "./BoardView";
import type { Board } from "./type";
import Header from "./Header";
// import CryptoJS from 'crypto-js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import { useDispatch } from 'react-redux';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import { setUser } from '../store/authSlice';
// import { useSelector } from 'react-redux';

const Home: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // const dispatch = useDispatch();
  const fetchBoards = async () => {
    // const user = useSelector((state) => state.auth.user);
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    try {
      const { data } = await API.get<Board[]>("/boards",{params:user});
      setBoards(data);
    } catch (err) {
      console.error("Failed to fetch boards:", err);
    } finally {
      setLoading(false);
    }
  };

  // function decryptPayload(encryptedPayload: string) {
  //   const secret = "74f32b18988211ff3ce7e1206c5df9811ba7ee25ec828ca4381e68ce802e1e1e";
  //   const key = CryptoJS.enc.Hex.parse(secret);
  
  //   const [ivBase64, cipherBase64] = encryptedPayload.split(':');
  //   const iv = CryptoJS.enc.Base64.parse(ivBase64);
  
  //   const decrypted = CryptoJS.AES.decrypt(cipherBase64, key, {
  //     iv,
  //     mode: CryptoJS.mode.CBC,
  //     padding: CryptoJS.pad.Pkcs7
  //   });
  
  //   return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  // }
  useEffect(() => {
    // const params = new URLSearchParams(window.location.search).get('token');
    // console.log(params)
    // let user
    // if(params){
    //   // const userId = params.get("token")||null;
    //   const decoded = decodeURIComponent(params);
    //   user = decryptPayload(decoded);
    //   console.log("USER ID from task-->",user,typeof user)
    //   // dispatch(setUser(user));
    //   localStorage.setItem('user', JSON.stringify(user));
    // }else{
    //   const token = localStorage.getItem("userInfo");
    //   console.log("retro board token-->",token)
    //   if (!token) {
    //     window.location.href = 'https://taskmanager-frontend-ten.vercel.app/log-in?redirect=https://retro-frontend-liard.vercel.app/';
    //     return;
    //   }
    // }

    fetchBoards();
  }, []);
  const updateBoard = (updatedBoard: Board) => {
    setBoards((prevBoards) =>
      prevBoards.map((b) => (b._id === updatedBoard._id ? updatedBoard : b))
    );
  };



  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* <h1 className="text-2xl font-bold mb-4">Agile Retrospective Boards</h1> */}
      <Header />

      <BoardForm onBoardCreated={fetchBoards} />

      {loading ? (
        <p>Loading...</p>
      ) : (
        boards.map((board) => <BoardView key={board._id} board={board} setBoard={(updated) => updateBoard(updated)} onUpdate={() => fetchBoards()} />)
      )}
    </div>
  );
};

export default Home;
