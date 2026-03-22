# 📚 BookLeaf — Self-Publishing Platform

BookLeaf is a full-stack self-publishing platform that connects **Authors** and **Admins** through a structured workflow covering book management, royalty tracking, real-time support chat, and AI-powered ticket handling.

----

## 🗂️ Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Roles & Access Control](#roles--access-control)
- [Backend API Reference](#backend-api-reference)
  - [Auth APIs](#auth-apis)
  - [User APIs](#user-apis)
  - [Book APIs](#book-apis)
  - [Ticket APIs](#ticket-apis)
  - [Message APIs](#message-apis)
  - [AI APIs](#ai-apis)
- [WebSocket Events](#websocket-events)
- [Database Models](#database-models)
- [Frontend Functionality](#frontend-functionality)
  - [Authentication](#authentication)
  - [Dashboard](#dashboard)
  - [Books (Author)](#books-author)
  - [Support & Chat](#support--chat)
  - [Profile](#profile)
  - [Sidebar & Navigation](#sidebar--navigation)

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express v5 | REST API server |
| PostgreSQL + Sequelize | Relational database & ORM |
| Socket.IO v4 | Real-time WebSocket chat |
| JSON Web Token (JWT) | Authentication & authorization |
| bcrypt | Password hashing |
| Google Gemini AI | Ticket classification & AI draft responses |
| dotenv | Environment variable management |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite 8 | UI framework & build tool |
| React Router v7 | Client-side routing |
| Axios | HTTP API calls |
| Socket.IO Client v4 | Real-time WebSocket connection |
| Tailwind CSS v4 | Utility-first styling |
| React Icons | Icon library |

---

## 📁 Project Structure

```
bookleaf/
├── backend/
│   ├── app/
│   │   └── app.js                  # Express app setup, CORS, routes
│   ├── config/
│   │   ├── database.config.js      # Sequelize PostgreSQL connection
│   │   └── service.config.js       # Centralized env config
│   ├── constant/
│   │   └── constant.js             # Enums, AI models, KB knowledge base
│   ├── controllers/
│   │   ├── user.controller.js
│   │   ├── book.controller.js
│   │   ├── ticket.controller.js
│   │   ├── message.controller.js
│   │   └── ai.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js       # JWT verification
│   │   ├── roleGuard.middleware.js  # RBAC role check
│   │   ├── validate.middleware.js   # Request validation
│   │   └── errorHandler.middleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── book.model.js
│   │   ├── ticket.model.js
│   │   ├── message.model.js
│   │   └── index.model.js          # Associations
│   ├── routes/
│   │   ├── index.routes.js
│   │   ├── user.routes.js
│   │   ├── book.routes.js
│   │   ├── ticket.routes.js
│   │   ├── message.routes.js
│   │   └── ai.routes.js
│   ├── services/
│   │   ├── user.service.js
│   │   ├── book.service.js
│   │   ├── ticket.service.js
│   │   ├── message.service.js
│   │   ├── ai.service.js
│   │   ├── encrypt.service.js
│   │   └── tokens.service.js
│   ├── sockets/
│   │   └── socket.js               # Socket.IO initialization & events
│   ├── utils/
│   │   ├── ApiError.js
│   │   └── asyncHandler.js
│   └── index.js                    # Entry point — server + socket bootstrap
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axiosInstance.js     # Axios with base URL + auth interceptor
    │   ├── authentication/
    │   │   ├── Login.jsx
    │   │   └── Signup.jsx
    │   ├── components/
    │   │   ├── Button.jsx
    │   │   ├── InputFields.jsx
    │   │   └── Loader.jsx
    │   ├── constants/
    │   │   └── constant.js          # Ticket status, priority maps
    │   ├── context/
    │   │   └── AuthContext.jsx      # Global auth state
    │   ├── Layout/
    │   │   └── Sidebar.jsx          # Role-aware sidebar navigation
    │   ├── pages/
    │   │   ├── Dashboard/
    │   │   ├── Books/
    │   │   │   ├── Books.jsx        # Book listing with pagination
    │   │   │   ├── AddBook.jsx      # Add book modal
    │   │   │   └── Book.jsx         # Single book view
    │   │   ├── Support/
    │   │   │   ├── Support.jsx      # Admin support + real-time chat
    │   │   │   ├── AuthorSupport.jsx # Author support + real-time chat
    │   │   │   ├── CreateTicket.jsx # Create ticket modal
    │   │   │   └── Ticket.jsx       # Ticket detail page
    │   │   └── User/
    │   │       └── Profile.jsx
    │   ├── routes/
    │   │   ├── Routes.jsx           # Route definitions
    │   │   └── RouteGuard.jsx       # Private route protection
    │   └── utils/
    │       └── socket.js            # Socket.IO client instance
    └── .env
```

---

## 🔑 Environment Variables

### Backend `.env`

```env
# Server
NODE_ENV=development
HOST=localhost
PORT=3001
APPLICATION_NAME=bookleaf_backend
FRONTEND_URL=http://localhost:5173

# JWT
ACCESS_TOKEN_SECRET_KEY=your_access_secret
ACCESS_TOKEN_SECRET_KEY_EXPIRY=30m
REFRESH_TOKEN_SECRET_KEY=your_refresh_secret
REFRESH_TOKEN_SECRET_KEY_EXPIRY=7d
INVITE_SECRET=your_invite_secret
INVITE_SECRET_EXPIRY=7d

# PostgreSQL
DB_SERVER_URI=postgres://user:password@host:port/dbname?sslmode=require
DB_NAME=bookleaf
DB_HOST=your_db_host
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
SSL_MODE=require
DB_CERTIFICATE=./public/certificate.crt
DB_DIALECT=postgres
DB_LOGGING=false

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Email (SMTP)
SMTP_FROM=your_email@gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# OAuth
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
```

### Frontend `.env`

```env
VITE_BASE_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

> ⚠️ `VITE_BASE_URL` is used for all REST API calls via Axios. `VITE_SOCKET_URL` must point to the **root server URL** (without `/api`) for Socket.IO to connect correctly.

---

## 🚀 Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

Server starts at `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App starts at `http://localhost:5173`

---

## 🔐 Roles & Access Control

BookLeaf has two user roles. Every protected API requires a valid JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

| Role | Description |
|---|---|
| `AUTHOR` | Self-publishing author. Can manage their books, create support tickets, and chat. |
| `ADMIN` | Platform administrator. Full access to all tickets, books, user management, and AI tools. |

The `roleGuardMiddleware` enforces role-specific access. If a user's role does not match, the API returns `403 Forbidden`.

---

## 📡 Backend API Reference

**Base URL:** `http://localhost:3001/api`

All response bodies follow this structure:
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

---

### Auth APIs

#### `POST /api/user/register`
Register a new user. No authentication required.

**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "StrongPassword123",
  "city": "Mumbai",
  "joiningDate": "2024-01-15",
  "role": "AUTHOR"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | ✅ | Full name |
| `email` | string | ✅ | Must be unique |
| `phone` | string | ✅ | Must be unique |
| `password` | string | ✅ | Will be bcrypt hashed |
| `city` | string | ❌ | Optional |
| `joiningDate` | string (date) | ✅ | ISO date string |
| `role` | string | ❌ | Defaults to `AUTHOR`. Values: `AUTHOR`, `ADMIN` |

**Response:**
```json
{
  "success": true,
  "message": "Registration success",
  "user": { "id": "uuid", "name": "...", "email": "...", "role": "AUTHOR" }
}
```

---

#### `POST /api/user/login`
Login with email and password. Returns a JWT access token.

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "StrongPassword123"
}
```

| Field | Type | Required |
|---|---|---|
| `email` | string | ✅ |
| `password` | string | ✅ |

**Response:**
```json
{
  "success": true,
  "message": "Login Successfully",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "role": "AUTHOR",
    "name": "John Doe",
    "joiningDate": "2024-01-15"
  },
  "token": "eyJhbGci..."
}
```

> The returned `token` must be stored by the frontend and sent in all subsequent requests as `Authorization: Bearer <token>`.

---

### User APIs

#### `GET /api/user/:userId`
Fetch a single user's profile by their UUID.

**Access:** `AUTHOR`, `ADMIN` (authenticated)

**URL Params:**
| Param | Type | Required |
|---|---|---|
| `userId` | UUID string | ✅ |

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "city": "Mumbai",
    "role": "AUTHOR",
    "joined_date": "2024-01-15T00:00:00.000Z"
  }
}
```

---

#### `GET /api/user/list`
Fetch the list of all admin users. Used when assigning tickets to an admin.

**Access:** `ADMIN` only

**Response:**
```json
{
  "success": true,
  "admins": [
    { "id": "uuid", "name": "Admin Name", "email": "admin@example.com" }
  ]
}
```

---

### Book APIs

#### `POST /api/book`
Create / submit a new book for publishing. The book starts in `EDITING` status.

**Access:** `AUTHOR` only

**Request Body:**
```json
{
  "title": "My First Book",
  "genre": ["Fiction", "Drama"],
  "language": "ENGLISH",
  "file": "https://link-to-manuscript.pdf"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | ✅ | Book title |
| `genre` | array of strings | ✅ | One or more genres, sent as comma-separated string from frontend and split into array |
| `language` | string | ✅ | One of: `ENGLISH`, `HINDI`, `URDU`, `BENGALI`, `TAMIL`, `TELUGU`, `FRENCH`, `GERMAN` |
| `file` | string | ✅ | Manuscript file URL or path |

**Response:**
```json
{
  "success": true,
  "message": "Book added successfully",
  "book": {
    "id": "uuid",
    "title": "My First Book",
    "status": "Editing",
    "language": "ENGLISH",
    "genre": ["Fiction", "Drama"],
    "author_id": "uuid"
  }
}
```

---

#### `GET /api/book`
Fetch all books. Authors see only their own books; Admins see all books.

**Access:** `AUTHOR`, `ADMIN` (authenticated)

**Query Parameters:**
| Param | Type | Required | Notes |
|---|---|---|---|
| `page` | number | ❌ | Default: `1` |
| `limit` | number | ❌ | Default: `5` |
| `genre` | string | ❌ | Filter by genre |
| `language` | string | ❌ | Filter by language |
| `publication_date` | string | ❌ | Filter by publication date |

**Response:**
```json
{
  "success": true,
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 20,
    "totalPages": 4
  },
  "books": [...]
}
```

---

#### `GET /api/book/state`
Get author-level publishing statistics (total books, royalty summary, etc.).

**Access:** `AUTHOR` only

**Response:**
```json
{
  "success": true,
  "states": {
    "totalBooks": 5,
    "totalRoyaltyEarned": 15000.00,
    "royaltyPaid": 10000.00,
    "royaltyPending": 5000.00
  }
}
```

---

#### `GET /api/book/list`
Fetch a lightweight list of the author's books (id + title only). Used in the Create Ticket dropdown.

**Access:** `AUTHOR` only

**Response:**
```json
{
  "success": true,
  "books": [
    { "id": "uuid", "title": "My First Book" }
  ]
}
```

---

#### `GET /api/book/:bookId`
Fetch full details of a single book by its UUID.

**Access:** `AUTHOR` only

**URL Params:**
| Param | Type | Required |
|---|---|---|
| `bookId` | UUID string | ✅ |

**Response:**
```json
{
  "success": true,
  "book": {
    "id": "uuid",
    "title": "My First Book",
    "isbn": "978-XXXXXXXXXX",
    "genre": ["Fiction"],
    "language": "ENGLISH",
    "status": "Published & Live",
    "mrp": 299.00,
    "author_royalty_per_copy": 40,
    "total_copies_sold": 150,
    "total_royalty_earned": 6000.00,
    "royalty_paid": 4000.00,
    "royalty_pending": 2000.00,
    "print_partner": "Repro India",
    "available_on": ["AMAZON_IND", "FLIPKART"],
    "publication_date": "2024-06-01"
  }
}
```

---

#### `PUT /api/book/update/:bookId`
Update book details like status, ISBN, cover, royalty info, print partner, and marketplace availability.

**Access:** `ADMIN` only

**URL Params:**
| Param | Type | Required |
|---|---|---|
| `bookId` | UUID string | ✅ |

**Request Body (all fields optional, only send what needs updating):**
```json
{
  "isbn": "978-XXXXXXXXXX",
  "cover": { "front": "url", "back": "url" },
  "publication_date": "2024-06-01",
  "status": "Published & Live",
  "mrp": 299.00,
  "author_royalty_per_copy": 40,
  "total_royalty_earned": 6000.00,
  "royalty_paid": 4000.00,
  "royalty_pending": 2000.00,
  "last_royalty_payout_date": "2024-09-30",
  "print_partner": "Repro India",
  "available_on": ["AMAZON_IND", "FLIPKART", "BOOKLEAF_STORE"]
}
```

**Allowed `status` values:** `Editing`, `Published & Live`, `In-Progress & Cover Design`, `In-Production & Typesetting`

**Allowed `print_partner` values:** `In-House`, `Repro India`, `Epitom Books`

**Allowed `available_on` values:** `AMAZON_US`, `AMAZON_UK`, `AMAZON_IND`, `FLIPKART`, `BOOKLEAF_STORE`

**Response:**
```json
{
  "success": true,
  "message": "Book updated successfully",
  "book": { ... }
}
```

---

### Ticket APIs

#### `POST /api/ticket`
Create a new support ticket. The description is automatically sent to the AI classifier which determines the **category** and **priority** of the ticket. An initial message is also created alongside the ticket.

**Access:** `AUTHOR` only

**Request Body:**
```json
{
  "bookId": "uuid",
  "subject": "Royalty payment not received",
  "description": "I have not received my Q3 royalty payment yet. It has been 60 days.",
  "attachments": null
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `bookId` | UUID string | ❌ | Optional — link ticket to a specific book |
| `subject` | string | ✅ | Short summary of the issue |
| `description` | string | ✅ | Detailed description, used by AI classifier |
| `attachments` | string/null | ❌ | File reference |

**Response:**
```json
{
  "success": true,
  "message": "Ticket created successfully",
  "ticket": {
    "id": "uuid",
    "ticket_number": "1711027200000",
    "subject": "Royalty payment not received",
    "category": "Royalty & Payments",
    "priority": "HIGH",
    "status": "OPEN",
    "user_id": "uuid"
  },
  "ticketMessage": {
    "id": "uuid",
    "message": "I have not received my Q3 royalty payment yet...",
    "sender_role": "AUTHOR"
  }
}
```

**AI Auto-Classified Categories:**
- `Royalty & Payments`
- `ISBN & Metadata Issues`
- `Printing & Quality`
- `Distribution & Availability`
- `Book Status & Production Updates`
- `General Inquiry`

**Auto-Classified Priority values:** `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`

---

#### `GET /api/ticket`
Fetch all tickets. Authors get only their own tickets; Admins get all tickets. Default filter: `OPEN` and `IN-PROGRESS` statuses only.

**Access:** `AUTHOR`, `ADMIN` (authenticated)

**Query Parameters:**
| Param | Type | Required | Notes |
|---|---|---|---|
| `status` | string | ❌ | One of: `OPEN`, `IN-PROGRESS`, `RESOLVED`, `CLOSED`. If omitted, returns `OPEN` + `IN-PROGRESS` |
| `priority` | string | ❌ | One of: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW` |
| `ticket_number` | string | ❌ | Exact match search by ticket number |

**Response:**
```json
{
  "success": true,
  "total": 12,
  "tickets": [
    {
      "id": "uuid",
      "ticket_number": "1711027200000",
      "subject": "Royalty issue",
      "category": "Royalty & Payments",
      "priority": "HIGH",
      "status": "OPEN",
      "user": { "id": "uuid", "name": "John Doe", "avatar": null },
      "message": [{ "message": "First message preview..." }]
    }
  ]
}
```

---

#### `GET /api/ticket/:ticketId`
Fetch full details of a single ticket including all its messages and associated book.

**Access:** `AUTHOR`, `ADMIN` (authenticated)

**URL Params:**
| Param | Type | Required |
|---|---|---|
| `ticketId` | UUID string | ✅ |

**Response:**
```json
{
  "success": true,
  "ticket": {
    "id": "uuid",
    "subject": "Royalty issue",
    "category": "Royalty & Payments",
    "priority": "HIGH",
    "status": "OPEN",
    "ticket_number": "1711027200000",
    "assigned_to": "admin_uuid or null",
    "book": { "id": "uuid", "title": "My Book" },
    "message": [
      {
        "id": "uuid",
        "message": "Text content",
        "sender_id": "uuid",
        "sender_role": "AUTHOR",
        "attachments": null,
        "createdAt": "2024-03-21T10:00:00.000Z"
      }
    ]
  }
}
```

---

#### `PATCH /api/ticket/assign/:ticketId`
Assign a ticket to the currently logged-in admin.

**Access:** `ADMIN` only

**URL Params:**
| Param | Type | Required |
|---|---|---|
| `ticketId` | UUID string | ✅ |

**No Request Body required.** The admin's ID from the JWT is used automatically.

**Response:**
```json
{
  "success": true,
  "message": "Ticket Assigned Successfully",
  "ticket": { "id": "uuid", "assigned_to": "admin_uuid", ... }
}
```

---

#### `GET /api/ticket/assigned-tickets`
Fetch all tickets assigned to the currently logged-in admin.

**Access:** `ADMIN` only

**Response:**
```json
{
  "success": true,
  "tickets": [...]
}
```

---

#### `PATCH /api/ticket/notes/:ticketId`
Add internal admin notes to a ticket. These notes are not visible to the author.

**Access:** `ADMIN` only

**URL Params:**
| Param | Type | Required |
|---|---|---|
| `ticketId` | UUID string | ✅ |

**Request Body:**
```json
{
  "internalNotes": "Author has been contacted. Awaiting finance team approval."
}
```

| Field | Type | Required |
|---|---|---|
| `internalNotes` | string | ✅ |

**Response:**
```json
{
  "success": true,
  "message": "Notes created",
  "ticket": { ... }
}
```

---

#### `PUT /api/ticket/update/:ticketId`
Update ticket metadata — category, priority, or status.

**Access:** `ADMIN` only

**URL Params:**
| Param | Type | Required |
|---|---|---|
| `ticketId` | UUID string | ✅ |

**Request Body (send only the fields to update):**
```json
{
  "status": "IN-PROGRESS",
  "priority": "CRITICAL",
  "category": "Royalty & Payments"
}
```

| Field | Allowed Values |
|---|---|
| `status` | `OPEN`, `IN-PROGRESS`, `RESOLVED`, `CLOSED` |
| `priority` | `CRITICAL`, `HIGH`, `MEDIUM`, `LOW` |
| `category` | `Royalty & Payments`, `ISBN & Metadata Issues`, `Printing & Quality`, `Distribution & Availability`, `Book Status & Production Updates`, `General Inquiry` |

**Response:**
```json
{
  "success": true,
  "message": "Ticket details updated",
  "ticket": { ... }
}
```

---

### Message APIs

#### `POST /api/message/:ticketId/send`
Send a message within a ticket conversation. After saving to the database, the message is **broadcast to all connected Socket.IO clients** in that ticket's room via the `new_message` event.

**Access:** `AUTHOR`, `ADMIN` (authenticated — author can only message their own tickets)

**URL Params:**
| Param | Type | Required |
|---|---|---|
| `ticketId` | UUID string | ✅ |

**Request Body:**
```json
{
  "message": "Can you please update me on the payment status?",
  "attachments": null
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `message` | string | ✅ | Message text content |
| `attachments` | string/null | ❌ | File reference |

**Response:**
```json
{
  "success": true,
  "message": "Message sent",
  "ticketMessage": {
    "id": "uuid",
    "ticket_id": "uuid",
    "sender_id": "uuid",
    "sender_role": "AUTHOR",
    "message": "Can you please update me on the payment status?",
    "attachments": null,
    "createdAt": "2024-03-21T12:00:00.000Z"
  }
}
```

---

#### `GET /api/message/:ticketId/messages`
Fetch all messages for a ticket, ordered by `created_at ASC`.

**Access:** `AUTHOR`, `ADMIN` (authenticated)

**URL Params:**
| Param | Type | Required |
|---|---|---|
| `ticketId` | UUID string | ✅ |

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "ticketMessages": [
    {
      "id": "uuid",
      "ticket_id": "uuid",
      "sender_id": "uuid",
      "sender_role": "AUTHOR",
      "message": "My royalty is delayed.",
      "attachments": null,
      "createdAt": "2024-03-21T10:00:00.000Z"
    }
  ]
}
```

---

### AI APIs

#### `POST /api/ai/:ticketId/draft`
Generate an AI-drafted response for the admin. The AI uses the ticket's category to pull the relevant knowledge base context (royalty policy, ISBN policy, etc.) and drafts a professional, empathetic reply to the author's last message.

**Access:** `ADMIN` only

**URL Params:**
| Param | Type | Required |
|---|---|---|
| `ticketId` | UUID string | ✅ |

**Request Body:**
```json
{
  "lastMessage": "I still haven't received my royalty for Q3. It's been 60 days."
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `lastMessage` | string | ✅ | The last message from the author that the AI should respond to |

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "draftMessage": "Dear Author, I understand your concern regarding the Q3 royalty payment. As per our policy, royalties are calculated quarterly and paid within 45 days after the quarter ends..."
}
```

> If the AI service is unavailable, a fallback string `"Please write manually, currently I'm down"` is returned.

**AI Models Used:**
| Task | Model |
|---|---|
| Ticket classification (on create) | `gemini-2.0-flash` |
| Draft response generation | `gemini-2.5-flash` |

---

## 🔌 WebSocket Events

BookLeaf uses Socket.IO for real-time bidirectional communication in the support chat.

**Connection URL:** `http://localhost:3001` (root server, not `/api`)

### Authentication
The socket connection requires a JWT token passed via the `auth` option:

```js
const socket = io("http://localhost:3001", {
  auth: (cb) => cb({ token: localStorage.getItem("token") }),
  transports: ["websocket"]
});
```

The server validates the token via the Socket.IO middleware before allowing connection. Invalid or missing tokens result in an `Unauthorized` error and the connection is rejected.

---

### Client → Server Events

#### `join_ticket`
Join a specific ticket's chat room to start receiving real-time messages.

```js
socket.emit("join_ticket", ticketId); // ticketId: UUID string
```

The server validates that the connected user is either the ticket owner (AUTHOR) or an ADMIN. Unauthorized access emits an `error` event back.

---

#### `leave_ticket`
Leave a ticket's chat room. Called when the user navigates away from a ticket.

```js
socket.emit("leave_ticket", ticketId); // ticketId: UUID string
```

---

### Server → Client Events

#### `new_message`
Emitted to all clients in the ticket room when a new message is sent via `POST /api/message/:ticketId/send`.

```js
socket.on("new_message", (message) => {
  // message: { id, ticket_id, sender_id, sender_role, message, attachments, createdAt }
  setMessages(prev => [...prev, message]);
});
```

---

#### `error`
Emitted when a socket operation fails (e.g., unauthorized ticket access, ticket not found).

```js
socket.on("error", (errorMessage) => {
  console.error(errorMessage); // "Ticket not found" | "Unauthorized access"
});
```

---

## 🗄️ Database Models

### User
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | STRING | Required |
| `email` | STRING | Unique, required |
| `phone` | STRING | Unique, required |
| `password` | STRING | bcrypt hashed |
| `city` | STRING | Optional |
| `joined_date` | DATE | Required |
| `role` | ENUM | `AUTHOR`, `ADMIN` |

### Book
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `author_id` | UUID | FK → User |
| `title` | STRING | Required |
| `manuscript_file` | STRING | File URL |
| `isbn` | STRING | Unique, optional |
| `genre` | JSONB | Array of genres |
| `language` | ENUM | `ENGLISH`, `HINDI`, `URDU`, `BENGALI`, `TAMIL`, `TELUGU`, `FRENCH`, `GERMAN` |
| `cover` | JSONB | Cover image URLs |
| `publication_date` | DATE | Optional |
| `status` | ENUM | `Editing`, `Published & Live`, `In-Progress & Cover Design`, `In-Production & Typesetting` |
| `mrp` | DECIMAL(10,2) | Retail price |
| `author_royalty_per_copy` | INTEGER | Per-copy royalty amount |
| `total_copies_sold` | INTEGER | Default: 0 |
| `total_royalty_earned` | DECIMAL(10,2) | Default: 0 |
| `royalty_paid` | DECIMAL(10,2) | Default: 0 |
| `royalty_pending` | DECIMAL(10,2) | Default: 0 |
| `last_royalty_payout_date` | DATE | Optional |
| `print_partner` | ENUM | `In-House`, `Repro India`, `Epitom Books` |
| `available_on` | JSONB | Array of marketplace keys |

### Ticket
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK → User (author) |
| `book_id` | UUID | FK → Book (optional) |
| `ticket_number` | STRING | Unix timestamp as unique identifier |
| `subject` | STRING | Required |
| `category` | ENUM | AI-classified category |
| `priority` | ENUM | `CRITICAL`, `HIGH`, `MEDIUM`, `LOW` — Default: `MEDIUM` |
| `status` | ENUM | `OPEN`, `IN-PROGRESS`, `RESOLVED`, `CLOSED` — Default: `OPEN` |
| `assigned_to` | UUID | FK → User (admin), optional |
| `is_internal_note` | BOOLEAN | Whether ticket has internal notes |
| `internal_notes` | TEXT | Admin-only internal notes |
| `internal_notes_creator` | UUID | FK → User (admin who wrote notes) |

### Message
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `ticket_id` | UUID | FK → Ticket |
| `sender_id` | UUID | FK → User |
| `sender_role` | ENUM | `AUTHOR`, `ADMIN` |
| `message` | TEXT | Required |
| `attachments` | STRING | File reference, optional |

### Model Associations
```
User      ──< Book      (author_id)
User      ──< Ticket    (user_id)
User      ──< Message   (sender_id)
Ticket    ──< Message   (ticket_id)
Ticket    >── Book      (book_id)
```

---

## 💻 Frontend Functionality

### Authentication

#### Login (`/`)
- Author and Admin both log in from the same login page.
- On successful login, the JWT token and user object are stored in `localStorage`.
- `AuthContext` loads the stored session on app mount to prevent login flicker on page refresh.
- User is redirected to `/dashboard` after login.

#### Signup (`/register`)
- New users can register by providing name, email, phone, password, city, joining date, and role.
- The `role` field defaults to `AUTHOR` if not specified.

#### Logout
- Clears `localStorage` entirely and resets `AuthContext` state.
- Navigates the user back to `/` (login page).

#### Route Protection
- `RouteGuard` component wraps all private routes.
- Unauthenticated users trying to access private pages are redirected to `/`.
- Role-based routes (like Books, which is AUTHOR only) are filtered in the sidebar.

---

### Dashboard (`/dashboard`)

A welcome overview page visible to all authenticated users. Serves as the landing page after login.

---

### Books — Author (`/my-books`)

**Access:** AUTHOR only

This page is the author's book management hub.

#### Book Listing
- Displays all books belonging to the logged-in author in a responsive grid (up to 5 columns).
- Each book card shows the title, status badge, and language.
- **Pagination** is supported — authors can navigate between pages and change the number of books per page (default: 5).
- **Debounced search** — searching by title triggers the API call after a 500ms debounce, resetting to page 1.

#### Add Book Modal
- Opens an overlay modal when the `+ Add Book` button is clicked.
- **Drag-and-drop** file upload is supported for the manuscript file.
- Form fields: title, genre (comma-separated), language (dropdown), and manuscript file.
- On success, the new book is prepended to the listing without a page reload.

#### Book Detail (`/book/:bookId`)
- Clicking a book card navigates to its detail page.
- Shows full book metadata: ISBN, cover, publication date, print partner, marketplaces, royalty breakdown (earned, paid, pending, per-copy rate), and total copies sold.

---

### Support & Chat (`/support`)

The Support page is the real-time chat interface. The same route serves both AUTHOR and ADMIN, but the components have role-aware behavior.

#### Left Panel — Ticket List
- Lists all tickets for the logged-in user (author sees their tickets; admin sees all).
- Each ticket card shows: subject, ticket number (`#`), status badge (color-coded), priority badge (color-coded), and the preview of the first message.
- **Filters:** Filter tickets by `status` and `priority` using dropdowns.
- **Search:** Search tickets by ticket number with a 1-second debounce.
- Clicking a ticket card loads it in the right panel.

#### Right Panel — Chat View
- Displays the full message history of the selected ticket, ordered chronologically.
- Messages from the current user appear on the **right** (blue bubble); messages from the other party appear on the **left** (white bubble).
- Avatars are shown beside each message (initial letter avatar).
- File attachments are shown as a paperclip preview beneath the message.

#### Sending Messages
- The input bar at the bottom supports typing a message and optionally attaching a file.
- Clicking Send calls `POST /api/message/:ticketId/send`.
- The message does **not** get added optimistically — it arrives via the `new_message` Socket.IO event, ensuring consistency for both parties simultaneously.

#### Real-Time Chat (Socket.IO)
- On selecting a ticket, the frontend emits `join_ticket` to subscribe to that room.
- Incoming `new_message` events from the server append the new message to the chat in real-time without any page refresh.
- On deselecting or navigating away, `leave_ticket` is emitted to unsubscribe.
- If the socket reconnects mid-session, it automatically re-joins the active ticket room.

#### AI Draft Response (Admin only)
- The message input bar shows a 🤖 button for ADMIN users.
- Clicking it sends the **last message from the author** to `POST /api/ai/:ticketId/draft`.
- The AI-generated response is pre-filled into the input box, which the admin can review and edit before sending.
- Shows `"AI is typing..."` placeholder in the input while loading.

#### Create Ticket Modal (Author only)
- Authors see a `+ Ticket` button in the filter bar.
- Opens a modal where the author fills in: book (dropdown from `/book/list`), subject, description, and optional attachments.
- On submission, the AI automatically classifies the ticket's category and priority.
- The new ticket and its first message are appended to the list in real-time without a page refresh.

---

### Profile (`/profile/:userId`)

- Displays the authenticated user's personal profile information.
- Shows: full name, email, phone, city, role badge, joining date, and user UUID.
- Accessible by clicking the user avatar card at the bottom of the sidebar.
- The page correctly handles loading and error states.

---

### Sidebar & Navigation

The sidebar is the primary navigation component, persistent across all private pages.

- **Logo & Brand:** Displays the BookLeaf logo and name, linked to `/dashboard`.
- **Role-aware menu:** Routes are filtered based on the user's role. For example, `My Books` only appears for `AUTHOR` users.
- **Active state:** The current route is highlighted in navy blue (`#002b5b`).
- **User card:** The bottom of the sidebar shows the logged-in user's avatar (first letter of their name), full name, and role. Clicking it navigates to their profile page.
- **Logout button:** Clears all session data and redirects to login.

---

## 📦 Constants Reference

### Ticket Status
| Value | Display | Color |
|---|---|---|
| `OPEN` | Open | Blue |
| `IN-PROGRESS` | In Progress | Yellow |
| `RESOLVED` | Resolved | Green |
| `CLOSED` | Closed | Gray |

### Priority
| Value | Display | Color |
|---|---|---|
| `CRITICAL` | Critical | Red |
| `HIGH` | High | Orange |
| `MEDIUM` | Medium | Yellow |
| `LOW` | Low | Green |

### Book Status
| Value |
|---|
| `Editing` |
| `Published & Live` |
| `In-Progress & Cover Design` |
| `In-Production & Typesetting` |

### Supported Languages
`ENGLISH`, `HINDI`, `URDU`, `BENGALI`, `TAMIL`, `TELUGU`, `FRENCH`, `GERMAN`

### Supported Marketplaces
`AMAZON_US`, `AMAZON_UK`, `AMAZON_IND`, `FLIPKART`, `BOOKLEAF_STORE`

### Print Partners
`In-House`, `Repro India`, `Epitom Books`

---

## 👤 Author

**Kundan Kumar Gupta**

---

## 📄 License

MIT License
