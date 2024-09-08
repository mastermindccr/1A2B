import * as err from './error';

export default async (url, options) => {
    options = options || {};
    // include cookies in the request
    options.credentials = 'include';
    let s = 0; // record status code
    const response = await fetch("/api"+url, options).then((res) => {
        s = res.status;
        return res.text();
    }).then((msg) => {
        if(s === 400){
            throw new err.BadRequestError(msg);
        }
        return [s, msg];
    }).catch((e) => {
        return [s, e.message];
    });
    return response;
}