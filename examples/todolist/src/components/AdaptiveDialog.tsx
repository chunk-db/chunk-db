import { Dialog, DialogTitle, useMediaQuery, useTheme } from '@material-ui/core';
import { ReactNode } from 'react';

interface IProps {
    open: boolean;
    title: string;
    children: ReactNode;
    onClose?: () => void;
}

export const AdaptiveDialog = ({ open, title, children, onClose }: IProps) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog fullScreen={fullScreen} open={open} onClose={onClose} aria-labelledby="responsive-dialog-title">
            <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
            {children}
        </Dialog>
    );
};
