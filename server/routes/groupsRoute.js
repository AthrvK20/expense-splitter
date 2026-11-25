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

export default router;
