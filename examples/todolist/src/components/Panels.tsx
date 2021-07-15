import { Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { ReactNodeArray } from 'react';

interface IProps {
    children: ReactNodeArray;
}

const useStyles = makeStyles(theme => ({
    panels: {},
    panel: {},
    paper: {
        padding: theme.spacing(1),
    },
}));

export const Panels = ({ children }: IProps) => {
    const classes = useStyles();
    return (
        <Grid container spacing={2} className={classes.panels}>
            {children.map((panel, index) => (
                <Grid key={index} item xs={12} md={6}>
                    <Paper className={classes.paper}>{panel}</Paper>
                </Grid>
            ))}
        </Grid>
    );
};
