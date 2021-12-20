class Response {
    
    _status;
    _success = true;
    _message = "";

    constructor(status, success, message) {
        this._status = status;
        this._success = success;
        this._message = message; 
    }

    getResponse() {
        return {
            "status": this._status,
            "success": this._success,
            "message": this._message
        }
    }
}

module.exports = Response; 