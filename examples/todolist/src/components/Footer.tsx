import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    footer: {
        padding: theme.spacing(1),
    },
}));

export const Footer = () => {
    const classes = useStyles();

    return (
        <footer className={classes.footer}>
            <Typography variant="subtitle1" component="p" align="center" color="textSecondary">
                Arswarog &copy; 2020
            </Typography>
        </footer>
    );
};
