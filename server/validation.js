const Joi = require("@hapi/joi");

const authValidation = (request) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(request);
};

const doctorDetailValidation = (request) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().min(10).max(10).required(),
    city: Joi.string().required(),
    specialty: Joi.string().required(),
    cuim: Joi.string().required(),
    birthDate: Joi.string().required(),
  });
  return schema.validate(request);
};

const officeValidation = (request) => {
  const schema = Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    name: Joi.string().required(),
  });
  return schema.validate(request);
};

const doctorSearchValidation = (request) => {
  const schema = Joi.object({
    city: Joi.string(),
    specialty: Joi.string(),
    doctor_name: Joi.string(),
    office_name: Joi.string(),
  });
  return schema.validate(request);
};

const scheduleSearchValidation = (request) => {
    const schema = Joi.object({
        affiliationID: Joi.string().required(),
        date: Joi.string().required()
    });
    return schema.validate(request);
};

const workingHoursIntervalValidation = (request) => {
    const schema = Joi.object({
        dayOfWeek: Joi.number().required(),
        start: Joi.number().required(),
        end: Joi.number().required()
    });
    return schema.validate(request);
}

const vacationIntervalValidation = (request) => {
    const schema = Joi.object({
        affiliationID: Joi.string().required(),
        startDate: Joi.string().required(),
        endDate: Joi.string().required()
    });
    return schema.validate(request);
}

module.exports = {
  authValidation,
  doctorDetailValidation,
  officeValidation,
  doctorSearchValidation,
  scheduleSearchValidation,
  workingHoursIntervalValidation,
  vacationIntervalValidation
};
