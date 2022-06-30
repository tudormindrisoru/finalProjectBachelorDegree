const db = require("../config/db");
const { encrypt, decrypt } = require("../utils");
const Response = require("./response");

class Office {
  id;
  oName;
  address;
  longitude;
  latitude;
  administratorId;
  city;

  constructor(id, name, address, longitude, latitude, administratorId, city) {
    this.id = id;
    this.oName = name;
    this.address = address;
    this.longitude = longitude;
    this.latitude = latitude;
    this.administratorId = administratorId;
    this.city = city;
  }

  static async save(administratorId, data) {
    try {
      const INSERT_OFFICE_SQL = `INSERT INTO offices(address, oName, longitude, latitude, administratorId, city) VALUES("${data.address}","${data.oName}", "${data.longitude}", "${data.latitude}", ${administratorId}, '${data.city}')`;
      const office = await db.execute(INSERT_OFFICE_SQL);
      console.log(INSERT_OFFICE_SQL);
      console.log(office);
      if (office && office[0].affectedRows === 1) {
        return new Response(201, true, {
          id: office[0].insertId,
          address: data.address,
          oName: data.oName,
          longitude: data.longitude,
          latitude: data.latitude,
          administratorId: administratorId,
          city: data.city,
        }).getResponse();
      }
      return new Response(
        404,
        false,
        "Cabinetul nu a putut fi inregistrat."
      ).getResponse();
    } catch (err) {
      return new Response(500, false, err).getResponse();
    }
  }

  static async update(docId, data) {
    try {
      const UPDATE_OFFICE_SQL = `UPDATE offices SET address = '${data.address}', oName='${data.oName}', longitude=${data.longitude}, latitude=${data.latitude}, city = '${data.city}' WHERE administratorId=${docId};`;
      const office = await db.execute(UPDATE_OFFICE_SQL);
      if (office && office[0].affectedRows === 1) {
        return new Response(
          200,
          true,
          "Datele cabinetului au fost actualizate!"
        ).getResponse();
      }
      return new Response(
        404,
        false,
        "Cabinetul nu a putut fi gasit."
      ).getResponse();
    } catch (err) {
      console.error(err);
      return new Response(500, false, err).getResponse();
    }
  }

  static async delete(officeId, docId) {
    try {
      const DELETE_OFFICE = `DELETE FROM offices WHERE administratorId = ${docId} AND id=${officeId}`;
      const office = await db.execute(DELETE_OFFICE);
      console.log(DELETE_OFFICE);
      if (office && office[0].affectedRows === 1) {
        return new Response(200, true, "Cabinetul a fost sters!").getResponse();
      }
      return new Response(
        404,
        false,
        "Cabinetul nu a putut fi gasit."
      ).getResponse();
    } catch (err) {
      console.error(err);
      return new Response(500, false, err).getResponse();
    }
  }

  static async getOneById(id) {
    try {
      const GET_OFFICE_BY_ID_QUERY = `SELECT * FROM offices WHERE id=${id};`;
      console.log(GET_OFFICE_BY_ID_QUERY);
      const office = await db.execute(GET_OFFICE_BY_ID_QUERY);
      if (!!office[0][0]) {
        const { id, oName, address, longitude, latitude, administratorId } =
          office[0][0];
        return new Response(
          200,
          true,
          new Office(id, oName, address, longitude, latitude, administratorId)
        ).getResponse();
      } else {
        return new Response(
          404,
          false,
          "Cabinetul nu a putut fi gasit."
        ).getResponse();
      }
    } catch (err) {
      console.error(err);
      return new Response(500, false, err).getResponse();
    }
  }

  static async getAffiliatedDoctors(id, myDoctorId = undefined) {
    try {
      const GET_DOCTORS_BY_OFFICE_ID_QUERY = `SELECT ${decrypt(
        "u.firstName"
      )} as 'firstName', ${decrypt(
        "u.lastName"
      )} as 'lastName', u.photo, ${decrypt(
        "u.phone"
      )} as 'phone', d.specialty, d.id FROM users u JOIN doctors d ON u.docId = d.id JOIN offices o ON o.id = d.officeId WHERE o.id = ${id};`;
      const doctors = await db.execute(GET_DOCTORS_BY_OFFICE_ID_QUERY);
      if (!!doctors[0] && doctors[0].length > 0) {
        let list = [];
        console.log(doctors[0]);
        doctors[0].forEach((element) => {
          list.push({
            id: element.id,
            specialty: element.specialty,
            user: {
              firstName: element.firstName,
              lastName: element.lastName,
              photo: element.photo,
              phone: element.phone,
            },
          });
        });
        // if (!!myDoctorId) {
        //   list = list.filter((e) => e.id !== myDoctorId);
        //   console.log(list);
        // }
        return new Response(200, true, list).getResponse();
      }
      return new Response(
        404,
        false,
        "Acest cabinet nu are doctori afiliati."
      ).getResponse();
    } catch (err) {
      console.error(err);
      return new Response(500, false, err).getResponse();
    }
  }

