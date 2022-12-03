import BaseDB from "./base";

export enum ACTIONS {
    BOOLEAN
}

export interface IServiceUser {
    wallet: string;
    action: ACTIONS;
}

// 1. Create an interface representing a document in MongoDB.
export interface IService {
    id: string;
    name: string;
    lockinFunds: number; //in POLYGON
    actionTimeout: number; // in ms
    creator: IServiceUser;
    agents?: IServiceUser[];
    subscriber: {
        action: ACTIONS;
    }
}

export default class ServiceDB extends BaseDB {
    constructor() {
        super("ECServices", "id");
    }
    
}
