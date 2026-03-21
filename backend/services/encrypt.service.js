import bcrypt from "bcrypt";
import { ApiError } from "../utils/ApiError.js";

export const hashPassword = async (password) => {
    if (!password) {
        throw new ApiError(401, "Password is required");

    };

    const hashed = await bcrypt.hash(password, 10);

    return hashed;
};

export const comparePassword = async (password, hash) => {
    if (!password) {
        throw new ApiError(401, "Password is required");
    };

    if (!hash) {
        throw new ApiError(401, "Hash Password is required");
    };

    const isMatch = await bcrypt.compare(password, hash);

    return isMatch;
};

export const isPasswordHashed = async (password) => {
    if (!password) return;

    const isBcryptHash =
        password.startsWith("$2a$") ||
        password.startsWith("$2b$") ||
        password.startsWith("$2y$") ||
        password.startsWith("$2x$");

    if (!isBcryptHash) return false;

    return true;
};