  static async getDoctorInvitations(doctorId) {
    try {
      const GET_DOCTOR_INVITATIONS = `SELECT * FROM office_invitations WHERE doctorId=${doctorId};`;
      const invitations = await db.execute(GET_DOCTOR_INVITATIONS);
      return new Response(
        200,
        true,
        invitations[0] && invitations[0][0] ? invitations[0][0] : []
      ).getResponse();
    } catch (err) {
      console.error(err);
      return new Response(500, false, err).getResponse();
    }
  }

  static async inviteDoctor(doctorId, officeId) {
    try {
      const result = await Office.getDoctorInvitations(doctorId);
      console.log(result.message);
      if (
        result?.success &&
        result?.message &&
        result?.message?.officeId === officeId &&
        result?.message.response !== 0
      ) {
        return new Response(
          400,
          false,
          "Acest doctor a primit deja invitatie de afiliere."
        ).getResponse();
      }

      const INVITE_DOCTOR_SQL = `INSERT INTO office_invitations(officeId, doctorId) VALUES(${officeId}, ${doctorId});`;
      const invitation = await db.execute(INVITE_DOCTOR_SQL);
      if (!!invitation[0] && invitation[0].affectedRows === 1) {
        return new Response(201, true, {
          message: "Invitatie creata cu success!",
          entryId: invitation[0].insertId,
        }).getResponse();
      }
      return new Response(
        400,
        false,
        "Invitatia nu a putut fi creata."
      ).getResponse();
    } catch (err) {
      console.error(err);
      return new Response(500, false, err).getResponse();
    }
  }

  static async handleInvitation(doctorId, invitationId, officeId, response) {
    try {
      const VERIFY_INVITE_SQL = `SELECT * FROM office_invitations WHERE doctorId = ${doctorId} AND id = ${invitationId} AND officeId = ${officeId} AND response IS NULL`;
      const verify = await db.execute(VERIFY_INVITE_SQL);
      console.log("VERIFY = ", verify[0]);
      if (!!verify && verify[0][0]) {
        const UPDATE_INVITE_SQL = `UPDATE office_invitations SET response = ${response} WHERE id = ${invitationId}`;
        const update = await db.execute(UPDATE_INVITE_SQL);
        console.log("UPDATE = ", update[0]);
        if (!!update && update[0].affectedRows === 1) {
          return new Response(
            200,
            true,
            response ? "Invitatie acceptata." : "Invitatie refuzata."
          ).getResponse();
        }
        return new Response(404, false, "Ceva nu a functionat.").getResponse();
      }
      return new Response(
        404,
        false,
        "Invitatia nu a putut fi gasita."
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, error).getResponse();
    }
  }

  static async rejectInvitation(doctorId, invitationId, officeId) {
    try {
    } catch (error) {
      console.error(error);
      return new Response(500, false, error);
    }
  }

