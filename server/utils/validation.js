import CustomError from './CustomError.js';

function validateGroupName(name) {
    if (name.trim().length >= 200)
        throw new CustomError('Group Name Error', 'Group name too big');
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

export { validateGroupName, validateMembers };
