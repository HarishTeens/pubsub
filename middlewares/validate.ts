import Joi from 'joi';

const validate = (schema: Joi.ObjectSchema<any>) => { 
    return (req, res, next) => { 
        const { error } = schema.preferences({convert: false}).validate(req.body);  
        if (error === undefined) { 
            next(); 
        } else {
            const { details } = error; 
            const message = details.map(i => i.message).join(',');        
            res.status(422).json({ error: message })
        } 
    } 
} 
export default validate;