import React, {useEffect, useState, useContext} from "react";
import { socket } from '../socket';
import { useParams } from 'react-router-dom';
import { PromptModal, AlertModal} from '../components/Modal.jsx'
import { IconLoader2, IconUser, IconUsers, IconCrown} from "@tabler/icons-react";
import {ModalContextProvider, ModalContext} from "../components/Modal.jsx";
import { NetworkContext } from "./Network";

export function Room(){
  const {myself, room, roomCode, gameStarted, showPrompt, showError, showAlert} = useContext(NetworkContext);
  
  const getOwner = () => { // A function that gets the owner of the game
    if(!room) return {};
    for(const player of room.players){
      if(player.id == room.owner_id) return player
    }
    return {}
  }

  const isOwner = (player) => { // A function to check whether player is an owner
    if(!room || !player) return
    return room.owner_id == player.id
  }

  const getRoomCode = () => { // Get room code
    if(!room) return
    return room.code
  }

  const startGame = (code) => { // Start a game using a code
    socket.emit("startGame", code)
  }

  const parsePlayers = () => { // A function that parses all players in the room
    if(!room) return
    return room.players.map((player)=>
      <div className="flex flex-row gap-4 items-center">
        {(isOwner(player)) ? <IconCrown size="1em"/> : <IconUser size="1em"/> } 
        {(player.name) || <IconLoader2  size="1em" className="animate-spin"/>}
        {player == myself && <p className="text-xs">(you)</p>}
      </div>)
  }

  const getRoomLink = () => { // A function that gets room link
    if(!room) return
    return location.href
  }

  const getAvailableSpace = () => { // A function that gets available space in the room
    if(!room) return
    return `${room.players.length}/${room.max_capacity}`
  }
 
 return <div className="transition-all p-8 bg-white rounded-2xl drop-shadow-sharp-md flex flex-col gap-8 ">
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
          { (isOwner(myself))  ?
          <button onClick={()=>startGame(roomCode)} className="justify-center flex text-2xl border-4 border-black rounded-2xl p-3 font-bold hover:bg-gray-100 transition-all">Start</button>
          : ""
          }
        </div>
        <div className="flex flex-col gap-4 p-4 flex-1 rounded-2xl bg-gray-0 justify-center items-center">
          <div className="w-[10rem] h-[10rem] aspect-square bg-rickroll">
            {room ? <img src={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${getRoomLink()}`}/> : ""}
          </div>
          <p className="text-ms text-center">Scan QR code, copy link or enter code</p>
          <p className="text-2xl font-bold">{getRoomCode()}</p>
          <p className="text-xs">{getRoomLink()}</p>
        </div>
      </div>
    </div>


}

