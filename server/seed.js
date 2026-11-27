import 'dotenv/config';
import { connectDB } from './db/connectDB.js';
import { groupModel } from './models/GroupSchema.js';
import mongoose from 'mongoose';

if (
    process.env.MONGODB_URI &&
    !['localhost', '127.0.0.1'].includes(
        new URL(process.env.MONGODB_URI).hostname,
    )
) {
    console.error(
        'Error: MONGODB_URI is not a local database. Aborting Seed.js',
    );
    process.exit(1);
}

await connectDB(process.env.MONGODB_URI);

const group1 = await groupModel.create({
    groupName: 'Group1',
    members: ['A', 'B', 'C', 'D'],
    expenses: [
        {
            paidBy: 'A',
            amountPaise: 10000,
            description: 'This is description',
            date: '2026-11-24',
        },
        {
            paidBy: 'C',
            amountPaise: 12345,
            description: 'This is description',
        },
        {
            paidBy: 'B',
            amountPaise: 45613,
            description: 'This is description',
            date: '2026-11-25',
        },
        {
            paidBy: 'D',
            amountPaise: 456132,
            description: 'This is description',
        },
    ],
});
console.log(`
    Group without any error:
    GroupId for Group1: ${group1.groupId}
`);

const group2 = await groupModel.create({
    groupName: 'Group2',
    members: ['E', 'F', 'G', 'H'],
    expenses: [
        {
            paidBy: 'E',
            amountPaise: 3498,
            description: 'This is description',
            date: '2026-11-24',
        },
        {
            paidBy: 'F',
            amountPaise: 1268,
            description: 'This is description',
        },
        {
            paidBy: 'G',
            amountPaise: 7897,
            description: 'This is description',
            date: '2026-11-25',
        },
        {
            paidBy: 'I',
            amountPaise: 1549,
            description: 'This is description',
        },
    ],
});

console.log(`
    Group with any error:
    GroupId for Group2: ${group2.groupId}
`);

const group3 = await groupModel.create({
    groupName: 'Group2',
    members: ['J', 'K'],
});

console.log(`
    Group with any error:
    GroupId for Group3: ${group3.groupId}
`);

await mongoose.disconnect();
process.exit(0);
