const db = require('../config/db');
const bcrypt = require('bcryptjs');
const saltRounds = 3;

const Response = require('./response');

class User {

    constructor(firstName, lastName, email, password, phone) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phone = phone;
    }

    async save() {
        try {
            const encryptedPassword = await bcrypt.hash(this.password, saltRounds);
            const d = new Date();
            const createdDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() < 10 ? '0' : ''}${d.getDate()} ${d.getHours() < 10 ? '0' : ''}${d.getHours()}:${d.getMinutes() < 10 ? '0' : ''}${d.getMinutes()}`
            console.log(createdDate,encryptedPassword);
            const SQL = `INSERT INTO 
            users(firstName,lastName,email,password,phone,createdAt) 
            VALUES('${this.firstName}','${this.lastName}','${this.email}','${encryptedPassword}','${this.phone}','${createdDate}');`
        
            const user = await db.execute(SQL);
            if(user) {
                return new Response(201, "User created!").getResponse();
            } else {
                return new Response(409, user[0][0]).getResponse();
            }
        } catch(err) {
            console.error(err);
            if(err.code === 'ER_DUP_ENTRY') {
                return new Response(403,'This user already exist.').getResponse();
            }
            return new Response(500,"Something bad happened.").getResponse();
        }
    }

   async update() {
        try {
        
        } catch(err) {
            console.error(err);
        }
    }

    static async findOneByEmailAndPass(email, password) {
        try {
            const SQL_USER_QUERY = `SELECT * FROM users WHERE email='${email}'`;
            const user = await db.execute(SQL_USER_QUERY);
            if(user) {
                console.log(user[0][0]);
                if(user[0][0].isVerified) { 
                    const passMatch = await bcrypt.compare(password, user[0][0].password) ;
                    if(passMatch) {
                        delete user[0][0].password;
                        const userData = user[0][0];
                        return new Response(200,user[0][0]).getResponse();
                    }
                } else {
                    return new Response(403,"This account is not verified!").getResponse();
                }
            }
            return new Response(404,"Incorrect email or password!").getResponse();
        } catch(err) {
            console.log(err);
            return new Response(500,"Something bad happened.").getResponse();
        }
    }

    static async findOneByPhone(phone) {
        try {
            const SQL_USER_QUERY = `SELECT * FROM users WHERE phone='${phone}'`;
            const user = await db.execute(SQL_USER_QUERY);
            if(user) {
                if(user[0][0].isVerified) {
                    delete user[0][0].password;
                    return new Response(200,user[0][0]);
                } else {
                    return new Response(403,"This user is not verified.").getResponse();
                }
            }
            return new Response(404,"This user is not registered! Please register").getResponse();
        } catch(err) {
            console.log(err);
            return new Response(500,"Something bad happened.").getResponse();
        }
    }

    async validate() {
        try {
            const SQL_VALIDATE_USER = `UPDATE users SET isVerified = 1 WHERE phone='${this.phone}'`;
            const validation = await db.execute(SQL_VALIDATE_USER);
            if(validation && validation[0][0].isVerified) {
                console.log(validation);
                return true;
            }
            return false;
        } catch(err) {
            console.error(err);
            return false;
        }
    }
    // static findAll() {

    // }

}

module.exports = User;