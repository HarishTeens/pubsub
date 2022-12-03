import Joi from 'joi';

const service = {
    create: Joi.object().keys({
        lockinFunds: Joi.number().required(),
        subscriberAction: Joi.number().required().min(0).max(1),
        name: Joi.string().required()
    })
}

const order = {
    create: Joi.object().keys({
        service: Joi.string().required()
    })
}

const schemas = {
    service,
    order
}
export default schemas;