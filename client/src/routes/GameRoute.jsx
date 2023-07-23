import { useContext, useEffect } from "react";
import { NetworkContext } from "../game/Network";
import { Room } from "../game/Room.jsx"
import { Game } from "../game/Game.jsx"

export function RoomRoute(){
  const {gameStarted} = useContext(NetworkContext);
  
  return (!gameStarted()) ? <Room/> : <Game/>
}