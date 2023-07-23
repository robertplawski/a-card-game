import { useState, useEffect, useContext } from "react";
import { LinkButton, BaseButton} from "../components/Button"
import { TitleText } from "../components/Text"
import { BaseCard } from "../components/Card";
import { ModalContext, ModalContextProvider } from "../components/Modal"
import { Host } from "./Host";

export function Index(){
  const [showHost, setShowHost] = useState(false);
  const {openModal, closeModal} = useContext(ModalContext);
  const [roomCode, setRoomCode] = useState();
  const [randomSymbol, setRandomSymbol] = useState();

  useEffect(()=>setRandomSymbol(Math.floor(Math.random()*9)+1), [])

  useEffect(()=>{
    if(!roomCode) return
    location.pathname = `room/${roomCode}`
  },[roomCode])

  return <div className="flex p-8 justify-center items-center flex-col gap-32 bg-blue-400 h-screen">
      <BaseCard className="bg-blue-600 absolute w-20 scale-[5]" symbol={randomSymbol}/>
      <TitleText>NO!</TitleText>
        <div className="flex justify-center items-center flex-col gap-4 z-10 top-[3.5rem] relative">
          <BaseButton onClick={()=>setShowHost(true)}>Host game</BaseButton>
          <BaseButton onClick={()=>openModal({maxlength:5, placeholder:"00000",title: "Enter game code", type:"prompt", closeCallback:closeModal, submitCallback:(val)=>setRoomCode(val)})}>Join game</BaseButton>
      </div>

      <div className="fixed bottom-2 left-2 text-white text-xs">
        <b>No copyright infringement intented</b><br/>
        This is a fan game created by a teenager,<br/>
        please don't send me a cease & desist.<br/>
      </div>
         {(showHost) ? <Host/> : ""}

  </div>
}
//<PromptModal type="number" visible={showJoin} canClose={false} placeholder="00000" min={10000} max={99999} title="Enter room code" submitCallback={(val)=>setRoomCode(val)}/>
 
