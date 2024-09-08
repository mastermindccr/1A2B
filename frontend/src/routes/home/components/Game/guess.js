import React from 'react';
import './guess.css';

export default function Guess({title, history}) {
    return (
        <div className="guess">
            <h1>{title}</h1>
            <div className="answer-board">
                {
                    history.map((g, i) => {
                        return <div key={i} className="answer-row">
                            <div className="tile">
                                {g.guess}
                            </div>
                            <div className="tile">
                                {g.result}
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    )
}