const db = require("../config/db");
const bcrypt = require("bcryptjs");
const saltRounds = 3;

const Response = require("./response");

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
      console.log("TEST ----- USER ADD");
      const encryptedPassword = await bcrypt.hash(this.password, saltRounds);
      const d = new Date();
      const createdDate = `${d.getFullYear()}-${d.getMonth() + 1}-${
        d.getDate() < 10 ? "0" : ""
      }${d.getDate()} ${d.getHours() < 10 ? "0" : ""}${d.getHours()}:${
        d.getMinutes() < 10 ? "0" : ""
      }${d.getMinutes()}`;
      console.log(createdDate, encryptedPassword);
      const SQL = `INSERT INTO 
            users(firstName,lastName,email,password,phone,createdAt) 
            VALUES('${this.firstName}','${this.lastName}','${this.email}','${encryptedPassword}','${this.phone}','${createdDate}');`;

      const user = await db.execute(SQL);
      if (user) {
        return new Response(201, true, "User created!").getResponse();
      } else {
        return new Response(409, false, user[0][0]).getResponse();
      }
    } catch (err) {
      console.error(err);
      if (err.code === "ER_DUP_ENTRY") {
        return new Response(
          403,
          false,
          "This user already exist."
        ).getResponse();
      }
      return new Response(500, false, "Something bad happened.").getResponse();
    }
  }

  async update() {
    try {
    } catch (err) {
      console.error(err);
    }
  }

  static async findOneByEmailAndPass(email, password) {
    try {
      const SQL_USER_QUERY = `SELECT * FROM users WHERE email='${email}'`;
      const user = await db.execute(SQL_USER_QUERY);
      if (user) {
        console.log(user[0][0]);
        if (user[0][0].isVerified) {
          const passMatch = await bcrypt.compare(password, user[0][0].password);
          if (passMatch) {
            delete user[0][0].password;
            const userData = user[0][0];
            return new Response(200, true, user[0][0]).getResponse();
          }
        } else {
          return new Response(
            403,
            false,
            "This account is not verified!"
          ).getResponse();
        }
      }
      return new Response(
        404,
        false,
        "Incorrect email or password!"
      ).getResponse();
    } catch (err) {
      console.log(err);
      return new Response(500, false, "Something bad happened.").getResponse();
    }
  }

  static async findOneByPhone(phone) {
    try {
      console.log("findOneByPhone= ", phone);
      const SQL_USER_QUERY = `SELECT * FROM users WHERE phone='${phone}'`;
      const user = await db.execute(SQL_USER_QUERY);
      if (user) {
        console.log(user[0][0]);
        if (user[0][0].isVerified) {
          delete user[0][0].password;
          return new Response(200, true, user[0][0]).getResponse();
        } else {
          return new Response(
            403,
            false,
            "This user is not verified."
          ).getResponse();
        }
      }
      return new Response(
        404,
        false,
        "This user is not registered! Please register"
      ).getResponse();
    } catch (err) {
      console.log(err);
      return new Response(500, false, "Something bad happened.").getResponse();
    }
  }

  static async updatePhotoById(id, path) {
    const SQL_UPDATE_PHOTO = `UPDATE users SET photo = "${path}" WHERE id = ${id}`;
    const result = db.execute(SQL_UPDATE_PHOTO);
    console.log(result);
    if (result) {
      return new Response(200, true, { path: path }).getResponse();
    } else {
      return new Response(400, false, result.sqlMessage);
    }
  }

  static async updateUserById(data, id) {
    try {
        const SQL_UDDATE_USER =
          `UPDATE users SET ` +
          (data.firstName ? `firstName='${data.firstName}',` : "") +
          (data.lastName ? `lastName='${data.lastName}', ` : "") +
          (data.phone ? `phone='${data.phone}'` : "") +
          ` WHERE id=${id};`;
        const updatedUser = await db.execute(SQL_UDDATE_USER);
        if(updatedUser[0].affectedRows === 1) {
            return new Response(200, true, "Entity updated.").getResponse();
        } else {
            return new Response(404, false, "User not found.").getResponse();   
        }
    } catch(error) {
        console.error(error);
        return new Response(500, false, error).getResponse();
    }
  }

  async validate() {
    try {
      const SQL_VALIDATE_USER = `UPDATE users SET isVerified = 1 WHERE phone='${this.phone}'`;
      console.log(SQL_VALIDATE_USER);
      const [results, buff] = await db.execute(SQL_VALIDATE_USER);
      if (results && results.affectedRows) {
        console.log(results);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  // static findAll() {

  // }
}

module.exports = User;
