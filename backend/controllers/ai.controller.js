import aiService from "../services/ai.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const generateResponse = asyncHandler(async (req, res) => {
    const { ticketId } = req.params;
    const { lastMessage } = req.body;

    const aiResult = await aiService.draftGenerate(ticketId, lastMessage);

    return res.status(200).json({
        success: true,
        message: "Sucsess",
        draftMessage: aiResult
    });
})