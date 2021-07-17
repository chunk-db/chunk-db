import { createContext } from 'react';

import { IConfirmProps } from './ConfirmDialog';

export interface IModalContext {
    confirm(title: string, props?: Omit<IConfirmProps, 'open' | 'title'>): Promise<void>;
}

export const ModalContext = createContext<IModalContext>({
    confirm(): Promise<void> {
        throw new Error('Please use this function in right context');
    },
});
