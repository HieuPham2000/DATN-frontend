import { useQuery } from '@tanstack/react-query';
// import { HttpStatusCode } from 'axios';
import { checkAuthenticate } from '~/services/accountService';

const useCheckAuthenticate = () =>
    useQuery({
        queryKey: ['isAuthenticate'],
        queryFn: async () => {
            const res = await checkAuthenticate();
            return res.data.Data;
        },
        staleTime: 300000,
        refetchOnWindowFocus: false,
        // retry: (failureCount, error) => {
        //     return error?.response?.status !== HttpStatusCode.Unauthorized && failureCount <= 3 ? true : false;
        // },
        retry: false,
    });

export default useCheckAuthenticate;
