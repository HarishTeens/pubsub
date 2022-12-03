import { DEFAULT_ACTION_TIMEOUT } from '../config/constants';
import ServiceDB from '../models/Service';
import ServiceModel, { IServiceUser , ACTIONS, IService} from '../models/Service';
import UserDB from '../models/User';
import generateApiKey from 'generate-api-key';


const createService = async (req, res) => {
    const user = req.auth.user;
    const sv = new ServiceDB();
    const usr = new UserDB();
    const { name, description, lockinFunds, subscriberAction} = req.body;

    const creator : IServiceUser = {
        wallet: user,
        action: ACTIONS.BOOLEAN
    }
    const id = sv.getRandomId();
    const apiKey = generateApiKey({ method: 'string', length: 16 });
    const newService: IService = {
        id,
        name,
        description,
        lockinFunds,
        actionTimeout: DEFAULT_ACTION_TIMEOUT,
        apiKey: apiKey.toString(),
        creator,
        subscriber: {
            action: subscriberAction
        }
    }

    const prom1 = sv.update(newService);
    const prom2 = usr.addService({
        user,
        service: id
    })
    await Promise.all([prom1, prom2]);
    res.json({
        success: true
    });
}

const listServices = async (req, res) => {
    const user = req.auth.user;
    const usr = new UserDB();
    const sv = new ServiceDB();

    const userInfo = await usr.getByPK(user);
    const serviceIds = userInfo.Item?.services || [];
    const services = serviceIds.length === 0 ? [] : await sv.batchGet(serviceIds);
    res.json(services);
}


const services = {
    createService,
    listServices
}

export default services;