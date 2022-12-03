import { connect } from 'mongoose';

run().catch(err => console.log(err));

async function run() {
  // 4. Connect to MongoDB
  await connect(process.env.MONGO_URL);
}

export default run;