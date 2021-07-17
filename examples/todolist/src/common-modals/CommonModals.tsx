import { ReactNode, useState } from 'react';

import { ConfirmDialog, IConfirmProps } from './ConfirmDialog';
import { ModalContext } from './ModalContext';

export const CommonModals = ({ children }: { children: ReactNode }) => {
    const [confirmProps, setConfirmProps] = useState<IConfirmProps | null>(null);

    function confirm(title: string, props?: Omit<IConfirmProps, 'open' | 'title'>): Promise<void> {
        return new Promise((resolve, reject) =>
            setConfirmProps({
                ...props,
                title,
                open: true,
                onAgree() {
                    setConfirmProps(null);
                    resolve();
                },
                onDisagree() {
                    setConfirmProps(null);
                    reject();
                },
            })
        );
    }

    const context = {
        confirm,
    };

    return (
        <ModalContext.Provider value={context}>
            {children}
            <ConfirmDialog open={!!confirmProps} {...confirmProps} />
        </ModalContext.Provider>
    );
};
