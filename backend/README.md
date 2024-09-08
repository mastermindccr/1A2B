# How to run this backend server?
1. `npm i`
2. `npm start`

## Websocket message format

### Client to Server
- All messages received from client to server follow the JSON format:
```javascript
{
    sid: <sessionId>,
    cmd: <cmd>,
    data: {
        ...
    }
}
```

### Server to Client

- All messages sent from server to client follow the JSON format:
```javascript
{
    status: <status>,
    cmd: <cmd>,
    data: {
        ...
    }
}
```
- The `status` field should be one of the following values:
    - `push`: The server is pushing data to the client.
    - `success`: The client's request was successful.
    - `error`: The client's request was unsuccessful.

#### Push message
- All the push messages sent from server to client follow the JSON format:
```javascript
{
    status: "push",
    cmd: <cmd>,
    data: {
        ...
    }
}
```

##### Game related push messages

###### Ask a player to input his answer:
```javascript
{
    status: "push",
    cmd: "input_answer",
    data: {}
}
```
###### Push current game state to the player:
```javascript
{
    status: "push",
    cmd: "game_state",
    data: {
        round: <round>,
        history: [
            <playerGuesses>,
            <opponentGuesses>
        ]
    }
}
```
- Both `PlayerGuesses` and `opponentGuesses` are arrays of objects with the following format:
```javascript
{
    guess: <str>,
    result: <str>
}
```

###### Tell a player that this is his turn:
```javascript
{
    status: "push",
    cmd: "start_turn",
    data: {
        time: <time>
    }
}
```

###### Tell a player that his turn is over:
```javascript
{
    status: "push",
    cmd: "end_turn",
    data: {}
}
```

###### notify the game is over:
```javascript
{
    status: "push",
    cmd: "game_over",
    data: {
        message: <msg>
    }
}
```

#### Error message
- All the error messages sent from server to client follow the JSON format:
```javascript
{
    status: "error",
    cmd: <cmd>,
    data: {
        message: <errorMessage>
    }
}
```

##### Game related error messages

###### Tell a player that he can't input an answer because it's not his turn:
```javascript
{
    status: "error",
    cmd: "input_answer",
    data: {
        message: "you have already input the answer!"
    }
}
```

###### Tell a player that he enters an invalid answer:
```javascript
{
    status: "error",
    cmd: "input_answer",
    data: {
        message: "Invalid answer!"
    }
}
```

###### Tell a player that he can't make a guess because it's not his turn:
```javascript
{
    status: "error",
    cmd: "make_guess",
    data: {
        message: "not your turn!"
    }
}
```

###### Tell a player that he enters an invalid guess:
```javascript
{
    status: "error",
    cmd: "make_guess",
    data: {
        message: "Invalid guess!"
    }
}
```