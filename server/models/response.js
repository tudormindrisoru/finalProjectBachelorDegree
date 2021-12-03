class Response {

    _status;
    _message = "";

    constructor(status,messsage) {
        this._status = status;
        this._message = messsage; 
    }

    getResponse() {
        return {
            "status": this._status,
            "message": this._message
        }
    }
}

module.exports = Response; 