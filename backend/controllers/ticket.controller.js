import { Op } from "sequelize";
import aiService from "../services/ai.service.js";
import messageService from "../services/message.service.js";
import ticketService from "../services/ticket.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createTicket = asyncHandler(async (req, res) => {
    const { userId, role } = req.user;

    const { bookId, subject, description, attachments } = req.body;
    console.log(req.body);

    const aiResult = await aiService.classify(description, subject);

    const payload = {
        user_id: userId,
        book_id: bookId,
        ticket_number: Date.now(),
        subject,
        category: aiResult?.category,
        priority: aiResult?.priority
    };

    const result = await ticketService.createTicket(payload, description, attachments, role);

    return res.status(201).json({
        success: true,
        message: 'Ticket created successfully',
        ticket: result?.ticket,
        ticketMessage: result?.message
    });
});

export const createInternalNotes = asyncHandler(async (req, res) => {
    const { userId, role } = req.user;

    if (role !== 'ADMIN') {
        throw new ApiError(401, 'Only admin can create notes');
    }

    const { ticketId } = req.params;
    const { internalNotes } = req.body;

    const notes = await ticketService.createNotes({
        internal_notes_creator: userId,
        internal_notes: internalNotes,
        is_internal_note: true
    }, ticketId);

    return res.status(201).json({
        success: true,
        message: "Notes created",
        ticket: notes
    });
});

export const getAllTickets = asyncHandler(async (req, res) => {
    const { userId, role } = req.user;

    const { status, priority, ticket_number } = req.query;

    const where = {};

    if (role === 'AUTHOR') {
        where.user_id = userId;
    };

    if (status) {
        where.status = status
    } else {
        where.status = {
            [Op.in]: ['OPEN', 'IN-PROGRESS']
        }
    };

    if (priority) where.priority = priority;
    if (ticket_number) where.ticket_number = ticket_number;

    const result = await ticketService.getAllTickets(where, role);

    return res.status(200).json({
        success: true,
        message: 'Success',
        total: result?.count,
        tickets: result?.tickets
    })

});

export const getTicket = asyncHandler(async (req, res) => {
    const { role } = req.user;

    const { ticketId } = req.params;

    const ticket = await ticketService.getTicket(ticketId, role);

    return res.status(200).json({
        success: true,
        message: "Success",
        ticket
    });
});

export const assignTicket = asyncHandler(async (req, res) => {

    const { ticketId } = req.params;
    const { assigned_to } = req.body;

    const assigned = await ticketService.assignedTicket(assigned_to, ticketId);

    return res.status(200).json({
        success: true,
        message: "Ticket Assigned Successfully",
        ticket: assigned
    });
});

export const getAssignedTickets = asyncHandler(async (req, res) => {
    const { userId } = req.user;

    const tickets = await ticketService.assignedTickets(userId);

    return res.status(200).json({
        success: true,
        message: "Success",
        tickets
    });
});

export const updateTicket = asyncHandler(async (req, res) => {
    const { ticketId } = req.params;

    const updatedPayload = {};

    const allowedFields = ['category', 'priority', 'status'];

    for (const key in req.body) {
        if (allowedFields.includes(key) && req.body[key] !== undefined && req.body[key] !== null) {
            updatedPayload[key] = req.body[key];
        }
    };

    const ticket = await ticketService.updateTicketInfo(ticketId, updatedPayload);

    return res.status(200).json({
        success: true,
        message: 'Ticket details updated',
        ticket
    });
});