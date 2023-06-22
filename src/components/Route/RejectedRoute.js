import { Suspense, memo, useMemo } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loading from '~/components/Loading';
import useCheckAuthenticate from '~/hooks/data/useCheckAuthenticate';
// import useMe from '~/hooks/data/useMe';

const RejectedRoute = memo(() => {
    // const { error, isLoading } = useMe();

    // if (isLoading) return <Loading dense />;

    // if(error) return <Outlet />;

    // return <Navigate to="/" replace />;
    const location = useLocation();
    const { from } = useMemo(() => location.state || { from: { pathname: '/' } }, [location]);
    const { data, error, isLoading } = useCheckAuthenticate();

    if (isLoading) return <Loading dense />;

    if (error || !data)
        return (
            <Suspense fallback={<Loading dense />}>
                <Outlet />
            </Suspense>
        );

    return <Navigate to={from} replace />;
});

export default RejectedRoute;
