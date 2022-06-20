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
      const encryptedPassword = await bcrypt.hash(this.password, saltRounds);
      const d = new Date();
      const createdDate = `${d.getFullYear()}-${d.getMonth() + 1}-${
        d.getDate() < 10 ? "0" : ""
      }${d.getDate()} ${d.getHours() < 10 ? "0" : ""}${d.getHours()}:${
        d.getMinutes() < 10 ? "0" : ""
      }${d.getMinutes()}`;
      const SQL = `INSERT INTO 
            users(firstName,lastName,email,password,phone,createdAt) 
            VALUES('${this.firstName}','${this.lastName}','${this.email}','${encryptedPassword}','${this.phone}','${createdDate}');`;

      const user = await db.execute(SQL);
      if (user) {
        return new Response(201, true, "Utilizator inregistrat!").getResponse();
      } else {
        return new Response(409, false, user[0][0]).getResponse();
      }
    } catch (err) {
      console.error(err);
      if (err.code === "ER_DUP_ENTRY") {
        return new Response(
          403,
          false,
          "Utilizatorul exista deja sau necesita confirmare."
        ).getResponse();
      }
      return new Response(500, false, "Server error.").getResponse();
    }
  }

  async update() {
    try {
    } catch (err) {
      console.error(err);
    }
  }

  static async findAllByName(name, id) {
    try {
      const GET_USERS_SQL = `SELECT * FROM users WHERE (firstName LIKE '${name}%' OR lastName LIKE '${name}%') AND isVerified = 1 AND id != ${id}`;
      const users = await db.execute(GET_USERS_SQL);
      let res = [];
      if (!!users[0] && users[0].length > 0) {
        res = users[0].map((element) => {
          return {
            id: element.id,
            firstName: element.firstName,
            lastName: element.lastName,
            photo: element.photo,
            phone: element.phone,
          };
        });
      }
      return new Response(200, true, res).getResponse();
    } catch (err) {
      console.error(err);
      return new Response(500, false, err).getResponse();
    }
  }

  static async findOneByEmailAndPass(email, password) {
    try {
      const SQL_USER_QUERY = `SELECT * FROM users WHERE email='${email}'`;
      const user = await db.execute(SQL_USER_QUERY);
      if (user) {
        if (user[0][0].isVerified) {
          console.log(bcrypt.decodeBase64(user[0][0].password));
          const passMatch = await bcrypt.compare(password, user[0][0].password);
          if (passMatch) {
            delete user[0][0].password;
            const userData = user[0][0];
            return new Response(200, true, userData).getResponse();
          }
        } else {
          return new Response(
            403,
            false,
            "Acest cont necesita verificare."
          ).getResponse();
        }
      }
      return new Response(
        404,
        false,
        "E-mail sau parola incorecte!"
      ).getResponse();
    } catch (err) {
      console.log(err);
      return new Response(500, false, "Eroare de server.").getResponse();
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
            "Acest utilizator necesita verificare."
          ).getResponse();
        }
      }
      return new Response(404, false, "Utilizator inexistent.").getResponse();
    } catch (err) {
      console.log(err);
      return new Response(500, false, "Eroare de server.").getResponse();
    }
  }

  static async updatePhotoById(id, path) {
    try {
      const SQL_UPDATE_PHOTO = `UPDATE users SET photo = "${path}" WHERE id = ${id}`;
      const result = await db.execute(SQL_UPDATE_PHOTO);
      if (!!result[0] && result[0].affectedRows === 1) {
        return new Response(200, true, { photo: path }).getResponse();
      }
      return new Response(
        400,
        false,
        "Imaginea nu a putut fi schimbata."
      ).getResponse();
    } catch (err) {
      console.error(err);
      return new Response(500, false, err).getResponse();
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
      if (updatedUser[0].affectedRows === 1) {
        console.log("updated USER = ", updatedUser);
        return new Response(200, true, updatedUser[0][0]).getResponse();
      } else {
        return new Response(
          404,
          false,
          "Utilizatorul nu a fost gasit."
        ).getResponse();
      }
    } catch (error) {
      console.error(error);
      return new Response(500, false, error).getResponse();
    }
  }

  static async filterUsersByName(name) {
    try {
      const GET_DOCTORS_SQL = `SELECT * FROM users WHERE (firstName LIKE '${name}%' OR lastName LIKE '${name}%') AND isVerified=1;`;
      const users = await db.execute(GET_DOCTORS_SQL);
      let res = [];
      if (!!doctors[0] && doctors[0].length > 0) {
        res = doctors[0].map((element) => {
          return {
            id: element.id,
            specialty: element.specialty,
            user: {
              firstName: element.firstName,
              lastName: element.lastName,
              photo: element.photo,
              phone: element.phone,
            },
          };
        });
      }
      return new Response(200, true, res).getResponse();
    } catch (err) {
      console.error(err);
      return new Response(500, false, err).getResponse();
    }
  }

  async validate() {
    try {
      const SQL_VALIDATE_USER = `UPDATE users SET isVerified = 1 WHERE phone='${this.phone}'`;
      console.log(SQL_VALIDATE_USER);
      const [results, buff] = await db.execute(SQL_VALIDATE_USER);
      if (results && results.affectedRows) {
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  static async findOneById(id) {
    try {
      const GET_USER_SQL = `SELECT * FROM users WHERE id=${id} AND isVerified = 1`;
      const user = await db.execute(GET_USER_SQL);
      if (!!user && !!user[0] && !!user[0][0]) {
        delete user[0][0].password;
        return new Response(200, true, user[0][0]).getResponse();
      }
      return new Response(404, false, "Utilizatorul nu exista.").getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Eroare de server").getResponse();
    }
  }

  static async findOneByDoctorId(id) {
    try {
      const GET_USER_SQL = `SELECT * FROM users WHERE docId=${id} AND isVerified = 1`;
      const user = await db.execute(GET_USER_SQL);
      if (!!user && !!user[0] && !!user[0][0]) {
        delete user[0][0].password;
        return new Response(200, true, user[0][0]).getResponse();
      }
      return new Response(404, false, "Utilizatorul nu exista.").getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Eroare de server").getResponse();
    }
  }
}

module.exports = User;
