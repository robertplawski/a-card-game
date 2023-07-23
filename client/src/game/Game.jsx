import { NetworkContext } from "./Network";
import { useEffect, useState, useContext } from "react";
import { PlayingCard, BaseCard } from "../components/Card"
import {IconCircleOff} from "@tabler/icons-react";
import { socket } from "../socket";
import { AnimatePresence } from "framer-motion";

export function Player(props){
  const { room, myself } = useContext(NetworkContext);
  const {name = "name", deck = [], isMe=false, turn=false} = props;

  const makeMove = (card) => {
    if(!turn) return;
    socket.emit("makeMove", {
      action: {type: 1, card},
      game: room,
      myself
    })
  }

  const parseDeck = () =>{
    if(isMe){
      return deck.map((card, index)=>
        (<PlayingCard 
          card={card}
          key={index}
          onClick={()=>makeMove(card)}
          className={"cursor-pointer hover:scale-[1.1] transition-all"}/>)
      )
    }else{
      return deck.map((card, index)=>
        (<PlayingCard 
          card={{color:5, symbol:0}} 
          key={index}/>)
      )
    }

  }

  return (<>
      <div className={`font-bold justify-center flex ${(turn) ? "text-white" : "text-neutral-600"} text-lg`}>
        {name}
        {(isMe) && " (you)"}
      </div>
      <div className={`bg-neutral-300 ${(turn) ? "" :"saturate-[0.4] brightness-[0.4]"} py-2 rounded-2xl drop-shadow-sharp-sm`}>
      <div className="p-4 min-h-[10rem] flex-wrap max-h-[10rem] h-[10rem] overflow-y-auto rounded-xl text-sm w-[100%] flex flex-row gap-4">
        <AnimatePresence>
          {parseDeck()}
        </AnimatePresence>
        </div>
      </div>
      </>)
}

function PlayerDecks(props){
  const {room, myself} = useContext(NetworkContext);
  const players = room.players;
  const {amountOfVertices = players.length, size = 250, tableOffset = size, rotation = 0} = props;
  
  const calcAngles = (n) => 360/n
  const calcSize = (s) => {
    return (size/3)*-s+(size*3)
  };
  const radian = (degrees) => degrees * (Math.PI/180);

  const result = []
  let lastPosition = {bottom: 0, left:0, rotate: players.indexOf(myself)*calcAngles(amountOfVertices), width: size, height: 160}

  for(const player of players.reverse()){
    let currentPosition = {...lastPosition}
    currentPosition.left -= Math.cos(radian(currentPosition.rotate));      
    currentPosition.bottom -=  Math.sin(radian(currentPosition.rotate));
    currentPosition.rotate += calcAngles(amountOfVertices)
    result.push(
    <div className="relative flex justify-center items-center" style={{...currentPosition, width:0,height:0}}>
      <div    className="flex flex-col gap-2"
      style={{minWidth:calcSize(amountOfVertices*0.95), height:currentPosition.height, rotate: currentPosition.rotate+'deg', transform: `translate(${tableOffset}px, 0px) rotate(270deg)`}} 
    >
      <Player key={players.indexOf(player)} turn={player.id==room.turn.player_id} isMe={myself==player} {...player}/>

    </div></div>)
    lastPosition=currentPosition;
  }

  return <div className="absolute flex justify-center items-center" style={{transform: `rotate(${rotation+90}deg)`}}>
    {result}
  </div>
}

function Table(){
  const {room, getPlayerById, myself} = useContext(NetworkContext); 
  const drawCard = () => {
    if(room.turn.player_id != myself.id) return;
    socket.emit("makeMove", {
      action: {type: 0},
      game: room,
      myself
    })
  }
  return <div className="flex justify-center items-center">
    <div className="bg-gray-500 p-4 gap-4 flex flex-col justify-center text-white items-center font-bold rounded-xl drop-shadow-sharp-sm">
      <div className="flex flex-row gap-4">
        <PlayingCard card={room.discardPile}/>
        <BaseCard onClick={()=>drawCard()} centerSymbol="draw" className="bg-neutral-800 cursor-pointer text-[0.6em]"/>
      </div>
      <p>{getPlayerById(room.turn.player_id).name}&apos;s turn</p>
    </div>
    <PlayerDecks/>
  </div>
}

export function Game(){
  return <Table/>
}

/*
export function Game(){
  const {myself, room, roomCode, gameStarted, showPrompt, showError, showAlert} = useContext(NetworkContext);
  
  const createArray = (length) => Array.from({ length: length }, (_, index) => index + 1); 
  let players = room.players;
  players = players.reverse()

  const amountOfVertices = players.length
  const size = 250;
  const tableOffset = size;
  const [rotation, setRotation] = useState(0);
  const rotationSpeed = 60/1000;

  //useEffect(()=>{
  //  setRotation(state=>state+rotationSpeed)
  //}, [rotation])

  //const players = new Array(amountOfVertices)



  const parsePlayers = (players) => {

    return <div style={{height: size, width:size}} className="bg-neutral-200 p-8 justify-center items-center flex gap-4 flex-col rounded-2xl relative drop-shadow-sharp-md">
      <div className="flex absolute flex-col gap-4">
        <div className="flex-row flex justify-center items-center gap-4">
          <BaseCard symbol={6} className="bg-red-500 cursor-pointer"/>
          <BaseCard symbol={9} className="bg-red-500 cursor-pointer"/>
        </div>
        <div className="text-black text-md font-bold">
          Robert's turn
        </div>
      </div>
      <div style={{transform: `rotate(${rotation+90}deg) translate(-125px, 125px)`}}>
        {result}
      </div>
    </div>
  }
  

  return 

}*/