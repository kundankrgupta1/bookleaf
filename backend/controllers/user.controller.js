import { comparePassword, hashPassword } from "../services/encrypt.service.js";
import { accessToken } from "../services/tokens.service.js";
import userService from "../services/user.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const userRegistration = asyncHandler(async (req, res) => {

    const { name, email, phone, password, city, joiningDate, role = 'AUTHOR' } = req.body;

    const encryptPassword = await hashPassword(password);

    const user = await userService.createUser({
        name, email, phone, role, city,
        password: encryptPassword,
        joined_date: joiningDate,
    });

    return res.status(201).json({
        success: true,
        message: 'Registration success',
        user
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const where = { email };

    const user = await userService.getUser(where, false);

    const isMatch = await comparePassword(password, user?.password);

    if (!isMatch) {
        throw new ApiError(401, 'Wrong credential');
    }

    const token = accessToken({
        userId: user?.id,
        role: user?.role
    });

    return res.status(200).json({
        success: true,
        message: 'Login Successfully',
        user: {
            id: user?.id,
            email: user?.email,
            role: user?.role,
            name: user?.name,
            joiningDate: user?.joined_date
        },
        token
    });
});

export const getUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const where = { id: userId }

    const user = await userService.getUser(where);

    return res.status(200).json({
        success: true,
        message: 'Success',
        user
    });
});

export const getAdminsList = asyncHandler(async (_req, res) => {

    const list = await userService.getAdminList();

    return res.status(200).json({
        success: true,
        message: 'Success',
        admins: list
    });
});