  static async getCityList(docId = undefined) {
    try {
      const GET_CITY_LIST_SQL =
        `SELECT city, d.id as 'doctorId' FROM offices o JOIN doctors d ON o.id = d.officeId WHERE o.city IS NOT NULL` +
        (docId ? ` AND d.id != ${docId}` : "");
      console.log(GET_CITY_LIST_SQL);
      const result = await db.execute(GET_CITY_LIST_SQL);
      if (!!result && result[0]) {
        console.log(result[0]);

        var getSetEntries = function (val1, val2, setItself) {
          uniqueCitiesArray.push(val1);
        };

        let uniqueCities = new Set();
        let uniqueCitiesArray = [];
        result[0].forEach((entity) => uniqueCities.add(entity.city));
        console.log(uniqueCities);
        uniqueCities.forEach((elem) => uniqueCitiesArray.push(elem));
        console.log("unique cities ", uniqueCitiesArray);
        return new Response(200, true, uniqueCitiesArray).getResponse();
      }
      return new Response(200, true, []).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, error).getResponse();
    }
  }

  static async getByCity(city, docId = undefined) {
    try {
      let GET_OFFICES_SQL = `SELECT id, oName, city FROM offices WHERE city = '${city}'`;
      if (docId) {
        GET_OFFICES_SQL = `SELECT o.id, o.oName, o.city FROM offices o JOIN doctors d ON o.id = d.officeId WHERE o.city = ${city} AND d.id != ${docId}`;
      }
      const result = await db.execute(GET_OFFICES_SQL);
      if (!!result && result[0]) {
        let uniqueOffices = result[0];
        if (docId) {
          uniqueOffices = result[0].filter(function (item, pos) {
            return result[0].indexOf(item.id) == pos.id;
          });
        }
        return new Response(200, true, uniqueOffices).getResponse();
      }
      return new Response(200, true, []).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, error).getResponse();
    }
  }

  static async getDoctorsByOfficeId(officeId, docId = undefined) {
    try {
      const GET_SPECIALTIES_SQL =
        `SELECT ${decrypt("u.firstName")} as 'firstName', ${decrypt(
          "u.lastName"
        )} as 'lastName', d.id, d.specialty, u.photo, ${decrypt(
          "u.phone"
        )} as 'phone', o.address, o.oName as 'officeName', o.longitude, o.latitude, (SELECT IFNULL(AVG(r.points), -1) FROM reviews r JOIN appointments a ON r.id = a.reviewId WHERE d.id = a.doctorId) as 'reviewAverage' FROM offices as o JOIN doctors as d ON d.officeId = o.id JOIN users as u ON d.id = u.docId WHERE o.id = ${officeId}` +
        (docId ? ` AND d.id != ${docId}` : "");
      const result = await db.execute(GET_SPECIALTIES_SQL);
      if (!!result && result[0]) {
        return new Response(200, true, result[0]).getResponse();
      }
      return new Response(200, true, []).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, error).getResponse();
    }
  }

  static async getOfficeInvitationsByDoctorId(doctorId) {
    try {
      const GET_INVITATIONS = `SELECT o.oName, i.id as 'inviteId' FROM offices o JOIN office_invitations i ON i.officeId = o.id WHERE i.doctorId = ${doctorId} AND i.response IS NULL`;
      const result = await db.execute(GET_INVITATIONS);
      if (!!result && !!result[0]) {
        return new Response(200, true, result[0]).getResponse();
      }
      return new Response(200, false, []).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Eroare de server").getResponse();
    }
  }

  static async respondToInvitation(doctorId, officeInviteId, response) {
    try {
      const UPDATE_INVITATION = `UPDATE office_invitations SET response = ${response} WHERE doctorId = ${doctorId} AND id = ${officeInviteId} AND response IS NULL;`;
      console.log(UPDATE_INVITATION);
      const result = await db.execute(UPDATE_INVITATION);
      console.log(result[0]);
      if (!!result && !!result[0] && result[0].affectedRows === 1) {
        const GET_OFFICE_ID = `SELECT officeId from office_invitations WHERE id =${officeInviteId}`;
        console.log("SQL ", GET_OFFICE_ID);
        const office = await db.execute(GET_OFFICE_ID);
        console.log("RESPONSE ", office[0]);
        if (!!office && office[0] && office[0][0]) {
          return new Response(200, true, {
            message: `Invitatia a fost ${
              response === 1 ? "aprobata" : "respinsa"
            }.`,
            officeId: office[0][0].officeId,
          }).getResponse();
        }
        return new Response(
          200,
          true,
          `Invitatia a fost ${response === 1 ? "aprobata" : "respinsa"}.`
        ).getResponse();
      }
      return new Response(
        404,
        false,
        "Invitatia nu a fost gasita"
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Eroare de server").getResponse();
    }
  }

  static async getOfficeInvitationById(inviteId) {
    try {
      const GET_INVITE = `SELECT o.oName, i.id as 'inviteId' FROM office_invitations i JOIN offices o ON o.id = i.officeId WHERE i.response IS NULL AND i.id = ${inviteId};`;
      const result = await db.execute(GET_INVITE);
      console.log("SQL ", GET_INVITE);
      if (!!result && !!result[0] && !!result[0][0]) {
        console.log(result[0][0]);
        return new Response(200, true, result[0][0]).getResponse();
      }
      console.log(result[0]);
      return new Response(
        404,
        false,
        "Invitatia nu a fost gasita"
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Eroare de server").getResponse();
    }
  }

  static async removeAffiliation(doctorId) {
    try {
      const REMOVE_AFFILIATION = `UPDATE doctors SET officeId = NULL WHERE id = ${doctorId}`;
      const remove = await db.execute(REMOVE_AFFILIATION);
      if (!!remove && !!remove[0] && remove[0].affectedRows === 1) {
        const REMOVE_INVITATION = `DELETE from office_invitations WHERE doctorId = ${doctorId}`;
        const removeInvitationFromHistory = await db.execute(REMOVE_INVITATION);
        if (
          !!removeInvitationFromHistory &&
          removeInvitationFromHistory[0].affectedRows === 1
        ) {
          return new Response(
            200,
            true,
            "Afilierea a fost stearsa"
          ).getResponse();
        }
      }
      return new Response(
        404,
        false,
        "Afilierea nu a fost gasita"
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Eroare de server").getResponse();
    }
  }
}

module.exports = Office;
