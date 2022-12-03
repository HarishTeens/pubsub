import AWS, { DynamoDB } from 'aws-sdk'
import moment from 'moment';
AWS.config.update({ region: process.env.REGION });

export interface BaseModel {
    campaign: string;
    createdOn?: number;
    lastUpdatedOn?: number;
}

export default class BaseDB {
    static dynamoDB = new AWS.DynamoDB.DocumentClient();
    protected tableName: string;
    protected pk: string;
    constructor(dbName: string, pk: string) {
        this.tableName = dbName;
        this.pk = pk || 'id';
    }

    public getRandomId() {
        return Math.random().toString(36).replace(/[^a-z0-9]+/g, '').substr(2, 10);
    }

    public async getMaster(val: string) {
        const payload: DynamoDB.DocumentClient.GetItemInput = {
            TableName: this.tableName,
            Key: { [this.pk]: val}
        }
        return BaseDB.dynamoDB.get(payload).promise();
    }

    public async getByPK(val: string) {
        const payload: DynamoDB.DocumentClient.GetItemInput = {
            TableName: this.tableName,
            Key: { [this.pk]: val}
        }
        return BaseDB.dynamoDB.get(payload).promise();
    }
    public async batchGet(ids: string[]) {
        const payload: DynamoDB.DocumentClient.BatchGetItemInput = {
            RequestItems: {
                [this.tableName]: {
                    Keys: ids.map(id => ({[this.pk] : id}))
                }
            }
        }
        const resp = await BaseDB.dynamoDB.batchGet(payload).promise();
        return resp.Responses[this.tableName];
    }
    public async update(data: any) {
        data.lastUpdatedOn = moment().valueOf();
        const payload: DynamoDB.DocumentClient.PutItemInput = {
            TableName: this.tableName,
            Item: data
        }
        return BaseDB.dynamoDB.put(payload).promise();
    }
    public async bulkInsert(data: any) {
        const payload: DynamoDB.DocumentClient.BatchWriteItemInput = {
            RequestItems: {
                [this.tableName]: data.map((d: any) => ({
                    PutRequest: {
                        Item: d
                    }
                }))
            }
        }
        return BaseDB.dynamoDB.batchWrite(payload).promise();
    }
    public async recursiveScan(payload: DynamoDB.DocumentClient.ScanInput) {
        const resp = await BaseDB.dynamoDB.scan(payload).promise();
        if (resp.LastEvaluatedKey) {
            payload['ExclusiveStartKey'] = resp.LastEvaluatedKey;
            const moreItems = await this.recursiveScan(payload)
            return [...resp.Items, ...moreItems];
        } else {
            return resp.Items;
        }
    }
}