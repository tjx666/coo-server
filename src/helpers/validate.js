const Boom = require('@hapi/boom');

const validate = async function(schema, target = 'body', isAsync = false) {
    const ctx = this;
    const { method, query, body } = ctx.request;
    let validatedData = body;
    if (method === 'get' || target === 'query') validatedData = query;
    else if (target === 'params') validatedData = ctx.params;

    let result;
    if (isAsync) {
        try {
            result = await schema.validateAsync(validatedData);
        } catch (error) {
            throw Boom.badRequest(error.details[0].message);
        }
    } else {
        result = schema.validate();
        if (result.error) {
            throw Boom.badRequest(result.error.details.message);
        }
    }

    return validatedData;
};

const validateAsync = function async(schema, validateQuery) {
    return validate.call(this, schema, validateQuery, true);
};

module.exports = async function(server) {
    Object.assign(server.context, { validate, validateAsync });
};
