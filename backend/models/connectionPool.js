const Player = require('./player.js');
const Match = require('./match.js');
const c = require('../utils/const.js');

module.exports = class Pool {
    constructor() {
        this.pool = [];
        this.waiting = [];
        this.matches = {};
    }

    isHealthy(id){
        for (let i = 0; i < this.pool.length; i++) {
            // if the player is already in the pool, reset the lifetime
            if(this.pool[i].id == id) {
                this.pool[i].lifetime = c.MAXLIFETIME;
                return true;
            }
        }
        // the session is already expired
        return false;
    }

    joinPool(id) {
        this.pool.push(new Player(id));
    }

    leavePool(id) {
        // send disconnect message to the client
        let player = this.pool.find((p) => p.id == id);
        if(player && player.ws){
            player.ws.send(JSON.stringify({
                status: 'push',
                cmd: 'timeout',
                data: {}
            }));
            player.ws.close();
        }
        
        this.pool = this.pool.filter((p) => {
            if(p.id == id) {
                if(p.status == c.status.WAITING) {
                    this.waiting = this.waiting.filter((i) => i.id != id);
                }
                else if(p.status == c.status.PLAYING) {
                    // remove the player from the match
                    let match = this.matches[p.match];
                    if(match) {
                        if(match.players[0].id == id) {
                            match.players[1].ws.send(JSON.stringify({
                                status: 'push',
                                cmd: 'game_over',
                                data: {
                                    message: 'Opponent has disconnected. You win!'
                                }
                            }));
                        }
                        else if(match.players[1].id == id) {
                            match.players[0].ws.send(JSON.stringify({
                                status: 'push',
                                cmd: 'game_over',
                                data: {
                                    message: 'Opponent has disconnected. You win!'
                                }
                            }));
                        }
                    }
                }
                return false;
            }
            return true;
        });
    }

    getPlayer(arg){
        return this.pool.find((p) => p.id == arg) || this.pool.find((p) => p.ws == arg);
    }

    joinQueue(id) {
        let player = this.pool.find((p) => p.id == id);
        if(player.status == c.status.IDLE) {
            player.status = c.status.WAITING;
            this.waiting.push(id);
        }
        else if(player.status == c.status.WAITING) {
            throw('You are already in the queue!');
        }
        else if(player.status == c.status.PLAYING) {
            throw('You are already in a match!');
        }
    }

    leaveQueue(id) {
        let player = this.pool.find((p) => p.id == id);
        if(player.status == c.status.WAITING) {
            player.status = c.status.IDLE;
            this.waiting = this.waiting.filter((i) => i != id);
        }
        else{
            throw('You are not in the queue!');
        }
    }

    makeMatch() {
        if (this.waiting.length >= 2) {
            // pairing opponents
            const shuffled = this.waiting.sort(() => 0.5 - Math.random());
            let [pid1, pid2] = shuffled.slice(0, 2);
            // remove paired players from the waiting list
            this.waiting = this.waiting.filter((id) => id != pid1 && id != pid2);
            // create a new match
            let mid = Math.random().toString(36).slice(2);
            this.matches[mid] = new Match(this.getPlayer(pid1), this.getPlayer(pid2));
            
            for(let i = 0;i<this.pool.length;i++) {
                if(this.pool[i].id == pid1) {
                    this.pool[i].status = c.status.PLAYING;
                    this.pool[i].lifetime = c.MAXLIFETIME;
                    this.pool[i].mid = mid;

                    this.pool[i].ws.send(JSON.stringify({
                        status: 'push',
                        cmd: 'match_found',
                        data: {
                            id: mid
                        }
                    }));
                    console.log(`Match found is sent to ${this.pool[i].id}`);
                }
                else if(this.pool[i].id == pid2) {
                    this.pool[i].status = c.status.PLAYING;
                    this.pool[i].lifetime = c.MAXLIFETIME;
                    this.pool[i].mid = mid;
                    
                    this.pool[i].ws.send(JSON.stringify({
                        status: 'push',
                        cmd: 'match_found',
                        data: {
                            id: mid
                        }
                    }));
                    console.log(`Match found is sent to ${this.pool[i].id}`);
                }
            }
            this.matches[mid].start();
        }
    }

    clearSessions() {
        // clear expired sessions
        this.pool = this.pool.filter((p) => {
            if(p.lifetime <= 0) {
                this.leavePool(p.id);
                return false;
            }
            return true;
        });
        // decrease lifetime of all sessions
        this.pool.forEach((p) => p.lifetime--);
    }
}