import http from '~/utils/httpRequest';

export const textToSpeech = (text) => {
    return http.get('helper/tts', { params: { text } });
};

export const textToSpeechStream = (text) => {
    return http.get('helper/tts/stream', { params: { text } });
};

export const translate = (text) => {
    return http.get('helper/translate', { params: { text } });
};

export const getWordsApiResult = (word) => {
    return http.get('helper/wordsapi', { params: { word } });
};

export const getFreeDictionaryApiResult = (word) => {
    return http.get('helper/freedictionaryapi', { params: { word } });
};