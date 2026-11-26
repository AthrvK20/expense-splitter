import CustomError from './CustomError.js';

function validateGroupName(name) {
    if (typeof name === 'string' && name.trim().length > 0) {
        if (name.trim().length >= 200)
            throw new CustomError('Group Name Error', 'Group name too big');
        return name.trim();
    } else {
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
        throw new CustomError('Members Error', 'Invalid Members List');
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

function validateAmountPaise(amountPaise) {
    if (!Number.isInteger(amountPaise) || amountPaise < 1) {
        throw new CustomError('Amount Error', 'Invalid amountPaise');
    }
}

function validatePaidBy(paidBy, members) {
    if (!paidBy || !members.includes(paidBy)) {
        throw new CustomError('Payer Error', 'Invalid paidBy');
    }
}

function validateDescription(description) {
    if (description === undefined) return;
    if (typeof description !== 'string') {
        throw new CustomError('Description Error', 'Invalid Description');
    }
}

function validateDate(date) {
    if (date === undefined) return;
    if (date === null || new Date(date).toString() === 'Invalid Date') {
        throw new CustomError('Date Error', 'Invalid Date');
    }
}

export {
    validateGroupName,
    validateMembers,
    validateAmountPaise,
    validatePaidBy,
    validateDescription,
    validateDate,
};
