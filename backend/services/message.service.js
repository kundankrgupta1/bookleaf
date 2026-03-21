import { Message, Ticket } from "../models/index.model.js";
import { ApiError } from "../utils/ApiError.js";

class MessageService {

    async sendMessage(payload) {
        try {
            const ticket = await Ticket.findByPk(payload?.ticket_id);
            if (!ticket) throw new ApiError(401, 'Ticket not found');

            if (ticket.user_id !== payload.sender_id && payload.sender_role !== "ADMIN") {
                throw new ApiError(403, "Not allowed to send message to this ticket");
            }

            const message = await Message.create(payload);

            return message;
        } catch (error) {
            throw error;
        }
    }

    async getAllMessages(ticket_id) {
        try {
            const ticket = await Ticket.findByPk(ticket_id);
            if (!ticket) throw new ApiError(401, 'Ticket not found');

            const rawMessages = await Message.findAll({
                where: { ticket_id },
                order: [
                    ['created_at', 'ASC']
                ]
            });

            const messages = rawMessages.map((message) => message.toJSON());

            return messages;
        } catch (error) {
            throw error;
        }
    }
}

export default new MessageService();
