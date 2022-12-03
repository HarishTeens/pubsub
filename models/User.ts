
import { DynamoDB } from "aws-sdk";
import moment from "moment";
import BaseDB from "./base";

interface IUser {
  wallet: string; // PK
  nonce: number;
  name: string;
  services: string[], // service IDs reference
  orders: string[], // order IDs reference
}


export default class UserDB extends BaseDB {
  constructor() {
      super("ECUsers", "wallet");
  }
    
  public async addService(data: any) {
    const payload: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: this.tableName,
      Key: { [this.pk]: data.user },
      UpdateExpression: "SET services = list_append(if_not_exists(services, :emptyList), :service), lastUpdatedOn = :lastUpdatedOn",
      ExpressionAttributeValues: {
          ':service': [data.service],
          ':emptyList': [],
          ':lastUpdatedOn': moment().valueOf()
      }
    }
    return BaseDB.dynamoDB.update(payload).promise();
  }
}
