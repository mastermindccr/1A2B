import React from 'react';
import Button from './button';
import StatusBar from './statusBar';
import './gameboard.css';

export default function Gameboard({setMatchId, matchId, input, setInput,
                                    round, send, status, answer, time}) {

    // shuffle with Fisher-Yates algorithm
    const shuffle = (array) => {
        let currentIndex = array.length;
      
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
      
          // Pick a remaining element...
          let randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
    }

    const random = () => {
        let array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        shuffle(array);
        array = array.slice(0, 4);
        setInput(array.join(''));
    }
    return (
        <div className="gameboard">
            <div className="top-bar">
                <div className="tile" style={{width: '150px'}}>
                    {round?`Round ${round}`:null}
                </div>
                <div className="tile answer-block">
                    <div>
                        <p>Your answer: </p>
                    </div>
                    <div>
                        <p>{answer}</p>
                    </div>
                </div>
                <div className="tile clock-background" style={{width: '120px', fontSize: '20px', backgroundImage: 'url(/clock.png)'}}>
                    <p>{time!==0?time:''}</p>
                </div>
            </div>
            <div className="button-board">
                <div className="button-row">
                    <div className="tile">
                        <Button value="1" setInput={setInput} input={input} status={status}/>
                    </div>
                    <div className="tile">
                        <Button value="2" setInput={setInput} input={input} status={status}/>
                    </div>
                    <div className="tile">
                        <Button value="3" setInput={setInput} input={input} status={status}/>
                    </div>
                </div>
                <div className="button-row">
                    <div className="tile">
                        <Button value="4" setInput={setInput} input={input} status={status}/>
                    </div>
                    <div className="tile">
                        <Button value="5" setInput={setInput} input={input} status={status}/>
                    </div>
                    <div className="tile">
                        <Button value="6" setInput={setInput} input={input} status={status}/>
                    </div>
                </div>
                <div className="button-row">
                    <div className="tile">
                        <Button value="7" setInput={setInput} input={input} status={status}/>
                    </div>
                    <div className="tile">
                        <Button value="8" setInput={setInput} input={input} status={status}/>
                    </div>
                    <div className="tile">
                        <Button value="9" setInput={setInput} input={input} status={status}/>
                    </div>                  
                </div>
                <div className="button-row">
                    <div className="tile">
                        <Button value="clear" setInput={setInput} status={status}/>
                    </div>
                    <div className="tile">
                        <Button value="0" setInput={setInput} input={input} status={status}/>
                    </div>
                    <div className="tile">
                        <Button value="enter" send={send} setInput={setInput} input={input} matchId={matchId} status={status}/>
                    </div>                   
                </div>
            </div>
            <StatusBar status={status} input={input}/>
            {status==='input_answer'?<button onClick={() => random()}>Select a random number</button>:null}
            {status==='game_over'?<button onClick={() => setMatchId("")}>Back to lobby</button>:null}
        </div>
    );
}