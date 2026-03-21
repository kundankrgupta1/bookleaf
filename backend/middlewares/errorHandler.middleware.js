import { ApiError } from "../utils/ApiError.js";

export const globalErrorHandler = (err, req, res, next) => {
    let error = err;

    if (!(err instanceof ApiError)) {
        const statusCode = err.statusCode || 500;
        const message = err.message || 'Internal Server Error';
        error = new ApiError(statusCode, message);
    }

    const message = error.message;
    const status = error.statusCode;
    const path = req.originalUrl;
    const method = req.method;

    console.error(`🐞 Error : ${method} – ${path} | ${status} – ${message}`);

    const response = {
        success: false,
        message: error.message,
        ...(error.errors && error.errors.length > 0 && { errors: error.errors })
    };

    res.status(error.statusCode).json(response);
};
