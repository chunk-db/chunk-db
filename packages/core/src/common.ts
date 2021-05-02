import { Subscription } from './common.types';

export function delay(timeout = 0): Promise<any> {
    return new Promise<void>(resolve => setTimeout(resolve, timeout));
}

export function makeSubscription(unsubscribe: () => void): Subscription {
    const result = unsubscribe as Subscription;
    result.unsubscribe = unsubscribe;
    return result;
}
