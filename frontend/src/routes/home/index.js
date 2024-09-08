import React, { useState } from 'react';
import Lounge from './components/Lounge/lounge';
import Game from './components/Game/game';
import './index.css'

export default function Home({send, msg}) {
    const [matchId, setMatchId] = useState("");
    if(!matchId){
        return <Lounge send={send} msg={msg} setMatchId={setMatchId}/>;
    }
    else{
        return <Game setMatchId={setMatchId} matchId={matchId} send={send} msg={msg}/>
    }
}