import messageService from "../services/message.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const sendMessage = asyncHandler(async (req, res) => {
    const { userId, role } = req.user;
    const { ticketId } = req.params;
    const { message, attachments } = req.body;

    const sent = await messageService.sendMessage({
        ticket_id: ticketId,
        sender_id: userId,
        sender_role: role,
        message,
        attachments,
    });

    const io = req.app.get("io");

    io.to(String(ticketId)).emit("new_message", sent);

    return res.status(201).json({
        success: true,
        message: 'Message sent',
        ticketMessage: sent
    });
});

export const getMessages = asyncHandler(async (req, res) => {
    const { ticketId } = req.params;

    const messages = await messageService.getAllMessages(ticketId);

    return res.status(200).json({
        success: true,
        message: 'Success',
        ticketMessages: messages
    });
});