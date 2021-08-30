export function getFieldByPath(path: string[] | string) {
    const pathArray = Array.isArray(path) ? path : path.split('.');

    return (obj: any) => {
        let tmp = obj;
        for (let i = 0; i < pathArray.length; i++) {
            if (typeof tmp !== 'object' || !tmp) return undefined;

            const field = pathArray[i];
            if (field in tmp) tmp = tmp[field];
            else return undefined;
        }
        return tmp;
    };
}

/**
 * Check recursive what object contains only boolean, number or string
 * @param target
 */
export function isSerializable(target: any, topMustBeObject = false): boolean {
    if (target === null || target === undefined || typeof target === 'function') return false;
    if (topMustBeObject && typeof target !== 'object') return false;

    if (typeof target === 'boolean') return true;
    if (typeof target === 'number') return Number.isFinite(target);
    if (typeof target === 'string') return true;

    if (typeof target === 'object') {
        return Object.keys(target).every(key => isSerializable(target[key]));
    }
    return false;
}
