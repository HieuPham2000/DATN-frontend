import { useQuery } from '@tanstack/react-query';
import { getAccountInfo } from '~/services/accountService';

const useAccountInfo = () =>
    useQuery({
        queryKey: ['accountInfo'],
        queryFn: async () => {
            const res = await getAccountInfo();
            return res.data.Data;
        },
        staleTime: 300000,
        refetchOnWindowFocus: false,
    });

export default useAccountInfo;
