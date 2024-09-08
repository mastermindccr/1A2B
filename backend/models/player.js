const c = require('../utils/const.js');

module.exports = class Player {
    constructor(id) {
        this.id = id;
        this.ws = null;
        this.lifetime = c.MAXLIFETIME;
        this.status = c.status.IDLE;
        this.mid = ""; // match id
    }
}