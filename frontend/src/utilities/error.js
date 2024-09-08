export class SessionExpiredError extends Error {
    constructor(){
        super('Session Expired!');
        this.name = 'SessionExpiredError';
    }
}

export class BadRequestError extends Error {
    constructor(message){
        super(message);
        this.name = 'BadRequestError';
    }
}