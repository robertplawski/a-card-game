import React, { useEffect, useState } from 'react';
import { socket } from '../socket';

export function Host(){
  const [roomCode, setRoomCode] = useState();
  useEffect(()=>{
    socket.emit("getRoomCode")
    socket.on("roomCode", (code)=>setRoomCode(code))
  }, [])
  
  useEffect(()=>{
    if(!roomCode) return
    location.pathname = `room/${roomCode}`
  },[roomCode])

}
