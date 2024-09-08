import React, {useEffect} from "react";
import './queueDisplay.css';
import CloseIcon from '@mui/icons-material/Close';

export default function QueueDisplay({isJoining, seconds, send}) {
    const zeroPad = (num, places) => String(num).padStart(places, '0');
    const leaveQueue = () => {
        send('leaveQueue');
    }

    return (
        <div className={'queue-displayer'+(isJoining?' move-down':'')}>
            <CloseIcon className="close-icon" onClick={leaveQueue}/>
            <h4>Waiting for an opponent...</h4>
            <p>{zeroPad(Math.floor(seconds/60), 2)}:{zeroPad(seconds%60, 2)}</p>
        </div>
    );
}