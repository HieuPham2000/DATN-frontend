import http from '~/utils/httpRequest';

const handleApiResponseDownloadFile = (response, defaultFileName = '') => {
    let contentDisposition = response.headers['content-disposition'],
        fileName = contentDisposition.match(/filename=(?<filename>[^,;]+);/)[1] || defaultFileName;

    // create file link in browser's memory
    const href = URL.createObjectURL(response.data);

    // create "a" HTML element with href to file & click
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
};
export const downloadTemplate = () => {
    return http.get('template/download', { responseType: 'blob' }).then((response) => {
        handleApiResponseDownloadFile(response, 'HUSTPVO_ImportTemplate.xlsx');
        return response;
    });
};

export const exportDictionary = (dictionaryId) => {
    return http
        .get('template/export', { responseType: 'blob', responseEncoding: 'utf8', params: { dictionaryId } })
        .then((response) => {
            handleApiResponseDownloadFile(response, 'HUSTPVO_ExportData.xlsx');
            return response;
        });
};

export const backupDictionary = (dictionaryId) => {
    return http.get('template/backup', { params: { dictionaryId } });
};

export const importDictionary = (file, dictionaryId) => {
    let bodyFormData = new FormData();
    file != null && bodyFormData.append('file', file);
    dictionaryId != null && bodyFormData.append('dictionaryId', dictionaryId);
    return http.post('template/import', bodyFormData, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const doImport = (importSession) => {
    return http.post('template/do_import', importSession);
};
