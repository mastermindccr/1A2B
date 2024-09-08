module.exports = function leaveQueue(ws, pool, id) {
    try {
        pool.leaveQueue(id);
        ws.send(JSON.stringify({
            status: 'success',
            cmd: 'leaveQueue',
            data: {}
        }));
    }
    catch(e) {
        ws.send(JSON.stringify({
            status: 'error',
            cmd: 'leaveQueue',
            data: {
                message: e.message
            }
        }));
    }
}