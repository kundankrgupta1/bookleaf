import { useEffect, useMemo, useRef, useState } from "react";
import useApi from "../../api/axiosInstance";
import { PRIORITY, PRIORITY_MAP, STATUS_MAP, TICKET_STATUS } from "../../constants/constant";
import { useAuth } from "../../context/AuthContext";
import socket from "../../utils/socket";
import CreateTicket from "./CreateTicket";
import { ImAttachment } from "react-icons/im";
import { CiSearch } from "react-icons/ci";

const Support = () => {
    const { user } = useAuth();
    const chatRef = useRef(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [ticket, setTicket] = useState(null);
    const [ticketLoading, setTicketLoading] = useState(null);
    const [messageSendLoading, setMessageSendLoading] = useState(false);
    const [aILoading, setAILoading] = useState(false);
    const [ticketNumberDebounce, setTicketNumberDebounce] = useState('');
    const [open, setOpen] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [notesCreate, setNotesCreate] = useState(false);
    const [adminList, setAdminList] = useState([]);

    const [form, setForm] = useState({
        message: "",
        attachments: ""
    });
    const [internalNotes, setInternalNotes] = useState('');

    const [filters, setFilters] = useState({
        status: "",
        priority: "",
        ticket_number: ""
    });

    const handleAssignTicket = async (ticketId, assignedTo) => {
        try {
            await useApi.patch(`/ticket/assign/${ticketId}`, { assigned_to: assignedTo });
            setTicket((prev) => ({ ...prev, assigned_to: assignedTo }));
        } catch (error) {
            setError(error?.response?.data?.message || 'Error while assigning ticket');
        };
    };


    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const { data } = await useApi.get('/user/list');
                setAdminList(data?.admins || []);
            } catch (error) {
                console.log("Error fetching admins list", error);
            }
        };
        fetchAdmins();
    }, []);


    const lastMessage = useMemo(() => {
        if (!Array.isArray(messages)) return null;

        let latest = null;

        for (const msg of messages) {
            if (msg.sender_role !== "AUTHOR") continue;

            if (!latest || new Date(msg.createdAt) > new Date(latest.createdAt)) {
                latest = msg;
            }
        };

        return latest?.message;
    }, [messages]);

    const handleAICall = async () => {
        setAILoading(true);
        try {
            const { data } = await useApi.post(`/ai/${selectedTicket?.id}/draft`, { lastMessage });
            setForm((prev) => ({ ...prev, message: data?.draftMessage }))
        } catch (error) {
            setError(error?.response?.data?.message)
        } finally {
            setAILoading(false);
        }
    };

    useEffect(() => {
        if (!selectedTicket?.id) return;

        socket.emit("join_ticket", selectedTicket.id);

        const handleNewMessage = (msg) => {
            setMessages((prev) => [...prev, msg]);
        };

        socket.on("new_message", handleNewMessage);

        return () => {
            socket.emit("leave_ticket", selectedTicket.id);
            socket.off("new_message", handleNewMessage);
        };
    }, [selectedTicket?.id]);

    useEffect(() => {
        const handleConnect = () => {
            if (selectedTicket?.id) {
                socket.emit("join_ticket", selectedTicket.id);
            }
        };

        socket.on("connect", handleConnect);

        return () => {
            socket.off("connect", handleConnect);
        };
    }, [selectedTicket?.id]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!form?.message?.trim()) return setError('Message required');

        setError(null);
        setMessageSendLoading(true);

        try {
            await useApi.post(`/message/${selectedTicket?.id}/send`, form);
            setForm((prev) => ({ ...prev, message: '', attachments: '' }));
        } catch (error) {
            setError(error?.response?.data?.message || 'Error while sending message');
        } finally {
            setMessageSendLoading(false);
        }
    };

    useEffect(() => {
        const fetchAllTickets = async () => {
            setLoading(true);
            try {
                const { data } = await useApi.get("/ticket", {
                    params: {
                        ...filters,
                        ticket_number: ticketNumberDebounce
                    }
                });
                setTickets(data?.tickets || []);
            } catch (error) {
                setError(error?.response?.data?.message || 'Error while loading tickets');
            } finally {
                setLoading(false);
            };
        };

        fetchAllTickets();
    }, [filters?.status, filters?.priority, ticketNumberDebounce]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTicketNumberDebounce(filters?.ticket_number);
        }, 1000);

        return () => clearTimeout(timer);

    }, [filters?.ticket_number]);


    useEffect(() => {
        const fetchSingleTicket = async () => {
            setTicketLoading(true);
            try {
                const { data } = await useApi.get(`/ticket/${selectedTicket?.id}`)
                setTicket(data?.ticket);
                setMessages(data?.ticket?.message)
            } catch (error) {
                setError(error?.response?.data?.message || 'Error while loading ticket, please try again');
            } finally {
                setTicketLoading(false)
            }
        };

        if (selectedTicket) fetchSingleTicket();
    }, [selectedTicket]);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        };
    }, [messages]);

    const createInternalNotes = async (ticketId) => {
        try {
            await useApi.patch(`/ticket/notes/${ticketId}`, { internalNotes });
            setTicket((prev) => ({
                ...prev,
                internal_notes: internalNotes
            }));
            setInternalNotes('');
        } catch (error) {
            setError(error?.response?.data?.message || 'Error while creating internal notes');
        }
    };


    return (
        <div className="flex h-screen bg-gray-100">
            <div className="shadow-xl w-[420px] bg-white flex flex-col h-full">
                <div className="p-3 flex flex-col gap-2 bg-white sticky top-0 z-10">
                    <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
                        <CiSearch size={18} />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            className="bg-transparent outline-none text-sm ml-2 w-full"
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    ticket_number: e.target.value,
                                }))
                            }
                        />
                    </div>

                    <div className="flex gap-2 items-center">
                        <select
                            className="flex-1 bg-gray-100 text-sm px-2 py-2 rounded-lg outline-none"
                            value={filters.priority}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    priority: e.target.value,
                                }))
                            }
                        >
                            {PRIORITY.map((p, i) => (
                                <option key={i} value={p.value}>
                                    {p.label}
                                </option>
                            ))}
                        </select>

                        <select
                            className="flex-1 bg-gray-100 text-sm px-2 py-2 rounded-lg outline-none"
                            value={filters.status}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    status: e.target.value,
                                }))
                            }
                        >
                            {TICKET_STATUS.map((s, i) => (
                                <option key={i} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>

                        {user?.role === "AUTHOR" && (
                            <button
                                onClick={() => setOpen(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition"
                            >
                                + Ticket
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading && tickets.length === 0 && (
                        <div className="p-4 text-sm text-gray-500">Loading tickets...</div>
                    )}
                    {error && tickets.length === 0 && (
                        <div className="p-4 text-sm text-red-500">{error}</div>
                    )}

                    {tickets?.map((t) => (
                        <div
                            key={t.ticket_number}
                            onClick={() => setSelectedTicket(t)}
                            className={`flex gap-3 p-3 cursor-pointer transition
                            ${selectedTicket?.id === t.id
                                    ? "bg-blue-50"
                                    : "hover:bg-gray-50"
                                }`}
                        >
                            <img
                                src={
                                    t?.user?.avatar ||
                                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                }
                                alt=""
                                className="w-10 h-10 rounded-full object-cover border"
                            />

                            <div className="flex flex-col w-full gap-1">

                                <div className="flex justify-between items-start">
                                    <p className="text-sm font-semibold truncate max-w-[180px]">
                                        {t.subject}
                                    </p>

                                    <div className="flex gap-1 items-center">

                                        <span
                                            className={`text-xs px-2 py-[2px] rounded-full font-medium ${STATUS_MAP[t.status]?.bg}`}
                                        >
                                            {STATUS_MAP[t.status]?.value}
                                        </span>

                                        <span
                                            className={`text-xs px-2 py-[2px] rounded-full font-medium border
                                            ${PRIORITY_MAP[t.priority]?.bg}
                                            ${PRIORITY_MAP[t.priority]?.text}
                                            ${PRIORITY_MAP[t.priority]?.border}`}
                                        >
                                            {PRIORITY_MAP[t.priority]?.value}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-400">
                                    #{t.ticket_number}
                                </p>

                                <p className="text-xs text-gray-600 truncate">
                                    {t?.message?.[0]?.message || "No messages yet"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-[#f8fafc]">

                {!ticketLoading && error && <p className="text-red-500 p-3">{error}</p>}
                {ticketLoading && <p className="p-3 text-gray-500">Loading...</p>}

                {!error && !ticketLoading && selectedTicket ? (
                    <>
                        <div className="px-6 py-4 bg-white/80 backdrop-blur-md border-b shadow-sm flex justify-between items-start">

                            {/* LEFT: Ticket Info */}
                            <div className="flex flex-col gap-1">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {ticket?.subject}
                                </h2>

                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded-md">
                                        {ticket?.category}
                                    </span>

                                    <span className="text-gray-400">
                                        #{ticket?.ticket_number}
                                    </span>
                                </div>
                            </div>

                            {/* RIGHT: Status + Actions */}
                            <div className="flex flex-col items-end gap-3">

                                {/* STATUS + PRIORITY */}
                                <div className="flex gap-2">
                                    <span
                                        className={`text-xs px-3 py-1 rounded-full font-semibold shadow-sm ${STATUS_MAP[ticket?.status]?.bg}`}
                                    >
                                        {STATUS_MAP[ticket?.status]?.value}
                                    </span>

                                    <span
                                        className={`text-xs px-3 py-1 rounded-full font-semibold shadow-sm
                                        ${PRIORITY_MAP[ticket?.priority]?.bg}
                                        ${PRIORITY_MAP[ticket?.priority]?.text}`}
                                    >
                                        {PRIORITY_MAP[ticket?.priority]?.value}
                                    </span>
                                </div>

                                {/* ACTIONS */}
                                {user?.role === "ADMIN" && (
                                    <div className="flex items-center gap-2">
                                        {/* Add Note */}
                                        <button
                                            onClick={() => setNotesCreate((prev) => !prev)}
                                            className="text-xs bg-yellow-400 hover:cursor-pointer px-2 py-0.5 rounded-full font-medium transition"
                                        >
                                            + Note
                                        </button>

                                        {/* View Notes */}
                                        {ticket?.internal_notes && (
                                            <button
                                                onClick={() => setShowNotes((prev) => !prev)}
                                                className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-0.5 rounded-full font-medium transition"
                                            >
                                                View Notes
                                            </button>
                                        )}

                                        {/* Assign */}
                                        <select
                                            value={ticket?.assigned_to}
                                            onChange={(e) => handleAssignTicket(ticket?.id, e.target.value)}
                                            className="border w-[110px] hover:bg-gray-200 text-xs px-2 py-0.5 rounded-lg outline-none transition"
                                        >
                                            <option value="">Choose to assign</option>
                                            {adminList?.map((admin) => (
                                                <option key={admin?.id} value={admin?.id}>
                                                    {admin.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {notesCreate && (
                                <div className="absolute top-20 right-6 w-72 bg-white border shadow-xl rounded-xl p-4 z-50">
                                    <textarea
                                        value={internalNotes}
                                        onChange={(e) => setInternalNotes(e.target.value)}
                                        placeholder="Write internal notes..."
                                        className="w-full h-24 p-2 border rounded-lg text-sm outline-none resize-none"
                                    />

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => { setNotesCreate(false); setInternalNotes('') }}
                                            className="mt-3 w-full text-sm bg-red-400 cursor-pointer text-black py-1 rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                createInternalNotes(ticket?.id);
                                                setNotesCreate(false);
                                            }}
                                            className="mt-3 w-full text-sm bg-yellow-500 cursor-pointer text-black py-1 rounded-lg"
                                        >
                                            Save Note
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* VIEW NOTES */}
                            {showNotes && (
                                <div className="absolute top-20 right-6 w-72 bg-white border shadow-xl rounded-xl p-4 z-50">
                                    <p className="text-sm text-gray-700 whitespace-pre-line">
                                        {ticket?.internal_notes}
                                    </p>

                                    {ticket?.internal_notes_creator && (
                                        <p className="mt-2 text-xs text-gray-400">
                                            By: {ticket.internal_notes_creator}
                                        </p>
                                    )}

                                    <button
                                        onClick={() => setShowNotes(false)}
                                        className="mt-3 text-xs text-blue-500 hover:underline"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* CHAT AREA */}
                        <div
                            ref={chatRef}
                            className="flex flex-col gap-2 h-screen overflow-y-auto px-5 py-6 space-y-4">

                            {messages?.map((msg) => {
                                const isMe = user?.id === msg?.sender_id;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"
                                            }`}
                                    >
                                        {!isMe && (
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                                                A
                                            </div>
                                        )}

                                        <div
                                            className={`max-w-xs px-4 py-2 text-sm rounded-2xl shadow-sm ${isMe
                                                ? "bg-blue-500 text-white rounded-br-sm"
                                                : "bg-white text-gray-800 rounded-bl-sm"
                                                }`}
                                        >
                                            <p>{msg.message}</p>

                                            {msg?.attachments && (
                                                <div className="mt-2 text-xs bg-black/5 px-2 py-1 rounded">
                                                    📎 {msg.attachments}
                                                </div>
                                            )}
                                        </div>

                                        {isMe && (
                                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                                                Y
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <form
                            onSubmit={handleSendMessage}
                            className="px-4 py-3 bg-white/70 backdrop-blur-md"
                        >
                            <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400 transition">

                                {user?.role === "ADMIN" && (
                                    <button
                                        type="button"
                                        onClick={handleAICall}
                                        className="mr-2 p-2 rounded-full hover:bg-gray-200 transition"
                                    >
                                        🤖
                                    </button>
                                )}

                                <input
                                    type="text"
                                    value={form?.message}
                                    placeholder={aILoading ? "AI is typing..." : "Type a message..."}
                                    className="flex-1 bg-transparent outline-none text-sm px-2"
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            message: e.target.value,
                                        }))
                                    }
                                />

                                <div className="flex items-center gap-1">

                                    <label className="cursor-pointer p-2 rounded-full hover:bg-gray-200 transition">
                                        <ImAttachment />
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    attachments: e.target.files,
                                                }))
                                            }
                                        />
                                    </label>

                                    <button
                                        type="submit"
                                        disabled={messageSendLoading}
                                        className="bg-blue-500 hover:bg-blue-600 text-white w-9 h-9 rounded-full flex items-center justify-center transition disabled:opacity-50"
                                    >
                                        {messageSendLoading ? "..." : "➤"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                        💬 Select a ticket to start conversation
                    </div>
                )}
            </div>
            {user?.role === 'AUTHOR' && (
                <CreateTicket
                    open={open}
                    close={() => setOpen(false)}
                    setTickets={setTickets}
                    selectedTicket={selectedTicket}
                    setMessages={setMessages}
                />
            )}
        </div>
    );
}

export default Support;