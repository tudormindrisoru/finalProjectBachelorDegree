const Joi = require('@hapi/joi');


const authValidation = (request) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(request);
}

module.exports.authValidation = authValidation;
