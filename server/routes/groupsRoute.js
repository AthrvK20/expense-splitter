import { Router } from 'express';
import mongoose from 'mongoose';
import { groupModel } from '../models/GroupSchema.js';
import CustomError from '../utils/CustomError.js';
import { validateGroupName, validateMembers } from '../utils/validation.js';

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
        return res
            .status(201)
            .json({ message: 'created', groupDetails: group });
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
        group = await groupModel.findOne({ groupId: groupId });
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

    if (!Number.isInteger(amountPaise) || amountPaise < 1) {
        return res.status(400).json({ error: 'Invalid amountPaise' });
    }

    if (!paidBy || !group.members.includes(paidBy)) {
        return res.status(400).json({ error: 'Invalid paidBy' });
    }

    if (description && !(typeof description === 'string'))
        return res.status(400).json({ error: 'Invalid Description' });

    if (date && new Date(date).toString() === 'Invalid Date')
        return res.status(400).json({ error: 'Invalid Date' });

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
            console.error(error.message)
            return res.status(400).json({ error: `Error: ${error.message}` });
        }
        console.error(error.name, error.message);
        return res.status(500).json({ error: 'Error: Internal Server Error' });
    }

    res.status(201).json(newGroup.expenses[newGroup.expenses.length - 1]);
});

export default router;
