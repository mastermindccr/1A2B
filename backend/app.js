const express = require('express');
const cookieParser = require('cookie-parser');
const Pool = require('./models/connectionPool.js');
const c = require('./utils/const.js');
const cmd = require('./commands/cmd.js');
const server = require('http').createServer();
const webSocket = require('ws');
const wss = new webSocket.Server({ server: server }); // create a websocket server based on the http server

const pool = new Pool();
const app = express();
const port = 5000;

// use cookie parser to distribute and receive cookies
app.use(cookieParser());

// middleware to handle new and existing connections
app.use((req, res, next) => {
	// receive new connection
  	if (!req.cookies['sid'] || !pool.isHealthy(req.cookies['sid'])) {
		let sid = Math.random().toString(36).slice(2)
		req.sid = sid;
		res.clearCookie('sid');
    	res.cookie('sid', sid);
		pool.joinPool(req.sid);
	}
	next();
});

app.get('/', (req, res) => {
	res.end();
});

server.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
	// pool matching mechanism
	setInterval(() => {
		pool.makeMatch();
	}, 3000);
	// pool clearing mechanism
	setInterval(() => {
		pool.clearSessions();
	}, 60000);
});

// redirect all http requests to app middleware
server.on('request', app);

wss.on('connection', (ws) => {
	// all received messages follow the format:
	// {
	//     sid: <session id>,
	//     cmd: <cmd>,
	//     data: <data>
	// }
	// all sent messages follow the format:
	// {
	//     status: <status>,
	//     data: <data>
	// }
	ws.on('message', (data) => {
		try {
			const msg = JSON.parse(data);
			console.log(msg);
			let player = pool.getPlayer(msg.sid);
			if(!player) { // expired session or invalid session id
				ws.terminate();
				return;
			}
			if(msg.cmd == 'connect') {
				cmd.connect(ws, player);
			}
			else if(msg.cmd == 'disconnect') {
				cmd.disconnect(ws, pool, player);
			}
			else if(msg.cmd == 'joinQueue') {
				cmd.joinQueue(ws, pool, msg.sid);
			}
			else if(msg.cmd == 'leaveQueue') {
				cmd.leaveQueue(ws, pool, msg.sid);
			}
			else if(msg.cmd == 'input_answer') {
				cmd.inputAnswer(ws, pool, player, msg.data);
			}
			else if(msg.cmd == 'make_guess') {
				cmd.makeGuess(ws, pool, player, msg.data);
			}
			// TODO: add more commands
			
			player.lifetime = c.MAXLIFETIME;
		}
		catch(e) {
			console.error(e);
		}
	});
});