const c = require('../utils/const.js');
const delay = require('../utils/delay.js');

module.exports = class Match {
    constructor(p1, p2) {
        this.players = [p1, p2];
        this.times = [c.MAXTHINKINGTIME, c.MAXTHINKINGTIME];
        this.interval = null;
        this.turn = + (Math.random() < 0.5); // store as int
        this.round = 1;
        this.board = [
            {
                answer: "",
                guess: []
            },
            {
                answer: "",
                guess: []
            }
        ];
    }
    // start the match
    start() {
        (async() => {
            await delay(c.DELAYTIME * 1000);
            // send message to both players to input answer
            this.players.map(player => {
                player.ws.send(JSON.stringify({
                    status: 'push',
                    cmd: 'input_answer',
                    data: {}
                }));
            })

            while(this.board[0].answer == "" || this.board[1].answer == "") {
                await delay(c.DELAYTIME * 1000);
            }

            this.updateState();

            // make sure the state is updated before starting the game
            await delay(c.DELAYTIME * 1000);

            // send initial message to the first player
            this.startTurn();
        })();
    }
    
    // handle player's input answer
    inputAnswer(player, answer) {
        let pid = this.players.indexOf(player);
        if(this.board[pid].answer) {
            throw('you have already input the answer!');
        }
        else {
            // if answer is not a non-repeated 4-digit number
            if(answer.length != 4 || new Set(answer).size != 4) {
                throw('invalid answer! Please input a non-repeated 4-digit number');
            }
            else{
                this.board[pid].answer = answer;
            }
        }
    }

    // handle player's decision
    makeGuess(player, guess) {
        if(player != this.players[this.turn]) {
            throw("It's not your turn!");
        }
        else{
            if(guess.length != 4 || new Set(guess).size != 4) {
                throw('invalid guess! Please input a non-repeated 4-digit number');
            }
            else{
                this.board[this.turn].guess.push({guess: guess, result: this.checkAnswer(guess, this.board[this.turn^1].answer)});
            }
        }
    }

    checkAnswer(guess, answer) {
        let a = 0, b = 0;
        for(let i = 0;i<4;i++) {
            if(guess[i] == answer[i]) {
                a++;
            }
            else if(answer.includes(guess[i])) {
                b++;
            }
        }
        return `${a}A${b}B`;
    }

    updateState() {
        this.players.map((player, index) => {
            player.ws.send(JSON.stringify({
                status: 'push',
                cmd: 'game_state',
                data: {
                    round: Math.floor((this.round+1)/2),
                    history: [
                        this.board[index].guess,
                        this.board[index^1].guess
                    ]
                }
            }));
        })
    }

    startTurn() {
        this.round++;
        this.turn ^= 1;
        this.times[this.turn] = c.MAXTHINKINGTIME;
        this.players[this.turn].ws.send(JSON.stringify({
            status: 'push',
            cmd: 'start_turn',
            data: {
                time: this.times[this.turn]
            }
        }));
        this.interval = setInterval(() => {
            this.times[this.turn]--;
            if(this.times[this.turn] == 0) {
                this.endTurn();
                this.updateState();
                this.startTurn();
            }
        }, c.DELAYINTERVAL);
    }

    endTurn() {
        clearInterval(this.interval);
        this.interval = null;
        this.players[this.turn].ws.send(JSON.stringify({
            status: 'push',
            cmd: 'end_turn',
            data: {}
        }));
    }

    gameOver() {
        this.players[this.turn].ws.send(JSON.stringify({
            status: 'push',
            cmd: 'game_over',
            data: {
                message: 'You win!'
            }
        }));
        this.players[this.turn^1].ws.send(JSON.stringify({
            status: 'push',
            cmd: 'game_over',
            data: {
                message: 'You lose!'
            }
        }));
        this.players.map(player => {
            player.status = c.status.IDLE;
            player.mid = "";
        })
    }
}