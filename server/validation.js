const Joi = require("@hapi/joi");

const passwordLogInValidation = (request) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(request);
};

const phoneLogInStep1Validation = (request) => {
  const schema = Joi.object({
    phone: Joi.string().required(),
  });
  return schema.validate(request);
};

const phoneLogInStep2Validation = (request) => {
  const schema = Joi.object({
    code: Joi.string().required().length(6),
    phone: Joi.string().required(),
  });
  return schema.validate(request);
};

const registerStep1Validation = (request) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().required().length(10),
  });
  return schema.validate(request);
};

const registerStep2Validation = (request) => {
  const schema = Joi.object({
    code: Joi.string().required().length(6),
    phone: Joi.string().required(),
  });
  return schema.validate(request);
};

const postDoctorValidation = (request) => {
  const schema = Joi.object({
    cuim: Joi.string().required().length(10),
    specialty: Joi.string().required(),
  });
  return schema.validate(request);
};

const updateUserValidation = (request) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().length(10).required(),
  });
  return schema.validate(request);
};

const updateDoctorValidation = (request) => {
  const schema = Joi.object({
    cuim: Joi.string().required(),
    specialty: Joi.string().required(),
  });
  return schema.validate(request);
};

const officeValidation = (request) => {
  const schema = Joi.object({
    address: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    oName: Joi.string().required(),
  });
  return schema.validate(request);
};

const officeInvitationValidation = (request) => {
  const schema = Joi.object({
    doctorId: Joi.number().required(),
    officeId: Joi.number().required(),
  });
  return schema.validate(request);
};

const approvedAppointmentsValidation = (request) => {
  const schema = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  });
  return schema.validate(request);
};

const createAppointmentValidation = (request) => {
  const schema = Joi.object({
    patientId: Joi.date().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    notes: Joi.string().required(),
  });
  return schema.validate(request);
};

const updateAppointmentValidation = (request) => {
  const schema = Joi.object({
    id: Joi.date().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    notes: Joi.string().required(),
  });
  return schema.validate(request);
};

const approveAppointmentValidation = (request) => {
  const schema = Joi.object({
    id: Joi.number().required(),
    isApproved: Joi.boolean().required(),
  });
  return schema.validate(request);
};

const scheduleValidation = (request) => {
  const schema = Joi.object({
    id: Joi.number(),
    weekDay: Joi.number().required(),
    start: Joi.number().required(),
    end: Joi.number().required(),
  });
  return schema.validate(request);
};

const workingHoursIntervalValidation = (request) => {
  const schema = Joi.object({
    dayOfWeek: Joi.number().required(),
    start: Joi.number().required(),
    end: Joi.number().required(),
  });
  return schema.validate(request);
};

const vacationValidation = (request) => {
  const schema = Joi.object({
    id: Joi.number(),
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
  });
  return schema.validate(request);
};

module.exports = {
  passwordLogInValidation,
  phoneLogInStep1Validation,
  phoneLogInStep2Validation,
  registerStep1Validation,
  registerStep2Validation,
  postDoctorValidation,
  updateUserValidation,
  updateDoctorValidation,
  officeValidation,
  officeInvitationValidation,
  approvedAppointmentsValidation,
  createAppointmentValidation,
  updateAppointmentValidation,
  workingHoursIntervalValidation,
  scheduleValidation,
  vacationValidation,
  approveAppointmentValidation,
};
