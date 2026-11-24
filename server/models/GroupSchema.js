import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    paidBy: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100,
    },
    amountPaise: {
        type: Number,
        required: true,
        min: [1, 'Value must be a whole number (1 or greater)'],
        validate: {
            validator: (num) => Number.isInteger(num),
            message: 'amountPaise is not whole number',
        },
    },
    date: {
        type: Date,
        default: Date.now,
        max: () => Date.now() + 24 * 60 * 60 * 1000,
    },
    description: {
        type: String,
        trim: true,
    },
});

const groupSchema = new mongoose.Schema(
    {
        groupName: {
            type: String,
            required: true,
            minLength: 1,
            trim: true,
        },
        members: {
            type: [String],
            validate: {
                validator: (arr) => arr.length > 1,
                message: 'At least two members are required.',
            },
        },
        expenses: {
            type: [expenseSchema],
        },
        groupId: {
            type: String,
            required: true,
            minLength: 30,
            default: () => crypto.randomUUID(),
            unique: true,
            immutable: true,
        },
    },
    {
        timestamps: true,
    },
);

export const groupModel = mongoose.model('GroupModel', groupSchema);
