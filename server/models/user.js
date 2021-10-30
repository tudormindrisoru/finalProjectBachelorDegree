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
            const createdDate = new Date().format('YYYY-MM-DD HH:MM').toString();
            console.log(encryptedPassword);
            const SQL = `INSERT INTO 
            users(firstName,lastName,email,password,phone,createdAt) 
            VALUES('${this.firstName}','${this.lastName}','${this.email}','${encryptedPassword}','${this.phone}','${createdDate}');`
        
            const user = await db.execute(SQL);
            if(user) {
                return new Response(201, "User created!");
            } else {
                return new Response(409, user[0][0]);
            }
        } catch(err) {

            console.error(err);
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
                const passMatch = await bcrypt.compare(password, user[0][0].password) ;
                if(passMatch) {
                    delete user[0][0].password;
                    const userData = user[0][0];
                    return new Response(200,user[0][0]);
                }
            }
            return new Response(404,"Incorrect email or password!");
        } catch(err) {
            console.log(err);
            return new Response(500,err);
        }
    }

    static async findOneByPhone(phone) {
        try {
            const SQL_USER_QUERY = `SELECT * FROM users WHERE phone='${phone}'`;
            const user = await db.execute(SQL_USER_QUERY);
            if(user) {
                delete user[0][0].password;
                return new Response(200,user[0][0]);
            }
            return new Response(404,"This user is not registered! Please register");
        } catch(err) {
            console.log(err);
            return new Response(500,err);
        }
    }
    
    // static async findOneByPhone(phone) {
    //     try {

    //     } catch(err) {
    //         console.log(err);
    //     }
    // }

    // static findAll() {

    // }

    // static findOne() {

    // }

}

module.exports = User;