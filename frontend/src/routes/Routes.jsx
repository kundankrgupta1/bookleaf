import { lazy } from 'react';
import { MdDashboard, MdOutlineContactSupport } from "react-icons/md";
import { FaBook } from "react-icons/fa";

export const routes = [
    {
        path: '/',
        label: 'Login',
        component: lazy(() => import('../authentication/Login.jsx')),
        isPrivate: false,
        hideInMenu: true
    },
    {
        path: '/register',
        label: 'Signup',
        component: lazy(() => import('../authentication/Signup.jsx')),
        isPrivate: false,
        hideInMenu: true
    },
    {
        path: '/profile/:userId',
        label: 'Profile',
        component: lazy(() => import('../pages/User/Profile.jsx')),
        isPrivate: true,
        hideInMenu: true
    },
    {
        path: '/dashboard',
        label: 'Dashboard',
        component: lazy(() => import('../pages/Dashboard/Dashboard.jsx')), // ✅ FIXED
        isPrivate: true,
        hideInMenu: false,
        icon: MdDashboard
    },
    {
        path: '/my-books',
        label: 'Books',
        component: lazy(() => import('../pages/Books/Books.jsx')),
        isPrivate: true,
        hideInMenu: false,
        role: 'AUTHOR',
        icon: FaBook
    },
    {
        path: '/book/:bookId',
        label: 'Book',
        component: lazy(() => import('../pages/Books/Book.jsx')),
        isPrivate: true,
        hideInMenu: true
    },
    {
        path: '/support',
        label: 'Support',
        component: lazy(() => import('../pages/Support/Support.jsx')),
        isPrivate: true,
        hideInMenu: false,
        icon: MdOutlineContactSupport
    },
    {
        path: '/ticket/:ticketId',
        label: 'Ticket',
        component: lazy(() => import('../pages/Support/Ticket.jsx')),
        isPrivate: true,
        hideInMenu: true
    }
];