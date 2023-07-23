import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Index } from "./routes/Index.jsx";
import { RoomRoute } from "./routes/GameRoute.jsx";
import { NotFound } from "./routes/NotFound.jsx";
import { Host } from "./routes/Host.jsx";
import { Circle } from './routes/Circle.jsx';
import './index.css'
import {ModalContextProvider} from './components/Modal.jsx'
import { NetworkContextProvider } from './game/Network.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
  <ModalContextProvider>  
    <BrowserRouter>
      <Routes>
        <Route index element={<Index/>}></Route>      
        <Route path="/room/:roomCode" element={
          <NetworkContextProvider>
            <RoomRoute/>
          </NetworkContextProvider>
        }></Route>
        <Route path="/circle" element={<Circle/>}></Route>
        <Route path="*" element={<NotFound/>}></Route>
      </Routes>
    </BrowserRouter>
  </ModalContextProvider>
)
