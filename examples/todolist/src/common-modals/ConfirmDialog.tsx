import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';

export interface IConfirmProps {
    open: boolean;
    title: string;
    text?: string;
    agreeText?: string;
    disagreeText?: string;
    onAgree?: () => void;
    onDisagree?: () => void;
}

export const ConfirmDialog = ({ open, title, text, agreeText, disagreeText, onAgree, onDisagree }: IConfirmProps) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    agreeText = agreeText || 'Ok';
    disagreeText = disagreeText || 'Cancel';

    return (
        <Dialog fullScreen={fullScreen} open={open} onClose={onDisagree} aria-labelledby="responsive-dialog-title">
            <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
            {title && (
                <DialogContent>
                    <DialogContentText>{text}</DialogContentText>
                </DialogContent>
            )}
            <DialogActions>
                <Button autoFocus onClick={onDisagree} color="primary">
                    {disagreeText}
                </Button>
                <Button onClick={onAgree} color="primary" autoFocus>
                    {agreeText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
