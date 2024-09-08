import React from 'react';
import './statusBar.css';

export default function StatusBar({status, input}) {
    const mapping = {
        'input_answer': 'Please enter your answer',
        'waiting': 'Waiting for opponent...',
        'start_turn': 'Please enter your guess',
        'game_over': 'Game Over'
    }
    return (
        <div className="status-bar">
            <div><strong>{mapping[status]}</strong></div>
            <div><p>{status==='input_answer' || status==='start_turn' || status==='game_over' ?input:''}</p></div>
        </div>
    )
}