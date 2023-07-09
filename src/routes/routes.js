import { lazy } from 'react';
const Dashboard = lazy(() => import('~/pages/Dashboard'));
const ForgotPassword = lazy(() => import('~/pages/ForgotPassword'));
const DictionaryPage = lazy(() => import('~/pages/DictionaryPage'));
const Login = lazy(() => import('~/pages/Login'));
const Page404 = lazy(() => import('~/pages/Page404'));
const Page500 = lazy(() => import('~/pages/Page500'));
const Register = lazy(() => import('~/pages/Register'));
const ConceptPage = lazy(() => import('~/pages/ConceptPage'));
const AddExample = lazy(() => import('~/pages/AddExample'));
const SearchPage = lazy(() => import('~/pages/SearchPage'));
const TreePage = lazy(() => import('~/pages/TreePage'));
const AuditLogPage = lazy(() => import('~/pages/AuditLogPage'));
const UserSettingPage = lazy(() => import('~/pages/UserSettingPage'));
const ActivateAccountResult = lazy(() => import('~/pages/ActivateAccountResult'));
const ResetPassword = lazy(() => import('~/pages/ResetPassword'));

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
    { path: '/concept', component: ConceptPage },
    { path: '/example', component: AddExample },
    { path: '/search', component: SearchPage },
    { path: '/tree', component: TreePage },
    { path: '/history', component: AuditLogPage },
    { path: '/account', component: UserSettingPage },
];

const normalRoutes = [
    { path: '/500', component: Page500, layout: null },
    { path: '*', component: Page404, layout: null },
];

export { publicRoutes, privateRoutes, normalRoutes };
