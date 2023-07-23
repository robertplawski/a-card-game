import React, {useEffect, useState, useContext, createContext} from "react";
import { socket } from '../socket';
import { useParams } from 'react-router-dom';
import { PromptModal, AlertModal} from '../components/Modal.jsx'
import { IconLoader2, IconUser, IconUsers, IconCrown} from "@tabler/icons-react";
import {ModalContextProvider, ModalContext} from "../components/Modal.jsx";

export const NetworkContext = createContext()

export function NetworkContextProvider({children}){
  const [myself, setMyself] = useState();
  const [room, setRoom] = useState();
  const { roomCode } = useParams();
  
  const {openModal, closeModal} = useContext(ModalContext);

  const gameStarted = () => {
    if(!room) return
    return room.started
  }

  const showPrompt = (prompt, submitCallback) => { // A function that shows a prompt modal
    openModal({
      title: prompt,
      type:"prompt",
      closeCallback:closeModal,
      canClose: false,
      submitCallback: submitCallback
    });
  }

  const showError = (error) => { // A function that shows an error modal
    openModal({
      title: "Error",
      children: error,
      type:"alert",
      closeCallback: ()=>{
        closeModal();
        setTimeout(()=>location.pathname="/", 300)
      },
      canClose: true
    });
  }
  const showAlert = (alert) => { // A function that shows an alert modal
    openModal({
      title: "Alert",
      children: alert,
      type:"alert",
      closeCallback: ()=>{
        closeModal();
      },
      canClose: true
    });
  }

  const getPlayerById = (id) => {
    if(!room || !myself || !id) return {};
    for(const player of room.players){
      if(player.id == id)  return player
    }
  } 

  useEffect(()=>{
    if(!room || !myself) return;
    for(const player of room.players){
      if(player.id == myself.id) setMyself(player)
    }
  }, [room]) // When room changes

  useEffect(()=>{
    socket.emit("exists", roomCode) // Check if room with roomCode of url param code exists?
    socket.on("existsResponse", (exists)=>{
      if(exists){ // If the room exists then 
        socket.emit("joinRoom", roomCode) // Join the room
      }else{
        socket.emit("createRoom", roomCode) // Or create the room
      }
    })

    socket.on("playerData", (data)=>setMyself(data)) // Get myself
    socket.on("updateState", (data)=>setRoom(data)) // Update room state

    socket.on("deleteRoom", ()=>showError("Room deleted")) // If room's deleted, then show an error
    socket.on("error", (error)=>{ // Show an error
      closeModal();
      showError(error)    
    }) 
    socket.on("alert", (alert)=>showAlert(alert)) // Show an alert
  },[roomCode]) // When room code changes 

  useEffect(()=>{
    if(!myself) return // Don't continue if myself doesn't exist
    if(myself.name) return // If myself has a name, also don't continue

    const submitName = (name) => { // Function that sends updated name to the server
      socket.emit("updatedPlayer", {...myself, name: name})
    }

    // Open a modal asking about your name
    showPrompt("What's your name?", (val)=>submitName(val))
  }, [myself])

  

  return <NetworkContext.Provider value={{myself, room, roomCode, getPlayerById, gameStarted, showPrompt, showError, showAlert}}>
      <div
      className="bg-blue-400 p-8 w-screen h-screen flex justify-center items-center">
      {children}
      </div>
    </NetworkContext.Provider>

  /*
  return (!gameStarted()) ? (<div className="flex p-8 justify-center items-center flex-col gap-16 bg-blue-400 h-screen">
    <div className="transition-all p-10 bg-white rounded-2xl drop-shadow-sharp-md flex flex-col gap-8 ">
      <div className="flex flex-row gap-4 justify-center items-center flex-wrap">
        <p className="text-3xl font-bold">
          {getOwner().name || "..."}&apos;s room
        </p>
        <p className="text-xl font-bold">
          Waiting for the game to start...
        </p>
      </div>
      <div className="flex flex-row justify-between gap-8 flex-wrap-reverse">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-1 flex-col gap-2 text-xl border-4 border-black p-4 rounded-2xl justify-between overflow-auto max-h-80">
            <div>{parsePlayers()}</div>
            <div className="self-end flex gap-2 justify-center items-center">
              <IconUsers size="1em"/>{getAvailableSpace()}
            </div>
          </div>
          { (isOwner(playerData))  ?
          <button onClick={()=>startGame(roomCode)} className="justify-center flex text-2xl border-4 border-black rounded-2xl p-3 font-bold hover:bg-gray-100 transition-all">Start</button>
          : ""
          }
        </div>
        <div className="flex flex-col gap-4 p-4 flex-1 rounded-2xl bg-gray-0 justify-center items-center">
          <div className="w-[10rem] h-[10rem] aspect-square bg-rickroll">
            {roomData ? <img src={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${getRoomLink()}`}/> : ""}
          </div>
          <p className="text-ms text-center">Scan QR code, copy link or enter code</p>
          <p className="text-2xl font-bold">{getRoomCode()}</p>
          <p className="text-xs">{getRoomLink()}</p>
        </div>
      </div>
    </div>
  </div>) : <div>
      Game {getRoomCode()} {JSON.stringify(roomData)}</div>*/
}

