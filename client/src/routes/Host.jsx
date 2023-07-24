import React, { useEffect, useState } from 'react';
import { socket } from '../socket';

export function Host(){
  const [roomCode, setRoomCode] = useState();
  const redirect = (url) => location.pathname = url;
  useEffect(()=>{
    socket.emit("getRoomCode")
    socket.on("roomCode", (code)=>setRoomCode(code))
  }, [])
  
  useEffect(()=>{
    if(!roomCode) return
    redirect(`room/${roomCode}`)
  },[roomCode])

}
