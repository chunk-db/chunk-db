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
