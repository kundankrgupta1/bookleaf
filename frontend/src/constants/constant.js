export const TICKET_STATUS = [
    { label: 'Open', value: 'OPEN' },
    { label: 'In Progress', value: 'IN-PROGRESS' },
    { label: 'Resolved', value: 'RESOLVED' },
    { label: 'Closed', value: 'CLOSED' },
];

export const PRIORITY = [
    { label: 'Critical', value: 'CRITICAL' },
    { label: 'High', value: 'HIGH' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'Low', value: 'LOW' },
];

export const STATUS_MAP = {
    OPEN: {
        value: 'Open',
        bg: 'bg-blue-100',
        text: 'text-blue-700'
    },
    'IN-PROGRESS': {
        value: 'In Progress',
        bg: 'bg-yellow-100',
        text: 'text-yellow-700'
    },
    RESOLVED: {
        value: 'Resolved',
        bg: 'bg-green-100',
        text: 'text-green-700'
    },
    CLOSED: {
        value: 'Closed',
        bg: 'bg-gray-200',
        text: 'text-gray-700'
    }
};

export const PRIORITY_MAP = {
    CRITICAL: {
        value: 'Critical',
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border border-red-300'
    },
    HIGH: {
        value: 'High',
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        border: 'border border-orange-300'
    },
    MEDIUM: {
        value: 'Medium',
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        border: 'border border-yellow-300'
    },
    LOW: {
        value: 'Low',
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border border-green-300'
    }
};