import http from '~/utils/httpRequest';

export const getLogs = ({ searchFilter, pageIndex, pageSize, dateFrom, dateTo }) => {
    return http.get('auditLog/get_logs', { params: { searchFilter, pageIndex, pageSize, dateFrom, dateTo } });
};

export const saveLog = ({ScreenInfo, ActionType, Reference, Description}) => {
    let param = {
        ScreenInfo,
        ActionType,
        Reference,
        Description
    };
    return http.post('auditLog/save_log', param);
};
