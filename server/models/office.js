const db = require("../config/db");

const Response = require("./response");

class Office {
    id;
    oName;
    address;
    longitude;
    latitude;
    administratorId;

  constructor(id, name, address, longitude , latitude, administratorId) {
    this.id = id;
    this.oName = name;
    this.address = address;
    this.longitude = longitude;
    this.latitude = latitude;
    this.administratorId = administratorId;
  }

  static async save(administratorId,data) {
    try {
      const INSERT_OFFICE_SQL = `INSERT INTO offices(address, oName, longitude, latitude, administratorId) VALUES("${data.address}","${data.oName}", "${data.longitude}", "${data.latitude}", ${administratorId})`;
      const office = await db.execute(INSERT_OFFICE_SQL);
      console.log(INSERT_OFFICE_SQL);
      console.log(office);
      if(office && office[0].affectedRows === 1) {
        return new Response(201, true, {
          'id': office[0].insertId,
          'address': data.address,
          'oName': data.oName,
          'longitude': data.longitude,
          'latitude': data.latitude,
          'administratorId': administratorId
        }).getResponse();
      }
      return new Response(404, false, "Office could not be created.").getResponse();
    } catch(err) {
      return new Response(500, false, err).getResponse();
    }
  }

  static async update(docId,data) {
    try {
      const UPDATE_OFFICE_SQL = `UPDATE offices SET address = '${data.address}', oName='${data.oName}', longitude=${data.longitude}, latitude=${data.latitude} WHERE administratorId=${docId};`
      const office = await db.execute(UPDATE_OFFICE_SQL);
      if(office && office[0].affectedRows === 1) {
        return new Response(200, true, "Office updated!").getResponse();
      }
      return new Response(404, false, "Office not found.").getResponse();
    } catch(err) {
      console.error(err);
      return new Response(500, false, err).getResponse();
    }
  }

  static async delete(officeId, docId) {
    try {
      const UPDATE_OFFICE_SQL = `DELETE FROM offices WHERE administratorId = ${docId} AND id=${officeId}`;
      const office = await db.execute(UPDATE_OFFICE_SQL);
      console.log(UPDATE_OFFICE_SQL);
      if(office && office[0].affectedRows === 1) {

        return new Response(200, true, "Office updated!").getResponse();
      }
      return new Response(404, false, "Office not found.").getResponse();
    } catch(err) {
      console.error(err);
      return new Response(500, false, err).getResponse();
    }
  }


  static async getOneById(id) {
    try {
      const GET_OFFICE_BY_ID_QUERY = `SELECT * FROM offices WHERE id=${id};`;
      console.log(GET_OFFICE_BY_ID_QUERY);
      const office = await db.execute(GET_OFFICE_BY_ID_QUERY);
      if(!!office[0][0]) {
        const { id, oName, address, longitude, latitude, administratorId } = office[0][0];
        return new Response(200, true, new Office(id, oName, address, longitude, latitude, administratorId)).getResponse();
      } else { 
        return new Response(404, false, "Office not found.").getResponse();
      }
    } catch(err) {
      console.error(err);
      return new Response(500, false, err).getResponse();
    }
  }

  static async getAffiliatedDoctors(id) {
    try {
      const GET_DOCTORS_BY_OFFICE_ID_QUERY = `SELECT u.firstName, u.lastName, u.photo, u.phone, d.specialty, d.id FROM users u JOIN doctors d ON u.docId = d.id JOIN offices o ON o.id = d.officeId WHERE o.id = ${id};`
      const doctors = await db.execute(GET_DOCTORS_BY_OFFICE_ID_QUERY);
      if(!!doctors[0] && doctors[0].length > 0) {
        let list = [];
        console.log(doctors[0]);
        doctors[0].forEach(element => {
          list.push({
            'id': element.id,
            'specialty': element.specialty,
            'user': {
              'firstName': element.firstName,
              'lastName': element.lastName,
              'photo': element.photo,
              'phone': element.phone
            }
          })
        });
        return new Response(200, true, list).getResponse();
      }
      return new Response(404, false, "This office has no doctors.").getResponse();
    } catch(err) {
      console.error(err);
      return new Response(500, false, err).getResponse();
    }
  }

  static async getDoctorInvitations(doctorId) {
    try {
      const GET_DOCTOR_INVITATIONS = `SELECT * FROM office_invitations WHERE doctorId=${doctorId};`;
      const invitations = await db.execute(GET_DOCTOR_INVITATIONS);
      return new Response(200, true, invitations[0] && invitations[0][0] ? invitations[0][0] : []).getResponse();
    } catch(err) {
      console.error(err);
      return new Response(500, false, err).getResponse();
    }
  }

  static async inviteDoctor(doctorId, officeId) {
    try {
      const result = await Office.getDoctorInvitations(doctorId);
      console.log(result.message);
      if(result.success && result.message) {
        if(result.message.officeId === officeId) {
          return new Response(400, false, "There is already an invitation to this office for this doctor.").getResponse();
        }
      }
      const INVITE_DOCTOR_SQL = `INSERT INTO office_invitations(officeId, doctorId) VALUES(${officeId}, ${doctorId});`;
      const invitation = await db.execute(INVITE_DOCTOR_SQL);
      if(!!invitation[0] && invitation[0].affectedRows === 1) {
        return new Response(201, true, "Invitation created successfully!").getResponse(); 
      } else {
        return new Response(400, false, "Invitation could not be created.").getResponse();
      }
    } catch(err) {
      console.error(err);
      return new Response(500, false, err).getResponse();
    }
  }

  // static async getInvitations(id) {
    
  // }
}

module.exports = Office;