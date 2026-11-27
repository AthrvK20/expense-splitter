import { Router } from 'express';
import { groupModel } from '../models/GroupSchema.js';
import CustomError from '../utils/CustomError.js';
import {
    validateGroupName,
    validateMembers,
    validateAmountPaise,
    validatePaidBy,
    validateDescription,
    validateDate,
} from '../utils/validation.js';

const router = Router();

router.post('/', async (req, res) => {
    const { groupName, members } = req.body ?? {};

    const validatedData = {};
    try {
        validatedData.groupName = validateGroupName(groupName);
        validatedData.members = validateMembers(members);
    } catch (error) {
        if (error instanceof CustomError) {
            return res.status(400).json({
                error: `${error.name}: ${error.message}`,
            });
        } else {
            console.error(error.name, error.message);
            return res.status(500).json({
                error: `Error: Internal Server Error`,
            });
        }
    }

    try {
        const group = await groupModel.create({
            groupName: validatedData.groupName,
            members: validatedData.members,
        });
        return res.status(201).json({groupId: group.groupId});
    } catch (error) {
        if (error instanceof CustomError || error.name === 'ValidationError') {
            return res.status(400).json({
                error: `${error.name}: ${error.message}`,
            });
        } else {
            console.error(error.name, error.message);
            return res.status(500).json({
                error: `Error: Internal Server Error`,
            });
        }
    }
});

router.get('/:groupId', async (req, res) => {
    const groupId = req.params.groupId;

    let group;
    try {
        group = await groupModel
            .findOne({ groupId: groupId })
            .select('-_id -createdAt -updatedAt -__v');
    } catch (error) {
        console.error(error.name, error.message);
        return res.status(500).json({ error: `Error: Internal Server Error` });
    }

    if (!group) {
        return res.status(404).json({ error: `Group Error: Group Not Found` });
    }

    res.status(200).json(group);
});

router.get('/:groupId/expenses', async (req, res) => {
    const groupId = req.params.groupId;

    let expenses;
    try {
        const group = await groupModel
            .findOne({ groupId: groupId })
            .select('expenses');

        if (!group)
            return res
                .status(404)
                .json({ error: 'Group Error: Group Not Found' });

        expenses = group.expenses;
    } catch (error) {
        console.error(error.name, error.message);
        return res.status(500).json({ error: `Error: Internal Server Error` });
    }

    return res.status(200).json(expenses);
});

router.post('/:groupId/expenses', async (req, res) => {
    const groupId = req.params.groupId;
    const { paidBy, amountPaise, description, date } = req.body ?? {};

    let group;
    try {
        group = await groupModel
            .findOne({ groupId: groupId })
            .select('expenses members');

        if (!group)
            return res
                .status(404)
                .json({ error: 'Group Error: Group Not Found' });
    } catch (error) {
        console.error(error.name, error.message);
        return res.status(500).json({ error: 'Error: Internal Server Error' });
    }

    try {
        validateAmountPaise(amountPaise);
        validatePaidBy(paidBy, group.members);
        validateDescription(description);
        validateDate(date);
    } catch (error) {
        if (error instanceof CustomError) {
            console.error(error.name, error.message);
            return res
                .status(400)
                .json({ error: `${error.name}: ${error.message}` });
        }
        console.error(error.name, error.message);
        return res.status(500).json({ error: 'Error: Internal Server Error' });
    }

    group.expenses.push({
        paidBy: paidBy,
        amountPaise: amountPaise,
        description: description,
        date: date,
    });

    let newGroup;
    try {
        newGroup = await group.save();
    } catch (error) {
        if (error.name === 'ValidationError') {
            console.error(error.message);
            return res.status(400).json({ error: `Error: ${error.message}` });
        }
        console.error(error.name, error.message);
        return res.status(500).json({ error: 'Error: Internal Server Error' });
    }

    res.status(201).json(newGroup.expenses);
});

