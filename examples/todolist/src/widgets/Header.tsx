import { AppBar, Button, Container, Toolbar } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';

const useStyles = makeStyles(theme => ({
    root: {},
    menuButton: {
        marginRight: theme.spacing(1),
    },
    title: {
        flexGrow: 1,
    },
}));

export const Header = () => {
    const classes = useStyles();
    return (
        <AppBar position="fixed">
            <Container fixed>
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography className={classes.title}>Chunk DB</Typography>
                    <Box mr={2}>
                        <Button color="inherit" variant="outlined" href="https://chunk-db.github.io">
                            Docs
                        </Button>
                    </Box>
                    <Box mr={2}>
                        <Button color="inherit" variant="outlined" href="https://github.com/chunk-db/chunk-db">
                            Github
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
