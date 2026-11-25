import { Router } from 'express';
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

export default router;
