import Book from "./book.model.js";
import Message from "./message.model.js";
import Ticket from "./ticket.model.js";
import User from "./user.model.js";

User.hasMany(Book, { foreignKey: 'author_id', as: 'books' });
Book.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

User.hasMany(Ticket, { foreignKey: 'user_id', as: 'ticket' });
Ticket.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Ticket.hasMany(Message, { foreignKey: "ticket_id", as: "message", });
Message.belongsTo(Ticket, { foreignKey: "ticket_id", as: "ticket", });

Ticket.belongsTo(Book, { foreignKey: 'book_id', as: 'book' });
Book.hasMany(Ticket, { foreignKey: 'book_id', as: 'ticket' });

User.hasMany(Message, { foreignKey: "sender_id", as: "sentMessages", });
Message.belongsTo(User, { foreignKey: "sender_id", as: "sender" });

export { User, Ticket, Book, Message };
