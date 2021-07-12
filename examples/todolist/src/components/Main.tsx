import { makeStyles } from '@material-ui/core/styles';
import { ReactNode } from 'react';

interface IProps {
    children: ReactNode;
}

const useStyles = makeStyles(theme => ({
    main: {
        position: 'relative',
        marginTop: theme.spacing(9),
    },
}));
export const Main = ({ children }: IProps) => {
    const classes = useStyles();
    return <main className={classes.main}>{children}</main>;
};
