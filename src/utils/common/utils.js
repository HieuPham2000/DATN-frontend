import moment from 'moment';
import numeral from 'numeral';
import { FormatDate, FormatDateTime } from '~/utils/common/config';
import HUSTConstant from '~/utils/common/constant';

export function formatDate(date) {
    return date ? moment(date).format(FormatDate) : '';
}

export function formatDateTime(dateTime) {
    return dateTime ? moment(dateTime).format(FormatDateTime) : '';
}

export function formatNumber(number) {
    return numeral(number).format();
}

export function formatPercent(number) {
    const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

    return getResultFormat(format, '.0');
}

export function formatShortenNumber(number) {
    const format = number ? numeral(number).format('0.00a') : '';

    return getResultFormat(format, '.00');
}

export function formatData(number) {
    const format = number ? numeral(number).format('0.0 b') : '';

    return getResultFormat(format, '.0');
}

/**
 * Thực hiện bỏ phần thập phân nếu phần thập phân chỉ toàn số 0
 * @param {*} format
 * @param {*} key
 * @returns
 */
function getResultFormat(format, key = '.00') {
    const isInteger = format.includes(key);

    return isInteger ? format.replace(key, '') : format;
}

export function getFileTypeByUrl(fileUrl = '') {
    return (fileUrl && fileUrl.split('.').pop()) || '';
}

export function getFileNameByUrl(fileUrl) {
    return (fileUrl && fileUrl.split('/').pop()) || '';
}

/**
 * Lấy thông tin file
 * @param {*} file
 * @returns object chứa các thông tin của file
 */
export function getFileData(file) {
    // Url
    if (typeof file === 'string') {
        return {
            key: file,
            preview: file,
            name: getFileNameByUrl(file),
            type: getFileTypeByUrl(file),
        };
    }

    // File
    return {
        key: file.preview,
        name: file.name,
        size: file.size,
        path: file.path,
        type: file.type,
        preview: file.preview,
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
    };
}

export function getRatio(ratio = '1/1') {
    return {
        '4/3': 'calc(100% / 4 * 3)',
        '3/4': 'calc(100% / 3 * 4)',
        '6/4': 'calc(100% / 6 * 4)',
        '4/6': 'calc(100% / 4 * 6)',
        '16/9': 'calc(100% / 16 * 9)',
        '9/16': 'calc(100% / 9 * 16)',
        '21/9': 'calc(100% / 21 * 9)',
        '9/21': 'calc(100% / 9 * 21)',
        '1/1': '100%',
    }[ratio];
}

export function getMapLogActionType() {
    let obj = {};
    Object.keys(HUSTConstant.LogAction).forEach(
        (key) => (obj[HUSTConstant.LogAction[key].Type] = HUSTConstant.LogAction[key].Text),
    );
    return obj;
}
