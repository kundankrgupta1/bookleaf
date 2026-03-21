import { ApiError } from "../utils/ApiError.js";

export const roleGuardMiddleware = (...allowedRoles) => {
    return (req, _res, next) => {
        const { role } = req.user;

        if (!allowedRoles.includes(role)) {
            throw new ApiError(403, "Unauthorized Access");
        }

        next();
    };
};