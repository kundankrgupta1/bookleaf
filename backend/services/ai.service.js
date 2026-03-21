import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/service.config.js";
import { AI_MODELS, KB_MAP } from "../constant/constant.js";
import ticketService from "./ticket.service.js";

const genAI = new GoogleGenerativeAI(config.ai.geminiAPIKey);

const useModel = (type) => {
    return genAI.getGenerativeModel({
        model: AI_MODELS[type],
        generationConfig: { responseMimeType: "application/json" }
    });
}

class AIService {
    async classify(message, subject) {
        try {
            const prompt = `
                You are a support ticket classifier.

                Classify the ticket into:
                1. category
                2. priority

                Categories:
                - Royalty & Payments
                - ISBN & Metadata Issues
                - Printing & Quality
                - Distribution & Availability
                - Book Status & Production Updates
                - General Inquiry

                Priorities:
                - CRITICAL
                - HIGH
                - MEDIUM
                - LOW

                Rules:
                - Financial issues → HIGH/CRITICAL
                - ISBN issues → HIGH
                - Quality issues → HIGH
                - General questions → LOW/MEDIUM

                User Subject: ${subject}

                User message/query: ${message}

                Return ONLY JSON: {
                    "category": "...",
                    "priority": "..."
                }
            `;

            const result = await useModel('CLASSIFIER').generateContent(prompt);

            const text = result.response.text()
                .replace(/```json|```/g, "").trim();

            return JSON.parse(text);

        } catch (error) {
            return {
                category: "General Inquiry",
                priority: "MEDIUM",
            };
        };
    }

    async draftGenerate(ticketId, message) {
        try {
            const ticket = await ticketService.getOnlyTicket(ticketId);

            const category = ticket?.category;

            const kbContext = KB_MAP[category] || "";

            const prompt = `
                You are a BookLeaf support agent.

                Follow tone:
                - empathetic
                - professional
                - specific
                - include timelines

                Knowledge Base: ${kbContext}

                User Query: ${message}

                Write a helpful response.
            `;

            const result = await useModel('GENERATOR').generateContent(prompt);

            const text = result.response.text()

            return JSON.parse(text);
        } catch (error) {
            return "Please write manually, currently I'm down";
        };
    }
}

export default new AIService();