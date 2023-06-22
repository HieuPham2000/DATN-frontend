import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { privateRoutes, publicRoutes, normalRoutes } from '~/routes';
import DefaultLayout from '~/layouts';
import PrivateRoute from '~/components/Route/PrivateRoute';
import RejectedRoute from '~/components/Route/RejectedRoute';

const getLayout = (route) => {
    // const Layout = route.layout === null ? Fragment : DefaultLayout; // undefined == null => dùng 3 dấu =
    let Layout = DefaultLayout;
    if (route.layout) {
        Layout = route.layout;
    } else if (route.layout === null) {
        Layout = Fragment;
    }
    return Layout;
};
function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route element={<RejectedRoute />}>
                        {publicRoutes.map((route, index) => {
                            const Layout = getLayout(route);
                            const Page = route.component;
                            return (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                    </Route>
                    <Route element={<PrivateRoute />}>
                        {privateRoutes.map((route, index) => {
                            const Layout = getLayout(route);
                            const Page = route.component;
                            return (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                    </Route>
                    {normalRoutes.map((route, index) => {
                        const Layout = getLayout(route);
                        const Page = route.component;
                        return (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
