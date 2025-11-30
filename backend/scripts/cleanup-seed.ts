import dotenv from 'dotenv';
import { connectDB } from '../src/db';
import { User } from '../src/models/User';
import { Attendance } from '../src/models/Attendance';

dotenv.config();

async function cleanup() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('Please set MONGO_URI in environment (or backend/.env)');
    process.exit(1);
  }

  await connectDB(uri);

  const usernames = [
    'manager@company.com',
    'employee1@company.com',
    'employee2@company.com',
    'alice@company.com',
    'bob@company.com',
  ];

  for (const uname of usernames) {
    const user = await User.findOne({ username: uname }).exec();
    if (!user) {
      console.log(`User not found: ${uname}`);
      continue;
    }

    const resA = await Attendance.deleteMany({ user: user._id }).exec();
    console.log(`Deleted ${resA.deletedCount || 0} attendance documents for ${uname}`);

    const resU = await User.deleteOne({ _id: user._id }).exec();
    console.log(`Deleted user ${uname}`);
  }

  console.log('Cleanup complete.');
  process.exit(0);
}

cleanup().catch((err) => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
