import { memo } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loading from '~/components/Loading';
import useCheckAuthenticate from '~/hooks/data/useCheckAuthenticate';
// import useMe from '~/hooks/data/useMe';

const PrivateRoute = memo(() => {
    // const { error, isLoading } = useMe();
    // if (isLoading) return <Loading dense />;

    // if (error) return <Navigate to="/login" state={{ from: '/tree' }} />;

    // return <Outlet />;
    const location = useLocation();
    const { data, error, isLoading } = useCheckAuthenticate();
    if (isLoading) return <Loading dense />;

    if (error || !data) return <Navigate to="/login" state={{ from: location.pathname }} />;

    return <Outlet />;
});

export default PrivateRoute;
