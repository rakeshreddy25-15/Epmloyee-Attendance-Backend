import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { connectDB } from '../src/db';
import { User } from '../src/models/User';
import { Attendance } from '../src/models/Attendance';

dotenv.config();

const SALT_ROUNDS = 10;

async function upsertUser(username: string, email: string | undefined, password: string, role: 'employee' | 'manager') {
  const existing = await User.findOne({ username }).exec();
  if (existing) return existing;
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = new User({ username, email, password: hashed, role });
  await user.save();
  return user;
}

function isoDateDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('Please set MONGO_URI in environment (or in .env)');
    process.exit(1);
  }

  await connectDB(uri);

  console.log('Seeding users...');
  const manager = await upsertUser('manager@company.com', 'manager@company.com', 'Password1!', 'manager');
  const emp1 = await upsertUser('employee1@company.com', 'employee1@company.com', 'Password1!', 'employee');
  const emp2 = await upsertUser('employee2@company.com', 'employee2@company.com', 'Password1!', 'employee');

  console.log('Creating attendance records...');

  const employees = [emp1, emp2];

  for (const emp of employees) {
    for (let d = 1; d <= 3; d++) {
      const date = isoDateDaysAgo(d);
      // upsert attendance for date
      await Attendance.updateOne(
        { user: emp._id, date },
        { $setOnInsert: { user: emp._id, date, createdAt: new Date() } },
        { upsert: true }
      ).exec();
    }
  }

  // create a check-in for today for emp1
  const today = isoDateDaysAgo(0);
  await Attendance.updateOne(
    { user: emp1._id, date: today },
    { $set: { checkIn: new Date() } },
    { upsert: true }
  ).exec();

  console.log('Seeding complete. Created manager and 2 employees with a few attendance records.');
  console.log('Credentials: manager@company.com / Password1!  and  employee1@company.com / Password1!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
