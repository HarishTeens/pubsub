import Joi from 'joi';

const service = {
    create: Joi.object().keys({
        lockinFunds: Joi.number().required(),
        actionTimeout:Joi.number().required(),
        subscriberAction: Joi.number().required().min(0).max(1),
        name: Joi.string().required()
    })
}

const schemas = {
    service
}
export default schemas;