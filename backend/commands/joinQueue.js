module.exports = function joinQueue(ws, pool, id){
    try {
        pool.joinQueue(id);
        ws.send(JSON.stringify({
            status: 'success',
            cmd: 'joinQueue',
            data: {}
        }));
    }
    catch(e) {
        ws.send(JSON.stringify({
            status: 'error',
            cmd: 'joinQueue',
            data: {
                message: e
            }
        }));
    }
}