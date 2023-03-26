import ForgotPassword from '~/pages/ForgotPassword';
import Home from '~/pages/Home';
import Login from '~/pages/Login';
import Register from '~/pages/Register';

// Public routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/login', component: Login, layout: null },
    { path: '/register', component: Register, layout: null },
    { path: '/forgot-password', component: ForgotPassword, layout: null },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