router.delete('/:groupId/expenses/:eid', async (req, res) => {
    const { groupId, eid } = req.params;

    let group;
    try {
        group = await groupModel
            .findOne({ groupId: groupId })
            .select('expenses');

        if (!group)
            return res
                .status(404)
                .json({ error: 'Group Error: Group Not Found' });
    } catch (error) {
        console.error(error.name, error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    const expense = group.expenses.id(eid);

    if (!expense)
        return res
            .status(404)
            .json({ error: 'Expense Error: Expense Not Found' });

    expense.deleteOne();

    try {
        await group.save();
    } catch (error) {
        if (error.name === 'ValidationError') {
            console.error(error.name, error.message);
            return res.status(400).json({ error: error.message });
        }
        console.error(error.message, error.name);
        return res.status(500).json({ error: 'Error: Internal Server Error' });
    }
    return res.status(200).json(group.expenses);
});

router.patch('/:groupId/expenses/:eid', async (req, res) => {
    const { groupId, eid } = req.params;
    const { paidBy, amountPaise, date, description } = req.body ?? {};

    let group;

    try {
        group = await groupModel
            .findOne({ groupId: groupId })
            .select('expenses members');

        if (!group)
            return res
                .status(404)
                .json({ error: 'Group Error: Group Not Found' });
    } catch (error) {
        console.error(error.name, error.message);
        return res.status(500).json({ error: 'Error: Internal Server Error' });
    }

    const expense = group.expenses.id(eid);

    if (!expense)
        return res
            .status(404)
            .json({ error: 'Expense Error: Expense Not Found' });

    try {
        if (!(amountPaise === undefined)) validateAmountPaise(amountPaise);
        if (!(paidBy === undefined)) validatePaidBy(paidBy, group.members);
        if (!(description === undefined)) validateDescription(description);
        if (!(date === undefined)) validateDate(date);
    } catch (error) {
        if (error instanceof CustomError) {
            console.error(error.name, error.message);
            return res
                .status(400)
                .json({ error: `${error.name}: ${error.message}` });
        }
        console.error(error.name, error.message);
        return res.status(500).json({ error: 'Error: Internal Server Error' });
    }

    if (!(paidBy === undefined)) expense.paidBy = paidBy;
    if (!(amountPaise === undefined)) expense.amountPaise = amountPaise;
    if (!(date === undefined)) expense.date = date;
    if (!(description === undefined)) expense.description = description;

    try {
        await group.save();
    } catch (error) {
        if (error.name === 'ValidationError') {
            console.error(error.name, error.message);
            return res.status(400).json({ error: error.message });
        }
        console.error(error.name, error.message);
        return res.status(500).json({ error: 'Error: Internal Server Error' });
    }

    return res.status(200).json(group.expenses);
});

router.get('/:groupId/balances', async (req, res) => {
    const groupId = req.params.groupId;

    let group;
    try {
        group = await groupModel
            .findOne({ groupId: groupId })
            .select('expenses members');

        if (!group)
            return res
                .status(404)
                .json({ error: 'Group Error: Group Not Found' });
    } catch (error) {
        console.error(error.name, error.message);
        return res.status(500).json({ error: 'Error: Internal Server Error' });
    }

    const memberWisePayments = {};
    const membersCount = group.members.length;

    // Creating Basic Structure of Member Wise Payments
    group.members.forEach((m) => {
        memberWisePayments[m] = {
            paid: 0,
            share: 0,
        };
    });

    for (const e of group.expenses) {
        const share = Math.floor(e.amountPaise / membersCount);
        const leftovers = e.amountPaise % membersCount;

        if (!memberWisePayments[e.paidBy]) {
            return res.status(409).json({
                error: 'Expense / Members Error: Unexpected Member Found in the Expenses. Please Delete the Expense with unexpected member',
            });
        }

        memberWisePayments[e.paidBy].paid =
            memberWisePayments[e.paidBy].paid + e.amountPaise;

        memberWisePayments[e.paidBy].share =
            memberWisePayments[e.paidBy].share + leftovers;

        group.members.forEach((m) => {
            memberWisePayments[m].share = memberWisePayments[m].share + share;
        });
    }

    const balances = group.members.map((m) => {
        return {
            member: m,
            paid: memberWisePayments[m].paid,
            share: memberWisePayments[m].share,
            balance: memberWisePayments[m].paid - memberWisePayments[m].share,
        };
    });

    return res.status(200).json(balances);
});

export default router;
