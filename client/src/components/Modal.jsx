import React, { useState, useRef, forwardRef, createContext, useContext } from "react";
import { SubtitleText } from "../components/Text.jsx";
import { BaseButton } from "../components/Button.jsx"
import { IconX, IconCircle, IconAlertTriangle, IconQuestionMark } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion'

export function BaseModal(props){
  const { 
    title = "title", 
    children = "children",
    icon = <IconCircle size="2em"/>,
    closeCallback = () => {}, 
    canClose = true
  } = props;
  

  const closeButtonClicked = () => {
    closeCallback()
  }

  return <motion.div
          initial={{'--tw-backdrop-blur': 'blur(0px)'}}
          animate={{'--tw-backdrop-blur': 'blur(14px)'}}
          exit={{'--tw-backdrop-blur': 'blur(0px)'}}
          className="absolute top-0 left-0 w-screen h-screen pointer-events-none p-8 flex justify-center items-center z-50 backdrop-blur-sm"
          >
          <motion.div
            initial={{'opacity': 0}}
            animate={{'opacity': 0.4}}
            exit={{'opacity': 0}}
            className="bg-black h-screen w-screen absolute "
          />
          <motion.div
            initial={{'scale': 0}}
            animate={{'scale': 1}}
            exit={{'scale': 0}}
            className="p-6 pointer-events-auto flex-wrap-reverse justify-center items-center bg-white z-50 rounded-xl text-3xl flex gap-8 flex-row drop-shadow-sharp-sm"
          >
            <div className="flex justify-center items-center">
              {icon}
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-8 justify-between">
                <div className="font-bold flex items-center">
                {title}
                </div>
                <div className="flex items-center">
                  {(canClose) ? 
                  <button onClick={()=>closeButtonClicked()} className="border-4 p-[0.25rem] border-black rounded-full">
                    <IconX size="0.5em"/>
                  </button>
                  : ""}
                </div>
              </div>
              <div className="text-xl flex gap-4 max-w-sm">
                {children}
              </div>
            </div>
          </motion.div>
  </motion.div>
}

export const ModalContext = createContext()

export function ModalContextProvider({children}){
  const [modal, setModal] = useState();

  const openModal = (modalProps) => {
    setModal(modalProps)
  };
  const closeModal = () => setModal(undefined);

  return  <ModalContext.Provider value={{openModal,modal,modal, closeModal}}>
    {children}
    <AnimatePresence>
      { (modal) && (
          (modal.type === "alert") ? <AlertModal {...modal}/>   
          : (modal.type === "prompt") ? <PromptModal {...modal}/> 
          : <BaseModal {...modal}/>
        )
    }
    </AnimatePresence>
   
  </ModalContext.Provider>

}

export function AlertModal(props){
  return <BaseModal icon={<IconAlertTriangle size="2em"/>} {...props}/>
}
export function PromptModal(props){
  const { 
    submitCallback = () => {}, 
    placeholder,
    maxlength,
    type = "text",
    closeCallback 
  } = props;

 const [ input, setInput ] = useState();

  const submitInput = () => {
    if(!input) return
    closeCallback()
    setTimeout(()=>submitCallback(input), 300)

  }

  return <BaseModal icon={<IconQuestionMark size="2em"/>} {...props}>
      <input type={type} placeholder={placeholder} maxLength={maxlength} onChange={(e)=>setInput(e.target.value)} className="p-2 border-4 border-black rounded-xl min-w-[0px] flex-1"/>
      <button onClick={()=>submitInput()} className="p-2 border-4 border-black rounded-xl font-bold">Confirm</button>
  </BaseModal>
}

/*
export function PromptModal(props){
  /**/
 //const modal = useContext(ModalContext)
  /*const [ visible, setVisible ] =useState(true);
 */
/*
  */

  //return }

/*
export function AlertModal(props){
  const [visible, setVisible] = useState(true);
  const { title, content, close, canClose = true} = props;
  const closeButton = () => {
    setVisible(false);
    setTimeout(()=>close(),300)
  }
  return <AnimatePresence>
  {(visible) ? <motion.div 
    initial={{'--tw-bg-opacity': 0}}
    animate={{'--tw-bg-opacity': 0.3}}
    exit={{'--tw-bg-opacity': 0}}
    className="absolute flex justify-center items-center text-white top-0 left-0 w-screen h-screen bg-black backdrop-blur-sm"
  >
    <motion.div 
      className="bg-white min-w-[28rem] p-8 rounded-xl drop-shadow-sharp-sm flex flex-col gap-4"
      initial={{scale: 0}}
      animate={{scale: 1}}
      exit={{scale: 0}}
    >
      <div className="text-black font-bold text-3xl flex justify-between items-center">
        {title}
        {(canClose) ? 
          <div onClick={closeButton} className="cursor-pointer p-1 rounded-full border-2 border-black">
              <IconX size="0.5em"/>
          </div>
          : ""}
      </div>
      <div className="flex gap-4">
        <p className="text-black text-xl">{content}</p>  
      </div>
    </motion.div>
  </motion.div> : ""}
  </AnimatePresence>
}

export function PromptModal(props){
  const [state, setState] = useState()
  const [visible, setVisible] = useState(true)
  const { content, callback, maxlength, minlength, placeholder } = props;
  const buttonClick = () => {
    if(visible || !state) return
    callback(state)
    setVisible(false)
  }
  return  <AnimatePresence>
    {(visible) ? <motion.div 
    initial={{'--tw-bg-opacity': 0}}
    animate={{'--tw-bg-opacity': 0.3}}
    exit={{'--tw-bg-opacity': 0}}
    className="absolute z-50 flex justify-center items-center text-white top-0 left-0 w-screen h-screen bg-black backdrop-blur-sm bg-opacity-30"
  >
    <motion.div 
      className="bg-white min-w-[24rem] p-8 rounded-xl drop-shadow-sharp-sm flex flex-col gap-8"
      initial={{scale: 0}}
      animate={{scale: 1}}
      exit={{scale: 0}}
    >
      <p className="text-black font-bold text-3xl">{content}</p>
      <div className="flex gap-4">
        <input placeholder={placeholder} maxLength={maxlength} minLength={minlength} onChange={e=>setState(e.target.value)} className="flex-1 text-black p-2 rounded-xl border-2 border-black"/>
        <button onClick={buttonClick} className="bg-white hover:bg-gray-100 transition-all p-2 border-2 border-black rounded-xl text-black font-bold">Confirm</button>
      </div>
    </motion.div>
  </motion.div> : ""}
  </AnimatePresence>
}
*/
