import React from 'react';
import Popup from 'reactjs-popup';
import CloseIcon from '@mui/icons-material/Close';
import './errorDisplay.css';

export default function ErrorDisplay({errorMsg, setErrorMsg}) {
    if(errorMsg){
        const error = JSON.parse(errorMsg);
        return (
            <Popup open modal closeOnDocumentClick onClose={() => setErrorMsg("")}>
                <CloseIcon className="close-icon" onClick={() => setErrorMsg("")}/>
                <div className="modal" id="modal">
                    <h2>{error.cmd} failed!</h2>
                    <div className="content">
                        <h1>{error.data.message}</h1>
                    </div>
                </div>
            </Popup>
        );
    }
}