import { Schema, model } from 'mongoose';

enum ACTIONS {
    BOOLEAN
}

export interface IServiceUser {
    id: string;
    wallet: string;
    action: ACTIONS;
}

// 1. Create an interface representing a document in MongoDB.
export interface IService {
    id: string;
    lockinFunds: number; //in POLYGON
    actionTimeout: number; // in ms
    creator: IServiceUser;
    agents?: IServiceUser[];
    subscriber: {
        action: ACTIONS;
    }
  }
export const serviceUserSchema = new Schema<IServiceUser>({
    id: { type: String, required: true },
    wallet: { type: String, required: true },
    action: Number
})
// 2. Create a Schema corresponding to the document interface.
const serviceSchema = new Schema<IService>({
    id: { type: String, required: true },
    lockinFunds: { type: Number, required: true },
    actionTimeout: { type: Number, required: true },
    creator: { type: serviceUserSchema, required: true },
    agents: [serviceUserSchema],
    subscriber: {
        action: {type: Number, required: true}
    }
},{
    timestamps: true
});

// 3. Create a Model.
const Service = model<IService>('Service', serviceSchema);

export default Service;