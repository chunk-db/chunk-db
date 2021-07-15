import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ReactNode } from 'react';

interface IProps {
    children: ReactNode;
}

const useStyles = makeStyles(theme => ({
    main: {
        position: 'relative',
        padding: 0,
        [theme.breakpoints.down('md')]: {
            marginTop: theme.spacing(8),
        },
        [theme.breakpoints.up('sm')]: {
            marginTop: theme.spacing(9),
        },
    },
}));

export const Main = ({ children }: IProps) => {
    const classes = useStyles();
    return (
        <Container fixed className={classes.main} maxWidth="md" component="main">
            {children}
        </Container>
    );
};
