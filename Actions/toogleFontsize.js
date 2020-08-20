import { FONTSIZE_SMALL, FONTSIZE_MEDIUM, FONTSIZE_LARGE, FONTSIZE_XLARGE } from './constants'
export function toogleFontsize(text) {
    if (text === 'small') {
        return {
            type: FONTSIZE_SMALL
        }
    } else if (text === 'medium') {
        return {
            type: FONTSIZE_MEDIUM
        }
    } else if (text === 'large') {
        return {
            type: FONTSIZE_LARGE
        }
    } else {
        return {
            type: FONTSIZE_XLARGE
        }
    }
}
