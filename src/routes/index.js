import ForgotPassword from '~/pages/ForgotPassword';
import Home from '~/pages/Home';
import Login from '~/pages/Login';
import Page404 from '~/pages/Page404';
import Page500 from '~/pages/Page500';
import Register from '~/pages/Register';

// Public routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/login', component: Login, layout: null },
    { path: '/register', component: Register, layout: null },
    { path: '/forgot-password', component: ForgotPassword, layout: null },
    { path: '/500', component: Page500, layout: null },
    { path: '*', component: Page404, layout: null },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
