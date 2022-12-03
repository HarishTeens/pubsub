import { connect } from 'mongoose';
import User from './User';



run().catch(err => console.log(err));

async function run() {
  // 4. Connect to MongoDB
  await connect(process.env.MONGO_URL);

  const user = new User({
    name: 'Bill',
    email: 'bill@initech.com',
    avatar: 'https://i.imgur.com/dM7Thhn.png'
  });
  await user.save();

  console.log(user.email); // 'bill@initech.com'
}

export default run;