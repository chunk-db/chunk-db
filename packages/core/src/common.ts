export function delay(timeout = 0): Promise<any> {
    return new Promise<void>(resolve => setTimeout(resolve, timeout));
}
