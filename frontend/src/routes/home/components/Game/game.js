import React, { useState, useEffect } from "react";
import Gameboard from "./gameboard";
import Guess from "./guess";
import './game.css';

export default function Game({matchId, setMatchId, send, msg}) {
    const [status, setStatus] = useState('');
    const [time, setTime] = useState(0);
    const [itv, setItv] = useState(null); // interval to count time
    const [answer, setAnswer] = useState('');
    const [round, setRound] = useState(0);
    const [input, setInput] = useState('');
    const [guess, setGuess] = useState([]);
    const [opponentGuess, setOpponentGuess] = useState([]);

    // handle websocket messages
    useEffect(() => {
        if(msg){
            if(msg.status === 'push') {
                if(msg.cmd === 'input_answer') {
                    setStatus("input_answer");
                }
                else if(msg.cmd === 'game_state') {
                    setRound(msg.data.round);
                    setGuess(msg.data.history[0]);
                    setOpponentGuess(msg.data.history[1]);
                }
                else if(msg.cmd === 'start_turn') {
                    setStatus("start_turn");
                    setTime(msg.data.time);
                    if(itv === null) {
                        setItv(setInterval(() => {
                            setTime((prev) => prev-1);
                        }, 800));
                    }
                }
                else if(msg.cmd === 'end_turn') {
                    setStatus("waiting");
                    clearInterval(itv);
                    setItv(null);
                    setTime(0);
                }
                else if(msg.cmd === 'game_over') {
                    setStatus("game_over");
                    clearInterval(itv);
                    setItv(null);
                    setTime(0);
                    setInput(msg.data.message);
                }
            }
            else if(msg.status === 'success') {
                if(msg.cmd === 'input_answer') {
                    setStatus("waiting");
                    setAnswer(msg.data.answer);
                }
                else if(msg.cmd === 'make_guess') {
                    setStatus("waiting");
                    clearInterval(itv);
                    setItv(null);
                    setTime(0);
                }
            }
        }
    }, [JSON.stringify(msg)]);

    return <div className="horizontal-align-children">
        <Guess title="Your Guess" history={guess}/>
        <Gameboard 
            setMatchId={setMatchId} matchId={matchId} 
            setInput={setInput} input={input} 
            round={round} send={send} 
            status={status} answer={answer}
            time={time}
        />
        <Guess title="Opponent's Guess" history={opponentGuess}/>
    </div>
}