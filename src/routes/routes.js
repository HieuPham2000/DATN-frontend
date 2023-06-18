import ForgotPassword from '~/pages/ForgotPassword';
import Dashboard from '~/pages/Dashboard';
import DictionaryPage from '~/pages/DictionaryPage';
import Login from '~/pages/Login';
import Page404 from '~/pages/Page404';
import Page500 from '~/pages/Page500';
import Register from '~/pages/Register';
import AddConcept from '~/pages/AddConcept';
import AddExample from '~/pages/AddExample';
import SearchPage from '~/pages/SearchPage';
import TreePage from '~/pages/TreePage';
import AuditLogPage from '~/pages/AuditLogPage';
import UserSettingPage from '~/pages/UserSettingPage';
import ActivateAccountResult from '~/pages/ActivateAccountResult';
import ResetPassword from '~/pages/ResetPassword';

// Public routes
const publicRoutes = [
    { path: '/register', component: Register, layout: null },
    { path: '/login', component: Login, layout: null },
    { path: '/forgot-password', component: ForgotPassword, layout: null },
    { path: '/activate-account/:token', component: ActivateAccountResult, layout: null },
    { path: '/reset-password/:token', component: ResetPassword, layout: null },
    

];

const privateRoutes = [
    { path: '/', component: Dashboard },
    { path: '/dashboard', component: Dashboard },
    { path: '/dictionary', component: DictionaryPage },
    { path: '/concept', component: AddConcept },
    { path: '/example', component: AddExample },
    { path: '/search', component: SearchPage },
    { path: '/tree', component: TreePage },
    { path: '/history', component: AuditLogPage },
    { path: '/account', component: UserSettingPage },
    { path: '/500', component: Page500, layout: null },

    { path: '*', component: Page404, layout: null },
];

export { publicRoutes, privateRoutes };
