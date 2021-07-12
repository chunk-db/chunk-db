import { Container, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { ReactNodeArray } from 'react';

interface IProps {
    children: ReactNodeArray;
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(1),
    },
    title: {
        flexGrow: 1,
    },
    panels: {},
    panel: {},
    paper: {
        padding: theme.spacing(1),
    },
}));

export const Panels = ({ children }: IProps) => {
    const classes = useStyles();
    return (
        <Container maxWidth="md">
            <Container className={classes.panels} maxWidth="xl">
                <Grid container spacing={2}>
                    {children.map((panel, index) => (
                        <Grid key={index} item xs={12} md={6}>
                            <Paper className={classes.paper}>{panel}</Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Container>
    );
};
