const c = require('../utils/const.js');

module.exports = function disconnect(ws, pool, player) {
    try {
        // if player is in queue, remove from queue
        if(player.status == c.status.WAITING) {
            pool.leaveQueue(player.id);
        }
        else if(player.status == c.status.PLAYING) {
            // TODO: send signal to opponent
            let match = pool.matches[player.mid];
            clearInterval(match.interval)
            match.interval = null;
            let opponent = match.players[0].id == player.id ? match.players[1] : match.players[0];
            opponent.mid = "";
            opponent.status = c.status.IDLE;
            opponent.ws.send(JSON.stringify({
                status: 'push',
                cmd: 'game_over',
                data: {
                    message: 'Opponent has disconnected'
                }
            }));
        }
        player.ws = null;
        player.status = c.status.IDLE;
        ws.close();
    }
    catch(e) {
        console.error(e);
        ws.send(JSON.stringify({
            status: 'error',
            cmd: 'disconnect',
            data: {
                message: e
            }
        }));
    }
}