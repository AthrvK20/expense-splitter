import { Router } from 'express';
import { groupModel } from '../models/GroupSchema.js';

class CustomError extends Error {
    constructor(name, message) {
        super(message);
        this.name = name;
    }
}

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
                error: {
                    name: error.name,
                    message: error.message,
                },
            });
        } else {
            console.error(error.name, error.message);
            return res.status(500).json({
                error: { name: 'Error', message: 'Internal Server Error' },
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
                error: {
                    name: error.name,
                    message: error.message,
                },
            });
        } else {
            console.error(error.name, error.message);
            return res.status(500).json({
                error: { name: 'Error', message: 'Internal Server Error' },
            });
        }
    }
});

export default router;

function validateGroupName(name) {
    if(name.trim().length >= 200) throw new CustomError('Group Name Error', 'Group name too big')
    if (typeof name === 'string' && name.trim().length > 0) return name.trim();
    else {
        throw new CustomError('Group Name Error', 'Group name is not valid');
    }
}

function validateMembers(membersArr) {
    let members;
    if (Array.isArray(membersArr)) {
        members = membersArr
            .map((m) => {
                if (typeof m === 'string') {
                    if (m.length <= 100) return m.trim();
                    else
                        throw new CustomError(
                            'Members Error',
                            'Member name too large',
                        );
                } else {
                    throw new CustomError(
                        'Members Error',
                        'Member Name is not a String',
                    );
                }
            })
            .filter((m) => {
                return m.length > 0;
            });
    } else {
        throw new CustomError('Members Error', 'Members is not an array');
    }

    const membersSet = new Set(members.map((m) => m.toLowerCase()));

    if (membersSet.size === members.length) {
        if (members.length > 1) {
            return members;
        } else {
            throw new CustomError(
                'Members Error',
                'Members length is less than 2',
            );
        }
    } else {
        throw new CustomError('Members Error', 'Duplicate names');
    }
}
