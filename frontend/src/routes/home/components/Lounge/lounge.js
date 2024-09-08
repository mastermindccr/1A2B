import React, { useState, useEffect } from "react";
import QueueDisplay from './queueDisplay';
import './lounge.css';

export default function Lounge({send, msg, setMatchId}) {
    const [isJoining, setIsJoining] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    // receive message from websocket server
    useEffect(() => {
        if(msg){
            if(msg.status === 'push') {
                if(msg.cmd === 'match_found') {
                    clearInterval(intervalId);
                    setIsJoining(false);
                    setSeconds(0);
                    setMatchId(msg.data.id);
                }
            }
            else if(msg.status === 'success') {
                if(msg.cmd === 'joinQueue') {
                    setIsJoining(true);
                    setIntervalId(setInterval(() => {
                        setSeconds((prev) => prev+1);
                    }, 1000));
                }
                if(msg.cmd === 'leaveQueue') {
                    clearInterval(intervalId);
                    setIsJoining(false);
                    setSeconds(0);
                }
            }
        }
    }, [JSON.stringify(msg)]);

    const joinQueue = () => {
        send('joinQueue');
    }

    return (
        <div>
            <div className='flex-box'>
                <QueueDisplay 
                    isJoining={isJoining}
                    seconds={seconds}
                    send={send}
                />
                <div className='lounge'>
                    <h1>Lounge</h1>
                    <p>Welcome to the home page!</p>
                    <button onClick={joinQueue}>Join queue</button>
                </div>
            </div>
        </div>
    )
}