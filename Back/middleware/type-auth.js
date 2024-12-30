const { UnauthenticatedError } = require('../errors');


const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.accountType)) {
            throw new UnauthenticatedError('Access denied');
        }
        next();
    };
};

module.exports = authorizeRoles;
