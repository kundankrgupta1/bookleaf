import { fn } from "sequelize";
import { Book, User, Message, Ticket, } from "../models/index.model.js";
import { ApiError } from "../utils/ApiError.js";
import messageService from "./message.service.js";

class TicketService {

    async createTicket(payload, description, attachments) {
        try {
            const rawTicket = await Ticket.create(payload);
            const ticket = rawTicket.toJSON();

            const message = await messageService.sendMessage({
                ticket_id: ticket?.id,
                sender_id: payload?.user_id,
                sender_role: 'AUTHOR',
                message: description,
                attachments: attachments
            });

            delete ticket.is_internal_note;
            delete ticket.internal_notes;
            delete ticket.internal_notes_creator;
            delete ticket.assigned_to;

            return { ticket, message };
        } catch (error) {
            throw error;
        }
    }

    async getAllTickets(where) {
        try {
            const { rows, count } = await Ticket.findAndCountAll({
                where,
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'email']
                    },
                    {
                        model: Message,
                        as: 'message',
                        attributes: ['id', 'message', 'updated_at'],
                        separate: true,
                        limit: 1,
                        order: [['updated_at', 'DESC']]
                    }
                ],
                attributes: ['id', 'ticket_number', 'subject', 'category', 'priority', 'status'],
                order: [
                    ['created_at', 'DESC']
                ]
            })

            const tickets = rows.map((t) => t.toJSON());

            return { tickets, count };
        } catch (error) {
            throw error;
        }
    }

    async getTicket(ticketId, role) {
        try {
            const ticket = await Ticket.findByPk(ticketId, {
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'email']
                    },
                    {
                        model: Book,
                        as: 'book',
                        attributes: ['id', 'title', 'publication_date']
                    },
                    {
                        model: Message,
                        as: 'message',
                        order: [['updated_at', 'ASC']]
                    }
                ],
                ...(role === 'AUTHOR'
                    ? {
                        attributes: {
                            exclude: ['internal_notes', 'is_internal_note', 'internal_notes_creator', 'assigned_to']
                        }
                    }
                    : {}
                )
            });

            if (!ticket) {
                throw new ApiError(401, 'Ticket not found');
            };

            return ticket.toJSON();
        } catch (error) {
            throw error;
        }
    }

    async assignedTicket(userId, ticketId) {
        try {
            const ticket = await Ticket.findByPk(ticketId);

            if (!ticket) {
                throw new ApiError(401, 'Ticket not found');
            }

            ticket.assigned_to = userId;
            ticket.save();

            return true;
        } catch (error) {
            throw error;
        }
    }

    async createNotes(payload, ticketId) {
        try {
            const ticket = await Ticket.findByPk(ticketId);

            if (!ticket) {
                throw new ApiError(401, 'Ticket not found');
            };

            const update = await ticket.update(payload);

            return update.toJSON();
        } catch (error) {
            throw error;
        }
    }

    async assignedTickets(userId) {
        try {
            const tickets = await Ticket.findAll({
                where: {
                    assigned_to: userId
                }
            });

            return tickets.map((t) => t.toJSON());
        } catch (error) {
            throw error;
        }
    }

    async getOnlyTicket(ticketId) {
        const ticket = await Ticket.findByPk(ticketId);

        if (!ticket) {
            throw new ApiError(401, 'Ticket not found');
        };

        return ticket.toJSON();
    }

    async updateTicketInfo(ticketId, payload) {
        const ticket = await Ticket.findByPk(ticketId);

        if (!ticket) {
            throw new ApiError(401, 'Ticket not found');
        };

        const update = ticket.update(payload);

        return update;
    }
}

export default new TicketService();
