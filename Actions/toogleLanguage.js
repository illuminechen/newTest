import { LANGUAGE_TW, LANGUAGE_EN } from './constants';
export function toggleLanguage(text) {
    //console.log('toggleLanguage', text)

    if (text === 'en') {
        return {
            type: LANGUAGE_EN
        }
    } else {
        return {
            type: LANGUAGE_TW
        }
    }
}