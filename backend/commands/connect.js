module.exports = function connect(ws, player) {
    if(player.ws) {
        if(player.ws != ws) {
            ws.send(JSON.stringify({
                status: 'error',
                cmd: 'connect',
                data: {
                    message: 'you are already connected!'
                }
            }));
        }
    }
    else{
        player.ws = ws;
        ws.send(JSON.stringify({
            status: 'success',
            cmd: 'connect',
            data: {}
        }))
    }
};