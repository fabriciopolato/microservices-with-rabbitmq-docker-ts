export class HttpError extends Error {
    status: number;
    
    constructor(status: number, message: string) {
        super(message);
        this.status = status;

        // restore prototype chain   
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}
