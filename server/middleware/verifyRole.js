// Verifies the role of the logged in user
const verifyRole = (allowedRole) => {
    return (req, res, next) => {
        if (!req?.role) return res.sendStatus(401);

        const result = req.role.localeCompare(allowedRole);

        if (!result == 0) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRole