import { REFRESH_TODOS } from './constants';

export function refreshProp(flag) {
    return {
        type: REFRESH_TODOS,
        data: flag,
    }
}