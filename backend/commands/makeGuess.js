// {
//     data: {
//         mid: <mid>,
//         guess: <guess>
//     }
// }
const c = require('../utils/const');
const delay = require('../utils/delay');
module.exports = function makeGuess(ws, pool, player, data) {
    (async () => {
        try {
            if(player.mid != data.mid) {
                ws.send(JSON.stringify({
                    status: 'error',
                    cmd: 'make_guess',
                    data: {
                        message: 'invalid match id'
                    }
                }));
                return;
            }
            let match = pool.matches[player.mid];
            match.makeGuess(player, data.guess);
    
            // send success response
            ws.send(JSON.stringify({
                status: 'success',
                cmd: 'make_guess',
                data: {}
            }));

            match.endTurn();
            
            await delay(c.DELAYTIME * 1000);

            match.updateState();

            await delay(c.DELAYTIME * 1000);
    
            // check logic for game over
            if(match.board[match.turn^1].answer == data.guess) {
                match.gameOver();
            }
            else{
                // if player's guess is incorrect
                match.startTurn();
            }
        }
        catch(e) {
            console.error(e);
            ws.send(JSON.stringify({
                status: 'error',
                cmd: 'make_guess',
                data: {
                    message: e
                }
            }));
        }
    })();
}