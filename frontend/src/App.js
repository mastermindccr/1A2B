import React, {useState, useEffect} from 'react';
import useWebSocket from 'react-use-websocket';
import { Routes, Route } from 'react-router-dom';

import Home from './routes/home';
import ErrorDisplay from './components/errorDisplay';
import request from './utilities/request';
import './App.css';

export default function App(){
	// initialize websocket connection
	const [errorMsg, setErrorMsg] = useState("");
	const [msg, setMsg] = useState("");
	const {sendJsonMessage, lastJsonMessage} = useWebSocket(process.env.REACT_APP_ws_server);

	const send = (cmd, data) => {
		const sid = document.cookie.match(/sid=(.*)/)[1];
		sendJsonMessage({
			'sid': sid,
			'cmd': cmd,
			'data': data || {}
		});
	}

	// setup initial connection
	useEffect(() => {
        (async () => {
			// establish connection to the backend server to retrieve session id
            const [status, response] = await request('/');
			if(status === 200){
				// connect to websocket server
				send('connect');
				window.addEventListener('beforeunload', () => {
					send('disconnect');
				});
			}
			else {
				setErrorMsg(response);
			}
        })();
    }, []);

	// listen to websocket messages
	useEffect(() => {
		if(lastJsonMessage) {
			if(lastJsonMessage.status === 'error') {
				setErrorMsg(JSON.stringify(lastJsonMessage));
			}
			else {
				setMsg(JSON.stringify(lastJsonMessage));
			}
		}
		
	}, [lastJsonMessage]);

	return (
		<div>
			<ErrorDisplay errorMsg={errorMsg} setErrorMsg={setErrorMsg}/>
			<div className={(errorMsg?"background-filter ":"")+"mainPage"}>
				<Routes>
					<Route path="/" element={<Home send={send} msg={msg?JSON.parse(msg):{}}/>} />
				</Routes>
			</div>
		</div>
	);  
}