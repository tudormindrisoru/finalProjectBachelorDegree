

const getReturnableDoctorInfos = (doctor) => {
    delete doctor.password;
    delete doctor._id;
    delete doctor.email;
    // delete doctor.__v;
    delete doctor.cuim;
    return doctor;
}

module.exports = { getReturnableDoctorInfos };