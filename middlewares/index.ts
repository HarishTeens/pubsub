import * as auth from './auth';
import * as error from './error';
import { default as validate } from './validate';

const middlewares = {
    auth,
    error,
    validate
}

export default middlewares;