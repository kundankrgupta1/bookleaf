export const ROLE = ['ADMIN', 'AUTHOR'];

export const AUTH_PROVIDER = ['LOCAL', 'GOOGLE'];

export const AUTH_PROVIDER_DEFAULT = 'LOCAL';

export const TICKET_STATUS = ['OPEN', 'IN-PROGRESS', 'RESOLVED', 'CLOSED'];

export const PRIORITY = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export const CATEGORIES = [
    "Royalty & Payments",
    "ISBN & Metadata Issues",
    "Printing & Quality",
    "Distribution & Availability",
    "Book Status & Production Updates",
    "General Inquiry"
];

export const BOOK_STATUS = ['Editing', 'Published & Live', 'In-Progress & Cover Design', 'In-Production & Typesetting'];

export const PRINT_PARTNER = ['In-House', 'Repro India', 'Epitom Books'];

export const MARKETPLACE = ['AMAZON_US', 'AMAZON_UK', 'AMAZON_IND', 'FLIPKART', 'BOOKLEAF_STORE'];

export const LANGUAGE = ['ENGLISH', 'HINDI', 'URDU', 'BENGALI', 'TAMIL', 'TELUGU', 'FRENCH', 'GERMAN'];


// === BookLeaf Knowledge Base ===
const royaltyKB = `
    Royalty Policy:

    - BookLeaf follows 80/20 split: 80% to author.
    - Net profit = MRP - printing cost - platform commission - shipping.
    - Royalties are calculated quarterly.
    - Paid within 45 days after quarter end.
    - Minimum payout threshold: ₹1,000.
    - Below threshold → rolled over.
    - Paid via bank transfer.`;

const isbnKB = `
    ISBN Policy:

    - Every book gets unique ISBN from BookLeaf.
    - Registered under BookLeaf imprint.
    - Errors (duplicate/wrong mapping) are HIGH priority.
    - Escalated to production team within 48 hours.`;

const printingKB = `
    Printing & Quality:

    - Print turnaround: 5–7 business days.
    - Issues like misprint or defects:
    → Author must provide images.
    → Free reprint provided after verification.`;

const distributionKB = `
    Distribution:

    - Platforms: Amazon India, Flipkart, Amazon US/UK, BookLeaf Store.
    - Listings go live in 7–10 business days.
    - Availability issues:
    → Usually stock sync issue
    → Resolved within 24–48 hours.`;

const productionKB = `
    Production Stages:

    Manuscript → Editing → Cover → Typesetting → Proofreading → ISBN → Printing → Distribution → Live

    Delays:
    - Cover design (waiting approval)
    - Proofreading (revision rounds).`;

const generalKB = `
    General:

    - Metadata updates allowed after publishing.
    - Takes 3–5 business days to reflect.`;

export const KB_MAP = {
    "Royalty & Payments": royaltyKB,
    "ISBN & Metadata Issues": isbnKB,
    "Printing & Quality": printingKB,
    "Distribution & Availability": distributionKB,
    "Book Status & Production Updates": productionKB,
    "General Inquiry": generalKB
};

export const AI_MODELS = {
    CLASSIFIER: "gemini-2.0-flash",
    GENERATOR: "gemini-2.5-flash",
    ADVANCED: "gemini-2.5-pro"
};
