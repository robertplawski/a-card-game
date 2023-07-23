import { useEffect, useState } from "react";
import { BaseCard } from "../components/Card"
import {IconCircleOff} from "@tabler/icons-react";

export function Player(props){
  const {name = "name", deck = [] } = props;

  const parseDeck = () => 
    deck.map((card, index)=>
      (<BaseCard symbol={3} key={index} className="bg-green-500 min-w-[4rem] cursor-pointer hover:scale-[1.1] transition-all" />)
    
    )
  

  return (<>
      <div className="font-bold justify-center flex text-white text-lg text-shadow-sharp-sm">
        {name}
      </div>
      <div className="bg-slate-500 py-2 rounded-2xl drop-shadow-sharp-sm">
        <div className="p-2 max-h-[10rem] overflow-y-auto rounded-xl text-sm w-[100%] flex flex-row gap-4">
          {parseDeck()}
        </div>
      </div>
      </>)
}

export function Circle(){
  const createArray = (length) => Array.from({ length: length }, (_, index) => index + 1); 
  let players = [
    {name:"robert", deck: createArray(7)},
    {name:"debil", deck: createArray(7)}, 
    {name:"debil", deck: createArray(7)},
     {name:"debil", deck: createArray(7)},
      {name:"debil", deck: createArray(7)},
 
  ]
  players = players.reverse()

  const amountOfVertices = players.length
  const size = 250
  const [rotation, setRotation] = useState(0);
  const rotationSpeed = 60/1000;

  useEffect(()=>{
    setRotation(state=>state+rotationSpeed)
  }, [rotation])

  //const players = new Array(amountOfVertices)

  const calcAngles = (n) => 360/n
  const calcSize = (s) => {
    return (size/3)*-s+(size*3)
  };
  const radian = (degrees) => degrees * (Math.PI/180);

  const parsePlayers = (players) => {
    const result = []
    let index = 0;
    let lastPosition = {bottom: size/2, left:size/2, rotate: 0, width: size, height: 160}
    for(const player of players){
      let currentPosition = {...lastPosition} //{left: 0, top: 0, rotate: 0,}
      currentPosition.left -= Math.cos(radian(currentPosition.rotate));      
      currentPosition.bottom -=  Math.sin(radian(currentPosition.rotate));
      currentPosition.rotate += calcAngles(amountOfVertices)
      result.push(
      <div className="absolute flex justify-center items-center" style={{...currentPosition, width:0,height:0}}>
        <div    className="flex flex-col gap-2"
        style={{minWidth:calcSize(amountOfVertices*0.9), height:currentPosition.height, rotate: currentPosition.rotate+'deg', transform: `translate(${size/2+currentPosition.height*1}px, 0px) rotate(270deg)`}} 
      >
        <Player {...player}/>

      </div></div>)
      lastPosition=currentPosition;
      index++;
    }
    return <div style={{height: size, width:size}} className="bg-slate-500 p-8 justify-center items-center flex gap-4 flex-col rounded-2xl relative drop-shadow-sharp-md">
      <div className="flex absolute flex-col gap-4">
        <div className="flex-row flex justify-center items-center gap-4">
          <BaseCard symbol={6} className="bg-red-500 cursor-pointer"/>
          <BaseCard symbol={9} className="bg-red-500 cursor-pointer"/>
        </div>
        <div className="text-white text-shadow-sharp-md text-md font-bold">
          Robert's turn
        </div>
      </div>
      <div style={{transform: `rotate(${rotation+90}deg) translate(-125px, 125px)`}}>
        {result}
      </div>
    </div>
  }
  

  return <div className="flex p-8 w-screen h-screen bg-blue-400 justify-center items-center">
    {parsePlayers(players)}
    </div>

}