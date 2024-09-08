const connect = require('./connect');
const disconnect = require('./disconnect');
const joinQueue = require('./joinQueue');
const leaveQueue = require('./leaveQueue');
const inputAnswer = require('./inputAnswer');
const makeGuess = require('./makeGuess');

module.exports = {
    'connect': connect,
    'disconnect': disconnect,
    'joinQueue': joinQueue,
    'leaveQueue': leaveQueue,
    'inputAnswer': inputAnswer,
    'makeGuess': makeGuess
}