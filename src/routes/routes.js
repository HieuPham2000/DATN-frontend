import ForgotPassword from '~/pages/ForgotPassword/ForgotPassword';
import Home from '~/pages/Home/Home';
import Login from '~/pages/Login/Login';
import Page404 from '~/pages/Page404/Page404';
import Page500 from '~/pages/Page500/Page500';
import Register from '~/pages/Register/Register';

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
