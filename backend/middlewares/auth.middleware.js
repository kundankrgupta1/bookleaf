import { verifyToken } from "../services/tokens.service.js";
import { ApiError } from "../utils/ApiError.js";

const authMiddleware = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];

        if (!accessToken || accessToken === "undefined") {
            throw new ApiError(401, "Token Expired or not provided");
        };

        const decoded = verifyToken(accessToken);

        if (!decoded) {
            throw new ApiError(401, "Unauthorized access! Invalid token");
        };

        req.user = decoded;

        next();
    } catch (error) {
        next(error);

    };
}

export default authMiddleware;