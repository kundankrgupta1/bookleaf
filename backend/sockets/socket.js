import { Server } from "socket.io";
import { ApiError } from "../utils/ApiError.js";
import ticketService from "../services/ticket.service.js";
import { verifyToken } from "../services/tokens.service.js";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST']
        }
    })

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;

        if (!token) return next(new Error("Unauthorized"));

        try {
            const user = verifyToken(token);
            socket.user = user;
            next();
        } catch {
            next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        socket.on("join_ticket", async (ticketId) => {
            try {
                const user = socket.user;
    
                const ticket = await ticketService.getOnlyTicket(ticketId);
    
                if (!ticket) {
                    return socket.emit("error", "Ticket not found");
                }
    
                if (ticket.user_id !== user.userId && user.role !== "ADMIN") {
                    return socket.emit("error", "Unauthorized access");
                }
    
                socket.join(String(ticketId));
            } catch (error) {
                console.error("Error occurred while joining ticket:", error);
                socket.emit("error", "Failed to join ticket");
            }
        });

        // Leave ticket room
        socket.on("leave_ticket", (ticketId) => {
            socket.leave(ticketId);
        });

        socket.on("disconnect", () => {
            console.log("❌ User disconnected:", socket.id);
        });
    });
    return io;
};

export const getIO = () => {
    if (!io) throw new ApiError(401, "Socket not initialized");
    return io;
};