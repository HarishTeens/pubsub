import OrderDB, { IOrder, ORDER_STATUS } from "../models/Order";
import ServiceDB, { IService } from "../models/Service";
import UserDB from "../models/User";

const placeOrder = async (req,res,next) => {
    const user = req.auth.user;
    const usr = new UserDB();
    const sv = new ServiceDB();
    const or = new OrderDB();
    const { service } = req.body;

    try {
        const serviceInfo = (await sv.getByPK(service)).Item as IService;
        if (!serviceInfo)
            throw new Error("Service Not found");
        const orderId = or.getRandomId();
        const order: IOrder = {
            ...serviceInfo,
            id: orderId,
            subscriber: {
                action: serviceInfo.subscriber.action,
                wallet: user
            },
            status: ORDER_STATUS.ORDER_PLACED
        }
        const prom1 = or.update(order);
        const prom2 = usr.addOrder({
            user,
            order: orderId
        })
        await Promise.all([prom1, prom2]);
        res.json({
            success: true
        })
    } catch (error) {
        next(error)
    }
}

const listOrders = async (req,res) => {
    const user = req.auth.user;
    const usr = new UserDB();
    const or = new OrderDB();

    const userInfo = await usr.getByPK(user);
    const orderIds = userInfo.Item?.orders || [];
    const services = await or.batchGet(orderIds);
    res.json(services);
}

const orders = {
    placeOrder,
    listOrders
}
export default orders;