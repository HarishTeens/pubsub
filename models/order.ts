import BaseDB from './base';
import { IService, IServiceUser } from './Service';

export enum ORDER_STATUS {
    ORDER_PLACED,
    FUNDS_LOCKEDIN,
    CREATOR_ACK,
    AGENT_ONE,
    AGENT_TWO,
    SUBSCRIBER_ACK,
    FUNDS_RELEASED,
    FUNDS_REFUNDED
}

export interface IOrder extends IService{
    status: ORDER_STATUS;
    subscriber: IServiceUser
}

export default class OrderDB extends BaseDB {
    constructor() {
        super("ECOrders", "id");
    }
    
}