import React from 'react'
import './button.css'

export default function Button({value, setInput, input, send, matchId, status}) {
    const handleClick = () => {
        if(!isNaN(value)) {
            if(input.length >= 4) {
                return;
            }
            setInput(prev => prev + value);
        }
        else if(value === "clear") {
            setInput("");
        }
        else{
            if(status === 'input_answer') {
                send('input_answer', {
                    'mid': matchId,
                    'answer': input
                });
                setInput("");
            }
            else if(status === 'start_turn') {
                send('make_guess', {
                    'mid': matchId,
                    'guess': input
                });
                setInput("");
            }
        }
    };

    return (
        <button className="button" onClick={handleClick} disabled={status!=="start_turn" && status !== "input_answer"}>{value}</button>
    )
}