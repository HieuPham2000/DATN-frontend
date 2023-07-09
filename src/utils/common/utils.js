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

/**
 * Loại bỏ tag html, trừ thẻ highlight (thẻ mark)
 * @param {*} str
 * @param {*} doTrim
 * @returns
 */
export function stripHtmlExceptHighlight(str, doTrim) {
    str = str?.replaceAll(/<\/?(?!mark)\w*\b[^>]*>/g, '') || '';
    return doTrim ? str.trim() : str;
}

/**
 * Loại bỏ tag html, trừ thẻ highlight (thẻ mark)
 * @param {*} str
 * @param {*} doTrim
 * @returns
 */
export function getDisplayExample(detailHtml) {
    if (!detailHtml) {
        return detailHtml;
    }
    let res = '',
        fixNum = 50,
        firstStartMark = detailHtml.indexOf('<mark>', 0),
        firstEndMark = detailHtml.indexOf('</mark>', 0);

    if (firstStartMark === -1 || firstEndMark === -1) {
        res = detailHtml.substring(0, 50);
        if (detailHtml.length > 50 && !res.endsWith('...')) {
            res += '...';
        }
        return res;
    }

    let startIndex = Math.max(firstStartMark - fixNum, 0),
        endIndex = Math.min(firstEndMark + 7 + fixNum, detailHtml.length);

    let secondStartMark = detailHtml.indexOf('<mark>', firstEndMark);
    if (secondStartMark !== -1) {
        endIndex = Math.min(endIndex, secondStartMark);
    }

    res = detailHtml.substring(startIndex, endIndex);
    if (startIndex > 0 && !res.startsWith('...')) {
        res = '...' + res;
    }

    if (endIndex < detailHtml.length && !res.endsWith('...')) {
        res += '...';
    }

    return res;
}

/**
 * Lấy ra mảng hiển thị thuộc tính example
 * @param {object} example
 * @returns
 */
export function getDisplayExampleAttribute(example) {
    if (!example) {
        return [];
    }
    let res = [example.ToneName, example.ModeName, example.RegisterName, example.NuanceName, example.DialectName];

    return res.filter((x) => x && x !== 'Neutral');
}

/**
 * Chuyển camel case sang title case
 * VD: 'helloThere' or 'HelloThere' to 'Hello There'
 * @param {string} str
 */
export function convertCamelCaseToTitleCase(str) {
    if (!str) {
        return '';
    }

    const result = str.replace(/([A-Z])/g, ' $1');
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);

    return finalResult;
}
