export type Param = string;

const prefix = '$parameter$';
const prefixLength = prefix.length;
const paramRegexp = /^[^\d\W]\w*$/;

export function param(strings: TemplateStringsArray | string) {
    let paramName: string;
    if (typeof strings === 'string') {
        paramName = strings;
    } else {
        paramName = strings[0];
        if (strings.length !== 1) throw new Error(`Invalid parameter "${strings.raw}"`);
    }
    if (!paramRegexp.test(paramName)) throw new Error(`Invalid parameter "${strings}"`);
    return prefix + paramName;
}

export function isParam(value: Param): value is Param {
    return value.substr(0, prefixLength) === prefix;
}

export function getParam(value: Param): string {
    if (!isParam(value)) {
        throw new Error(`Value "${value}" is not parameter`);
    }
    return value.substr(prefixLength);
}

export function applyParams(obj: any, params: Record<string, any>): any {
    if (!obj) return obj;
    if (typeof obj === 'object') {
        const res: Record<string, any> = {};
        Object.keys(obj).forEach(key => (res[key] = applyParams(obj[key], params)));
        return res;
    }

    if (isParam(obj)) return params[getParam(obj)] || obj;
    return obj;
}
