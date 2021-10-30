

const getReturnableDoctorInfos = (doctor) => {
    delete doctor.password;
    delete doctor._id;
    // delete doctor.__v;
    return doctor;
}

module.exports = { getReturnableDoctorInfos };