// {
//     data: {
//         mid: <mid>,
//         answer: <answer>
//     }
// }

module.exports = function inputAnswer(ws, pool, player, data) {
    try {
        if(player.mid != data.mid) {
            ws.send(JSON.stringify({
                status: 'error',
                cmd: 'input_answer',
                data: {
                    message: 'invalid match id'
                }
            }));
            return;
        }
        let match = pool.matches[player.mid];
        match.inputAnswer(player, data.answer);

        // send success response
        ws.send(JSON.stringify({
            status: 'success',
            cmd: 'input_answer',
            data: {
                answer: data.answer
            }
        }));
    }
    catch(e) {
        console.error(e);
        ws.send(JSON.stringify({
            status: 'error',
            cmd: 'input_answer',
            data: {
                message: e
            }
        }));
    }
}