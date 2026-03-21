import { Op } from 'sequelize';
import { User } from '../models/index.model.js';
import { ApiError } from '../utils/ApiError.js';

class UserService {
    async createUser(payload) {
        try {
            const isExist = await User.findOne({
                where: {
                    [Op.or]: [
                        { email: payload?.email },
                        { phone: payload?.phone }
                    ]
                }
            });

            if (isExist) {
                throw new ApiError(409, `${payload.role === 'AUTHOR' ? 'Author' : 'Admin'} already exist`);
            };

            const user = await User.create(payload);

            return user;
        } catch (error) {
            throw error;
        }
    }

    async getAdminList() {
        try {
            const list = await User.findAll({
                where: {
                    role: 'ADMIN'
                },
                attributes: ['id', 'name', 'role']
            });

            const admins = list.map(l => l.toJSON());

            return admins;
        } catch (error) {
            throw error;
        }
    }

    async getUser(where, excludePassword = true) {
        try {
            const user = await User.findOne({
                where,
                ...(excludePassword
                    ? {
                        attributes: {
                            exclude: ['password']
                        }
                    }
                    : {}
                )
            });

            if (!user) {
                throw new ApiError(404, 'User not found');
            };

            return user.toJSON();
        } catch (error) {
            throw error;
        }
    }
}

export default new UserService();
