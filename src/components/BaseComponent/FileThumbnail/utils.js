import icExcel from '~/assets/icons/ic_excel.svg';
import icImg from '~/assets/icons/ic_img.svg';
import icWord from '~/assets/icons/ic_word.svg';
import icPdf from '~/assets/icons/ic_pdf.svg';
import icFolder from '~/assets/icons/ic_folder.svg';
import icFile from '~/assets/icons/ic_file.svg';
import { getFileTypeByUrl } from '~/utils/common/utils';

const FORMAT_PDF = ['pdf'];
const FORMAT_WORD = ['doc', 'docx'];
const FORMAT_EXCEL = ['xls', 'xlsx'];
const FORMAT_IMG = ['jpg', 'jpeg', 'gif', 'bmp', 'png', 'svg'];

export function getFileFormat(fileUrl) {
    let format;
    switch (fileUrl?.includes(getFileTypeByUrl(fileUrl))) {
        case FORMAT_IMG.includes(getFileTypeByUrl(fileUrl)):
            format = 'image';
            break;
        case FORMAT_EXCEL.includes(getFileTypeByUrl(fileUrl)):
            format = 'excel';
            break;
        case FORMAT_WORD.includes(getFileTypeByUrl(fileUrl)):
            format = 'word';
            break;
        case FORMAT_PDF.includes(getFileTypeByUrl(fileUrl)):
            format = 'pdf';
            break;
        default:
            format = getFileTypeByUrl(fileUrl);
    }

    return format;
}

export function getFileThumb(fileUrl) {
    let thumb;
    switch (getFileFormat(fileUrl)) {
        case 'folder':
            thumb = icFolder;
            break;
        case 'image':
            thumb = icImg;
            break;
        case 'excel':
            thumb = icExcel;
            break;
        case 'word':
            thumb = icWord;
            break;
        case 'pdf':
            thumb = icPdf;
            break;
        default:
            thumb = icFile;
            break;
    }
    return thumb;
}
