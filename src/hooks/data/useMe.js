import { useQuery } from '@tanstack/react-query';
import { HttpStatusCode } from 'axios';
import { getMe } from '~/services/userService';

const useMe = () =>
    useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const res = await getMe();
            return res.data.Data;
        },
        staleTime: 300000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
            return (error?.response?.status !== HttpStatusCode.Unauthorized && failureCount <= 3) ? true : false;
        },
    });

export default useMe;
