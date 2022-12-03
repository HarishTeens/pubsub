import { Schema, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
interface IUser {
  wallet: string; // PK
  name: string;
  services: string[], // service IDs reference
  orders: string[], // order IDs reference
}
  
// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
  wallet: { type: String, required: true },
  name: { type: String, required: true },
  services: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
});

// 3. Create a Model.
const User = model<IUser>('User', userSchema);

export default User;