const db = require('../config/db');
const Response = require('./response');

class PhoneAuth {

    constructor(userId,phone,expirationDate) { 
        this._userId = userId;
        this._phone = phone;
        this._expirationDate = expirationDate;
    }

   static async findOneByPhoneInDB(phone) { 
        try {
            const SQL_SELECT = `SELECT * FROM phone_auths WHERE phone='${phone}'`;
            const result = await db.execute(SQL_SELECT);
            if(result) {
                return {
                    "phoneAuth": new PhoneAuth(result[0][0].userId,result[0][0].phone, result[0][0].expirationDate),
                    "code": result[0][0].code
                }
            }
            return;
        } catch(err) {
            console.error(err);
            return;
        }
    }

    async insertIntoDB() {
        try {
            const remove = await this.removeFromDB();
            const ATTEMPTS = 5;
            for(let a = 0; a < ATTEMPTS; a++) {
                const code = this.getCode();
                const EXP_DATE = this._expirationDate.toLocaleString('ro-RO', {
                    month: 'numeric',
                    year: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                  });
                const SQL_ADD_PHONE_AUTH = `INSERT INTO phone_auths(userId,phone,code,expirationDate) VALUES(${this._userId},'${this._phone}','${code}','${EXP_DATE}')`;
                const result = await db.execute(SQL_ADD_PHONE_AUTH);
                if(result) {
                    return new Response(201, {
                        "userId": this._userId,
                        "phone": this._phone
                    }).getResponse();
                }
                renewExpirationDate();
            }
            return new Response(500, "Something went wrong!");

        } catch(err) {
            console.error(err);
            return new Response(500, err);
        }
    }

    async removeFromDB() {
        try {
            const SQL_REMOVE_PHONE_AUTH = `DELETE FROM phone_auths WHERE userId=${this._userId};`   
            const result = await db.execute(SQL_REMOVE_PHONE_AUTH);
            if(result) {
                return new Response(200, "Entity removed.");
            }
            return new Response(204,"Entity already removed!");
        } catch(err) {
            console.error(err);
            return new Response(500, err);
        }
    }

    renewExpirationDate() {
        this._expirationDate = new Date(Date().getTime() + 5*6000);
    }

    generateCode() {
        this._code = '';
        const LENGTH = 6;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const charactersLength = characters.length;
        for ( var i = 0; i < LENGTH; i++ ) {
            this._code += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
       return this._code;
    }

    getCode() {
        return this._code ? this._code : this.generateCode();
    }
}

module.exports = PhoneAuth;