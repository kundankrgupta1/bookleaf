import { validationResult, matchedData } from "express-validator";
import { ApiError } from "../utils/ApiError";

export const validateRequest = (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        const errors = result.array().map(err => `${err.msg}`);
        throw new ApiError(400, `Error: ${errors}`)
    }

    req.validated = matchedData(req, {
        locations: ["body", "query", "params"],
        includeOptionals: true,
    });

    next();
};