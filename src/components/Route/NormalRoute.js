import { Suspense, memo } from 'react';
import { Outlet } from 'react-router-dom';
import Loading from '~/components/Loading';

const NormalRoute = memo(() => {
    return (
        <Suspense fallback={<Loading dense />}>
            <Outlet />
        </Suspense>
    );
});

export default NormalRoute;
