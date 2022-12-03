import { Schema, model } from 'mongoose';
import { IService, IServiceUser, serviceUserSchema } from './service';

enum ORDER_STATUS {
    ORDER_PLACED,
    FUNDS_LOCKEDIN,
    CREATOR_ACK,
    AGENT_ONE,
    AGENT_TWO,
    SUBSCRIBER_ACK,
    FUNDS_RELEASED,
    FUNDS_REFUNDED
}

interface IOrder extends IService{
    status: ORDER_STATUS;
    subscriber: IServiceUser
}
    
// 2. Create a Schema corresponding to the document interface.
const orderSchema = new Schema<IOrder>({
    id: { type: String, required: true },
    lockinFunds: { type: Number, required: true },
    actionTimeout: { type: Number, required: true },
    status: {type: Number, required: true},
    creator: { type: serviceUserSchema, required: true },
    agents: [serviceUserSchema],
    subscriber: { type: serviceUserSchema, required: true }
    
});

// 3. Create a Model.
const Order = model<IOrder>('Order', orderSchema);

export default Order;